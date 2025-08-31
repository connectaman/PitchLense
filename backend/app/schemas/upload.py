"""
Upload Pydantic schemas
"""

from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field


class UploadBase(BaseModel):
    """Base Upload schema"""
    user_id: str = Field(..., description="ID of the user who uploaded the file")
    report_id: str = Field(..., description="ID of the report this file belongs to")
    filename: str = Field(..., min_length=1, max_length=255, description="Name of the uploaded file")
    file_format: str = Field(..., min_length=1, max_length=50, description="Format/type of the file")
    upload_path: str = Field(..., min_length=1, max_length=500, description="Path where the file is stored")


class UploadCreate(UploadBase):
    """Schema for creating a new upload"""
    pass


class UploadUpdate(BaseModel):
    """Schema for updating an upload"""
    filename: Optional[str] = Field(None, min_length=1, max_length=255, description="Name of the uploaded file")
    file_format: Optional[str] = Field(None, min_length=1, max_length=50, description="Format/type of the file")
    upload_path: Optional[str] = Field(None, min_length=1, max_length=500, description="Path where the file is stored")


class UploadInDB(UploadBase):
    """Schema for upload in database"""
    file_id: str
    created_at: datetime

    class Config:
        from_attributes = True


class Upload(UploadInDB):
    """Schema for upload response"""
    file_extension: str

    class Config:
        from_attributes = True


class UploadList(BaseModel):
    """Schema for list of uploads with pagination"""
    uploads: List[Upload]
    total: int
    skip: int
    limit: int
