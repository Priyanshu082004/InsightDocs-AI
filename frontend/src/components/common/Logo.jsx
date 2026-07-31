import { FileStack } from "lucide-react";

/**
 * Logo placeholder for InsightDocs AI.
 * A real brand mark can be swapped in later without touching call sites.
 */
function Logo({ className = "" }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
        <FileStack className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
      </span>
      <span className="font-sans text-lg font-bold tracking-tight text-gray-900">
        InsightDocs <span className="text-brand-600">AI</span>
      </span>
    </div>
  );
}

export default Logo;
