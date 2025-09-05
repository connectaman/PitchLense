"""
Report API endpoints
"""

import os
import json
import logging
from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query, BackgroundTasks
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from google.cloud import storage
from sqlalchemy import or_
from app.models.report import Report as ReportModel

from app.core.database import get_db, SessionLocal
from app.core.config import settings
from app.crud import report_crud, upload_crud
from app.schemas import ReportCreate, Report, ReportList
from app.models import ReportStatus, Upload
from app.utils.gcs_utils import file_exists_in_gcs, get_gcs_client

# Module logger
logger = logging.getLogger("reports")

router = APIRouter()


def upload_to_gcp_bucket(file_bytes: bytes, content_type: str, file_path: str) -> str:
    """
    Upload file to GCP Cloud Storage bucket
    
    Args:
        file_bytes: Raw bytes of the uploaded file
        content_type: MIME type of the file
        file_path: Path where file should be stored in bucket
        
    Returns:
        GCS path (gs://bucket-name/path/to/file)
    """
    try:
        logger.info(f"[bg] GCS upload start path={file_path} content_type={content_type} size={len(file_bytes)}")
        # Ensure GCP is configured
        creds_set = bool(settings.GOOGLE_APPLICATION_CREDENTIALS) or bool(settings.GOOGLE_CLOUD_PROJECT)
        if not creds_set:
            raise RuntimeError(
                "GCP configuration missing: set GOOGLE_APPLICATION_CREDENTIALS or GOOGLE_CLOUD_PROJECT"
            )
        
        # Initialize GCP client
        try:
            if settings.GOOGLE_APPLICATION_CREDENTIALS:
                logger.info("[bg] Using service account JSON credentials for GCS client")
                client = storage.Client.from_service_account_json(
                    settings.GOOGLE_APPLICATION_CREDENTIALS
                )
            else:
                logger.info(f"[bg] Using default credentials with project={settings.GOOGLE_CLOUD_PROJECT}")
                client = storage.Client(project=settings.GOOGLE_CLOUD_PROJECT)
        except Exception as client_err:
            logger.exception(f"[bg] Failed to initialize GCS client: {client_err}")
            raise RuntimeError(f"Failed to initialize GCS client: {client_err}")
        
        bucket_name = settings.BUCKET
        try:
            bucket = client.bucket(bucket_name)
            blob = bucket.blob(file_path)
        except Exception as bucket_err:
            logger.exception(f"[bg] Failed to reference bucket/blob bucket={bucket_name} path={file_path}: {bucket_err}")
            raise RuntimeError(f"Failed to reference bucket/blob: {bucket_err}")
        
        # Upload file from bytes
        try:
            blob.upload_from_string(file_bytes, content_type=content_type)
        except Exception as upload_err:
            logger.exception(f"[bg] GCS upload failed bucket={bucket_name} path={file_path}: {upload_err}")
            raise RuntimeError(f"GCS upload failed: {upload_err}")
        
        gcs_path = f"gs://{bucket_name}/{file_path}"
        logger.info(f"[bg] GCS upload success path={gcs_path}")
        return gcs_path
        
    except Exception as e:
        # Re-raise RuntimeError to be caught by background handler with full context
        if isinstance(e, RuntimeError):
            raise
        raise RuntimeError(f"Unexpected error during GCS upload for path={file_path}: {e}")


def process_report_background(report_id: str, startup_name: str, founder_name: str, launch_date: str, files_payload: list):
    """Background task to upload files to GCS, create upload records, and trigger Cloud Run."""
    db = SessionLocal()
    logger.info(f"[bg] Start processing report_id={report_id} files={len(files_payload)}")
    try:
        created_uploads = []
        for idx, item in enumerate(files_payload, start=1):
            try:
                filename = item["filename"]
                file_type = item["file_type"]
                content_type = item["content_type"]
                file_bytes = item["file_bytes"]
                logger.info(f"[bg] Upload {idx}/{len(files_payload)} filename={filename} type={file_type} content_type={content_type} size={len(file_bytes)} bytes")
                gcs_object_path = f"uploads/{report_id}/{filename}"
                gcs_path = upload_to_gcp_bucket(file_bytes, content_type, gcs_object_path)
                from app.schemas import UploadCreate
                upload_data = UploadCreate(
                    user_id="1",
                    report_id=report_id,
                    filename=filename,
                    file_format=file_type,
                    upload_path=gcs_path
                )
                upload = upload_crud.create(db, obj_in=upload_data)
                created_uploads.append(upload)
                logger.info(f"[bg] Uploaded and recorded file_id={upload.file_id} path={gcs_path}")
            except Exception as file_err:
                logger.exception(f"[bg] Failed uploading file {item.get('filename')}: {file_err}")
                raise
        
        if not settings.CLOUD_RUN_URL:
            raise RuntimeError("CLOUD_RUN_URL is not set; cannot trigger Cloud Run")
        
        uploads_payload = []
        for upload in created_uploads:
            file_extension = upload.filename.split('.')[-1] if '.' in upload.filename else ""
            uploads_payload.append({
                "filetype": upload.file_format,
                "filename": upload.filename,
                "file_extension": file_extension,
                "filepath": upload.upload_path,
            })
        startup_text = (
            f"Startup Name: {startup_name}\n"
            f"Founder: {founder_name}\n"
            f"Launch Date: {launch_date}\n"
            f"Report ID: {report_id}\n"
        )
        destination_gcs = f"gs://{settings.BUCKET}/runs/{report_id}.json"
        payload = {
            "uploads": uploads_payload,
            "startup_text": startup_text,
            "use_mock": False,
            "destination_gcs": destination_gcs,
        }
        logger.info(f"[bg] Trigger Cloud Run url={settings.CLOUD_RUN_URL} destination={destination_gcs} uploads={len(uploads_payload)}")
        import requests
        resp = requests.post(settings.CLOUD_RUN_URL, json=payload, timeout=30)
        logger.info(f"[bg] Cloud Run response status={resp.status_code}")
        if resp.status_code >= 400:
            logger.error(f"[bg] Cloud Run error body={resp.text}")
            raise RuntimeError(f"Cloud Run trigger responded with {resp.status_code}")
        logger.info(f"[bg] Completed background processing report_id={report_id}")
    except Exception as e:
        logger.exception(f"[bg] Processing failed for report_id={report_id}: {e}")
        try:
            from app.schemas import ReportUpdate
            report_obj = report_crud.get(db, report_id=report_id)
            if report_obj:
                report_crud.update(db, db_obj=report_obj, obj_in=ReportUpdate(status=ReportStatus.FAILED))
                logger.info(f"[bg] Marked report_id={report_id} as FAILED")
        except Exception as mark_err:
            logger.exception(f"[bg] Failed to mark report as FAILED: {mark_err}")
    finally:
        db.close()
        logger.info(f"[bg] Closed DB session for report_id={report_id}")


@router.post("/", response_model=Report)
async def create_report(
    background_tasks: BackgroundTasks,
    startup_name: str = Form(...),
    launch_date: str = Form(...),
    founder_name: str = Form(...),
    files: List[UploadFile] = File(...),
    file_types: List[str] = Form(...),  # List of file types corresponding to files
    db: Session = Depends(get_db)
):
    """
    Create a new report and schedule background processing (uploads + Cloud Run trigger)
    """
    logger.info(f"[api] POST /reports start startup_name={startup_name} founder_name={founder_name} launch_date={launch_date} files_count={len(files) if files else 0} file_types={list(file_types) if isinstance(file_types, list) else file_types}")
    # Validate inputs
    if not startup_name or not founder_name or not launch_date:
        logger.warning("[api] Missing required fields: startup_name/founder_name/launch_date")
        raise HTTPException(
            status_code=400,
            detail="startup_name, founder_name, and launch_date are required"
        )
    if not files:
        logger.warning("[api] No files uploaded")
        raise HTTPException(status_code=400, detail="At least one file must be uploaded")
    if len(files) != len(file_types):
        logger.warning(f"[api] Files count {len(files)} does not match file_types count {len(file_types)}")
        raise HTTPException(
            status_code=400,
            detail="Number of files must match number of file types"
        )
    
    allowed_types = [
        'pitch deck', 'call recording', 'meeting recording',
        'founder profile', 'news report', 'company document'
    ]
    for file_type in file_types:
        if file_type not in allowed_types:
            logger.warning(f"[api] Invalid file_type received: {file_type}")
            raise HTTPException(
                status_code=400,
                detail=f"Invalid file type: {file_type}. Allowed types: {allowed_types}"
            )
    
    for file in files:
        logger.info(f"[api] Incoming file name={file.filename} content_type={file.content_type}")
        if file.content_type not in settings.ALLOWED_FILE_TYPES:
            logger.warning(f"[api] Disallowed content_type={file.content_type} for file={file.filename}")
            raise HTTPException(
                status_code=400,
                detail=f"File type {file.content_type} not allowed. Allowed types: {settings.ALLOWED_FILE_TYPES}"
            )
        if hasattr(file, 'size') and file.size and file.size > settings.MAX_FILE_SIZE:
            logger.warning(f"[api] File too large filename={file.filename} size={file.size} limit={settings.MAX_FILE_SIZE}")
            raise HTTPException(
                status_code=400,
                detail=f"File {file.filename} is too large. Maximum size: {settings.MAX_FILE_SIZE / (1024*1024)}MB"
            )
    
    try:
        # Create report record
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        report_name = f"{startup_name}_{timestamp}"
        logger.info(f"[api] Creating report record name={report_name}")
        report_data = ReportCreate(
            report_name=report_name,
            startup_name=startup_name,
            founder_name=founder_name,
            launch_date=launch_date,
            report_path=f"gs://{settings.BUCKET}/runs/{{pending}}.json"
        )
        report = report_crud.create(db, obj_in=report_data)
        logger.info(f"[api] Report created report_id={report.report_id}")
        
        # Prepare files payload bytes for background processing
        files_payload = []
        for file, file_type in zip(files, file_types):
            try:
                file_bytes = await file.read()
                logger.info(f"[api] Read file bytes filename={file.filename} bytes={len(file_bytes)} type={file_type}")
                files_payload.append({
                    "filename": file.filename,
                    "file_type": file_type,
                    "content_type": file.content_type,
                    "file_bytes": file_bytes,
                })
            except Exception as read_err:
                logger.exception(f"[api] Failed reading file {file.filename}: {read_err}")
                raise
        
        # Update report_path now that we know report_id
        report.report_path = f"gs://{settings.BUCKET}/runs/{report.report_id}.json"
        db.commit()
        db.refresh(report)
        logger.info(f"[api] Report updated with path={report.report_path}")
        
        # Schedule background processing (uploads + cloud run)
        background_tasks.add_task(
            process_report_background,
            report_id=report.report_id,
            startup_name=startup_name,
            founder_name=founder_name,
            launch_date=launch_date,
            files_payload=files_payload,
        )
        logger.info(f"[api] Background task scheduled for report_id={report.report_id}")
        
        return report
        
    except Exception as e:
        logger.exception(f"[api] Create report failed: {e}")
        # Cleanup on failure
        if 'report' in locals():
            try:
                report_crud.hard_delete(db, report_id=str(report.report_id))
                logger.info(f"[api] Rolled back report_id={report.report_id}")
            except Exception as cleanup_err:
                logger.exception(f"[api] Cleanup failed for report_id={getattr(report, 'report_id', None)}: {cleanup_err}")
        raise HTTPException(status_code=500, detail=f"Failed to create report: {str(e)}")


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
    # Get total count for pagination using same filters
    base_query = db.query(ReportModel).filter(ReportModel.is_delete == False)
    if pinned_only == 'true':
        count_query = base_query.filter(ReportModel.is_pinned == True)
    elif search:
        like_expr = f"%{search}%"
        count_query = base_query.filter(
            or_(
                ReportModel.report_name.ilike(like_expr),
                ReportModel.startup_name.ilike(like_expr),
                ReportModel.founder_name.ilike(like_expr),
            )
        )
    elif status:
        count_query = base_query.filter(ReportModel.status == status)
    else:
        count_query = base_query
    total = count_query.count()
    
    # Get reports with pagination
    reports_query = db.query(ReportModel).filter(ReportModel.is_delete == False)
    if pinned_only == 'true':
        reports_query = reports_query.filter(ReportModel.is_pinned == True)
    if search:
        reports_query = reports_query.filter(or_(
            ReportModel.startup_name.ilike(f"%{search}%"),
            ReportModel.founder_name.ilike(f"%{search}%"),
            ReportModel.report_name.ilike(f"%{search}%")
        ))
    if status:
        reports_query = reports_query.filter(ReportModel.status == status)
    reports_query = reports_query.order_by(ReportModel.created_at.desc()).offset(skip).limit(limit)
    
    reports = reports_query.all()
    
    # Get file counts for each report
    for report in reports:
        # If there is an output path, check if the file exists and update status
        try:
            if getattr(report, "report_path", None) and report.status != ReportStatus.SUCCESS:
                if file_exists_in_gcs(report.report_path):
                    from app.schemas import ReportUpdate
                    report_crud.update(db, db_obj=report, obj_in=ReportUpdate(status=ReportStatus.SUCCESS))
        except Exception as _exist_err:
            # Log and continue without failing the request
            print(f"list output existence check failed for {getattr(report, 'report_id', '?')}: {_exist_err}")
        
        file_count = db.query(Upload).filter(Upload.report_id == report.report_id).count()
        # Add file count as a dynamic attribute
        report.file_count = file_count
    
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
    Get a specific report by ID. If the report has status SUCCESS and the
    output JSON exists at report_path, return the JSON content instead.
    """
    report = report_crud.get(db, report_id=report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    # If there is an output path, check if the file exists and update status
    try:
        if report.report_path and file_exists_in_gcs(report.report_path):
            if report.status != ReportStatus.SUCCESS:
                # Update status to success
                from app.schemas import ReportUpdate
                updated = report_crud.update(db, db_obj=report, obj_in=ReportUpdate(status=ReportStatus.SUCCESS))
                report = updated or report
            else:
                # Status already success; fetch the JSON and return it
                try:
                    # Parse GCS path
                    path_without_prefix = report.report_path[5:]
                    bucket_name = path_without_prefix.split('/')[0]
                    blob_path = '/'.join(path_without_prefix.split('/')[1:])
                    client = get_gcs_client()
                    bucket = client.bucket(bucket_name)
                    blob = bucket.blob(blob_path)
                    data_bytes = blob.download_as_bytes()
                    data_json = json.loads(data_bytes.decode('utf-8'))
                    return JSONResponse(content=data_json)
                except Exception as read_err:
                    logger.exception(f"Failed reading report JSON for {report_id} from {report.report_path}: {read_err}")
                    # Fall through to return the report object if reading fails
    except Exception as _exist_err:
        # Do not fail the request if existence check fails
        logger.warning(f"report output existence check failed for {report.report_id}: {_exist_err}")
    
    raise HTTPException(
                status_code=400,
                detail=f"Could not read Report"
    )

    # # Get file count for this report
    # file_count = db.query(Upload).filter(Upload.report_id == report_id).count()
    # report.file_count = file_count
    
    # return report


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
