import { APP_BACKGROUND_ICONS } from "./appBackgroundIconsData";

/**
 * The global background for the entire application. Rendered once at the
 * app root (see App.jsx) behind the router, so every page — Landing,
 * Signup, Login, and future Dashboard/Profile/Settings/Documents/Chat
 * pages — shares exactly the same warm, static backdrop.
 *
 * Deliberately `position: fixed`: it sizes itself to the viewport, not to
 * any particular page's content height, so it never needs per-page
 * measurement and can't bleed or clip regardless of how tall a page is.
 *
 * Static only 
 */
function AppBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-cream-50"
    >
      {/* Subtle pastel gradient blobs */}
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-brand-100/40 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-orange-100/40 blur-3xl" />
      <div className="absolute left-1/2 top-1/3 h-80 w-80 -translate-x-1/2 rounded-full bg-violet-100/30 blur-3xl" />

      {/* Static faded document + AI icon texture */}
      {APP_BACKGROUND_ICONS.map(({ icon: Icon, position }, index) => (
        <Icon
          key={index}
          className={`absolute h-6 w-6 -translate-x-1/2 -translate-y-1/2 text-gray-300/50 ${position}`}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

export default AppBackground;
