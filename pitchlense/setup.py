"""
Setup configuration for PitchLense AI Pipeline

A professional AI-powered startup evaluation and analysis pipeline.
"""

from setuptools import setup, find_packages
from pathlib import Path

# Read the README file
this_directory = Path(__file__).parent
long_description = (this_directory / "README.md").read_text(encoding="utf-8")

# Read requirements
requirements = []
with open("requirements.txt", "r", encoding="utf-8") as f:
    requirements = [line.strip() for line in f if line.strip() and not line.startswith("#")]

setup(
    name="pitchlense",
    version="1.0.0",
    author="Aman Ulla",
    author_email="connectamanulla@gmail.com",
    description="AI-powered startup evaluation and analysis pipeline",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/amanulla/pitchlense",
    project_urls={
        "Bug Reports": "https://github.com/amanulla/pitchlense/issues",
        "Source": "https://github.com/amanulla/pitchlense",
        "Documentation": "https://github.com/amanulla/pitchlense#readme",
    },
    packages=find_packages(),
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: Developers",
        "Intended Audience :: Financial and Insurance Industry",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Topic :: Scientific/Engineering :: Artificial Intelligence",
        "Topic :: Software Development :: Libraries :: Python Modules",
        "Topic :: Text Processing :: Linguistic",
    ],
    python_requires=">=3.8",
    install_requires=requirements,
    extras_require={
        "dev": [
            "pytest>=7.4.0",
            "pytest-asyncio>=0.21.0",
            "pytest-cov>=4.1.0",
            "black>=23.0.0",
            "isort>=5.12.0",
            "flake8>=6.0.0",
            "mypy>=1.5.0",
        ],
        "docs": [
            "sphinx>=7.0.0",
            "sphinx-rtd-theme>=1.3.0",
            "myst-parser>=2.0.0",
        ],
    },
    entry_points={
        "console_scripts": [
            "pitchlense=pitchlense.cli:main",
        ],
    },
    include_package_data=True,
    zip_safe=False,
    keywords=[
        "ai",
        "artificial-intelligence",
        "startup",
        "evaluation",
        "analysis",
        "pipeline",
        "document-processing",
        "nlp",
        "machine-learning",
    ],
)
