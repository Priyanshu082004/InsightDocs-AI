import { forwardRef } from "react";

/**
 * Reusable checkbox. `children` is the label content so callers can embed
 * links inside it (e.g. "I agree to the Terms of Service and Privacy
 * Policy").
 */
const Checkbox = forwardRef(function Checkbox(
  { id, error, className = "", children, ...props },
  ref
) {
  return (
    <div className={className}>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-2.5">
        <input
          ref={ref}
          id={id}
          type="checkbox"
          aria-invalid={Boolean(error) || undefined}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-brand-600 focus:ring-2 focus:ring-brand-500/30 focus:ring-offset-0"
          {...props}
        />
        <span className="text-sm leading-relaxed text-gray-600">
          {children}
        </span>
      </label>
    </div>
  );
});

export default Checkbox;
