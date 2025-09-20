# PitchLense - AI-Powered Startup Analysis Platform

PitchLense is a comprehensive AI-powered startup analysis platform that provides detailed risk assessment and growth potential evaluation for early-stage ventures. The platform analyzes multiple dimensions of startup risk and provides actionable insights for investors, founders, and stakeholders.

## 🔗 Quick Links

<div align="center">

[![YouTube Tutorial](https://img.shields.io/badge/📺_YouTube_Tutorial-red?style=for-the-badge&logo=youtube&logoColor=white)](https://youtu.be/XUuLeXaEIdI)
[![Website](https://img.shields.io/badge/🌐_Website-black?style=for-the-badge&logo=googlechrome&logoColor=white)](https://www.pitchlense.com/)
[![GitHub Repository](https://img.shields.io/badge/💻_GitHub-black?style=for-the-badge&logo=github&logoColor=white)](https://github.com/connectaman/PitchLense)
[![MCP Repository](https://img.shields.io/badge/🔧_MCP_Repository-black?style=for-the-badge&logo=github&logoColor=white)](https://github.com/connectaman/Pitchlense-mcp)
[![PyPI Package](https://img.shields.io/badge/🐍_PyPI_Package-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://pypi.org/project/pitchlense-mcp/)
[![Documentation](https://img.shields.io/badge/📚_Documentation-FFD43B?style=for-the-badge&logo=readthedocs&logoColor=black)](https://pitchlense-mcp.readthedocs.io/en/latest/api.html)

</div>

### 📖 How to Use PitchLense
Watch our comprehensive tutorial video to learn how to use PitchLense effectively:

[![How to use PitchLense](https://img.youtube.com/vi/XUuLeXaEIdI/0.jpg)](https://youtu.be/XUuLeXaEIdI)

**Click the image above to watch the tutorial on YouTube**

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
# Google AI/Gemini API
GEMINI_API_KEY=your_gemini_api_key

# Google Cloud Storage
BUCKET=your_gcs_bucket_name

# Google Cloud Project
GOOGLE_CLOUD_PROJECT=your_project_id

# Cloud Run deployment URL
CLOUD_RUN_URL=your_cloud_run_endpoint_url

# Application environment
NODE_ENV=production

# Google Cloud credentials (for service account)
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account-key.json

# Database configuration (MySQL/Cloud SQL)
DB_USER=your_database_user
DB_PASS=your_database_password
DB_HOST=your_database_host
DB_NAME=your_database_name
DB_PORT=3306
DB_SSL=true
```

### Environment Variables Explained

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini AI API key for document analysis | ✅ |
| `BUCKET` | Google Cloud Storage bucket name for file storage | ✅ |
| `GOOGLE_CLOUD_PROJECT` | Your Google Cloud Project ID | ✅ |
| `CLOUD_RUN_URL` | Cloud Run service URL for deployment | ✅ |
| `NODE_ENV` | Application environment (production/development) | ✅ |
| `GOOGLE_APPLICATION_CREDENTIALS` | Path to Google Cloud service account key | ✅ |
| `DB_USER` | MySQL database username | ✅ |
| `DB_PASS` | MySQL database password | ✅ |
| `DB_HOST` | MySQL database host (Cloud SQL instance) | ✅ |
| `DB_NAME` | MySQL database name | ✅ |
| `DB_PORT` | MySQL database port (default: 3306) | ✅ |
| `DB_SSL` | Enable SSL for database connection | ✅ |

3) Run the server

```bash
npm run start
# Server will start on http://localhost:5178
```

4) Access the application

Open your browser and navigate to `http://localhost:5178`

### Database Migration

The application now uses **MySQL/Cloud SQL** instead of SQLite. If you're upgrading from a previous version:

1. **Set up MySQL database** with the environment variables above
2. **The server will automatically**:
   - Connect to your MySQL database
   - Create all necessary tables with proper schema
   - Add the `user_id` column to reports table
   - Create necessary indexes
   - Handle existing data gracefully

3. **For cleanup of orphaned reports** (if any), you can run:
   ```bash
   cd backend
   node cleanup-orphaned-reports.js
   ```

### Cloud SQL Connection

For Google Cloud SQL, you can use either:
- **TCP connection**: Set `DB_HOST`, `DB_PORT`, `DB_SSL=true`
- **Unix socket**: Set `INSTANCE_UNIX_SOCKET=/cloudsql/PROJECT:REGION:INSTANCE`

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
- **Database**: MySQL 8.0+ (Cloud SQL compatible)
- **Authentication**: JWT with httpOnly cookies
- **Charts**: Chart.js for data visualization
- **Icons**: Lucide React icons
- **Styling**: Custom dark theme with glassmorphism effects

## Recent Updates

### 🗄️ MySQL/Cloud SQL Migration
- **Migrated from SQLite to MySQL**: Full support for Google Cloud SQL
- Added connection pooling and proper error handling
- Support for both TCP and Unix socket connections
- Automatic table creation and schema migration
- Enhanced database performance and scalability

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

