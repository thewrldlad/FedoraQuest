import ProfileBanner from "./ProfileBanner";
import ProfileAvatar from "./ProfileAvatar";
import UserIdentity from "./UserIdentity";
import ProfileActions from "./ProfileActions";
import ProfileCompletion from "./ProfileCompletion";
import QuickStats from "./QuickStats";
import FeaturedBadges from "./FeaturedBadges";
import { getLevelInfo } from "../../utils/xpLevel";

// Composes the redesigned Profile Header from the focused pieces below
// it — this component itself renders no markup of its own beyond the
// section shell and layout, so each concern (banner, avatar, identity,
// actions, completion, stats, badges) can be worked on independently.
export default function ProfileHeader({
  profile,
  xp,
  streak,
  memberSince,
  lastActiveAt,
  modulesCompleted,
  totalModules,
  achievements,
  onEditClick,
  onUploadAvatar,
  onRemoveAvatar,
  onUploadBanner,
  onRemoveBanner,
}) {
  const initials = (profile.fullName || profile.username || "?")
    .trim()
    .slice(0, 2)
    .toUpperCase();

  const level = getLevelInfo(xp);

  return (
    <section className="bg-fedora-surface border border-fedora-border rounded-xl shadow-sm mb-8 overflow-hidden">
      <ProfileBanner
        value={profile.bannerUrl}
        onUpload={onUploadBanner}
        onRemove={onRemoveBanner}
      />

      <div className="px-4 sm:px-8 pb-8">
        <div className="flex flex-col sm:flex-row sm:items-end gap-5 -mt-14 sm:-mt-16">
          <ProfileAvatar
            value={profile.avatarUrl}
            fallbackInitials={initials}
            onUpload={onUploadAvatar}
            onRemove={onRemoveAvatar}
          />

          <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 min-w-0 sm:pb-2">
            <UserIdentity
              profile={profile}
              xp={xp}
              memberSince={memberSince}
              lastActiveAt={lastActiveAt}
            />

            <ProfileActions xp={xp} streak={streak} onEditClick={onEditClick} />
          </div>
        </div>

        <ProfileCompletion profile={profile} />

        <FeaturedBadges achievements={achievements} />

        <QuickStats
          levelNumber={level.levelNumber}
          levelTitle={level.title}
          xp={xp}
          streak={streak}
          modulesCompleted={modulesCompleted}
          totalModules={totalModules}
        />
      </div>
    </section>
  );
}
