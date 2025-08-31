"""
Pytest configuration and fixtures for PitchLense backend tests
"""

import pytest
import tempfile
import os
from typing import Generator
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.core.database import get_db, Base
from app.models.user import User
from app.models.report import Report, ReportStatus
from app.models.upload import Upload


# Create in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def db_session():
    """Create a fresh database session for each test"""
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    # Create session
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        # Drop tables
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db_session):
    """Create a test client with database dependency override"""
    def override_get_db():
        try:
            yield db_session
        finally:
            pass
    
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def sample_user(db_session):
    """Create a sample user for testing"""
    user = User(
        user_id="test-user-123",
        user_firstname="John",
        user_lastname="Doe",
        user_email="john.doe@example.com"
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture
def sample_report(db_session):
    """Create a sample report for testing"""
    report = Report(
        report_id="test-report-123",
        report_name="Test Startup Report",
        startup_name="Test Startup",
        founder_name="John Doe",
        status=ReportStatus.PENDING,
        is_delete=False,
        is_pinned=False
    )
    db_session.add(report)
    db_session.commit()
    db_session.refresh(report)
    return report


@pytest.fixture
def sample_upload(db_session, sample_report):
    """Create a sample upload for testing"""
    upload = Upload(
        file_id="test-file-123",
        user_id="test-user-123",
        report_id=sample_report.report_id,
        filename="test_document.pdf",
        file_format="pitch deck",
        upload_path="/uploads/test_document.pdf"
    )
    db_session.add(upload)
    db_session.commit()
    db_session.refresh(upload)
    return upload


@pytest.fixture
def temp_upload_dir():
    """Create a temporary directory for file uploads during testing"""
    with tempfile.TemporaryDirectory() as temp_dir:
        yield temp_dir


@pytest.fixture
def sample_file():
    """Create a sample file for upload testing"""
    with tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False) as f:
        f.write("This is a test document content.")
        temp_file_path = f.name
    
    try:
        yield temp_file_path
    finally:
        if os.path.exists(temp_file_path):
            os.unlink(temp_file_path)
