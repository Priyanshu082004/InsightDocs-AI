import StepCard from "./StepCard";
import { HOW_IT_WORKS_STEPS } from "./howItWorksData";

function HowItWorks() {
  return (
    <section id="how-it-works" className="px-6 pb-20 pt-4">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-600">
            How It Works
          </span>
          <h2 className="mt-4 font-display text-3xl font-semibold text-gray-900 sm:text-4xl">
            From document to insight
            <br />
            in just <span className="text-brand-600">a few steps</span>
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:flex lg:items-stretch lg:gap-6">
          {HOW_IT_WORKS_STEPS.map((step, index) => (
            <div
              key={step.number}
              id={
                index === HOW_IT_WORKS_STEPS.length - 1
                  ? "how-it-works-anchor"
                  : undefined
              }
              className="relative lg:flex-1"
            >
              <StepCard {...step} />

              {index < HOW_IT_WORKS_STEPS.length - 1 && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-6 top-11 hidden w-6 -translate-y-1/2 lg:block"
                >
                  {/* Dashed connector spans the full gap between cards,
                      aligned with the vertical center of the icon circle. */}
                  <span className="block h-0 w-full border-t-2 border-dashed border-gray-300" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;