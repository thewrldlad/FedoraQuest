import ProfileBanner from "./ProfileBanner";
import ProfileAvatar from "./ProfileAvatar";
import UserIdentity from "./UserIdentity";
import ProfileActions from "./ProfileActions";
import ProfileCompletion from "./ProfileCompletion";
import QuickStats from "./QuickStats";

export default function ProfileHeader({
  profile,
  memberSince,
  lastActiveAt,
  modulesCompleted,
  totalModules,
  lessonsCompleted,
  totalLessons,
  completedLabs,
  quizzesCompleted,
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

  return (
    <section className="bg-fedora-surface border border-fedora-border rounded-2xl shadow-xl shadow-fedora-bg/20 mb-8 overflow-hidden">
      <ProfileBanner
        value={profile.bannerUrl}
        onUpload={onUploadBanner}
        onRemove={onRemoveBanner}
      />

      <div className="relative px-5 sm:px-8 lg:px-10 pb-8">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="-mt-14">
            <ProfileAvatar
              value={profile.avatarUrl}
              fallbackInitials={initials}
              onUpload={onUploadAvatar}
              onRemove={onRemoveAvatar}
            />
          </div>

          <div className="flex-1 flex flex-col lg:flex-row lg:justify-between gap-6 pt-4">
            <UserIdentity
              profile={profile}
              memberSince={memberSince}
              lastActiveAt={lastActiveAt}
            />

            <ProfileActions
              onEditClick={onEditClick}
            />
          </div>
        </div>

        <div className="mt-6">
          <ProfileCompletion profile={profile} />
        </div>

        <QuickStats
          lessonsCompleted={lessonsCompleted}
          totalLessons={totalLessons}
          completedLabs={completedLabs}
          quizzesCompleted={quizzesCompleted}
          modulesCompleted={modulesCompleted}
          totalModules={totalModules}
        />
      </div>
    </section>
  );
}