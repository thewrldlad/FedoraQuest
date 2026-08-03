import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";

import checkAchievements from "../utils/checkAchievements";
import usePersistedState from "../hooks/usePersistedState";
import achievementsData from "../data/achievements";
import * as achievementService from "../services/achievementService";

const GameContext = createContext();

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function GameProvider({ children }) {
  // XP
  const [xp, setXp] = usePersistedState("xp", 0, {
    serialize: String,
    deserialize: Number,
  });

  // Completed lessons
  const [completedLessons, setCompletedLessons] = usePersistedState(
    "completedLessons",
    []
  );

  // Unlocked lessons
  const [unlockedLessons, setUnlockedLessons] = usePersistedState(
    "unlockedLessons",
    [1]
  );

  // Completed labs
  const [completedLabs, setCompletedLabs] = usePersistedState(
    "completedLabs",
    []
  );

  // Unlocked labs
  const [unlockedLabs, setUnlockedLabs] = usePersistedState(
    "unlockedLabs",
    [1]
  );

  // Quiz results (per lesson id)
  const [quizResults, setQuizResults] = usePersistedState("quizResults", {});

  // Achievements
  const [achievements, setAchievements] = usePersistedState(
    "achievements",
    []
  );

  // Study streak
  const [streak, setStreak] = usePersistedState("streak", 0, {
    serialize: String,
    deserialize: Number,
  });

  // Last study date
  const [lastStudyDate, setLastStudyDate] = usePersistedState(
    "lastStudyDate",
    null,
    {
      serialize: (value) => value,
      deserialize: (value) => value,
      shouldPersist: (value) => Boolean(value),
    }
  );

  // First seen date — set once, used for "Member Since" on the Profile page
  const [firstSeenDate] = usePersistedState(
    "firstSeenDate",
    formatDate(new Date()),
    {
      serialize: (value) => value,
      deserialize: (value) => value,
    }
  );

  // Transient toast queue (not persisted — this is UI state, not data).
  // Shown by AchievementNotification, mounted once at the app's root
  // layout so it's visible regardless of which page triggered it.
  const [notifications, setNotifications] = useState([]);

  const pushNotification = useCallback((notification) => {
    setNotifications((current) => [
      ...current,
      { id: crypto.randomUUID(), ...notification },
    ]);
  }, []);

  const dismissNotification = useCallback((id) => {
    setNotifications((current) => current.filter((n) => n.id !== id));
  }, []);

  const previousLessonCount = useRef(completedLessons.length);

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

  // Achievement helper — awards the achievement's declared XP and records
  // its unlock date exactly once, the first time it unlocks.
  const unlockAchievement = (id) => {
    if (achievements.includes(id)) return;

    const achievement = achievementsData.find((a) => a.id === id);
    const xpReward = achievement?.xpReward || 0;

    setAchievements((current) =>
      current.includes(id) ? current : [...current, id]
    );
    achievementService.recordUnlockDate(id);

    if (xpReward > 0) {
      addXP(xpReward);
    }

    pushNotification({
      type: "achievement",
      title: achievement?.title || id,
      xpReward,
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
      completedLabs,
      achievements,
      unlockAchievement,
      streak,
      quizResults,
    });
  }, [xp, completedLessons, completedLabs, streak, quizResults]);

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

        firstSeenDate,

        notifications,
        pushNotification,
        dismissNotification,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}
