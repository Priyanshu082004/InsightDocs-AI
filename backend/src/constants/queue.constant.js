export const QUEUE_NAMES = Object.freeze({
  DOCUMENT_PROCESSING: "document-processing",
  AUDIT_CLEANUP: "audit-cleanup",
});

export const JOB_NAMES = Object.freeze({
  PROCESS_DOCUMENT: "process-document",
  RUN_AUDIT_CLEANUP: "run-audit-cleanup",
});

// Exponential backoff: 3 attempts total, first retry after 5s, then
// ~10s, ~20s. Enough to ride out a transient dependency hiccup
// without hammering a genuinely broken dependency.
export const JOB_OPTIONS = Object.freeze({
  attempts: 3,
  backoff: { type: "exponential", delay: 5000 },
  removeOnComplete: { age: 3600, count: 1000 },
  removeOnFail: { age: 86400 },
});