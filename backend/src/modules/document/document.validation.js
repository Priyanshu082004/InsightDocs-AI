import { z } from "zod";
import { ACCESS_LEVELS } from "../../constants/auth.constant.js";

export const renameDocumentSchema = z.object({
  displayName: z.string().trim().min(1, "Name cannot be empty").max(255),
});

export const listDocumentsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().trim().max(200).optional(),
  // Comma-separated in the query string (?tags=finance,contracts) — Zod
  // transforms it straight into an array so the service layer never
  // deals with query-string formatting concerns.
  tags: z
    .string()
    .optional()
    .transform((val) => (val ? val.split(",").map((t) => t.trim()).filter(Boolean) : undefined)),
});

// A document owner can only share as EDITOR or VIEWER — OWNER is
// reserved for the single Permission row created at upload time, never
// grantable through the share endpoint.
export const shareDocumentSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email address"),
  accessLevel: z.enum([ACCESS_LEVELS.EDITOR, ACCESS_LEVELS.VIEWER], {
    errorMap: () => ({ message: "accessLevel must be EDITOR or VIEWER" }),
  }),
});