"""
Base LLM class for PitchLense AI Pipeline

Abstract base class defining the interface for all language model implementations.
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, Optional


class BaseLLM(ABC):
    """
    Abstract base class for language model implementations.
    
    This class defines the interface that all LLM implementations must follow,
    ensuring consistent behavior across different AI providers.
    """
    
    def __init__(self):
        """Initialize the base LLM."""
        pass
    
    @abstractmethod
    def predict(
        self, 
        system_message: str, 
        user_message: str, 
        image_base64: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Generate a prediction from the language model.
        
        Args:
            system_message: System instruction for the model
            user_message: User's input message
            image_base64: Optional base64 encoded image for multimodal models
            
        Returns:
            Dictionary containing the response and usage information
            
        Raises:
            NotImplementedError: If the method is not implemented by subclass
        """
        pass
    
    @abstractmethod
    async def predict_stream(self, user_message: str):
        """
        Stream predictions from the language model.
        
        Args:
            user_message: User's input message
            
        Yields:
            Streamed response chunks
            
        Raises:
            NotImplementedError: If the method is not implemented by subclass
        """
        pass