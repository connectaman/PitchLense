"""
Document database model
"""

from sqlalchemy import Column, Integer, String, Text, DateTime, Float, Boolean, JSON, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Document(Base):
    __tablename__ = "documents"
    
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255), nullable=False)
    original_filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_size = Column(Integer)
    content_type = Column(String(100))
    
    # Processing status
    status = Column(String(50), default="uploaded")  # uploaded, processing, completed, failed
    processing_error = Column(Text)
    
    # Extracted content
    extracted_text = Column(Text)
    extracted_data = Column(JSON)  # Structured data from document
    
    # Relationships
    startup_id = Column(Integer, ForeignKey("startups.id"), nullable=True)
    
    # Metadata
    metadata = Column(JSON)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def __repr__(self):
        return f"<Document(id={self.id}, filename='{self.filename}', status='{self.status}')>"
