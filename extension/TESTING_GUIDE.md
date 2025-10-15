# PitchLense Chrome Extension - Testing Guide

## Prerequisites

1. **Chrome Browser**: Version 88+ (supports Manifest V3)
2. **Backend API**: PitchLense backend should be running (optional for basic testing)
3. **Icons**: Generate icons using the provided tool

## Step 1: Generate Extension Icons

### Option A: Use the Icon Generator (Recommended)

1. Open `extension/generate_icons.html` in your browser
2. Download all four icon sizes:
   - `icon16.png` (16x16)
   - `icon32.png` (32x32) 
   - `icon48.png` (48x48)
   - `icon128.png` (128x128)
3. Place all downloaded icons in the `extension/icons/` folder

### Option B: Create Simple Icons Manually

Create simple PNG files with the following specifications:
- **16x16**: Green circle with white crosshairs
- **32x32**: Same design, larger size
- **48x48**: Same design, larger size  
- **128x128**: Same design, larger size

## Step 2: Load the Extension in Chrome

1. **Open Chrome Extensions Page**:
   - Go to `chrome://extensions/`
   - Or: Chrome Menu → More Tools → Extensions

2. **Enable Developer Mode**:
   - Toggle "Developer mode" switch in the top-right corner

3. **Load the Extension**:
   - Click "Load unpacked" button
   - Navigate to and select the `extension` folder
   - Click "Select Folder"

4. **Verify Installation**:
   - The PitchLense extension should appear in the extensions list
   - You should see the extension icon in the Chrome toolbar
   - The extension should show as "Enabled"

## Step 3: Basic Functionality Testing

### Test 1: Extension Popup

1. **Click the Extension Icon** in the Chrome toolbar
2. **Verify Elements**:
   - ✅ Logo and title display correctly
   - ✅ "Analyze Current Page" button is visible
   - ✅ "Open Web App" button is visible
   - ✅ Settings section is present
   - ✅ Status section shows connection status

### Test 2: Settings Configuration

1. **Open the Extension Popup**
2. **Test Settings**:
   - ✅ Check/uncheck "Auto-analyze on page load"
   - ✅ Check/uncheck "Show notifications"
   - ✅ Change API Endpoint URL
   - ✅ Settings should persist when popup is closed and reopened

### Test 3: Floating Button

1. **Navigate to Any Website** (e.g., google.com)
2. **Look for Floating Button**:
   - ✅ Green circular button with 🎯 icon appears in top-right
   - ✅ Button should be positioned correctly
   - ✅ Button should respond to hover effects

### Test 4: Keyboard Shortcut

1. **On Any Web Page**, press `Ctrl+Shift+P`
2. **Expected Behavior**:
   - ✅ Should trigger analysis (if backend is connected)
   - ✅ Should show loading state on floating button

## Step 4: Backend Integration Testing

### Prerequisites for Backend Testing

1. **Start PitchLense Backend**:
   ```bash
   cd backend
   npm start
   ```

2. **Verify API is Running**:
   - Open `http://localhost:3000/api/health` in browser
   - Should return a success response

### Test 5: API Connection

1. **Open Extension Popup**
2. **Check Status Section**:
   - ✅ "Status" should show "Connected" (green)
   - ✅ "API" should show "Online" (green)
   - If backend is not running: should show "Disconnected" (red)

### Test 6: Page Analysis

1. **Navigate to a Content-Rich Page** (e.g., a blog post, article)
2. **Click the Floating Button** or press `Ctrl+Shift+P`
3. **Expected Behavior**:
   - ✅ Button shows loading state (⏳)
   - ✅ Analysis overlay appears with results
   - ✅ Results include: score, metrics, feedback, recommendations
   - ✅ Overlay can be closed by clicking X or outside

### Test 7: Recent Analysis

1. **After Running an Analysis**:
   - ✅ Recent analysis section should appear in popup
   - ✅ Should show score, URL, and timestamp
   - ✅ "View Full Report" button should work

## Step 5: Error Handling Testing

### Test 8: No Backend Connection

1. **Stop the Backend API**
2. **Try to Analyze a Page**:
   - ✅ Should show error message
   - ✅ Should not crash the extension
   - ✅ Status should update to "Disconnected"

### Test 9: Insufficient Content

1. **Navigate to a Page with Little Content** (e.g., blank page)
2. **Try to Analyze**:
   - ✅ Should show warning about insufficient content
   - ✅ Should not attempt API call

### Test 10: Network Errors

1. **Set Invalid API Endpoint** (e.g., `http://invalid-url`)
2. **Try to Analyze**:
   - ✅ Should show connection error
   - ✅ Should handle gracefully without crashing

## Step 6: Advanced Testing

### Test 11: Different Page Types

Test the extension on various page types:
- ✅ **Blog Posts**: Should extract main content
- ✅ **News Articles**: Should work well
- ✅ **E-commerce Pages**: Should extract product descriptions
- ✅ **Social Media**: Should handle dynamic content
- ✅ **PDF Pages**: Should extract text content

### Test 12: Multiple Tabs

1. **Open Multiple Tabs**
2. **Test Each Tab**:
   - ✅ Floating button appears on each tab
   - ✅ Analysis works independently on each tab
   - ✅ Settings are shared across tabs

### Test 13: Extension Reload

1. **Make Changes to Extension Files**
2. **Reload Extension**:
   - Go to `chrome://extensions/`
   - Click refresh icon on PitchLense extension
   - ✅ Extension should reload without errors

## Troubleshooting Common Issues

### Issue: Extension Won't Load

**Solutions**:
- Check that all required files are present
- Verify `manifest.json` syntax is correct
- Ensure icons are in the correct format (PNG)
- Check Chrome console for error messages

### Issue: Floating Button Not Appearing

**Solutions**:
- Refresh the webpage
- Check if content script is running (DevTools → Sources)
- Verify page is not in an iframe
- Try on a different website

### Issue: API Connection Fails

**Solutions**:
- Verify backend is running on correct port
- Check API endpoint URL in settings
- Test API directly in browser
- Check for CORS issues in backend

### Issue: Analysis Results Don't Show

**Solutions**:
- Check browser console for JavaScript errors
- Verify content extraction is working
- Test with a simple page first
- Check network tab for API requests

## Debug Mode

### Enable Debug Logging

1. **Open Chrome DevTools** (F12)
2. **Go to Console Tab**
3. **Look for PitchLense logs**:
   - Background script logs: Extensions → Inspect views: background page
   - Content script logs: Regular page console
   - Popup logs: Right-click extension icon → Inspect popup

### Common Debug Commands

```javascript
// Check extension storage
chrome.storage.sync.get(null, console.log);

// Check current tab
chrome.tabs.query({active: true, currentWindow: true}, console.log);

// Test content script
chrome.tabs.sendMessage(tabId, {action: 'getPageContent'}, console.log);
```

## Performance Testing

### Test 14: Memory Usage

1. **Open Chrome Task Manager** (Shift+Esc)
2. **Monitor Extension**:
   - ✅ Memory usage should be reasonable (< 50MB)
   - ✅ No memory leaks after multiple analyses

### Test 15: Speed Testing

1. **Measure Analysis Time**:
   - ✅ Simple page: < 2 seconds
   - ✅ Complex page: < 5 seconds
   - ✅ Large content: < 10 seconds

## Final Checklist

Before considering the extension ready:

- [ ] All icons are properly generated and loaded
- [ ] Extension loads without errors
- [ ] Popup interface works correctly
- [ ] Settings persist across sessions
- [ ] Floating button appears on all page types
- [ ] Keyboard shortcut works
- [ ] Backend integration works when available
- [ ] Error handling works for all failure cases
- [ ] No memory leaks or performance issues
- [ ] Works on different websites and content types

## Next Steps

Once testing is complete:

1. **Create Production Icons**: Replace placeholder icons with professional designs
2. **Add Analytics**: Track usage and errors
3. **User Testing**: Get feedback from real users
4. **Chrome Web Store**: Prepare for publication
5. **Documentation**: Update user guides and help content
