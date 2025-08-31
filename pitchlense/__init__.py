"""
PitchLense AI Pipeline

AI-powered startup evaluation and analysis pipeline.
Built for the Hack2Skill-Google Hackathon by Aman Ulla.
"""

__version__ = "1.0.0"
__author__ = "Aman Ulla"
__email__ = "connectamanulla@gmail.com"
__description__ = "AI-powered startup evaluation and analysis pipeline"
__url__ = "https://github.com/amanulla/pitchlense"
__license__ = "MIT"

# Import existing schema
from .schema import Document

__all__ = [
    "Document",
]
