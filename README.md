# PitchLense - AI-Powered Startup Analysis Platform

PitchLense is a comprehensive AI-powered startup analysis platform that provides detailed risk assessment and growth potential evaluation for early-stage ventures. The platform analyzes multiple dimensions of startup risk and provides actionable insights for investors, founders, and stakeholders.

## Features

### 📊 Comprehensive Analysis
- **Overall Analysis Dashboard**: Market value trends, risk analysis, growth potential, and startup metrics
- **Detailed Risk Assessment**: In-depth analysis across 9 key dimensions including market, team, product, and financial risks
- **Interactive Charts**: Radar charts, market value charts, and growth potential visualizations

### 📁 Document Management
- **File Upload**: Support for pitch decks, founder profiles, and business plans
- **Document Analysis**: AI-powered analysis of uploaded documents
- **File Viewer**: Built-in document viewer with content display

### 🤖 AI-Powered Q&A
- **Interactive Chat**: Ask questions about your report data and get AI-powered insights
- **Chat History**: Persistent conversation history for each report
- **Contextual Responses**: AI responses based on your specific report data

### 📰 Market Intelligence
- **Industry News**: Latest industry news and market trends
- **Internet Documents**: Relevant documents and research from the web
- **Market Share Analysis**: Detailed market segmentation and share analysis

### 🔗 Sharing & Export
- **Share Button**: Quick access to sharing options (currently disabled for future implementation)
- **Download Options**: PPTX export functionality (coming soon)
- **Email Sharing**: Direct email sharing capabilities (coming soon)

### 📚 Documentation
- **Built-in Help**: Comprehensive documentation modal with usage guides
- **Feature Explanations**: Detailed explanations of risk analysis framework and growth potential calculations
- **Getting Started Guide**: Step-by-step instructions for new users

## Quickstart

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1) Install backend dependencies

```bash
cd backend
npm install
```

2) Set up environment variables

Create a `backend/.env` file with the following variables:

```bash
# Database configuration
DB_HOST=your_database_host
DB_PORT=3306
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name

# JWT secret for authentication
JWT_SECRET=your_jwt_secret_key
```

3) Run the server

```bash
npm run start
# Server will start on http://localhost:5178
```

4) Access the application

Open your browser and navigate to `http://localhost:5178`

### Database Migration

If you're upgrading from a previous version, the server will automatically:
- Add the `user_id` column to the reports table
- Create necessary indexes
- Handle existing data gracefully

For cleanup of orphaned reports (if any), you can run:
```bash
cd backend
node cleanup-orphaned-reports.js
```

### Development

If you want to iterate on the frontend HTML/JS, edit files in `frontend/` and refresh your browser.

**Notes:**
- Tailwind CSS is loaded via CDN and themed inline for simplicity
- React and ReactDOM are loaded from CDN; JSX compiled in-browser for demo only
- Animations use GSAP for smooth transitions
- The application uses a dark theme with custom color scheme

## Project Structure

```
PitchLense/
├── frontend/
│   ├── index.html          # Main landing page
│   ├── auth.html           # Authentication page
│   ├── create-report.html  # Report creation form
│   ├── view-report.html    # Reports listing page
│   ├── report.html         # Individual report view with analysis
│   ├── main.jsx            # React components and animations
│   ├── styles.css          # Custom styles and theme
│   └── static/             # Static assets (logos, images)
├── backend/
│   ├── server.js           # Express server and API routes
│   ├── package.json        # Backend dependencies
│   └── .env                # Environment variables
├── docker-compose.yml      # Docker configuration
├── Dockerfile             # Container setup
└── README.md              # This file
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user info

### Reports
- `GET /api/reports` - List user reports (with pagination)
- `POST /api/reports` - Create new report
- `GET /api/reports/:id/data` - Get report analysis data
- `PATCH /api/reports/:id/pin` - Pin/unpin report
- `DELETE /api/reports/:id` - Delete report

### Q&A
- `POST /api/qna/ask` - Ask question about report
- `GET /api/qna/history/:reportId` - Get chat history

## UI Pages

- **`/`** - Landing page with project overview
- **`/auth.html`** - Authentication (sign-in/sign-up) with dark theme
- **`/create-report.html`** - Report creation form with file upload
- **`/view-report.html`** - Reports listing with search and pagination
- **`/report.html`** - Individual report view with:
  - Overall analysis dashboard
  - Detailed risk assessment
  - Interactive Q&A chat
  - File viewer
  - Market intelligence
  - Share functionality (coming soon)

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+), Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MySQL (Cloud SQL compatible)
- **Authentication**: JWT with httpOnly cookies
- **Charts**: Chart.js for data visualization
- **Icons**: Lucide React icons
- **Styling**: Custom dark theme with glassmorphism effects

## Recent Updates

### 🔒 User Data Isolation Fix
- **Fixed critical security issue**: Reports were being shared across all users
- Added `user_id` column to reports table with proper foreign key constraints
- Updated all report queries to filter by authenticated user
- Added database migration to handle existing data
- Users now only see their own reports and data

### 🔗 Share Button Feature
- Added share button to reports page (top right, left of documentation tab)
- Dropdown menu with "Download (pptx)" and "Share Email" options
- Currently disabled for future implementation
- Includes proper styling and interactive functionality

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### MIT License Summary

- ✅ Commercial use allowed
- ✅ Modification allowed
- ✅ Distribution allowed
- ✅ Private use allowed
- ❌ No liability or warranty provided

The MIT License is a permissive free software license that allows you to use, modify, and distribute the software with minimal restrictions.

## Contributing

We welcome contributions to PitchLense! Please see our [Contributing Guidelines](CONTRIBUTING.md) for detailed information on how to contribute.

### Quick Start for Contributors

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/PitchLense.git
   cd PitchLense
   ```
3. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Make your changes** and test thoroughly
5. **Submit a pull request** with a clear description

### Types of Contributions

- 🐛 **Bug fixes** - Fix issues and improve stability
- ✨ **New features** - Add new functionality
- 📚 **Documentation** - Improve or add documentation
- 🎨 **UI/UX improvements** - Enhance the user interface
- ⚡ **Performance** - Optimize application performance
- 🧪 **Testing** - Add or improve test coverage

### Development Setup

1. Install dependencies: `cd backend && npm install`
2. Set up environment variables (see Quickstart section)
3. Run the server: `npm run start`
4. Open `http://localhost:5178` in your browser

For more detailed information, please read our [Contributing Guidelines](CONTRIBUTING.md).

## Support

For support and questions, please refer to the built-in documentation in the application or create an issue in the repository.

