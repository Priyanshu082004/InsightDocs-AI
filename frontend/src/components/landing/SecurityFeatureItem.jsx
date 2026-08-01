import { forwardRef } from "react";

const ICON_BG_CLASSES = {
  green: "bg-brand-50 text-brand-600",
  orange: "bg-orange-50 text-orange-500",
  blue: "bg-blue-50 text-blue-500",
  purple: "bg-violet-50 text-violet-500",
};

/**
 * Icon + title + description row used by the Security & Privacy hub
 * diagram. `align="right"` mirrors the row (icon on the outer/right edge,
 * text right-aligned) for the right-hand column.
 *
 * `ref` is forwarded onto the TEXT block, not the icon — the connector
 * line to the center hub should start at the edge of the text nearest the
 * hub, not at the icon (which sits on the far, outer edge and would force
 * the line to cross straight over the text to reach the hub).
 */
const SecurityFeatureItem = forwardRef(function SecurityFeatureItem(
  { title, description, icon: Icon, color = "green", align = "left" },
  textRef
) {
  const isRight = align === "right";

  return (
    <div
      className={`flex items-start gap-4 ${
        isRight ? "flex-row-reverse text-right" : "text-left"
      }`}
    >
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${ICON_BG_CLASSES[color]}`}
      >
        <Icon className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
      </span>
      <div ref={textRef}>
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-gray-500">
          {description}
        </p>
      </div>
    </div>
  );
});

export default SecurityFeatureItem;