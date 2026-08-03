export default function ProgressBar({ percent, label, size = "md" }) {
  const heightClass = size === "sm" ? "h-2" : size === "lg" ? "h-4" : "h-3";
  const clamped = Math.min(Math.max(percent, 0), 100);

  return (
    <div>
      {label && (
        <div className="flex justify-between text-xs text-fedora-muted mb-1">
          <span>{label}</span>
          <span>{clamped}%</span>
        </div>
      )}

      <div
        className={`w-full ${heightClass} bg-fedora-border rounded-full overflow-hidden`}
      >
        <div
          className="h-full bg-fedora-accent rounded-full transition-all duration-700"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
