import { BookOpen, Layers, Flame, Trophy } from "lucide-react";
import StatCard from "../StatCard/StatCard";

export default function CourseStats({ stats }) {
  return (
    <section className="mb-8">
      <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-fedora-muted mb-4">
        <span>
          Courses started:{" "}
          <span className="text-fedora-text">{stats.coursesStarted}</span>
        </span>
        <span>
          Courses completed:{" "}
          <span className="text-fedora-text">{stats.coursesCompleted}</span>
        </span>
        <span>
          Hours studied:{" "}
          <span className="text-fedora-text">Not yet tracked</span>
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          icon={BookOpen}
          title="Lessons Completed"
          value={stats.lessonsCompleted}
          subtitle={`of ${stats.totalLessons} total`}
        />
        <StatCard
          icon={Layers}
          title="Modules Completed"
          value={stats.modulesCompleted}
          subtitle={`of ${stats.totalModules} total`}
        />
        <StatCard
          icon={Flame}
          title="Streak"
          value={`${stats.currentStreak} days`}
          subtitle={`Longest: ${stats.longestStreak} days`}
        />
        <StatCard
          icon={Trophy}
          title="Total XP"
          value={stats.totalXP.toLocaleString()}
          subtitle="Across lessons & labs"
        />
      </div>
    </section>
  );
}
