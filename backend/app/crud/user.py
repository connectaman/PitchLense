"""
User CRUD operations
"""

from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_

from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate


class UserCRUD:
    """CRUD operations for User model"""

    def create(self, db: Session, *, obj_in: UserCreate) -> User:
        """Create a new user"""
        db_obj = User(
            user_firstname=obj_in.user_firstname,
            user_lastname=obj_in.user_lastname,
            user_email=obj_in.user_email,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get(self, db: Session, user_id: str) -> Optional[User]:
        """Get user by ID"""
        return db.query(User).filter(User.user_id == user_id).first()

    def get_by_email(self, db: Session, *, email: str) -> Optional[User]:
        """Get user by email"""
        return db.query(User).filter(User.user_email == email).first()

    def get_multi(
        self, db: Session, *, skip: int = 0, limit: int = 100
    ) -> List[User]:
        """Get multiple users with pagination"""
        return db.query(User).offset(skip).limit(limit).all()

    def update(
        self, db: Session, *, db_obj: User, obj_in: UserUpdate
    ) -> User:
        """Update user"""
        update_data = obj_in.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def delete(self, db: Session, *, user_id: str) -> User:
        """Delete user"""
        obj = db.query(User).get(user_id)
        db.delete(obj)
        db.commit()
        return obj

    def search(
        self, db: Session, *, search_term: str, skip: int = 0, limit: int = 100
    ) -> List[User]:
        """Search users by name or email"""
        return (
            db.query(User)
            .filter(
                or_(
                    User.user_firstname.ilike(f"%{search_term}%"),
                    User.user_lastname.ilike(f"%{search_term}%"),
                    User.user_email.ilike(f"%{search_term}%"),
                )
            )
            .offset(skip)
            .limit(limit)
            .all()
        )


user_crud = UserCRUD()
