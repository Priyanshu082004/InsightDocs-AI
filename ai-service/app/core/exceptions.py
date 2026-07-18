"""Exception hierarchy — the Python counterpart of backend's ApiError.js.

Services raise AIServiceError subclasses; the handlers registered in
main.py translate them into the same JSON envelope shape the backend's
errorHandler middleware produces ({"success": false, "message": ...}),
so aiService.client.js can surface errors uniformly.
"""

from fastapi import Request
from fastapi.responses import JSONResponse


class AIServiceError(Exception):
    """Base class: operational errors safe to expose to the caller."""

    status_code = 500

    def __init__(self, message: str):
        self.message = message
        super().__init__(message)


class ProviderError(AIServiceError):
    """Upstream LLM/embedding provider failed (network, API error)."""

    status_code = 502


class MalformedModelOutput(AIServiceError):
    """The model returned output we could not parse (e.g. invalid JSON)."""

    status_code = 502


class ValidationFailure(AIServiceError):
    """Request payload was structurally valid but semantically unusable."""

    status_code = 422


async def ai_service_error_handler(_: Request, exc: AIServiceError) -> JSONResponse:
    return JSONResponse(
        status_code=exc.status_code,
        content={"success": False, "message": exc.message},
    )


async def unhandled_error_handler(_: Request, exc: Exception) -> JSONResponse:
    # Mirror the backend's errorHandler: never leak internals for
    # non-operational errors — generic message only.
    return JSONResponse(
        status_code=500,
        content={"success": False, "message": "Internal server error"},
    )
