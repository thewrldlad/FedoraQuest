// Dedicated quiz domain logic: the only file that touches Cloud
// Firestore for quiz attempt history, plus grading, XP calculation, and
// answer-formatting helpers shared by the quiz player and review screen
// (all pure, unchanged by the Firebase migration). Attempt history lives
// in a progress/{uid}/quizAttempts subcollection — kept separate from
// the summary quizResults map (owned by progressService, part of
// GameContext's single real-time listener) since history only ever
// grows and doesn't need to be part of that listener.
// questionsAnswered is a running-total field on the shared progress/{uid}
// document instead — see progressService.js.

import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  increment,
} from "firebase/firestore";
import { progressDocRef, updateProgress } from "./progressService";

const DIFFICULTY_MULTIPLIER = { beginner: 1, intermediate: 1.25, advanced: 1.5 };
const XP_PER_QUESTION = 10;
export const DEFAULT_PASSING_SCORE = 70;

function quizAttemptsRef(uid) {
  return collection(progressDocRef(uid), "quizAttempts");
}

export async function addQuizAttempt(uid, quizId, attempt) {
  await addDoc(quizAttemptsRef(uid), {
    quizId,
    ...attempt,
    recordedAt: serverTimestamp(),
  });
}

export async function getQuizHistory(uid, quizId) {
  const historyQuery = query(quizAttemptsRef(uid), where("quizId", "==", quizId));
  const snapshot = await getDocs(historyQuery);
  return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
}

export async function addQuestionsAnswered(uid, count) {
  await updateProgress(uid, { questionsAnswered: increment(count) });
}

// Grading is centralized here (not in the component tree) so ReviewAnswers
// and useQuiz always agree on what counts as correct.
export function gradeQuestion(question, response) {
  switch (question.type) {
    case "single":
    case "boolean":
    case "multiple": {
      const correct = [...question.correctAnswers].sort();
      const chosen = Array.isArray(response) ? [...response].sort() : [];
      return (
        correct.length === chosen.length &&
        correct.every((value, index) => value === chosen[index])
      );
    }
    case "fill-blank": {
      if (typeof response !== "string") return false;
      const normalized = response.trim().toLowerCase();
      return question.acceptedAnswers.some(
        (answer) => answer.trim().toLowerCase() === normalized
      );
    }
    case "ordering": {
      if (!Array.isArray(response)) return false;
      return (
        response.length === question.correctOrder.length &&
        response.every((value, index) => value === question.correctOrder[index])
      );
    }
    default:
      // Includes "matching" and any future type without a renderer yet —
      // never counted correct until it has a real grading rule.
      return false;
  }
}

export function hasValidResponse(question, response) {
  switch (question.type) {
    case "single":
    case "boolean":
    case "multiple":
      return Array.isArray(response) && response.length > 0;
    case "fill-blank":
      return typeof response === "string" && response.trim().length > 0;
    case "ordering":
      return Array.isArray(response) && response.length === question.items.length;
    default:
      return true;
  }
}

// XP based on difficulty, accuracy, and completion always; a speed bonus
// (up to +10%) only applies to timed quizzes finished with time to spare.
// No XP is awarded on a failed attempt.
export function calculateQuizXP({
  totalQuestions,
  correctCount,
  difficulty,
  timeLimitSeconds,
  timeTakenSeconds,
  passed,
}) {
  if (!passed) return 0;

  const multiplier = DIFFICULTY_MULTIPLIER[difficulty] || 1;
  const accuracyRatio = correctCount / totalQuestions;
  let xp = Math.round(totalQuestions * XP_PER_QUESTION * multiplier * accuracyRatio);

  if (timeLimitSeconds && timeTakenSeconds < timeLimitSeconds) {
    const speedRatio = 1 - timeTakenSeconds / timeLimitSeconds;
    xp += Math.round(xp * 0.1 * speedRatio);
  }

  return xp;
}

export function formatResponseForDisplay(question, response) {
  if (response === undefined || response === null) return "(no answer)";

  switch (question.type) {
    case "single":
    case "boolean":
    case "multiple":
      if (!Array.isArray(response) || response.length === 0) return "(no answer)";
      return response.map((index) => question.options[index]).join(", ");
    case "fill-blank":
      return response || "(no answer)";
    case "ordering":
      if (!Array.isArray(response) || response.length === 0) return "(no answer)";
      return response.map((index) => question.items[index]).join(" → ");
    default:
      return "(unsupported question type)";
  }
}

export function formatCorrectAnswerForDisplay(question) {
  switch (question.type) {
    case "single":
    case "boolean":
    case "multiple":
      return question.correctAnswers
        .map((index) => question.options[index])
        .join(", ");
    case "fill-blank":
      return question.acceptedAnswers.join(" / ");
    case "ordering":
      return question.correctOrder
        .map((index) => question.items[index])
        .join(" → ");
    default:
      return "N/A";
  }
}

// Used by achievement checks that need to look across every quiz that
// currently exists, not just the one just completed.
export function checkAllQuizzesPassed(quizResults, quizIds) {
  return quizIds.length > 0 && quizIds.every((id) => quizResults[id]?.passed);
}

export function getAverageQuizScore(quizResults, quizIds) {
  if (quizIds.length === 0) return 0;
  const total = quizIds.reduce(
    (sum, id) => sum + (quizResults[id]?.bestScore || 0),
    0
  );
  return total / quizIds.length;
}
