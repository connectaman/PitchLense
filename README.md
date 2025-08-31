# AI Analyst for Startup Evaluation

An AI-powered analyst platform that evaluates startups by synthesizing founder materials and public data to generate concise, actionable investment insights.

## 🚀 Features

- **Document Analysis**: Ingest pitch decks, call transcripts, founder updates, and emails to generate structured deal notes
- **Benchmarking**: Compare startups against sector peers using financial multiples, hiring data, and traction signals
- **Risk Assessment**: Flag potential risk indicators like inconsistent metrics, inflated market size, or unusual churn patterns
- **Investment Insights**: Generate investor-ready recommendations with customizable weightages

## 🏗️ Architecture

- **Frontend**: React.js with modern UI components
- **Backend**: Python FastAPI for robust API development
- **AI Integration**: Google AI technologies (Gemini, Vertex AI, Cloud Vision, BigQuery)
- **Deployment**: Single Docker container for easy deployment

## 📁 Project Structure

```
PitchLense/
├── frontend/                 # React.js frontend application
│   ├── public/              # Static assets
│   ├── src/                 # Source code
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── utils/          # Utility functions
│   │   └── styles/         # CSS/styling files
│   ├── package.json        # Frontend dependencies
│   └── Dockerfile          # Frontend Docker configuration
├── backend/                 # Python FastAPI backend
│   ├── app/                # Application code
│   │   ├── api/            # API routes
│   │   ├── core/           # Core configuration
│   │   ├── models/         # Data models
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utility functions
│   ├── requirements.txt    # Python dependencies
│   └── Dockerfile          # Backend Docker configuration
├── docker-compose.yml      # Multi-container setup
├── Dockerfile              # Main Docker configuration
└── README.md              # This file
```

## 🛠️ Tech Stack

### Frontend
- React.js 18+
- TypeScript
- Tailwind CSS
- Axios for API calls
- React Router for navigation

### Backend
- Python 3.11+
- FastAPI
- Pydantic for data validation
- SQLAlchemy for database operations
- Google AI SDK

### Infrastructure
- Docker & Docker Compose
- Nginx for reverse proxy
- PostgreSQL (optional for production)

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)
- Python 3.11+ (for local development)

### Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd PitchLense
   ```

2. **Build and run with Docker**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Environment Setup

1. **Set up environment variables**
   ```bash
   # Option 1: Use the setup script (recommended)
   chmod +x setup-env.sh
   ./setup-env.sh
   
   # Option 2: Manual setup
   cp env.template .env
   # Edit .env with your configuration
   ```

2. **Configure your environment**
   - Copy `env.template` to `.env`
   - Update the values in `.env` with your actual configuration
   - See [Environment Setup Guide](ENVIRONMENT_SETUP.md) for detailed instructions

### Local Development

1. **Backend Setup**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm start
   ```

## 📚 API Documentation

Once the backend is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Backend Configuration
DATABASE_URL=postgresql://user:password@localhost/dbname
GOOGLE_AI_API_KEY=your_google_ai_api_key
SECRET_KEY=your_secret_key

# Frontend Configuration
REACT_APP_API_URL=http://localhost:8000
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏆 Hackathon Project

This project was built for the LVX LetsVenture hackathon, focusing on AI-powered startup evaluation and investment insights generation.
