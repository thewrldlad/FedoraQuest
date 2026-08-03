import AchievementCard from "../AchievementCard/AchievementCard";

export default function AchievementGrid({ achievements }) {
  if (achievements.length === 0) {
    return (
      <p className="text-fedora-muted text-sm">
        No achievements match your search or filter.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {achievements.map((achievement) => (
        <AchievementCard
          key={achievement.id}
          achievement={achievement}
          unlocked={achievement.unlocked}
          unlockedAt={achievement.unlockedAt}
          progress={achievement.progress}
        />
      ))}
    </div>
  );
}
