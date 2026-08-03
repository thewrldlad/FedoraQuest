export default function TrueFalse({ question, response, onChange, showFeedback }) {
  const selected = Array.isArray(response) ? response : [];

  return (
    <div className="grid grid-cols-2 gap-3">
      {question.options.map((option, index) => {
        const isSelected = selected.includes(index);
        const isAnswerCorrect = question.correctAnswers.includes(index);

        let stateClasses = "border-fedora-border hover:bg-fedora-border";
        if (showFeedback) {
          if (isAnswerCorrect) stateClasses = "border-green-400 bg-green-400/10";
          else if (isSelected) stateClasses = "border-red-400 bg-red-400/10";
        } else if (isSelected) {
          stateClasses = "border-fedora-accent bg-fedora-border";
        }

        return (
          <button
            key={option}
            type="button"
            onClick={() => !showFeedback && onChange([index])}
            disabled={showFeedback}
            className={`px-4 py-3 rounded-lg border text-center font-display transition-colors ${stateClasses}`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
