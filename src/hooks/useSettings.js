import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  getSettings,
  saveSettings,
  DEFAULT_SETTINGS,
} from "../services/settingsService";

// Context + Provider + hook live in one file, matching the pattern
// already used by context/GameContext.jsx in this project.
const SettingsContext = createContext(null);

const FONT_SIZE_PX = { small: "14px", medium: "16px", large: "18px" };

function applyTheme(theme) {
  const root = document.documentElement;

  if (theme === "system") {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    root.dataset.theme = prefersDark ? "dark" : "light";
  } else {
    root.dataset.theme = theme;
  }
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => getSettings());

  // Persist on every change.
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  // Apply theme immediately, and keep "system" in sync with OS changes.
  useEffect(() => {
    applyTheme(settings.appearance.theme);

    if (settings.appearance.theme !== "system") return undefined;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => applyTheme("system");
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, [settings.appearance.theme]);

  // Apply font size by scaling the root font-size (most Tailwind text
  // utilities are rem-based, so this scales proportionally app-wide).
  useEffect(() => {
    document.documentElement.style.fontSize =
      FONT_SIZE_PX[settings.accessibility.fontSize] || FONT_SIZE_PX.medium;
  }, [settings.accessibility.fontSize]);

  // Apply reduced motion via a data attribute + global CSS override.
  useEffect(() => {
    document.documentElement.dataset.reducedMotion = String(
      settings.accessibility.reducedMotion
    );
  }, [settings.accessibility.reducedMotion]);

  const updateSection = useCallback((section, updates) => {
    setSettings((current) => ({
      ...current,
      [section]: { ...current[section], ...updates },
    }));
  }, []);

  const resetSection = useCallback((section) => {
    setSettings((current) => ({
      ...current,
      [section]: DEFAULT_SETTINGS[section],
    }));
  }, []);

  const resetAll = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  return (
    <SettingsContext.Provider
      value={{ settings, updateSection, resetSection, resetAll }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export default function useSettings() {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }

  return context;
}
