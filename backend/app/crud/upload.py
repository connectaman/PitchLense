"""
Upload CRUD operations
"""

from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_

from app.models.upload import Upload
from app.schemas.upload import UploadCreate, UploadUpdate


class UploadCRUD:
    """CRUD operations for Upload model"""

    def create(self, db: Session, *, obj_in: UploadCreate) -> Upload:
        """Create a new upload record"""
        db_obj = Upload(
            user_id=obj_in.user_id,
            report_id=obj_in.report_id,
            filename=obj_in.filename,
            file_format=obj_in.file_format,
            upload_path=obj_in.upload_path,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get(self, db: Session, file_id: str) -> Optional[Upload]:
        """Get upload by ID"""
        return db.query(Upload).filter(Upload.file_id == file_id).first()

    def get_multi(
        self, db: Session, *, skip: int = 0, limit: int = 100
    ) -> List[Upload]:
        """Get multiple uploads with pagination"""
        return db.query(Upload).offset(skip).limit(limit).all()

    def get_by_user(
        self, db: Session, *, user_id: str, skip: int = 0, limit: int = 100
    ) -> List[Upload]:
        """Get uploads by user ID"""
        return (
            db.query(Upload)
            .filter(Upload.user_id == user_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_by_report(
        self, db: Session, *, report_id: str, skip: int = 0, limit: int = 100
    ) -> List[Upload]:
        """Get uploads by report ID"""
        return (
            db.query(Upload)
            .filter(Upload.report_id == report_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_by_file_format(
        self, db: Session, *, file_format: str, skip: int = 0, limit: int = 100
    ) -> List[Upload]:
        """Get uploads by file format"""
        return (
            db.query(Upload)
            .filter(Upload.file_format == file_format)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def update(
        self, db: Session, *, db_obj: Upload, obj_in: UploadUpdate
    ) -> Upload:
        """Update upload"""
        update_data = obj_in.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def delete(self, db: Session, *, file_id: str) -> Upload:
        """Delete upload"""
        obj = db.query(Upload).get(file_id)
        db.delete(obj)
        db.commit()
        return obj

    def delete_by_report(self, db: Session, *, report_id: str) -> List[Upload]:
        """Delete all uploads for a specific report"""
        uploads = self.get_by_report(db, report_id=report_id)
        for upload in uploads:
            db.delete(upload)
        db.commit()
        return uploads

    def search(
        self, db: Session, *, search_term: str, skip: int = 0, limit: int = 100
    ) -> List[Upload]:
        """Search uploads by filename"""
        return (
            db.query(Upload)
            .filter(Upload.filename.ilike(f"%{search_term}%"))
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_recent_uploads(
        self, db: Session, *, user_id: str = None, limit: int = 10
    ) -> List[Upload]:
        """Get recent uploads, optionally filtered by user"""
        query = db.query(Upload).order_by(Upload.created_at.desc())
        if user_id:
            query = query.filter(Upload.user_id == user_id)
        return query.limit(limit).all()

    def get_uploads_by_date_range(
        self, db: Session, *, start_date, end_date, user_id: str = None
    ) -> List[Upload]:
        """Get uploads within a date range"""
        query = db.query(Upload).filter(
            and_(
                Upload.created_at >= start_date,
                Upload.created_at <= end_date
            )
        )
        if user_id:
            query = query.filter(Upload.user_id == user_id)
        return query.all()


upload_crud = UploadCRUD()
