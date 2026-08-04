/**
 * Reusable divider with centered label (defaults to "or"). Used to
 * separate social auth buttons from the email/password form.
 */
function Divider({ label = "or", className = "" }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="h-px flex-1 bg-gray-200" aria-hidden="true" />
      {label && (
        <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
          {label}
        </span>
      )}
      <span className="h-px flex-1 bg-gray-200" aria-hidden="true" />
    </div>
  );
}

export default Divider;
