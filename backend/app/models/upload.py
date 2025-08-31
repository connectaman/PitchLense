"""
Upload model for the PitchLense application
"""

from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import uuid

from app.core.database import Base


class Upload(Base):
    """Upload model for storing file upload information"""
    
    __tablename__ = "uploads"
    
    # Primary key
    file_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    
    # Foreign keys
    user_id = Column(String(255), nullable=False, index=True)
    report_id = Column(String(36), ForeignKey("reports.report_id"), nullable=False, index=True)
    
    # File details
    filename = Column(String(255), nullable=False)
    file_format = Column(String(50), nullable=False)
    upload_path = Column(String(500), nullable=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    # Relationships
    report = relationship("Report", back_populates="uploads")
    
    def __repr__(self):
        return f"<Upload(file_id={self.file_id}, filename={self.filename}, report_id={self.report_id})>"
    
    @property
    def file_extension(self) -> str:
        """Get the file extension"""
        return self.filename.split('.')[-1] if '.' in self.filename else ""
