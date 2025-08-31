"""
Database initialization script
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
from app.core.database import Base
from app.models import User, Report, Upload


def init_db():
    """Initialize the database with all tables"""
    
    # Create engine based on environment
    if settings.NODE_ENV == "local":
        # Use SQLite for local development
        database_url = "sqlite:///./pitchlense.db"
        engine = create_engine(
            database_url,
            connect_args={"check_same_thread": False}  # Needed for SQLite
        )
    else:
        # Use environment DATABASE_URL for production/other environments
        engine = create_engine(
            settings.DATABASE_URL,
            pool_pre_ping=True,
            pool_recycle=300
        )
    
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    print(f"Database initialized with URL: {database_url if settings.NODE_ENV == 'local' else settings.DATABASE_URL}")
    print("Tables created: users, reports, uploads")


def drop_db():
    """Drop all tables (use with caution)"""
    
    # Create engine based on environment
    if settings.NODE_ENV == "local":
        database_url = "sqlite:///./pitchlense.db"
        engine = create_engine(
            database_url,
            connect_args={"check_same_thread": False}
        )
    else:
        engine = create_engine(
            settings.DATABASE_URL,
            pool_pre_ping=True,
            pool_recycle=300
        )
    
    # Drop all tables
    Base.metadata.drop_all(bind=engine)
    
    print("All tables dropped")


if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1 and sys.argv[1] == "drop":
        drop_db()
    else:
        init_db()
