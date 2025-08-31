"""
Base extractor for PitchLense AI Pipeline

Abstract base class for document content extraction.
"""

from abc import ABC, abstractmethod
from typing import Dict, List

from ..schema import Document


class BaseExtractor(ABC):
    """
    Abstract base class for document content extractors.
    
    This class defines the interface that all document extractors must implement.
    Extractors are responsible for parsing different document formats and extracting
    their content into standardized Document objects.
    
    Attributes:
        None (abstract base class)
    """

    @abstractmethod
    def extract(self) -> List[Document]:
        """
        Extract document content and store it in Document schema.
        
        This method must be implemented by all concrete extractor classes.
        It should parse the document and return a list of Document objects
        containing the extracted content and metadata.
        
        Returns:
            List of Document objects containing extracted content
            
        Raises:
            NotImplementedError: If the method is not implemented by subclass
        """
        pass
    
    async def aextract(self) -> List[Document]:
        """
        Asynchronous version of extract method.
        
        This method provides an async interface for document extraction.
        By default, it calls the synchronous extract method, but subclasses
        can override this to provide true asynchronous extraction.
        
        Returns:
            List of Document objects containing extracted content
        """
        return await self.extract()
    
    def __repr__(self) -> str:
        """
        String representation of the extractor.
        
        Returns:
            String representation showing the extractor's attributes
        """
        return repr(self.__dict__)