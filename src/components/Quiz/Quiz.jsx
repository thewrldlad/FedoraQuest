import { useState } from "react";
import Button from "../Button/Button";

export default function Quiz({ questions, passingScore, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const currentQuestion = questions[currentIndex];
  const isMultiple = currentQuestion.type === "multiple";

  const toggleOption = (optionIndex) => {
    if (showFeedback) return;

    if (isMultiple) {
      setSelected((current) =>
        current.includes(optionIndex)
          ? current.filter((index) => index !== optionIndex)
          : [...current, optionIndex]
      );
    } else {
      setSelected([optionIndex]);
    }
  };

  const isCorrect = (() => {
    const correct = [...currentQuestion.correctAnswers].sort();
    const chosen = [...selected].sort();

    return (
      correct.length === chosen.length &&
      correct.every((value, index) => value === chosen[index])
    );
  })();

  const handleSubmitAnswer = () => {
    if (selected.length === 0) return;

    if (isCorrect) {
      setScore((current) => current + 1);
    }

    setShowFeedback(true);
  };

  const handleNext = () => {
    const isLastQuestion = currentIndex === questions.length - 1;

    if (isLastQuestion) {
      setFinished(true);
    } else {
      setCurrentIndex((current) => current + 1);
      setSelected([]);
      setShowFeedback(false);
    }
  };

  if (finished) {
    const percentage = Math.round((score / questions.length) * 100);
    const passed = percentage >= passingScore;

    return (
      <div>
        <h3 className="text-xl font-display text-fedora-text mb-2">
          Quiz Results
        </h3>

        <p className="text-fedora-text">
          You scored {score} / {questions.length} ({percentage}%)
        </p>

        <p
          className={`mt-2 font-medium ${
            passed ? "text-green-400" : "text-red-400"
          }`}
        >
          {passed
            ? `✅ Passed! (${passingScore}% required)`
            : `❌ Not passed (${passingScore}% required)`}
        </p>

        <Button className="mt-5" onClick={() => onComplete(percentage, passed)}>
          Continue
        </Button>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm uppercase tracking-wider text-fedora-muted mb-2">
        Question {currentIndex + 1} of {questions.length}
      </p>

      <h3 className="text-xl font-display text-fedora-text mb-4">
        {currentQuestion.question}
      </h3>

      <div className="space-y-2">
        {currentQuestion.options.map((option, index) => {
          const isSelected = selected.includes(index);
          const isAnswerCorrect =
            currentQuestion.correctAnswers.includes(index);

          let stateClasses = "border-fedora-border hover:bg-fedora-border";

          if (showFeedback) {
            if (isAnswerCorrect) {
              stateClasses = "border-green-400 bg-green-400/10";
            } else if (isSelected && !isAnswerCorrect) {
              stateClasses = "border-red-400 bg-red-400/10";
            }
          } else if (isSelected) {
            stateClasses = "border-fedora-accent bg-fedora-border";
          }

          return (
            <button
              key={option}
              onClick={() => toggleOption(index)}
              disabled={showFeedback}
              className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${stateClasses}`}
            >
              {option}
            </button>
          );
        })}
      </div>

      {showFeedback && (
        <p
          className={`mt-4 font-medium ${
            isCorrect ? "text-green-400" : "text-red-400"
          }`}
        >
          {isCorrect ? "✅ Correct!" : "❌ Incorrect."}
        </p>
      )}

      <div className="mt-5">
        {showFeedback ? (
          <Button onClick={handleNext}>
            {currentIndex === questions.length - 1
              ? "See Results"
              : "Next Question"}
          </Button>
        ) : (
          <Button
            onClick={handleSubmitAnswer}
            disabled={selected.length === 0}
          >
            Submit Answer
          </Button>
        )}
      </div>
    </div>
  );
}
