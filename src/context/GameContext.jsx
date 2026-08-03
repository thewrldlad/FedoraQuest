import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { increment, arrayUnion } from "firebase/firestore";

import checkAchievements from "../utils/checkAchievements";
import achievementsData from "../data/achievements";
import useAuth from "../auth/useAuth";
import * as progressService from "../services/progressService";
import * as achievementService from "../services/achievementService";

const GameContext = createContext();

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function GameProvider({ children }) {
  const { user } = useAuth();
  const uid = user?.uid || null;

  // ONE real-time Firestore listener (progress/{uid}) backs every field
  // below — XP, streak, lesson/lab state, quiz results, achievements,
  // and the command/question-tracking fields achievementService and
  // quizService write into this same document. See progressService.js.
  const [progress, setProgress] = useState(progressService.DEFAULT_PROGRESS);
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    if (!uid) {
      setProgress(progressService.DEFAULT_PROGRESS);
      setIsLoading(false);
      return undefined;
    }

    setIsLoading(true);
    const unsubscribe = progressService.subscribeToProgress(uid, (data) => {
      setProgress(data || progressService.DEFAULT_PROGRESS);
      setIsLoading(false);
    });

    return unsubscribe;
  }, [uid]);

  const previousLessonCount = useRef(progress.completedLessons.length);

  // Update streak when a new lesson is completed.
  useEffect(() => {
    if (!uid) return;

    if (progress.completedLessons.length > previousLessonCount.current) {
      const today = formatDate(new Date());

      if (progress.lastStudyDate !== today) {
        const yesterday = formatDate(
          new Date(Date.now() - 24 * 60 * 60 * 1000)
        );
        const nextStreak =
          progress.lastStudyDate === yesterday ? progress.streak + 1 : 1;

        progressService.updateProgress(uid, {
          streak: nextStreak,
          lastStudyDate: today,
          longestStreak: Math.max(nextStreak, progress.longestStreak),
        });
      }
    }

    previousLessonCount.current = progress.completedLessons.length;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress.completedLessons, uid]);

  // XP helper — uses Firestore's atomic increment() rather than
  // computing `progress.xp + amount` client-side, so two XP awards
  // firing back-to-back (e.g. a lesson completing and immediately
  // unlocking an achievement) can never clobber each other while
  // waiting on the same round trip.
  const addXP = (amount) => {
    if (!uid) return;
    progressService.updateProgress(uid, { xp: increment(amount) });
  };

  const setCompletedLessons = (updater) => {
    if (!uid) return;
    const next =
      typeof updater === "function" ? updater(progress.completedLessons) : updater;
    progressService.updateProgress(uid, { completedLessons: next });
  };

  const setUnlockedLessons = (updater) => {
    if (!uid) return;
    const next =
      typeof updater === "function" ? updater(progress.unlockedLessons) : updater;
    progressService.updateProgress(uid, { unlockedLessons: next });
  };

  const setCompletedLabs = (updater) => {
    if (!uid) return;
    const next =
      typeof updater === "function" ? updater(progress.completedLabs) : updater;
    progressService.updateProgress(uid, { completedLabs: next });
  };

  const setUnlockedLabs = (updater) => {
    if (!uid) return;
    const next =
      typeof updater === "function" ? updater(progress.unlockedLabs) : updater;
    progressService.updateProgress(uid, { unlockedLabs: next });
  };

  // Achievement helper — awards the achievement's declared XP and
  // records its unlock date exactly once, the first time it unlocks.
  const unlockAchievement = (id) => {
    if (!uid || progress.achievements.includes(id)) return;

    const achievement = achievementsData.find((a) => a.id === id);
    const xpReward = achievement?.xpReward || 0;

    progressService.updateProgress(uid, {
      achievements: arrayUnion(id),
      xp: increment(xpReward),
    });
    achievementService.recordUnlockDate(uid, id);

    pushNotification({
      type: "achievement",
      title: achievement?.title || id,
      xpReward,
    });
  };

  // Quiz result helper — keeps the best score and a sticky passed flag.
  const recordQuizResult = (lessonId, score, passed) => {
    if (!uid) return;

    const existing = progress.quizResults[lessonId];
    const bestScore = existing ? Math.max(existing.bestScore, score) : score;
    const hasPassed = existing ? existing.passed || passed : passed;

    progressService.updateProgress(uid, {
      quizResults: {
        ...progress.quizResults,
        [lessonId]: { bestScore, passed: hasPassed },
      },
    });
  };

  // Automatically check achievements whenever the relevant progress
  // fields change.
  useEffect(() => {
    if (!uid || isLoading) return;

    checkAchievements({
      xp: progress.xp,
      completedLessons: progress.completedLessons,
      completedLabs: progress.completedLabs,
      achievements: progress.achievements,
      unlockAchievement,
      streak: progress.streak,
      quizResults: progress.quizResults,
      commandsExecuted: progress.commandsExecuted,
      uniqueCommandsUsed: progress.uniqueCommandsUsed,
      questionsAnswered: progress.questionsAnswered,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    uid,
    isLoading,
    progress.xp,
    progress.completedLessons,
    progress.completedLabs,
    progress.streak,
    progress.quizResults,
    progress.commandsExecuted,
    progress.uniqueCommandsUsed,
    progress.questionsAnswered,
  ]);

  return (
    <GameContext.Provider
      value={{
        uid,
        isLoading,

        xp: progress.xp,
        addXP,

        completedLessons: progress.completedLessons,
        setCompletedLessons,

        unlockedLessons: progress.unlockedLessons,
        setUnlockedLessons,

        completedLabs: progress.completedLabs,
        setCompletedLabs,

        unlockedLabs: progress.unlockedLabs,
        setUnlockedLabs,

        achievements: progress.achievements,
        unlockAchievement,

        streak: progress.streak,
        longestStreak: progress.longestStreak,

        quizResults: progress.quizResults,
        recordQuizResult,

        firstSeenDate: progress.firstSeenDate,
        lastOpenedLessonId: progress.lastOpenedLessonId,

        achievementUnlockDates: progress.achievementUnlockDates,
        commandsExecuted: progress.commandsExecuted,
        uniqueCommandsUsed: progress.uniqueCommandsUsed,
        questionsAnswered: progress.questionsAnswered,

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
