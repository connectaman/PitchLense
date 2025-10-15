# PitchLense Chrome Extension

A Chrome extension that provides AI-powered pitch analysis and feedback directly in your browser.

## Features

- **Page Analysis**: Analyze any webpage's content for pitch quality
- **Floating Button**: Easy-to-access analysis button on every page
- **Real-time Feedback**: Get instant scores and recommendations
- **Settings Management**: Configure API endpoints and preferences
- **Recent Analysis**: View your latest analysis results
- **Keyboard Shortcut**: Use Ctrl+Shift+P for quick analysis

## Installation

### Development Installation

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked" and select the `extension` folder
4. The PitchLense extension should now appear in your extensions list

### Production Installation

1. Download the extension package
2. Open Chrome and navigate to `chrome://extensions/`
3. Drag and drop the `.crx` file or use "Load unpacked" for the folder

## Usage

### Quick Analysis

1. **Floating Button**: Click the 🎯 button that appears on web pages
2. **Keyboard Shortcut**: Press `Ctrl+Shift+P` on any page
3. **Extension Popup**: Click the extension icon and select "Analyze Current Page"

### Settings

Access settings through the extension popup:

- **API Endpoint**: Configure the backend API URL (default: http://localhost:3000)
- **Auto-analyze**: Automatically analyze pages on load
- **Notifications**: Show notifications for completed analyses

## File Structure

```
extension/
├── manifest.json          # Extension configuration
├── background.js          # Background service worker
├── content.js            # Content script for page interaction
├── popup.html            # Extension popup interface
├── popup.css             # Popup styling
├── popup.js              # Popup functionality
├── icons/                # Extension icons (16px, 32px, 48px, 128px)
└── README.md             # This file
```

## API Integration

The extension communicates with the PitchLense backend API:

- **Health Check**: `GET /api/health` - Check API connectivity
- **Analysis**: `POST /api/analyze` - Submit content for analysis
- **Reports**: `GET /report/:id` - View detailed analysis reports

## Permissions

- `activeTab`: Access to the current active tab
- `storage`: Store settings and analysis results
- `scripting`: Inject content scripts
- `host_permissions`: Access to web pages for analysis

## Development

### Prerequisites

- Chrome browser with Developer mode enabled
- PitchLense backend API running (see main project README)

### Building

1. Ensure all files are in the `extension/` directory
2. Load the extension in Chrome using "Load unpacked"
3. Make changes and reload the extension as needed

### Testing

1. Load the extension in Chrome
2. Navigate to any webpage
3. Use the floating button or keyboard shortcut to test analysis
4. Check the extension popup for settings and recent analysis

## Troubleshooting

### Common Issues

1. **Analysis not working**: Check API endpoint settings and ensure backend is running
2. **Floating button not appearing**: Refresh the page or reload the extension
3. **Connection errors**: Verify the API endpoint URL is correct and accessible

### Debug Mode

1. Open Chrome DevTools
2. Go to Extensions page (`chrome://extensions/`)
3. Click "Inspect views: background page" for background script debugging
4. Use browser console for content script debugging

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the main project LICENSE file for details.

## Support

For support and questions:
- Check the main project README
- Open an issue on GitHub
- Contact the development team

## Version History

- **v1.0.0**: Initial release with basic analysis functionality
