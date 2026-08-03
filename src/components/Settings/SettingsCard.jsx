export default function SettingsCard({ icon: Icon, title, description, children }) {
  return (
    <section className="bg-fedora-surface border border-fedora-border rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-1">
        {Icon && (
          <div className="text-fedora-accent-light shrink-0">
            <Icon size={20} />
          </div>
        )}
        <h2 className="text-lg font-display text-fedora-text">{title}</h2>
      </div>

      {description && (
        <p className="text-fedora-muted text-sm mb-5">{description}</p>
      )}

      <div className={description ? "" : "mt-5"}>{children}</div>
    </section>
  );
}
