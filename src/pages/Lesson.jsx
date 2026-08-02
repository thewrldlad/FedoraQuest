import { useNavigate, useParams } from "react-router-dom";
import lessons from "../data/lessons";
import { useGame } from "../context/GameContext";

export default function Lesson() {
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    addXP,
    completedLessons,
    setCompletedLessons,
    setUnlockedLessons,
  } = useGame();

const lesson = lessons.find(
  (lesson) => lesson.id === Number(id)
);

if (!lesson) {
  return (
    <div>
      <h1 className="text-3xl text-fedora-text">
        Lesson not found
      </h1>
    </div>
  );
}
const isCompleted = completedLessons.includes(lesson.id); 

 return (
    <div>
      <h1 className="text-3xl font-display text-fedora-text mb-4">
        {lesson.title}
      </h1>

      <div className="bg-fedora-surface border border-fedora-border rounded-xl p-6">
        <h2 className="text-xl font-display text-fedora-text mb-4">
          Introduction
        </h2>

        <p className="text-fedora-text leading-8">
           {lesson.description}
        </p>

        <div className="mt-8">
          <button
  disabled={isCompleted}
  onClick={() => {
    if (isCompleted) return;
  
   addXP(100);
   setCompletedLessons((current) => {
  if (current.includes(lesson.id)) return current;
  return [...current, lesson.id];
});

setUnlockedLessons((current) => {
  const nextLessonId = lesson.id + 1;

  if (!lessons.find((l) => l.id === nextLessonId)) {
    return current;
  }

  if (current.includes(nextLessonId)) {
    return current;
  }

  return [...current, nextLessonId];
});

navigate("/");     
  }}
  className={`px-5 py-2 rounded-lg text-white transition-opacity ${
    isCompleted
      ? "bg-green-600 cursor-not-allowed"
      : "bg-fedora-accent hover:opacity-90"
  }`}
>
  {isCompleted
  ? "✓ Lesson Completed"
  : "Mark Lesson Complete"}
</button>
        </div>
      </div>
    </div>
  );
}
