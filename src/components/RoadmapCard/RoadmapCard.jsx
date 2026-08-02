import { CheckCircle2, Circle, Lock } from "lucide-react";
import modules from "../../data/modules";
import { useGame } from "../../context/GameContext";

export default function RoadmapCard() {
  const { completedLessons, unlockedLessons } = useGame();

  const lessons = modules.flatMap((module) => module.lessons);

  return (
    <section className="bg-fedora-surface border border-fedora-border rounded-xl p-6">
      <h2 className="text-xl font-display text-fedora-text mb-1">
        Linux Learning Roadmap
      </h2>

      <p className="text-fedora-muted mb-5">
        Your journey to mastering Fedora Linux.
      </p>

      <div className="space-y-3">
        {lessons.map((lesson) => {
          const completed = completedLessons.includes(lesson.id);
          const unlocked = unlockedLessons.includes(lesson.id);

          return (
            <button
              key={lesson.id}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-fedora-border hover:scale-[1.01] transition-all duration-200 text-left cursor-pointer"
            >
              {completed ? (
                <CheckCircle2
                  size={20}
                  className="text-green-400 shrink-0"
                />
              ) : unlocked ? (
                <Circle
                  size={20}
                  className="text-fedora-muted shrink-0"
                />
              ) : (
                <Lock
                  size={20}
                  className="text-fedora-muted shrink-0"
                />
              )}

              <span
                className={`${
                  completed
                    ? "text-fedora-text font-medium"
                    : "text-fedora-muted"
                }`}
              >
                {lesson.title}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
