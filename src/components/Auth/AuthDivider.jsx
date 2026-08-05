export default function AuthDivider({ label = "or continue with" }) {
  return (
    <div className="flex items-center gap-3" aria-hidden="true">
      <span className="h-px flex-1 bg-fedora-border" />
      <span className="text-xs font-medium uppercase tracking-wide text-fedora-muted">
        {label}
      </span>
      <span className="h-px flex-1 bg-fedora-border" />
    </div>
  );
}
