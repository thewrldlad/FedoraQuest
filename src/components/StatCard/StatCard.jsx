export default function StatCard({ title, value }) {
  return (
    <div className="bg-fedora-surface border border-fedora-border rounded-lg p-5">
      <h3 className="text-sm font-medium uppercase tracking-wide mb-2 text-fedora-muted">
        {title}
      </h3>

      <p className="text-3xl font-display text-fedora-text">
        {value}
      </p>
    </div>
  );
}
