import { Link } from "react-router-dom";

const MAX_FEATURED = 4;

// Shows the most recently unlocked achievements as badges — real data
// from useAchievements() (via GameContext), not a hardcoded badge list.
// "View All" links to the existing /achievements page rather than
// duplicating its full grid here.
export default function FeaturedBadges({ achievements }) {
  const unlocked = achievements
    .filter((achievement) => achievement.unlocked)
    .sort((a, b) => new Date(b.unlockedAt || 0) - new Date(a.unlockedAt || 0));

  const featured = unlocked.slice(0, MAX_FEATURED);

  return (
    <div className="mt-5">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-medium text-fedora-text">Featured Badges</h2>
        <Link
          to="/achievements"
          className="text-xs text-fedora-accent-light hover:underline"
        >
          View All ({unlocked.length})
        </Link>
      </div>

      {featured.length === 0 ? (
        <p className="text-fedora-muted text-xs">
          Complete lessons and quizzes to earn your first badge.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {featured.map((achievement) => (
            <span
              key={achievement.id}
              title={achievement.description}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-fedora-bg/60 border border-fedora-border text-fedora-text text-xs hover:border-fedora-accent-light hover:-translate-y-0.5 transition-all duration-200"
            >
              <span aria-hidden="true">{achievement.icon}</span>
              {achievement.title}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
