import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import useAuth from "../auth/useAuth";
import * as progressService from "../services/progressService";

const GameContext = createContext();

export function GameProvider({ children }) {
  const { user } = useAuth();
  const uid = user?.uid || null;

  // Single Firestore listener backing the learner's progress.
  const [progress, setProgress] = useState(progressService.DEFAULT_PROGRESS);
  const [isLoading, setIsLoading] = useState(true);

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

  const setCompletedLessons = (updater) => {
    if (!uid) return;

    const next =
      typeof updater === "function"
        ? updater(progress.completedLessons)
        : updater;

    progressService.updateProgress(uid, {
      completedLessons: next,
    });
  };

  const setUnlockedLessons = (updater) => {
    if (!uid) return;

    const next =
      typeof updater === "function"
        ? updater(progress.unlockedLessons)
        : updater;

    progressService.updateProgress(uid, {
      unlockedLessons: next,
    });
  };

  const setCompletedLabs = (updater) => {
    if (!uid) return;

    const next =
      typeof updater === "function"
        ? updater(progress.completedLabs)
        : updater;

    progressService.updateProgress(uid, {
      completedLabs: next,
    });
  };

  const setUnlockedLabs = (updater) => {
    if (!uid) return;

    const next =
      typeof updater === "function"
        ? updater(progress.unlockedLabs)
        : updater;

    progressService.updateProgress(uid, {
      unlockedLabs: next,
    });
  };

  const recordQuizResult = (lessonId, score, passed) => {
    if (!uid) return;

    const existing = progress.quizResults[lessonId];

    const bestScore = existing
      ? Math.max(existing.bestScore, score)
      : score;

    const hasPassed = existing
      ? existing.passed || passed
      : passed;

    progressService.updateProgress(uid, {
      quizResults: {
        ...progress.quizResults,
        [lessonId]: {
          bestScore,
          passed: hasPassed,
        },
      },
    });
  };

  return (
    <GameContext.Provider
      value={{
        uid,
        isLoading,

        completedLessons: progress.completedLessons,
        setCompletedLessons,

        unlockedLessons: progress.unlockedLessons,
        setUnlockedLessons,

        completedLabs: progress.completedLabs,
        setCompletedLabs,

        unlockedLabs: progress.unlockedLabs,
        setUnlockedLabs,

        quizResults: progress.quizResults,
        recordQuizResult,

        firstSeenDate: progress.firstSeenDate,
        lastOpenedLessonId: progress.lastOpenedLessonId,

        commandsExecuted: progress.commandsExecuted,
        uniqueCommandsUsed: progress.uniqueCommandsUsed,
        questionsAnswered: progress.questionsAnswered,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}