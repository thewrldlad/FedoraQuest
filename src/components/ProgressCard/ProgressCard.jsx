export default function ProgressCard({
  title,
  value,
  subtitle,
}) {
  return (
    <div className="bg-fedora-surface border border-fedora-border rounded-xl p-5">
      <p className="text-sm uppercase tracking-wider text-fedora-muted mb-2">
        {title}
      </p>

      <h2 className="text-3xl font-display text-fedora-text">
        {value}
      </h2>

      <p className="mt-2 text-fedora-muted text-sm">
        {subtitle}
      </p>
    </div>
  );
}

