"""Chat streaming endpoint — POST /api/v1/chat/stream.

Returns Server-Sent Events. The backend relays this stream to the
frontend unchanged, so the event shapes here ARE the frontend contract.
"""

from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from app.schemas.chat import ChatStreamRequest
from app.services import chat_service

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("/stream")
async def stream_chat(payload: ChatStreamRequest) -> StreamingResponse:
    return StreamingResponse(
        chat_service.stream_chat(payload),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache"},
    )
