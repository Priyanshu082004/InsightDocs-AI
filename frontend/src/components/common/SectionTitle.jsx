/**
 * Reusable section heading. `title` and `subtitle` accept plain strings or
 * JSX (e.g. `<>Create your <span className="text-brand-600">account</span></>`)
 * so callers can highlight part of the heading without SectionTitle having
 * to know about every possible phrase.
 */
function SectionTitle({
  eyebrow,
  title,
  subtitle,
  center = false,
  className = "",
  titleClassName = "",
  subtitleClassName = "",
}) {
  return (
    <div className={`${center ? "text-center" : ""} ${className}`}>
      {eyebrow && (
        <span className="inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-600">
          {eyebrow}
        </span>
      )}
      <h2
        className={`font-display text-3xl font-semibold text-gray-900 sm:text-4xl ${
          eyebrow ? "mt-4" : ""
        } ${titleClassName}`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-3 text-base text-gray-500 ${subtitleClassName}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default SectionTitle;
