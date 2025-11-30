# Employee Attendance System

A comprehensive attendance tracking system built with React, Redux Toolkit, Node.js, Express, and MongoDB.

## Features

### Employee Features
- ✅ Register/Login
- ✅ Mark attendance (Check In / Check Out)
- ✅ View attendance history (calendar or table view)
- ✅ View monthly summary (Present/Absent/Late days)
- ✅ Dashboard with stats

### Manager Features
- ✅ Login
- ✅ View all employees attendance
- ✅ Filter by employee, date, status
- ✅ View team attendance summary
- ✅ Export attendance reports (CSV)
- ✅ Dashboard with team stats
- ✅ Team calendar view

## Tech Stack

- **Frontend**: React 18, Redux Toolkit, React Router, Recharts, React Calendar
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)

## Project Structure

```
tap/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Attendance.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── attendance.js
│   │   └── dashboard.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── employee/
│   │   │   └── manager/
│   │   ├── store/
│   │   │   └── slices/
│   │   ├── utils/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/attendance_system
JWT_SECRET=your_jwt_secret_key_here_change_in_production
NODE_ENV=development
```

4. Make sure MongoDB is running on your system (or update MONGODB_URI to your MongoDB Atlas connection string).

5. Start the backend server:
```bash
npm run dev
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory (optional, defaults to localhost:5000):
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the frontend development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Attendance (Employee)
- `POST /api/attendance/checkin` - Check in
- `POST /api/attendance/checkout` - Check out
- `GET /api/attendance/today` - Get today's status
- `GET /api/attendance/my-history` - Get my attendance history
- `GET /api/attendance/my-summary` - Get monthly summary

### Attendance (Manager)
- `GET /api/attendance/all` - Get all employees attendance
- `GET /api/attendance/employee/:id` - Get specific employee attendance
- `GET /api/attendance/summary` - Get team summary
- `GET /api/attendance/today-status` - Get today's status for all employees
- `GET /api/attendance/export` - Export attendance to CSV

### Dashboard
- `GET /api/dashboard/employee` - Get employee dashboard stats
- `GET /api/dashboard/manager` - Get manager dashboard stats

## Database Schema

### Users Collection
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String ('employee' | 'manager'),
  employeeId: String (unique),
  department: String,
  createdAt: Date
}
```

### Attendance Collection
```javascript
{
  userId: ObjectId (ref: User),
  date: Date,
  checkInTime: Date,
  checkOutTime: Date,
  status: String ('present' | 'absent' | 'late' | 'half-day'),
  totalHours: Number,
  createdAt: Date
}
```

## Usage

### Creating a Manager Account

Managers can be created by registering with `role: 'manager'` in the registration form, or you can manually update a user's role in the database.

### Employee Workflow

1. Register/Login as an employee
2. Go to Dashboard to see today's status
3. Click "Check In" to mark attendance
4. Click "Check Out" when leaving
5. View attendance history in "My Attendance" page
6. Check monthly summary on Dashboard

### Manager Workflow

1. Login as a manager
2. View team dashboard with statistics
3. Check "All Attendance" to see all employee records
4. Use filters to find specific records
5. View "Calendar" for team calendar view
6. Generate and export reports in "Reports" page

## Features Details

### Attendance Status
- **Present**: Checked in before 9:30 AM
- **Late**: Checked in after 9:30 AM
- **Absent**: No check-in recorded
- **Half Day**: Checked out before completing 4 hours

### Calendar View
- Color-coded calendar showing attendance status
- Green: Present
- Yellow: Late
- Orange: Half Day
- Red: Absent

### Reports
- Filter by date range and employee
- Export to CSV format
- View detailed attendance records

## Development

### Running in Development Mode

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm start
```

### Building for Production

Frontend:
```bash
cd frontend
npm run build
```

## Security Notes

- Passwords are hashed using bcrypt
- JWT tokens are used for authentication
- Protected routes require authentication
- Manager routes require manager role

## Troubleshooting

1. **MongoDB Connection Error**: Make sure MongoDB is running and the connection string is correct
2. **CORS Errors**: Ensure backend CORS is configured correctly
3. **Token Expired**: Logout and login again
4. **Port Already in Use**: Change PORT in backend/.env file

## License

This project is open source and available for educational purposes.


