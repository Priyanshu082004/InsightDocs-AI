"""Chat service — builds the RAG prompt from structured input and streams
the model's answer as SSE-formatted events.

Event contract (relayed verbatim by the backend's SSE endpoint, so it
matches what the frontend already consumes):
  data: {"token": "..."}   — one event per generated token
  data: {"done": true}     — terminal event (backend augments with
                             messageId/citedChunkIds after persisting)
  data: {"error": "..."}   — emitted instead of done on failure
"""

import json
from collections.abc import AsyncIterator

from app.core.logging import logger
from app.prompts.rag import build_rag_prompt
from app.providers import openrouter
from app.schemas.chat import ChatStreamRequest


async def stream_chat(payload: ChatStreamRequest) -> AsyncIterator[str]:
    prompt = build_rag_prompt(payload.question, payload.chunks)
    try:
        async for token in openrouter.generate_text_stream(prompt):
            yield f"data: {json.dumps({'token': token})}\n\n"
        yield f"data: {json.dumps({'done': True})}\n\n"
    except Exception as err:  # noqa: BLE001 — stream already started; can't change status code
        logger.error("Chat stream failed mid-generation: %s", err)
        yield f"data: {json.dumps({'error': 'AI generation failed'})}\n\n"
