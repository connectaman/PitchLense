"""
Script to check pinned reports in database
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal
from app.models.report import Report
from sqlalchemy import and_

def check_pinned_reports():
    """Check pinned reports in database"""
    
    db = SessionLocal()
    try:
        # Get all reports
        all_reports = db.query(Report).filter(Report.is_delete == False).all()
        print(f"Total reports in database: {len(all_reports)}")
        
        # Get pinned reports
        pinned_reports = db.query(Report).filter(
            and_(Report.is_pinned == True, Report.is_delete == False)
        ).all()
        print(f"Pinned reports in database: {len(pinned_reports)}")
        
        # Print details of all reports
        print("\nAll reports:")
        for report in all_reports:
            print(f"  {report.report_id}: {report.startup_name} - Pinned: {report.is_pinned}")
        
        print("\nPinned reports:")
        for report in pinned_reports:
            print(f"  {report.report_id}: {report.startup_name} - Pinned: {report.is_pinned}")
            
    finally:
        db.close()

if __name__ == "__main__":
    check_pinned_reports()
