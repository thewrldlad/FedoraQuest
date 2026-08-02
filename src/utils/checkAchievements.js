import modules from "../data/modules";

export default function checkAchievements({
  xp,
  completedLessons,
  achievements,
  unlockAchievement,
  streak,
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
}
