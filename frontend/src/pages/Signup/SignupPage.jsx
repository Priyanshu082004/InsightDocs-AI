import { motion } from "framer-motion";
import AuthNavbar from "../../components/common/AuthNavbar";
import Card from "../../components/common/Card";
import SignupForm from "../../components/signup/SignupForm";
import BenefitsPanel from "../../components/signup/BenefitsPanel";

function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <AuthNavbar />

      <main className="flex flex-1 items-center justify-center px-6 py-10 lg:py-16">
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="w-full max-w-4xl"
        >
          <Card padding="none" className="overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 lg:p-10">
                <SignupForm />
              </div>
              <BenefitsPanel />
            </div>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}

export default SignupPage;
