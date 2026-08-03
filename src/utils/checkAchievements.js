import modules from "../data/modules";
import quizzesData from "../data/quizzes";
import { checkAllQuizzesPassed, getAverageQuizScore } from "../services/quizService";

export default function checkAchievements({
  xp,
  completedLessons,
  achievements,
  unlockAchievement,
  streak,
  quizResults,
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
}
