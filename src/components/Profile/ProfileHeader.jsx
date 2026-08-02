import { useState } from "react";
import { Pencil, Share2 } from "lucide-react";
import Button from "../Button/Button";

export default function ProfileHeader({
  profile,
  xp,
  streak,
  memberSince,
  onEditClick,
}) {
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);

  const showImage = Boolean(profile.avatarUrl) && !imgError;
  const initials = (profile.fullName || profile.username || "?")
    .trim()
    .slice(0, 2)
    .toUpperCase();

  const handleShare = () => {
    const summary = `I'm a ${profile.learningLevel} on FedoraQuest with ${xp.toLocaleString()} XP and a ${streak}-day streak!`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <section className="bg-fedora-surface border border-fedora-border rounded-xl p-8 shadow-sm mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          {showImage ? (
            <img
              src={profile.avatarUrl}
              alt={profile.fullName}
              onError={() => setImgError(true)}
              className="w-24 h-24 rounded-full object-cover shrink-0 border border-fedora-border"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-fedora-accent flex items-center justify-center text-white text-3xl font-display font-semibold shrink-0">
              {initials}
            </div>
          )}

          <div>
            <h1 className="text-2xl font-display text-fedora-text">
              {profile.fullName}
            </h1>
            <p className="text-fedora-muted text-sm">@{profile.username}</p>

            <div className="flex flex-wrap items-center gap-3 mt-2">
              <span className="px-3 py-1 rounded-full bg-fedora-accent text-white text-xs font-medium">
                {profile.learningLevel}
              </span>
              <span className="text-fedora-muted text-sm">
                ⭐ {xp.toLocaleString()} XP
              </span>
              <span className="text-fedora-muted text-sm">
                🔥 {streak} day streak
              </span>
            </div>

            {profile.bio && (
              <p className="text-fedora-text text-sm mt-3 max-w-xl">
                {profile.bio}
              </p>
            )}

            <p className="text-fedora-muted text-xs mt-2">
              Member since {memberSince}
            </p>
          </div>
        </div>

        <div className="flex gap-3 shrink-0">
          <Button variant="secondary" onClick={onEditClick}>
            <span className="flex items-center gap-2">
              <Pencil size={16} />
              Edit Profile
            </span>
          </Button>

          <Button onClick={handleShare}>
            <span className="flex items-center gap-2">
              <Share2 size={16} />
              {copied ? "Copied!" : "Share Profile"}
            </span>
          </Button>
        </div>
      </div>
    </section>
  );
}
