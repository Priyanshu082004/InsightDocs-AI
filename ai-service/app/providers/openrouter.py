"""OpenRouter LLM provider
- generate_text: single-shot text completion
- generate_json: text completion + fence-strip + json.loads
- generate_vision_text: multimodal (base64 data-URI image) for OCR
- generate_text_stream: async generator yielding tokens

OpenRouter exposes an OpenAI-compatible API, so the official openai SDK
is reused (AsyncOpenAI) pointed at OpenRouter's base URL — mirroring the
exact approach the Node provider took.
"""

import json
import re
from collections.abc import AsyncIterator

from openai import AsyncOpenAI

from app.core.config import settings
from app.core.exceptions import MalformedModelOutput, ProviderError
from app.core.logging import logger

_client = AsyncOpenAI(
    api_key=settings.openrouter_api_key,
    base_url=settings.openrouter_base_url,
)

_FENCE_RE = re.compile(r"```json|```")


async def generate_text(prompt: str) -> str:
    try:
        completion = await _client.chat.completions.create(
            model=settings.openrouter_model,
            messages=[{"role": "user", "content": prompt}],
        )
        return completion.choices[0].message.content or ""
    except Exception as err:  # noqa: BLE001 — provider boundary
        logger.error("OpenRouter text generation failed: %s", err)
        raise ProviderError("AI generation failed") from err


async def generate_json(prompt: str) -> dict:

    raw = await generate_text(
        prompt + "\n\nRespond with ONLY valid JSON. No markdown code fences, no commentary, no explanation."
    )
    cleaned = _FENCE_RE.sub("", raw).strip()
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError as err:
        logger.error("Model returned malformed JSON: %r", raw[:500])
        raise MalformedModelOutput("AI returned a malformed response") from err


async def generate_vision_text(prompt: str, image_bytes: bytes, mime_type: str) -> str:
    import base64

    data_uri = f"data:{mime_type};base64,{base64.b64encode(image_bytes).decode()}"
    try:
        completion = await _client.chat.completions.create(
            model=settings.openrouter_model,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {"type": "image_url", "image_url": {"url": data_uri}},
                    ],
                }
            ],
        )
        return completion.choices[0].message.content or ""
    except Exception as err:  # noqa: BLE001
        logger.error("OpenRouter vision call failed: %s", err)
        raise ProviderError("AI OCR failed") from err


async def generate_text_stream(prompt: str) -> AsyncIterator[str]:
    """Yield tokens as they arrive. Cancellation propagates naturally:
    if the HTTP client (the backend) disconnects, FastAPI cancels the
    task, which cancels this generator and the upstream request."""
    try:
        stream = await _client.chat.completions.create(
            model=settings.openrouter_model,
            messages=[{"role": "user", "content": prompt}],
            stream=True,
        )
        async for part in stream:
            token = part.choices[0].delta.content if part.choices else None
            if token:
                yield token
    except Exception as err:  # noqa: BLE001
        logger.error("OpenRouter streaming failed: %s", err)
        raise ProviderError("AI generation failed") from err
