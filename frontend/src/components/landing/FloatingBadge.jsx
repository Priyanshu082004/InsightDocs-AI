const ICON_BG_CLASSES = {
  green: "bg-brand-50 text-brand-600",
  orange: "bg-orange-50 text-orange-500",
  blue: "bg-blue-50 text-blue-500",
  purple: "bg-violet-50 text-violet-500",
};

/**
 * A single pill positioned absolutely within the Hero's decorative
 * background layer. It sits faded into the background by default and
 * comes fully forward — full opacity, slight lift, raised above its
 * neighbors — on hover. Position is expressed as percentages of the
 * container so the scattered layout scales instead of clipping.
 */
function FloatingBadge({ icon: Icon, label, color = "green", position }) {
  return (
    <div className={`hero-float absolute ${position}`}>
      <div
        className="pointer-events-auto hidden -translate-x-1/2 -translate-y-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-gray-200 bg-white/90 px-3 py-1.5 text-xs font-medium text-gray-600 opacity-50 shadow-sm transition-all duration-300 ease-out hover:z-30 hover:scale-110 hover:opacity-100 hover:shadow-md lg:flex"
      >
        <span
          className={`flex h-5 w-5 items-center justify-center rounded-md ${ICON_BG_CLASSES[color]}`}
        >
          <Icon className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
        </span>

        {label}
      </div>
    </div>
  );
}

export default FloatingBadge;