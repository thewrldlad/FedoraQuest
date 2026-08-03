// The only file that touches localStorage for settings data. To connect
// this to a real backend later, replace the internals of these two
// functions (e.g. fetch/save against an API) — useSettings.js and every
// component that calls it stay unchanged.

const SETTINGS_KEY = "fedoraquest_settings";

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

export function getSettings() {
  const saved = localStorage.getItem(SETTINGS_KEY);
  if (!saved) return DEFAULT_SETTINGS;

  try {
    const parsed = JSON.parse(saved);

    // Shallow-merge each section so new fields added later (or a
    // corrupted/partial save) fall back to sane defaults instead of
    // leaving a section undefined.
    return {
      appearance: { ...DEFAULT_SETTINGS.appearance, ...parsed.appearance },
      notifications: {
        ...DEFAULT_SETTINGS.notifications,
        ...parsed.notifications,
      },
      privacy: { ...DEFAULT_SETTINGS.privacy, ...parsed.privacy },
      language: { ...DEFAULT_SETTINGS.language, ...parsed.language },
      accessibility: {
        ...DEFAULT_SETTINGS.accessibility,
        ...parsed.accessibility,
      },
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
