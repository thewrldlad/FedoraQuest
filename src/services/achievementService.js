// Owns writes to the achievement-tracking fields on the shared
// progress/{uid} document (unlock dates, commands executed, unique
// commands used). Reads come for free through GameContext's existing
// real-time subscription to that same document (see progressService.js
// and GameContext.jsx) — no separate Firestore read happens here, which
// is why this file only exports write operations plus the one pure
// helper (getAchievementProgress) that needs no storage at all.

import { updateDoc, increment, arrayUnion } from "firebase/firestore";
import { progressDocRef } from "./progressService";

export async function recordUnlockDate(uid, id) {
  await updateDoc(progressDocRef(uid), {
    [`achievementUnlockDates.${id}`]: new Date().toISOString(),
  });
}

export async function incrementCommandsExecuted(uid) {
  await updateDoc(progressDocRef(uid), { commandsExecuted: increment(1) });
}

export async function recordCommandUsed(uid, commandName) {
  await updateDoc(progressDocRef(uid), {
    uniqueCommandsUsed: arrayUnion(commandName),
  });
}

// Pure helper — given an achievement's optional progressKey/progressTarget
// and a stats object, returns { current, target } or null if the
// achievement isn't a progress-trackable one. Unchanged by the Firebase
// migration; no storage involved.
export function getAchievementProgress(achievement, stats) {
  if (!achievement.progressKey || achievement.progressTarget === undefined) {
    return null;
  }

  const current = Math.min(
    stats[achievement.progressKey] || 0,
    achievement.progressTarget
  );
  return { current, target: achievement.progressTarget };
}
