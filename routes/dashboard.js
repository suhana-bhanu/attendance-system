const express = require('express');
const Attendance = require('../models/Attendance');
const User = require('../models/User');
const { auth, managerAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/dashboard/employee
// @desc    Get employee dashboard stats
// @access  Private (Employee)
router.get('/employee', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Today's status
    const todayAttendance = await Attendance.findOne({
      userId: req.user._id,
      date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
    });

    // Current month stats
    const currentMonth = new Date();
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0, 23, 59, 59);

    const monthAttendance = await Attendance.find({
      userId: req.user._id,
      date: { $gte: startOfMonth, $lte: endOfMonth }
    });

    const present = monthAttendance.filter(a => a.status === 'present').length;
    const absent = monthAttendance.filter(a => a.status === 'absent').length;
    const late = monthAttendance.filter(a => a.status === 'late').length;
    const totalHours = monthAttendance.reduce((sum, a) => sum + (a.totalHours || 0), 0);

    // Recent attendance (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const recentAttendance = await Attendance.find({
      userId: req.user._id,
      date: { $gte: sevenDaysAgo }
    }).sort({ date: -1 }).limit(7);

    res.json({
      todayStatus: {
        checkedIn: !!todayAttendance?.checkInTime,
        checkedOut: !!todayAttendance?.checkOutTime,
        status: todayAttendance?.status || 'absent',
        checkInTime: todayAttendance?.checkInTime,
        checkOutTime: todayAttendance?.checkOutTime
      },
      monthStats: {
        present,
        absent,
        late,
        totalHours: totalHours.toFixed(2)
      },
      recentAttendance: recentAttendance.map(a => ({
        date: a.date,
        status: a.status,
        checkInTime: a.checkInTime,
        checkOutTime: a.checkOutTime,
        totalHours: a.totalHours
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/dashboard/manager
// @desc    Get manager dashboard stats
// @access  Private (Manager)
router.get('/manager', managerAuth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Total employees
    const totalEmployees = await User.countDocuments({ role: 'employee' });

    // Today's attendance
    const todayAttendance = await Attendance.find({
      date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
    }).populate('userId', 'name employeeId department');

    const presentToday = todayAttendance.filter(a => a.status === 'present' || a.status === 'late').length;
    const absentToday = totalEmployees - presentToday;
    const lateToday = todayAttendance.filter(a => a.status === 'late').length;

    // Weekly attendance trend (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const weeklyAttendance = await Attendance.find({
      date: { $gte: sevenDaysAgo }
    });

    const weeklyTrend = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const nextDate = new Date(date.getTime() + 24 * 60 * 60 * 1000);

      const dayAttendance = weeklyAttendance.filter(a => {
        const attDate = new Date(a.date);
        return attDate >= date && attDate < nextDate;
      });

      weeklyTrend.push({
        date: date.toISOString().split('T')[0],
        present: dayAttendance.filter(a => a.status === 'present' || a.status === 'late').length,
        absent: dayAttendance.filter(a => a.status === 'absent').length
      });
    }

    // Department-wise attendance
    const allUsers = await User.find({ role: 'employee' });
    const departmentStats = {};
    
    allUsers.forEach(user => {
      if (!departmentStats[user.department]) {
        departmentStats[user.department] = { total: 0, present: 0 };
      }
      departmentStats[user.department].total++;
    });

    todayAttendance.forEach(att => {
      if (att.userId && att.status !== 'absent') {
        const dept = att.userId.department;
        if (departmentStats[dept]) {
          departmentStats[dept].present++;
        }
      }
    });

    const departmentWise = Object.keys(departmentStats).map(dept => ({
      department: dept,
      total: departmentStats[dept].total,
      present: departmentStats[dept].present,
      absent: departmentStats[dept].total - departmentStats[dept].present
    }));

    // Absent employees today
    const allEmployeeIds = allUsers.map(u => u._id.toString());
    const presentEmployeeIds = todayAttendance
      .filter(a => a.status !== 'absent')
      .map(a => a.userId._id.toString());
    const absentEmployeeIds = allEmployeeIds.filter(id => !presentEmployeeIds.includes(id));
    
    const absentEmployees = await User.find({
      _id: { $in: absentEmployeeIds }
    }).select('name email employeeId department');

    res.json({
      totalEmployees,
      todayStats: {
        present: presentToday,
        absent: absentToday,
        late: lateToday
      },
      weeklyTrend,
      departmentWise,
      absentEmployees: absentEmployees.map(emp => ({
        name: emp.name,
        email: emp.email,
        employeeId: emp.employeeId,
        department: emp.department
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


