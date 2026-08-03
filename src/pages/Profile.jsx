import { useState } from "react";
import { Link } from "react-router-dom";
import { version } from "../../package.json";

import { useGame } from "../context/GameContext";
import useAuth from "../auth/useAuth";
import useProfile from "../hooks/useProfile";
import useAchievements from "../hooks/useAchievements";
import { getLevelInfo } from "../utils/xpLevel";
import lessons from "../data/lessons";
import modules from "../data/modules";
import achievementsData from "../data/achievements";

import ProfileHeader from "../components/Profile/ProfileHeader";
import EditProfile from "../components/Profile/EditProfile";
import ProfileStats from "../components/Profile/ProfileStats";
import Achievements from "../components/Profile/Achievements";
import SkillBadge from "../components/SkillBadge/SkillBadge";
import Button from "../components/Button/Button";

const SKILLS = [
  { label: "Terminal", moduleId: 1 },
  { label: "File Management", moduleId: 2 },
  { label: "Permissions", moduleId: 3 },
  { label: "Networking", moduleId: 6 },
  { label: "Package Management", moduleId: 8 },
];

export default function Profile() {
  const {
    xp,
    streak,
    completedLessons,
    completedLabs,
    quizResults,
    achievements,
    firstSeenDate,
  } = useGame();

  const { user } = useAuth();
  const {
    profile,
    updateProfile,
    uploadAvatar,
    removeAvatar,
    uploadBanner,
    removeBanner,
  } = useProfile();
  const { achievements: achievementsWithState } = useAchievements();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const level = getLevelInfo(xp);

  const progressPercent = Math.round(
    (completedLessons.length / lessons.length) * 100
  );

  const coursesCompleted = modules.filter((module) =>
    module.lessons.every((lesson) => completedLessons.includes(lesson.id))
  ).length;

  const quizzesCompleted = Object.values(quizResults).filter(
    (result) => result.passed
  ).length;

  const nextLesson = lessons.find(
    (lesson) => !completedLessons.includes(lesson.id)
  );

  const skillProgress = SKILLS.map((skill) => {
    const module = modules.find((m) => m.id === skill.moduleId);
    const total = module ? module.lessons.length : 0;
    const completed = module
      ? module.lessons.filter((lesson) => completedLessons.includes(lesson.id))
          .length
      : 0;

    return {
      ...skill,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  });

  const handleSaveProfile = async (updatedProfile) => {
    setIsSaving(true);
    setSaveError("");

    try {
      await updateProfile(updatedProfile);
      setIsEditing(false);
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? error.message
          : "We couldn't save your profile. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      {isEditing ? (
        <EditProfile
          profile={profile}
          onSave={handleSaveProfile}
          onCancel={() => {
            setSaveError("");
            setIsEditing(false);
          }}
          onUploadAvatar={uploadAvatar}
          onRemoveAvatar={removeAvatar}
          isSaving={isSaving}
          saveError={saveError}
        />
      ) : (
        <ProfileHeader
          profile={profile}
          xp={xp}
          streak={streak}
          memberSince={firstSeenDate}
          lastActiveAt={user?.lastLoginAt}
          modulesCompleted={coursesCompleted}
          totalModules={modules.length}
          achievements={achievementsWithState}
          onEditClick={() => setIsEditing(true)}
          onUploadAvatar={uploadAvatar}
          onRemoveAvatar={removeAvatar}
          onUploadBanner={uploadBanner}
          onRemoveBanner={removeBanner}
        />
      )}

      <ProfileStats
        xp={xp}
        levelNumber={level.levelNumber}
        levelTitle={level.title}
        coursesCompleted={coursesCompleted}
        totalCourses={modules.length}
        lessonsCompleted={completedLessons.length}
        totalLessons={lessons.length}
        streak={streak}
        badgesEarned={achievements.length}
        totalBadges={achievementsData.length}
      />

      {/* Progress */}
      <section className="bg-fedora-surface border border-fedora-border rounded-xl p-8 shadow-sm mb-8">
        <h2 className="text-xl font-display text-fedora-text mb-1">
          Overall Progress
        </h2>
        <p className="text-fedora-muted text-sm mb-4">
          {progressPercent}% of the course complete
        </p>

        <div className="w-full h-3 bg-fedora-border rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-fedora-accent rounded-full transition-all duration-700"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-2xl font-display text-fedora-text">
              {completedLessons.length} / {lessons.length}
            </p>
            <p className="text-fedora-muted text-sm">Lessons completed</p>
          </div>
          <div>
            <p className="text-2xl font-display text-fedora-text">
              {completedLabs.length}
            </p>
            <p className="text-fedora-muted text-sm">Labs completed</p>
          </div>
          <div>
            <p className="text-2xl font-display text-fedora-text">
              {quizzesCompleted}
            </p>
            <p className="text-fedora-muted text-sm">Quizzes passed</p>
          </div>
        </div>
      </section>

      <Achievements achievementsData={achievementsData} unlockedIds={achievements} />

      {/* Learning Profile */}
      <section className="mb-8">
        <h2 className="text-xl font-display text-fedora-text mb-4">
          Learning Profile
        </h2>

        <div className="bg-fedora-surface border border-fedora-border rounded-xl p-6 mb-4">
          <p className="text-fedora-muted text-sm mb-1">
            Current Learning Path
          </p>
          <p className="text-fedora-text font-display">
            {nextLesson
              ? `${nextLesson.day} — ${nextLesson.title}`
              : "Course complete! 🎉"}
          </p>
        </div>

        <p className="text-fedora-muted text-sm mb-3">Fedora Skills</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {skillProgress.map((skill) => (
            <SkillBadge
              key={skill.label}
              label={skill.label}
              percentage={skill.percentage}
            />
          ))}
        </div>
      </section>

      {/* Learning Activity */}
      <section className="mb-8">
        <h2 className="text-xl font-display text-fedora-text mb-4">
          Learning Activity
        </h2>
        <div className="bg-fedora-surface border border-fedora-border rounded-xl p-8 text-center">
          <p className="text-4xl mb-3">🕒</p>
          <p className="text-fedora-text font-display mb-1">
            Activity timeline coming soon
          </p>
          <p className="text-fedora-muted text-sm">
            FedoraQuest doesn't track dated activity history yet — this
            section will show a real Today / Yesterday / This Week timeline
            once that's built.
          </p>
        </div>
      </section>

      {/* Learning Goals */}
      <section className="mb-8">
        <h2 className="text-xl font-display text-fedora-text mb-4">
          Learning Goals
        </h2>
        <div className="bg-fedora-surface border border-fedora-border rounded-xl p-8 text-center">
          <p className="text-4xl mb-3">🎯</p>
          <p className="text-fedora-text font-display mb-1">
            Goal setting coming soon
          </p>
          <p className="text-fedora-muted text-sm">
            Daily and weekly learning goals aren't implemented yet — this
            section will show real progress rings once that feature is built.
          </p>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="mb-8">
        <h2 className="text-xl font-display text-fedora-text mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Button
            as={Link}
            to={nextLesson ? `/lesson/${nextLesson.id}` : "/course"}
            className="text-center"
          >
            Continue Learning
          </Button>
          <Button
            as={Link}
            to="/labs"
            variant="secondary"
            className="text-center"
          >
            Open Labs
          </Button>
          <Button
            as={Link}
            to="/commands"
            variant="secondary"
            className="text-center"
          >
            Practice Commands
          </Button>
          <Button
            as={Link}
            to="/course"
            variant="secondary"
            className="text-center"
          >
            Take Quiz
          </Button>
          <Button
            as={Link}
            to="/achievements"
            variant="secondary"
            className="text-center"
          >
            View Achievements
          </Button>
        </div>
      </section>

      {/* Footer */}
      <section className="bg-fedora-surface border border-fedora-border rounded-xl p-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-fedora-muted text-xs uppercase tracking-wide mb-1">
              Member Since
            </p>
            <p className="text-fedora-text font-display">{firstSeenDate}</p>
          </div>
          <div>
            <p className="text-fedora-muted text-xs uppercase tracking-wide mb-1">
              Version
            </p>
            <p className="text-fedora-text font-display">v{version}</p>
          </div>
          <div>
            <p className="text-fedora-muted text-xs uppercase tracking-wide mb-1">
              Rank
            </p>
            <p className="text-fedora-text font-display">{level.title}</p>
          </div>
          <div>
            <p className="text-fedora-muted text-xs uppercase tracking-wide mb-1">
              Study Time
            </p>
            <p className="text-fedora-text font-display">Not yet tracked</p>
          </div>
        </div>
      </section>
    </div>
  );
}
