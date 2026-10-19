import { Calendar, Clock, MapPin, User } from "lucide-react";

function formatDate(value) {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
  });
}

function formatLastActive(value) {
  if (!value) return "Recently";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default function UserIdentity({
  profile,
  memberSince,
  lastActiveAt,
}) {
  return (
    <div className="min-w-0">
      <h1 className="text-3xl font-display text-fedora-text">
        {profile.fullName || "FedoraQuest Learner"}
      </h1>

      <p className="mt-1 text-fedora-muted">
        @{profile.username || "username"}
      </p>

      {profile.bio && (
        <p className="mt-4 max-w-2xl text-fedora-text leading-relaxed">
          {profile.bio}
        </p>
      )}

      <div className="mt-6 flex flex-wrap gap-4 text-sm text-fedora-muted">
        <span className="flex items-center gap-2">
          <User size={16} />
          {profile.occupation || "Linux Learner"}
        </span>

        <span className="flex items-center gap-2">
          <MapPin size={16} />
          {profile.location || "Location not set"}
        </span>

        <span className="flex items-center gap-2">
          <Calendar size={16} />
          Member since {formatDate(memberSince)}
        </span>

        <span className="flex items-center gap-2">
          <Clock size={16} />
          Last active {formatLastActive(lastActiveAt)}
        </span>
      </div>
    </div>
  );
}