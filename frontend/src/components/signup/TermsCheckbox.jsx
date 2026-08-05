import { forwardRef } from "react";
import Checkbox from "../common/Checkbox";
import FormError from "../common/FormError";

/**
 * Wraps the shared Checkbox with the specific "I agree to the Terms of
 * Service and Privacy Policy" copy and links, so SignupForm doesn't have
 * to repeat that JSX inline.
 *
 * forwardRef is required here: react-hook-form's `register()` returns a
 * `ref` prop, which only forwardRef components can receive.
 */
const TermsCheckbox = forwardRef(function TermsCheckbox(
  { error, ...checkboxProps },
  ref
) {
  return (
    <div>
      <Checkbox id="agreeToTerms" ref={ref} error={error} {...checkboxProps}>
        I agree to the{" "}
        <a href="/terms" className="font-medium text-brand-600 hover:text-brand-700">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="/privacy" className="font-medium text-brand-600 hover:text-brand-700">
          Privacy Policy
        </a>
      </Checkbox>
      <FormError message={error} />
    </div>
  );
});

export default TermsCheckbox;
