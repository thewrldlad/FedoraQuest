import { useGame } from "../context/GameContext";
import modules from "../data/modules";
import lessons from "../data/lessons";
import * as progressService from "../services/progressService";

const COURSE_TITLE = "Master Fedora Linux";
// Derived from the two fully-authored lessons' real estimatedTime values;
// used to extrapolate a rough remaining-time figure, not exact.
const AVERAGE_MINUTES_PER_LESSON = 45;

// Aggregates course-wide progress from GameContext — the single source
// of truth (backed by the progress/{uid} Firestore document and its one
// real-time listener) for lesson/lab completion, XP, streak, last
// opened lesson, and longest streak alike. This hook no longer keeps any
// state of its own; it's a pure derived-data + action layer over
// GameContext.
export default function useCourseProgress() {
  const {
    uid,
    xp,
    addXP,
    streak,
    completedLessons,
    setCompletedLessons,
    unlockedLessons,
    setUnlockedLessons,
    achievements,
    lastOpenedLessonId,
    longestStreak,
  } = useGame();

  const markLessonOpened = (lessonId) => {
    if (!uid) return;
    progressService.updateProgress(uid, { lastOpenedLessonId: lessonId });
  };

  // Centralizes "complete a lesson" (previously duplicated inline in
  // Lesson.jsx with a hardcoded XP amount) into one place that always
  // awards the lesson's real declared XP — or, when a quiz gates the
  // lesson, the XP the quiz itself calculated (so completing a
  // quiz-gated lesson doesn't award both the flat lesson XP and a
  // separate quiz XP for the same action).
  const markLessonComplete = (lessonId, xpOverride = null) => {
    const lesson = lessons.find((l) => l.id === lessonId);
    if (!lesson || completedLessons.includes(lessonId)) return;

    addXP(xpOverride !== null ? xpOverride : lesson.xp);

    setCompletedLessons((current) =>
      current.includes(lessonId) ? current : [...current, lessonId]
    );

    setUnlockedLessons((current) => {
      const nextLessonId = lessonId + 1;
      if (!lessons.find((l) => l.id === nextLessonId)) return current;
      if (current.includes(nextLessonId)) return current;
      return [...current, nextLessonId];
    });
  };

  // Scope is deliberately narrow: resets lesson completion/unlock state
  // and this feature's own extras. XP, streak, achievements, and lab
  // progress are separate systems and are NOT touched — a "redo the
  // lessons" action shouldn't silently erase earned badges.
  const resetProgress = () => {
    setCompletedLessons([]);
    setUnlockedLessons([1]);
    if (uid) progressService.resetProgressExtras(uid);
  };

  // --- Derived data ---
  const totalLessons = lessons.length;
  const completedLessonsCount = completedLessons.length;
  const remainingLessons = totalLessons - completedLessonsCount;
  const courseCompletionPercent =
    totalLessons > 0
      ? Math.round((completedLessonsCount / totalLessons) * 100)
      : 0;
  const isCourseComplete =
    totalLessons > 0 && completedLessonsCount === totalLessons;

  const nextLesson = lessons.find(
    (lesson) => !completedLessons.includes(lesson.id)
  );
  const lastOpenedLesson = lastOpenedLessonId
    ? lessons.find((lesson) => lesson.id === lastOpenedLessonId)
    : null;
  const resumeLesson = nextLesson || lastOpenedLesson || lessons[0];

  const estimatedMinutesRemaining = remainingLessons * AVERAGE_MINUTES_PER_LESSON;

  const totalCourseXP = lessons.reduce((sum, lesson) => sum + lesson.xp, 0);
  const earnedCourseXP = lessons
    .filter((lesson) => completedLessons.includes(lesson.id))
    .reduce((sum, lesson) => sum + lesson.xp, 0);

  const modulesWithProgress = modules.map((module) => {
    const moduleLessonIds = module.lessons.map((lesson) => lesson.id);
    const completedInModule = moduleLessonIds.filter((id) =>
      completedLessons.includes(id)
    ).length;
    const totalInModule = moduleLessonIds.length;
    const percent =
      totalInModule > 0
        ? Math.round((completedInModule / totalInModule) * 100)
        : 0;

    let status = "locked";
    if (totalInModule > 0 && completedInModule === totalInModule) {
      status = "completed";
    } else if (moduleLessonIds.some((id) => unlockedLessons.includes(id))) {
      status = "current";
    }

    return {
      ...module,
      completedCount: completedInModule,
      totalCount: totalInModule,
      percent,
      status,
    };
  });

  const modulesCompleted = modulesWithProgress.filter(
    (module) => module.status === "completed"
  ).length;

  const coursesStarted =
    completedLessonsCount > 0 || unlockedLessons.length > 1 ? 1 : 0;
  const coursesCompleted = isCourseComplete ? 1 : 0;

  return {
    courseTitle: COURSE_TITLE,
    totalLessons,
    completedLessonsCount,
    remainingLessons,
    courseCompletionPercent,
    isCourseComplete,
    resumeLesson,
    lastOpenedLesson,
    estimatedMinutesRemaining,
    totalCourseXP,
    earnedCourseXP,
    modules: modulesWithProgress,
    modulesCompleted,
    totalModules: modules.length,
    achievementUnlocked: achievements.includes("course_complete"),
    completedLessons,
    unlockedLessons,
    stats: {
      coursesStarted,
      coursesCompleted,
      lessonsCompleted: completedLessonsCount,
      totalLessons,
      modulesCompleted,
      totalModules: modules.length,
      currentStreak: streak,
      longestStreak,
      totalXP: xp,
    },
    markLessonOpened,
    markLessonComplete,
    resetProgress,
  };
}
