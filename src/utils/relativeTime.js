// Small reusable "time ago" formatter — used by UserIdentity's "Last
// active" row. No date library is installed in this project, and a
// single comparison like this doesn't need one.
export function formatRelativeTime(isoString) {
  if (!isoString) return null;

  const then = new Date(isoString).getTime();
  if (Number.isNaN(then)) return null;

  const diffSeconds = Math.round((Date.now() - then) / 1000);
  if (diffSeconds < 60) return "Just now";

  const diffMinutes = Math.round(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes} min${diffMinutes === 1 ? "" : "s"} ago`;

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;

  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;

  return new Date(isoString).toLocaleDateString();
}
