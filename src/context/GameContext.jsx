import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

import checkAchievements from "../utils/checkAchievements";

const GameContext = createContext();

export function GameProvider({ children }) {
  // XP
  const [xp, setXp] = useState(() => {
    const saved = localStorage.getItem("xp");
    return saved ? Number(saved) : 1250;
  });

  // Completed lessons
  const [completedLessons, setCompletedLessons] = useState(() => {
    const saved = localStorage.getItem("completedLessons");
    return saved ? JSON.parse(saved) : [];
  });

  // Unlocked lessons
  const [unlockedLessons, setUnlockedLessons] = useState(() => {
    const saved = localStorage.getItem("unlockedLessons");
    return saved ? JSON.parse(saved) : [1];
  });

  // Achievements
  const [achievements, setAchievements] = useState(() => {
    const saved = localStorage.getItem("achievements");
    return saved ? JSON.parse(saved) : [];
  });

  // Save XP
  useEffect(() => {
    localStorage.setItem("xp", xp);
  }, [xp]);

  // Save completed lessons
  useEffect(() => {
    localStorage.setItem(
      "completedLessons",
      JSON.stringify(completedLessons)
    );
  }, [completedLessons]);

  // Save unlocked lessons
  useEffect(() => {
    localStorage.setItem(
      "unlockedLessons",
      JSON.stringify(unlockedLessons)
    );
  }, [unlockedLessons]);

  // Save achievements
  useEffect(() => {
    localStorage.setItem(
      "achievements",
      JSON.stringify(achievements)
    );
  }, [achievements]);

  // XP helper
  const addXP = (amount) => {
    setXp((currentXP) => currentXP + amount);
  };

  // Achievement helper
  const unlockAchievement = (id) => {
    setAchievements((current) => {
      if (current.includes(id)) return current;
      return [...current, id];
    });
  };

  // Automatically check achievements
  useEffect(() => {
    checkAchievements({
      xp,
      completedLessons,
      achievements,
      unlockAchievement,
    });
  }, [xp, completedLessons]);

  return (
    <GameContext.Provider
      value={{
        xp,
        addXP,

        completedLessons,
        setCompletedLessons,

        unlockedLessons,
        setUnlockedLessons,

        achievements,
        unlockAchievement,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}
