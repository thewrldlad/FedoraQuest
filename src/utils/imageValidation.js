// Shared client-side validation for every image upload control
// (avatar in the Edit Profile modal, avatar + banner in the new Profile
// Header) — one place to keep the accepted types and size limits in
// sync with the Storage rules that re-check them server-side.
export const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];

export function validateImageFile(file, { maxBytes }) {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return { valid: false, error: "Please choose a PNG, JPG, or WEBP image." };
  }

  if (file.size > maxBytes) {
    const maxMb = Math.round(maxBytes / (1024 * 1024));
    return {
      valid: false,
      error: `That image is too large — please choose a file under ${maxMb} MB.`,
    };
  }

  return { valid: true, error: null };
}
