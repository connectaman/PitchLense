"""
Test script to check database query for pinned reports
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal
from app.models.report import Report
from app.crud.report import report_crud
from sqlalchemy import and_

def test_db_pinned_query():
    """Test the database query for pinned reports directly"""
    
    db = SessionLocal()
    try:
        print("Testing database query for pinned reports...")
        
        # Test the CRUD function
        print("\n1. Testing CRUD get_pinned function:")
        pinned_reports = report_crud.get_pinned(db, skip=0, limit=100)
        print(f"   CRUD get_pinned returned {len(pinned_reports)} reports")
        
        # Test direct database query
        print("\n2. Testing direct database query:")
        direct_pinned = db.query(Report).filter(
            and_(Report.is_pinned == True, Report.is_delete == False)
        ).all()
        print(f"   Direct query returned {len(direct_pinned)} reports")
        
        # Test all reports
        print("\n3. Testing all reports:")
        all_reports = db.query(Report).filter(Report.is_delete == False).all()
        print(f"   All reports: {len(all_reports)}")
        
        # Count pinned reports manually
        pinned_count = sum(1 for report in all_reports if report.is_pinned)
        print(f"   Pinned reports (manual count): {pinned_count}")
        
        # Print details of all reports
        print("\n4. All reports details:")
        for report in all_reports:
            print(f"   {report.report_id}: {report.startup_name} - Pinned: {report.is_pinned}")
        
        # Print details of pinned reports
        print("\n5. Pinned reports details:")
        for report in pinned_reports:
            print(f"   {report.report_id}: {report.startup_name} - Pinned: {report.is_pinned}")
            
        return len(pinned_reports) > 0
        
    finally:
        db.close()

if __name__ == "__main__":
    test_db_pinned_query()
