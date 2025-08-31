"""
Document schema for PitchLense AI Pipeline

Defines the Document class for storing and managing document content and metadata.
"""

from typing import Literal, List
from .base import BaseMedia


class Document(BaseMedia):
    """
    Class for storing a piece of text and associated metadata.
    
    This class extends BaseMedia to provide comprehensive document representation
    with extensive metadata for startup evaluation and analysis.
    
    Attributes:
        id: Unique identifier for the document
        page_content: The main text content of the document
        metadata: Additional metadata associated with the document
    """
    
    id: str
    page_content: str
    metadata: dict

    type: Literal["Document"] = "Document"

    def __init__(self, 
                 page_content: str = "",
                 metadata: dict = None,
                 id: str = ""):
        """
        Initialize the Document with comprehensive metadata.
        
        Args:
            page_content: The main text content (defaults to empty string)
            metadata: Additional metadata (defaults to empty dict)
            id: Unique identifier (defaults to empty string)
        """
        super().__init__()
        
        # Set basic attributes
        self.id = id
        self.page_content = page_content
        self.metadata = metadata or {}
        

    @classmethod
    def is_lc_serializable(cls) -> bool:
        """
        Check if this class is serializable.
        
        Returns:
            True if the class is serializable
        """
        return True

    @classmethod
    def get_lc_namespace(cls) -> list[str]:
        """
        Get the namespace of the langchain object.
        
        Returns:
            List containing the namespace path
        """
        return ["schema", "document"]

    def __str__(self) -> str:
        """
        Provide a string representation of all attributes.
        
        Returns:
            String representation of the document
        """
        return (f"Document("
                f"id={self.id}, "
                f"page_content={self.page_content}, "
                f"metadata={self.metadata}"
                f")")

    def __repr__(self) -> str:
        """
        Provide a dictionary representation of the document.
        
        Returns:
            Dictionary representation of the document attributes
        """
        return repr(self.__dict__)