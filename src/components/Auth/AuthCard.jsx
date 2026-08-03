export default function AuthCard({ title, subtitle, children }) {
  return (
    <div className="bg-fedora-surface border border-fedora-border rounded-xl p-8 shadow-sm">
      {title && (
        <h1 className="text-2xl font-display text-fedora-text mb-1 text-center">
          {title}
        </h1>
      )}

      {subtitle && (
        <p className="text-fedora-muted text-sm text-center mb-6">
          {subtitle}
        </p>
      )}

      {children}
    </div>
  );
}
