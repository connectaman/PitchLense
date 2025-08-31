"""
Upload API endpoints
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.crud import upload_crud
from app.schemas import Upload
from app.utils.gcs_utils import gcs_path_to_download_url, file_exists_in_gcs, delete_gcs_file

router = APIRouter()


@router.get("/{file_id}/download-url")
async def get_file_download_url(
    file_id: str,
    db: Session = Depends(get_db)
):
    """
    Get a signed download URL for a file
    
    Args:
        file_id: ID of the file
        db: Database session
        
    Returns:
        Signed download URL
    """
    # Get file from database
    upload = upload_crud.get(db, file_id=file_id)
    if not upload:
        raise HTTPException(status_code=404, detail="File not found")
    
    # Check if file exists in GCS
    if not file_exists_in_gcs(upload.upload_path):
        raise HTTPException(status_code=404, detail="File not found in storage")
    
    try:
        # Generate signed download URL
        download_url = gcs_path_to_download_url(upload.upload_path)
        
        return {
            "file_id": upload.file_id,
            "filename": upload.filename,
            "download_url": download_url,
            "expires_in": "1 hour"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate download URL: {str(e)}"
        )


@router.delete("/{file_id}")
async def delete_file(
    file_id: str,
    db: Session = Depends(get_db)
):
    """
    Delete a file from both database and GCS
    
    Args:
        file_id: ID of the file to delete
        db: Database session
        
    Returns:
        Success message
    """
    # Get file from database
    upload = upload_crud.get(db, file_id=file_id)
    if not upload:
        raise HTTPException(status_code=404, detail="File not found")
    
    try:
        # Delete from GCS
        gcs_deleted = delete_gcs_file(upload.upload_path)
        
        # Delete from database
        upload_crud.remove(db, file_id=file_id)
        
        return {
            "message": "File deleted successfully",
            "gcs_deleted": gcs_deleted
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete file: {str(e)}"
        )


@router.get("/report/{report_id}")
async def get_report_files(
    report_id: str,
    db: Session = Depends(get_db)
):
    """
    Get all files for a specific report
    
    Args:
        report_id: ID of the report
        db: Database session
        
    Returns:
        List of files with download URLs
    """
    # Get files from database
    uploads = upload_crud.get_by_report(db, report_id=report_id)
    
    files_with_urls = []
    for upload in uploads:
        try:
            # Generate download URL for each file
            download_url = gcs_path_to_download_url(upload.upload_path)
            
            files_with_urls.append({
                "file_id": upload.file_id,
                "filename": upload.filename,
                "file_format": upload.file_format,
                "upload_path": upload.upload_path,
                "download_url": download_url,
                "created_at": upload.created_at
            })
            
        except Exception as e:
            # If we can't generate URL, still include file info but without URL
            files_with_urls.append({
                "file_id": upload.file_id,
                "filename": upload.filename,
                "file_format": upload.file_format,
                "upload_path": upload.upload_path,
                "download_url": None,
                "error": str(e),
                "created_at": upload.created_at
            })
    
    return {
        "report_id": report_id,
        "files": files_with_urls,
        "total_files": len(files_with_urls)
    }
