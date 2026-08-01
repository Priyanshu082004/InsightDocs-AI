const ICON_BG_CLASSES = {
  green: "bg-brand-50 text-brand-600",
  orange: "bg-orange-50 text-orange-500",
  blue: "bg-blue-50 text-blue-500",
  purple: "bg-violet-50 text-violet-500",
};

function StepCard({ number, title, description, icon: Icon, color = "green" }) {
  return (
    <div className="flex h-full flex-col items-center rounded-2xl border border-gray-200 bg-white p-5 text-center shadow-sm">
      <span
        className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full ${ICON_BG_CLASSES[color]}`}
      >
        <Icon className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
      </span>
      <h3 className="text-sm font-semibold text-gray-900">
        {number}. {title}
      </h3>
      <p className="mt-2 text-xs leading-relaxed text-gray-500">
        {description}
      </p>
    </div>
  );
}

export default StepCard;