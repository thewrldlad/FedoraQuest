import { useGame } from "../context/GameContext";

export default function Profile() {
  const {
    xp,
    completedLessons,
    achievements,
  } = useGame();

  return (
    <div>
      <h1 className="text-3xl font-display text-fedora-text mb-8">
        👤 Profile
      </h1>

      <div className="bg-fedora-surface border border-fedora-border rounded-xl p-8 space-y-4">
        <h2 className="text-2xl font-display text-fedora-text">
          THEWRLDLAD
        </h2>

        <p className="text-fedora-text">
          ⭐ XP: {xp}
        </p>

        <p className="text-fedora-text">
          📚 Lessons Completed: {completedLessons.length}
        </p>

        <p className="text-fedora-text">
          🏅 Achievements: {achievements.length}
        </p>

        <p className="text-fedora-text">
          🐧 Rank: Linux Explorer
        </p>
      </div>
    </div>
  );
}
