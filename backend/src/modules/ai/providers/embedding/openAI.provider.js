import OpenAI from "openai";
import { env } from "../../../../config/env.config.js";
import { logger } from "../../../../config/logger.config.js";
import { ApiError } from "../../../../utils/ApiError.js";
import { HTTP_STATUS } from "../../../../constants/httpStatus.constant.js";


const client = new OpenAI({ apiKey: env.OPENAI_API_KEY });


//  `dimensions` is passed explicitly on every call rather than left as
//  a model default — text-embedding-3-small supports a variable output
//  size via this parameter, and OPENAI_EMBEDDING_DIMENSIONS is the
//  single source of truth for it. retrieval.service's Atlas Vector
//  Search index must be configured with the SAME number — the two are
//  not automatically kept in sync by anything in code, so a change to
//  this env var requires rebuilding the Atlas index to match.
 
export const embedText = async (text) => {
  try {
    const response = await client.embeddings.create({
      model: env.OPENAI_EMBEDDING_MODEL,
      input: text,
      dimensions: env.OPENAI_EMBEDDING_DIMENSIONS,
    });
    return response.data[0].embedding;
  } catch (err) {
    logger.error({ err: err.message }, "OpenAI embedding call failed");
    throw new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, "AI embedding failed");
  }
};

export const openaiEmbeddingProvider = { embedText };