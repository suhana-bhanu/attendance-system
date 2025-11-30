import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllAttendance } from '../../store/slices/attendanceSlice';
import { format } from 'date-fns';

const AllAttendance = () => {
  const dispatch = useDispatch();
  const { allAttendance, loading } = useSelector((state) => state.attendance);
  const [filters, setFilters] = useState({
    employeeId: '',
    date: '',
    status: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    dispatch(getAllAttendance(filters));
  }, [dispatch]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleApplyFilters = () => {
    dispatch(getAllAttendance(filters));
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      employeeId: '',
      date: '',
      status: '',
      startDate: '',
      endDate: '',
    };
    setFilters(clearedFilters);
    dispatch(getAllAttendance(clearedFilters));
  };

  return (
    <div className="container">
      <h1>All Employees Attendance</h1>

      <div className="card">
        <h3>Filters</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <div className="form-group">
            <label>Employee ID</label>
            <input
              type="text"
              name="employeeId"
              value={filters.employeeId}
              onChange={handleFilterChange}
              placeholder="e.g., EMP001"
            />
          </div>
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
            />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">All</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
              <option value="half-day">Half Day</option>
            </select>
          </div>
          <div className="form-group">
            <label>Start Date</label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
            />
          </div>
          <div className="form-group">
            <label>End Date</label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
            />
          </div>
        </div>
        <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
          <button onClick={handleApplyFilters} className="btn btn-primary">
            Apply Filters
          </button>
          <button onClick={handleClearFilters} className="btn btn-secondary">
            Clear Filters
          </button>
        </div>
      </div>

      <div className="card">
        <h3>Attendance Records</h3>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Status</th>
                <th>Total Hours</th>
              </tr>
            </thead>
            <tbody>
              {allAttendance.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center' }}>
                    No attendance records found
                  </td>
                </tr>
              ) : (
                allAttendance.map((att, idx) => (
                  <tr key={idx}>
                    <td>{format(new Date(att.date), 'MMM dd, yyyy')}</td>
                    <td>{att.userId?.employeeId || '-'}</td>
                    <td>{att.userId?.name || '-'}</td>
                    <td>{att.userId?.department || '-'}</td>
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
                    <td>{att.totalHours || 0}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AllAttendance;


