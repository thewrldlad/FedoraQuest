import { CheckCircle2, Circle } from "lucide-react";

const lessons = [
  { title: "Terminal Navigation", completed: true },
  { title: "Files & Directories", completed: false },
  { title: "Package Management", completed: false },
  { title: "Permissions", completed: false },
  { title: "Users & Groups", completed: false },
  { title: "Processes", completed: false },
  { title: "Networking", completed: false },
  { title: "Bash Scripting", completed: false },
];

export default function RoadmapCard() {
  return (
    <section className="bg-fedora-surface border border-fedora-border rounded-xl p-6">
      <h2 className="text-xl font-display text-fedora-text mb-1">
        Linux Learning Roadmap
      </h2>

      <p className="text-fedora-muted mb-5">
        Your journey to mastering Fedora Linux.
      </p>

      <div className="space-y-3">
        {lessons.map((lesson) => (
          <button
  key={lesson.title}
  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-fedora-border hover:scale-[1.01] transition-all duration-200 text-left cursor-pointer"
>
            {lesson.completed ? (
              <CheckCircle2
                size={20}
                className="text-green-400 shrink-0"
              />
            ) : (
              <Circle
                size={20}
                className="text-fedora-muted shrink-0"
              />
            )}

            <span
              className={`${
                lesson.completed
                  ? "text-fedora-text font-medium"
                  : "text-fedora-muted"
              }`}
            >
              {lesson.title}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
