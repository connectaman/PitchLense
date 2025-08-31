"""
Base media class for PitchLense AI Pipeline

Provides the foundation for all media content representations in the pipeline.
"""

from typing import Any, Optional
from abc import ABC
from pydantic import ConfigDict, Field, field_validator


class BaseMedia(ABC):
    """
    Base class for representing media content.
    
    Media objects can be used to represent raw data, such as text or binary data.
    The presence of an ID and metadata make it easier to store, index, and search
    over the content in a structured way.
    
    Attributes:
        id: Optional identifier for the document
        metadata: Arbitrary metadata associated with the content
    """

    # The ID field is optional at the moment.
    # It will likely become required in a future major release after
    # it has been adopted by enough vectorstore implementations.
    id: Optional[str] = None
    """
    An optional identifier for the document.
    
    Ideally this should be unique across the document collection and formatted
    as a UUID, but this will not be enforced.
    
    .. versionadded:: 0.2.11
    """
    page_content: str
    metadata: dict = Field(default_factory=dict)
    """Arbitrary metadata associated with the content."""

    @field_validator("id", mode="before")
    def cast_id_to_str(cls, id_value: Any) -> Optional[str]:
        """
        Cast ID value to string if it's not None.
        
        Args:
            id_value: The ID value to cast
            
        Returns:
            String representation of the ID or None
        """
        if id_value is not None:
            return str(id_value)
        else:
            return id_value