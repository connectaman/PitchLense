"""
Google Gemini LLM integration for PitchLense AI Pipeline

Provides comprehensive classes for text generation, image understanding,
video understanding, audio understanding, and document understanding.
"""

import os
import base64
import pathlib
from typing import Optional, Union, List, Dict, Any
import requests

try:
    from google import genai
    from google.genai import types
except ImportError as e:
    raise ImportError("Gemini Package not found. Please `pip install google-genai`")

from .base import BaseLLM


class GeminiTextGenerator:
    """
    Text generation using Google Gemini models.
    
    Provides functionality for generating text content with system instructions
    and user prompts.
    """
    
    def __init__(self, api_key: Optional[str] = None, model: str = "gemini-2.5-flash"):
        """
        Initialize the text generator.
        
        Args:
            api_key: Gemini API key (defaults to environment variable)
            model: Model name to use for generation
        """
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            raise ValueError("Gemini API key is required")
        
        self.model = model
        self.client = genai.Client(api_key=self.api_key)
    
    def predict(
        self, 
        user_prompt: str, 
        system_instruction: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Generate text content using Gemini.
        
        Args:
            user_prompt: The user's input prompt
            system_instruction: Optional system instruction to guide the model
            
        Returns:
            Dictionary containing the generated text and metadata
        """
        config = None
        if system_instruction:
            config = types.GenerateContentConfig(
                system_instruction=system_instruction
            )
        
        response = self.client.models.generate_content(
            model=self.model,
            config=config,
            contents=user_prompt
        )
        
        return {
            "text": response.text,
            "model": self.model,
            "system_instruction": system_instruction,
            "user_prompt": user_prompt
        }


class GeminiImageAnalyzer:
    """
    Image understanding and analysis using Google Gemini models.
    
    Provides functionality for analyzing images and generating text descriptions
    or answering questions about image content.
    """
    
    def __init__(self, api_key: Optional[str] = None, model: str = "gemini-2.5-flash"):
        """
        Initialize the image analyzer.
        
        Args:
            api_key: Gemini API key (defaults to environment variable)
            model: Model name to use for analysis
        """
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            raise ValueError("Gemini API key is required")
        
        self.model = model
        self.client = genai.Client(api_key=self.api_key)
    
    def predict_from_url(
        self, 
        image_url: str, 
        prompt: str,
        mime_type: str = "image/jpeg"
    ) -> Dict[str, Any]:
        """
        Analyze an image from a URL.
        
        Args:
            image_url: URL of the image to analyze
            prompt: Question or instruction about the image
            mime_type: MIME type of the image
            
        Returns:
            Dictionary containing the analysis result and metadata
        """
        image_bytes = requests.get(image_url).content
        image = types.Part.from_bytes(
            data=image_bytes, 
            mime_type=mime_type
        )
        
        response = self.client.models.generate_content(
            model=self.model,
            contents=[prompt, image]
        )
        
        return {
            "text": response.text,
            "model": self.model,
            "image_url": image_url,
            "prompt": prompt,
            "mime_type": mime_type
        }
    
    def predict(
        self, 
        image_input: Union[str, bytes], 
        prompt: str,
        mime_type: str = "image/jpeg"
    ) -> Dict[str, Any]:
        """
        Analyze an image from path or bytes.
        
        Args:
            image_input: Image file path (str) or raw image bytes (bytes)
            prompt: Question or instruction about the image
            mime_type: MIME type of the image
            
        Returns:
            Dictionary containing the analysis result and metadata
        """
        # Handle image input - could be path or bytes
        if isinstance(image_input, str):
            # If it's a string, treat as file path and read bytes
            try:
                with open(image_input, 'rb') as f:
                    image_bytes = f.read()
            except FileNotFoundError:
                raise ValueError(f"Image file not found: {image_input}")
            except Exception as e:
                raise ValueError(f"Error reading image file {image_input}: {str(e)}")
        elif isinstance(image_input, bytes):
            # If it's already bytes, use directly
            image_bytes = image_input
        else:
            raise ValueError("image_input must be either a file path (str) or image bytes (bytes)")
        
        # Create image part from bytes
        image = types.Part.from_bytes(
            data=image_bytes, 
            mime_type=mime_type
        )
        
        response = self.client.models.generate_content(
            model=self.model,
            contents=[prompt, image]
        )
        
        return {
            "text": response.text,
            "model": self.model,
            "prompt": prompt,
            "mime_type": mime_type,
            "input_type": "path" if isinstance(image_input, str) else "bytes"
        }
    
    def predict_from_path(
        self, 
        image_path: str, 
        prompt: str,
        mime_type: str = "image/jpeg"
    ) -> Dict[str, Any]:
        """
        Analyze an image from file path.
        
        Args:
            image_path: Path to the image file
            prompt: Question or instruction about the image
            mime_type: MIME type of the image
            
        Returns:
            Dictionary containing the analysis result and metadata
        """
        return self.predict(image_path, prompt, mime_type)
    
    def predict_from_bytes(
        self, 
        image_bytes: bytes, 
        prompt: str,
        mime_type: str = "image/jpeg"
    ) -> Dict[str, Any]:
        """
        Analyze an image from bytes.
        
        Args:
            image_bytes: Raw image bytes
            prompt: Question or instruction about the image
            mime_type: MIME type of the image
            
        Returns:
            Dictionary containing the analysis result and metadata
        """
        return self.predict(image_bytes, prompt, mime_type)


class GeminiVideoAnalyzer:
    """
    Video understanding and analysis using Google Gemini models.
    
    Provides functionality for analyzing videos and generating summaries,
    quizzes, or answering questions about video content.
    """
    
    def __init__(self, api_key: Optional[str] = None, model: str = "gemini-2.5-flash"):
        """
        Initialize the video analyzer.
        
        Args:
            api_key: Gemini API key (defaults to environment variable)
            model: Model name to use for analysis
        """
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            raise ValueError("Gemini API key is required")
        
        self.model = model
        self.client = genai.Client(api_key=self.api_key)
    
    def predict(
        self, 
        video_input: Union[str, bytes], 
        prompt: str,
        mime_type: str = "video/mp4"
    ) -> Dict[str, Any]:
        """
        Analyze a video file from path or bytes.
        
        Args:
            video_input: Video file path (str) or raw video bytes (bytes)
            prompt: Question or instruction about the video
            mime_type: MIME type of the video (default: video/mp4)
            
        Returns:
            Dictionary containing the analysis result and metadata
        """
        # Handle video input - could be path or bytes
        if isinstance(video_input, str):
            # If it's a string, treat as file path and read bytes
            try:
                with open(video_input, 'rb') as f:
                    video_bytes = f.read()
            except FileNotFoundError:
                raise ValueError(f"Video file not found: {video_input}")
            except Exception as e:
                raise ValueError(f"Error reading video file {video_input}: {str(e)}")
        elif isinstance(video_input, bytes):
            # If it's already bytes, use directly
            video_bytes = video_input
        else:
            raise ValueError("video_input must be either a file path (str) or video bytes (bytes)")
        
        # Check file size (Gemini has 20MB limit for videos)
        if len(video_bytes) > 20 * 1024 * 1024:  # 20MB in bytes
            raise ValueError("Video file size exceeds 20MB limit for Gemini API")
        
        # Create video content using inline data
        response = self.client.models.generate_content(
            model=self.model,
            contents=types.Content(
                parts=[
                    types.Part(
                        inline_data=types.Blob(data=video_bytes, mime_type=mime_type)
                    ),
                    types.Part(text=prompt)
                ]
            )
        )
        
        return {
            "text": response.text,
            "model": self.model,
            "prompt": prompt,
            "mime_type": mime_type,
            "input_type": "path" if isinstance(video_input, str) else "bytes",
            "file_size_mb": len(video_bytes) / (1024 * 1024)
        }
    
    def predict_from_path(
        self, 
        video_path: str, 
        prompt: str,
        mime_type: str = "video/mp4"
    ) -> Dict[str, Any]:
        """
        Analyze a video file from path.
        
        Args:
            video_path: Path to the video file
            prompt: Question or instruction about the video
            mime_type: MIME type of the video
            
        Returns:
            Dictionary containing the analysis result and metadata
        """
        return self.predict(video_path, prompt, mime_type)
    
    def predict_from_bytes(
        self, 
        video_bytes: bytes, 
        prompt: str,
        mime_type: str = "video/mp4"
    ) -> Dict[str, Any]:
        """
        Analyze a video from bytes.
        
        Args:
            video_bytes: Raw video bytes
            prompt: Question or instruction about the video
            mime_type: MIME type of the video
            
        Returns:
            Dictionary containing the analysis result and metadata
        """
        return self.predict(video_bytes, prompt, mime_type)


class GeminiAudioAnalyzer:
    """
    Audio understanding and analysis using Google Gemini models.
    
    Provides functionality for analyzing audio files and generating
    descriptions or transcriptions.
    """
    
    def __init__(self, api_key: Optional[str] = None, model: str = "gemini-2.5-flash"):
        """
        Initialize the audio analyzer.
        
        Args:
            api_key: Gemini API key (defaults to environment variable)
            model: Model name to use for analysis
        """
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            raise ValueError("Gemini API key is required")
        
        self.model = model
        self.client = genai.Client(api_key=self.api_key)
    
    def predict(
        self, 
        audio_input: Union[str, bytes], 
        prompt: str,
        mime_type: str = "audio/mp3"
    ) -> Dict[str, Any]:
        """
        Analyze an audio file from path or bytes.
        
        Args:
            audio_input: Audio file path (str) or raw audio bytes (bytes)
            prompt: Question or instruction about the audio
            mime_type: MIME type of the audio (default: audio/mp3)
            
        Returns:
            Dictionary containing the analysis result and metadata
        """
        # Handle audio input - could be path or bytes
        if isinstance(audio_input, str):
            # If it's a string, treat as file path and read bytes
            try:
                with open(audio_input, 'rb') as f:
                    audio_bytes = f.read()
            except FileNotFoundError:
                raise ValueError(f"Audio file not found: {audio_input}")
            except Exception as e:
                raise ValueError(f"Error reading audio file {audio_input}: {str(e)}")
        elif isinstance(audio_input, bytes):
            # If it's already bytes, use directly
            audio_bytes = audio_input
        else:
            raise ValueError("audio_input must be either a file path (str) or audio bytes (bytes)")
        
        # Check file size (Gemini has limits for audio files)
        if len(audio_bytes) > 50 * 1024 * 1024:  # 50MB in bytes (typical limit)
            raise ValueError("Audio file size exceeds 50MB limit for Gemini API")
        
        # Create audio content using inline data
        response = self.client.models.generate_content(
            model=self.model,
            contents=[
                prompt,
                types.Part.from_bytes(
                    data=audio_bytes,
                    mime_type=mime_type,
                )
            ]
        )
        
        return {
            "text": response.text,
            "model": self.model,
            "prompt": prompt,
            "mime_type": mime_type,
            "input_type": "path" if isinstance(audio_input, str) else "bytes",
            "file_size_mb": len(audio_bytes) / (1024 * 1024)
        }
    
    def predict_from_path(
        self, 
        audio_path: str, 
        prompt: str,
        mime_type: str = "audio/mp3"
    ) -> Dict[str, Any]:
        """
        Analyze an audio file from path.
        
        Args:
            audio_path: Path to the audio file
            prompt: Question or instruction about the audio
            mime_type: MIME type of the audio
            
        Returns:
            Dictionary containing the analysis result and metadata
        """
        return self.predict(audio_path, prompt, mime_type)
    
    def predict_from_bytes(
        self, 
        audio_bytes: bytes, 
        prompt: str,
        mime_type: str = "audio/mp3"
    ) -> Dict[str, Any]:
        """
        Analyze an audio from bytes.
        
        Args:
            audio_bytes: Raw audio bytes
            prompt: Question or instruction about the audio
            mime_type: MIME type of the audio
            
        Returns:
            Dictionary containing the analysis result and metadata
        """
        return self.predict(audio_bytes, prompt, mime_type)


class GeminiDocumentAnalyzer:
    """
    Document understanding and analysis using Google Gemini models.
    
    Provides functionality for analyzing documents (PDF, DOCX, etc.) and
    generating summaries or answering questions about document content.
    """
    
    def __init__(self, api_key: Optional[str] = None, model: str = "gemini-2.5-flash"):
        """
        Initialize the document analyzer.
        
        Args:
            api_key: Gemini API key (defaults to environment variable)
            model: Model name to use for analysis
        """
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            raise ValueError("Gemini API key is required")
        
        self.model = model
        self.client = genai.Client(api_key=self.api_key)
    
    def predict(
        self, 
        document_path: str, 
        prompt: str,
        mime_type: str = "application/pdf"
    ) -> Dict[str, Any]:
        """
        Analyze a document file.
        
        Args:
            document_path: Path to the document file
            prompt: Question or instruction about the document
            mime_type: MIME type of the document
            
        Returns:
            Dictionary containing the analysis result and metadata
        """
        filepath = pathlib.Path(document_path)
        
        response = self.client.models.generate_content(
            model=self.model,
            contents=[
                types.Part.from_bytes(
                    data=filepath.read_bytes(),
                    mime_type=mime_type,
                ),
                prompt
            ]
        )
        
        return {
            "text": response.text,
            "model": self.model,
            "document_path": document_path,
            "prompt": prompt,
            "mime_type": mime_type
        }


class GeminiLLM(BaseLLM):
    """
    Comprehensive Google Gemini LLM integration for PitchLense.
    
    Provides unified access to all Gemini capabilities including text generation,
    image analysis, video analysis, audio analysis, and document analysis.
    """
    
    def __init__(
        self, 
        api_key: Optional[str] = None, 
        model: str = "gemini-2.5-flash"
    ):
        """
        Initialize the Gemini LLM with all analyzers.
        
        Args:
            api_key: Gemini API key (defaults to environment variable)
            model: Model name to use for all operations
        """
        super().__init__()
        
        # Initialize all analyzers
        self.text_generator = GeminiTextGenerator(api_key, model)
        self.image_analyzer = GeminiImageAnalyzer(api_key, model)
        self.video_analyzer = GeminiVideoAnalyzer(api_key, model)
        self.audio_analyzer = GeminiAudioAnalyzer(api_key, model)
        self.document_analyzer = GeminiDocumentAnalyzer(api_key, model)
        
        self.model = model
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
    
    def predict(
        self, 
        system_message: str, 
        user_message: str, 
        image_base64: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Generate text prediction with optional image analysis.
        
        Args:
            system_message: System instruction for the model
            user_message: User's input message
            image_base64: Optional base64 encoded image
            
        Returns:
            Dictionary containing the response and usage information
        """
        if image_base64:
            # Handle image analysis
            img_bytes = base64.b64decode(image_base64)
            result = self.image_analyzer.predict(
                img_bytes, 
                user_message
            )
            return {
                "response": result["text"],
                "usage": {"model": self.model, "type": "image_analysis"}
            }
        else:
            # Handle text generation
            result = self.text_generator.predict(
                user_message, 
                system_message
            )
            return {
                "response": result["text"],
                "usage": {"model": self.model, "type": "text_generation"}
            }
    
    async def predict_stream(self, user_message: str):
        """
        Stream predictions (placeholder for future implementation).
        
        Args:
            user_message: User's input message
            
        Yields:
            Streamed response chunks
        """
        # Placeholder for streaming implementation
        result = self.text_generator.predict(user_message)
        yield result["text"]