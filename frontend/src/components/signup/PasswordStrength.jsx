const LEVELS = [
  { label: "", barClass: "bg-gray-200" },
  { label: "Weak", barClass: "bg-red-400" },
  { label: "Fair", barClass: "bg-orange-400" },
  { label: "Medium", barClass: "bg-amber-400" },
  { label: "Strong", barClass: "bg-brand-500" },
];

/**
 * Scores a password 0-4 based on length and character variety. Kept
 * simple and deterministic (no external library) — good enough for a
 * live visual hint, not a security boundary (that's Zod's job).
 */
export function getPasswordStrength(password = "") {
  if (!password) return 0;

  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;

  return Math.min(score, 4);
}

function PasswordStrength({ password = "" }) {
  const score = getPasswordStrength(password);
  const level = LEVELS[score];

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <span>Password strength:</span>
        <span className="font-medium text-gray-700">{level.label}</span>
      </div>
      <div className="mt-1.5 grid grid-cols-4 gap-1.5" aria-hidden="true">
        {[1, 2, 3, 4].map((segment) => (
          <span
            key={segment}
            className={`h-1.5 rounded-full transition-colors duration-200 ${
              segment <= score ? level.barClass : "bg-gray-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default PasswordStrength;
