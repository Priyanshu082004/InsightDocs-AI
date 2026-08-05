import { motion } from "framer-motion";
import AuthNavbar from "../../components/common/AuthNavbar";
import Card from "../../components/common/Card";
import ForgotPasswordForm from "../../components/forgotPassword/ForgotPasswordForm";

function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <AuthNavbar
        prompt="Remember your password?"
        ctaLabel="Log In"
        ctaTo="/login"
        ctaTone="brand"
      />

      <main className="flex flex-1 items-center justify-center px-6 py-10 lg:py-16">
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="w-full max-w-xl"
        >
          <Card padding="lg">
            <ForgotPasswordForm />
          </Card>
        </motion.div>
      </main>
    </div>
  );
}

export default ForgotPasswordPage;