import useQuiz from "../../hooks/useQuiz";
import QuizProgress from "./QuizProgress";
import QuizTimer from "./QuizTimer";
import QuizQuestion from "./QuizQuestion";
import QuizNavigation from "./QuizNavigation";
import QuizResults from "./QuizResults";
import ReviewAnswers from "./ReviewAnswers";

export default function QuizPlayer({ quiz, quizId, onComplete }) {
  const player = useQuiz(quiz, quizId);

  if (player.stage === "results") {
    return (
      <QuizResults
        results={player.results}
        onRetry={player.retry}
        onReview={player.reviewAnswers}
        onContinue={() => onComplete(player.results)}
      />
    );
  }

  if (player.stage === "review") {
    return (
      <ReviewAnswers
        questions={player.questions}
        responses={player.responses}
        onBack={player.backToResults}
      />
    );
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <QuizProgress
            current={player.currentIndex + 1}
            total={player.totalQuestions}
            difficulty={quiz.difficulty}
          />
        </div>
        <QuizTimer secondsRemaining={player.timeRemaining} />
      </div>

      <QuizQuestion
        question={player.currentQuestion}
        response={player.responses[player.currentQuestion.id]}
        onChange={player.setResponse}
        showFeedback={player.showFeedback}
      />

      <QuizNavigation
        currentIndex={player.currentIndex}
        totalQuestions={player.totalQuestions}
        showFeedback={player.showFeedback}
        hasResponse={player.hasResponse}
        onSubmitAnswer={player.submitAnswer}
        onPrevious={player.goPrevious}
        onNext={player.goNext}
      />
    </div>
  );
}
