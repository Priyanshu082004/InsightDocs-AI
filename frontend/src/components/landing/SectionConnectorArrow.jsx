import { useId, useRef } from "react";
import useConnectorPaths from "../../hooks/useConnectorPaths";

/**
 * Draws a single dashed, arrow-terminated connector between two elements
 * (looked up by id) inside `containerRef`. Positions are measured from the
 * real DOM, so the curve stays accurate regardless of content length or
 * viewport width. Renders nothing below the desktop breakpoint, where the
 * source sections' multi-column layouts collapse anyway.
 */
function SectionConnectorArrow({ containerRef, fromId, toId }) {
  const markerId = `section-connector-arrowhead-${useId()}`;

  const pairsRef = useRef([
    {
      from: () => document.getElementById(fromId),
      to: () => document.getElementById(toId),
      fromAnchor: "bottom",
      toAnchor: "top",
      curve: "vertical",
    },
  ]);

  const [path] = useConnectorPaths(containerRef, pairsRef.current);

  if (!path) return null;

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 hidden h-full w-full overflow-visible lg:block"
    >
      <defs>
        <marker
          id={markerId}
          markerWidth="8"
          markerHeight="8"
          refX="4"
          refY="4"
          orient="auto"
        >
          <path d="M0,0 L8,4 L0,8 Z" className="fill-brand-400" />
        </marker>
      </defs>
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="4 4"
        strokeLinecap="round"
        className="text-brand-400"
        markerEnd={`url(#${markerId})`}
      />
    </svg>
  );
}

export default SectionConnectorArrow;