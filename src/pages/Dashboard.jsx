import Header from "../components/Header/Header";
import LessonCard from "../components/LessonCard/LessonCard";
import ProgressCard from "../components/ProgressCard/ProgressCard";
import RoadmapCard from "../components/RoadmapCard/RoadmapCard";
import XPCard from "../components/XPCard/XPCard";
import lessons from "../data/lessons";

import { useGame } from "../context/GameContext";

export default function Dashboard() {
  const {
    completedLessons,
    streak,
  } = useGame();

  const progress = Math.round(
    (completedLessons.length / lessons.length) * 100
  );

  const nextLesson = lessons.find(
    (lesson) => !completedLessons.includes(lesson.id)
  );

  return (
    <>
      <Header />

      {nextLesson ? (
        <LessonCard
          day={nextLesson.day}
          title={nextLesson.title}
          description={nextLesson.description}
          buttonText="Continue Learning"
          lessonId={nextLesson.id}
        />
      ) : (
        <section className="bg-fedora-surface border border-fedora-border rounded-xl p-6">
          <h2 className="text-2xl font-display text-fedora-text">
            🎉 Course Complete!
          </h2>

          <p className="text-fedora-muted mt-3">
            Congratulations! You've completed every lesson.
          </p>
        </section>
      )}

      <section className="grid grid-cols-3 gap-4">
        <ProgressCard
          title="Progress"
          value={`${progress}%`}
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
