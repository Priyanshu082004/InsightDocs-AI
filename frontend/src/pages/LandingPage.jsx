import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import PageBackground from "../components/common/PageBackground";

// Only Navbar + Hero are implemented in this pass.
// How It Works, Security & Privacy, FAQ, and Footer sections
// will be added in subsequent, separately approved steps.
function LandingPage() {
  return (
    <div className="min-h-screen bg-cream-50">
      {/* Shared relative wrapper so the watermark texture spans behind
          both the Navbar and Hero as one continuous background. */}
      <div className="relative">
        <PageBackground />
        <Navbar />
        <main>
          <Hero />
        </main>
      </div>
    </div>
  );
}

export default LandingPage;