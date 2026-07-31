import { forwardRef } from "react";

const VARIANT_CLASSES = {
  primary:
    "bg-brand-600 text-white shadow-sm shadow-brand-600/20 hover:bg-brand-700 focus-visible:outline-brand-700",
  ghost:
    "bg-transparent text-gray-700 hover:text-gray-900 focus-visible:outline-gray-400",
};

const SIZE_CLASSES = {
  sm: "px-4 py-1.5 text-sm",
  md: "px-5 py-2 text-sm",
  lg: "px-7 py-3.5 text-base",
};

/**
 * Shared button used across the landing page (navbar + hero CTAs).
 * Keeping variants centralized avoids duplicating focus/hover styles.
 */
const Button = forwardRef(function Button(
  { as: Component = "button", variant = "primary", size = "md", className = "", children, ...props },
  ref
) {
  return (
    <Component
      ref={ref}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
});

export default Button;
