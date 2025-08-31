"""
User Pydantic schemas
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class UserBase(BaseModel):
    """Base User schema"""
    user_firstname: str = Field(..., min_length=1, max_length=100, description="User's first name")
    user_lastname: str = Field(..., min_length=1, max_length=100, description="User's last name")
    user_email: EmailStr = Field(..., description="User's email address")


class UserCreate(UserBase):
    """Schema for creating a new user"""
    pass


class UserUpdate(BaseModel):
    """Schema for updating a user"""
    user_firstname: Optional[str] = Field(None, min_length=1, max_length=100, description="User's first name")
    user_lastname: Optional[str] = Field(None, min_length=1, max_length=100, description="User's last name")
    user_email: Optional[EmailStr] = Field(None, description="User's email address")


class UserInDB(UserBase):
    """Schema for user in database"""
    user_id: str
    created_at: datetime

    class Config:
        from_attributes = True


class User(UserInDB):
    """Schema for user response"""
    full_name: str

    class Config:
        from_attributes = True
