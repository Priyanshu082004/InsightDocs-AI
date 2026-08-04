import { FileStack } from "lucide-react";

const SIZE_CLASSES = {
  sm: { badge: "h-6 w-6", icon: "h-4 w-4", text: "text-base" },
  md: { badge: "h-8 w-8", icon: "h-5 w-5", text: "text-lg" },
  lg: { badge: "h-10 w-10", icon: "h-6 w-6", text: "text-xl" },
};

// TODO: Replace with final InsightDocs AI logo mark once brand assets are
// finalized. This is a placeholder so every page can share one component.
function AppLogo({ size = "md", showText = true, className = "" }) {
  const sizing = SIZE_CLASSES[size] ?? SIZE_CLASSES.md;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span
        className={`flex shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 ${sizing.badge}`}
      >
        <FileStack className={sizing.icon} strokeWidth={2} aria-hidden="true" />
      </span>
      {showText && (
        <span
          className={`font-sans font-bold tracking-tight text-gray-900 ${sizing.text}`}
        >
          InsightDocs <span className="text-brand-600">AI</span>
        </span>
      )}
    </div>
  );
}

export default AppLogo;
