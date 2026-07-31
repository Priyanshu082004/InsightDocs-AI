function SocialButton({ icon, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-14 w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white font-medium text-gray-800 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md"
    >
      {icon}

      <span>{children}</span>
    </button>
  );
}

export default SocialButton;