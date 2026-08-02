import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import lessons from "../data/lessons";
import quizzes from "../data/quizzes";
import Quiz from "../components/Quiz/Quiz";
import Button from "../components/Button/Button";
import { useGame } from "../context/GameContext";

export default function Lesson() {
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    addXP,
    completedLessons,
    setCompletedLessons,
    setUnlockedLessons,
    quizResults,
    recordQuizResult,
  } = useGame();

  const [quizActive, setQuizActive] = useState(false);
  const [quizKey, setQuizKey] = useState(0);

const lesson = lessons.find(
  (lesson) => lesson.id === Number(id)
);

if (!lesson) {
  return (
    <div>
      <h1 className="text-3xl text-fedora-text">
        Lesson not found
      </h1>
    </div>
  );
}
const isCompleted = completedLessons.includes(lesson.id);

const quiz = quizzes[lesson.id];
const quizResult = quizResults[lesson.id];

const completeLesson = () => {
  if (completedLessons.includes(lesson.id)) return;

  addXP(100);
  setCompletedLessons((current) => {
    if (current.includes(lesson.id)) return current;
    return [...current, lesson.id];
  });

  setUnlockedLessons((current) => {
    const nextLessonId = lesson.id + 1;

    if (!lessons.find((l) => l.id === nextLessonId)) {
      return current;
    }

    if (current.includes(nextLessonId)) {
      return current;
    }

    return [...current, nextLessonId];
  });

  navigate("/");
};

const startQuiz = () => {
  setQuizKey((current) => current + 1);
  setQuizActive(true);
};

const handleQuizComplete = (score, passed) => {
  recordQuizResult(lesson.id, score, passed);
  setQuizActive(false);

  if (passed) {
    completeLesson();
  }
};

 return (
    <div>
      <h1 className="text-3xl font-display text-fedora-text mb-4">
        {lesson.title}
      </h1>

      <div className="bg-fedora-surface border border-fedora-border rounded-xl p-6">
        <h2 className="text-xl font-display text-fedora-text mb-4">
          Introduction
        </h2>

        <p className="text-fedora-text leading-8">
           {lesson.description}
        </p>

        {quiz ? (
          <div className="mt-8">
            {quizActive ? (
              <Quiz
                key={quizKey}
                questions={quiz.questions}
                passingScore={quiz.passingScore}
                onComplete={handleQuizComplete}
              />
            ) : (
              <>
                {quizResult && (
                  <p className="text-fedora-muted mb-3">
                    Best score: {quizResult.bestScore}%
                    {quizResult.passed ? " — Passed" : ""}
                  </p>
                )}

                <div className="flex items-center gap-3">
                  {isCompleted && (
                    <Button disabled variant="success">
                      ✓ Lesson Completed
                    </Button>
                  )}

                  <Button
                    variant={isCompleted ? "secondary" : "primary"}
                    onClick={startQuiz}
                  >
                    {quizResult ? "Retake Quiz" : "Start Quiz"}
                  </Button>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="mt-8">
            <Button
              disabled={isCompleted}
              onClick={completeLesson}
              variant={isCompleted ? "success" : "primary"}
            >
              {isCompleted
                ? "✓ Lesson Completed"
                : "Mark Lesson Complete"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
