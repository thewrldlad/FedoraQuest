import { useState } from "react";
import { Link } from "react-router-dom";
import { version } from "../../package.json";

import { useGame } from "../context/GameContext";
import useAuth from "../auth/useAuth";
import useProfile from "../hooks/useProfile";

import lessons from "../data/lessons";
import modules from "../data/modules";

import ProfileHeader from "../components/Profile/ProfileHeader";
import EditProfile from "../components/Profile/EditProfile";
import ProfileStats from "../components/Profile/ProfileStats";
import LearningActivity from "../components/Profile/LearningActivity";
import LearningGoals from "../components/Profile/LearningGoals";
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
    completedLessons,
    completedLabs,
    quizResults,
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

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const progressPercent = Math.round(
    (completedLessons.length / lessons.length) * 100
  );

  const coursesCompleted = modules.filter((module) =>
    module.lessons.every((lesson) =>
      completedLessons.includes(lesson.id)
    )
  ).length;

  const quizzesCompleted = Object.values(quizResults).filter(
    (result) => result.passed
  ).length;

  const nextLesson = lessons.find(
    (lesson) => !completedLessons.includes(lesson.id)
  );

  const skillProgress = SKILLS.map((skill) => {
    const module = modules.find(
      (m) => m.id === skill.moduleId
    );

    const total = module ? module.lessons.length : 0;

    const completed = module
      ? module.lessons.filter((lesson) =>
          completedLessons.includes(lesson.id)
        ).length
      : 0;

    return {
      ...skill,
      percentage:
        total > 0
          ? Math.round((completed / total) * 100)
          : 0,
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
          : "Couldn't save profile."
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
          memberSince={firstSeenDate}
          lastActiveAt={user?.lastLoginAt}
          lessonsCompleted={completedLessons.length}
          totalLessons={lessons.length}
          completedLabs={completedLabs.length}
          quizzesCompleted={quizzesCompleted}
          modulesCompleted={coursesCompleted}
          totalModules={modules.length}
          onEditClick={() => setIsEditing(true)}
          onUploadAvatar={uploadAvatar}
          onRemoveAvatar={removeAvatar}
          onUploadBanner={uploadBanner}
          onRemoveBanner={removeBanner}
        />
      )}

      <ProfileStats
        coursesCompleted={coursesCompleted}
        totalCourses={modules.length}
        lessonsCompleted={completedLessons.length}
        totalLessons={lessons.length}
        completedLabs={completedLabs.length}
        quizzesCompleted={quizzesCompleted}
      />

      <section className="bg-fedora-surface border border-fedora-border rounded-xl p-8 mb-8">
        <h2 className="text-xl font-display text-fedora-text mb-2">
          Learning Progress
        </h2>

        <div className="w-full h-3 bg-fedora-border rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-fedora-accent"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <p className="text-fedora-muted">
          {progressPercent}% of the course completed.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-display text-fedora-text mb-4">
          Fedora Skills
        </h2>

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

      <LearningActivity
        completedLessons={completedLessons.length}
        completedLabs={completedLabs.length}
        quizzesCompleted={quizzesCompleted}
      />

      <LearningGoals
        lessonsCompleted={completedLessons.length}
        totalLessons={lessons.length}
        coursesCompleted={coursesCompleted}
        totalCourses={modules.length}
        nextLesson={nextLesson}
        progressPercent={progressPercent}
      />

      <section className="mb-8">
        <h2 className="text-xl font-display text-fedora-text mb-4">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button
            as={Link}
            to={nextLesson ? `/lesson/${nextLesson.id}` : "/course"}
          >
            Continue Learning
          </Button>

          <Button
            as={Link}
            to="/labs"
            variant="secondary"
          >
            Open Labs
          </Button>

          <Button
            as={Link}
            to="/commands"
            variant="secondary"
          >
            Practice Commands
          </Button>

          <Button
            as={Link}
            to="/course"
            variant="secondary"
          >
            Course
          </Button>
        </div>
      </section>

      <section className="bg-fedora-surface border border-fedora-border rounded-xl p-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-xs text-fedora-muted">
              Member Since
            </p>
            <p className="text-fedora-text">
              {firstSeenDate}
            </p>
          </div>

          <div>
            <p className="text-xs text-fedora-muted">
              Version
            </p>
            <p className="text-fedora-text">
              v{version}
            </p>
          </div>

          <div>
            <p className="text-xs text-fedora-muted">
              Modules
            </p>
            <p className="text-fedora-text">
              {coursesCompleted}/{modules.length}
            </p>
          </div>

          <div>
            <p className="text-xs text-fedora-muted">
              Status
            </p>
            <p className="text-fedora-text">
              Learning
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}