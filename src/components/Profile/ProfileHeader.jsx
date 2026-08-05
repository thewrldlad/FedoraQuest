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
    <section className="bg-fedora-surface border border-fedora-border rounded-2xl shadow-xl shadow-fedora-bg/20 mb-8 overflow-hidden">
      <ProfileBanner
        value={profile.bannerUrl}
        onUpload={onUploadBanner}
        onRemove={onRemoveBanner}
      />

      <div className="relative px-5 sm:px-8 lg:px-10 pb-8">
        <div className="flex flex-col sm:flex-row sm:items-start gap-5 lg:gap-7">
          <div className="-mt-14 sm:-mt-16">
            <ProfileAvatar
              value={profile.avatarUrl}
              fallbackInitials={initials}
              onUpload={onUploadAvatar}
              onRemove={onRemoveAvatar}
            />
          </div>

          <div className="flex-1 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5 min-w-0 pt-2 sm:pt-5">
            <UserIdentity
              profile={profile}
              xp={xp}
              memberSince={memberSince}
              lastActiveAt={lastActiveAt}
            />

            <ProfileActions xp={xp} streak={streak} onEditClick={onEditClick} />
          </div>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.7fr)] gap-5 mt-7 pt-6 border-t border-fedora-border/80">
          <FeaturedBadges achievements={achievements} />
          <ProfileCompletion profile={profile} />
        </div>

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
