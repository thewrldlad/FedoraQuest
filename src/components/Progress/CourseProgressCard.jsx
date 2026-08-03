import { useState } from "react";
import { Link } from "react-router-dom";
import { Award } from "lucide-react";
import Button from "../Button/Button";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";
import ProgressBar from "./ProgressBar";
import ModuleProgress from "./ModuleProgress";
import LessonProgress from "./LessonProgress";
import heroImage from "../../assets/hero.png";

export default function CourseProgressCard({ progress, onResetProgress }) {
  const [showResetModal, setShowResetModal] = useState(false);

  const {
    courseTitle,
    totalLessons,
    completedLessonsCount,
    remainingLessons,
    courseCompletionPercent,
    resumeLesson,
    lastOpenedLesson,
    isCourseComplete,
    modules: modulesWithProgress,
    earnedCourseXP,
    achievementUnlocked,
    completedLessons,
    unlockedLessons,
  } = progress;

  const estimatedTotalHours = Math.round(((totalLessons * 45) / 60) * 10) / 10;

  return (
    <div className="mb-8">
      <section className="bg-fedora-surface border border-fedora-border rounded-xl p-6 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={heroImage}
            alt=""
            className="w-full md:w-48 h-32 object-cover rounded-lg border border-fedora-border shrink-0 bg-fedora-bg"
          />

          <div className="flex-1">
            <h2 className="text-2xl font-display text-fedora-text mb-1">
              {courseTitle}
            </h2>

            <div className="flex flex-wrap gap-x-2 gap-y-1 text-sm text-fedora-muted mb-4">
              <span>By FedoraQuest Team</span>
              <span>•</span>
              <span>Beginner to Advanced</span>
              <span>•</span>
              <span>~{estimatedTotalHours} hours total (estimate)</span>
            </div>

            <ProgressBar percent={courseCompletionPercent} label="Course progress" />

            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-fedora-muted mt-3">
              <span>{completedLessonsCount} lessons completed</span>
              <span>{remainingLessons} lessons remaining</span>
            </div>

            {lastOpenedLesson && (
              <div className="mt-3 pt-3 border-t border-fedora-border">
                <p className="text-fedora-muted text-xs uppercase tracking-wide mb-1">
                  Last Opened Lesson
                </p>
                <LessonProgress
                  lesson={lastOpenedLesson}
                  completed={completedLessons.includes(lastOpenedLesson.id)}
                  unlocked={unlockedLessons.includes(lastOpenedLesson.id)}
                />
              </div>
            )}

            <div className="flex flex-wrap gap-3 mt-4">
              {resumeLesson && (
                <Button as={Link} to={`/lesson/${resumeLesson.id}`}>
                  Continue Learning
                </Button>
              )}
              <Button
                variant="secondary"
                onClick={() => setShowResetModal(true)}
              >
                Reset Progress
              </Button>
            </div>
          </div>
        </div>
      </section>

      {isCourseComplete && (
        <section className="bg-fedora-surface border border-fedora-accent rounded-xl p-6 text-center mb-6">
          <p className="text-4xl mb-2">🎉</p>
          <h2 className="text-xl font-display text-fedora-text mb-2">
            Congratulations! You completed {courseTitle}!
          </h2>
          <p className="text-fedora-muted text-sm mb-4">
            You earned {earnedCourseXP.toLocaleString()} XP across{" "}
            {totalLessons} lessons.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-4">
            <Button as={Link} to="/certificates">
              <span className="flex items-center gap-2">
                <Award size={16} /> View Certificate
              </span>
            </Button>

            {achievementUnlocked && (
              <span className="text-green-400 text-sm">
                ✅ "Fedora Master" badge unlocked
              </span>
            )}
          </div>
        </section>
      )}

      <h3 className="text-lg font-display text-fedora-text mb-3">Modules</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {modulesWithProgress.map((module) => (
          <ModuleProgress key={module.id} module={module} />
        ))}
      </div>

      {showResetModal && (
        <ConfirmDialog
          title="Reset Course Progress"
          message="This will mark every lesson as not started and lock everything except Day 1 again. Your XP, streak, achievements, and lab progress are not affected. This cannot be undone."
          confirmLabel="Reset Progress"
          onConfirm={() => {
            onResetProgress();
            setShowResetModal(false);
          }}
          onCancel={() => setShowResetModal(false)}
        />
      )}
    </div>
  );
}
