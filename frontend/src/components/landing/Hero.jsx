import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import PrimaryButton from "../common/PrimaryButton";
import FloatingBadge from "./FloatingBadge";
import { HERO_BADGES } from "./heroBadgesData";

function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pb-6 pt-1 lg:pt-1">
      
      <div className="relative mx-auto max-w-7xl lg:aspect-[849/615]">

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden lg:block"
        >
          {HERO_BADGES.map((badge) => (
            <FloatingBadge
              key={badge.label}
              icon={badge.icon}
              label={badge.label}
              color={badge.color}
              position={badge.position}
            />
          ))}
        </div>

        {/* Hero copy: centered in normal flow on mobile, centered inside
            the aspect-ratio canvas from `lg` up so it lines up with the
            badge layer above. */}
        <div className="static z-10 mx-auto flex max-w-2xl flex-col items-center px-4 text-center lg:absolute lg:inset-x-0 lg:top-1/2 lg:-translate-y-1/2">
          <h1 className="font-display text-4xl font-semibold leading-tight text-gray-900 sm:text-5xl">
            Understand Your
            <br />
            Documents.
            <br />
            <span className="text-brand-600">Instantly.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base text-gray-500 sm:text-lg">
            Upload your documents and let AI summarize, analyze, and answer
            questions — so you can focus on what matters.
          </p>

          <PrimaryButton
            as={Link}
            to="/signup"
            variant="primary"
            size="lg"
            className="mt-8"
          >
            Get Started Free
            <ArrowRight className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
          </PrimaryButton>
        </div>
      </div>
    </section>
  );
}

export default Hero;