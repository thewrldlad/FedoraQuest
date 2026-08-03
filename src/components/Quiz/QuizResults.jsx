import Button from "../Button/Button";

export default function QuizResults({ results, onRetry, onReview, onContinue }) {
  const {
    correctCount,
    incorrectCount,
    percentage,
    passed,
    xpEarned,
    timeTakenSeconds,
  } = results;

  const minutes = Math.floor(timeTakenSeconds / 60);
  const seconds = timeTakenSeconds % 60;

  return (
    <div className="text-center">
      <p className="text-4xl mb-2">{passed ? "🎉" : "📚"}</p>
      <h3 className="text-2xl font-display text-fedora-text mb-1">
        {passed ? "Quiz Passed!" : "Quiz Not Passed"}
      </h3>
      <p
        className={`text-lg font-display mb-6 ${
          passed ? "text-green-400" : "text-red-400"
        }`}
      >
        {percentage}%
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 text-sm">
        <div>
          <p className="text-fedora-text text-xl font-display">{correctCount}</p>
          <p className="text-fedora-muted">Correct</p>
        </div>
        <div>
          <p className="text-fedora-text text-xl font-display">{incorrectCount}</p>
          <p className="text-fedora-muted">Incorrect</p>
        </div>
        <div>
          <p className="text-fedora-text text-xl font-display">
            {minutes}:{String(seconds).padStart(2, "0")}
          </p>
          <p className="text-fedora-muted">Time Taken</p>
        </div>
        <div>
          <p className="text-fedora-text text-xl font-display">{xpEarned}</p>
          <p className="text-fedora-muted">XP Earned</p>
        </div>
      </div>

      {!passed && (
        <p className="text-fedora-muted text-sm mb-6">
          You can retry as many times as you like — only your best score is kept.
        </p>
      )}

      <div className="flex flex-wrap justify-center gap-3">
        <Button variant="secondary" onClick={onRetry}>
          Retry Quiz
        </Button>
        <Button variant="secondary" onClick={onReview}>
          Review Answers
        </Button>
        {passed && <Button onClick={onContinue}>Continue Learning</Button>}
      </div>
    </div>
  );
}
