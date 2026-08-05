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
    <div className="group relative h-36 sm:h-52 lg:h-60 w-full overflow-hidden rounded-t-2xl bg-gradient-to-br from-fedora-accent via-[#28558c] to-fedora-bg">
      {showImage && (
        <img
          src={value}
          alt=""
          onError={() => setImgError(true)}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-fedora-surface via-fedora-surface/25 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,rgba(127,184,232,0.45),transparent_35%),radial-gradient(circle_at_82%_18%,rgba(60,110,180,0.55),transparent_30%)]" />

      <div className="absolute left-5 bottom-5 sm:left-8 sm:bottom-7">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
          FedoraQuest
        </p>
        <p className="mt-1 text-sm font-medium text-white/90">
          Learning profile
        </p>
      </div>

      <div className="absolute top-3 right-3 flex gap-2 sm:top-4 sm:right-4">
        <button
          type="button"
          onClick={openFilePicker}
          aria-label={value ? "Change cover banner" : "Upload cover banner"}
          className="flex items-center gap-2 rounded-lg border border-white/15 bg-fedora-bg/85 px-3 py-2 text-xs font-medium text-fedora-text shadow-lg backdrop-blur-sm transition-colors hover:bg-fedora-bg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fedora-accent-light"
        >
          <Camera size={14} />
          <span className="hidden sm:inline">
            {value ? "Change cover" : "Add cover"}
          </span>
          <span className="sm:hidden">Cover</span>
        </button>

        {value && (
          <button
            type="button"
            onClick={handleRemove}
            aria-label="Remove cover banner"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-fedora-bg/85 text-fedora-muted shadow-lg backdrop-blur-sm transition-colors hover:bg-fedora-bg hover:text-red-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fedora-accent-light"
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
