import useSettings from "../hooks/useSettings";
import useToast from "../hooks/useToast";
import Toast from "../components/Settings/Toast";
import AccountSettings from "../components/Settings/AccountSettings";
import AppearanceSettings from "../components/Settings/AppearanceSettings";
import NotificationSettings from "../components/Settings/NotificationSettings";
import PrivacySettings from "../components/Settings/PrivacySettings";
import SecuritySettings from "../components/Settings/SecuritySettings";
import LanguageSettings from "../components/Settings/LanguageSettings";
import AccessibilitySettings from "../components/Settings/AccessibilitySettings";

export default function Settings() {
  const { settings, updateSection, resetSection } = useSettings();
  const { toast, showToast } = useToast();

  return (
    <div>
      <h1 className="text-3xl font-display text-fedora-text mb-2">
        Settings
      </h1>
      <p className="text-fedora-muted mb-8">
        Manage your account, appearance, and preferences.
      </p>

      <div className="space-y-6">
        <AccountSettings showToast={showToast} />

        <AppearanceSettings
          settings={settings}
          updateSection={updateSection}
          resetSection={resetSection}
        />

        <NotificationSettings
          settings={settings}
          updateSection={updateSection}
          resetSection={resetSection}
        />

        <PrivacySettings
          settings={settings}
          updateSection={updateSection}
          resetSection={resetSection}
        />

        <SecuritySettings />

        <LanguageSettings
          settings={settings}
          updateSection={updateSection}
          resetSection={resetSection}
        />

        <AccessibilitySettings
          settings={settings}
          updateSection={updateSection}
          resetSection={resetSection}
        />
      </div>

      <Toast toast={toast} />
    </div>
  );
}
