// Personal (per-user) settings live in the `settings` field of the same
// users/{uid} Firestore document profileService.js owns — this is the
// literal field PHASE 3 of the migration brief calls for. This file
// stays the only place that reads/writes that field, delegating the
// actual Firestore call to profileService so there's still exactly one
// file touching the users/{uid} document.

import * as profileService from "./profileService";

export const DEFAULT_SETTINGS = {
  appearance: {
    theme: "dark", // "dark" | "light" | "system"
  },
  notifications: {
    courseUpdates: true,
    achievementNotifications: true,
    reminders: true,
    email: false,
  },
  privacy: {
    profileVisibility: "private", // "private" | "public"
    showProgressPublicly: false,
    showAchievementsPublicly: false,
  },
  language: {
    language: "en",
    timeZone: "UTC",
    dateFormat: "YYYY-MM-DD",
  },
  accessibility: {
    fontSize: "medium", // "small" | "medium" | "large"
    reducedMotion: false,
    highContrast: false,
  },
};

// Shallow-merges each section so new fields added later (or a
// partially-saved document) fall back to sane defaults instead of
// leaving a section undefined.
function withDefaults(saved) {
  if (!saved) return DEFAULT_SETTINGS;

  return {
    appearance: { ...DEFAULT_SETTINGS.appearance, ...saved.appearance },
    notifications: { ...DEFAULT_SETTINGS.notifications, ...saved.notifications },
    privacy: { ...DEFAULT_SETTINGS.privacy, ...saved.privacy },
    language: { ...DEFAULT_SETTINGS.language, ...saved.language },
    accessibility: { ...DEFAULT_SETTINGS.accessibility, ...saved.accessibility },
  };
}

export async function getSettings(uid) {
  const profile = await profileService.getProfile(uid);
  return withDefaults(profile?.settings);
}

export async function saveSettings(uid, settings) {
  await profileService.updateProfile(uid, { settings });
}
