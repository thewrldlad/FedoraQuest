import ProgressBar from "../Progress/ProgressBar";

export default function QuizProgress({ current, total, difficulty }) {
  const percent = Math.round((current / total) * 100);

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-fedora-muted">
          Question {current} of {total}
        </span>
        {difficulty && (
          <span className="text-xs px-2 py-1 rounded-md bg-fedora-border text-fedora-accent-light capitalize">
            {difficulty}
          </span>
        )}
      </div>
      <ProgressBar percent={percent} />
    </div>
  );
}
