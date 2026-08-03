import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import useAuth from "../auth/useAuth";
import {
  getSettings,
  saveSettings,
  DEFAULT_SETTINGS,
} from "../services/settingsService";

// Context + Provider + hook live in one file, matching the pattern
// already used by context/GameContext.jsx in this project. Settings now
// live in Firestore (users/{uid}.settings) instead of localStorage, so
// they're loaded once the authenticated uid is known and applied to
// DEFAULT_SETTINGS in the meantime (e.g. on the pre-login screens) so
// theme/font-size/etc. still apply before anyone is signed in.
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
  const { user } = useAuth();
  const uid = user?.uid || null;

  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const lastLoadedRef = useRef(DEFAULT_SETTINGS);

  // Load this user's settings once their uid is known; reset to
  // defaults on logout so the next account doesn't briefly see the
  // previous one's settings while its own document loads.
  useEffect(() => {
    if (!uid) {
      lastLoadedRef.current = DEFAULT_SETTINGS;
      setSettings(DEFAULT_SETTINGS);
      return;
    }

    getSettings(uid).then((loaded) => {
      lastLoadedRef.current = loaded;
      setSettings(loaded);
    });
  }, [uid]);

  // Persist on every change — but not the write-back of the value that
  // was *just* loaded above, which would be a redundant no-op write.
  useEffect(() => {
    if (!uid || settings === lastLoadedRef.current) return;
    saveSettings(uid, settings);
  }, [uid, settings]);

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
