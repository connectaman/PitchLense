"""
User model for the PitchLense application
"""

from sqlalchemy import Column, String, DateTime, Text
from sqlalchemy.sql import func
import uuid

from app.core.database import Base


class User(Base):
    """User model for storing user information"""
    
    __tablename__ = "users"
    
    # Primary key
    user_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    
    # User details
    user_firstname = Column(String(100), nullable=False)
    user_lastname = Column(String(100), nullable=False)
    user_email = Column(String(255), unique=True, nullable=False, index=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    def __repr__(self):
        return f"<User(user_id={self.user_id}, email={self.user_email})>"
    
    @property
    def full_name(self) -> str:
        """Get the full name of the user"""
        return f"{self.user_firstname} {self.user_lastname}"
