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
    <div className="min-w-0 max-w-2xl">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-fedora-accent-light">
        Learner profile
      </p>
      <h1 className="mt-1 text-2xl sm:text-3xl font-display font-semibold tracking-tight text-fedora-text truncate">
        {profile.fullName}
      </h1>
      <p className="mt-0.5 text-fedora-muted text-sm">@{profile.username}</p>

      <div className="flex flex-wrap items-center gap-2 mt-4">
        <span className="px-3 py-1 rounded-full bg-fedora-accent text-white text-xs font-semibold shadow-sm shadow-fedora-accent/30">
          {title}
        </span>
        <span className="inline-flex items-center rounded-full border border-fedora-border bg-fedora-bg/50 px-3 py-1 text-sm text-fedora-muted">
          ⭐ {xp.toLocaleString()} XP
        </span>
      </div>

      {profile.bio && (
        <p className="text-fedora-text text-sm mt-4 max-w-xl leading-relaxed">
          {profile.bio}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2 mt-4 text-fedora-muted text-xs">
        <span className="flex items-center gap-1.5 rounded-md border border-fedora-border/70 bg-fedora-bg/40 px-2.5 py-1.5">
          <Calendar size={13} aria-hidden="true" />
          Joined {memberSince}
        </span>

        {profile.country && (
          <span className="flex items-center gap-1.5 rounded-md border border-fedora-border/70 bg-fedora-bg/40 px-2.5 py-1.5">
            <MapPin size={13} aria-hidden="true" />
            {profile.country}
          </span>
        )}

        {lastActiveLabel && (
          <span className="flex items-center gap-1.5 rounded-md border border-fedora-border/70 bg-fedora-bg/40 px-2.5 py-1.5">
            <Clock size={13} aria-hidden="true" />
            Active {lastActiveLabel}
          </span>
        )}
      </div>
    </div>
  );
}
