import { useCallback, useEffect, useState } from "react";

function getPoint(rect, containerRect, anchor) {
  switch (anchor) {
    case "top":
      return { x: rect.left + rect.width / 2 - containerRect.left, y: rect.top - containerRect.top };
    case "bottom":
      return { x: rect.left + rect.width / 2 - containerRect.left, y: rect.bottom - containerRect.top };
    case "left":
      return { x: rect.left - containerRect.left, y: rect.top + rect.height / 2 - containerRect.top };
    case "right":
      return { x: rect.right - containerRect.left, y: rect.top + rect.height / 2 - containerRect.top };
    case "center":
    default:
      return {
        x: rect.left + rect.width / 2 - containerRect.left,
        y: rect.top + rect.height / 2 - containerRect.top,
      };
  }
}

function buildPath(start, end, curve) {
  if (curve === "vertical") {
    const midY = (start.y + end.y) / 2;
    return `M ${start.x} ${start.y} C ${start.x} ${midY}, ${end.x} ${midY}, ${end.x} ${end.y}`;
  }
  const midX = (start.x + end.x) / 2;
  return `M ${start.x} ${start.y} C ${midX} ${start.y}, ${midX} ${end.y}, ${end.x} ${end.y}`;
}

/**
 * Measures real, rendered DOM elements (via refs or element-returning
 * functions, e.g. `() => document.getElementById(...)`) relative to a
 * shared container and returns SVG path "d" strings connecting them.
 * Recomputes on mount, on window resize, and once more after "load"
 * (web fonts can reflow text after first paint, shifting positions).
 *
 * Returns an empty array below `minWidth`, since these connector diagrams
 * are desktop-only decorative flourishes that are hidden at smaller sizes.
 */
function useConnectorPaths(containerRef, pairs, { minWidth = 1024 } = {}) {
  const [paths, setPaths] = useState([]);

  const compute = useCallback(() => {
    const container = containerRef.current;
    if (!container || window.innerWidth < minWidth) {
      setPaths([]);
      return;
    }

    const containerRect = container.getBoundingClientRect();

    const next = pairs
      .map(({ from, to, fromAnchor = "center", toAnchor = "center", curve = "horizontal" }) => {
        const fromEl = typeof from === "function" ? from() : from?.current;
        const toEl = typeof to === "function" ? to() : to?.current;
        if (!fromEl || !toEl) return null;

        const start = getPoint(fromEl.getBoundingClientRect(), containerRect, fromAnchor);
        const end = getPoint(toEl.getBoundingClientRect(), containerRect, toAnchor);

        return buildPath(start, end, curve);
      })
      .filter(Boolean);

    setPaths(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef, pairs, minWidth]);

  useEffect(() => {
    compute();
    const raf = requestAnimationFrame(compute);
    window.addEventListener("resize", compute);
    window.addEventListener("load", compute);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", compute);
      window.removeEventListener("load", compute);
    };
  }, [compute]);

  return paths;
}

export default useConnectorPaths;