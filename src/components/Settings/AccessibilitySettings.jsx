import { Eye } from "lucide-react";
import Button from "../Button/Button";
import SettingsCard from "./SettingsCard";
import ToggleSwitch from "./ToggleSwitch";

const FONT_SIZES = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
];

export default function AccessibilitySettings({
  settings,
  updateSection,
  resetSection,
}) {
  const { accessibility } = settings;

  return (
    <SettingsCard icon={Eye} title="Accessibility">
      <div className="mb-4">
        <p className="text-sm text-fedora-muted mb-2">Font Size</p>
        <div className="flex gap-2">
          {FONT_SIZES.map(({ value, label }) => {
            const active = accessibility.fontSize === value;

            return (
              <button
                key={value}
                onClick={() =>
                  updateSection("accessibility", { fontSize: value })
                }
                className={`px-4 py-2 rounded-lg text-sm border transition-colors ${
                  active
                    ? "border-fedora-accent bg-fedora-border text-fedora-text"
                    : "border-fedora-border text-fedora-muted hover:bg-fedora-border"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="divide-y divide-fedora-border">
        <ToggleSwitch
          label="Reduced motion"
          description="Minimize animations and transitions across the app"
          checked={accessibility.reducedMotion}
          onChange={(value) =>
            updateSection("accessibility", { reducedMotion: value })
          }
        />
        <ToggleSwitch
          label="High contrast mode"
          description="Not yet applied — preference is saved for when it's implemented"
          checked={accessibility.highContrast}
          onChange={(value) =>
            updateSection("accessibility", { highContrast: value })
          }
        />
      </div>

      <div className="mt-4">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => resetSection("accessibility")}
        >
          Reset to Default
        </Button>
      </div>
    </SettingsCard>
  );
}
