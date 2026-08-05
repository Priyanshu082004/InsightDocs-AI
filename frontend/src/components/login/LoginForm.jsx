import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import TextInput from "../common/TextInput";
import PasswordInput from "../common/PasswordInput";
import PrimaryButton from "../common/PrimaryButton";
import SocialButton from "../common/SocialButton";
import Divider from "../common/Divider";
import FormError from "../common/FormError";
import SectionTitle from "../common/SectionTitle";
import Checkbox from "../common/Checkbox";
import { loginSchema } from "./loginSchema";
import { loginStart, loginSuccess, loginFailure } from "../../store/authSlice";

function LoginForm() {
  const dispatch = useDispatch();
  const authStatus = useSelector((state) => state.auth.status);
  const [submitError, setSubmitError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data) => {
    setSubmitError(null);
    dispatch(loginStart());

    
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      dispatch(loginSuccess({ email: data.email }));
    } catch (err) {
      const message = "Invalid email or password.";
      dispatch(loginFailure(message));
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
        center
        title={
          <>
            Welcome <span className="text-brand-600">back.</span>
          </>
        }
        subtitle="Continue where you left off."
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

        <div>
          <PasswordInput
            placeholder="Password"
            autoComplete="current-password"
            error={errors.password}
            {...register("password")}
          />
          <FormError message={errors.password?.message} />
        </div>

        <div className="flex items-center justify-between">
         
          <Checkbox id="rememberMe" {...register("rememberMe")}>
            Remember me
          </Checkbox>

          
          <Link
            to="/forgot-password"
            className="text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            Forgot Password?
          </Link>
        </div>

        <PrimaryButton
          type="submit"
          size="lg"
          fullWidth
          icon={ArrowRight}
          loading={busy}
          className="flex-row-reverse"
        >
          Log In
        </PrimaryButton>

        <FormError message={submitError} />

        <p className="text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="font-medium text-brand-600 hover:text-brand-700">
            Sign up
          </Link>
        </p>
      </form>
    </motion.div>
  );
}

export default LoginForm;