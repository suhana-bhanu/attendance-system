import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getMe } from './store/slices/authSlice';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';

// Employee Pages
import Login from './pages/Login';
import Register from './pages/Register';
import EmployeeDashboard from './pages/employee/Dashboard';
import MarkAttendance from './pages/employee/MarkAttendance';
import MyAttendance from './pages/employee/MyAttendance';
import Profile from './pages/employee/Profile';

// Manager Pages
import ManagerDashboard from './pages/manager/Dashboard';
import AllAttendance from './pages/manager/AllAttendance';
import Calendar from './pages/manager/Calendar';
import Reports from './pages/manager/Reports';

function App() {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(getMe());
    }
  }, [token, dispatch]);

  const DashboardComponent = () => {
    return user?.role === 'manager' ? <ManagerDashboard /> : <EmployeeDashboard />;
  };

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardComponent />
            </PrivateRoute>
          }
        />
        <Route
          path="/mark-attendance"
          element={
            <PrivateRoute requiredRole="employee">
              <MarkAttendance />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-attendance"
          element={
            <PrivateRoute requiredRole="employee">
              <MyAttendance />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute requiredRole="employee">
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/all-attendance"
          element={
            <PrivateRoute requiredRole="manager">
              <AllAttendance />
            </PrivateRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <PrivateRoute requiredRole="manager">
              <Calendar />
            </PrivateRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <PrivateRoute requiredRole="manager">
              <Reports />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
}

export default App;

