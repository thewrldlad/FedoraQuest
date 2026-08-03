import { Calendar, MapPin, Clock } from "lucide-react";
import { getLearningTitle } from "../../utils/learningTitle";
import { formatRelativeTime } from "../../utils/relativeTime";

// Center column of the redesigned header: name, username, the
// XP-driven learning title badge (Role System), bio, and the
// join-date/country/last-active metadata row. Pure presentational —
// every value is passed in, nothing is computed from global state here
// except the title tier (a one-line pure function of xp).
export default function UserIdentity({ profile, xp, memberSince, lastActiveAt }) {
  const { title } = getLearningTitle(xp);
  const lastActiveLabel = formatRelativeTime(lastActiveAt);

  return (
    <div className="min-w-0">
      <h1 className="text-2xl sm:text-3xl font-display text-fedora-text truncate">
        {profile.fullName}
      </h1>
      <p className="text-fedora-muted text-sm">@{profile.username}</p>

      <div className="flex flex-wrap items-center gap-2 mt-3">
        <span className="px-3 py-1 rounded-full bg-fedora-accent text-white text-xs font-medium">
          {title}
        </span>
        <span className="text-fedora-muted text-sm">
          ⭐ {xp.toLocaleString()} XP
        </span>
      </div>

      {profile.bio && (
        <p className="text-fedora-text text-sm mt-3 max-w-xl leading-relaxed">
          {profile.bio}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-fedora-muted text-xs">
        <span className="flex items-center gap-1.5">
          <Calendar size={13} aria-hidden="true" />
          Joined {memberSince}
        </span>

        {profile.country && (
          <span className="flex items-center gap-1.5">
            <MapPin size={13} aria-hidden="true" />
            {profile.country}
          </span>
        )}

        {lastActiveLabel && (
          <span className="flex items-center gap-1.5">
            <Clock size={13} aria-hidden="true" />
            Active {lastActiveLabel}
          </span>
        )}
      </div>
    </div>
  );
}
