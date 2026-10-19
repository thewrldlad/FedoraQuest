import {
  BookOpen,
  TerminalSquare,
  CircleCheck,
  Layers,
  Calendar,
  User,
} from "lucide-react";
import StatCard from "../StatCard/StatCard";

export default function ProfileStats({
  coursesCompleted,
  totalCourses,
  lessonsCompleted,
  totalLessons,
  completedLabs,
  quizzesCompleted,
}) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
      <StatCard
        icon={Layers}
        title="Modules Completed"
        value={coursesCompleted}
        subtitle={`of ${totalCourses} modules`}
      />

      <StatCard
        icon={BookOpen}
        title="Lessons Completed"
        value={lessonsCompleted}
        subtitle={`of ${totalLessons} lessons`}
      />

      <StatCard
        icon={TerminalSquare}
        title="Labs Completed"
        value={completedLabs}
        subtitle="Hands-on practice"
      />

      <StatCard
        icon={CircleCheck}
        title="Quizzes Passed"
        value={quizzesCompleted}
        subtitle="Knowledge checks"
      />

      <StatCard
        icon={Calendar}
        title="Learning Status"
        value="Active"
        subtitle="Keep progressing"
      />

      <StatCard
        icon={User}
        title="Profile"
        value="Complete"
        subtitle="Keep your information updated"
      />
    </section>
  );
}