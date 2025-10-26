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

### 📊 Comprehensive Startup Analysis
- **AI-Powered Report Generation**: Automated analysis using Google Gemini AI
- **Multi-Document Analysis**: Support for pitch decks, call recordings, meeting recordings, founder profiles, news reports, and company documents
- **Growth Potential Scoring**: Detailed 1-10 scale scoring with risk level assessment
- **Risk Assessment**: Comprehensive analysis across multiple risk dimensions
- **Interactive Charts & Visualizations**: D3.js knowledge graphs, radar charts, and financial visualizations
- **Knowledge Graph**: Interactive network visualization of startup ecosystem connections
- **Liquid Glass UI**: Modern glassmorphism design with animated components
- **Radial Dock Navigation**: Interactive circular navigation with 8 key features
- **Movie Reel Slideshows**: Animated vertical slideshows showcasing platform capabilities

### 🔍 Real-Time Search & Company Intelligence
- **Symbol Search**: Real-time search with FMP API integration (debounced search after 2 characters)
- **Comprehensive Company Data**: 
  - Company profile and overview
  - Financial statements (Income Statement, Balance Sheet)
  - Key metrics and KPIs
  - Employee count and historical data
  - Market capitalization trends
  - Share float and liquidity data
  - Key executives information
  - Dividend history
  - Press releases and latest news
- **Quick Search**: Top 10 companies accessible with one click
- **Data Availability Status**: Visual indicators showing which data sections are available

### 📈 Market Performance Dashboard
- **Commodities Overview**: Real-time pricing for 40 major commodities (Gold, Silver, Oil, etc.)
- **Top Gainers & Losers**: Daily top 10 stock movers with bar charts
- **Treasury Rates**: US Treasury yield curves across all maturities
- **Economic Indicators**: 
  - GDP and Real GDP per Capita
  - Inflation rates
  - Unemployment rates
  - Recession probabilities
- **Sector & Industry Performance**: Historical performance tracking and P/E ratios
- **Interactive Charts**: All data visualized with Chart.js

### 📰 Market News & Intelligence
- **General Market News**: Latest financial news with images and sources
- **Stock News**: Company-specific news updates
- **Crypto News**: Cryptocurrency market updates
- **Forex News**: Foreign exchange market news
- **Insider Trading**: SEC Form 4 filings and insider transaction data
- **Crowdfunding Campaigns**: Latest Regulation CF offerings
- **Equity Offerings**: Form D filings and fundraising updates
- **Acquisition Ownership**: Beneficial ownership disclosures (Schedule 13D/13G)
- **Quick Search**: Top 50 companies for instant access to acquisition data
- **Day-Level Browser Caching**: Intelligent caching to reduce API calls

### 💼 Investment Portfolio Tracking
- **Portfolio Management**: Track all your startup investments
- **Investment Metrics**:
  - Investment amount, equity percentage, valuation
  - Funding rounds and investment types
  - ROI calculations
  - Status tracking (Active, Exited, Failed)
- **Investment Updates**: Track additional rounds, valuation changes, and exits
- **Dashboard Analytics**: Visual overview of portfolio performance
- **Search & Filter**: Find investments by startup name or investor
- **Sorting**: Sort by date, amount, or status

### 🧬 Founder DNA Analysis
- **LinkedIn Profile Analysis**: Upload founder LinkedIn PDFs for AI-powered evaluation
- **Comprehensive Scoring**: 
  - Overall founder score (1-10)
  - Education quality assessment
  - Work experience evaluation
  - Leadership potential
  - Technical expertise
  - Startup experience
  - Domain expertise
- **Risk Assessment**: Red flags, yellow flags, and strengths identification
- **Actionable Insights**: Specific recommendations and concerns

### 📧 Email Analysis
- **Gmail Integration**: Connect Gmail accounts for email analysis
- **Email Pitch Analysis**: AI-powered evaluation of pitch emails
- **Startup Extraction**: Automatically extract startup details from emails
- **Report Generation**: Create reports directly from email content
- **Attachment Support**: Handle email attachments in report creation

### 🎥 Meeting Assistant
- **Meeting Recording Upload**: Upload and analyze meeting recordings (MP4, WebM, MOV)
- **Transcript Generation**: Automatic transcription of meetings using AI
- **AI Summary**: Get key insights, action items, and decisions from meetings
- **Interactive Results**: Scrollable transcript and summary sections (80% viewport height)
- **Download Reports**: Export transcript and summary as separate text files
- **Email Sharing**: Send formatted HTML email reports with professional templates
- **Bottom Dock Interface**: Floating action dock with download and email buttons
- **Integration with Reports**: Link meeting insights to startup reports

### 🔗 Sharing & Export
- **PDF Export**: Download reports as professional PDFs
- **PPTX Export**: Generate PowerPoint presentations from reports
- **Email Sharing**: Share reports via email with formatted HTML
- **Download Files**: Access uploaded documents and analysis files

### 🤖 AI-Powered Q&A
- **Interactive Chat**: Ask questions about your report data
- **Chat History**: Persistent conversation history for each report
- **Contextual Responses**: AI responses based on specific report data
- **Source Citations**: AI lists sources used to answer questions
- **PitchLense Branded Chat**: Custom AI avatar with PitchLense logo
- **Enhanced UI**: Black text on yellow backgrounds for better readability
- **LLM Guardrails**: 
  - Confidence scoring (40-100%)
  - Hallucination detection
  - Source citation validation
  - Content moderation

### 🌐 Browser Extension
- **Chrome Extension**: Analyze pitches directly from web pages
- **Quick Analysis**: One-click analysis of startup websites
- **Gmail Integration**: Analyze pitch emails in Gmail
- **Extension Download**: Download pre-configured extension directly from the app

### 🔐 Security & Performance
- **Content Moderation**: Google Cloud Natural Language API integration
- **Rate Limiting**: 10 requests per minute for LLM endpoints
- **Response Caching**: Intelligent caching (5-30 minutes) to reduce API calls
- **Browser-Level Caching**: Day-level caching for market data
- **Secure Authentication**: PBKDF2 password hashing with salt
- **JWT Tokens**: HttpOnly cookies for session management
- **No Debug Logs**: Production-ready with no sensitive data in logs
- **CSP Headers**: Content Security Policy for XSS protection

### 🎨 Modern UI/UX
- **Dark Theme**: Professional dark mode design throughout
- **Liquid Glass Design**: Modern glassmorphism with frosted glass effects
- **Animated Components**: Smooth animations and transitions
- **Radial Navigation**: Interactive circular dock with connecting lines
- **Movie Reel Effects**: Vertical scrolling slideshows with sprocket hole effects
- **Team Showcase**: Professional team section with hover effects
- **Tech Stack Display**: Animated technology showcase with staggered animations
- **Responsive Design**: Mobile and desktop friendly
- **Loading States**: Smooth loading animations
- **Error Handling**: User-friendly error messages with SweetAlert2
- **Tooltips**: Contextual help and information
- **Centralized Navigation**: Consistent navbar across all pages

## Quickstart

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MySQL 8.0+ or Google Cloud SQL
- Google Cloud Platform account (for Gemini AI, Storage, and Natural Language API)

### Installation

1) **Install backend dependencies**

```bash
cd backend
npm install
```

2) **Set up MySQL database**

Run the database schema:
```bash
mysql -u your_user -p pitchlense < backend/database.sql
```

Or import into Cloud SQL via the GCP Console.

3) **Set up environment variables**

Create a `backend/.env` file with the following variables:

```bash
# Google AI/Gemini API
GEMINI_API_KEY=your_gemini_api_key

# Financial Modeling Prep API
FMP_API_KEY=your_fmp_api_key

# Google Cloud Storage
BUCKET=your_gcs_bucket_name
GCS_BUCKET=your_gcs_bucket_name

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
DB_PASSWORD=your_database_password
DB_HOST=your_database_host
DB_NAME=pitchlense
DB_PORT=3306
DB_SSL=true
# For Cloud SQL Unix socket connection:
# INSTANCE_UNIX_SOCKET=/cloudsql/PROJECT:REGION:INSTANCE

# JWT Secret (change in production!)
JWT_SECRET=your_secure_jwt_secret

# Email configuration (for email sharing)
GMAIL_USER=your_gmail@gmail.com
GMAIL_APP_PASSWORD=your_gmail_app_password
IMAP_USER=your_email@gmail.com
IMAP_PASSWORD=your_imap_password
IMAP_HOST=imap.gmail.com
IMAP_PORT=993
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_smtp_password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
```

### Environment Variables Explained

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini AI API key for document analysis | ✅ |
| `FMP_API_KEY` | Financial Modeling Prep API key for market data | ✅ |
| `BUCKET` / `GCS_BUCKET` | Google Cloud Storage bucket name for file storage | ✅ |
| `GOOGLE_CLOUD_PROJECT` | Your Google Cloud Project ID | ✅ |
| `CLOUD_RUN_URL` | Cloud Run service URL for AI processing | ✅ |
| `NODE_ENV` | Application environment (production/development) | ✅ |
| `GOOGLE_APPLICATION_CREDENTIALS` | Path to Google Cloud service account key | ✅ |
| `DB_USER` | MySQL database username | ✅ |
| `DB_PASSWORD` | MySQL database password | ✅ |
| `DB_HOST` | MySQL database host (Cloud SQL instance) | ✅ |
| `DB_NAME` | MySQL database name (default: pitchlense) | ✅ |
| `DB_PORT` | MySQL database port (default: 3306) | ✅ |
| `DB_SSL` | Enable SSL for database connection (true/false) | ✅ |
| `INSTANCE_UNIX_SOCKET` | Cloud SQL Unix socket path (alternative to TCP) | ⚪ |
| `JWT_SECRET` | Secret key for JWT token signing | ✅ |
| `GMAIL_USER` / `IMAP_USER` / `SMTP_USER` | Email credentials for Gmail integration | ⚪ |
| `GMAIL_APP_PASSWORD` / `IMAP_PASSWORD` / `SMTP_PASSWORD` | Email app passwords | ⚪ |

4) **Run the server**

```bash
cd backend
npm start
# Server will start on http://localhost:3000
```

5) **Access the application**

Open your browser and navigate to `http://localhost:3000`

### Database Setup

The application uses **MySQL 8.0+ or Google Cloud SQL**:

1. **Create the database**:
   ```sql
   CREATE DATABASE IF NOT EXISTS pitchlense CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

2. **Run the schema file**:
   ```bash
   mysql -u your_user -p pitchlense < backend/database.sql
   ```

3. **The schema creates 6 tables**:
   - `users` - User accounts and authentication
   - `reports` - Startup analysis reports
   - `uploads` - File uploads and documents
   - `chats` - Q&A chat history with AI
   - `investments` - Investment portfolio tracking
   - `investment_updates` - Investment update history

4. **The server will automatically**:
   - Check for missing tables on startup
   - Create necessary indexes
   - Handle foreign key constraints

### Cloud SQL Connection Options

For Google Cloud SQL, you can use either:
- **TCP connection**: Set `DB_HOST`, `DB_PORT`, `DB_SSL=true`
- **Unix socket**: Set `INSTANCE_UNIX_SOCKET=/cloudsql/PROJECT:REGION:INSTANCE`

### Development

For frontend development, edit files in `frontend/` and refresh your browser.

**Frontend Stack:**
- Tailwind CSS via CDN with custom theme
- Chart.js for data visualizations
- D3.js for knowledge graphs
- SweetAlert2 for modals and alerts
- Marked.js for markdown rendering
- jsPDF & PptxGenJS for exports

**Backend Stack:**
- Express.js web framework
- MySQL2 for database operations
- Google Gemini AI for analysis
- Google Cloud Natural Language for moderation
- Axios for external API calls
- Multer for file uploads
- Nodemailer for email functionality

## Project Structure

```
PitchLense/
├── frontend/
│   ├── index.html              # Main landing page
│   ├── auth.html               # Authentication (login/signup)
│   ├── create-report.html      # Report creation with file upload
│   ├── view-report.html        # Reports listing with search/filter
│   ├── report.html             # Individual report with analysis
│   ├── search.html             # Real-time company search & details
│   ├── market.html             # Market performance dashboard
│   ├── news.html               # Market news & intelligence
│   ├── investment.html         # Investment portfolio tracking
│   ├── founder-dna.html        # Founder LinkedIn analysis
│   ├── email.html              # Gmail integration
│   ├── meeting-assistant.html  # Meeting recording analysis
│   ├── networking.html         # Networking features (coming soon)
│   ├── extension.html          # Browser extension download
│   ├── main.jsx                # React components
│   ├── styles.css              # Custom styles and theme
│   └── static/
│       ├── navbar.js           # Centralized navigation
│       ├── cache-util.js       # Browser caching utilities
│       ├── news.js             # News page functionality
│       ├── search.js           # Search page functionality
│       ├── investment.js       # Investment tracking functionality
│       └── *.svg               # Logo and icons
├── backend/
│   ├── server.js               # Express server with all API routes
│   ├── database.sql            # Complete database schema
│   ├── package.json            # Backend dependencies
│   └── .env                    # Environment variables (create this)
├── extension/
│   ├── manifest.json           # Chrome extension manifest
│   ├── popup.html              # Extension popup UI
│   ├── background.js           # Extension background script
│   ├── content.js              # Content script for page analysis
│   └── gmail-content.js        # Gmail integration script
├── docker-compose.yml          # Docker configuration
├── Dockerfile                  # Container setup
├── nginx.conf                  # Nginx reverse proxy config
├── deploy.sh                   # Deployment automation script
├── DEPLOYMENT.md               # Deployment guide
├── CONTRIBUTING.md             # Contribution guidelines
└── README.md                   # This file
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user info

### Reports
- `GET /api/reports` - List user reports (with pagination, search, filters)
- `POST /api/reports` - Create new report with file uploads
- `GET /api/reports/:id` - Get single report
- `GET /api/reports/:id/data` - Get report analysis data from GCS
- `GET /api/reports/:id/uploads` - Get report uploaded files
- `GET /api/reports/:id/uploads/:index/download` - Download specific file
- `POST /api/reports/share-email` - Share report via email
- `PATCH /api/reports/:id/pin` - Pin/unpin report
- `DELETE /api/reports/:id` - Soft delete report

### Q&A / Chat
- `POST /api/qna/ask` - Ask question about report (with LLM guardrails)
- `GET /api/qna/history/:reportId` - Get chat history for report

### Analysis
- `POST /api/analyze` - Analyze pitch content (for extension)
- `POST /api/analyze-email` - Analyze email pitch content
- `POST /api/analyze-founder` - Analyze founder LinkedIn PDF

### Market News (FMP API Integration)
- `GET /api/news?type=general|stock|crypto|forex` - Get market news
- `GET /api/news/insider-trades` - Get insider trading data
- `GET /api/news/crowdfunding` - Get crowdfunding campaigns
- `GET /api/news/equity-offerings` - Get equity offerings (Form D)
- `GET /api/news/acquisition-ownership` - Get beneficial ownership data

### Company Search & Data (FMP API Integration)
- `GET /api/search/fmp?query=AAPL` - Real-time symbol search
- `GET /api/company/profile/:symbol` - Company profile data
- `GET /api/company/financials/:symbol` - Financial statements & metrics
- `GET /api/company/additional/:symbol` - Employee count, executives, dividends
- `GET /api/company/news/:symbol` - Company press releases

### Investments
- `POST /api/investments` - Create new investment
- `GET /api/investments` - List user investments (with filters, search, sorting)
- `GET /api/investments/:id` - Get investment details
- `PUT /api/investments/:id` - Update investment
- `DELETE /api/investments/:id` - Soft delete investment
- `POST /api/investments/:id/updates` - Add investment update
- `GET /api/investments/:id/updates` - Get investment update history
- `GET /api/investments/:id/metrics` - Get calculated investment metrics

### Email Integration
- `POST /api/emails/fetch` - Fetch emails from Gmail
- `POST /api/emails/send` - Send email via Gmail
- `POST /api/emails/create-report` - Create report from email
- `GET /api/emails/attachment/:uid/:filename` - Download email attachment

### Extension
- `GET /api/extension/download` - Download Chrome extension as zip

### Utilities
- `GET /health` - Health check endpoint
- `GET /api/github/repos` - Search GitHub repositories
- `GET /api/hackernews/top` - Get top Hacker News stories

## UI Pages

### Core Pages
- **`/`** - Landing page with project overview and hero section
- **`/auth.html`** - Authentication (login/signup) with secure PBKDF2 hashing
- **`/create-report.html`** - Multi-file upload with drag & drop
- **`/view-report.html`** - Reports dashboard with search, filter, and pagination
- **`/report.html`** - Comprehensive report view:
  - Growth potential scoring & breakdown
  - Startup analysis by category
  - Interactive knowledge graph (D3.js)
  - File viewer (PDF, images, PPTX support)
  - AI-powered Q&A chat
  - PDF/PPTX export
  - Email sharing

### Market Data Pages
- **`/search.html`** - Real-time company search with comprehensive financial data
- **`/market.html`** - Market performance dashboard with charts
- **`/news.html`** - Market news, insider trades, crowdfunding, equity offerings

### Investment & Analysis Pages
- **`/investment.html`** - Portfolio tracking and investment management
- **`/founder-dna.html`** - LinkedIn profile analysis for founders
- **`/email.html`** - Gmail integration for pitch email analysis
- **`/meeting-assistant.html`** - Meeting recording analysis
- **`/networking.html`** - Networking features (coming soon)

### Extension & Tools
- **`/extension.html`** - Download browser extension

## Technology Stack

### Frontend
- **HTML5, CSS3, JavaScript (ES6+)**: Modern web standards
- **Tailwind CSS**: Utility-first CSS framework (CDN)
- **Chart.js**: Interactive charts and graphs
- **D3.js**: Knowledge graph visualizations
- **SweetAlert2**: Beautiful alerts and modals
- **Marked.js**: Markdown rendering for AI responses
- **jsPDF & PptxGenJS**: Export functionality

### Backend
- **Node.js & Express.js**: Server framework
- **MySQL2**: Database driver with connection pooling
- **Google Gemini AI**: AI-powered analysis and Q&A
- **Google Cloud Natural Language**: Content moderation
- **Google Cloud Storage**: File storage
- **Financial Modeling Prep (FMP)**: Market data API
- **Axios**: HTTP client for API calls
- **Multer**: File upload handling
- **Nodemailer**: Email functionality
- **JWT**: Secure authentication
- **bcryptjs**: Password hashing

### Database
- **MySQL 8.0+**: Primary database (Cloud SQL compatible)
- **6 Tables**: users, reports, uploads, chats, investments, investment_updates
- **Foreign Keys**: Proper relational constraints
- **Indexes**: Optimized queries on common columns
- **UTF8MB4**: Full Unicode support

### Security
- **PBKDF2**: Client-side password hashing
- **JWT with httpOnly cookies**: Secure session management
- **Content Security Policy (CSP)**: XSS protection
- **Rate Limiting**: Prevents API abuse
- **LLM Guardrails**: AI response validation
- **Input Sanitization**: Prevents injection attacks

## Recent Updates

### 🚀 Latest Features (2025)

#### **Enhanced UI/UX Design**
- **Liquid Glass Theme**: Modern glassmorphism design with frosted glass effects
- **Radial Dock Navigation**: Interactive circular navigation with 8 key features and connecting lines
- **Movie Reel Slideshows**: Animated vertical slideshows showcasing platform capabilities
- **Team Showcase**: Professional team section with hover effects and social links
- **Tech Stack Animation**: Staggered animations for technology showcase
- **Enhanced Landing Page**: Creative, animated, and innovative content presentation

#### **Meeting Assistant Improvements**
- **Enhanced File Support**: MP4, WebM, MOV format support (up to 100MB)
- **Scrollable Results**: 80% viewport height for transcript and summary sections
- **Dual File Downloads**: Separate transcript.txt and summary.txt files
- **Professional Email Templates**: HTML-formatted email reports with branding
- **Bottom Dock Interface**: Floating action dock with download and email buttons
- **Email Modal**: Interactive email input with validation and sending status

#### **AI Chat Enhancements**
- **PitchLense Branding**: Custom AI avatar with PitchLense logo
- **Improved Readability**: Black text on yellow backgrounds for better contrast
- **Enhanced Tooltips**: Email addresses shown in hover tooltips
- **Professional Presentation**: Consistent branding throughout

#### **Market Intelligence Integration**
- Integrated Financial Modeling Prep (FMP) API for real-time market data
- Added comprehensive company search with 15+ data endpoints
- Implemented market performance dashboard with commodities, treasury rates, economic indicators
- Added market news tabs: General, Stock, Crypto, Forex news
- Added insider trading, crowdfunding, and equity offering tracking

#### **Investment Portfolio Tracking**
- Full investment portfolio management system
- Track investment amounts, equity, valuations, and ROI
- Investment update history with additional rounds tracking
- Dashboard with analytics and visualizations

#### **Enhanced Analysis Features**
- Founder DNA analysis from LinkedIn PDFs
- Email pitch analysis with Gmail integration
- Meeting assistant for call/meeting recordings
- Interactive knowledge graphs for ecosystem visualization

#### **Performance & Caching**
- Day-level browser caching for market data
- Server-side response caching (5-30 minutes)
- Debounced search to reduce API calls
- Parallel API calls with Promise.allSettled

#### **Security Enhancements**
- Removed all debug console.log statements (~420+ cleaned)
- Added LLM guardrails with confidence scoring
- Content moderation with Google Cloud Natural Language API
- Production-ready with no sensitive data exposure

#### **UI/UX Improvements**
- Centralized navbar across all pages
- Real-time search with instant results
- Quick search buttons for top companies
- Data availability indicators
- Enhanced error handling with graceful fallbacks
- PDF viewer improvements for Microsoft Edge

### 🗄️ Database & Architecture
- **MySQL/Cloud SQL**: Complete migration from SQLite
- **6 Tables**: Comprehensive schema with foreign keys
- **Connection Pooling**: Enhanced performance and scalability
- **User Data Isolation**: Secure multi-tenant architecture
- **Consolidated Schema**: Single database.sql file for easy setup

### 🏆 Hackathon & Team
- **Hack2Skill - Google Hackathon**: Developed as part of the prestigious Hack2Skill - Google Hackathon
- **Team Members**:
  - **Aman Ulla**: Full Stack AI Engineer, Architect
    - GitHub: [connectaman](https://github.com/connectaman)
    - LinkedIn: [connectaman](https://www.linkedin.com/in/connectaman/)
    - Blog: [Hashnode](https://connectaman.hashnode.dev/)
    - Email: connectamanulla@gmail.com
  - **Srinivas Alva**: Backend Developer & Data Scientist
- **Tech Stack**: React, Node.js, Python, Gemini, GCP Cloud, Docker, GitHub, Perplexity, SerpAPI, Vertex AI
- **Project Links**:
  - [YouTube Tutorial](https://youtu.be/XUuLeXaEIdI)
  - [Website](https://www.pitchlense.com/)
  - [GitHub Repository](https://github.com/connectaman/PitchLense)
  - [MCP Repository](https://github.com/connectaman/Pitchlense-mcp)
  - [PyPI Package](https://pypi.org/project/pitchlense-mcp/)
  - [Documentation](https://pitchlense-mcp.readthedocs.io/en/latest/api.html)

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
4. Open `http://localhost:3000` in your browser

For more detailed information, please read our [Contributing Guidelines](CONTRIBUTING.md).

## Support

For support and questions, please refer to the built-in documentation in the application or create an issue in the repository.

