import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { Link } from "react-router-dom";
import Logo from "../common/Logo";

const SOCIAL_LINKS = [
  {
    label: "GitHub",
    href: "https://github.com",
    icon: FaGithub,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: FaLinkedin,
  },
];

function Footer() {
  return (
    <footer className="border-t border-gray-200 px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 text-center md:flex-row md:items-center md:justify-between md:text-left">
        <div className="flex flex-col items-center gap-3 md:flex-row md:items-center md:gap-6">
          <Link to="/" aria-label="InsightDocs AI home">
            <Logo />
          </Link>
          <span className="hidden h-8 w-px bg-gray-200 md:block" aria-hidden="true" />
          <p className="text-sm leading-relaxed text-gray-500">
            Intelligent document workspace
            <br />
            powered by AI.
          </p>
        </div>

        <p className="text-sm leading-relaxed text-gray-500">
          © 2026 InsightDocs AI.
          <br />
          All rights reserved.
        </p>

        <div className="flex items-center gap-4">
          {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="text-gray-500 transition-colors hover:text-gray-900"
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;