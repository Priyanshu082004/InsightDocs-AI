export const buildRagPrompt = (question, chunks) => {
  const context = chunks
    .map((chunk, i) => `[Source ${i + 1}]\n${chunk.text}`)
    .join("\n\n");

  return `You are answering a question using ONLY the document excerpts provided below. If the excerpts don't contain enough information to answer, say so explicitly — do not use outside knowledge or make anything up.

Context:
"""
${context}
"""

Question: ${question}

Answer concisely and reference sources inline as [Source N] where relevant.`;
};