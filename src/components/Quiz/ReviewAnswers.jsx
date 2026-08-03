import { CheckCircle2, XCircle } from "lucide-react";
import Button from "../Button/Button";
import {
  gradeQuestion,
  formatResponseForDisplay,
  formatCorrectAnswerForDisplay,
} from "../../services/quizService";

export default function ReviewAnswers({ questions, responses, onBack }) {
  return (
    <div>
      <h3 className="text-xl font-display text-fedora-text mb-4">
        Review Answers
      </h3>

      <div className="space-y-4 mb-6">
        {questions.map((question) => {
          const response = responses[question.id];
          const correct = gradeQuestion(question, response);

          return (
            <div
              key={question.id}
              className="bg-fedora-bg border border-fedora-border rounded-lg p-4"
            >
              <div className="flex items-start gap-3 mb-2">
                {correct ? (
                  <CheckCircle2
                    size={18}
                    className="text-green-400 shrink-0 mt-0.5"
                  />
                ) : (
                  <XCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
                )}
                <p className="text-fedora-text text-sm">{question.question}</p>
              </div>

              <p className="text-fedora-muted text-xs ml-7">
                Your answer: {formatResponseForDisplay(question, response)}
              </p>

              {!correct && (
                <p className="text-fedora-muted text-xs ml-7 mt-1">
                  Correct answer: {formatCorrectAnswerForDisplay(question)}
                </p>
              )}

              {question.explanation && (
                <p className="text-fedora-muted text-xs ml-7 mt-2">
                  {question.explanation}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <Button variant="secondary" onClick={onBack}>
        Back to Results
      </Button>
    </div>
  );
}
