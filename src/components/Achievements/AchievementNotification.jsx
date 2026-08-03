import { useEffect } from "react";
import { useGame } from "../../context/GameContext";

// Mounted once at the app's root layout so a toast is visible regardless
// of which page (lesson, quiz, lab) triggered the unlock. Shows one
// notification at a time from GameContext's queue, auto-dismissing so
// the next one (if any) can appear.
export default function AchievementNotification() {
  const { notifications, dismissNotification } = useGame();
  const current = notifications[0];

  useEffect(() => {
    if (!current) return undefined;

    const timer = setTimeout(() => dismissNotification(current.id), 4000);
    return () => clearTimeout(timer);
  }, [current, dismissNotification]);

  if (!current) return null;

  const isCertificate = current.type === "certificate";

  return (
    <div className="fixed top-6 right-6 z-50 bg-fedora-surface border border-fedora-accent rounded-xl shadow-lg p-4 w-80">
      <div className="flex items-start gap-3">
        <div className="text-2xl shrink-0">{isCertificate ? "🎉" : "🏆"}</div>
        <div>
          <p className="text-fedora-text font-display text-sm">
            {isCertificate ? "Course Completed!" : "Achievement Unlocked!"}
          </p>
          <p className="text-fedora-accent-light text-sm font-medium mt-0.5">
            {current.title}
          </p>
          {isCertificate ? (
            <p className="text-fedora-muted text-xs mt-1">
              Certificate available
            </p>
          ) : current.xpReward > 0 ? (
            <p className="text-fedora-muted text-xs mt-1">
              +{current.xpReward} XP
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
