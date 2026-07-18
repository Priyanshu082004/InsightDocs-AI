"""RAG chat prompt — verbatim port of buildRagPrompt from the backend's
former modules/chat/ragPromptBuilder.js. The [Source N] numbering follows
the order of the chunks list, which preserves the backend's retrieval
ranking (and therefore the meaning of citedChunkIds)."""

from app.schemas.chat import ContextChunk


def build_rag_prompt(question: str, chunks: list[ContextChunk]) -> str:
    context = "\n\n".join(
        f"[Source {i + 1}]\n{chunk.text}" for i, chunk in enumerate(chunks)
    )

    return f'''You are answering a question using ONLY the document excerpts provided below. If the excerpts don't contain enough information to answer, say so explicitly — do not use outside knowledge or make anything up.

Context:
"""
{context}
"""

Question: {question}

Answer concisely and reference sources inline as [Source N] where relevant.'''
