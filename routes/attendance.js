const express = require('express');
const Attendance = require('../models/Attendance');
const User = require('../models/User');
const { auth, managerAuth } = require('../middleware/auth');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Helper function to calculate hours
const calculateHours = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  const diff = checkOut - checkIn;
  return (diff / (1000 * 60 * 60)).toFixed(2);
};

// Helper function to determine status
const determineStatus = (checkInTime) => {
  if (!checkInTime) return 'absent';
  const checkInHour = new Date(checkInTime).getHours();
  const checkInMinute = new Date(checkInTime).getMinutes();
  // Consider late if check-in is after 9:30 AM
  if (checkInHour > 9 || (checkInHour === 9 && checkInMinute > 30)) {
    return 'late';
  }
  return 'present';
};

// @route   POST /api/attendance/checkin
// @desc    Check in
// @access  Private (Employee)
router.post('/checkin', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already checked in today
    let attendance = await Attendance.findOne({
      userId: req.user._id,
      date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
    });

    if (attendance && attendance.checkInTime) {
      return res.status(400).json({ message: 'Already checked in today' });
    }

    const checkInTime = new Date();
    const status = determineStatus(checkInTime);

    if (attendance) {
      attendance.checkInTime = checkInTime;
      attendance.status = status;
    } else {
      attendance = new Attendance({
        userId: req.user._id,
        date: today,
        checkInTime: checkInTime,
        status: status
      });
    }

    await attendance.save();
    res.json({ message: 'Checked in successfully', attendance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/attendance/checkout
// @desc    Check out
// @access  Private (Employee)
router.post('/checkout', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      userId: req.user._id,
      date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
    });

    if (!attendance || !attendance.checkInTime) {
      return res.status(400).json({ message: 'Please check in first' });
    }

    if (attendance.checkOutTime) {
      return res.status(400).json({ message: 'Already checked out today' });
    }

    const checkOutTime = new Date();
    attendance.checkOutTime = checkOutTime;
    attendance.totalHours = parseFloat(calculateHours(attendance.checkInTime, checkOutTime));

    // Update status to half-day if less than 4 hours
    if (attendance.totalHours < 4) {
      attendance.status = 'half-day';
    }

    await attendance.save();
    res.json({ message: 'Checked out successfully', attendance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/attendance/today
// @desc    Get today's attendance status
// @access  Private (Employee)
router.get('/today', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      userId: req.user._id,
      date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
    });

    if (!attendance) {
      return res.json({ 
        checkedIn: false, 
        checkedOut: false,
        status: 'absent'
      });
    }

    res.json({
      checkedIn: !!attendance.checkInTime,
      checkedOut: !!attendance.checkOutTime,
      checkInTime: attendance.checkInTime,
      checkOutTime: attendance.checkOutTime,
      status: attendance.status,
      totalHours: attendance.totalHours
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/attendance/my-history
// @desc    Get my attendance history
// @access  Private (Employee)
router.get('/my-history', auth, async (req, res) => {
  try {
    const { month, year } = req.query;
    let query = { userId: req.user._id };

    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);
      query.date = { $gte: startDate, $lte: endDate };
    }

    const attendance = await Attendance.find(query)
      .sort({ date: -1 })
      .limit(100);

    res.json(attendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/attendance/my-summary
// @desc    Get monthly summary
// @access  Private (Employee)
router.get('/my-summary', auth, async (req, res) => {
  try {
    const { month, year } = req.query;
    const currentDate = new Date();
    const targetMonth = month || currentDate.getMonth() + 1;
    const targetYear = year || currentDate.getFullYear();

    const startDate = new Date(targetYear, targetMonth - 1, 1);
    const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59);

    const attendance = await Attendance.find({
      userId: req.user._id,
      date: { $gte: startDate, $lte: endDate }
    });

    const present = attendance.filter(a => a.status === 'present').length;
    const absent = attendance.filter(a => a.status === 'absent').length;
    const late = attendance.filter(a => a.status === 'late').length;
    const halfDay = attendance.filter(a => a.status === 'half-day').length;
    const totalHours = attendance.reduce((sum, a) => sum + (a.totalHours || 0), 0);

    res.json({
      present,
      absent,
      late,
      halfDay,
      totalHours: totalHours.toFixed(2),
      totalDays: attendance.length
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/attendance/all
// @desc    Get all employees attendance
// @access  Private (Manager)
router.get('/all', managerAuth, async (req, res) => {
  try {
    const { employeeId, date, status, startDate, endDate } = req.query;
    let query = {};

    if (employeeId) {
      const user = await User.findOne({ employeeId });
      if (user) query.userId = user._id;
    }

    if (date) {
      const targetDate = new Date(date);
      targetDate.setHours(0, 0, 0, 0);
      query.date = { $gte: targetDate, $lt: new Date(targetDate.getTime() + 24 * 60 * 60 * 1000) };
    } else if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59);
      query.date = { $gte: start, $lte: end };
    }

    if (status) {
      query.status = status;
    }

    const attendance = await Attendance.find(query)
      .populate('userId', 'name email employeeId department')
      .sort({ date: -1 })
      .limit(500);

    res.json(attendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/attendance/employee/:id
// @desc    Get specific employee attendance
// @access  Private (Manager)
router.get('/employee/:id', managerAuth, async (req, res) => {
  try {
    const { month, year } = req.query;
    let query = { userId: req.params.id };

    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);
      query.date = { $gte: startDate, $lte: endDate };
    }

    const attendance = await Attendance.find(query)
      .populate('userId', 'name email employeeId department')
      .sort({ date: -1 });

    res.json(attendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/attendance/summary
// @desc    Get team summary
// @access  Private (Manager)
router.get('/summary', managerAuth, async (req, res) => {
  try {
    const { month, year } = req.query;
    const currentDate = new Date();
    const targetMonth = month || currentDate.getMonth() + 1;
    const targetYear = year || currentDate.getFullYear();

    const startDate = new Date(targetYear, targetMonth - 1, 1);
    const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59);

    const attendance = await Attendance.find({
      date: { $gte: startDate, $lte: endDate }
    }).populate('userId', 'name employeeId department');

    const summary = {};
    attendance.forEach(a => {
      const empId = a.userId.employeeId;
      if (!summary[empId]) {
        summary[empId] = {
          employeeId: empId,
          name: a.userId.name,
          department: a.userId.department,
          present: 0,
          absent: 0,
          late: 0,
          halfDay: 0,
          totalHours: 0
        };
      }
      summary[empId][a.status] = (summary[empId][a.status] || 0) + 1;
      summary[empId].totalHours += a.totalHours || 0;
    });

    res.json(Object.values(summary));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/attendance/today-status
// @desc    Get today's attendance status for all employees
// @access  Private (Manager)
router.get('/today-status', managerAuth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.find({
      date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
    }).populate('userId', 'name email employeeId department');

    const allUsers = await User.find({ role: 'employee' });
    const attendanceMap = {};
    attendance.forEach(a => {
      attendanceMap[a.userId._id.toString()] = a;
    });

    const result = allUsers.map(user => {
      const att = attendanceMap[user._id.toString()];
      return {
        userId: user._id,
        name: user.name,
        email: user.email,
        employeeId: user.employeeId,
        department: user.department,
        checkedIn: !!att?.checkInTime,
        checkedOut: !!att?.checkOutTime,
        checkInTime: att?.checkInTime,
        checkOutTime: att?.checkOutTime,
        status: att?.status || 'absent'
      };
    });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/attendance/export
// @desc    Export attendance to CSV
// @access  Private (Manager)
router.get('/export', managerAuth, async (req, res) => {
  try {
    const { startDate, endDate, employeeId } = req.query;
    let query = {};

    if (employeeId) {
      const user = await User.findOne({ employeeId });
      if (user) query.userId = user._id;
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59);
      query.date = { $gte: start, $lte: end };
    }

    const attendance = await Attendance.find(query)
      .populate('userId', 'name email employeeId department')
      .sort({ date: -1 });

    const csvData = attendance.map(a => ({
      Date: new Date(a.date).toLocaleDateString(),
      'Employee ID': a.userId.employeeId,
      Name: a.userId.name,
      Department: a.userId.department,
      'Check In': a.checkInTime ? new Date(a.checkInTime).toLocaleString() : 'N/A',
      'Check Out': a.checkOutTime ? new Date(a.checkOutTime).toLocaleString() : 'N/A',
      Status: a.status,
      'Total Hours': a.totalHours || 0
    }));

    const csvWriter = createCsvWriter({
      path: 'attendance_export.csv',
      header: [
        { id: 'Date', title: 'Date' },
        { id: 'Employee ID', title: 'Employee ID' },
        { id: 'Name', title: 'Name' },
        { id: 'Department', title: 'Department' },
        { id: 'Check In', title: 'Check In' },
        { id: 'Check Out', title: 'Check Out' },
        { id: 'Status', title: 'Status' },
        { id: 'Total Hours', title: 'Total Hours' }
      ]
    });

    await csvWriter.writeRecords(csvData);

    res.download('attendance_export.csv', 'attendance_export.csv', (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Error downloading file' });
      } else {
        // Clean up file after download
        setTimeout(() => {
          if (fs.existsSync('attendance_export.csv')) {
            fs.unlinkSync('attendance_export.csv');
          }
        }, 1000);
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


