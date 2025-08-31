"""
Report Pydantic schemas
"""

from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field

from app.models.report import ReportStatus


class ReportBase(BaseModel):
    """Base Report schema"""
    report_name: str = Field(..., min_length=1, max_length=255, description="Name of the report")
    startup_name: str = Field(..., min_length=1, max_length=255, description="Name of the startup")
    founder_name: str = Field(..., min_length=1, max_length=255, description="Name of the founder")
    report_path: Optional[str] = Field(None, max_length=500, description="Path to the report file")


class ReportCreate(ReportBase):
    """Schema for creating a new report"""
    pass


class ReportUpdate(BaseModel):
    """Schema for updating a report"""
    report_name: Optional[str] = Field(None, min_length=1, max_length=255, description="Name of the report")
    startup_name: Optional[str] = Field(None, min_length=1, max_length=255, description="Name of the startup")
    founder_name: Optional[str] = Field(None, min_length=1, max_length=255, description="Name of the founder")
    report_path: Optional[str] = Field(None, max_length=500, description="Path to the report file")
    status: Optional[ReportStatus] = Field(None, description="Status of the report")
    is_delete: Optional[bool] = Field(None, description="Soft delete flag")
    is_pinned: Optional[bool] = Field(None, description="Pin status flag")


class ReportInDB(ReportBase):
    """Schema for report in database"""
    report_id: str
    status: ReportStatus
    is_delete: bool
    is_pinned: bool
    created_at: datetime

    class Config:
        from_attributes = True


class Report(ReportInDB):
    """Schema for report response"""
    file_count: Optional[int] = Field(None, description="Number of files uploaded for this report")


class ReportList(BaseModel):
    """Schema for list of reports with pagination"""
    reports: List[Report]
    total: int
    skip: int
    limit: int
