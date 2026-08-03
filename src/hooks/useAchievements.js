import { useGame } from "../context/GameContext";
import achievementsData from "../data/achievements";
import * as achievementService from "../services/achievementService";

// Aggregates achievement display data entirely from GameContext's single
// real-time progress/{uid} listener — unlock state, unlock dates,
// command/question tracking all live on that one document now, so no
// separate Firestore read happens here (previously achievementService
// and quizService each did their own synchronous localStorage read).
export default function useAchievements() {
  const {
    achievements,
    xp,
    streak,
    completedLessons,
    completedLabs,
    quizResults,
    achievementUnlockDates,
    commandsExecuted,
    uniqueCommandsUsed,
    questionsAnswered,
  } = useGame();

  const quizzesPassedCount = Object.values(quizResults).filter(
    (result) => result.passed
  ).length;

  const stats = {
    xp,
    streak,
    completedLessonsCount: completedLessons.length,
    completedLabsCount: completedLabs.length,
    quizzesPassedCount,
    questionsAnsweredCount: questionsAnswered,
    commandsExecutedCount: commandsExecuted,
    uniqueCommandsUsedCount: uniqueCommandsUsed.length,
  };

  const achievementsWithState = achievementsData.map((achievement) => {
    const unlocked = achievements.includes(achievement.id);

    return {
      ...achievement,
      unlocked,
      unlockedAt: achievementUnlockDates[achievement.id] || null,
      progress: unlocked
        ? null
        : achievementService.getAchievementProgress(achievement, stats),
    };
  });

  const totalUnlocked = achievementsWithState.filter((a) => a.unlocked).length;
  const totalXPFromAchievements = achievementsWithState
    .filter((a) => a.unlocked)
    .reduce((sum, a) => sum + (a.xpReward || 0), 0);

  return {
    achievements: achievementsWithState,
    totalAchievements: achievementsData.length,
    totalUnlocked,
    totalXPFromAchievements,
    stats,
  };
}
