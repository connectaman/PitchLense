"""
Document Pydantic schemas
"""

from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime

class DocumentBase(BaseModel):
    filename: str = Field(..., max_length=255)
    original_filename: str = Field(..., max_length=255)
    file_size: Optional[int] = Field(None, ge=0)
    content_type: Optional[str] = Field(None, max_length=100)
    startup_id: Optional[int] = None

class DocumentCreate(DocumentBase):
    file_path: str = Field(..., max_length=500)

class DocumentResponse(DocumentBase):
    id: int
    file_path: str
    status: str
    processing_error: Optional[str] = None
    extracted_text: Optional[str] = None
    extracted_data: Optional[Dict[str, Any]] = None
    metadata: Optional[Dict[str, Any]] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class DocumentUpdate(BaseModel):
    status: Optional[str] = None
    processing_error: Optional[str] = None
    extracted_text: Optional[str] = None
    extracted_data: Optional[Dict[str, Any]] = None
    metadata: Optional[Dict[str, Any]] = None
