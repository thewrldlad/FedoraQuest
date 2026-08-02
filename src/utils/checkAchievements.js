export default function checkAchievements({
  xp,
  completedLessons,
  achievements,
  unlockAchievement,
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
}
