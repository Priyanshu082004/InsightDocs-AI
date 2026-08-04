import { forwardRef } from "react";

const SIZE_CLASSES = {
  sm: "px-4 py-1.5 text-sm",
  md: "px-5 py-2 text-sm",
  lg: "px-7 py-3 text-base",
};

const TONE_CLASSES = {
  neutral: "text-gray-700 hover:border-gray-300 hover:bg-gray-50",
  brand: "text-brand-600 hover:border-brand-300 hover:bg-brand-50",
};

/**
 * Secondary button (white with a border). Shared across the whole app —
 * the Navbar's "Log in", Login's "Sign Up", and any other secondary
 * action.
 */
const SecondaryButton = forwardRef(function SecondaryButton(
  {
    as: Component = "button",
    size = "md",
    tone = "neutral",
    icon: Icon,
    fullWidth = false,
    disabled = false,
    className = "",
    children,
    ...props
  },
  ref
) {
  return (
    <Component
      ref={ref}
      disabled={Component === "button" ? disabled : undefined}
      className={`inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-white font-semibold transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400 disabled:cursor-not-allowed disabled:opacity-60 ${
        fullWidth ? "w-full" : ""
      } ${SIZE_CLASSES[size]} ${TONE_CLASSES[tone]} ${className}`}
      {...props}
    >
      {Icon && <Icon className="h-4 w-4" strokeWidth={2} aria-hidden="true" />}
      {children}
    </Component>
  );
});

export default SecondaryButton;
