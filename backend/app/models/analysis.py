"""
Analysis database model
"""

from sqlalchemy import Column, Integer, String, Text, DateTime, Float, Boolean, JSON, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Analysis(Base):
    __tablename__ = "analyses"
    
    id = Column(Integer, primary_key=True, index=True)
    analysis_id = Column(String(100), unique=True, index=True)  # UUID for external reference
    
    # Analysis details
    startup_id = Column(Integer, ForeignKey("startups.id"), nullable=False)
    analysis_type = Column(String(50), default="comprehensive")  # comprehensive, quick, benchmark
    
    # Status and progress
    status = Column(String(50), default="pending")  # pending, processing, completed, failed, cancelled
    progress = Column(Float, default=0.0)  # 0.0 to 1.0
    error_message = Column(Text)
    
    # Analysis results
    results = Column(JSON)  # Complete analysis results
    insights = Column(JSON)  # Key insights and recommendations
    risk_factors = Column(JSON)  # Identified risk factors
    benchmarks = Column(JSON)  # Benchmark comparisons
    
    # Scoring
    overall_score = Column(Float)
    risk_score = Column(Float)
    growth_score = Column(Float)
    team_score = Column(Float)
    market_score = Column(Float)
    
    # Metadata
    parameters = Column(JSON)  # Analysis parameters used
    metadata = Column(JSON)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    completed_at = Column(DateTime(timezone=True))
    
    def __repr__(self):
        return f"<Analysis(id={self.id}, analysis_id='{self.analysis_id}', status='{self.status}')>"
