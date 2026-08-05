import { BookOpen, CircleCheck, Flame, TerminalSquare } from "lucide-react";

function ActivityMetric({ icon: Icon, label, value, detail, accent = false }) {
  return (
    <div className="rounded-xl border border-fedora-border bg-fedora-bg/45 p-4 transition-colors hover:border-fedora-accent-light/70">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-fedora-muted">
            {label}
          </p>
          <p className="mt-1 text-2xl font-display font-semibold text-fedora-text">
            {value}
          </p>
        </div>
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${
            accent
              ? "bg-fedora-streak/15 text-fedora-streak"
              : "bg-fedora-accent/15 text-fedora-accent-light"
          }`}
        >
          <Icon size={18} aria-hidden="true" />
        </span>
      </div>
      <p className="mt-2 text-xs text-fedora-muted">{detail}</p>
    </div>
  );
}

export default function LearningActivity({
  completedLessons,
  completedLabs,
  quizzesCompleted,
  streak,
}) {
  const hasActivity =
    completedLessons > 0 || completedLabs > 0 || quizzesCompleted > 0;

  return (
    <section className="mb-8">
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-fedora-accent-light">
            Progress overview
          </p>
          <h2 className="mt-1 text-xl font-display text-fedora-text">
            Learning Activity
          </h2>
        </div>
        <p className="text-sm text-fedora-muted">
          Your completed work across FedoraQuest
        </p>
      </div>

      <div className="rounded-2xl border border-fedora-border bg-fedora-surface p-5 shadow-sm sm:p-6">
        {hasActivity ? (
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <ActivityMetric
              icon={BookOpen}
              label="Lessons"
              value={completedLessons}
              detail="completed lessons"
            />
            <ActivityMetric
              icon={TerminalSquare}
              label="Labs"
              value={completedLabs}
              detail="hands-on labs finished"
            />
            <ActivityMetric
              icon={CircleCheck}
              label="Quizzes"
              value={quizzesCompleted}
              detail="quizzes passed"
            />
            <ActivityMetric
              icon={Flame}
              label="Streak"
              value={`${streak} ${streak === 1 ? "day" : "days"}`}
              detail={streak > 0 ? "keep your momentum going" : "complete a lesson to start"}
              accent
            />
          </div>
        ) : (
          <div className="flex flex-col items-start gap-3 rounded-xl border border-dashed border-fedora-border bg-fedora-bg/35 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-display text-fedora-text">Your activity will appear here</h3>
              <p className="mt-1 text-sm text-fedora-muted">
                Complete a lesson, lab, or quiz to start building your learning record.
              </p>
            </div>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-fedora-accent/15 text-fedora-accent-light">
              <BookOpen size={20} aria-hidden="true" />
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
