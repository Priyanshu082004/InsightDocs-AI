import { PAGE_WATERMARKS } from "./pageWatermarksData";

/**
 * Purely decorative, non-interactive watermark layer. Rendered once behind
 * the Navbar + Hero so the faint icon texture reads as a single continuous
 * background rather than something clipped to the Hero section alone.
 */
function PageBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 hidden lg:block"
    >
      {PAGE_WATERMARKS.map(({ icon: Icon, position }, index) => (
        <Icon
          key={index}
          className={`absolute h-6 w-6 -translate-x-1/2 -translate-y-1/2 text-gray-400/60 ${position}`}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

export default PageBackground;