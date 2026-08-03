import Button from "../Button/Button";

export default function QuizNavigation({
  currentIndex,
  totalQuestions,
  showFeedback,
  hasResponse,
  onSubmitAnswer,
  onPrevious,
  onNext,
}) {
  const isLastQuestion = currentIndex === totalQuestions - 1;

  return (
    <div className="flex items-center justify-between mt-6">
      <Button
        type="button"
        variant="secondary"
        onClick={onPrevious}
        disabled={currentIndex === 0}
      >
        Previous
      </Button>

      {showFeedback ? (
        <Button type="button" onClick={onNext}>
          {isLastQuestion ? "Submit Quiz" : "Next Question"}
        </Button>
      ) : (
        <Button type="button" onClick={onSubmitAnswer} disabled={!hasResponse}>
          Submit Answer
        </Button>
      )}
    </div>
  );
}
