import { useRef } from "react";
import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import HowItWorks from "../components/landing/HowItWorks";
import SecurityPrivacy from "../components/landing/SecurityPrivacy";
import SectionConnectorArrow from "../components/landing/SectionConnectorArrow";
import FAQ from "../components/landing/FAQ";
import Footer from "../components/landing/Footer";




// Navbar, Hero, How It Works, and Security & Privacy are implemented so
// far. FAQ and Footer sections will be added in subsequent, separately
// approved steps.
function LandingPage() {
  const mainRef = useRef(null);

  return (
    <div className="min-h-screen">
      {/* Shared relative wrapper so the watermark texture spans behind
          both the Navbar and Hero as one continuous background. */}
      <div className="relative">
        <Navbar />
        <main ref={mainRef} className="relative">
          <Hero />
          <HowItWorks />
          <SecurityPrivacy />
          <FAQ />

          {/* Decorative connector from the last How It Works step up into
              the Security & Privacy eyebrow, matching the reference. */}
          <SectionConnectorArrow
            containerRef={mainRef}
            fromId="how-it-works-anchor"
            toId="security-eyebrow"
          />
           {/* Decorative connector from the bottom of the Security column
              down into the FAQ eyebrow, matching the reference. */}
          <SectionConnectorArrow
            containerRef={mainRef}
            fromId="security-faq-anchor"
            toId="faq-eyebrow"
          />



        </main>
        <Footer />
      </div>
    </div>
  );
}

export default LandingPage;