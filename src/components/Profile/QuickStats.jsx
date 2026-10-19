import { BookOpen, TerminalSquare, CircleCheck, Layers } from "lucide-react";

export default function QuickStats({
  lessonsCompleted,
  totalLessons,
  completedLabs,
  quizzesCompleted,
  modulesCompleted,
  totalModules,
}) {
  const stats = [
    {
      icon: BookOpen,
      label: "Lessons",
      value: `${lessonsCompleted}/${totalLessons}`,
      subtitle: "Completed",
    },
    {
      icon: TerminalSquare,
      label: "Labs",
      value: completedLabs,
      subtitle: "Hands-on practice",
    },
    {
      icon: CircleCheck,
      label: "Quizzes",
      value: quizzesCompleted,
      subtitle: "Passed",
    },
    {
      icon: Layers,
      label: "Modules",
      value: `${modulesCompleted}/${totalModules}`,
      subtitle: "Finished",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
      {stats.map(({ icon: Icon, label, value, subtitle }) => (
        <div
          key={label}
          className="bg-fedora-bg/60 border border-fedora-border rounded-xl p-4 backdrop-blur-sm hover:border-fedora-accent-light transition-all"
        >
          <Icon
            size={18}
            className="text-fedora-accent-light mb-2"
          />

          <p className="text-xs uppercase tracking-wide text-fedora-muted">
            {label}
          </p>

          <p className="text-xl font-display text-fedora-text mt-1">
            {value}
          </p>

          <p className="text-xs text-fedora-muted mt-1">
            {subtitle}
          </p>
        </div>
      ))}
    </div>
  );
}