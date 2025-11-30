import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getEmployeeDashboard } from '../../store/slices/dashboardSlice';
import { getTodayStatus } from '../../store/slices/attendanceSlice';
import { checkIn, checkOut } from '../../store/slices/attendanceSlice';
import { format } from 'date-fns';
import './Dashboard.css';

const EmployeeDashboard = () => {
  const dispatch = useDispatch();
  const { employeeData, loading } = useSelector((state) => state.dashboard);
  const { todayStatus } = useSelector((state) => state.attendance);

  useEffect(() => {
    dispatch(getEmployeeDashboard());
    dispatch(getTodayStatus());
  }, [dispatch]);

  const handleCheckIn = () => {
    dispatch(checkIn()).then(() => {
      dispatch(getTodayStatus());
      dispatch(getEmployeeDashboard());
    });
  };

  const handleCheckOut = () => {
    dispatch(checkOut()).then(() => {
      dispatch(getTodayStatus());
      dispatch(getEmployeeDashboard());
    });
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="container">
      <h1>Employee Dashboard</h1>

      <div className="dashboard-grid">
        <div className="card">
          <h3>Today's Status</h3>
          <div className="status-info">
            <p>
              <strong>Status:</strong>{' '}
              <span className={`badge badge-${todayStatus?.status === 'present' ? 'success' : todayStatus?.status === 'late' ? 'warning' : 'danger'}`}>
                {todayStatus?.status || 'Not Checked In'}
              </span>
            </p>
            {todayStatus?.checkInTime && (
              <p>
                <strong>Check In:</strong>{' '}
                {format(new Date(todayStatus.checkInTime), 'HH:mm:ss')}
              </p>
            )}
            {todayStatus?.checkOutTime && (
              <p>
                <strong>Check Out:</strong>{' '}
                {format(new Date(todayStatus.checkOutTime), 'HH:mm:ss')}
              </p>
            )}
            {todayStatus?.totalHours && (
              <p>
                <strong>Total Hours:</strong> {todayStatus.totalHours} hrs
              </p>
            )}
          </div>
          <div className="attendance-actions">
            {!todayStatus?.checkedIn && (
              <button onClick={handleCheckIn} className="btn btn-success">
                Check In
              </button>
            )}
            {todayStatus?.checkedIn && !todayStatus?.checkedOut && (
              <button onClick={handleCheckOut} className="btn btn-danger">
                Check Out
              </button>
            )}
          </div>
        </div>

        {employeeData && (
          <>
            <div className="card">
              <h3>This Month's Summary</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-value">{employeeData.monthStats.present}</div>
                  <div className="stat-label">Present</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{employeeData.monthStats.absent}</div>
                  <div className="stat-label">Absent</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{employeeData.monthStats.late}</div>
                  <div className="stat-label">Late</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{employeeData.monthStats.totalHours}</div>
                  <div className="stat-label">Total Hours</div>
                </div>
              </div>
            </div>

            <div className="card">
              <h3>Recent Attendance (Last 7 Days)</h3>
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {employeeData.recentAttendance.map((att, idx) => (
                    <tr key={idx}>
                      <td>{format(new Date(att.date), 'MMM dd, yyyy')}</td>
                      <td>
                        <span className={`badge badge-${att.status === 'present' ? 'success' : att.status === 'late' ? 'warning' : 'danger'}`}>
                          {att.status}
                        </span>
                      </td>
                      <td>{att.checkInTime ? format(new Date(att.checkInTime), 'HH:mm') : '-'}</td>
                      <td>{att.checkOutTime ? format(new Date(att.checkOutTime), 'HH:mm') : '-'}</td>
                      <td>{att.totalHours || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        <div className="card">
          <h3>Quick Actions</h3>
          <div className="quick-actions">
            <Link to="/mark-attendance" className="btn btn-primary">
              Mark Attendance
            </Link>
            <Link to="/my-attendance" className="btn btn-secondary">
              View My Attendance
            </Link>
            <Link to="/profile" className="btn btn-secondary">
              My Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;


