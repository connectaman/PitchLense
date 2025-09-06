import logging
import time
from typing import Callable

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response


class LoggingMiddleware(BaseHTTPMiddleware):
    """Logs each request with method, path, status, latency, and client info.

    Skips very noisy paths like /health.
    """

    def __init__(self, app):
        super().__init__(app)
        self.logger = logging.getLogger("request")

    async def dispatch(self, request: Request, call_next: Callable[[Request], Response]) -> Response:
        path = request.url.path
        if path in {"/health", "/"}:  # reduce noise
            return await call_next(request)

        start_time = time.perf_counter()

        # Extract trace id from Cloud Run / GCLB if present
        trace_header = request.headers.get("X-Cloud-Trace-Context", "")
        trace_id = trace_header.split("/", 1)[0] if trace_header else ""

        try:
            response = await call_next(request)
            status_code = response.status_code
        except Exception:
            # Let global exception handler format the response
            status_code = 500
            self.logger.exception(
                "method=%s path=%s status=%s client_ip=%s user_agent=\"%s\" trace_id=%s",
                request.method,
                path,
                status_code,
                request.client.host if request.client else "",
                request.headers.get("user-agent", ""),
                trace_id,
            )
            raise

        duration_ms = int((time.perf_counter() - start_time) * 1000)

        self.logger.info(
            "method=%s path=%s status=%s duration_ms=%s client_ip=%s user_agent=\"%s\" trace_id=%s",
            request.method,
            path,
            status_code,
            duration_ms,
            request.client.host if request.client else "",
            request.headers.get("user-agent", ""),
            trace_id,
        )

        return response


