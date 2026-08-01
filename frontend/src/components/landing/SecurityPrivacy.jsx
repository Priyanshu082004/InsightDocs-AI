import { useMemo, useRef } from "react";
import { Plus, ShieldCheck } from "lucide-react";
import SecurityFeatureItem from "./SecurityFeatureItem";
import useConnectorPaths from "../../hooks/useConnectorPaths";
import { SECURITY_LEFT_ITEMS, SECURITY_RIGHT_ITEMS } from "./securityData";

function SecurityPrivacy() {
  const diagramRef = useRef(null);
  const hubRef = useRef(null);
  const leftTextRefs = useRef([]);
  const rightTextRefs = useRef([]);

  // Stable pair list: each item's real, measured text-block edge (the
  // side nearest the hub) connects to the real, measured hub position.
  // Refs are mutable containers, so the pairs array itself can stay
  // referentially stable across renders.
  const pairs = useMemo(
    () => [
      ...SECURITY_LEFT_ITEMS.map((_, index) => ({
        from: { get current() { return leftTextRefs.current[index]; } },
        to: hubRef,
        fromAnchor: "right",
      })),
      ...SECURITY_RIGHT_ITEMS.map((_, index) => ({
        from: { get current() { return rightTextRefs.current[index]; } },
        to: hubRef,
        fromAnchor: "left",
      })),
    ],
    []
  );

  const paths = useConnectorPaths(diagramRef, pairs);

  return (
    <section id="security" className="px-6 pb-24 pt-16">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <span
            id="security-eyebrow"
            className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-600"
          >
            <Plus className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
            Always Protected
          </span>
          <h2 className="mt-4 font-display text-3xl font-semibold text-gray-900 sm:text-4xl">
            Security &amp; Privacy
            <br />
            built into <span className="text-brand-600">every step</span>
          </h2>
          <p className="mt-4 text-base text-gray-500">
            Your documents and data are protected with enterprise-grade
            security, so you can work with complete peace of mind.
          </p>
        </div>

        <div ref={diagramRef} className="relative mx-auto mt-16 max-w-6xl">
          {/* Dashed hub-and-spoke connectors. Each line starts at the edge
              of a text block nearest the hub (not at the icon, which sits
              on the far outer edge) so it never crosses over the text —
              see useConnectorPaths and SecurityFeatureItem. */}
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 hidden h-full w-full overflow-visible lg:block"
          >
            {paths.map((d, index) => (
              <path
                key={index}
                d={d}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                strokeLinecap="round"
                className="text-gray-300"
              />
            ))}
          </svg>

          <div className="grid gap-y-16 lg:grid-cols-[1fr_auto_1fr] lg:gap-x-16">
            <div className="flex flex-col gap-12 lg:h-full lg:justify-between">
              {SECURITY_LEFT_ITEMS.map((item, index) => (
                <SecurityFeatureItem
                  key={item.title}
                  {...item}
                  ref={(el) => {
                    leftTextRefs.current[index] = el;
                  }}
                />
              ))}
              {/* Anchor for the decorative connector down to the FAQ
                  section (see SectionConnectorArrow in LandingPage). */}
              <span id="security-faq-anchor" aria-hidden="true" />
            </div>

            <div className="relative z-10 hidden items-center justify-center lg:flex">
              <div
                ref={hubRef}
                className="flex h-44 w-44 items-center justify-center rounded-full bg-brand-50"
              >
                <span className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-brand-100">
                  <ShieldCheck
                    className="h-12 w-12 text-brand-600"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-12 lg:h-full lg:justify-between">
              {SECURITY_RIGHT_ITEMS.map((item, index) => (
                <SecurityFeatureItem
                  key={item.title}
                  {...item}
                  align="right"
                  ref={(el) => {
                    rightTextRefs.current[index] = el;
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SecurityPrivacy;