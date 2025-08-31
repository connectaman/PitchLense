"""
Main FastAPI application for AI Analyst for Startup Evaluation
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from .api.v1.api import api_router
from .core.config import settings

from dotenv import load_dotenv
load_dotenv()

app = FastAPI(
    title=settings.APP_NAME,
    description="AI Analyst for Startup Evaluation Platform",
    version="1.0.0",
    debug=settings.DEBUG
)

# Add middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["*"]  # Configure appropriately for production
)

# Include API routes
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
def read_root():
    """Root endpoint."""
    return {"message": "Welcome to PitchLense API"}

@app.get("/health")
def health_check():
    """Basic health check."""
    return {"status": "healthy"}

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Global HTTP exception handler."""
    return {"error": exc.detail, "status_code": exc.status_code}

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """Global exception handler."""
    return {"error": "Internal server error", "status_code": 500}
