// Whitelist, not a blacklist — anything not explicitly listed is
// rejected. This is deliberately conservative: it's easy to add a MIME
// type later when a real use case needs it, much harder to walk back
// an accidentally-permissive filter after it's been in production.
// The whitelist and size cap live below, derived from MIME_CATEGORY.





// Organized by category rather than a flat list 
export const MIME_CATEGORY = Object.freeze({
  DOCUMENTS: Object.freeze([
    "application/pdf",
    "application/msword", // .doc
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    "text/plain",
  ]),
  SPREADSHEETS: Object.freeze([
    "text/csv",
    "application/vnd.ms-excel", // .xls
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
  ]),
  IMAGES: Object.freeze([
    "image/png",
    "image/jpeg", // covers both .jpg and .jpeg
    "image/webp",
  ]),
});

// Flat view derived from the categories above — this is what
// fileValidator.js checks against. Never maintained as a separate list;
// always derived, so the category groupings above stay the single
// source of truth.
export const ALLOWED_MIME_TYPES = Object.freeze(Object.values(MIME_CATEGORY).flat());

export const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB


//   Given a MIME type, returns which category it belongs to
//  ("DOCUMENTS" | "SPREADSHEETS" | "IMAGES"), or null if not whitelisted.

export const getMimeCategory = (mimeType) => {
  for (const [category, mimeTypes] of Object.entries(MIME_CATEGORY)) {
    if (mimeTypes.includes(mimeType)) return category;
  }
  return null;
};