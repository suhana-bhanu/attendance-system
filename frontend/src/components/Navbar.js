import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import './Navbar.css';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          Attendance System
        </Link>
        <div className="navbar-menu">
          {user && (
            <>
              <span className="navbar-user">Welcome, {user.name}</span>
              {user.role === 'employee' && (
                <>
                  <Link to="/dashboard" className="navbar-link">Dashboard</Link>
                  <Link to="/mark-attendance" className="navbar-link">Mark Attendance</Link>
                  <Link to="/my-attendance" className="navbar-link">My Attendance</Link>
                  <Link to="/profile" className="navbar-link">Profile</Link>
                </>
              )}
              {user.role === 'manager' && (
                <>
                  <Link to="/dashboard" className="navbar-link">Dashboard</Link>
                  <Link to="/all-attendance" className="navbar-link">All Attendance</Link>
                  <Link to="/calendar" className="navbar-link">Calendar</Link>
                  <Link to="/reports" className="navbar-link">Reports</Link>
                </>
              )}
              <button onClick={handleLogout} className="btn btn-secondary">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


