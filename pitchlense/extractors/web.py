from pitchlense.extractors.base import BaseExtractor
from pitchlense.schema import Document

import uuid
import os
from typing import List, Optional
from perplexipy import PerplexityClient

try:
    from google import genai
    from google.genai.types import Tool, GenerateContentConfig
except ImportError as e:
    raise ImportError("Gemini Package not found. Please `pip install google-genai`")


class PerplexityExtractor(BaseExtractor):

    def __init__(self, key : str):
        self.client = PerplexityClient(key=key)
        self.client.model = "llama-3.1-sonar-small-128k-online"#"sonar"

    def extract(self, query : str) -> List[Document]:

        result = self.client.query(query)

        return [Document(
            id=str(uuid.uuid4()),
            page_content=result,
            metadata={
                "page_content": result
            }
        )]


class URLScraperExtractor(BaseExtractor):
    """
    URL scraper extractor using Google Gemini models with URL context tools.
    
    Provides functionality for extracting and analyzing content from web URLs
    using Google's URL context capabilities.
    """
    
    def __init__(self, api_key: Optional[str] = None, model: str = "gemini-2.5-flash"):
        """
        Initialize the URL scraper extractor.
        
        Args:
            api_key: Gemini API key (defaults to environment variable)
            model: Model name to use for URL extraction
        """
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            raise ValueError("Gemini API key is required")
        
        self.model = model
        self.client = genai.Client(api_key=self.api_key)
        
        # Define the URL context tool
        self.tools = [
            {"url_context": {}},
        ]
    
    def predict(
        self, 
        urls: List[str],
        query: str,
        system_instruction: Optional[str] = None
    ) -> List[Document]:
        """
        Extract and analyze content from multiple URLs.
        
        Args:
            urls: List of URLs to scrape and analyze
            query: Query or instruction about the URLs
            system_instruction: Optional system instruction to guide the model
            
        Returns:
            List of Document objects containing the extracted content
        """
        # Create the full query with URLs
        url_text = " and ".join([f"{url}" for url in urls])
        full_query = f"{query} at {url_text}"
        
        # Add system instruction if provided
        config = GenerateContentConfig(tools=self.tools)
        if system_instruction:
            config = GenerateContentConfig(
                tools=self.tools,
                system_instruction=system_instruction
            )
        
        # Make the request
        response = self.client.models.generate_content(
            model=self.model,
            contents=full_query,
            config=config,
        )
        
        # Extract text from all parts
        extracted_text = ""
        for part in response.candidates[0].content.parts:
            extracted_text += part.text + "\n"
        
        # Get URL context metadata
        url_metadata = response.candidates[0].url_context_metadata
        
        # Create Document object
        document = Document(
            id=str(uuid.uuid4()),
            page_content=extracted_text.strip(),
            metadata={
                "model": self.model,
                "urls": urls,
                "query": query,
                "system_instruction": system_instruction,
                "url_context_metadata": url_metadata,
                "source": "url_scraper",
                "num_urls": len(urls)
            }
        )
        
        return [document]
    
    def extract(self) -> List[Document]:
        """
        Extract method required by BaseExtractor.
        
        This method is not typically used for URL scraping functionality,
        but is required by the base class interface.
        
        Returns:
            List containing a placeholder Document
        """
        return [Document(
            id=str(uuid.uuid4()),
            page_content="Use predict() method for URL scraping functionality",
            metadata={
                "type": "url_scraper",
                "message": "Use predict() method for URL scraping functionality"
            }
        )]
    
    async def aextract(self) -> List[Document]:
        """
        Async version of extract method.
        
        Returns:
            List containing a placeholder Document
        """
        return self.extract()


class URLScraperAnalyzer:
    """
    URL scraper analyzer for comprehensive URL content analysis.
    
    Provides advanced URL scraping capabilities with customizable queries
    and result processing.
    """
    
    def __init__(self, api_key: Optional[str] = None, model: str = "gemini-2.5-flash"):
        """
        Initialize the URL scraper analyzer.
        
        Args:
            api_key: Gemini API key (defaults to environment variable)
            model: Model name to use for analysis
        """
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            raise ValueError("Gemini API key is required")
        
        self.model = model
        self.client = genai.Client(api_key=self.api_key)
        
        # Define the URL context tool
        self.tools = [
            {"url_context": {}},
        ]
    
    def predict(
        self, 
        urls: List[str],
        query: str,
        system_instruction: Optional[str] = None,
        custom_config: Optional[GenerateContentConfig] = None
    ) -> List[Document]:
        """
        Extract and analyze content from URLs with custom configuration.
        
        Args:
            urls: List of URLs to scrape and analyze
            query: Query or instruction about the URLs
            system_instruction: Optional system instruction to guide the model
            custom_config: Optional custom configuration for the request
            
        Returns:
            List of Document objects containing the extracted content
        """
        # Create the full query with URLs
        url_text = " and ".join([f"{url}" for url in urls])
        full_query = f"{query} at {url_text}"
        
        # Use custom config or create default config
        if custom_config:
            config = custom_config
        else:
            config = GenerateContentConfig(tools=self.tools)
            
            # Add system instruction if provided
            if system_instruction:
                config = GenerateContentConfig(
                    tools=self.tools,
                    system_instruction=system_instruction
                )
        
        # Make the request
        response = self.client.models.generate_content(
            model=self.model,
            contents=full_query,
            config=config,
        )
        
        # Extract text from all parts
        extracted_text = ""
        for part in response.candidates[0].content.parts:
            extracted_text += part.text + "\n"
        
        # Get URL context metadata
        url_metadata = response.candidates[0].url_context_metadata
        
        # Create Document object
        document = Document(
            id=str(uuid.uuid4()),
            page_content=extracted_text.strip(),
            metadata={
                "model": self.model,
                "urls": urls,
                "query": query,
                "system_instruction": system_instruction,
                "url_context_metadata": url_metadata,
                "source": "url_scraper_analyzer",
                "num_urls": len(urls),
                "custom_config": custom_config is not None
            }
        )
        
        return [document]
    
    def compare_urls(
        self, 
        urls: List[str],
        comparison_criteria: str,
        system_instruction: Optional[str] = None
    ) -> List[Document]:
        """
        Compare content from multiple URLs based on specific criteria.
        
        Args:
            urls: List of URLs to compare
            comparison_criteria: Specific criteria for comparison
            system_instruction: Optional system instruction to guide the model
            
        Returns:
            List of Document objects containing the comparison results
        """
        query = f"Compare {comparison_criteria} from"
        
        return self.predict(urls, query, system_instruction)
    
    def extract_specific_info(
        self, 
        urls: List[str],
        info_type: str,
        system_instruction: Optional[str] = None
    ) -> List[Document]:
        """
        Extract specific type of information from URLs.
        
        Args:
            urls: List of URLs to extract information from
            info_type: Type of information to extract (e.g., "prices", "reviews", "specifications")
            system_instruction: Optional system instruction to guide the model
            
        Returns:
            List of Document objects containing the extracted information
        """
        query = f"Extract {info_type} from"
        
        return self.predict(urls, query, system_instruction)