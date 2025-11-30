# Fix Render Deployment Error

## Error You're Seeing:
```
Service Root Directory "/opt/render/project/src/backend" is missing.
cd: /opt/render/project/src/backend: No such file or directory
```

## Solution: Fix Render Settings

### Option 1: Set Root Directory Correctly (Recommended)

1. **Go to your Render Dashboard**
   - Open your web service
   - Click "Settings" tab

2. **Update Root Directory:**
   - Find "Root Directory" field
   - Change it to: `backend`
   - (NOT `/backend` or `./backend`, just `backend`)

3. **Verify Build & Start Commands:**
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - (These should work from the backend directory)

4. **Save Changes** → Render will redeploy automatically

### Option 2: If Root Directory Option Doesn't Work

1. **Keep Root Directory Empty** (or set to `/`)
2. **Update Build Command to:**
   ```
   cd backend && npm install
   ```
3. **Update Start Command to:**
   ```
   cd backend && npm start
   ```

### Option 3: Check Repository Structure

Make sure your GitHub repo has this structure:
```
attendance-system/
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── models/
│   ├── routes/
│   └── middleware/
├── frontend/
│   ├── src/
│   ├── package.json
│   └── public/
└── README.md
```

**Verify on GitHub:**
- Go to your repository
- Make sure `backend` folder exists
- Make sure `backend/package.json` exists

---

## Step-by-Step Fix:

### 1. Check Your GitHub Repository
- Go to: https://github.com/suhana-bhanu/attendance-system
- Verify `backend` folder exists
- Verify `backend/package.json` exists

### 2. Update Render Settings

**In Render Dashboard:**

1. Click on your service
2. Go to "Settings" tab
3. Scroll to "Build & Deploy" section
4. **Root Directory**: Set to `backend` (just the word, no slashes)
5. **Build Command**: `npm install`
6. **Start Command**: `npm start`
7. Click "Save Changes"

### 3. Manual Deploy
- After saving, click "Manual Deploy" → "Deploy latest commit"
- Or push a new commit to trigger auto-deploy

---

## Alternative: Create render.yaml (Advanced)

Create a file `render.yaml` in your repo root:

```yaml
services:
  - type: web
    name: attendance-backend
    env: node
    buildCommand: npm install
    startCommand: npm start
    rootDir: backend
    envVars:
      - key: MONGODB_URI
        sync: false
      - key: JWT_SECRET
        sync: false
      - key: NODE_ENV
        value: production
      - key: FRONTEND_URL
        sync: false
```

Then in Render:
- Create service from "render.yaml"
- It will auto-detect settings

---

## Quick Checklist:

- [ ] Root Directory in Render = `backend` (not `/backend`)
- [ ] Build Command = `npm install`
- [ ] Start Command = `npm start`
- [ ] `backend/package.json` exists in GitHub
- [ ] `backend/server.js` exists in GitHub
- [ ] Environment variables are set
- [ ] Saved changes in Render

---

## Still Not Working?

1. **Check Render Logs:**
   - Go to "Logs" tab in Render
   - Look for more specific errors

2. **Verify GitHub Structure:**
   ```bash
   # In your local project
   ls backend/
   # Should show: server.js, package.json, models/, routes/, etc.
   ```

3. **Push Latest Code:**
   ```bash
   git add .
   git commit -m "Fix backend structure"
   git push
   ```

4. **Try Manual Deploy:**
   - In Render dashboard
   - Click "Manual Deploy" → "Deploy latest commit"

---

## Common Mistakes:

❌ Root Directory = `/backend` (wrong - has leading slash)
❌ Root Directory = `./backend` (wrong - has dot)
✅ Root Directory = `backend` (correct - just the folder name)

❌ Build Command = `cd backend && npm install` (only if root is empty)
✅ Build Command = `npm install` (if root is set to backend)

---

Try Option 1 first - it's the simplest fix!

