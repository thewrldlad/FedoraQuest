import { Link } from "react-router-dom";
import AchievementCard from "../AchievementCard/AchievementCard";

export default function Achievements({ achievementsData, unlockedIds }) {
  const preview = achievementsData.slice(0, 4);

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-display text-fedora-text">
          Achievements
        </h2>
        <Link
          to="/achievements"
          className="text-sm text-fedora-accent-light hover:underline"
        >
          View All →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {preview.map((achievement) => (
          <AchievementCard
            key={achievement.id}
            achievement={achievement}
            unlocked={unlockedIds.includes(achievement.id)}
          />
        ))}
      </div>
    </section>
  );
}
