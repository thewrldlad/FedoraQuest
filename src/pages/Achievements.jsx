import { useState } from "react";
import { Search } from "lucide-react";
import useAchievements from "../hooks/useAchievements";
import AchievementProgress from "../components/Achievements/AchievementProgress";
import AchievementGrid from "../components/Achievements/AchievementGrid";

const CATEGORIES = [
  "All",
  "Learning",
  "Quizzes",
  "XP",
  "Streaks",
  "Labs",
  "Commands",
  "Community",
];

const FILTERS = ["All", "Unlocked", "Locked", "In Progress"];

export default function Achievements() {
  const {
    achievements,
    totalAchievements,
    totalUnlocked,
    totalXPFromAchievements,
  } = useAchievements();

  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  const [filter, setFilter] = useState("All");

  const filtered = achievements.filter((achievement) => {
    const matchesCategory =
      category === "All" || achievement.category === category;

    const matchesFilter =
      filter === "All" ||
      (filter === "Unlocked" && achievement.unlocked) ||
      (filter === "Locked" && !achievement.unlocked && !achievement.progress) ||
      (filter === "In Progress" &&
        !achievement.unlocked &&
        achievement.progress &&
        achievement.progress.current > 0);

    const query = searchTerm.trim().toLowerCase();
    const matchesSearch =
      query === "" ||
      achievement.title.toLowerCase().includes(query) ||
      achievement.description.toLowerCase().includes(query);

    return matchesCategory && matchesFilter && matchesSearch;
  });

  return (
    <div>
      <h1 className="text-3xl font-display text-fedora-text mb-2">
        🏆 Achievements
      </h1>

      <p className="text-fedora-muted mb-6">
        Unlock badges as you learn Fedora Linux.
      </p>

      <AchievementProgress
        totalUnlocked={totalUnlocked}
        totalAchievements={totalAchievements}
        totalXPFromAchievements={totalXPFromAchievements}
      />

      <div className="flex items-center gap-2 bg-fedora-surface border border-fedora-border rounded-lg px-4 py-3 mb-4">
        <Search size={18} className="text-fedora-muted shrink-0" />
        <input
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search achievements..."
          className="bg-transparent outline-none text-fedora-text placeholder:text-fedora-muted w-full"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
              category === cat
                ? "bg-fedora-accent text-white"
                : "bg-fedora-surface border border-fedora-border text-fedora-text hover:bg-fedora-border"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
              filter === f
                ? "bg-fedora-border text-fedora-text"
                : "text-fedora-muted hover:bg-fedora-border"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <AchievementGrid achievements={filtered} />
    </div>
  );
}
