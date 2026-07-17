import OpenAI from "openai";
import { env } from "../../../../config/env.config.js";
import { logger } from "../../../../config/logger.config.js";
import { ApiError } from "../../../../utils/ApiError.js";
import { HTTP_STATUS } from "../../../../constants/httpStatus.constant.js";

//  OpenRouter exposes an OpenAI-compatible chat completions API, so the official `openai` SDK
//  is reused here rather than a bespoke HTTP client — just pointed at
//  OpenRouter's base URL with an OpenRouter key instead of an OpenAI one.

const client = new OpenAI({
  apiKey: env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export const generateText = async (prompt) => {
  try {
    const completion = await client.chat.completions.create({
      model: env.OPENROUTER_MODEL,
      messages: [{ role: "user", content: prompt }],
    });
    return completion.choices[0].message.content;
  } catch (err) {
    logger.error({ err: err.message }, "OpenRouter generateText failed");
    throw new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, "AI generation failed");
  }
};


export const generateJSON = async (prompt) => {
  const raw = await generateText(
    `${prompt}\n\nRespond with ONLY valid JSON. No markdown code fences, no commentary, no explanation.`
  );

  const cleaned = raw.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    logger.error({ err: err.message, raw }, "Failed to parse OpenRouter JSON response");
    throw new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, "AI returned a malformed response");
  }
};


//  Used only by the OCR path (via llm.service.extractTextFromImage).
//   Image bytes go in as a base64 data URI in the message content — the
//   OpenAI-compatible vision format OpenRouter expects. This REQUIRES
//  OPENROUTER_MODEL to be a vision-capable model (the default,
//   openai/gpt-4o-mini, is); if a non-vision model is configured, OCR
//   calls fail loudly at the provider rather than silently returning
//   empty text.
 
export const generateVisionText = async (prompt, { buffer, mimeType }) => {
  try {
    const completion = await client.chat.completions.create({
      model: env.OPENROUTER_MODEL,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: { url: `data:${mimeType};base64,${buffer.toString("base64")}` },
            },
          ],
        },
      ],
    });
    return completion.choices[0].message.content;
  } catch (err) {
    logger.error({ err: err.message }, "OpenRouter vision call failed");
    throw new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, "AI OCR failed");
  }
};

export const generateTextStream = async (prompt, onToken) => {
  try {
    const stream = await client.chat.completions.create({
      model: env.OPENROUTER_MODEL,
      messages: [{ role: "user", content: prompt }],
      stream: true,
    });

    let fullText = "";
    for await (const part of stream) {
      const token = part.choices[0]?.delta?.content || "";
      if (token) {
        fullText += token;
        onToken?.(token);
      }
    }

    return fullText;
  } catch (err) {
    logger.error({ err: err.message }, "OpenRouter streaming generation failed");
    throw new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, "AI generation failed");
  }
};

export const openrouterProvider = {
  generateText,
  generateJSON,
  generateVisionText,
  generateTextStream,
};