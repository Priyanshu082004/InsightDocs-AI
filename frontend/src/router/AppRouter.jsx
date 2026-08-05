import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const LandingPage = lazy(() => import("../pages/LandingPage"));
const SignupPage = lazy(() => import("../pages/Signup/SignupPage"));
const LoginPage = lazy(() => import("../pages/Login/LoginPage"));
const ForgotPasswordPage = lazy(() => import("../pages/ForgotPassword/ForgotPasswordPage"));

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

         
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default AppRouter;
