// Whitelist, not a blacklist — anything not explicitly listed is
// rejected. This is deliberately conservative: it's easy to add a MIME
// type later when a real use case needs it, much harder to walk back
// an accidentally-permissive filter after it's been in production.
export const ALLOWED_MIME_TYPES = Object.freeze([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "text/plain",
  "image/png",
  "image/jpeg",
  "image/webp",
]);

export const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB