import { Clock } from "lucide-react";

export default function QuizTimer({ secondsRemaining }) {
  if (secondsRemaining === null || secondsRemaining === undefined) return null;

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const isLow = secondsRemaining <= 30;

  return (
    <div
      className={`flex items-center gap-2 text-sm shrink-0 ${
        isLow ? "text-red-400" : "text-fedora-muted"
      }`}
    >
      <Clock size={16} />
      <span>
        {minutes}:{String(seconds).padStart(2, "0")}
      </span>
    </div>
  );
}
