import { Lock } from "lucide-react";
import Button from "../Button/Button";
import SettingsCard from "./SettingsCard";
import ToggleSwitch from "./ToggleSwitch";

export default function PrivacySettings({
  settings,
  updateSection,
  resetSection,
}) {
  const { privacy } = settings;

  return (
    <SettingsCard
      icon={Lock}
      title="Privacy"
      description="FedoraQuest is currently single-device with no public profiles — these settings are saved for when sharing/public profiles exist."
    >
      <div className="mb-4">
        <label
          className="block text-sm text-fedora-muted mb-1"
          htmlFor="profileVisibility"
        >
          Profile Visibility
        </label>
        <select
          id="profileVisibility"
          value={privacy.profileVisibility}
          onChange={(event) =>
            updateSection("privacy", { profileVisibility: event.target.value })
          }
          className="w-full bg-fedora-bg border border-fedora-border rounded-lg px-3 py-2 text-fedora-text focus:outline-none focus:border-fedora-accent"
        >
          <option value="private">Private</option>
          <option value="public">Public</option>
        </select>
      </div>

      <div className="divide-y divide-fedora-border">
        <ToggleSwitch
          label="Show learning progress publicly"
          checked={privacy.showProgressPublicly}
          onChange={(value) =>
            updateSection("privacy", { showProgressPublicly: value })
          }
        />
        <ToggleSwitch
          label="Show achievements publicly"
          checked={privacy.showAchievementsPublicly}
          onChange={(value) =>
            updateSection("privacy", { showAchievementsPublicly: value })
          }
        />
      </div>

      <div className="mt-4">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => resetSection("privacy")}
        >
          Reset to Default
        </Button>
      </div>
    </SettingsCard>
  );
}
