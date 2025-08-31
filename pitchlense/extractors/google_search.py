"""
Google Search extractor for PitchLense AI Pipeline

Provides functionality for grounded search using Google Search API
with Google Gemini models.
"""

import os
import uuid
from typing import Optional, Dict, Any, List

try:
    from google import genai
    from google.genai import types
except ImportError as e:
    raise ImportError("Gemini Package not found. Please `pip install google-genai`")

from .base import BaseExtractor
from ..schema import Document


class GoogleSearchExtractor(BaseExtractor):
    """
    Google Search extractor using Google Gemini models with grounding tools.
    
    Provides functionality for performing grounded searches and extracting
    information with real-time web data.
    """
    
    def __init__(self, api_key: Optional[str] = None, model: str = "gemini-2.5-flash"):
        """
        Initialize the Google Search extractor.
        
        Args:
            api_key: Gemini API key (defaults to environment variable)
            model: Model name to use for search and extraction
        """
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            raise ValueError("Gemini API key is required")
        
        self.model = model
        self.client = genai.Client(api_key=self.api_key)
        
        # Define the grounding tool
        self.grounding_tool = types.Tool(
            google_search=types.GoogleSearch()
        )
        
        # Configure generation settings
        self.config = types.GenerateContentConfig(
            tools=[self.grounding_tool]
        )
    
    def predict(
        self, 
        query: str,
        system_instruction: Optional[str] = None
    ) -> List[Document]:
        """
        Perform a grounded search using Google Search.
        
        Args:
            query: The search query to perform
            system_instruction: Optional system instruction to guide the model
            
        Returns:
            List of Document objects containing the search results
        """
        # Update config with system instruction if provided
        config = self.config
        if system_instruction:
            config = types.GenerateContentConfig(
                tools=[self.grounding_tool],
                system_instruction=system_instruction
            )
        
        # Make the request
        response = self.client.models.generate_content(
            model=self.model,
            contents=query,
            config=config,
        )
        
        # Create Document object
        document = Document(
            id=str(uuid.uuid4()),
            page_content=response.text,
            metadata={
                "model": self.model,
                "query": query,
                "system_instruction": system_instruction,
                "grounded": True,
                "source": "google_search",
                "response_text": response.text
            }
        )
        
        return [document]
    
    def extract(self) -> List[Document]:
        """
        Extract method required by BaseExtractor.
        
        This method is not typically used for search functionality,
        but is required by the base class interface.
        
        Returns:
            List containing a placeholder Document
        """
        return [Document(
            id=str(uuid.uuid4()),
            page_content="Use predict() method for search functionality",
            metadata={
                "type": "google_search",
                "message": "Use predict() method for search functionality"
            }
        )]
    
    async def aextract(self) -> List[Document]:
        """
        Async version of extract method.
        
        Returns:
            List containing a placeholder Document
        """
        return self.extract()


class GoogleSearchAnalyzer:
    """
    Google Search analyzer for comprehensive search and analysis.
    
    Provides advanced search capabilities with customizable system instructions
    and result processing.
    """
    
    def __init__(self, api_key: Optional[str] = None, model: str = "gemini-2.5-flash"):
        """
        Initialize the Google Search analyzer.
        
        Args:
            api_key: Gemini API key (defaults to environment variable)
            model: Model name to use for analysis
        """
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            raise ValueError("Gemini API key is required")
        
        self.model = model
        self.client = genai.Client(api_key=self.api_key)
        
        # Define the grounding tool
        self.grounding_tool = types.Tool(
            google_search=types.GoogleSearch()
        )
    
    def predict(
        self, 
        query: str,
        system_instruction: Optional[str] = None,
        custom_config: Optional[types.GenerateContentConfig] = None
    ) -> List[Document]:
        """
        Perform a grounded search with custom configuration.
        
        Args:
            query: The search query to perform
            system_instruction: Optional system instruction to guide the model
            custom_config: Optional custom configuration for the request
            
        Returns:
            List of Document objects containing the search results
        """
        # Use custom config or create default config
        if custom_config:
            config = custom_config
        else:
            config = types.GenerateContentConfig(
                tools=[self.grounding_tool]
            )
            
            # Add system instruction if provided
            if system_instruction:
                config = types.GenerateContentConfig(
                    tools=[self.grounding_tool],
                    system_instruction=system_instruction
                )
        
        # Make the request
        response = self.client.models.generate_content(
            model=self.model,
            contents=query,
            config=config,
        )
        
        # Create Document object
        document = Document(
            id=str(uuid.uuid4()),
            page_content=response.text,
            metadata={
                "model": self.model,
                "query": query,
                "system_instruction": system_instruction,
                "grounded": True,
                "custom_config": custom_config is not None,
                "source": "google_search_analyzer",
                "response_text": response.text
            }
        )
        
        return [document]
    
    def search_with_context(
        self, 
        query: str, 
        context: str,
        system_instruction: Optional[str] = None
    ) -> List[Document]:
        """
        Perform a search with additional context.
        
        Args:
            query: The search query to perform
            context: Additional context to include in the search
            system_instruction: Optional system instruction to guide the model
            
        Returns:
            List of Document objects containing the search results
        """
        # Combine query and context
        full_query = f"Context: {context}\n\nQuery: {query}"
        
        return self.predict(full_query, system_instruction)
    
    def search_multiple_queries(
        self, 
        queries: List[str],
        system_instruction: Optional[str] = None
    ) -> List[Document]:
        """
        Perform multiple searches in sequence.
        
        Args:
            queries: List of search queries to perform
            system_instruction: Optional system instruction to guide the model
            
        Returns:
            List of Document objects containing search results
        """
        documents = []
        
        for query in queries:
            result = self.predict(query, system_instruction)
            documents.extend(result)
        
        return documents
