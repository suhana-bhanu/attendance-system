# Quick Setup Guide

## Backend Environment Variables

Create a file named `.env` in the `backend` directory with the following content:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/attendance_system
JWT_SECRET=your_jwt_secret_key_here_change_in_production
NODE_ENV=development
```

**Note**: 
- For MongoDB Atlas, use the connection string format:
  ```
  mongodb+srv://<username>:<password>@<cluster>.<region>.mongodb.net/attendance_system
  ```
  - Replace ALL placeholders (`<username>`, `<password>`, `<cluster>`, `<region>`) with your actual MongoDB Atlas values
  - Get your connection string from MongoDB Atlas dashboard → Connect → Connect your application
  - ⚠️ **NEVER commit real credentials to Git!** Only use in `.env` files or environment variables
- Change `JWT_SECRET` to a strong random string in production

## Frontend Environment Variables (Optional)

Create a file named `.env` in the `frontend` directory if you need to change the API URL:

```
REACT_APP_API_URL=http://localhost:5000/api
```

## Quick Start

1. **Start MongoDB** (if using local MongoDB)

2. **Start Backend**:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. **Start Frontend** (in a new terminal):
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. Open `http://localhost:3000` in your browser

## First User

Register a new user through the registration page. To create a manager:
- Register normally, then manually update the database to set `role: 'manager'`
- Or modify the registration endpoint to allow role selection (for development only)


