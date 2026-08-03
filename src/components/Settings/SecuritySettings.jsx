import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, LogOut, Smartphone, KeyRound } from "lucide-react";
import useAuth from "../../auth/useAuth";
import Button from "../Button/Button";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";
import SettingsCard from "./SettingsCard";

export default function SecuritySettings() {
  const { user, logout, getSessionInfo } = useAuth();
  const navigate = useNavigate();
  const [showLogoutAllModal, setShowLogoutAllModal] = useState(false);

  const sessionInfo = getSessionInfo();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <>
      <SettingsCard icon={ShieldCheck} title="Session & Login">
        <div className="space-y-3 text-sm mb-5">
          <div className="flex justify-between">
            <span className="text-fedora-muted">Current session</span>
            <span className="text-fedora-text">
              {sessionInfo.persistent
                ? "Remembered on this device"
                : "This browser session only"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-fedora-muted">Last login</span>
            <span className="text-fedora-text">
              {user.lastLoginAt
                ? new Date(user.lastLoginAt).toLocaleString()
                : "Unknown"}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="secondary" onClick={handleLogout}>
            <span className="flex items-center gap-2">
              <LogOut size={16} /> Logout This Session
            </span>
          </Button>

          <Button variant="secondary" onClick={() => setShowLogoutAllModal(true)}>
            <span className="flex items-center gap-2">
              <Smartphone size={16} /> Logout All Devices
            </span>
          </Button>
        </div>
      </SettingsCard>

      <SettingsCard
        icon={KeyRound}
        title="Two-Factor Authentication"
        description="Add an extra layer of security to your account."
      >
        <Button disabled>Enable Two-Factor Authentication (Coming Soon)</Button>
      </SettingsCard>

      {showLogoutAllModal && (
        <ConfirmDialog
          title="Logout All Devices"
          message="FedoraQuest doesn't yet track sessions across multiple devices — there's no backend to log out remotely. This is a placeholder for when that exists."
          confirmLabel="Got it"
          onConfirm={() => setShowLogoutAllModal(false)}
          onCancel={() => setShowLogoutAllModal(false)}
        />
      )}
    </>
  );
}
