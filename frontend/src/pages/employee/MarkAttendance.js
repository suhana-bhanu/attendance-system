import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getTodayStatus, checkIn, checkOut, clearError } from '../../store/slices/attendanceSlice';
import { format } from 'date-fns';

const MarkAttendance = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { todayStatus, loading, error } = useSelector((state) => state.attendance);

  useEffect(() => {
    dispatch(getTodayStatus());
  }, [dispatch]);

  const handleCheckIn = async () => {
    const result = await dispatch(checkIn());
    if (checkIn.fulfilled.match(result)) {
      dispatch(getTodayStatus());
      alert('Checked in successfully!');
    }
  };

  const handleCheckOut = async () => {
    const result = await dispatch(checkOut());
    if (checkOut.fulfilled.match(result)) {
      dispatch(getTodayStatus());
      alert('Checked out successfully!');
    }
  };

  return (
    <div className="container">
      <h1>Mark Attendance</h1>
      {error && (
        <div className="error" onClick={() => dispatch(clearError())}>
          {error}
        </div>
      )}

      <div className="card">
        <h2>Today: {format(new Date(), 'MMMM dd, yyyy')}</h2>
        
        <div style={{ marginTop: '20px' }}>
          <p>
            <strong>Current Status:</strong>{' '}
            <span className={`badge badge-${todayStatus?.status === 'present' ? 'success' : todayStatus?.status === 'late' ? 'warning' : 'danger'}`}>
              {todayStatus?.status || 'Not Checked In'}
            </span>
          </p>
          
          {todayStatus?.checkInTime && (
            <p style={{ marginTop: '10px' }}>
              <strong>Check In Time:</strong>{' '}
              {format(new Date(todayStatus.checkInTime), 'HH:mm:ss')}
            </p>
          )}
          
          {todayStatus?.checkOutTime && (
            <p style={{ marginTop: '10px' }}>
              <strong>Check Out Time:</strong>{' '}
              {format(new Date(todayStatus.checkOutTime), 'HH:mm:ss')}
            </p>
          )}
          
          {todayStatus?.totalHours && (
            <p style={{ marginTop: '10px' }}>
              <strong>Total Hours:</strong> {todayStatus.totalHours} hrs
            </p>
          )}
        </div>

        <div style={{ marginTop: '30px', display: 'flex', gap: '10px' }}>
          {!todayStatus?.checkedIn && (
            <button
              onClick={handleCheckIn}
              className="btn btn-success"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Check In'}
            </button>
          )}
          
          {todayStatus?.checkedIn && !todayStatus?.checkedOut && (
            <button
              onClick={handleCheckOut}
              className="btn btn-danger"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Check Out'}
            </button>
          )}
          
          {todayStatus?.checkedIn && todayStatus?.checkedOut && (
            <p className="success">You have completed your attendance for today!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarkAttendance;


