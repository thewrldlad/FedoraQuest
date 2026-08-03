export default function ToggleSwitch({
  label,
  description,
  checked,
  onChange,
  disabled,
}) {
  return (
    <div
      className={`flex items-center justify-between gap-4 py-3 ${
        disabled ? "opacity-50" : ""
      }`}
    >
      <span>
        <span className="block text-fedora-text text-sm">{label}</span>
        {description && (
          <span className="block text-fedora-muted text-xs mt-0.5">
            {description}
          </span>
        )}
      </span>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 ${
          checked ? "bg-fedora-accent" : "bg-fedora-border"
        } ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200 ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
