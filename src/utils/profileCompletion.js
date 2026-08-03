// Pure, UI-independent completion calculation so ProfileCompletion.jsx
// stays a presentational component — the field list and "what counts as
// filled in" logic live here, in one place, instead of duplicated in JSX.
const COMPLETION_FIELDS = [
  { key: "avatarUrl", label: "Add a profile picture" },
  { key: "bannerUrl", label: "Upload a cover banner" },
  { key: "fullName", label: "Add your full name" },
  { key: "username", label: "Choose a username" },
  { key: "bio", label: "Write a short bio" },
  { key: "country", label: "Add your country or region" },
];

function isFilled(value) {
  return typeof value === "string" ? value.trim().length > 0 : Boolean(value);
}

export function getProfileCompletion(profile) {
  const missingFields = COMPLETION_FIELDS.filter(
    (field) => !isFilled(profile?.[field.key])
  );
  const completedCount = COMPLETION_FIELDS.length - missingFields.length;

  return {
    percent: Math.round((completedCount / COMPLETION_FIELDS.length) * 100),
    completedCount,
    totalFields: COMPLETION_FIELDS.length,
    missingFields: missingFields.map((field) => field.label),
  };
}
