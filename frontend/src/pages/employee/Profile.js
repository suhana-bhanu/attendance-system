import { useSelector } from 'react-redux';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="container">
      <h1>My Profile</h1>
      <div className="card">
        {user && (
          <div>
            <div className="form-group">
              <label>Name</label>
              <input type="text" value={user.name} readOnly />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={user.email} readOnly />
            </div>
            <div className="form-group">
              <label>Employee ID</label>
              <input type="text" value={user.employeeId} readOnly />
            </div>
            <div className="form-group">
              <label>Department</label>
              <input type="text" value={user.department} readOnly />
            </div>
            <div className="form-group">
              <label>Role</label>
              <input type="text" value={user.role} readOnly />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;


