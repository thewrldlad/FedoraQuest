import ProgressBar from "../Progress/ProgressBar";

export default function AchievementProgress({
  totalUnlocked,
  totalAchievements,
  totalXPFromAchievements,
}) {
  const percent =
    totalAchievements > 0
      ? Math.round((totalUnlocked / totalAchievements) * 100)
      : 0;

  return (
    <section className="bg-fedora-surface border border-fedora-border rounded-xl p-6 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
        <div>
          <p className="text-fedora-muted text-sm">Achievements Earned</p>
          <p className="text-2xl font-display text-fedora-text">
            {totalUnlocked} / {totalAchievements}
          </p>
        </div>
        <div>
          <p className="text-fedora-muted text-sm">XP from Achievements</p>
          <p className="text-2xl font-display text-fedora-text">
            {totalXPFromAchievements.toLocaleString()}
          </p>
        </div>
      </div>

      <ProgressBar percent={percent} />
    </section>
  );
}
