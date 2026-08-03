import { useState } from "react";
import { KeyRound, Trash2 } from "lucide-react";
import useAuth from "../../auth/useAuth";
import Button from "../Button/Button";
import PasswordInput from "../Auth/PasswordInput";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";
import SettingsCard from "./SettingsCard";

const INPUT_CLASSES =
  "w-full bg-fedora-bg border border-fedora-border rounded-lg px-3 py-2 text-fedora-text focus:outline-none focus:border-fedora-accent";

export default function AccountSettings({ showToast }) {
  const { user, updateAccount, changePassword } = useAuth();

  const [formData, setFormData] = useState({
    fullName: user.fullName,
    username: user.username,
    email: user.email,
  });
  const [isSavingAccount, setIsSavingAccount] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleAccountChange = (field) => (event) => {
    setFormData((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleAccountReset = () => {
    setFormData({
      fullName: user.fullName,
      username: user.username,
      email: user.email,
    });
  };

  const handleAccountSave = async (event) => {
    event.preventDefault();
    setIsSavingAccount(true);
    try {
      await updateAccount(formData);
      showToast("Account details updated.");
    } catch (err) {
      showToast(err.message || "Something went wrong.", "error");
    } finally {
      setIsSavingAccount(false);
    }
  };

  const handlePasswordChange = (field) => (event) => {
    setPasswordData((current) => ({
      ...current,
      [field]: event.target.value,
    }));
  };

  const handlePasswordSave = async (event) => {
    event.preventDefault();

    if (passwordData.newPassword.length < 8) {
      showToast("New password must be at least 8 characters.", "error");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      showToast("New passwords do not match.", "error");
      return;
    }

    setIsSavingPassword(true);
    try {
      await changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      showToast("Password changed successfully.");
    } catch (err) {
      showToast(err.message || "Something went wrong.", "error");
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <>
      <SettingsCard
        title="Account Details"
        description="Update your account information."
      >
        <form onSubmit={handleAccountSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                className="block text-sm text-fedora-muted mb-1"
                htmlFor="settings-fullName"
              >
                Full Name
              </label>
              <input
                id="settings-fullName"
                type="text"
                value={formData.fullName}
                onChange={handleAccountChange("fullName")}
                className={INPUT_CLASSES}
              />
            </div>

            <div>
              <label
                className="block text-sm text-fedora-muted mb-1"
                htmlFor="settings-username"
              >
                Username
              </label>
              <input
                id="settings-username"
                type="text"
                value={formData.username}
                onChange={handleAccountChange("username")}
                className={INPUT_CLASSES}
              />
            </div>
          </div>

          <div>
            <label
              className="block text-sm text-fedora-muted mb-1"
              htmlFor="settings-email"
            >
              Email Address
            </label>
            <input
              id="settings-email"
              type="email"
              value={formData.email}
              onChange={handleAccountChange("email")}
              className={INPUT_CLASSES}
            />
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={isSavingAccount}>
              {isSavingAccount ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleAccountReset}
            >
              Reset
            </Button>
          </div>
        </form>
      </SettingsCard>

      <SettingsCard icon={KeyRound} title="Change Password">
        <form onSubmit={handlePasswordSave} className="space-y-4">
          <PasswordInput
            id="currentPassword"
            label="Current Password"
            value={passwordData.currentPassword}
            onChange={handlePasswordChange("currentPassword")}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <PasswordInput
              id="newPassword"
              label="New Password"
              value={passwordData.newPassword}
              onChange={handlePasswordChange("newPassword")}
            />
            <PasswordInput
              id="confirmNewPassword"
              label="Confirm New Password"
              value={passwordData.confirmNewPassword}
              onChange={handlePasswordChange("confirmNewPassword")}
            />
          </div>

          <Button type="submit" disabled={isSavingPassword}>
            {isSavingPassword ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </SettingsCard>

      <SettingsCard
        icon={Trash2}
        title="Delete Account"
        description="Permanently delete your account and all data."
      >
        <Button variant="secondary" onClick={() => setShowDeleteModal(true)}>
          Delete Account
        </Button>
      </SettingsCard>

      {showDeleteModal && (
        <ConfirmDialog
          title="Delete Account"
          message="This will permanently delete your account and all associated data. This action cannot be undone. (Note: account deletion isn't connected to a backend yet — this confirms the flow only, nothing is actually deleted.)"
          confirmLabel="Delete Account"
          onConfirm={() => {
            setShowDeleteModal(false);
            showToast(
              "Account deletion isn't implemented yet — this is a placeholder.",
              "error"
            );
          }}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </>
  );
}
