import { AlertCircle } from "lucide-react";

/**
 * Reusable validation error message shown under a form field.
 * Renders nothing when there's no message, so it can be used
 * unconditionally: `<FormError message={errors.email?.message} />`.
 */
function FormError({ message, className = "" }) {
  if (!message) return null;

  return (
    <p
      role="alert"
      className={`mt-1.5 flex items-center gap-1 text-xs text-red-600 ${className}`}
    >
      <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      {message}
    </p>
  );
}

export default FormError;
