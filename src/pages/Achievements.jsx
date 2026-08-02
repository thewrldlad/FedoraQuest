import achievementsData from "../data/achievements";
import { useGame } from "../context/GameContext";

export default function Achievements() {
  const { achievements } = useGame();

  return (
    <div>
      <h1 className="text-3xl font-display text-fedora-text mb-2">
        🏆 Achievements
      </h1>

      <p className="text-fedora-muted mb-8">
        Unlock badges as you learn Fedora Linux.
      </p>

      <div className="grid grid-cols-2 gap-5">
        {achievementsData.map((achievement) => {
          const unlocked = achievements.includes(
            achievement.id
          );

          return (
            <div
              key={achievement.id}
              className={`rounded-xl border p-5 transition-all ${
                unlocked
                  ? "bg-fedora-surface border-fedora-accent"
                  : "bg-fedora-surface border-fedora-border opacity-60"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="text-4xl">
                  {achievement.icon}
                </div>

                <div>
                  <h2 className="text-xl font-display text-fedora-text">
                    {achievement.title}
                  </h2>

                  <p className="text-fedora-muted">
                    {achievement.description}
                  </p>

                  <p
                    className={`mt-2 text-sm font-medium ${
                      unlocked
                        ? "text-green-400"
                        : "text-gray-500"
                    }`}
                  >
                    {unlocked
                      ? "✅ Unlocked"
                      : "🔒 Locked"}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
