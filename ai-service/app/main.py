"""AI Service entrypoint — FastAPI app assembly.

Run with:  uvicorn app.main:app --port 8001
(or:  python -m app.main  for the dev convenience block at the bottom)

Internal service: only the Node backend talks to it. It owns prompts,
providers, and models — and knows nothing about MongoDB, MinIO, Redis,
or users (Decisions 1, 5).
"""

from fastapi import FastAPI

from app.api.v1.router import api_v1_router
from app.core.config import settings
from app.core.exceptions import (
    AIServiceError,
    ai_service_error_handler,
    unhandled_error_handler,
)
from app.core.logging import configure_logging, logger

configure_logging()

app = FastAPI(
    title="InsightDocs AI Service",
    description="Internal AI service — consumed exclusively by the Node backend",
    version="1.0.0",
)

app.add_exception_handler(AIServiceError, ai_service_error_handler)
app.add_exception_handler(Exception, unhandled_error_handler)

app.include_router(api_v1_router)


@app.get("/health")
async def health() -> dict:
    return {"status": "ok"}


@app.on_event("startup")
async def on_startup() -> None:
    logger.info(
        "AI service starting (llm=%s, embedding=%s)",
        settings.openrouter_model,
        settings.embedding_model,
    )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.ai_service_port, reload=True)
