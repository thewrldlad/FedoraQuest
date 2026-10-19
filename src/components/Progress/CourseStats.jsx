import { BookOpen, Layers, CircleCheck, Clock } from "lucide-react";
import StatCard from "../StatCard/StatCard";

export default function CourseStats({ stats }) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      <StatCard
        icon={BookOpen}
        title="Lessons Completed"
        value={stats.lessonsCompleted}
        subtitle={`of ${stats.totalLessons} lessons`}
      />

      <StatCard
        icon={Layers}
        title="Modules Completed"
        value={stats.modulesCompleted}
        subtitle={`of ${stats.totalModules} modules`}
      />

      <StatCard
        icon={CircleCheck}
        title="Courses Started"
        value={stats.coursesStarted}
        subtitle="Fedora learning path"
      />

      <StatCard
        icon={Clock}
        title="Course Status"
        value={stats.coursesCompleted > 0 ? "Completed" : "In Progress"}
        subtitle="Keep learning consistently"
      />
    </section>
  );
}