import { useState } from "react";
import { Link } from "react-router-dom";
import modules from "../data/modules";
import { useGame } from "../context/GameContext";

export default function Course() {
  const { unlockedLessons, completedLessons } = useGame();
  const [expandedModules, setExpandedModules] = useState([1]);

  return (
    <div>
      <h1 className="text-3xl font-display text-fedora-text mb-2">
        Fedora Linux Course
      </h1>

      <p className="text-fedora-muted mb-8">
        Follow the complete learning path from beginner to advanced.
      </p>

      <div className="space-y-8">
        {modules.map((module) => (
          <div key={module.id}>
            <button
              onClick={() => {
                setExpandedModules((current) =>
                  current.includes(module.id)
                    ? current.filter((id) => id !== module.id)
                    : [...current, module.id]
                );
              }}
              className="flex items-center gap-2 text-2xl font-display text-fedora-text mb-2 hover:text-fedora-accent transition-colors"
            >
              <span>
                {expandedModules.includes(module.id) ? "▼" : "▶"}
              </span>

              <span>{module.title}</span>
            </button>

            <p className="text-fedora-muted mb-4">
              {module.description}
            </p>

            {expandedModules.includes(module.id) && (
              <div className="space-y-4">
                {module.lessons.map((lesson) => {
                  const unlocked = unlockedLessons.includes(lesson.id);
                  const completed = completedLessons.includes(lesson.id);

                  return (
                    <div
                      key={lesson.id}
                      className="bg-fedora-surface border border-fedora-border rounded-xl p-5"
                    >
                      <p className="text-fedora-muted text-sm">
                        {lesson.day}
                      </p>

                      {unlocked ? (
                        <Link
                          to={`/lesson/${lesson.id}`}
                          className="block mt-1 text-xl font-display text-fedora-text hover:text-fedora-accent transition-colors"
                        >
                          {lesson.title}
                        </Link>
                      ) : (
                        <span className="block mt-1 text-xl font-display text-gray-500">
                          🔒 {lesson.title}
                        </span>
                      )}

                      <p className="mt-3 text-sm">
                        {completed
                          ? "✅ Completed"
                          : unlocked
                          ? "▶️ Ready to Start"
                          : "🔒 Locked"}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
