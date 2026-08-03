import { useRef, useState } from "react";
import { Camera } from "lucide-react";
import Button from "../Button/Button";

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

// `onUpload(file)` is expected to resolve to a hosted download URL (it
// calls profileService.uploadAvatar under the hood, via useProfile) —
// this component never touches Firebase Storage itself, it just drives
// the file picker, validation, and upload/remove lifecycle around it.
export default function AvatarUploader({
  value,
  fallbackInitials,
  onChange,
  onUpload,
  onRemove,
}) {
  const fileInputRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [imgError, setImgError] = useState(false);

  const showImage = Boolean(value) && !imgError;

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setError("");

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Please choose a PNG, JPG, or WEBP image.");
      return;
    }

    if (file.size > MAX_SIZE_BYTES) {
      setError("That image is too large — please choose a file under 5 MB.");
      return;
    }

    setIsProcessing(true);
    setImgError(false);

    try {
      const url = await onUpload(file);
      onChange(url);
    } catch {
      setError("Upload failed — check your connection and try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemove = async () => {
    setError("");
    setIsProcessing(true);

    try {
      await onRemove();
      onChange("");
      setImgError(false);
    } catch {
      setError("Couldn't remove the photo — please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-5">
        <div className="relative w-24 h-24 shrink-0">
          {showImage ? (
            <img
              src={value}
              alt="Profile avatar"
              onError={() => setImgError(true)}
              className="w-24 h-24 rounded-full object-cover border border-fedora-border"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-fedora-accent flex items-center justify-center text-white text-3xl font-display font-semibold">
              {fallbackInitials}
            </div>
          )}

          {isProcessing && (
            <div className="absolute inset-0 rounded-full bg-fedora-bg/70 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-fedora-accent-light border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          <button
            type="button"
            onClick={openFilePicker}
            aria-label="Change photo"
            className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-fedora-accent border-2 border-fedora-surface flex items-center justify-center text-white hover:opacity-90 hover:scale-110 transition-all duration-200"
          >
            <Camera size={14} />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={openFilePicker}
            >
              Change Photo
            </Button>

            {value && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleRemove}
              >
                Remove Photo
              </Button>
            )}
          </div>

          <p className="text-fedora-muted text-xs">
            PNG, JPG, or WEBP. Max 5 MB.
          </p>

          {error && <p className="text-red-400 text-xs">{error}</p>}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
