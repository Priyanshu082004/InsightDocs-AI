import { forwardRef, useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";

/**
 * Password input with a visibility toggle. Built on the same visual
 * language as TextInput (icon + error state), ref-forwarded for React
 * Hook Form.
 */
const PasswordInput = forwardRef(function PasswordInput(
  { error, className = "", ...props },
  ref
) {
  const [visible, setVisible] = useState(false);

  return (
    <div className={className}>
      <div className="relative">
        <Lock
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
          strokeWidth={2}
          aria-hidden="true"
        />
        <input
          ref={ref}
          type={visible ? "text" : "password"}
          aria-invalid={Boolean(error) || undefined}
          className={`w-full rounded-lg border bg-white py-2.5 pl-9 pr-10 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400 ${
            error ? "border-red-300 focus:border-red-400" : "border-gray-200 focus:border-brand-500"
          }`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((prev) => !prev)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
        >
          {visible ? (
            <EyeOff className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          ) : (
            <Eye className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  );
});

export default PasswordInput;
