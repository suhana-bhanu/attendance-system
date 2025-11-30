import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Calendar from 'react-calendar';
import { getMyHistory, getMySummary } from '../../store/slices/attendanceSlice';
import { format } from 'date-fns';
import 'react-calendar/dist/Calendar.css';
import './MyAttendance.css';

const MyAttendance = () => {
  const dispatch = useDispatch();
  const { myHistory, mySummary, loading } = useSelector((state) => state.attendance);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'table'
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    dispatch(getMyHistory({ month: selectedMonth, year: selectedYear }));
    dispatch(getMySummary({ month: selectedMonth, year: selectedYear }));
  }, [dispatch, selectedMonth, selectedYear]);

  const getTileClassName = ({ date }) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const attendance = myHistory.find(
      (a) => format(new Date(a.date), 'yyyy-MM-dd') === dateStr
    );
    if (attendance) {
      if (attendance.status === 'present') return 'present-day';
      if (attendance.status === 'late') return 'late-day';
      if (attendance.status === 'half-day') return 'halfday-day';
      if (attendance.status === 'absent') return 'absent-day';
    }
    return null;
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    const attendance = myHistory.find(
      (a) => format(new Date(a.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
    if (attendance) {
      alert(
        `Date: ${format(date, 'MMM dd, yyyy')}\n` +
        `Status: ${attendance.status}\n` +
        `Check In: ${attendance.checkInTime ? format(new Date(attendance.checkInTime), 'HH:mm') : 'N/A'}\n` +
        `Check Out: ${attendance.checkOutTime ? format(new Date(attendance.checkOutTime), 'HH:mm') : 'N/A'}\n` +
        `Hours: ${attendance.totalHours || 0}`
      );
    }
  };

  return (
    <div className="container">
      <h1>My Attendance History</h1>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          className="form-group"
          style={{ width: 'auto', padding: '5px' }}
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(2000, i).toLocaleString('default', { month: 'long' })}
            </option>
          ))}
        </select>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          className="form-group"
          style={{ width: 'auto', padding: '5px' }}
        >
          {Array.from({ length: 5 }, (_, i) => {
            const year = new Date().getFullYear() - 2 + i;
            return (
              <option key={year} value={year}>
                {year}
              </option>
            );
          })}
        </select>
        <button
          onClick={() => setViewMode(viewMode === 'calendar' ? 'table' : 'calendar')}
          className="btn btn-secondary"
        >
          {viewMode === 'calendar' ? 'Switch to Table View' : 'Switch to Calendar View'}
        </button>
      </div>

      {mySummary && (
        <div className="card">
          <h3>Monthly Summary</h3>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-label">Present:</span>
              <span className="summary-value">{mySummary.present}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Absent:</span>
              <span className="summary-value">{mySummary.absent}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Late:</span>
              <span className="summary-value">{mySummary.late}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Half Day:</span>
              <span className="summary-value">{mySummary.halfDay}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Total Hours:</span>
              <span className="summary-value">{mySummary.totalHours}</span>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'calendar' ? (
        <div className="card">
          <h3>Calendar View</h3>
          <div className="calendar-container">
            <Calendar
              onChange={handleDateClick}
              value={selectedDate}
              tileClassName={getTileClassName}
              className="attendance-calendar"
            />
            <div className="legend">
              <div className="legend-item">
                <span className="legend-color present-day"></span>
                <span>Present</span>
              </div>
              <div className="legend-item">
                <span className="legend-color late-day"></span>
                <span>Late</span>
              </div>
              <div className="legend-item">
                <span className="legend-color halfday-day"></span>
                <span>Half Day</span>
              </div>
              <div className="legend-item">
                <span className="legend-color absent-day"></span>
                <span>Absent</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="card">
          <h3>Table View</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Status</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Total Hours</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="loading">Loading...</td>
                </tr>
              ) : myHistory.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>No attendance records found</td>
                </tr>
              ) : (
                myHistory.map((att, idx) => (
                  <tr key={idx}>
                    <td>{format(new Date(att.date), 'MMM dd, yyyy')}</td>
                    <td>
                      <span className={`badge badge-${att.status === 'present' ? 'success' : att.status === 'late' ? 'warning' : att.status === 'half-day' ? 'info' : 'danger'}`}>
                        {att.status}
                      </span>
                    </td>
                    <td>{att.checkInTime ? format(new Date(att.checkInTime), 'HH:mm') : '-'}</td>
                    <td>{att.checkOutTime ? format(new Date(att.checkOutTime), 'HH:mm') : '-'}</td>
                    <td>{att.totalHours || 0}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyAttendance;


