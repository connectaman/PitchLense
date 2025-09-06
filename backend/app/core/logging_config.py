"""
Centralized logging configuration for the backend.

Emits structured key=value logs to stdout so Cloud Run can capture them.
"""

import logging
import os
import sys
from typing import Optional


def _get_log_level_from_env(default: str = "INFO") -> int:
    level_name = os.getenv("LOG_LEVEL", default).upper()
    return getattr(logging, level_name, logging.INFO)


def init_logging(service_name: Optional[str] = None) -> None:
    """Initialize root logging for the application.

    - Sends logs to stdout
    - Uses a concise key=value structured format
    - Respects LOG_LEVEL env var
    """
    log_level = _get_log_level_from_env()

    # Avoid duplicate handlers if reloaded
    root_logger = logging.getLogger()
    if root_logger.handlers:
        for handler in list(root_logger.handlers):
            root_logger.removeHandler(handler)

    formatter = logging.Formatter(
        fmt=(
            "time=%(asctime)s level=%(levelname)s logger=%(name)s "
            + (f"service={service_name} " if service_name else "")
            + "message=\"%(message)s\""
        ),
        datefmt="%Y-%m-%dT%H:%M:%S%z",
    )

    stream_handler = logging.StreamHandler(stream=sys.stdout)
    stream_handler.setFormatter(formatter)
    stream_handler.setLevel(log_level)

    root_logger.addHandler(stream_handler)
    root_logger.setLevel(log_level)

    # Make common noisy loggers less verbose unless explicitly set
    logging.getLogger("urllib3").setLevel(logging.WARNING)
    logging.getLogger("botocore").setLevel(logging.WARNING)
    logging.getLogger("google").setLevel(logging.WARNING)

    # Ensure Uvicorn loggers integrate with our root handler
    for uvicorn_logger_name in ("uvicorn", "uvicorn.error", "uvicorn.access"):
        uvicorn_logger = logging.getLogger(uvicorn_logger_name)
        uvicorn_logger.handlers = []
        uvicorn_logger.propagate = True
        uvicorn_logger.setLevel(log_level)


