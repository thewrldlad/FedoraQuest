import { ArrowRight, CheckCircle2, Flag, Layers } from "lucide-react";
import { Link } from "react-router-dom";

function GoalProgress({ icon: Icon, title, detail, progress, footer }) {
  return (
    <div className="rounded-xl border border-fedora-border bg-fedora-bg/45 p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-fedora-accent/15 text-fedora-accent-light">
          <Icon size={19} aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-medium text-fedora-text">{title}</h3>
          <p className="mt-1 text-sm text-fedora-muted">{detail}</p>
        </div>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-fedora-border">
        <div
          className="h-full rounded-full bg-gradient-to-r from-fedora-accent to-fedora-accent-light transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-fedora-muted">{footer}</p>
    </div>
  );
}

export default function LearningGoals({
  lessonsCompleted,
  totalLessons,
  coursesCompleted,
  totalCourses,
  nextLesson,
  progressPercent,
}) {
  const moduleProgress =
    totalCourses > 0 ? Math.round((coursesCompleted / totalCourses) * 100) : 0;

  return (
    <section className="mb-8">
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-fedora-accent-light">
            Keep moving forward
          </p>
          <h2 className="mt-1 text-xl font-display text-fedora-text">
            Learning Goals
          </h2>
        </div>
        <p className="text-sm text-fedora-muted">Your next milestones, based on live progress</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(17rem,0.7fr)]">
        <div className="rounded-2xl border border-fedora-border bg-fedora-surface p-5 shadow-sm sm:p-6">
          <GoalProgress
            icon={Flag}
            title="Complete the FedoraQuest course"
            detail={`${lessonsCompleted} of ${totalLessons} lessons complete`}
            progress={progressPercent}
            footer={`${progressPercent}% of your course journey is complete`}
          />

          <div className="mt-4">
            <GoalProgress
              icon={Layers}
              title="Finish every learning module"
              detail={`${coursesCompleted} of ${totalCourses} modules complete`}
              progress={moduleProgress}
              footer={`${moduleProgress}% module completion`}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-fedora-border bg-gradient-to-br from-fedora-surface to-fedora-bg p-5 shadow-sm sm:p-6">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-fedora-accent text-white shadow-md shadow-fedora-accent/25">
            <CheckCircle2 size={20} aria-hidden="true" />
          </span>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-fedora-accent-light">
            Next up
          </p>
          <h3 className="mt-2 font-display text-lg text-fedora-text">
            {nextLesson ? nextLesson.title : "You completed every lesson"}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-fedora-muted">
            {nextLesson
              ? `Continue with Day ${nextLesson.day} to make progress toward your course goal.`
              : "Review completed lessons or explore the lab workspace to keep practicing."}
          </p>
          <Link
            to={nextLesson ? `/lesson/${nextLesson.id}` : "/labs"}
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-fedora-accent-light transition-colors hover:text-fedora-text"
          >
            {nextLesson ? "Continue lesson" : "Open labs"}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
