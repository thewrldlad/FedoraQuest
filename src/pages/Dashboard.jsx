import Header from "../components/Header/Header";
import ProgressCard from "../components/ProgressCard/ProgressCard";
import RoadmapCard from "../components/RoadmapCard/RoadmapCard";
import XPCard from "../components/XPCard/XPCard";
import ContinueLearning from "../components/Progress/ContinueLearning";
import useCourseProgress from "../hooks/useCourseProgress";

import { useGame } from "../context/GameContext";

export default function Dashboard() {
  const { streak } = useGame();
  const progress = useCourseProgress();

  return (
    <>
      <Header />

      <ContinueLearning progress={progress} />

      <section className="grid grid-cols-3 gap-4">
        <ProgressCard
          title="Progress"
          value={`${progress.courseCompletionPercent}%`}
          subtitle="Course completed"
        />

        <ProgressCard
          title="Current Module"
          value="Terminal"
          subtitle="Linux Fundamentals"
        />

        <ProgressCard
          title="Study Streak"
          value={`${streak} Days`}
          subtitle="Keep learning daily"
        />
      </section>

      <section className="grid grid-cols-3 gap-6 mt-8">
        <div className="col-span-2">
          <RoadmapCard />
        </div>

        <div>
          <XPCard />
        </div>
      </section>
    </>
  );
}
