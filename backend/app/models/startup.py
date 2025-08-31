"""
Startup database model
"""

from sqlalchemy import Column, Integer, String, Text, DateTime, Float, Boolean, JSON
from sqlalchemy.sql import func
from app.core.database import Base

class Startup(Base):
    __tablename__ = "startups"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    description = Column(Text)
    sector = Column(String(100), index=True)
    stage = Column(String(50))  # seed, series_a, series_b, etc.
    founded_year = Column(Integer)
    location = Column(String(255))
    website = Column(String(255))
    
    # Financial metrics
    revenue = Column(Float)
    funding_raised = Column(Float)
    valuation = Column(Float)
    burn_rate = Column(Float)
    
    # Team metrics
    team_size = Column(Integer)
    founders_count = Column(Integer)
    
    # Traction metrics
    customers_count = Column(Integer)
    growth_rate = Column(Float)
    churn_rate = Column(Float)
    
    # Additional data
    metadata = Column(JSON)  # Store additional flexible data
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def __repr__(self):
        return f"<Startup(id={self.id}, name='{self.name}', sector='{self.sector}')>"
