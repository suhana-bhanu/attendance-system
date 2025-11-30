import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllAttendance, exportAttendance } from '../../store/slices/attendanceSlice';
import { format } from 'date-fns';

const Reports = () => {
  const dispatch = useDispatch();
  const { allAttendance, loading } = useSelector((state) => state.attendance);
  const [filters, setFilters] = useState({
    employeeId: '',
    startDate: '',
    endDate: '',
  });

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleGenerateReport = () => {
    dispatch(getAllAttendance(filters));
  };

  const handleExport = () => {
    dispatch(exportAttendance(filters));
  };

  return (
    <div className="container">
      <h1>Attendance Reports</h1>

      <div className="card">
        <h3>Report Filters</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
          <div className="form-group">
            <label>Employee ID (Leave empty for all)</label>
            <input
              type="text"
              name="employeeId"
              value={filters.employeeId}
              onChange={handleFilterChange}
              placeholder="e.g., EMP001"
            />
          </div>
          <div className="form-group">
            <label>Start Date</label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              required
            />
          </div>
          <div className="form-group">
            <label>End Date</label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              required
            />
          </div>
        </div>
        <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
          <button onClick={handleGenerateReport} className="btn btn-primary">
            Generate Report
          </button>
          <button
            onClick={handleExport}
            className="btn btn-success"
            disabled={!filters.startDate || !filters.endDate}
          >
            Export to CSV
          </button>
        </div>
      </div>

      <div className="card">
        <h3>Report Data</h3>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            <p style={{ marginBottom: '15px' }}>
              <strong>Total Records:</strong> {allAttendance.length}
            </p>
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
                      No records found. Please generate a report.
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
          </>
        )}
      </div>
    </div>
  );
};

export default Reports;


