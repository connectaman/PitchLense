"""
Startup Pydantic schemas
"""

from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime

class StartupBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    sector: Optional[str] = Field(None, max_length=100)
    stage: Optional[str] = Field(None, max_length=50)
    founded_year: Optional[int] = Field(None, ge=1900, le=2024)
    location: Optional[str] = Field(None, max_length=255)
    website: Optional[str] = Field(None, max_length=255)
    
    # Financial metrics
    revenue: Optional[float] = Field(None, ge=0)
    funding_raised: Optional[float] = Field(None, ge=0)
    valuation: Optional[float] = Field(None, ge=0)
    burn_rate: Optional[float] = Field(None, ge=0)
    
    # Team metrics
    team_size: Optional[int] = Field(None, ge=0)
    founders_count: Optional[int] = Field(None, ge=0)
    
    # Traction metrics
    customers_count: Optional[int] = Field(None, ge=0)
    growth_rate: Optional[float] = Field(None, ge=-1, le=10)  # -100% to 1000%
    churn_rate: Optional[float] = Field(None, ge=0, le=1)  # 0% to 100%

class StartupCreate(StartupBase):
    pass

class StartupUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    sector: Optional[str] = Field(None, max_length=100)
    stage: Optional[str] = Field(None, max_length=50)
    founded_year: Optional[int] = Field(None, ge=1900, le=2024)
    location: Optional[str] = Field(None, max_length=255)
    website: Optional[str] = Field(None, max_length=255)
    
    # Financial metrics
    revenue: Optional[float] = Field(None, ge=0)
    funding_raised: Optional[float] = Field(None, ge=0)
    valuation: Optional[float] = Field(None, ge=0)
    burn_rate: Optional[float] = Field(None, ge=0)
    
    # Team metrics
    team_size: Optional[int] = Field(None, ge=0)
    founders_count: Optional[int] = Field(None, ge=0)
    
    # Traction metrics
    customers_count: Optional[int] = Field(None, ge=0)
    growth_rate: Optional[float] = Field(None, ge=-1, le=10)
    churn_rate: Optional[float] = Field(None, ge=0, le=1)

class StartupResponse(StartupBase):
    id: int
    metadata: Optional[Dict[str, Any]] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True
