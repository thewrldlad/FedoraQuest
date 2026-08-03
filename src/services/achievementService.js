// Owns the achievement-related data that GameContext doesn't already own:
// unlock timestamps, cumulative commands executed, and unique commands
// used. Achievement unlock/lock state itself stays in GameContext's
// `achievements` array (already persisted there) — not duplicated here.
// To connect this to Firebase/Supabase later, replace the internals of
// these functions; useAchievements.js and every component that calls it
// stay unchanged.

const UNLOCK_DATES_KEY = "fedoraquest_achievementUnlockDates";
const COMMANDS_EXECUTED_KEY = "fedoraquest_commandsExecuted";
const UNIQUE_COMMANDS_KEY = "fedoraquest_uniqueCommandsUsed";

export function getUnlockDates() {
  const saved = localStorage.getItem(UNLOCK_DATES_KEY);
  return saved ? JSON.parse(saved) : {};
}

export function recordUnlockDate(id) {
  const dates = getUnlockDates();
  if (dates[id]) return dates;

  const updated = { ...dates, [id]: new Date().toISOString() };
  localStorage.setItem(UNLOCK_DATES_KEY, JSON.stringify(updated));
  return updated;
}

export function getCommandsExecuted() {
  const saved = localStorage.getItem(COMMANDS_EXECUTED_KEY);
  return saved ? Number(saved) : 0;
}

export function incrementCommandsExecuted() {
  const total = getCommandsExecuted() + 1;
  localStorage.setItem(COMMANDS_EXECUTED_KEY, String(total));
  return total;
}

export function getUniqueCommandsUsed() {
  const saved = localStorage.getItem(UNIQUE_COMMANDS_KEY);
  return saved ? JSON.parse(saved) : [];
}

export function recordCommandUsed(commandName) {
  const used = getUniqueCommandsUsed();
  if (used.includes(commandName)) return used;

  const updated = [...used, commandName];
  localStorage.setItem(UNIQUE_COMMANDS_KEY, JSON.stringify(updated));
  return updated;
}

// Pure helper — given an achievement's optional progressKey/progressTarget
// and a stats object, returns { current, target } or null if the
// achievement isn't a progress-trackable one.
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

export function resetAchievementExtras() {
  localStorage.removeItem(UNLOCK_DATES_KEY);
  localStorage.removeItem(COMMANDS_EXECUTED_KEY);
  localStorage.removeItem(UNIQUE_COMMANDS_KEY);
}
