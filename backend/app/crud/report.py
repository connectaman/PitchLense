"""
Report CRUD operations
"""

from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_

from app.models.report import Report, ReportStatus
from app.schemas.report import ReportCreate, ReportUpdate


class ReportCRUD:
    """CRUD operations for Report model"""

    def create(self, db: Session, *, obj_in: ReportCreate) -> Report:
        """Create a new report"""
        db_obj = Report(
            report_name=obj_in.report_name,
            startup_name=obj_in.startup_name,
            founder_name=obj_in.founder_name,
            launch_date=obj_in.launch_date,
            report_path=obj_in.report_path,
            status=ReportStatus.PENDING,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get(self, db: Session, report_id: str) -> Optional[Report]:
        """Get report by ID (only active reports)"""
        return (
            db.query(Report)
            .filter(and_(Report.report_id == report_id, Report.is_delete == False))
            .first()
        )

    def get_multi(
        self, db: Session, *, skip: int = 0, limit: int = 100, include_deleted: bool = False
    ) -> List[Report]:
        """Get multiple reports with pagination"""
        query = db.query(Report)
        if not include_deleted:
            query = query.filter(Report.is_delete == False)
        return (
            query
            .order_by(Report.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_by_status(
        self, db: Session, *, status: ReportStatus, skip: int = 0, limit: int = 100
    ) -> List[Report]:
        """Get reports by status"""
        return (
            db.query(Report)
            .filter(and_(Report.status == status, Report.is_delete == False))
            .order_by(Report.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_pinned(self, db: Session, *, skip: int = 0, limit: int = 100) -> List[Report]:
        """Get pinned reports"""
        return (
            db.query(Report)
            .filter(and_(Report.is_pinned == True, Report.is_delete == False))
            .order_by(Report.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    def update(
        self, db: Session, *, db_obj: Report, obj_in: ReportUpdate
    ) -> Report:
        """Update report"""
        update_data = obj_in.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update_status(self, db: Session, *, report_id: str, status: ReportStatus) -> Report:
        """Update report status"""
        db_obj = self.get(db, report_id)
        if db_obj:
            db_obj.status = status
            db.add(db_obj)
            db.commit()
            db.refresh(db_obj)
        return db_obj

    def toggle_pin(self, db: Session, *, report_id: str) -> Report:
        """Toggle report pinned status"""
        db_obj = self.get(db, report_id)
        if db_obj:
            db_obj.is_pinned = not db_obj.is_pinned
            db.add(db_obj)
            db.commit()
            db.refresh(db_obj)
        return db_obj

    def soft_delete(self, db: Session, *, report_id: str) -> Report:
        """Soft delete report (mark as deleted)"""
        db_obj = self.get(db, report_id)
        if db_obj:
            db_obj.is_delete = True
            db.add(db_obj)
            db.commit()
            db.refresh(db_obj)
        return db_obj

    def hard_delete(self, db: Session, *, report_id: str) -> Optional[Report]:
        """Hard delete report"""
        obj = db.query(Report).get(report_id)
        if obj is None:
            return None
        db.delete(obj)
        db.commit()
        return obj

    def search(
        self, db: Session, *, search_term: str, skip: int = 0, limit: int = 100
    ) -> List[Report]:
        """Search reports by name, startup name, or founder name"""
        return (
            db.query(Report)
            .filter(
                and_(
                    Report.is_delete == False,
                    or_(
                        Report.report_name.ilike(f"%{search_term}%"),
                        Report.startup_name.ilike(f"%{search_term}%"),
                        Report.founder_name.ilike(f"%{search_term}%"),
                    ),
                )
            )
            .order_by(Report.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_by_startup_name(
        self, db: Session, *, startup_name: str, skip: int = 0, limit: int = 100
    ) -> List[Report]:
        """Get reports by startup name"""
        return (
            db.query(Report)
            .filter(
                and_(
                    Report.startup_name.ilike(f"%{startup_name}%"),
                    Report.is_delete == False
                )
            )
            .order_by(Report.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )


report_crud = ReportCRUD()
