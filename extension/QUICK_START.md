# PitchLense Extension - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Generate Icons (Required)

1. **Open the icon generator**:
   - Navigate to `extension/generate_icons.html` in your browser
   - Download all 4 icon files (16x16, 32x32, 48x48, 128x128)
   - Replace the placeholder PNG files in `extension/icons/` folder

### Step 2: Load Extension in Chrome

1. **Open Chrome Extensions**:
   - Go to `chrome://extensions/`
   - OR: Chrome Menu → More Tools → Extensions

2. **Enable Developer Mode**:
   - Toggle "Developer mode" in top-right corner

3. **Load Extension**:
   - Click "Load unpacked"
   - Select the `extension` folder
   - Click "Select Folder"

4. **Verify Installation**:
   - ✅ PitchLense appears in extensions list
   - ✅ Extension icon shows in Chrome toolbar

### Step 3: Test Basic Functionality

1. **Click Extension Icon**:
   - Should open popup with settings and buttons
   - Check that "Analyze Current Page" button is visible

2. **Visit Any Website**:
   - Go to any webpage (e.g., google.com)
   - Look for green 🎯 button in top-right corner

3. **Test Floating Button**:
   - Click the 🎯 button
   - Should show loading state (⏳)
   - Will show error if backend not running (this is expected)

### Step 4: Test with Backend (Optional)

1. **Start PitchLense Backend**:
   ```bash
   cd backend
   npm start
   ```

2. **Configure Extension**:
   - Open extension popup
   - Verify API endpoint is `http://localhost:3000`
   - Status should show "Connected" when backend is running

3. **Test Analysis**:
   - Go to a content-rich page (news article, blog post)
   - Click 🎯 button or press `Ctrl+Shift+P`
   - Should show analysis results overlay

## 🎯 Expected Results

### ✅ Working Extension Should Show:
- Extension icon in Chrome toolbar
- Popup opens when clicked
- Floating button on web pages
- Settings can be changed and saved
- Status shows connection state

### ⚠️ Expected Errors (Without Backend):
- "Analysis failed: Failed to analyze page"
- Status shows "Disconnected"
- API shows "Offline"

This is normal when the backend isn't running!

## 🔧 Troubleshooting

### Extension Won't Load:
- Check all files are in `extension/` folder
- Verify `manifest.json` exists and is valid
- Make sure icons are PNG files (not SVG)

### Floating Button Missing:
- Refresh the webpage
- Try a different website
- Check browser console for errors

### Popup Doesn't Open:
- Right-click extension icon → "Inspect popup"
- Check for JavaScript errors in console

## 📚 Next Steps

1. **Read Full Testing Guide**: `TESTING_GUIDE.md`
2. **Generate Proper Icons**: Use `generate_icons.html`
3. **Test with Backend**: Start your PitchLense API
4. **Customize Settings**: Configure API endpoint and preferences

## 🆘 Need Help?

- Check `TESTING_GUIDE.md` for detailed testing steps
- Open Chrome DevTools for debugging
- Verify backend is running if testing full functionality
- Check extension permissions in `chrome://extensions/`

---

**Quick Tip**: The extension works in "demo mode" even without the backend - you can test the UI, floating button, and settings without needing the full API integration!
