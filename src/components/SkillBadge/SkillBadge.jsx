export default function SkillBadge({ label, percentage }) {
  return (
    <div className="bg-fedora-surface border border-fedora-border rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-2">
        <span className="text-fedora-text font-medium text-sm">{label}</span>
        <span className="text-fedora-muted text-xs">{percentage}%</span>
      </div>

      <div className="w-full h-2 bg-fedora-border rounded-full overflow-hidden">
        <div
          className="h-full bg-fedora-accent rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
