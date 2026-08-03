// The only file that touches localStorage for the new course-progress
// tracking additions (last opened lesson, longest streak ever reached).
// Lesson/lab completion, XP, and current streak remain owned by
// GameContext — this deliberately does not duplicate that existing
// source of truth. To connect this to Firebase/Supabase later, replace
// the internals of these functions; useCourseProgress.js and every
// component that calls it stay unchanged.

const LAST_OPENED_LESSON_KEY = "fedoraquest_lastOpenedLessonId";
const LONGEST_STREAK_KEY = "fedoraquest_longestStreak";

export function getLastOpenedLessonId() {
  const saved = localStorage.getItem(LAST_OPENED_LESSON_KEY);
  return saved ? Number(saved) : null;
}

export function saveLastOpenedLessonId(lessonId) {
  localStorage.setItem(LAST_OPENED_LESSON_KEY, String(lessonId));
}

export function getLongestStreak() {
  const saved = localStorage.getItem(LONGEST_STREAK_KEY);
  return saved ? Number(saved) : 0;
}

export function saveLongestStreak(value) {
  localStorage.setItem(LONGEST_STREAK_KEY, String(value));
}

// Only clears this service's own data. Resetting completedLessons/
// unlockedLessons is the caller's responsibility (see
// useCourseProgress.resetProgress), since those belong to GameContext.
export function resetProgressExtras() {
  localStorage.removeItem(LAST_OPENED_LESSON_KEY);
  localStorage.removeItem(LONGEST_STREAK_KEY);
}
