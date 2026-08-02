import { useGame } from "../../context/GameContext";
import { Star } from "lucide-react";

export default function XPCard() {
  const { xp } = useGame();
  const levels = [
    { xp: 0, title: "Fedora Beginner" },
    { xp: 500, title: "Terminal Apprentice" },
    { xp: 1000, title: "Linux Explorer" },
    { xp: 2000, title: "Fedora Navigator" },
    { xp: 3500, title: "Linux Professional" },
    { xp: 5000, title: "Fedora Master" },
  ];

  let currentLevel = levels[0];
  let nextLevel = levels[1];

  for (let i = 0; i < levels.length; i++) {
    if (xp >= levels[i].xp) {
      currentLevel = levels[i];
      nextLevel = levels[i + 1] || null;
    }
  }

  const currentLevelNumber = levels.indexOf(currentLevel) + 1;

  let percentage = 100;

  if (nextLevel) {
    percentage =
      ((xp - currentLevel.xp) /
        (nextLevel.xp - currentLevel.xp)) *
      100;
  }

  return (
    <section className="bg-fedora-surface border border-fedora-border rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <Star className="text-yellow-400" size={24} />

        <h2 className="text-xl font-display text-fedora-text">
          Experience
        </h2>
      </div>

      <p className="text-4xl font-display text-fedora-text">
        {xp.toLocaleString()} XP
      </p>

      <p className="text-fedora-muted mt-2">
        Level {currentLevelNumber} — {currentLevel.title}
      </p>

      <div className="w-full h-3 bg-fedora-border rounded-full mt-5 overflow-hidden">
        <div
          className="h-full bg-fedora-accent rounded-full transition-all duration-500"
          style={{
            width: `${Math.min(percentage, 100)}%`,
          }}
        />
      </div>

      <p className="text-fedora-muted text-sm mt-2">
        {nextLevel
          ? `${Math.round(
              percentage
            )}% to Level ${currentLevelNumber + 1}`
          : "Maximum Level Reached"}
      </p>
    </section>
  );
}
