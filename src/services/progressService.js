// The only file that owns the lifecycle of the progress/{uid} Firestore
// document — the single source of truth for gameplay state (XP, streak,
// lesson/lab completion, quiz results, unlocked achievement ids, and the
// extras this feature already owned: last opened lesson, longest
// streak). Consolidated into ONE document per user (instead of one
// Firestore doc per old localStorage key) so GameContext needs only a
// single real-time listener rather than five-plus — see PHASE 15 (avoid
// unnecessary reads, optimized listeners) in the migration brief.
//
// achievementService.js and quizService.js also write specific fields
// onto this same document (achievementUnlockDates, commandsExecuted,
// uniqueCommandsUsed, questionsAnswered) rather than owning separate
// documents — GameContext's one listener here picks up their writes too,
// for free, with no extra reads.

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

const PROGRESS_COLLECTION = "progress";

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export const DEFAULT_PROGRESS = {
  xp: 0,
  completedLessons: [],
  unlockedLessons: [1],
  completedLabs: [],
  unlockedLabs: [1],
  quizResults: {},
  achievements: [],
  streak: 0,
  lastStudyDate: null,
  firstSeenDate: null,
  lastOpenedLessonId: null,
  longestStreak: 0,
  achievementUnlockDates: {},
  commandsExecuted: 0,
  uniqueCommandsUsed: [],
  questionsAnswered: 0,
};

export function progressDocRef(uid) {
  return doc(db, PROGRESS_COLLECTION, uid);
}

// Called once, by authService.register(), right after the profile
// document is created — every account starts from Day 1.
export async function createProgressDocument(uid) {
  const document = {
    ...DEFAULT_PROGRESS,
    firstSeenDate: formatDate(new Date()),
  };
  await setDoc(progressDocRef(uid), document);
  return document;
}

export async function getProgress(uid) {
  const snapshot = await getDoc(progressDocRef(uid));
  return snapshot.exists() ? snapshot.data() : null;
}

// Real-time subscription — GameContext stays in sync automatically
// (including across tabs/devices) instead of only updating after its
// own local writes resolve.
export function subscribeToProgress(uid, callback) {
  return onSnapshot(progressDocRef(uid), (snapshot) => {
    callback(snapshot.exists() ? snapshot.data() : null);
  });
}

export async function updateProgress(uid, updates) {
  await updateDoc(progressDocRef(uid), updates);
}

export async function resetProgressExtras(uid) {
  await updateDoc(progressDocRef(uid), {
    completedLessons: [],
    unlockedLessons: [1],
    lastOpenedLessonId: null,
    longestStreak: 0,
  });
}
