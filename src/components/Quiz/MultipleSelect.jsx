import { Check } from "lucide-react";

export default function MultipleSelect({ question, response, onChange, showFeedback }) {
  const selected = Array.isArray(response) ? response : [];

  const toggle = (index) => {
    if (showFeedback) return;
    const next = selected.includes(index)
      ? selected.filter((i) => i !== index)
      : [...selected, index];
    onChange(next);
  };

  return (
    <div className="space-y-2">
      <p className="text-fedora-muted text-xs mb-1">Select all that apply</p>
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
            onClick={() => toggle(index)}
            disabled={showFeedback}
            className={`w-full flex items-center gap-3 text-left px-4 py-3 rounded-lg border transition-colors ${stateClasses}`}
          >
            <span
              className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                isSelected
                  ? "bg-fedora-accent border-fedora-accent"
                  : "border-fedora-muted"
              }`}
            >
              {isSelected && <Check size={12} className="text-white" />}
            </span>
            {option}
          </button>
        );
      })}
    </div>
  );
}
