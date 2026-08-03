import { CheckCircle2, PlayCircle, Lock } from "lucide-react";
import ProgressBar from "./ProgressBar";

const STATUS_ICON = {
  completed: { Icon: CheckCircle2, className: "text-green-400" },
  current: { Icon: PlayCircle, className: "text-fedora-accent-light" },
  locked: { Icon: Lock, className: "text-fedora-muted" },
};

export default function ModuleProgress({ module }) {
  const { Icon, className } = STATUS_ICON[module.status];

  return (
    <div className="bg-fedora-surface border border-fedora-border rounded-xl p-4">
      <div className="flex items-center gap-3 mb-2">
        <Icon size={18} className={`${className} shrink-0`} />
        <span className="text-fedora-text font-display text-sm flex-1 truncate">
          {module.title}
        </span>
        <span className="text-fedora-muted text-xs shrink-0">
          {module.completedCount} / {module.totalCount}
        </span>
      </div>

      <ProgressBar percent={module.percent} size="sm" />
    </div>
  );
}
