import { useState, useEffect, useRef, useMemo } from "react";
import { useGame } from "../context/GameContext";
import * as quizService from "../services/quizService";

// Drives a single quiz-taking session: question navigation, per-question
// submitted/feedback state, an optional countdown timer, grading, XP, and
// the transition through question -> results -> (optional) review.
export default function useQuiz(quiz, quizId) {
  const { achievements, unlockAchievement } = useGame();

  const [stage, setStage] = useState("question"); // "question" | "results" | "review"
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [submittedIds, setSubmittedIds] = useState([]);
  const [startTime] = useState(() => Date.now());
  const [timeTakenSeconds, setTimeTakenSeconds] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(
    quiz.timeLimitSeconds ?? null
  );
  const hasPersistedRef = useRef(false);

  const questions = quiz.questions;
  const currentQuestion = questions[currentIndex];
  const passingScore = quiz.passingScore ?? quizService.DEFAULT_PASSING_SCORE;
  const showFeedback = submittedIds.includes(currentQuestion.id);
  const hasResponse = quizService.hasValidResponse(
    currentQuestion,
    responses[currentQuestion.id]
  );

  const finishQuiz = () => {
    const elapsedSeconds = Math.round((Date.now() - startTime) / 1000);
    setTimeTakenSeconds(elapsedSeconds);
    setStage("results");
  };

  // Countdown timer — only runs for timed quizzes, only while answering.
  useEffect(() => {
    if (!quiz.timeLimitSeconds || stage !== "question") return undefined;

    const interval = setInterval(() => {
      setTimeRemaining((current) => {
        if (current === null || current <= 1) {
          clearInterval(interval);
          finishQuiz();
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  const setResponse = (value) => {
    setResponses((current) => ({ ...current, [currentQuestion.id]: value }));
  };

  const submitAnswer = () => {
    setSubmittedIds((current) =>
      current.includes(currentQuestion.id)
        ? current
        : [...current, currentQuestion.id]
    );
  };

  const goNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((index) => index + 1);
    } else {
      finishQuiz();
    }
  };

  const goPrevious = () => {
    if (currentIndex > 0) setCurrentIndex((index) => index - 1);
  };

  const results = useMemo(() => {
    if (stage === "question") return null;

    const correctCount = questions.filter((question) =>
      quizService.gradeQuestion(question, responses[question.id])
    ).length;
    const totalQuestions = questions.length;
    const percentage = Math.round((correctCount / totalQuestions) * 100);
    const passed = percentage >= passingScore;

    const xpEarned = quizService.calculateQuizXP({
      totalQuestions,
      correctCount,
      difficulty: quiz.difficulty,
      timeLimitSeconds: quiz.timeLimitSeconds,
      timeTakenSeconds,
      passed,
    });

    return {
      correctCount,
      incorrectCount: totalQuestions - correctCount,
      totalQuestions,
      percentage,
      passed,
      xpEarned,
      timeTakenSeconds,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, responses, timeTakenSeconds]);

  // Persist the attempt + cumulative questions-answered count exactly
  // once per completed attempt (not on every results<->review toggle).
  useEffect(() => {
    if (stage === "results" && results && !hasPersistedRef.current) {
      quizService.addQuizAttempt(quizId, {
        score: results.percentage,
        passed: results.passed,
        xpEarned: results.xpEarned,
        timeTakenSeconds: results.timeTakenSeconds,
        timestamp: new Date().toISOString(),
      });

      const totalAnswered = quizService.addQuestionsAnswered(
        results.totalQuestions
      );
      hasPersistedRef.current = true;

      if (totalAnswered >= 100 && !achievements.includes("hundred_questions")) {
        unlockAchievement("hundred_questions");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, results]);

  const retry = () => {
    hasPersistedRef.current = false;
    setStage("question");
    setCurrentIndex(0);
    setResponses({});
    setSubmittedIds([]);
    setTimeTakenSeconds(0);
    setTimeRemaining(quiz.timeLimitSeconds ?? null);
  };

  const reviewAnswers = () => setStage("review");
  const backToResults = () => setStage("results");

  return {
    stage,
    currentQuestion,
    currentIndex,
    totalQuestions: questions.length,
    responses,
    showFeedback,
    hasResponse,
    timeRemaining,
    results,
    questions,
    setResponse,
    submitAnswer,
    goNext,
    goPrevious,
    retry,
    reviewAnswers,
    backToResults,
  };
}
