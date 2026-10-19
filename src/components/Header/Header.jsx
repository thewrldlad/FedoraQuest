import { Bell, Search } from "lucide-react";
import useSearch from "../../hooks/useSearch";
import SearchResults from "../Search/SearchResults";

export default function Header() {
  const { query, setQuery, results } = useSearch();

  return (
    <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
      <div>
        <h1 className="text-3xl font-display font-medium text-fedora-text">
          Welcome back, Linux learner 👋
        </h1>

        <p className="mt-2 text-fedora-muted">
          Continue your Fedora journey. Master one concept at a time.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-80">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-fedora-muted"
          />

          <input
            type="text"
            placeholder="Search lessons, labs, commands..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-fedora-surface border border-fedora-border text-fedora-text placeholder:text-fedora-muted focus:outline-none focus:ring-2 focus:ring-fedora-accent"
          />

          <SearchResults results={results} />
        </div>

        <button
          className="p-2 rounded-lg bg-fedora-surface border border-fedora-border text-fedora-accent-light hover:bg-fedora-border transition-colors"
          aria-label="Notifications"
        >
          <Bell size={18} />
        </button>
      </div>
    </header>
  );
}