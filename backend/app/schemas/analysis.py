"""
Analysis Pydantic schemas
"""

from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime
from enum import Enum

class AnalysisStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"

class AnalysisType(str, Enum):
    COMPREHENSIVE = "comprehensive"
    QUICK = "quick"
    BENCHMARK = "benchmark"

class AnalysisRequest(BaseModel):
    startup_id: int
    analysis_type: AnalysisType = AnalysisType.COMPREHENSIVE
    parameters: Optional[Dict[str, Any]] = None

class AnalysisResponse(BaseModel):
    analysis_id: str
    startup_id: int
    analysis_type: str
    status: str
    progress: float = Field(..., ge=0.0, le=1.0)
    error_message: Optional[str] = None
    results: Optional[Dict[str, Any]] = None
    insights: Optional[Dict[str, Any]] = None
    risk_factors: Optional[List[Dict[str, Any]]] = None
    benchmarks: Optional[Dict[str, Any]] = None
    
    # Scoring
    overall_score: Optional[float] = Field(None, ge=0.0, le=100.0)
    risk_score: Optional[float] = Field(None, ge=0.0, le=100.0)
    growth_score: Optional[float] = Field(None, ge=0.0, le=100.0)
    team_score: Optional[float] = Field(None, ge=0.0, le=100.0)
    market_score: Optional[float] = Field(None, ge=0.0, le=100.0)
    
    # Timestamps
    created_at: datetime
    updated_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class AnalysisUpdate(BaseModel):
    status: Optional[AnalysisStatus] = None
    progress: Optional[float] = Field(None, ge=0.0, le=1.0)
    error_message: Optional[str] = None
    results: Optional[Dict[str, Any]] = None
    insights: Optional[Dict[str, Any]] = None
    risk_factors: Optional[List[Dict[str, Any]]] = None
    benchmarks: Optional[Dict[str, Any]] = None
    overall_score: Optional[float] = Field(None, ge=0.0, le=100.0)
    risk_score: Optional[float] = Field(None, ge=0.0, le=100.0)
    growth_score: Optional[float] = Field(None, ge=0.0, le=100.0)
    team_score: Optional[float] = Field(None, ge=0.0, le=100.0)
    market_score: Optional[float] = Field(None, ge=0.0, le=100.0)
