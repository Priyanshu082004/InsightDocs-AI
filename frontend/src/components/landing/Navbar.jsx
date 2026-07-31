import { Link } from "react-router-dom";
import Logo from "../common/Logo";
import Button from "../common/Button";
import useScrolled from "../../hooks/useScrolled";

const NAV_LINKS = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Security", href: "#security" },
  { label: "FAQ", href: "#faq" },
];

function Navbar() {
  const scrolled = useScrolled(8);

  const handleNavClick = (event, href) => {
    event.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-cream-50/80 shadow-sm backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10"
      >
        <Link to="/" aria-label="InsightDocs AI home">
          <Logo />
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(event) => handleNavClick(event, link.href)}
                className="text-sm font-medium text-gray-700 transition-colors hover:text-gray-900"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <Button as={Link} to="/login" variant="ghost" size="sm">
            Log in
          </Button>
          <Button as={Link} to="/signup" variant="primary" size="sm">
            Get Started
          </Button>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
