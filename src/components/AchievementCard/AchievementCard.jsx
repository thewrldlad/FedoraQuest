import { Lock } from "lucide-react";
import ProgressBar from "../Progress/ProgressBar";

export default function AchievementCard({
  achievement,
  unlocked,
  unlockedAt,
  progress,
}) {
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

        <div className="flex-1 min-w-0">
          <h3 className="font-display text-fedora-text">
            {achievement.title}
          </h3>
          <p className="text-fedora-muted text-sm">
            {achievement.description}
          </p>

          {(achievement.xpReward > 0 || (unlocked && unlockedAt)) && (
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-fedora-muted">
              {achievement.xpReward > 0 && (
                <span>+{achievement.xpReward} XP</span>
              )}
              {unlocked && unlockedAt && (
                <span>Unlocked {new Date(unlockedAt).toLocaleDateString()}</span>
              )}
            </div>
          )}

          {!unlocked && progress && (
            <div className="mt-2">
              <ProgressBar
                percent={Math.round((progress.current / progress.target) * 100)}
                size="sm"
              />
              <p className="text-fedora-muted text-xs mt-1">
                {progress.current} / {progress.target}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
