import { forwardRef } from "react";

/**
 * Shared text input. Works as an uncontrolled input compatible with
 * React Hook Form's `register()` (ref is forwarded straight through).
 */
const TextInput = forwardRef(function TextInput(
  { icon: Icon, error, className = "", ...props },
  ref
) {
  return (
    <div className={className}>
      <div className="relative">
        {Icon && (
          <Icon
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            strokeWidth={2}
            aria-hidden="true"
          />
        )}
        <input
          ref={ref}
          aria-invalid={Boolean(error) || undefined}
          className={`w-full rounded-lg border bg-white py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400 ${
            Icon ? "pl-9 pr-3" : "px-3"
          } ${error ? "border-red-300 focus:border-red-400" : "border-gray-200 focus:border-brand-500"}`}
          {...props}
        />
      </div>
    </div>
  );
});

export default TextInput;
