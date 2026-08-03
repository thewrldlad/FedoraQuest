import { CheckCircle2, Clock, Circle } from "lucide-react";

const STATE_CONFIG = {
  completed: { icon: CheckCircle2, label: "Completed", className: "text-green-400" },
  "in-progress": { icon: Clock, label: "In Progress", className: "text-fedora-accent-light" },
  "not-started": { icon: Circle, label: "Not Started", className: "text-fedora-muted" },
};

export default function LessonProgress({ lesson, completed, unlocked }) {
  const state = completed ? "completed" : unlocked ? "in-progress" : "not-started";
  const { icon: Icon, label, className } = STATE_CONFIG[state];

  return (
    <div className="flex items-center gap-3 py-2">
      <Icon size={16} className={`${className} shrink-0`} />
      <span className="text-fedora-text text-sm flex-1 truncate">
        {lesson.day} — {lesson.title}
      </span>
      <span className={`text-xs ${className} shrink-0`}>{label}</span>
    </div>
  );
}
