import { Link } from "react-router-dom";
import {
  BookOpen,
  FolderOpen,
  Terminal,
  FlaskConical,
} from "lucide-react";

const icons = {
  lesson: BookOpen,
  module: FolderOpen,
  command: Terminal,
  lab: FlaskConical,
};

export default function SearchResults({ results }) {
  if (!results.length) return null;

  return (
    <div className="absolute top-full mt-2 w-full rounded-xl border border-fedora-border bg-fedora-surface shadow-xl overflow-hidden z-50">
      {results.map((item) => {
        const Icon = icons[item.type] || BookOpen;

        return (
          <Link
            key={item.id}
            to={item.route}
            className="flex items-start gap-3 p-4 hover:bg-fedora-bg transition-colors border-b border-fedora-border last:border-b-0"
          >
            <Icon
              size={18}
              className="text-fedora-accent mt-1 shrink-0"
            />

            <div>
              <h4 className="font-medium text-fedora-text">
                {item.title}
              </h4>

              <p className="text-sm text-fedora-muted">
                {item.description}
              </p>

              <span className="text-xs uppercase tracking-wide text-fedora-accent-light">
                {item.type}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
