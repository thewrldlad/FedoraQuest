import { Link } from "react-router-dom";
import Button from "../Button/Button";
import ProgressBar from "./ProgressBar";

export default function ContinueLearning({ progress }) {
  const {
    courseTitle,
    resumeLesson,
    courseCompletionPercent,
    estimatedMinutesRemaining,
    isCourseComplete,
  } = progress;

  if (isCourseComplete) {
    return (
      <section className="bg-fedora-surface border border-fedora-border rounded-xl p-6 mb-6 shadow-sm">
        <h2 className="text-2xl font-display text-fedora-text">
          🎉 Course Complete!
        </h2>
        <p className="text-fedora-muted mt-3">
          You've finished {courseTitle}. Visit the Course page for your
          certificate placeholder and completion badge.
        </p>
      </section>
    );
  }

  const hoursRemaining = Math.round((estimatedMinutesRemaining / 60) * 10) / 10;

  return (
    <section className="bg-fedora-surface border border-fedora-border rounded-xl p-6 mb-6 shadow-sm">
      <p className="text-sm uppercase tracking-wider text-fedora-muted mb-2">
        Continue Learning
      </p>

      <h2 className="text-2xl font-display text-fedora-text mb-1">
        {courseTitle}
      </h2>

      {resumeLesson && (
        <p className="text-fedora-text leading-7 mb-4">
          Next up: {resumeLesson.day} — {resumeLesson.title}
        </p>
      )}

      <ProgressBar percent={courseCompletionPercent} label="Course progress" />

      <p className="text-fedora-muted text-sm mt-2 mb-5">
        ~{hoursRemaining} {hoursRemaining === 1 ? "hour" : "hours"} remaining
        (estimate)
      </p>

      {resumeLesson && (
        <Button as={Link} to={`/lesson/${resumeLesson.id}`}>
          Resume
        </Button>
      )}
    </section>
  );
}
