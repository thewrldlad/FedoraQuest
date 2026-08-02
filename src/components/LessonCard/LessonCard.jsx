import { Link } from "react-router-dom";
import Button from "../Button/Button";

export default function LessonCard({
  day,
  title,
  description,
  buttonText,
  lessonId,
}) {
  return (
    <section className="bg-fedora-surface border border-fedora-border rounded-xl p-6 mb-6 shadow-sm">
      <p className="text-sm uppercase tracking-wider text-fedora-muted mb-2">
        Today's Lesson
      </p>

      <h2 className="text-2xl font-display text-fedora-text mb-3">
        {day} — {title}
      </h2>

      <p className="text-fedora-text leading-7 mb-5">
        {description}
      </p>

      <Button as={Link} to={`/lesson/${lessonId}`}>
        {buttonText}
      </Button>
    </section>
  );
}
