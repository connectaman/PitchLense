"""
Startup service for business logic
"""

from typing import List, Optional
from sqlalchemy.orm import Session
from ..models.startup import Startup
from ..schemas.startup import StartupCreate, StartupUpdate


class StartupService:
    """Service for managing startup operations."""
    
    def __init__(self, db: Session):
        self.db = db
    
    def get_startups(self, skip: int = 0, limit: int = 100) -> List[Startup]:
        """Get all startups with pagination."""
        pass
    
    def get_startup(self, startup_id: int) -> Optional[Startup]:
        """Get a specific startup by ID."""
        pass
    
    def create_startup(self, startup: StartupCreate) -> Startup:
        """Create a new startup."""
        pass
    
    def update_startup(self, startup_id: int, startup: StartupUpdate) -> Optional[Startup]:
        """Update an existing startup."""
        pass
    
    def delete_startup(self, startup_id: int) -> bool:
        """Delete a startup."""
        pass
    
    def get_evaluation(self, startup_id: int):
        """Get evaluation for a startup."""
        pass
    
    def search_startups(self, query: str, skip: int = 0, limit: int = 100) -> List[Startup]:
        """Search startups by name or description."""
        pass
