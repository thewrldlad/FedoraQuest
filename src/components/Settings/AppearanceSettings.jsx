import { Sun, Moon, Monitor } from "lucide-react";
import Button from "../Button/Button";
import SettingsCard from "./SettingsCard";

const THEMES = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

export default function AppearanceSettings({ settings, updateSection, resetSection }) {
  return (
    <SettingsCard title="Appearance" description="Choose how FedoraQuest looks.">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {THEMES.map(({ value, label, icon: Icon }) => {
          const active = settings.appearance.theme === value;

          return (
            <button
              key={value}
              onClick={() => updateSection("appearance", { theme: value })}
              className={`flex flex-col items-center gap-2 rounded-lg border p-4 transition-colors ${
                active
                  ? "border-fedora-accent bg-fedora-border"
                  : "border-fedora-border hover:bg-fedora-border"
              }`}
            >
              <Icon
                size={20}
                className={active ? "text-fedora-accent-light" : "text-fedora-muted"}
              />
              <span className="text-sm text-fedora-text">{label}</span>
            </button>
          );
        })}
      </div>

      <p className="text-fedora-muted text-xs mb-4">
        Dark is FedoraQuest's original theme. Light applies an alternate
        palette, and System follows your OS preference automatically.
      </p>

      <Button
        variant="secondary"
        size="sm"
        onClick={() => resetSection("appearance")}
      >
        Reset to Default
      </Button>
    </SettingsCard>
  );
}
