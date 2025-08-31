# PitchLense AI Pipeline

[![Python 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Code style: black](https://img.shields.io/badge/code%20style-black-000000.svg)](https://github.com/psf/black)
[![Imports: isort](https://img.shields.io/badge/%20imports-isort-%231674b1?style=flat&labelColor=ef8336)](https://pycqa.github.io/isort/)

A professional AI-powered startup evaluation and analysis pipeline built for the Hack2Skill-Google Hackathon.

## 🚀 Features

- **Document Processing**: Extract and analyze various document formats (PDF, DOCX, audio, etc.)
- **AI-Powered Analysis**: Leverage Google AI, OpenAI, and Anthropic models for comprehensive analysis
- **Startup Evaluation**: Comprehensive startup assessment with risk analysis and scoring
- **Modular Architecture**: Extensible pipeline design for custom analysis workflows
- **Professional Codebase**: Well-documented, type-hinted, and tested code

## 📦 Installation

### From Source

```bash
# Clone the repository
git clone https://github.com/amanulla/pitchlense.git
cd pitchlense

# Install in development mode
pip install -e .

# Install development dependencies
pip install -e ".[dev]"
```

### From PyPI (when published)

```bash
pip install pitchlense
```

## 🏗️ Project Structure

```
pitchlense/
├── pitchlense/
│   ├── __init__.py          # Package initialization
│   ├── schema/              # Data models and schemas
│   │   ├── __init__.py
│   │   ├── base.py          # Base media class
│   │   └── document.py      # Document schema
│   └── extractors/          # Document extraction components
│       ├── __init__.py
│       └── base.py          # Base extractor interface
├── requirements.txt         # Python dependencies
├── setup.py                # Package setup
├── pyproject.toml          # Modern Python packaging
└── README.md               # This file
```

## 🔧 Configuration

Create a `.env` file in the project root:

```env
# AI Configuration
GOOGLE_AI_API_KEY=your_google_ai_key
GOOGLE_PROJECT_ID=your_project_id
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key

# Database Configuration
DATABASE_URL=postgresql://user:pass@localhost/db
REDIS_URL=redis://localhost:6379

# Storage Configuration
STORAGE_BUCKET=your_bucket_name
STORAGE_REGION=us-central1

# Security
JWT_SECRET=your_jwt_secret
```

## 📚 Usage

### Basic Usage

```python
from pitchlense import Document
from pitchlense.extractors import BaseExtractor

# Create a document
doc = Document(
    title="Startup Pitch Deck",
    filename="pitch_deck.pdf",
    # ... other parameters
)

# Use extractors
class MyExtractor(BaseExtractor):
    def extract(self):
        # Implement extraction logic
        return [doc]
```

### Advanced Usage

```python
from pitchlense.schema import Document

# Create a comprehensive document with metadata
document = Document(
    title="TechFlow Solutions Pitch Deck",
    filename="techflow_pitch.pdf",
    web_url="https://example.com/pitch",
    document_publish_date="2024-01-15",
    document_publisher="TechFlow Solutions",
    document_publisher_type="startup",
    document_id="techflow_001",
    summary="AI-powered workflow automation platform",
    keywords="AI, automation, workflow, B2B",
    language="en",
    primary_industry="Technology",
    secondary_industry="Software",
    other_industry="",
    geography="Global",
    entities="TechFlow, AI, automation",
    page_count=15,
    tables_count=3,
    images_count=8,
    total_tokens=5000,
    documents=[],
    ner={},
    document_base64="base64_encoded_content",
    document_content="Raw document text content"
)
```

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=pitchlense

# Run specific test categories
pytest -m unit
pytest -m integration
pytest -m "not slow"
```

## 🛠️ Development

### Code Quality

```bash
# Format code
black pitchlense/

# Sort imports
isort pitchlense/

# Lint code
flake8 pitchlense/

# Type checking
mypy pitchlense/
```

### Pre-commit Hooks

Install pre-commit hooks:

```bash
pip install pre-commit
pre-commit install
```

## 📖 Documentation

- [API Reference](docs/api.md)
- [Contributing Guidelines](CONTRIBUTING.md)
- [Changelog](CHANGELOG.md)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for the [Hack2Skill-Google Hackathon](https://vision.hack2skill.com/event/genaiexchangehackathon/)
- Created with ❤️ by [Aman Ulla](https://amanulla.in/)

## 📞 Support

- **Author**: Aman Ulla
- **Email**: connectamanulla@gmail.com
- **Website**: https://amanulla.in/
- **Issues**: [GitHub Issues](https://github.com/amanulla/pitchlense/issues)

---

**Note**: This project is currently in development for the Hack2Skill-Google Hackathon. Features and APIs may change as the project evolves.
