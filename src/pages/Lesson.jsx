import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import lessons from "../data/lessons";
import quizzes from "../data/quizzes";
import lessonContent from "../data/lessonContent";
import Quiz from "../components/Quiz/Quiz";
import Button from "../components/Button/Button";
import { useGame } from "../context/GameContext";
import useCourseProgress from "../hooks/useCourseProgress";

export default function Lesson() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { completedLessons, quizResults, recordQuizResult } = useGame();
  const { markLessonComplete, markLessonOpened } = useCourseProgress();

  const [quizActive, setQuizActive] = useState(false);
  const [quizKey, setQuizKey] = useState(0);

const lesson = lessons.find(
  (lesson) => lesson.id === Number(id)
);

useEffect(() => {
  if (lesson) {
    markLessonOpened(lesson.id);
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [lesson?.id]);

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
const content = lessonContent[lesson.id];

const completeLesson = () => {
  markLessonComplete(lesson.id);
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

const actionArea = quiz ? (
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
      {isCompleted ? "✓ Lesson Completed" : "Mark Lesson Complete"}
    </Button>
  </div>
);

 return (
    <div>
      <h1 className="text-3xl font-display text-fedora-text mb-4">
        {lesson.title}
      </h1>

      {content ? (
        <div className="space-y-6">
          <div className="bg-fedora-surface border border-fedora-border rounded-xl p-6">
            <p className="text-sm text-fedora-muted mb-6">
              Estimated time: {content.estimatedTime}
            </p>

            <h2 className="text-xl font-display text-fedora-text mb-3">
              Learning Objectives
            </h2>
            <ul className="list-disc list-inside space-y-1 text-fedora-text mb-6">
              {content.objectives.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <h2 className="text-xl font-display text-fedora-text mb-3">
              Introduction
            </h2>
            <p className="text-fedora-text leading-7 mb-6">
              {content.introduction}
            </p>

            <h2 className="text-xl font-display text-fedora-text mb-3">
              Core Concepts
            </h2>
            <p className="text-fedora-text leading-7 mb-6 whitespace-pre-line">
              {content.coreConcepts}
            </p>

            <h2 className="text-xl font-display text-fedora-text mb-3">
              Command Syntax
            </h2>
            <div className="space-y-2 mb-6">
              {content.commandSyntax.map((syntax) => (
                <code
                  key={syntax}
                  className="block bg-fedora-bg border border-fedora-border rounded-lg px-3 py-2 text-fedora-accent-light text-sm"
                >
                  {syntax}
                </code>
              ))}
            </div>

            <h2 className="text-xl font-display text-fedora-text mb-3">
              Command Breakdown
            </h2>
            <div className="space-y-4 mb-6">
              {content.commandBreakdown.map((entry) => (
                <div key={entry.command}>
                  <p className="font-display text-fedora-text mb-1">
                    {entry.command}
                  </p>
                  <ul className="space-y-1 text-sm">
                    {entry.options.map((opt) => (
                      <li key={opt.flag} className="text-fedora-muted">
                        <span className="text-fedora-accent-light">
                          {opt.flag}
                        </span>{" "}
                        — {opt.effect}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <h2 className="text-xl font-display text-fedora-text mb-3">
              Practical Examples
            </h2>
            <pre className="bg-fedora-bg border border-fedora-border rounded-lg px-4 py-3 text-fedora-text text-sm mb-6 overflow-x-auto whitespace-pre-wrap">
              {content.practicalExamples}
            </pre>

            <h2 className="text-xl font-display text-fedora-text mb-3">
              Fedora-specific Notes
            </h2>
            <ul className="list-disc list-inside space-y-1 text-fedora-text mb-6">
              {content.fedoraNotes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <h2 className="text-xl font-display text-fedora-text mb-3">
              Real-world Scenarios
            </h2>
            <ul className="list-disc list-inside space-y-1 text-fedora-text mb-6">
              {content.realWorldScenarios.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <h2 className="text-xl font-display text-fedora-text mb-3">
              Common Mistakes
            </h2>
            <ul className="list-disc list-inside space-y-1 text-fedora-muted mb-6">
              {content.commonMistakes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <h2 className="text-xl font-display text-fedora-text mb-3">
              Best Practices
            </h2>
            <ul className="list-disc list-inside space-y-1 text-fedora-text mb-6">
              {content.bestPractices.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <h2 className="text-xl font-display text-fedora-text mb-3">
              Hands-on Lab
            </h2>
            <ol className="list-decimal list-inside space-y-1 text-fedora-text mb-2">
              {content.handsOnLab.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <p className="text-fedora-muted text-sm mb-6">
              Goal: {content.handsOnLab.goal}
            </p>

            <h2 className="text-xl font-display text-fedora-text mb-3">
              Challenge Exercise
            </h2>
            <p className="text-fedora-text leading-7 mb-6">
              {content.challengeExercise}
            </p>

            <h2 className="text-xl font-display text-fedora-text mb-3">
              XP Reward
            </h2>
            <p className="text-fedora-text mb-6">{lesson.xp} XP</p>

            <h2 className="text-xl font-display text-fedora-text mb-3">
              Lesson Summary
            </h2>
            <p className="text-fedora-text leading-7 mb-6">
              {content.summary}
            </p>

            <h2 className="text-xl font-display text-fedora-text mb-3">
              Further Reading
            </h2>
            <ul className="space-y-1 text-sm text-fedora-muted">
              {content.furtherReading.map((ref) => (
                <li key={ref.title}>
                  <span className="text-fedora-accent-light">
                    {ref.title}
                  </span>{" "}
                  — {ref.detail}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-fedora-surface border border-fedora-border rounded-xl p-6">
            <h2 className="text-xl font-display text-fedora-text mb-4">
              Mini Quiz
            </h2>
            {actionArea}
          </div>
        </div>
      ) : (
        <div className="bg-fedora-surface border border-fedora-border rounded-xl p-6">
          <h2 className="text-xl font-display text-fedora-text mb-4">
            Introduction
          </h2>

          <p className="text-fedora-text leading-8">
             {lesson.description}
          </p>

          {actionArea}
        </div>
      )}
    </div>
  );
}
