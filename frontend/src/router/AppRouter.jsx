import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const LandingPage = lazy(() => import("../pages/LandingPage"));
const LoginPage = lazy(() => import("../pages/LoginPage"));
const SignupPage = lazy(() => import("../pages/SignupPage"));

function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream-50">
      <span className="loading loading-spinner loading-md text-brand-600" />
    </div>
  );
}

function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />

          {/* Placeholder routes only. Full authentication UI, forms, and
              logic will be implemented later. */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default AppRouter;
