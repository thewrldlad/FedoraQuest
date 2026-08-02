import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";

import checkAchievements from "../utils/checkAchievements";

const GameContext = createContext();

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

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

  // Completed labs
  const [completedLabs, setCompletedLabs] = useState(() => {
    const saved = localStorage.getItem("completedLabs");
    return saved ? JSON.parse(saved) : [];
  });

  // Unlocked labs
  const [unlockedLabs, setUnlockedLabs] = useState(() => {
    const saved = localStorage.getItem("unlockedLabs");
    return saved ? JSON.parse(saved) : [1];
  });

  // Quiz results (per lesson id)
  const [quizResults, setQuizResults] = useState(() => {
    const saved = localStorage.getItem("quizResults");
    return saved ? JSON.parse(saved) : {};
  });

  // Achievements
  const [achievements, setAchievements] = useState(() => {
    const saved = localStorage.getItem("achievements");
    return saved ? JSON.parse(saved) : [];
  });

  // Study streak
  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem("streak");
    return saved ? Number(saved) : 0;
  });

  // Last study date
  const [lastStudyDate, setLastStudyDate] = useState(() => {
    return localStorage.getItem("lastStudyDate");
  });

  const previousLessonCount = useRef(completedLessons.length);

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

  // Save completed labs
  useEffect(() => {
    localStorage.setItem(
      "completedLabs",
      JSON.stringify(completedLabs)
    );
  }, [completedLabs]);

  // Save unlocked labs
  useEffect(() => {
    localStorage.setItem(
      "unlockedLabs",
      JSON.stringify(unlockedLabs)
    );
  }, [unlockedLabs]);

  // Save quiz results
  useEffect(() => {
    localStorage.setItem("quizResults", JSON.stringify(quizResults));
  }, [quizResults]);

  // Save achievements
  useEffect(() => {
    localStorage.setItem(
      "achievements",
      JSON.stringify(achievements)
    );
  }, [achievements]);

  // Save streak
  useEffect(() => {
    localStorage.setItem("streak", streak);
  }, [streak]);

  // Save last study date
  useEffect(() => {
    if (lastStudyDate) {
      localStorage.setItem("lastStudyDate", lastStudyDate);
    }
  }, [lastStudyDate]);

  // Update streak when a new lesson is completed
  useEffect(() => {
    if (completedLessons.length > previousLessonCount.current) {
      const today = formatDate(new Date());

      if (lastStudyDate !== today) {
        const yesterday = formatDate(
          new Date(Date.now() - 24 * 60 * 60 * 1000)
        );

        setStreak((current) =>
          lastStudyDate === yesterday ? current + 1 : 1
        );
        setLastStudyDate(today);
      }
    }

    previousLessonCount.current = completedLessons.length;
  }, [completedLessons, lastStudyDate]);

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

  // Quiz result helper — keeps the best score and a sticky passed flag
  const recordQuizResult = (lessonId, score, passed) => {
    setQuizResults((current) => {
      const existing = current[lessonId];
      const bestScore = existing ? Math.max(existing.bestScore, score) : score;
      const hasPassed = existing ? existing.passed || passed : passed;

      return {
        ...current,
        [lessonId]: { bestScore, passed: hasPassed },
      };
    });
  };

  // Automatically check achievements
  useEffect(() => {
    checkAchievements({
      xp,
      completedLessons,
      achievements,
      unlockAchievement,
      streak,
    });
  }, [xp, completedLessons, streak]);

  return (
    <GameContext.Provider
      value={{
        xp,
        addXP,

        completedLessons,
        setCompletedLessons,

        unlockedLessons,
        setUnlockedLessons,

        completedLabs,
        setCompletedLabs,

        unlockedLabs,
        setUnlockedLabs,

        achievements,
        unlockAchievement,

        streak,

        quizResults,
        recordQuizResult,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}
