import { useGame } from "../context/GameContext";
import achievementsData from "../data/achievements";
import * as achievementService from "../services/achievementService";
import { getQuestionsAnswered } from "../services/quizService";

// Aggregates achievement display data from GameContext (unlock state,
// already persisted there) plus achievementService (unlock dates, command
// tracking) and quizService (questions answered — tracked there for the
// quiz system, reused here for the "Centurion" achievement's progress bar).
export default function useAchievements() {
  const { achievements, xp, streak, completedLessons, completedLabs, quizResults } =
    useGame();

  const unlockDates = achievementService.getUnlockDates();
  const commandsExecuted = achievementService.getCommandsExecuted();
  const uniqueCommandsUsed = achievementService.getUniqueCommandsUsed();
  const quizzesPassedCount = Object.values(quizResults).filter(
    (result) => result.passed
  ).length;

  const stats = {
    xp,
    streak,
    completedLessonsCount: completedLessons.length,
    completedLabsCount: completedLabs.length,
    quizzesPassedCount,
    questionsAnsweredCount: getQuestionsAnswered(),
    commandsExecutedCount: commandsExecuted,
    uniqueCommandsUsedCount: uniqueCommandsUsed.length,
  };

  const achievementsWithState = achievementsData.map((achievement) => {
    const unlocked = achievements.includes(achievement.id);

    return {
      ...achievement,
      unlocked,
      unlockedAt: unlockDates[achievement.id] || null,
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
