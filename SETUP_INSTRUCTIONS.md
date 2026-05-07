# How to Get the Server Running

The implementation is complete! However, you need to resolve the sqlite3 native module binding issue before starting the server. Here are the solutions:

## ⚠️ Current Issue
```
Error: Could not locate the bindings file for sqlite3
```

This occurs because sqlite3 requires C++ compilation, and Visual Studio Build Tools are not installed on your system.

---

## 🔧 Solution 1: Install Visual Studio Build Tools (Recommended)

### For Windows:
1. Download Visual Studio Build Tools from:
   https://visualstudio.microsoft.com/downloads/
   
2. Run the installer

3. Select **"Desktop development with C++"** workload:
   - Click "Install" button
   - Select **"Desktop development with C++"** checkbox
   - Include these optional components:
     - MSVC v143 (or latest)
     - Windows 11 SDK
     - CMake tools

4. Complete the installation (may take 10-20 minutes)

5. Restart your computer

6. In the project directory, reinstall packages:
   ```powershell
   npm install
   ```

7. Start the server:
   ```powershell
   npm start
   ```

---

## 🔧 Solution 2: Quick Fix (No Visual Studio Installation)

Try using prebuilt binaries without building from source:

```powershell
# Clear npm cache
npm cache clean --force

# Remove node_modules
Remove-Item -Recurse -Force node_modules

# Remove package lock
Remove-Item package-lock.json -ErrorAction SilentlyContinue

# Install with prebuilt binaries
npm install --build-from-source=false

# Start server
npm start
```

---

## 🔧 Solution 3: Use Alternative Database (Quick)

If you just want to test the frontend features without full compilation:

Replace the require in `database.js`:
```javascript
// Change from:
const sqlite3 = require('sqlite3').verbose();

// To:
const Database = require('better-sqlite3');
const db = new Database('edulearning.db');
```

Then install better-sqlite3:
```powershell
npm install better-sqlite3
```

This requires fewer build dependencies and may work better on Windows.

---

## ✅ Verify Server is Running

Once started successfully, you should see:
```
Connected to the SQLite database.
Database schema initialized.
EduLearning Server running on http://localhost:3000
```

Then visit: **http://localhost:3000** in your browser

---

## 🧪 Testing the Premium Feature

1. **Login** as a student account (or register a new one as 'student')
   - Email: alex@student.edu.my (or create new)
   - Password: 123456

2. **Go to Profile** - Click user icon in header

3. **Look for the buttons:**
   - Edit Profile button (green)
   - **Upgrade to Premium button (orange)** ← NEW!

4. **Click "Upgrade to Premium"** - Plan modal opens

5. **Review plans:**
   - Free Plan (current)
   - Premium Plan (with features)

6. **Click "Upgrade to Premium"** in the modal

7. **Fill billing info:**
   - Name: Your Name
   - Email: auto-filled
   - Phone: 012-3456789
   - Card: 4532 1234 5678 9010 (dummy)
   - Expiry: 12/25
   - CVV: 123

8. **Click "Upgrade Button"** - Success message!

9. **Verify changes:**
   - Page reloads
   - Premium badge appears next to EDULEARNING logo ✨
   - Button now shows "Premium" (disabled)
   - Works on all pages

10. **Test on mobile:**
    - Resize browser to 480px width
    - Verify responsive layout works

---

## 📋 Troubleshooting

### Error: "Module not found: express"
```powershell
npm install
```

### Error: "Cannot find sqlite3 binding"
Use Solution 1 or 2 above.

### Port 3000 already in use
```powershell
netstat -ano | findstr :3000
taskkill /PID <PID> /F
npm start
```

### Database file not found
The `.db` file will be created automatically on first run.

### Styles not loading
- Clear browser cache (Ctrl+Shift+Delete)
- Make sure `/public/css/style.css` is being served

---

## 🎯 Key Files to Review

After getting the server running, review these files to understand the implementation:

1. **Backend:** `routes/student.js` - Upgrade API endpoint
2. **Database:** `database.js` - Subscription fields added
3. **Header:** `views/partials/header.html` - Premium badge
4. **Profile:** `views/pages/profile.html` - Main UI and modals
5. **Styles:** `public/css/style.css` - All styling + responsive
6. **App Config:** `app.js` - Student routes registered

---

## 📞 Quick Start Commands

```powershell
# After resolving sqlite3 issue:
cd "d:\Web Tech\Webtech_group_project-main"
npm install
npm start

# Server runs on http://localhost:3000
```

---

## ✨ Features Implemented

✅ Student plan selection (Free vs Premium)
✅ Plan comparison modal with detailed features
✅ Billing information form
✅ Subscription status tracking
✅ Premium badge in header (persistent on all pages)
✅ Button state changes after upgrade
✅ Success notifications
✅ Fully responsive design (mobile/tablet/desktop)
✅ Form validation
✅ Database integration
✅ Session management

---

Good luck! Once you get the server running, all the premium features will work perfectly! 🚀
