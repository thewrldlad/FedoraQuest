import { useRef, useState } from "react";
import { Camera, X } from "lucide-react";
import { validateImageFile } from "../../utils/imageValidation";

const MAX_SIZE_BYTES = 5 * 1024 * 1024;

// The large hero-style avatar for the redesigned Profile Header — a
// distinct presentational component from AvatarUploader.jsx (which
// keeps its compact modal-form layout inside EditProfile.jsx unchanged).
// Both call the exact same uploadAvatar/removeAvatar functions from
// useProfile(), so there is only ever one place that actually talks to
// Firebase Storage for avatars — this component and AvatarUploader are
// just two different presentations of the same upload action.
export default function ProfileAvatar({
  value,
  fallbackInitials,
  onUpload,
  onRemove,
  onChange,
}) {
  const fileInputRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [imgError, setImgError] = useState(false);

  const showImage = Boolean(value) && !imgError;

  const openFilePicker = () => fileInputRef.current?.click();

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setError("");
    const validation = validateImageFile(file, { maxBytes: MAX_SIZE_BYTES });
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    setIsProcessing(true);
    setImgError(false);

    try {
      const url = await onUpload(file);
      onChange?.(url);
    } catch {
      setError("Upload failed — check your connection and try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemove = async (event) => {
    event.stopPropagation();
    setError("");
    setIsProcessing(true);

    try {
      await onRemove();
      onChange?.("");
      setImgError(false);
    } catch {
      setError("Couldn't remove the photo — please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="relative shrink-0">
      <div className="group relative w-28 h-28 sm:w-36 sm:h-36 rounded-full ring-[5px] ring-fedora-surface border border-fedora-border/70 shadow-xl shadow-fedora-bg/40">
        {showImage ? (
          <img
            src={value}
            alt="Profile avatar"
            onError={() => setImgError(true)}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <div className="w-full h-full rounded-full bg-fedora-accent flex items-center justify-center text-white text-4xl font-display font-semibold">
            {fallbackInitials}
          </div>
        )}

        {showImage && (
          <button
            type="button"
            onClick={handleRemove}
            aria-label="Remove profile picture"
            className="absolute -top-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border border-fedora-border bg-fedora-surface text-fedora-muted shadow-md transition-colors hover:border-red-400 hover:text-red-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fedora-accent-light"
          >
            <X size={14} />
          </button>
        )}

        {isProcessing && (
          <div className="absolute inset-0 rounded-full bg-fedora-bg/70 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-fedora-accent-light border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={openFilePicker}
        aria-label="Change profile picture"
        className="absolute -bottom-1 -right-1 flex h-10 w-10 items-center justify-center rounded-full border-4 border-fedora-surface bg-fedora-accent text-white shadow-lg transition-transform hover:scale-105 hover:bg-fedora-accent-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fedora-accent-light"
        title="Change profile picture"
      >
        <Camera size={17} aria-hidden="true" />
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {error && (
        <p className="absolute top-full mt-1 w-40 text-red-400 text-xs">
          {error}
        </p>
      )}
    </div>
  );
}
