import useAdmin from "../../hooks/useAdmin";
import ToggleSwitch from "../../components/Settings/ToggleSwitch";

const INPUT_CLASSES =
  "w-full bg-fedora-bg border border-fedora-border rounded-lg px-3 py-2 text-fedora-text focus:outline-none focus:border-fedora-accent";

export default function AdminSettings() {
  const { settings, editSettings, uploadLogo } = useAdmin();

  const handleLogoChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    await uploadLogo(file);
  };

  return (
    <div>
      <h1 className="text-2xl font-display text-fedora-text mb-1">
        Admin Settings
      </h1>
      <p className="text-fedora-muted mb-6">
        Platform-wide defaults and feature toggles.
      </p>

      <section className="bg-fedora-surface border border-fedora-border rounded-xl p-6 mb-6">
        <h2 className="text-lg font-display text-fedora-text mb-4">
          Platform Branding
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-fedora-muted mb-1">
              Platform Name
            </label>
            <input
              type="text"
              value={settings.platformName}
              onChange={(event) =>
                editSettings({ platformName: event.target.value })
              }
              className={INPUT_CLASSES}
            />
          </div>

          <div>
            <label className="block text-sm text-fedora-muted mb-1">
              Theme
            </label>
            <select
              value={settings.theme}
              onChange={(event) => editSettings({ theme: event.target.value })}
              className={INPUT_CLASSES}
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="system">System</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm text-fedora-muted mb-1">Logo</label>
          <input
            type="file"
            accept="image/png, image/jpeg, image/webp"
            onChange={handleLogoChange}
            className="text-sm text-fedora-text"
          />
          {settings.logoUrl && (
            <img
              src={settings.logoUrl}
              alt="Platform logo"
              className="w-16 h-16 object-cover rounded-lg border border-fedora-border mt-2"
            />
          )}
        </div>
      </section>

      <section className="bg-fedora-surface border border-fedora-border rounded-xl p-6 mb-6">
        <h2 className="text-lg font-display text-fedora-text mb-4">
          Defaults
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-fedora-muted mb-1">
              Default Lesson XP
            </label>
            <input
              type="number"
              min="0"
              value={settings.defaultLessonXP}
              onChange={(event) =>
                editSettings({ defaultLessonXP: Number(event.target.value) })
              }
              className={INPUT_CLASSES}
            />
          </div>

          <div>
            <label className="block text-sm text-fedora-muted mb-1">
              Default Passing Score (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={settings.defaultPassingScore}
              onChange={(event) =>
                editSettings({
                  defaultPassingScore: Number(event.target.value),
                })
              }
              className={INPUT_CLASSES}
            />
          </div>
        </div>

        <p className="text-fedora-muted text-xs mt-3">
          Used as the default when creating new lessons/quizzes in the
          staging area above.
        </p>
      </section>

      <section className="bg-fedora-surface border border-fedora-border rounded-xl p-6">
        <h2 className="text-lg font-display text-fedora-text mb-1">
          Feature Toggles
        </h2>
        <p className="text-fedora-muted text-xs mb-4">
          Placeholders for future platform-wide features.
        </p>

        <div className="divide-y divide-fedora-border">
          <ToggleSwitch
            label="Certificates"
            description="Allow students to earn completion certificates"
            checked={settings.featureToggles.certificatesEnabled}
            onChange={(value) =>
              editSettings({
                featureToggles: {
                  ...settings.featureToggles,
                  certificatesEnabled: value,
                },
              })
            }
          />
          <ToggleSwitch
            label="Leaderboard"
            description="Not yet built — reserved for a future release"
            checked={settings.featureToggles.leaderboardEnabled}
            onChange={(value) =>
              editSettings({
                featureToggles: {
                  ...settings.featureToggles,
                  leaderboardEnabled: value,
                },
              })
            }
          />
          <ToggleSwitch
            label="Community"
            description="Not yet built — reserved for a future release"
            checked={settings.featureToggles.communityEnabled}
            onChange={(value) =>
              editSettings({
                featureToggles: {
                  ...settings.featureToggles,
                  communityEnabled: value,
                },
              })
            }
          />
        </div>
      </section>
    </div>
  );
}
