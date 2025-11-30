import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Calendar from 'react-calendar';
import { getTodayStatusAll, getAllAttendance } from '../../store/slices/attendanceSlice';
import { format } from 'date-fns';
import 'react-calendar/dist/Calendar.css';
import './Calendar.css';

const ManagerCalendar = () => {
  const dispatch = useDispatch();
  const { todayStatusAll, allAttendance, loading } = useSelector((state) => state.attendance);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('today'); // 'today' or 'date'

  useEffect(() => {
    if (viewMode === 'today') {
      dispatch(getTodayStatusAll());
    }
  }, [dispatch, viewMode]);

  useEffect(() => {
    if (viewMode === 'date') {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      dispatch(getAllAttendance({ date: dateStr }));
    }
  }, [dispatch, selectedDate, viewMode]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setViewMode('date');
  };

  const getAttendanceForDate = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return allAttendance.filter(
      (a) => format(new Date(a.date), 'yyyy-MM-dd') === dateStr
    );
  };

  return (
    <div className="container">
      <h1>Team Calendar View</h1>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button
          onClick={() => setViewMode('today')}
          className={`btn ${viewMode === 'today' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Today's Status
        </button>
        <button
          onClick={() => setViewMode('date')}
          className={`btn ${viewMode === 'date' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Select Date
        </button>
      </div>

      <div className="calendar-layout">
        <div className="card">
          <h3>Calendar</h3>
          <Calendar onChange={handleDateChange} value={selectedDate} />
        </div>

        <div className="card">
          <h3>
            {viewMode === 'today'
              ? "Today's Attendance"
              : `Attendance for ${format(selectedDate, 'MMMM dd, yyyy')}`}
          </h3>
          {loading ? (
            <div className="loading">Loading...</div>
          ) : viewMode === 'today' ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                </tr>
              </thead>
              <tbody>
                {todayStatusAll.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center' }}>
                      No data available
                    </td>
                  </tr>
                ) : (
                  todayStatusAll.map((emp, idx) => (
                    <tr key={idx}>
                      <td>{emp.employeeId}</td>
                      <td>{emp.name}</td>
                      <td>{emp.department}</td>
                      <td>
                        <span
                          className={`badge badge-${
                            emp.status === 'present'
                              ? 'success'
                              : emp.status === 'late'
                              ? 'warning'
                              : 'danger'
                          }`}
                        >
                          {emp.status}
                        </span>
                      </td>
                      <td>
                        {emp.checkInTime
                          ? format(new Date(emp.checkInTime), 'HH:mm')
                          : '-'}
                      </td>
                      <td>
                        {emp.checkOutTime
                          ? format(new Date(emp.checkOutTime), 'HH:mm')
                          : '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                </tr>
              </thead>
              <tbody>
                {getAttendanceForDate(selectedDate).length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center' }}>
                      No attendance records for this date
                    </td>
                  </tr>
                ) : (
                  getAttendanceForDate(selectedDate).map((att, idx) => (
                    <tr key={idx}>
                      <td>{att.userId?.employeeId || '-'}</td>
                      <td>{att.userId?.name || '-'}</td>
                      <td>{att.userId?.department || '-'}</td>
                      <td>
                        <span
                          className={`badge badge-${
                            att.status === 'present'
                              ? 'success'
                              : att.status === 'late'
                              ? 'warning'
                              : att.status === 'half-day'
                              ? 'info'
                              : 'danger'
                          }`}
                        >
                          {att.status}
                        </span>
                      </td>
                      <td>
                        {att.checkInTime
                          ? format(new Date(att.checkInTime), 'HH:mm')
                          : '-'}
                      </td>
                      <td>
                        {att.checkOutTime
                          ? format(new Date(att.checkOutTime), 'HH:mm')
                          : '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerCalendar;


