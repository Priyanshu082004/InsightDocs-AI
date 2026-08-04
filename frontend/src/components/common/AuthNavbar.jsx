import { Link } from "react-router-dom";
import AppLogo from "./AppLogo";
import SecondaryButton from "./SecondaryButton";

/**
 * Simple top bar for auth pages. 
 */
function AuthNavbar({
  prompt = "Already have an account?",
  ctaLabel = "Log in",
  ctaTo = "/login",
  ctaTone = "neutral",
}) {
  return (
    <header className="w-full px-6 py-5 lg:px-10">
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-7xl items-center justify-between"
      >
        <Link to="/" aria-label="InsightDocs AI home">
          <AppLogo />
        </Link>

        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-gray-600 sm:inline">
            {prompt}
          </span>
          <SecondaryButton as={Link} to={ctaTo} size="sm" tone={ctaTone}>
            {ctaLabel}
          </SecondaryButton>
        </div>
      </nav>
    </header>
  );
}

export default AuthNavbar;
