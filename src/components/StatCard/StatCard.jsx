export default function StatCard({ icon: Icon, title, value, subtitle }) {
  return (
    <div className="bg-fedora-surface border border-fedora-border rounded-xl p-5 shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
      {Icon && (
        <div className="mb-3 text-fedora-accent-light">
          <Icon size={28} />
        </div>
      )}

      <h3 className="text-sm font-medium uppercase tracking-wide mb-2 text-fedora-muted">
        {title}
      </h3>

      <p className="text-3xl font-display text-fedora-text">
        {value}
      </p>

      {subtitle && (
        <p className="mt-1 text-fedora-muted text-sm">
          {subtitle}
        </p>
      )}
    </div>
  );
}
