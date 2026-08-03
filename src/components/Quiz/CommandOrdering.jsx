import { X } from "lucide-react";

// Not in the originally suggested file list, but needed as the actual
// answer-mechanism component for "Command Ordering" questions — click to
// build the sequence rather than drag-and-drop, avoiding a new dependency.
export default function CommandOrdering({ question, response, onChange, showFeedback }) {
  const order = Array.isArray(response) ? response : [];
  const remaining = question.items
    .map((_, index) => index)
    .filter((index) => !order.includes(index));

  const addToOrder = (index) => {
    if (showFeedback) return;
    onChange([...order, index]);
  };

  const removeFromOrder = (position) => {
    if (showFeedback) return;
    onChange(order.filter((_, i) => i !== position));
  };

  return (
    <div>
      <p className="text-fedora-muted text-xs mb-2">
        Click the commands below in the correct order.
      </p>

      <div className="space-y-2 mb-4 min-h-12">
        {order.map((itemIndex, position) => {
          const isCorrectPosition =
            showFeedback && question.correctOrder[position] === itemIndex;

          return (
            <div
              key={position}
              className={`flex items-center justify-between gap-3 px-3 py-2 rounded-lg border font-mono text-sm text-fedora-text ${
                showFeedback
                  ? isCorrectPosition
                    ? "border-green-400 bg-green-400/10"
                    : "border-red-400 bg-red-400/10"
                  : "border-fedora-accent bg-fedora-border"
              }`}
            >
              <span>
                {position + 1}. {question.items[itemIndex]}
              </span>
              {!showFeedback && (
                <button
                  type="button"
                  onClick={() => removeFromOrder(position)}
                  aria-label="Remove"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {!showFeedback && (
        <div className="flex flex-wrap gap-2">
          {remaining.map((index) => (
            <button
              key={index}
              type="button"
              onClick={() => addToOrder(index)}
              className="px-3 py-2 rounded-lg border border-fedora-border hover:bg-fedora-border font-mono text-sm text-fedora-text"
            >
              {question.items[index]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
