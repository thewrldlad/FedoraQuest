import { Globe } from "lucide-react";
import Button from "../Button/Button";
import SettingsCard from "./SettingsCard";

const LANGUAGES = [{ value: "en", label: "English" }];

const TIME_ZONES = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Berlin",
  "Asia/Tokyo",
  "Australia/Sydney",
];

const DATE_FORMATS = [
  { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
  { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
  { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
];

const SELECT_CLASSES =
  "w-full bg-fedora-bg border border-fedora-border rounded-lg px-3 py-2 text-fedora-text focus:outline-none focus:border-fedora-accent";

export default function LanguageSettings({
  settings,
  updateSection,
  resetSection,
}) {
  const { language } = settings;

  return (
    <SettingsCard
      icon={Globe}
      title="Language & Region"
      description="English is the only translated language today — other selections are saved for when localization is added."
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div>
          <label
            className="block text-sm text-fedora-muted mb-1"
            htmlFor="language"
          >
            Language
          </label>
          <select
            id="language"
            value={language.language}
            onChange={(event) =>
              updateSection("language", { language: event.target.value })
            }
            className={SELECT_CLASSES}
          >
            {LANGUAGES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            className="block text-sm text-fedora-muted mb-1"
            htmlFor="timeZone"
          >
            Time Zone
          </label>
          <select
            id="timeZone"
            value={language.timeZone}
            onChange={(event) =>
              updateSection("language", { timeZone: event.target.value })
            }
            className={SELECT_CLASSES}
          >
            {TIME_ZONES.map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            className="block text-sm text-fedora-muted mb-1"
            htmlFor="dateFormat"
          >
            Date Format
          </label>
          <select
            id="dateFormat"
            value={language.dateFormat}
            onChange={(event) =>
              updateSection("language", { dateFormat: event.target.value })
            }
            className={SELECT_CLASSES}
          >
            {DATE_FORMATS.map((format) => (
              <option key={format.value} value={format.value}>
                {format.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Button
        variant="secondary"
        size="sm"
        onClick={() => resetSection("language")}
      >
        Reset to Default
      </Button>
    </SettingsCard>
  );
}
