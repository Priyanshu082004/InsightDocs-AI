const PADDING_CLASSES = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-10",
};

/**
 * Reusable white rounded card with a soft shadow. Used for the Signup
 * card and any future auth/dashboard surfaces that want the same look.
 */
function Card({ padding = "md", className = "", children, ...props }) {
  return (
    <div
      className={`rounded-2xl border border-gray-100 bg-white shadow-xl shadow-gray-900/5 ${PADDING_CLASSES[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
