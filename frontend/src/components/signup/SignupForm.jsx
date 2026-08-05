import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowRight, User, Mail } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import TextInput from "../common/TextInput";
import PasswordInput from "../common/PasswordInput";
import PrimaryButton from "../common/PrimaryButton";
import SocialButton from "../common/SocialButton";
import Divider from "../common/Divider";
import FormError from "../common/FormError";
import SectionTitle from "../common/SectionTitle";
import PasswordStrength from "./PasswordStrength";
import TermsCheckbox from "./TermsCheckbox";
import { signupSchema } from "./signupSchema";
import { registerStart, registerSuccess, registerFailure } from "../../store/authSlice";

function SignupForm() {
  const dispatch = useDispatch();
  const authStatus = useSelector((state) => state.auth.status);
  const [submitError, setSubmitError] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
  });

  const password = watch("password");

  const onSubmit = async (data) => {
    setSubmitError(null);
    dispatch(registerStart());

    // TODO: Connect register API. Replace this block with a real request,
    // e.g. `await api.post("/auth/register", data)`, then dispatch
    // registerSuccess(user) with the response.
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      dispatch(registerSuccess({ fullName: data.fullName, email: data.email }));
    } catch (err) {
      const message = "Something went wrong. Please try again.";
      dispatch(registerFailure(message));
      setSubmitError(message);
    }
  };

  const busy = isSubmitting || authStatus === "loading";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <SectionTitle
        title={
          <>
            Create your <span className="text-brand-600">account</span>
          </>
        }
        subtitle="Join InsightDocs AI and turn your documents into intelligence."
      />

      <div className="mt-6 space-y-3">
        {/* TODO: Wire up Google OAuth */}
        <SocialButton provider="google" onClick={() => {}}>
          Continue with Google
        </SocialButton>
        {/* TODO: Wire up GitHub OAuth */}
        <SocialButton provider="github" onClick={() => {}}>
          Continue with GitHub
        </SocialButton>
      </div>

      <Divider className="my-6" />

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <TextInput
              icon={User}
              placeholder="Full Name"
              autoComplete="name"
              error={errors.fullName}
              {...register("fullName")}
            />
            <FormError message={errors.fullName?.message} />
          </div>

          <div>
            <TextInput
              icon={Mail}
              type="email"
              placeholder="Email Address"
              autoComplete="email"
              error={errors.email}
              {...register("email")}
            />
            <FormError message={errors.email?.message} />
          </div>
        </div>

        <div>
          <PasswordInput
            placeholder="Password"
            autoComplete="new-password"
            error={errors.password}
            {...register("password")}
          />
          <FormError message={errors.password?.message} />
          <PasswordStrength password={password} />
        </div>

        <div>
          <PasswordInput
            placeholder="Confirm Password"
            autoComplete="new-password"
            error={errors.confirmPassword}
            {...register("confirmPassword")}
          />
          <FormError message={errors.confirmPassword?.message} />
        </div>

        <TermsCheckbox
          error={errors.agreeToTerms?.message}
          {...register("agreeToTerms")}
        />

        <PrimaryButton
          type="submit"
          size="lg"
          fullWidth
          icon={ArrowRight}
          loading={busy}
          className="flex-row-reverse"
        >
          Create Account
        </PrimaryButton>

        <FormError message={submitError} />

        <p className="text-center text-xs leading-relaxed text-gray-500">
          By creating an account, you agree to our{" "}
          <a href="/terms" className="font-medium text-gray-700 hover:text-gray-900">
            Terms
          </a>{" "}
          and acknowledge our{" "}
          <a href="/privacy" className="font-medium text-gray-700 hover:text-gray-900">
            Privacy Policy.
          </a>
        </p>
      </form>
    </motion.div>
  );
}

export default SignupForm;
