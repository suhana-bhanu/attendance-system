# MongoDB Atlas Connection Steps

## Step-by-Step: Getting Your Connection String

### You're Currently At: "Choose a connection method" (Step 2)

### What to Click:

1. **Click on "Connect to your application"** 
   - This is the option with the icon showing binary code (1011)
   - Description says: "Access your Atlas data using MongoDB's native drivers (e.g. Node.js, Go, etc.)"
   - Has a right arrow (→) indicating it's clickable

2. **After clicking, you'll see:**
   - Driver selection dropdown
   - Connection string displayed

3. **Select Driver:**
   - Choose **"Node.js"** from the dropdown
   - Version: Select the latest version (usually 5.5 or higher)

4. **Copy the Connection String:**
   - You'll see a connection string with placeholders
   - Format: `mongodb+srv://<username>:<password>@<cluster>.<region>.mongodb.net/?retryWrites=true&w=majority`
   - **Click "Copy"** button

5. **Important: Replace Placeholders:**
   - Replace `<username>` with your database username (from Database Access)
   - Replace `<password>` with your database password
   - Add database name: Change `?retryWrites=true` to `/attendance_system?retryWrites=true`
   
   **Final format should look like (replace ALL placeholders with YOUR actual values):**
   ```
   mongodb+srv://<your-username>:<your-password>@<your-cluster>.<region>.mongodb.net/attendance_system?retryWrites=true&w=majority
   ```
   
   ⚠️ **SECURITY**: Never commit real credentials to Git! Only use placeholders in documentation.

### Example:
Your connection string from MongoDB Atlas will have placeholders like:
```
mongodb+srv://<username>:<password>@<cluster>.<region>.mongodb.net/?retryWrites=true&w=majority
```

After replacing placeholders and adding database name, it becomes:
```
mongodb+srv://your-username:your-password@your-cluster.your-region.mongodb.net/attendance_system?retryWrites=true&w=majority
```

⚠️ **SECURITY WARNING**: 
- Replace ALL placeholders with your actual values
- Never commit real passwords to Git!
- Only store real credentials in `.env` files or environment variables

### What You'll Use This For:

This connection string goes into:
- **Backend `.env` file**: `MONGODB_URI=your_connection_string_here`
- **Render deployment**: Environment variable `MONGODB_URI`

### Don't Need Right Now:

You can skip these options (they're for different purposes):
- ❌ Compass (GUI tool for browsing data)
- ❌ Shell (command line interface)
- ❌ MongoDB for VS Code (VS Code extension)

**You only need the connection string from "Connect to your application"!**

---

## Quick Checklist:

- [ ] Click "Connect to your application" (Drivers option)
- [ ] Select "Node.js" driver
- [ ] Copy the connection string
- [ ] Replace `<username>` with your actual username
- [ ] Replace `<password>` with your actual password
- [ ] Add `/attendance_system` before the `?` in the connection string
- [ ] Save this connection string - you'll need it for deployment!

---

## Troubleshooting:

**"I don't see the connection string"**
- Make sure you clicked "Connect to your application" (not Compass or Shell)
- Scroll down if needed

**"What if I haven't created a database user yet?"**
- Go to "Database Access" first
- Create a user (see MONGODB_SETUP.md)
- Then come back to this connection page

**"What database name should I use?"**
- Use `attendance_system` (or any name you prefer)
- MongoDB will create it automatically on first connection

