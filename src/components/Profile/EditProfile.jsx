import { useState } from "react";
import Button from "../Button/Button";
import AvatarUploader from "./AvatarUploader";

const LEARNING_LEVELS = [
  "Linux Beginner",
  "Fedora Explorer",
  "Linux Apprentice",
  "System Administrator",
];

const INPUT_CLASSES =
  "w-full bg-fedora-bg border border-fedora-border rounded-lg px-3 py-2 text-fedora-text focus:outline-none focus:border-fedora-accent";

export default function EditProfile({
  profile,
  onSave,
  onCancel,
  onUploadAvatar,
  onRemoveAvatar,
  isSaving,
  saveError,
}) {
  const [formData, setFormData] = useState(profile);

  const handleChange = (field) => (event) => {
    setFormData((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleAvatarChange = (newAvatarUrl) => {
    setFormData((current) => ({ ...current, avatarUrl: newAvatarUrl }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave(formData);
  };

  const initials = (formData.fullName || formData.username || "?")
    .trim()
    .slice(0, 2)
    .toUpperCase();

  return (
    <section className="bg-fedora-surface border border-fedora-border rounded-xl p-8 shadow-sm mb-8">
      <h2 className="text-xl font-display text-fedora-text mb-6">
        Edit Profile
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <p className="block text-sm text-fedora-muted mb-2">
            Profile Picture
          </p>
          <AvatarUploader
            value={formData.avatarUrl}
            fallbackInitials={initials}
            onChange={handleAvatarChange}
            onUpload={onUploadAvatar}
            onRemove={onRemoveAvatar}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label
              className="block text-sm text-fedora-muted mb-1"
              htmlFor="fullName"
            >
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange("fullName")}
              className={INPUT_CLASSES}
            />
          </div>

          <div>
            <label
              className="block text-sm text-fedora-muted mb-1"
              htmlFor="username"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={formData.username}
              onChange={handleChange("username")}
              className={INPUT_CLASSES}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label
              className="block text-sm text-fedora-muted mb-1"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange("email")}
              className={INPUT_CLASSES}
            />
          </div>

          <div>
            <label
              className="block text-sm text-fedora-muted mb-1"
              htmlFor="learningLevel"
            >
              Learning Level
            </label>
            <select
              id="learningLevel"
              value={formData.learningLevel}
              onChange={handleChange("learningLevel")}
              className={INPUT_CLASSES}
            >
              {LEARNING_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label
            className="block text-sm text-fedora-muted mb-1"
            htmlFor="country"
          >
            Country / Region
          </label>
          <input
            id="country"
            type="text"
            value={formData.country}
            onChange={handleChange("country")}
            placeholder="e.g. Canada"
            className={INPUT_CLASSES}
          />
        </div>

        <div>
          <label
            className="block text-sm text-fedora-muted mb-1"
            htmlFor="bio"
          >
            Bio
          </label>
          <textarea
            id="bio"
            value={formData.bio}
            onChange={handleChange("bio")}
            rows={3}
            maxLength={240}
            className={`${INPUT_CLASSES} resize-none`}
          />
        </div>

        <p className="text-fedora-muted text-xs">
          Your profile is saved to your account and available on any
          device you log in from.
        </p>

        <div className="flex gap-3">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSaving}
          >
            Cancel
          </Button>
        </div>

        {saveError && (
          <p role="alert" className="text-sm text-red-400">
            {saveError}
          </p>
        )}
      </form>
    </section>
  );
}
