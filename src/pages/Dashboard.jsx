import Header from "../components/Header/Header";
import ContinueLearning from "../components/Progress/ContinueLearning";
import ProgressCard from "../components/ProgressCard/ProgressCard";
import RoadmapCard from "../components/RoadmapCard/RoadmapCard";

import useCourseProgress from "../hooks/useCourseProgress";

export default function Dashboard() {
  const progress = useCourseProgress();

  return (
    <>
      <Header />

      <ContinueLearning progress={progress} />

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mt-8">
        <ProgressCard
          title="Lessons Completed"
          value={progress.completedLessonsCount}
          subtitle={`${progress.totalLessons} total lessons`}
        />

        <ProgressCard
          title="Course Progress"
          value={`${progress.courseCompletionPercent}%`}
          subtitle="Learning progress"
        />

        <ProgressCard
          title="Modules Completed"
          value={progress.modulesCompleted}
          subtitle={`${progress.totalModules} modules`}
        />

        <ProgressCard
          title="Remaining Lessons"
          value={progress.remainingLessons}
          subtitle="Continue learning"
        />
      </section>

      <section className="mt-8">
        <RoadmapCard />
      </section>
    </>
  );
}