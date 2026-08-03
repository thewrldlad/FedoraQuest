import { Bell } from "lucide-react";
import Button from "../Button/Button";
import SettingsCard from "./SettingsCard";
import ToggleSwitch from "./ToggleSwitch";

export default function NotificationSettings({
  settings,
  updateSection,
  resetSection,
}) {
  const { notifications } = settings;

  return (
    <SettingsCard
      icon={Bell}
      title="Notifications"
      description="Choose what FedoraQuest notifies you about. Delivery isn't wired up yet — these preferences are saved for when it is."
    >
      <div className="divide-y divide-fedora-border">
        <ToggleSwitch
          label="Course updates"
          description="New lessons, modules, and curriculum changes"
          checked={notifications.courseUpdates}
          onChange={(value) =>
            updateSection("notifications", { courseUpdates: value })
          }
        />
        <ToggleSwitch
          label="Achievement notifications"
          description="When you unlock a new badge"
          checked={notifications.achievementNotifications}
          onChange={(value) =>
            updateSection("notifications", {
              achievementNotifications: value,
            })
          }
        />
        <ToggleSwitch
          label="Reminder notifications"
          description="Nudges to keep your study streak going"
          checked={notifications.reminders}
          onChange={(value) =>
            updateSection("notifications", { reminders: value })
          }
        />
        <ToggleSwitch
          label="Email notifications"
          description="Receive the above via email"
          checked={notifications.email}
          onChange={(value) =>
            updateSection("notifications", { email: value })
          }
        />
      </div>

      <div className="mt-4">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => resetSection("notifications")}
        >
          Reset to Default
        </Button>
      </div>
    </SettingsCard>
  );
}
