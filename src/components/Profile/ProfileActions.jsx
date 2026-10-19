import Button from "../Button/Button";
import { Pencil } from "lucide-react";

export default function ProfileActions({
  onEditClick,
}) {
  return (
    <div className="flex flex-col sm:items-end gap-3">
      <Button
        onClick={onEditClick}
        className="inline-flex items-center gap-2"
      >
        <Pencil size={16} />
        Edit Profile
      </Button>

      <p className="text-sm text-fedora-muted text-center sm:text-right max-w-xs">
        Keep your profile up to date so your learning experience stays organized.
      </p>
    </div>
  );
}