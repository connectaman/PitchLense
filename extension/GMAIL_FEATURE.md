# Gmail Email Analysis Feature

## Overview
The PitchLense Chrome extension now includes Gmail integration that allows users to analyze email proposals directly from their Gmail interface.

## Features

### 🎯 Email Analysis Button
- A small target icon (🎯) appears next to each email in Gmail
- Clicking the button analyzes the email content for proposal effectiveness
- Button styling matches Gmail's interface for seamless integration

### 📧 Email Content Extraction
The extension automatically extracts:
- **Sender information** - Who sent the email
- **Subject line** - The email subject
- **Preview text** - The email preview/snippet
- **Timestamp** - When the email was received
- **Full email body** - Complete content when viewing an opened email

### 🤖 AI-Powered Analysis
Uses Google's Gemini AI to provide:
- **Overall Score** (1-10 rating)
- **Clarity Assessment** (Poor/Fair/Good/Excellent)
- **Persuasiveness Rating** (Poor/Fair/Good/Excellent)
- **Structure Evaluation** (Poor/Fair/Good/Excellent)
- **Detailed Feedback** - Strengths and weaknesses
- **Actionable Recommendations** - Specific improvement suggestions
- **Key Strengths** - What works well
- **Areas for Improvement** - What needs work

### 🎨 Gmail-Native Interface
- Analysis results displayed in a modal that matches Gmail's design
- Google Sans font family for consistency
- Material Design color scheme
- Responsive layout that works on all screen sizes

## Technical Implementation

### Files Added/Modified

1. **`manifest.json`** - Added Gmail-specific content script
2. **`gmail-content.js`** - New Gmail-specific content script
3. **`background.js`** - Added email analysis message handler
4. **`backend/server.js`** - Added `/api/analyze-email` endpoint

### Content Script Features
- **MutationObserver** - Detects new emails as they load
- **Email Detection** - Identifies Gmail email rows using multiple selectors
- **Action Button Injection** - Adds analysis buttons to email action areas
- **Content Extraction** - Pulls email metadata and content
- **Modal Display** - Shows analysis results in Gmail-styled interface

### API Endpoint
- **POST `/api/analyze-email`** - Processes email content through Gemini AI
- **Input**: Email content, ID, URL, source
- **Output**: Comprehensive analysis with scores and recommendations

## Usage

1. **Install Extension** - Load the extension in Chrome
2. **Visit Gmail** - Navigate to mail.google.com
3. **See Analysis Buttons** - 🎯 icons appear next to each email
4. **Click to Analyze** - Click any analysis button to analyze that email
5. **View Results** - Analysis appears in a Gmail-styled modal
6. **Get Insights** - Review scores, feedback, and recommendations

## Browser Compatibility
- Chrome (Manifest V3)
- Requires Gmail access permissions
- Works with Gmail's current interface structure

## Privacy & Security
- Email content is sent to your configured backend API
- No data is stored by the extension locally
- Analysis results are temporarily displayed and not persisted
- All communication uses HTTPS when configured

## Configuration
The extension uses the same settings as the main PitchLense extension:
- **API Endpoint** - Backend server URL (default: http://localhost:3000)
- **Notifications** - Enable/disable analysis completion notifications
- **Auto-analyze** - Not applicable for Gmail (manual trigger only)

## Troubleshooting

### Analysis Button Not Appearing
- Ensure you're on mail.google.com
- Check that the extension is enabled
- Refresh the Gmail page
- Check browser console for errors

### Analysis Failing
- Verify backend server is running
- Check API endpoint configuration
- Ensure GEMINI_API_KEY is set in backend
- Check network connectivity

### Poor Analysis Results
- Ensure email has sufficient content (>50 characters)
- Check that email content is properly extracted
- Verify Gemini AI API key is valid
- Review backend logs for API errors

## Future Enhancements
- Bulk email analysis
- Email filtering by sender/domain
- Analysis history tracking
- Export analysis results
- Integration with other email providers
