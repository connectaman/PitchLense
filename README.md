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

### Share Button Feature
- Added share button to reports page (top right, left of documentation tab)
- Dropdown menu with "Download (pptx)" and "Share Email" options
- Currently disabled for future implementation
- Includes proper styling and interactive functionality

## License

MIT License - see LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For support and questions, please refer to the built-in documentation in the application or create an issue in the repository.

