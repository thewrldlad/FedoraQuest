import { Lock } from "lucide-react";

export default function AchievementCard({ achievement, unlocked }) {
  return (
    <div
      className={`rounded-xl border p-4 transition-all ${
        unlocked
          ? "bg-fedora-surface border-fedora-accent"
          : "bg-fedora-surface border-fedora-border opacity-60"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="text-3xl shrink-0">
          {unlocked ? (
            achievement.icon
          ) : (
            <Lock size={24} className="text-fedora-muted" />
          )}
        </div>

        <div>
          <h3 className="font-display text-fedora-text">
            {achievement.title}
          </h3>
          <p className="text-fedora-muted text-sm">
            {achievement.description}
          </p>
        </div>
      </div>
    </div>
  );
}
