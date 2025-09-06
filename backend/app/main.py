"""
Main FastAPI application for AI Analyst for Startup Evaluation
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import inspect, text
from .core.database import settings as _settings_maybe  # not used, preserve imports
from .api.v1.api import api_router
from .core.config import settings
from .core.database import engine
from .core.logging_config import init_logging
from .middleware.logging_middleware import LoggingMiddleware
import logging

from dotenv import load_dotenv
load_dotenv()

# Initialize logging before the app starts handling requests
init_logging(service_name=settings.APP_NAME)

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

# Request logging middleware
app.add_middleware(LoggingMiddleware)

# Simple startup migration to add missing columns
@app.on_event("startup")
def run_startup_migrations():
    try:
        with engine.connect() as conn:
            inspector = inspect(conn)
            columns = [col["name"] for col in inspector.get_columns("reports")]
            if "launch_date" not in columns:
                conn.execute(text("ALTER TABLE reports ADD COLUMN launch_date VARCHAR(50)"))
                conn.commit()
                logging.info("Added missing column 'launch_date' to 'reports' table")
    except Exception as e:
        # Do not block startup; just log
        logging.exception("Startup migration skipped or failed: %s", e)

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
    logging.warning(
        "HTTPException status=%s method=%s path=%s detail=\"%s\"",
        exc.status_code,
        getattr(request, "method", ""),
        getattr(request, "url", type("obj", (), {"path": ""})) .path,
        exc.detail,
    )
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.detail, "status_code": exc.status_code}
    )

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """Global exception handler."""
    logging.exception(
        "Unhandled exception method=%s path=%s",
        getattr(request, "method", ""),
        getattr(request, "url", type("obj", (), {"path": ""})) .path,
    )
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error", "status_code": 500}
    )
