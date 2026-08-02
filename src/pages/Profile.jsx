import { useState } from "react";
import { Link } from "react-router-dom";
import { Trophy, Flame, BookOpen, Award, Share2, Pencil } from "lucide-react";
import { version } from "../../package.json";

import { useGame } from "../context/GameContext";
import { getLevelInfo } from "../utils/xpLevel";
import lessons from "../data/lessons";
import modules from "../data/modules";
import achievementsData from "../data/achievements";

import Button from "../components/Button/Button";
import StatCard from "../components/StatCard/StatCard";
import AchievementCard from "../components/AchievementCard/AchievementCard";
import SkillBadge from "../components/SkillBadge/SkillBadge";

const DISPLAY_NAME = "THEWRLDLAD";

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

  const [copied, setCopied] = useState(false);
  const [showEditNotice, setShowEditNotice] = useState(false);

  const level = getLevelInfo(xp);
  const progressPercent = Math.round(
    (completedLessons.length / lessons.length) * 100
  );
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

  const previewAchievements = achievementsData.slice(0, 4);
  const initials = DISPLAY_NAME.slice(0, 2).toUpperCase();

  const handleShare = () => {
    const summary = `I'm ${level.title} on FedoraQuest with ${xp.toLocaleString()} XP, a ${streak}-day streak, and ${completedLessons.length} lessons completed!`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-fedora-surface border border-fedora-border rounded-xl p-8 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="w-24 h-24 rounded-full bg-fedora-accent flex items-center justify-center text-white text-3xl font-display font-semibold shrink-0">
              {initials}
            </div>

            <div>
              <h1 className="text-2xl font-display text-fedora-text">
                {DISPLAY_NAME}
              </h1>

              <div className="flex flex-wrap items-center gap-3 mt-2">
                <span className="px-3 py-1 rounded-full bg-fedora-accent text-white text-xs font-medium">
                  Level {level.levelNumber} — {level.title}
                </span>
                <span className="text-fedora-muted text-sm">
                  ⭐ {xp.toLocaleString()} XP
                </span>
                <span className="text-fedora-muted text-sm">
                  🔥 {streak} day streak
                </span>
              </div>

              <p className="text-fedora-muted text-sm italic mt-3">
                "Talk is cheap. Show me the code." — Linus Torvalds
              </p>
            </div>
          </div>

          <div className="flex gap-3 shrink-0">
            <Button
              variant="secondary"
              onClick={() => setShowEditNotice((current) => !current)}
            >
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

        {showEditNotice && (
          <p className="mt-4 text-sm text-fedora-muted bg-fedora-bg border border-fedora-border rounded-lg px-4 py-3">
            Profile editing is coming in a future update.
          </p>
        )}
      </section>

      {/* Statistics */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard
          icon={Trophy}
          title="Total XP"
          value={xp.toLocaleString()}
          subtitle={`Level ${level.levelNumber}`}
        />
        <StatCard
          icon={Flame}
          title="Current Streak"
          value={`${streak} Days`}
          subtitle="Keep it going"
        />
        <StatCard
          icon={BookOpen}
          title="Lessons Completed"
          value={completedLessons.length}
          subtitle={`of ${lessons.length} total`}
        />
        <StatCard
          icon={Award}
          title="Achievements Unlocked"
          value={achievements.length}
          subtitle={`of ${achievementsData.length} total`}
        />
      </section>

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

      {/* Achievements Preview */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-display text-fedora-text">
            Achievements
          </h2>
          <Link
            to="/achievements"
            className="text-sm text-fedora-accent-light hover:underline"
          >
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {previewAchievements.map((achievement) => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              unlocked={achievements.includes(achievement.id)}
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

      {/* Skills */}
      <section className="mb-8">
        <h2 className="text-xl font-display text-fedora-text mb-4">Skills</h2>
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
