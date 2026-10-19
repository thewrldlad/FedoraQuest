import { useGame } from "../context/GameContext";
import modules from "../data/modules";
import lessons from "../data/lessons";
import * as progressService from "../services/progressService";

const COURSE_TITLE = "Master Fedora Linux";
const AVERAGE_MINUTES_PER_LESSON = 45;

export default function useCourseProgress() {
  const {
    uid,
    completedLessons = [],
    setCompletedLessons,
    unlockedLessons = [],
    setUnlockedLessons,
    lastOpenedLessonId,
  } = useGame();

  const markLessonOpened = (lessonId) => {
    if (!uid) return;

    progressService.updateProgress(uid, {
      lastOpenedLessonId: lessonId,
    });
  };

  const markLessonComplete = (lessonId) => {
    const lesson = lessons.find((l) => l.id === lessonId);

    if (!lesson) return;
    if (completedLessons.includes(lessonId)) return;

    setCompletedLessons((current) =>
      current.includes(lessonId)
        ? current
        : [...current, lessonId]
    );

    setUnlockedLessons((current) => {
      const nextLessonId = lessonId + 1;

      if (!lessons.find((l) => l.id === nextLessonId)) {
        return current;
      }

      if (current.includes(nextLessonId)) {
        return current;
      }

      return [...current, nextLessonId];
    });

    if (uid) {
      progressService.updateProgress(uid, {
        completedLessons: [
          ...completedLessons,
          lessonId,
        ],
      });
    }
  };

  const markLessonIncomplete = (lessonId) => {
    setCompletedLessons((current) =>
      current.filter((id) => id !== lessonId)
    );

    if (uid) {
      progressService.updateProgress(uid, {
        completedLessons: completedLessons.filter(
          (id) => id !== lessonId
        ),
      });
    }
  };

  const resetProgress = () => {
    setCompletedLessons([]);
    setUnlockedLessons([1]);

    if (uid) {
      progressService.resetProgressExtras(uid);
    }
  };

  // -----------------------------
  // Derived Course Data
  // -----------------------------

  const totalLessons = lessons.length;

  const completedLessonsCount = completedLessons.length;

  const remainingLessons =
    totalLessons - completedLessonsCount;

  const courseCompletionPercent =
    totalLessons > 0
      ? Math.round(
          (completedLessonsCount / totalLessons) * 100
        )
      : 0;

  const isCourseComplete =
    totalLessons > 0 &&
    completedLessonsCount === totalLessons;

  const nextLesson = lessons.find(
    (lesson) =>
      !completedLessons.includes(lesson.id)
  );

  const lastOpenedLesson = lastOpenedLessonId
    ? lessons.find(
        (lesson) =>
          lesson.id === lastOpenedLessonId
      )
    : null;

  const resumeLesson =
    nextLesson ||
    lastOpenedLesson ||
    lessons[0];

  const estimatedMinutesRemaining =
    remainingLessons * AVERAGE_MINUTES_PER_LESSON;

  const modulesWithProgress = modules.map((module) => {
    const moduleLessonIds = module.lessons.map(
      (lesson) => lesson.id
    );

    const completedInModule =
      moduleLessonIds.filter((id) =>
        completedLessons.includes(id)
      ).length;

    const totalInModule =
      moduleLessonIds.length;

    const percent =
      totalInModule > 0
        ? Math.round(
            (completedInModule / totalInModule) * 100
          )
        : 0;

    let status = "locked";

    if (
      totalInModule > 0 &&
      completedInModule === totalInModule
    ) {
      status = "completed";
    } else if (
      moduleLessonIds.some((id) =>
        unlockedLessons.includes(id)
      )
    ) {
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

  const modulesCompleted =
    modulesWithProgress.filter(
      (module) =>
        module.status === "completed"
    ).length;

  const coursesStarted =
    completedLessonsCount > 0 ||
    unlockedLessons.length > 1
      ? 1
      : 0;

  const coursesCompleted =
    isCourseComplete ? 1 : 0;

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

    modules: modulesWithProgress,
    modulesCompleted,
    totalModules: modules.length,

    completedLessons,
    unlockedLessons,

    stats: {
      coursesStarted,
      coursesCompleted,
      lessonsCompleted: completedLessonsCount,
      totalLessons,
      modulesCompleted,
      totalModules: modules.length,
    },

    markLessonOpened,
    markLessonComplete,
    markLessonIncomplete,
    resetProgress,
  };
}
