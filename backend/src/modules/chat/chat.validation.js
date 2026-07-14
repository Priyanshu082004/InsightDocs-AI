import { z } from "zod";

export const createSessionSchema = z.object({
  documentId: z.string().trim().min(1).optional(),
  title: z.string().trim().max(200).optional(),
});

export const askQuestionSchema = z.object({
  question: z.string().trim().min(1, "Question cannot be empty").max(2000),
});