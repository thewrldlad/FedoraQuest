import { Trophy, Flame, BookOpen, Award, GraduationCap, Layers } from "lucide-react";
import StatCard from "../StatCard/StatCard";

export default function ProfileStats({
  xp,
  levelNumber,
  levelTitle,
  coursesCompleted,
  totalCourses,
  lessonsCompleted,
  totalLessons,
  streak,
  badgesEarned,
  totalBadges,
}) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
      <StatCard
        icon={Trophy}
        title="Total XP"
        value={xp.toLocaleString()}
        subtitle={`Level ${levelNumber}`}
      />
      <StatCard
        icon={GraduationCap}
        title="Current Level"
        value={levelTitle}
        subtitle={`Level ${levelNumber} of 6`}
      />
      <StatCard
        icon={Layers}
        title="Courses Completed"
        value={coursesCompleted}
        subtitle={`of ${totalCourses} modules`}
      />
      <StatCard
        icon={BookOpen}
        title="Lessons Completed"
        value={lessonsCompleted}
        subtitle={`of ${totalLessons} total`}
      />
      <StatCard
        icon={Flame}
        title="Learning Streak"
        value={`${streak} Days`}
        subtitle="Keep it going"
      />
      <StatCard
        icon={Award}
        title="Badges Earned"
        value={badgesEarned}
        subtitle={`of ${totalBadges} total`}
      />
    </section>
  );
}
