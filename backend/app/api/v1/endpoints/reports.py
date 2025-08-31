"""
Report API endpoints
"""

import os
from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query
from sqlalchemy.orm import Session
from google.cloud import storage

from app.core.database import get_db
from app.core.config import settings
from app.crud import report_crud, upload_crud
from app.schemas import ReportCreate, Report, ReportList
from app.models import ReportStatus, Upload

router = APIRouter()


def upload_to_gcp_bucket(file: UploadFile, file_path: str) -> str:
    """
    Upload file to GCP Cloud Storage bucket
    
    Args:
        file: Uploaded file
        file_path: Path where file should be stored in bucket
        
    Returns:
        GCS path (gs://bucket-name/path/to/file)
    """
    try:
        # Check if GCP is configured
        if not (settings.GOOGLE_APPLICATION_CREDENTIALS or settings.GOOGLE_CLOUD_PROJECT):
            raise HTTPException(
                status_code=500,
                detail="GCP configuration is required. Please set GOOGLE_APPLICATION_CREDENTIALS or GOOGLE_CLOUD_PROJECT"
            )
        
        # Initialize GCP client
        if settings.GOOGLE_APPLICATION_CREDENTIALS:
            client = storage.Client.from_service_account_json(
                settings.GOOGLE_APPLICATION_CREDENTIALS
            )
        else:
            # Use default credentials (for local development with gcloud auth)
            client = storage.Client(project=settings.GOOGLE_CLOUD_PROJECT)
        
        bucket = client.bucket(settings.BUCKET)
        blob = bucket.blob(file_path)
        
        # Upload file
        blob.upload_from_file(file.file, content_type=file.content_type)
        
        # Return GCS path instead of public URL
        gcs_path = f"gs://{settings.BUCKET}/{file_path}"
        
        return gcs_path
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to upload file to GCS: {str(e)}"
        )


@router.post("/", response_model=Report)
async def create_report(
    startup_name: str = Form(...),
    launch_date: str = Form(...),
    founder_name: str = Form(...),
    files: List[UploadFile] = File(...),
    file_types: List[str] = Form(...),  # List of file types corresponding to files
    db: Session = Depends(get_db)
):
    """
    Create a new report with uploaded files
    
    Args:
        startup_name: Name of the startup
        launch_date: Launch date of the startup
        founder_name: Name of the founder
        files: List of uploaded files
        file_types: List of file types (pitch deck, call recording, etc.)
        db: Database session
        
    Returns:
        Created report with details
    """
    
    # Validate inputs
    if not startup_name or not founder_name or not launch_date:
        raise HTTPException(
            status_code=400,
            detail="startup_name, founder_name, and launch_date are required"
        )
    
    if not files:
        raise HTTPException(
            status_code=400,
            detail="At least one file must be uploaded"
        )
    
    if len(files) != len(file_types):
        raise HTTPException(
            status_code=400,
            detail="Number of files must match number of file types"
        )
    
    # Validate file types
    allowed_types = [
        'pitch deck', 'call recording', 'meeting recording',
        'founder profile', 'news report', 'company document'
    ]
    
    for file_type in file_types:
        if file_type not in allowed_types:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid file type: {file_type}. Allowed types: {allowed_types}"
            )
    
    # Validate file formats
    for file in files:
        if file.content_type not in settings.ALLOWED_FILE_TYPES:
            raise HTTPException(
                status_code=400,
                detail=f"File type {file.content_type} not allowed. Allowed types: {settings.ALLOWED_FILE_TYPES}"
            )
        
        if file.size > settings.MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400,
                detail=f"File {file.filename} is too large. Maximum size: {settings.MAX_FILE_SIZE / (1024*1024)}MB"
            )
    
    try:
        # Create report name with timestamp
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        report_name = f"{startup_name}_{timestamp}"
        
        # Create report in database
        report_data = ReportCreate(
            report_name=report_name,
            startup_name=startup_name,
            founder_name=founder_name,
            report_path=None  # Will be set after file processing
        )
        
        report = report_crud.create(db, obj_in=report_data)
        
        # Upload files to GCP and save to database
        uploaded_files = []
        
        for i, (file, file_type) in enumerate(zip(files, file_types)):
            # Use report_id and original filename for organization
            file_extension = os.path.splitext(file.filename)[1]
            gcp_path = f"uploads/{report.report_id}/{file.filename}"
            
            # Upload to GCS and get GCS path
            gcs_path = upload_to_gcp_bucket(file, gcp_path)
            
            # Save file details to database with GCS path
            from app.schemas import UploadCreate
            upload_data = UploadCreate(
                user_id="1",  # Hardcoded as requested
                report_id=report.report_id,
                filename=file.filename,
                file_format=file_type,
                upload_path=gcs_path  # Store GCS path (gs://bucket-name/path/to/file)
            )
            
            upload = upload_crud.create(db, obj_in=upload_data)
            uploaded_files.append(upload)
        
        # Update report with GCS path to the generated report JSON
        report.report_path = f"gs://{settings.BUCKET}/runs/{report.report_id}.json"
        
        # Save the updated report to database
        db.commit()
        db.refresh(report)
        
        return report
        
    except Exception as e:
        # If anything fails, clean up any created records
        if 'report' in locals():
            report_crud.hard_delete(db, report_id=str(report.report_id))
        
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create report: {str(e)}"
        )


@router.get("/", response_model=ReportList)
async def get_reports(
    skip: int = 0,
    limit: int = 100,
    search: str = None,
    status: ReportStatus = None,
    pinned_only: str = Query(None, description="Filter to show only pinned reports (set to 'true')"),
    db: Session = Depends(get_db)
):
    """
    Get list of reports with optional filtering and search
    
    Args:
        skip: Number of records to skip for pagination
        limit: Maximum number of records to return
        search: Search term for filtering reports
        status: Filter by report status
        pinned_only: If True, return only pinned reports
        db: Database session
    """
    if pinned_only == 'true':
        reports = report_crud.get_pinned(db, skip=skip, limit=limit)
    elif search:
        reports = report_crud.search(db, search_term=search, skip=skip, limit=limit)
    elif status:
        reports = report_crud.get_by_status(db, status=status, skip=skip, limit=limit)
    else:
        reports = report_crud.get_multi(db, skip=skip, limit=limit)
    
    # Get file counts for each report
    for report in reports:
        file_count = db.query(Upload).filter(Upload.report_id == report.report_id).count()
        # Add file count as a dynamic attribute
        report.file_count = file_count
    
    # Get total count for pagination
    total = len(reports)  # This is simplified - in production you'd want a separate count query
    
    return ReportList(
        reports=reports,
        total=total,
        skip=skip,
        limit=limit
    )


@router.get("/{report_id}", response_model=Report)
async def get_report(
    report_id: str,
    db: Session = Depends(get_db)
):
    """
    Get a specific report by ID
    """
    report = report_crud.get(db, report_id=report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    # Get file count for this report
    file_count = db.query(Upload).filter(Upload.report_id == report_id).count()
    report.file_count = file_count
    
    return report


@router.delete("/{report_id}")
async def delete_report(
    report_id: str,
    db: Session = Depends(get_db)
):
    """
    Soft delete a report and delete associated files from GCS
    """
    report = report_crud.soft_delete(db, report_id=report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    # Delete associated files from GCS
    try:
        from app.utils.gcs_utils import delete_gcs_file
        from app.crud import upload_crud
        
        # Get all uploads for this report
        uploads = upload_crud.get_by_report(db, report_id=report_id)
        
        # Delete each file from GCS
        for upload in uploads:
            delete_gcs_file(upload.upload_path)
        
        return {
            "message": "Report deleted successfully",
            "files_deleted": len(uploads)
        }
        
    except Exception as e:
        # Log error but don't fail the request
        print(f"Error deleting files from GCS: {str(e)}")
        return {"message": "Report deleted successfully (files may not have been deleted from storage)"}


@router.patch("/{report_id}/pin")
async def toggle_pin_report(
    report_id: str,
    db: Session = Depends(get_db)
):
    """
    Toggle pin status of a report
    """
    report = report_crud.toggle_pin(db, report_id=report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    return {"message": f"Report {'pinned' if report.is_pinned else 'unpinned'} successfully"}
