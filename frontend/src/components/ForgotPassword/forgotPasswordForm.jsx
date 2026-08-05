import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Mail, Lock, CheckCircle2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import TextInput from "../common/TextInput";
import PrimaryButton from "../common/PrimaryButton";
import SecondaryButton from "../common/SecondaryButton";
import Divider from "../common/Divider";
import FormError from "../common/FormError";
import {
  forgotPasswordStart,
  forgotPasswordSuccess,
  forgotPasswordFailure,
} from "../../store/authSlice";
import { forgotPasswordSchema } from "./forgotPasswordSchema";

function ForgotPasswordForm() {
  const dispatch = useDispatch();
  const authStatus = useSelector((state) => state.auth.status);
  const [submitError, setSubmitError] = useState(null);
  // TODO: Success Toast — show a toast on successful submission once the
  // app has a toast/notification system. This inline message is a
  // placeholder stand-in until then.
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });


  const onSubmit = async (data) => {
    setSubmitError(null);
    setEmailSent(false);
    dispatch(forgotPasswordStart());

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      dispatch(forgotPasswordSuccess());
      setEmailSent(true);
    } catch (err) {
      const message = "Something went wrong. Please try again.";
      dispatch(forgotPasswordFailure(message));
      setSubmitError(message);
    }
  };

  const busy = isSubmitting || authStatus === "loading";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="text-center"
    >
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-50">
        <span className="relative">
          <Mail className="h-7 w-7 text-brand-600" strokeWidth={2} aria-hidden="true" />
          <Lock
            className="absolute -bottom-1 -right-1.5 h-3.5 w-3.5 text-brand-600"
            strokeWidth={2.5}
            aria-hidden="true"
          />
        </span>
      </span>

      <h1 className="mt-5 font-display text-3xl font-semibold text-gray-900">
        Forgot your <span className="text-brand-600">password?</span>
      </h1>
      <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-gray-500">
        No worries! Enter your email address and we&apos;ll send you a link to
        reset your password.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 text-left">
        <label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email Address
        </label>
        <TextInput
          id="email"
          icon={Mail}
          type="email"
          placeholder="Enter your email address"
          autoComplete="email"
          error={errors.email}
          className="mt-1.5"
          {...register("email")}
        />
        <FormError message={errors.email?.message} />

        <PrimaryButton
          type="submit"
          size="lg"
          fullWidth
          icon={ArrowRight}
          loading={busy}
          className="mt-6 flex-row-reverse"
        >
          Send Reset Link
        </PrimaryButton>

        <FormError message={submitError} />
        {emailSent && (
          <p
            role="status"
            className="mt-2 flex items-center gap-1.5 text-xs text-brand-600"
          >
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            Reset link sent — check your inbox.
          </p>
        )}

        <Divider label="or" className="my-6" />

        <SecondaryButton as={Link} to="/login" icon={ArrowLeft} fullWidth>
          Back to Log In
        </SecondaryButton>
      </form>
    </motion.div>
  );
}

export default ForgotPasswordForm;