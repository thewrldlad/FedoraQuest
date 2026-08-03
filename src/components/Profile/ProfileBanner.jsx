import { useRef, useState } from "react";
import { Camera, X } from "lucide-react";
import { validateImageFile } from "../../utils/imageValidation";

const MAX_SIZE_BYTES = 8 * 1024 * 1024;

// Cover/banner image with a hover-to-reveal edit control, matching the
// same interaction pattern GitHub/LinkedIn use for cover photos — no
// separate "Change Banner" button cluttering the Edit Profile modal.
// Falls back to a Fedora-blue gradient (not a static image asset, since
// none exists in this project) when no custom banner has been uploaded.
export default function ProfileBanner({ value, onUpload, onRemove }) {
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
      await onUpload(file);
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
      setImgError(false);
    } catch {
      setError("Couldn't remove the banner — please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="group relative h-32 sm:h-44 md:h-52 w-full overflow-hidden rounded-t-xl bg-gradient-to-r from-fedora-accent via-fedora-accent-light to-fedora-accent">
      {showImage && (
        <img
          src={value}
          alt=""
          onError={() => setImgError(true)}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Gradient overlay for readability of the avatar/name that sit
          on top of the banner's bottom edge. */}
      <div className="absolute inset-0 bg-gradient-to-t from-fedora-surface/90 via-fedora-surface/10 to-transparent" />

      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
        <button
          type="button"
          onClick={openFilePicker}
          aria-label={value ? "Change cover banner" : "Upload cover banner"}
          className="flex items-center gap-2 rounded-lg bg-fedora-bg/80 hover:bg-fedora-bg px-3 py-1.5 text-xs text-fedora-text border border-fedora-border transition-colors"
        >
          <Camera size={14} />
          {value ? "Change Banner" : "Upload Banner"}
        </button>

        {value && (
          <button
            type="button"
            onClick={handleRemove}
            aria-label="Remove cover banner"
            className="flex items-center justify-center rounded-lg bg-fedora-bg/80 hover:bg-fedora-bg w-8 h-8 text-fedora-muted hover:text-red-400 border border-fedora-border transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {isProcessing && (
        <div className="absolute inset-0 bg-fedora-bg/50 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-fedora-accent-light border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <p className="absolute bottom-2 left-3 text-red-300 text-xs bg-fedora-bg/80 rounded px-2 py-1">
          {error}
        </p>
      )}

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
