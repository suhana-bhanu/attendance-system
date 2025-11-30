import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getManagerDashboard } from '../../store/slices/dashboardSlice';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

const ManagerDashboard = () => {
  const dispatch = useDispatch();
  const { managerData, loading } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(getManagerDashboard());
  }, [dispatch]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!managerData) {
    return <div className="loading">No data available</div>;
  }

  return (
    <div className="container">
      <h1>Manager Dashboard</h1>

      <div className="dashboard-grid">
        <div className="card">
          <h3>Overview</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-value">{managerData.totalEmployees}</div>
              <div className="stat-label">Total Employees</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{managerData.todayStats.present}</div>
              <div className="stat-label">Present Today</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{managerData.todayStats.absent}</div>
              <div className="stat-label">Absent Today</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{managerData.todayStats.late}</div>
              <div className="stat-label">Late Today</div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3>Weekly Attendance Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={managerData.weeklyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="present" stroke="#28a745" name="Present" />
              <Line type="monotone" dataKey="absent" stroke="#dc3545" name="Absent" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3>Department-wise Attendance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={managerData.departmentWise}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="present" fill="#28a745" name="Present" />
              <Bar dataKey="absent" fill="#dc3545" name="Absent" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3>Absent Employees Today</h3>
          {managerData.absentEmployees.length === 0 ? (
            <p>All employees are present today!</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Department</th>
                </tr>
              </thead>
              <tbody>
                {managerData.absentEmployees.map((emp, idx) => (
                  <tr key={idx}>
                    <td>{emp.employeeId}</td>
                    <td>{emp.name}</td>
                    <td>{emp.department}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;


