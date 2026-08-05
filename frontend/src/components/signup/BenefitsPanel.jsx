import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { TrendingUp, ShieldCheck } from "lucide-react";
import { SIGNUP_BENEFITS } from "./benefitsData";

const ICON_BG_CLASSES = {
  green: "bg-brand-50 text-brand-600",
  orange: "bg-orange-50 text-orange-500",
  blue: "bg-blue-50 text-blue-500",
  purple: "bg-violet-50 text-violet-500",
};

function BenefitsPanel() {
  const listRef = useRef(null);

  useEffect(() => {
    if (!listRef.current) return undefined;

    // Small, subtle reveal only — no floating/glow/parallax per spec.
    const items = listRef.current.querySelectorAll("[data-benefit-item]");
    const ctx = gsap.context(() => {
      gsap.from(items, {
        opacity: 0,
        y: 8,
        duration: 0.4,
        stagger: 0.08,
        ease: "power2.out",
        delay: 0.2,
      });
    }, listRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="flex h-full flex-col bg-gray-50/60 p-8 lg:p-10">
      <h3 className="font-display text-2xl font-semibold text-gray-900">
        Why choose
        <br />
        <span className="text-brand-600">InsightDocs AI?</span>
      </h3>

      <ul ref={listRef} className="mt-8 space-y-6">
        {SIGNUP_BENEFITS.map(({ title, description, icon: Icon, color }) => (
          <li key={title} data-benefit-item className="flex items-start gap-3">
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${ICON_BG_CLASSES[color]}`}
            >
              <Icon className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold text-gray-900">{title}</p>
              <p className="mt-0.5 text-sm leading-relaxed text-gray-500">
                {description}
              </p>
            </div>
          </li>
        ))}
      </ul>

      {/* Small built-from-Tailwind illustration (no external images) */}
      <div className="relative mt-10 hidden flex-1 items-end sm:flex">
        <div className="w-40 rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
          <div className="flex items-center gap-1.5 text-brand-600">
            <TrendingUp className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            <div className="h-1.5 flex-1 rounded-full bg-brand-100" />
          </div>
          <div className="mt-3 space-y-1.5">
            <div className="h-1.5 w-full rounded-full bg-gray-100" />
            <div className="h-1.5 w-4/5 rounded-full bg-gray-100" />
            <div className="h-1.5 w-3/5 rounded-full bg-gray-100" />
          </div>
        </div>
        <span className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 shadow-sm">
          <ShieldCheck className="h-5 w-5 text-brand-600" strokeWidth={2} aria-hidden="true" />
        </span>
      </div>
    </div>
  );
}

export default BenefitsPanel;
