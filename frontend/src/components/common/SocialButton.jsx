import { forwardRef } from "react";
import { FaGithub } from "react-icons/fa6";

// Simple, recognizable multi-color "G" mark. Not a pixel-exact
// reproduction of the Google logo — just a standard, minimal
// representation commonly used for "Continue with Google" buttons.
function GoogleIcon(props) {
  return (
    <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true" {...props}>
      <path
        fill="#4285F4"
        d="M19.6 10.23c0-.68-.06-1.34-.17-1.98H10v3.75h5.38a4.6 4.6 0 0 1-2 3.02v2.5h3.23c1.9-1.75 2.99-4.33 2.99-7.29z"
      />
      <path
        fill="#34A853"
        d="M10 20c2.7 0 4.96-.89 6.61-2.42l-3.23-2.5c-.9.6-2.04.96-3.38.96-2.6 0-4.8-1.75-5.59-4.11H1.07v2.59A10 10 0 0 0 10 20z"
      />
      <path
        fill="#FBBC05"
        d="M4.41 11.93A6 6 0 0 1 4.09 10c0-.67.12-1.32.32-1.93V5.48H1.07A10 10 0 0 0 0 10c0 1.61.39 3.14 1.07 4.52l3.34-2.59z"
      />
      <path
        fill="#EA4335"
        d="M10 3.96c1.47 0 2.79.5 3.82 1.5l2.87-2.87C14.95.9 12.7 0 10 0 6.09 0 2.7 2.24 1.07 5.48l3.34 2.6C5.2 5.71 7.4 3.96 10 3.96z"
      />
    </svg>
  );
}

const PROVIDER_ICONS = {
  google: GoogleIcon,
  github: FaGithub,
};


const SocialButton = forwardRef(function SocialButton(
  { provider, children, className = "", ...props },
  ref
) {
  const Icon = PROVIDER_ICONS[provider];

  return (
    <button
      ref={ref}
      type="button"
      className={`inline-flex w-full items-center justify-center gap-3 rounded-lg border border-gray-200 bg-white py-2.5 text-sm font-medium text-gray-700 transition-colors duration-200 hover:border-gray-300 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400 ${className}`}
      {...props}
    >
      {Icon && (
       <Icon
        className="h-[18px] w-[18px] shrink-0"
        aria-hidden="true"
         />
         )}
    </button>
  );
});

export default SocialButton;
