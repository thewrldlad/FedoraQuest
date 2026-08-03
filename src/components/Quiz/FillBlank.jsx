export default function FillBlank({ question, response, onChange, showFeedback }) {
  const value = typeof response === "string" ? response : "";
  const isCorrect = showFeedback
    ? question.acceptedAnswers.some(
        (answer) => answer.trim().toLowerCase() === value.trim().toLowerCase()
      )
    : null;

  return (
    <div>
      <input
        type="text"
        value={value}
        onChange={(event) => !showFeedback && onChange(event.target.value)}
        disabled={showFeedback}
        placeholder="Type your answer..."
        className={`w-full bg-fedora-bg border rounded-lg px-3 py-2 text-fedora-text focus:outline-none ${
          showFeedback
            ? isCorrect
              ? "border-green-400"
              : "border-red-400"
            : "border-fedora-border focus:border-fedora-accent"
        }`}
      />

      {showFeedback && !isCorrect && (
        <p className="text-fedora-muted text-xs mt-2">
          Accepted answer(s): {question.acceptedAnswers.join(", ")}
        </p>
      )}
    </div>
  );
}
