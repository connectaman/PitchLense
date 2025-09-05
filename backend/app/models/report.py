"""
Report model for the PitchLense application
"""

from sqlalchemy import Column, String, DateTime, Boolean, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import uuid
import enum

from app.core.database import Base


class ReportStatus(str, enum.Enum):
    """Report status enumeration"""
    PENDING = "pending"
    SUCCESS = "success"
    FAILED = "failed"


class Report(Base):
    """Report model for storing report information"""
    
    __tablename__ = "reports"
    
    # Primary key
    report_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    
    # Report details
    report_name = Column(String(255), nullable=False, index=True)
    startup_name = Column(String(255), nullable=False)
    founder_name = Column(String(255), nullable=False)
    launch_date = Column(String(50), nullable=True)  # Add launch date field
    
    # Status and flags
    status = Column(Enum(ReportStatus), default=ReportStatus.PENDING, nullable=False)
    is_delete = Column(Boolean, default=False, nullable=False)
    is_pinned = Column(Boolean, default=False, nullable=False)
    
    # File path
    report_path = Column(String(500), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    # Relationships
    uploads = relationship("Upload", back_populates="report", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Report(report_id={self.report_id}, name={self.report_name}, status={self.status})>"
    
    @property
    def is_active(self) -> bool:
        """Check if the report is active (not deleted)"""
        return not self.is_delete
