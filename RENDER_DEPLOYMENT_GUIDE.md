# Render Deployment Guide for EduLearning

## ✅ Your Code is Render-Ready!

Your implementation has been configured for seamless deployment on Render with the same code base. No changes needed for deployment!

---

## 🚀 Local Development (Windows)

### Quick Start

```powershell
cd "d:\Web Tech\Webtech_group_project-main"
npm install
npm start
```

Server runs on: **http://localhost:3000**

### Why It Works Locally:
- Windows uses prebuilt sqlite3 binaries (downloaded automatically)
- No C++ compilation needed
- Fast installation

---

## 🌐 Render Deployment (Linux)

### Deployment Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Add premium plan feature"
   git push origin main
   ```

2. **Connect to Render**
   - Go to https://render.com
   - Click "New Web Service"
   - Connect your GitHub repository
   - Choose your repository

3. **Configure**
   - **Name:** edulearning
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free (or your preference)

4. **Set Environment Variables** (if needed)
   - `NODE_ENV`: `production`
   - `NODE_OPTIONS`: `--max-old-space-size=512`

5. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy
   - Takes ~2-3 minutes

### Why It Works on Render:
- Render has Node.js and build tools pre-installed
- sqlite3 will use Linux prebuilt binaries or build from source
- Our `.npmrc` handles both cases automatically
- Same code works locally and on Render!

---

## 📝 Configuration Files Added

### `.npmrc`
- Optimizes npm installation for both Windows and Linux
- Allows prebuilt binaries to be used
- Fallback to building from source if needed

### `render.yaml`
- Render deployment configuration
- Specifies build and start commands
- Memory optimization for free tier

---

## 🔧 How It Works on Both Platforms

### Windows (Local Development)
```
npm install
  ↓
npm tries to find prebuilt sqlite3 binaries for Windows
  ↓
Found! (prebuilt-windows.node)
  ↓
Downloads and extracts
  ↓
✅ Ready to run
```

### Render (Linux)
```
npm install
  ↓
npm tries to find prebuilt sqlite3 binaries for Linux
  ↓
If found → Uses prebuilt (fast)
If not found → Builds from source (build tools available on Render)
  ↓
✅ Ready to run
```

---

## ✨ What Changed for Deployment Compatibility

### ✅ `package.json` Changes
- Removed problematic `postinstall` script
- Now uses standard npm installation
- Works automatically on both Windows and Linux

### ✅ `.npmrc` Created
- Optimized npm configuration
- Cross-platform compatible
- Handles both prebuilts and source builds

### ✅ `render.yaml` Created
- Official Render deployment manifest
- Specifies exact build and start commands
- Configures environment variables

### ✅ No Code Changes Needed!
- All your feature code remains unchanged
- Database migrations are automatic
- Routes, modals, styles all work the same

---

## 🗄️ Database on Render

### SQLite on Render
- Works fine with SQLite database
- Database file (`edulearning.db`) persists in app's filesystem
- **Note:** On Render free tier, the filesystem is ephemeral
  - Data persists for the lifetime of the deployment
  - Resets when dyno restarts (~ daily on free tier)

### For Production (Recommended)
If you want persistent data on Render:
- Upgrade to Paid tier (persistent filesystem)
- Or migrate to PostgreSQL/MySQL (Render supports both)

For now, SQLite works fine for development and testing!

---

## 📋 Checklist Before Deploying to Render

- [ ] `package.json` updated (no postinstall script)
- [ ] `.npmrc` created (included)
- [ ] `render.yaml` created (included)
- [ ] `.gitignore` includes `node_modules/` (already there)
- [ ] All feature code is in place
- [ ] Tested locally and working
- [ ] Committed to Git
- [ ] Pushed to GitHub

---

## 🧪 Testing Deployment

Once deployed on Render:

1. **Access your app:**
   - Render gives you a URL like: `https://edulearning-xxxxx.onrender.com`

2. **Test the premium feature:**
   - Create student account or login
   - Go to profile
   - Click "Upgrade to Premium"
   - Fill billing info
   - Verify upgrade works
   - Check premium badge appears

3. **Monitor logs:**
   - Go to Render dashboard
   - Click your service
   - View "Logs" tab
   - Check for errors

---

## 🔒 Environment Variables for Render

If you need environment variables (optional):

```
NODE_ENV=production
PORT=3000
NODE_OPTIONS=--max-old-space-size=512
```

Set them in Render dashboard:
- Service Settings → Environment → Add Environment Variable

---

## ⚠️ Known Limitations

### Free Tier Render
- Limited RAM (~512MB)
- Filesystem resets daily
- Spins down after 15 minutes of inactivity

### Solutions
- Upgrade to paid tier for production
- Accept daily resets for development
- Database resets are okay for testing

---

## 📞 Troubleshooting on Render

### "Cannot find sqlite3 module"
- This shouldn't happen with the new config
- Check Render logs for detailed error

### "Port already in use"
- Render handles port assignment automatically
- Check `render.yaml` is correct

### App keeps crashing
- Check Render logs for JavaScript errors
- Ensure all files are pushed to GitHub
- Verify `npm start` works locally first

---

## 🎯 Your Deployment Path

```
1. Local Dev (Windows)
   npm install
   npm start
   ✅ Test premium feature
   ✅ Verify everything works
   
2. Push to GitHub
   git add .
   git commit -m "..."
   git push origin main
   
3. Deploy to Render
   Connect GitHub repo
   Set build command: npm install
   Set start command: npm start
   Click deploy
   
4. Verify on Render
   Visit your Render URL
   Test premium feature
   Check logs for errors
   
5. Success! 🚀
```

---

## 📊 Tech Stack Summary

**Local (Windows):**
- Node.js 20.x
- Express.js
- SQLite3 (prebuilt Windows binaries)
- EJS templates
- bcrypt for passwords

**Render (Linux):**
- Node.js 20.x (same)
- Express.js (same)
- SQLite3 (Linux binaries or built from source)
- EJS templates (same)
- bcrypt for passwords (same)

**Everything else identical!**

---

## 🎉 You're All Set!

Your EduLearning project with the Premium Plan feature is fully configured for:
- ✅ Local Windows development
- ✅ Render deployment (Linux)
- ✅ Automatic npm installation on both
- ✅ Zero code changes needed

Just follow the checklist and deploy! 🚀

---

## 💡 Quick Commands

```powershell
# Local development
npm install
npm start

# For Render (just push to GitHub and deploy)
git push origin main

# Test premium feature
# 1. Login as student
# 2. Go to /profile
# 3. Click "Upgrade to Premium"
# 4. Fill billing info
# 5. Click upgrade
# ✅ Done!
```

---

**Happy Coding! 🎓**
