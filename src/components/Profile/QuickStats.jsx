import { Trophy, Flame, GraduationCap, Layers } from "lucide-react";

// Compact identity-card stats for inside the header — a tighter subset
// of the fuller stats grid the Profile page already renders further
// down via ProfileStats.jsx (unchanged, not duplicated logic: the same
// numbers are just passed down from Profile.jsx to both).
export default function QuickStats({
  levelNumber,
  levelTitle,
  xp,
  streak,
  modulesCompleted,
  totalModules,
}) {
  const stats = [
    {
      icon: GraduationCap,
      label: "Current Level",
      value: `Level ${levelNumber}`,
      subtitle: levelTitle,
    },
    {
      icon: Trophy,
      label: "Total XP",
      value: xp.toLocaleString(),
      subtitle: "Experience points",
    },
    {
      icon: Flame,
      label: "Learning Streak",
      value: `${streak} ${streak === 1 ? "Day" : "Days"}`,
      subtitle: streak > 0 ? "Keep it going" : "Start today",
    },
    {
      icon: Layers,
      label: "Courses Completed",
      value: `${modulesCompleted}/${totalModules}`,
      subtitle: "Modules finished",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
      {stats.map(({ icon: Icon, label, value, subtitle }) => (
        <div
          key={label}
          className="bg-fedora-bg/60 border border-fedora-border rounded-xl p-4 backdrop-blur-sm hover:border-fedora-accent-light hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
        >
          <Icon size={18} className="text-fedora-accent-light mb-2" aria-hidden="true" />
          <p className="text-xs uppercase tracking-wide text-fedora-muted">{label}</p>
          <p className="text-xl font-display text-fedora-text mt-0.5">{value}</p>
          <p className="text-xs text-fedora-muted mt-0.5">{subtitle}</p>
        </div>
      ))}
    </div>
  );
}
