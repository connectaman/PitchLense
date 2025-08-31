"""
Test script for database operations
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.init_db import init_db
from app.core.database import SessionLocal
from app.crud import user_crud, report_crud, upload_crud
from app.schemas import UserCreate, ReportCreate, UploadCreate
import uuid


def test_database_operations():
    """Test basic CRUD operations"""
    
    # Initialize database
    print("Initializing database...")
    init_db()
    
    # Create database session
    db = SessionLocal()
    
    try:
        # Test User CRUD
        print("\n=== Testing User CRUD ===")
        
        # Create user
        user_data = UserCreate(
            user_firstname="John",
            user_lastname="Doe",
            user_email="john.doe@example.com"
        )
        user = user_crud.create(db, obj_in=user_data)
        print(f"Created user: {user.full_name} ({user.user_id})")
        
        # Get user by email
        user_by_email = user_crud.get_by_email(db, email="john.doe@example.com")
        print(f"Found user by email: {user_by_email.full_name}")
        
        # Test Report CRUD
        print("\n=== Testing Report CRUD ===")
        
        # Create report
        report_data = ReportCreate(
            report_name="Startup Analysis Report",
            startup_name="TechCorp",
            founder_name="Jane Smith",
            report_path="/reports/techcorp_analysis.pdf"
        )
        report = report_crud.create(db, obj_in=report_data)
        print(f"Created report: {report.report_name} ({report.report_id})")
        
        # Get report by ID
        report_by_id = report_crud.get(db, report_id=str(report.report_id))
        print(f"Found report by ID: {report_by_id.report_name}")
        
        # Test Upload CRUD
        print("\n=== Testing Upload CRUD ===")
        
        # Create upload
        upload_data = UploadCreate(
            user_id=str(user.user_id),
            report_id=report.report_id,
            filename="pitch_deck.pdf",
            file_format="pdf",
            upload_path="/uploads/pitch_deck.pdf"
        )
        upload = upload_crud.create(db, obj_in=upload_data)
        print(f"Created upload: {upload.filename} ({upload.file_id})")
        
        # Get uploads by report
        uploads = upload_crud.get_by_report(db, report_id=str(report.report_id))
        print(f"Found {len(uploads)} upload(s) for report")
        
        # Test search functionality
        print("\n=== Testing Search ===")
        
        # Search users
        users = user_crud.search(db, search_term="John")
        print(f"Found {len(users)} user(s) matching 'John'")
        
        # Search reports
        reports = report_crud.search(db, search_term="TechCorp")
        print(f"Found {len(reports)} report(s) matching 'TechCorp'")
        
        print("\n=== All tests completed successfully! ===")
        
    except Exception as e:
        print(f"Error during testing: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    test_database_operations()
