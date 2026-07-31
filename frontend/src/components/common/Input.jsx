import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

function Input({
  type = "text",
  placeholder,
  icon: Icon,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  return (
    <div className="relative">
      {Icon && (
        <Icon
          className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
        />
      )}

      <input
        type={
          isPassword
            ? showPassword
              ? "text"
              : "password"
            : type
        }
        placeholder={placeholder}
        className="h-14 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-11 text-sm outline-none transition-all duration-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
      />

      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-700"
        >
          {showPassword ? (
            <EyeOff size={18} />
          ) : (
            <Eye size={18} />
          )}
        </button>
      )}
    </div>
  );
}

export default Input;