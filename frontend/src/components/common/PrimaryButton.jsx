import { forwardRef } from "react";
import { Loader2 } from "lucide-react";

const SIZE_CLASSES = {
  sm: "px-4 py-1.5 text-sm",
  md: "px-5 py-2 text-sm",
  lg: "px-7 py-3.5 text-base",
};

/**
 * Primary CTA button (solid brand green). Shared across the whole app —
 * Landing's "Get Started", Signup's "Create Account", and any future
 * primary action.
 */
const PrimaryButton = forwardRef(function PrimaryButton(
  {
    as: Component = "button",
    size = "md",
    icon: Icon,
    loading = false,
    disabled = false,
    fullWidth = false,
    className = "",
    children,
    ...props
  },
  ref
) {
  return (
    <Component
      ref={ref}
      disabled={Component === "button" ? disabled || loading : undefined}
      aria-busy={loading || undefined}
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 font-semibold text-white shadow-sm shadow-brand-600/20 transition-colors duration-200 hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 disabled:cursor-not-allowed disabled:opacity-60 ${
        fullWidth ? "w-full" : ""
      } ${SIZE_CLASSES[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        Icon && <Icon className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
      )}
      {children}
    </Component>
  );
});

export default PrimaryButton;
