import { Bell, Search } from "lucide-react";

export default function Header() {
  return (
    <header className="flex items-center justify-between mb-8">
      
      <div>
        <h1 className="text-3xl font-display font-medium text-fedora-text">
          Welcome back, Linux learner 👋
        </h1>

        <p className="mt-2 text-fedora-muted font-body">
          Continue your Fedora journey. Master one concept at a time.
        </p>
      </div>

      <div className="flex items-center gap-3">

        <button
          className="flex items-center gap-2 px-4 py-2 rounded-lg
          bg-fedora-surface border border-fedora-border
          text-fedora-muted hover:text-fedora-text transition-colors"
        >
          <Search size={18} />
          <span className="text-sm">
            Search
          </span>
        </button>

        <button
          className="p-2 rounded-lg
          bg-fedora-surface border border-fedora-border
          text-fedora-accent-light
          hover:bg-fedora-border transition-colors"
          aria-label="Notifications"
        >
          <Bell size={18} />
        </button>

      </div>

    </header>
  );
}
