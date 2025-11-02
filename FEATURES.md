# PitchLense Features Documentation

Complete guide to all features available in PitchLense.

## 📊 Core Analysis Features

### 1. Startup Report Analysis
**Page:** `/create-report.html` → `/report.html`

Upload and analyze startup pitch materials:
- **Multi-file upload**: Drag & drop support for multiple documents
- **File types supported**:
  - Pitch Deck (PDF, PPTX)
  - Call Recording (MP3, WAV)
  - Meeting Recording (MP3, WAV, MP4)
  - Founder Profile (PDF)
  - News Report (PDF, DOCX)
  - Company Document (PDF, DOCX)
- **AI-Powered Analysis**: Google Gemini AI analyzes all uploaded content
- **Growth Potential Score**: 1-10 scale with risk level (Low/Medium/High)
- **Category Analysis**: Risk assessment across multiple dimensions
- **Knowledge Graph**: Interactive D3.js visualization of startup ecosystem
- **File Viewer**: Built-in viewer for all uploaded documents

### 2. AI-Powered Q&A
**Page:** `/report.html` (Chat tab)

Ask questions about your startup reports:
- **Contextual Responses**: AI answers based on your uploaded documents
- **Chat History**: Persistent conversation history per report
- **Source Citations**: AI lists which files were used to answer
- **LLM Guardrails**:
  - Confidence scoring (40-100%)
  - Hallucination detection
  - Source citation validation
  - Response sanitization
- **Markdown Support**: Formatted AI responses with code blocks, lists, etc.

### 3. Export & Sharing
**Page:** `/report.html` (Share dropdown)

Share your analysis reports:
- **PDF Export**: Professional PDF with charts and analysis
- **PPTX Export**: PowerPoint presentation with slides
- **Email Sharing**: Send formatted HTML report via email
- **File Downloads**: Download all uploaded documents

---

## 🔍 Market Intelligence Features

### 4. Real-Time Company Search
**Page:** `/search.html`

Search and analyze any public company:
- **Real-time Search**: Type-ahead search after 2 characters (debounced)
- **Quick Search**: One-click access to top 10 companies
- **Comprehensive Data**:
  - Company profile (description, sector, industry, CEO, etc.)
  - Stock price KPIs (price, volume, beta, dividend, 52-week range)
  - Financial charts (Revenue, Net Income, Assets, Liabilities)
  - Financial tables (detailed income statement & balance sheet)
  - Key executives with titles and compensation
  - Dividend history with yield and frequency
  - Latest press releases
- **Data Availability Status**: Visual indicator showing which sections have data
- **Error Handling**: Graceful handling of API failures with user-friendly messages

### 5. Market Performance Dashboard
**Page:** `/market.html`

Monitor market performance across multiple dimensions:
- **Commodities KPIs**: Real-time pricing for 40 commodities (Gold, Silver, Oil, Copper, etc.)
- **Top Gainers & Losers**: Daily movers with bar charts
- **Treasury Rates**: Full US Treasury yield curve (1M to 30Y)
- **Economic Indicators**:
  - GDP and Real GDP per Capita trends
  - Inflation rate tracking
  - Unemployment rate
  - Recession probability indicators
- **Sector Performance**: Historical sector performance (Energy example)
- **Industry Performance**: Industry-specific tracking (Biotechnology example)
- **Sector P/E Ratios**: Historical P/E ratio analysis
- **All Visualized**: Chart.js line charts, bar charts, and KPI cards

### 6. Market News & Intelligence
**Page:** `/news.html`

Stay updated with market news:
- **General News**: Latest financial market news
- **Stock News**: Company-specific updates
- **Crypto News**: Cryptocurrency market news
- **Forex News**: Foreign exchange updates
- **Insider Trading**: SEC Form 4 filings with real-time insider transactions
- **Crowdfunding Campaigns**: Regulation CF offerings with financial details
- **Equity Offerings**: Form D filings with fundraising details
- **Acquisition Ownership**: Schedule 13D/13G beneficial ownership disclosures
  - Quick search for top 50 companies
  - Duplicate detection and removal
  - Detailed ownership percentage tracking
- **Day-Level Caching**: Browser caching to reduce API calls

---

## 💼 Investment Management Features

### 7. Investment Portfolio Tracking
**Page:** `/investment.html`

Track and manage your startup investments:
- **Portfolio Overview**: Dashboard with total investments and metrics
- **Investment Details**:
  - Investment amount and date
  - Equity percentage
  - Company valuation
  - Funding round information
  - Investment type (Equity, Convertible Note, SAFE)
  - Status (Active, Exited, Failed)
- **Update Tracking**:
  - Additional investment rounds
  - Valuation changes
  - Equity dilution tracking
  - ROI calculations
  - Exit events
- **Portfolio Management**:
  - Add/Edit/Delete investments
  - Search by startup or investor name
  - Filter by status
  - Sort by date, amount, or status
- **Analytics Dashboard**: Visual charts and metrics

---

## 🧬 Founder & Team Analysis

### 8. Founder DNA Analysis
**Page:** `/founder-dna.html`

Evaluate founder potential from LinkedIn profiles:
- **PDF Upload**: Upload LinkedIn profile PDFs
- **AI Evaluation**:
  - Overall founder score (1-10)
  - Education quality (1-10)
  - Work experience assessment (1-10)
  - Leadership potential (1-10)
  - Technical expertise (1-10)
  - Startup experience (1-10)
  - Domain expertise (1-10)
- **Risk Flags**:
  - Red flags: Critical concerns
  - Yellow flags: Areas to watch
  - Green strengths: Key advantages
- **Detailed Analysis**:
  - Career trajectory evaluation
  - Education background analysis
  - Leadership experience
  - Technical skills assessment
  - Industry connections
- **Actionable Insights**: Specific recommendations and concerns

---

## 📧 Email & Communication Features

### 9. Gmail Integration
**Page:** `/email.html`

Analyze pitch emails and manage communications:
- **Email Fetching**: Connect and fetch emails from Gmail
- **Pitch Analysis**: AI evaluates pitch emails for quality
- **Startup Extraction**: Automatically extracts:
  - Startup name
  - Founder name
  - Launch date
  - Industry/sector
  - Website
  - Funding ask
- **Report Creation**: Generate reports directly from email content
- **Attachment Handling**: Process email attachments
- **Email Sending**: Send emails directly from the platform

### 10. Meeting Assistant
**Page:** `/meeting-assistant.html`

Analyze and summarize meeting recordings:
- **File Upload**: Upload audio/video meeting recordings
- **Transcription**: Automatic speech-to-text conversion
- **AI Summary**: Key insights and action items
- **Startup Information**: Extract relevant startup details
- **Report Integration**: Link meetings to startup reports

---

## 🌐 Browser Extension

### 11. Chrome Extension
**Page:** `/extension.html`

Analyze pitches anywhere on the web:
- **Quick Analysis**: One-click analysis of any web page
- **Gmail Integration**: Analyze pitch emails in Gmail inbox
- **Popup Interface**: Compact UI for quick insights
- **Content Script**: Automatically detects and extracts pitch content
- **Background Processing**: Seamless analysis without leaving the page
- **Download**: Get pre-configured extension zip file

**Extension Features:**
- Analyze startup websites
- Analyze Gmail pitch emails
- Quick scoring and feedback
- Integration with main platform

---

## 🔒 Security & Performance Features

### 12. Authentication & User Management
**Pages:** `/auth.html`

Secure user accounts:
- **PBKDF2 Password Hashing**: Client-side hashing with salt
- **JWT Tokens**: HttpOnly cookies for session management
- **User Isolation**: Each user sees only their own data
- **Foreign Key Constraints**: Proper data relationships
- **Secure Password Reset**: (Coming soon)

### 13. LLM Guardrails
**Backend feature for all AI endpoints**

Ensure AI response quality:
- **Confidence Scoring**: 0-100% confidence calculation
- **Hallucination Detection**: Identifies fabricated information
- **Source Citation Validation**: Ensures AI cites actual sources
- **Content Moderation**: Google Cloud Natural Language API
- **Response Format Validation**: Ensures proper structure
- **Professionalism Check**: Detects informal language
- **Low Confidence Rejection**: Blocks responses below 40% confidence

### 14. Caching & Performance
**Throughout application**

Optimize performance and reduce costs:
- **Browser-Level Caching**: 
  - Day-level caching for market data
  - Reduces API calls
  - Uses localStorage
- **Server-Side Caching**:
  - 5-30 minute TTL for different endpoints
  - Cache invalidation on updates
  - Memory-based with cleanup
- **Rate Limiting**: 10 requests/minute for LLM endpoints
- **Debounced Search**: 300ms debounce for real-time search
- **Parallel API Calls**: Promise.allSettled for concurrent requests
- **Connection Pooling**: MySQL connection pool (10 connections)

### 15. Error Handling
**Throughout application**

Graceful error management:
- **User-Friendly Messages**: Clear error explanations with SweetAlert2
- **Fallback UI**: Show alternative content when data unavailable
- **API Retry Logic**: Automatic retries for transient failures
- **Error Logging**: Console.error for critical issues (no debug logs)
- **Validation**: Input validation on both client and server
- **404 Handling**: Proper not found pages

---

## 🎨 UI/UX Features

### 16. Centralized Navigation
**Component:** `navbar.js`

Consistent navigation across all pages:
- **Icon-Based Sidebar**: Compact navigation with tooltips
- **Active Page Highlighting**: Visual indicator of current page
- **Quick Access**: One-click navigation to all features
- **User Profile**: Email display in header
- **Sign Out**: Accessible from all pages

### 17. Responsive Design
**All pages**

Mobile and desktop optimized:
- **Responsive Layouts**: Adapts to screen size
- **Mobile Navigation**: Optimized for mobile devices
- **Touch-Friendly**: Large tap targets
- **Fluid Typography**: Readable text at all sizes

### 18. Dark Theme
**All pages**

Professional dark mode design:
- **Custom Color Palette**:
  - Background: `#1E1E21`
  - Surface: `#2E3137`
  - Accent: `#f1d85b` (yellow)
  - Text: `#ffffff`
- **Glassmorphism**: Modern glass-like UI elements
- **Consistent Design**: Same theme across all pages
- **High Contrast**: Accessible color ratios

---

## 🔮 Upcoming Features

### Networking (Coming Soon)
**Page:** `/networking.html`

Connect with investors and founders:
- Placeholder page created
- Features to be announced

---

## Feature Comparison Matrix

| Feature | Available | API Used | Caching |
|---------|-----------|----------|---------|
| Startup Analysis | ✅ | Gemini AI | 30 min |
| Q&A Chat | ✅ | Gemini AI | 10 min |
| Company Search | ✅ | FMP | None |
| Market News | ✅ | FMP | 1 day |
| Market Performance | ✅ | FMP | 1 day |
| Investment Tracking | ✅ | Database | None |
| Founder DNA | ✅ | Gemini AI | None |
| Email Analysis | ✅ | Gemini AI + Gmail | 30 min |
| Meeting Assistant | ✅ | Gemini AI | None |
| Browser Extension | ✅ | Gemini AI | None |
| PDF Export | ✅ | jsPDF | None |
| PPTX Export | ✅ | PptxGenJS | None |
| Email Sharing | ✅ | Nodemailer | None |
| Networking | 🔜 | TBD | TBD |

---

## Feature Usage Tips

### Best Practices

1. **For Startup Analysis**:
   - Upload multiple file types for comprehensive analysis
   - Include pitch deck + founder profile for best results
   - Use Q&A to deep-dive into specific areas

2. **For Market Research**:
   - Use Search page for company deep-dives
   - Check Market page for broader economic trends
   - Monitor News page for breaking updates
   - Use quick search buttons for frequent lookups

3. **For Investment Tracking**:
   - Add investments immediately after closing
   - Record updates regularly (valuations, additional rounds)
   - Use filters to segment portfolio by status
   - Export data regularly for backup

4. **For Due Diligence**:
   - Combine Founder DNA + Company Search + News
   - Check insider trading for unusual activity
   - Review equity offerings for competitive funding
   - Use meeting assistant to document DD calls

### Performance Tips

- Enable browser caching for faster loads
- Use quick search buttons to avoid typing
- Pin frequently accessed reports
- Clear old chat history periodically
- Use filters to narrow down large datasets

---

## Technical Limitations

### API Rate Limits
- **FMP API**: Depends on your subscription plan
- **Gemini AI**: Subject to Google's quotas
- **LLM Endpoints**: 10 requests/minute per user (configurable)

### Data Retention
- **Browser Cache**: 1 day for market data
- **Server Cache**: 5-30 minutes depending on endpoint
- **Database**: Unlimited (soft deletes with `is_deleted` flag)

### File Uploads
- **Max File Size**: Configured in backend (default: varies by type)
- **Supported Formats**: PDF, PPTX, DOCX, MP3, WAV, MP4, PNG, JPG
- **Storage**: Google Cloud Storage (unlimited with GCS)

---

## Feature Roadmap

### Planned Features
- 🔜 **Networking**: Connect with investors and founders
- 🔜 **Portfolio Analytics**: Advanced ROI calculations and benchmarking
- 🔜 **Alerts**: Real-time notifications for insider trades, news
- 🔜 **Mobile App**: Native iOS and Android apps
- 🔜 **Collaborative Reports**: Share and collaborate on analysis
- 🔜 **Custom Scoring**: Configure your own risk scoring models
- 🔜 **API Access**: REST API for programmatic access
- 🔜 **Bulk Upload**: Analyze multiple startups at once

### Under Consideration
- Integration with CRM systems
- Automated report scheduling
- Custom webhooks for events
- Team collaboration features
- Advanced data export (CSV, Excel)
- Integration with Airtable, Notion
- Calendar integration for meeting scheduling

---

## Need Help?

- 📚 Check the in-app documentation modal
- 🎥 Watch the [YouTube tutorial](https://youtu.be/J8Bp4um6UfA?si=95QvK70f61o1J5BQ)
- 🌐 Visit [pitchlense.com](https://www.pitchlense.com/)
- 📖 Read [DEPLOYMENT.md](DEPLOYMENT.md) for setup help
- 🤝 See [CONTRIBUTING.md](CONTRIBUTING.md) to contribute

