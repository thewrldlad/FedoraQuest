import modules from "../data/modules";
import quizzesData from "../data/quizzes";
import labCategories from "../data/labs";
import { checkAllQuizzesPassed, getAverageQuizScore } from "../services/quizService";

const TOTAL_LABS = labCategories.flatMap((category) => category.labs).length;

export default function checkAchievements({
  xp,
  completedLessons,
  completedLabs,
  achievements,
  unlockAchievement,
  streak,
  quizResults,
  commandsExecuted = 0,
  uniqueCommandsUsed = [],
  questionsAnswered = 0,
}) {
  // First Lesson
  if (
    completedLessons.length >= 1 &&
    !achievements.includes("first_lesson")
  ) {
    unlockAchievement("first_lesson");
  }

  // Reach 1000 XP
  if (
    xp >= 1000 &&
    !achievements.includes("xp_1000")
  ) {
    unlockAchievement("xp_1000");
  }

  // Complete 5 lessons
  if (
    completedLessons.length >= 5 &&
    !achievements.includes("five_lessons")
  ) {
    unlockAchievement("five_lessons");
  }

  // Complete 10 lessons
  if (
    completedLessons.length >= 10 &&
    !achievements.includes("ten_lessons")
  ) {
    unlockAchievement("ten_lessons");
  }

  // Complete first module
  const firstModule = modules[0];
  if (
    firstModule &&
    firstModule.lessons.every((lesson) =>
      completedLessons.includes(lesson.id)
    ) &&
    !achievements.includes("first_module")
  ) {
    unlockAchievement("first_module");
  }

  // Reach 500 XP
  if (
    xp >= 500 &&
    !achievements.includes("xp_500")
  ) {
    unlockAchievement("xp_500");
  }

  // Reach a 7-day study streak
  if (
    streak >= 7 &&
    !achievements.includes("streak_7")
  ) {
    unlockAchievement("streak_7");
  }

  // Reach a 30-day study streak
  if (
    streak >= 30 &&
    !achievements.includes("streak_30")
  ) {
    unlockAchievement("streak_30");
  }

  // Complete the entire course
  const allLessons = modules.flatMap((module) => module.lessons);
  if (
    allLessons.length > 0 &&
    allLessons.every((lesson) => completedLessons.includes(lesson.id)) &&
    !achievements.includes("course_complete")
  ) {
    unlockAchievement("course_complete");
  }

  // First Quiz
  if (
    Object.keys(quizResults).length >= 1 &&
    !achievements.includes("first_quiz")
  ) {
    unlockAchievement("first_quiz");
  }

  // Perfect Score
  if (
    Object.values(quizResults).some((result) => result.bestScore === 100) &&
    !achievements.includes("perfect_score")
  ) {
    unlockAchievement("perfect_score");
  }

  // Quiz Master — passed every quiz that currently exists
  const allQuizIds = Object.keys(quizzesData).map(Number);
  const allQuizzesPassed = checkAllQuizzesPassed(quizResults, allQuizIds);

  if (allQuizzesPassed && !achievements.includes("quiz_master")) {
    unlockAchievement("quiz_master");
  }

  // Course Expert — passed every quiz with a 90%+ average score
  if (
    allQuizzesPassed &&
    getAverageQuizScore(quizResults, allQuizIds) >= 90 &&
    !achievements.includes("course_expert")
  ) {
    unlockAchievement("course_expert");
  }

  // Earn 100 XP
  if (xp >= 100 && !achievements.includes("xp_100")) {
    unlockAchievement("xp_100");
  }

  // Fedora Champion — reach the maximum XP level
  if (xp >= 5000 && !achievements.includes("xp_champion")) {
    unlockAchievement("xp_champion");
  }

  // 3-day streak
  if (streak >= 3 && !achievements.includes("streak_3")) {
    unlockAchievement("streak_3");
  }

  // 100-day streak
  if (streak >= 100 && !achievements.includes("streak_100")) {
    unlockAchievement("streak_100");
  }

  // 10 quizzes passed
  const quizzesPassedCount = Object.values(quizResults).filter(
    (result) => result.passed
  ).length;

  if (quizzesPassedCount >= 10 && !achievements.includes("ten_quizzes_passed")) {
    unlockAchievement("ten_quizzes_passed");
  }

  // First lab
  if (completedLabs.length >= 1 && !achievements.includes("first_lab")) {
    unlockAchievement("first_lab");
  }

  // 10 labs completed
  if (completedLabs.length >= 10 && !achievements.includes("ten_labs")) {
    unlockAchievement("ten_labs");
  }

  // Every lab completed
  if (
    TOTAL_LABS > 0 &&
    completedLabs.length >= TOTAL_LABS &&
    !achievements.includes("lab_expert")
  ) {
    unlockAchievement("lab_expert");
  }

  // 100 terminal commands executed (moved here from Labs.jsx — that
  // check relied on a synchronous return value from
  // achievementService.incrementCommandsExecuted(), which became async
  // once it wrote to Firestore instead of localStorage; centralizing it
  // here, watching the same real-time progress data every other
  // achievement check already watches, avoids that problem entirely)
  if (commandsExecuted >= 100 && !achievements.includes("hundred_commands")) {
    unlockAchievement("hundred_commands");
  }

  // 12 unique commands used
  if (
    uniqueCommandsUsed.length >= 12 &&
    !achievements.includes("terminal_expert")
  ) {
    unlockAchievement("terminal_expert");
  }

  // 100 quiz questions answered (moved here from useQuiz.js for the
  // same reason as the command-based checks above)
  if (questionsAnswered >= 100 && !achievements.includes("hundred_questions")) {
    unlockAchievement("hundred_questions");
  }
}
