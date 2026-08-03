import { Bell } from "lucide-react";
import UserMenu from "../Auth/UserMenu";
import SearchBar from "./SearchBar";

export default function AdminHeader({ searchTerm, onSearch }) {
  return (
    <header className="flex items-center justify-between gap-4 px-6 py-4 border-b border-fedora-border bg-fedora-surface">
      <div className="flex-1 max-w-md">
        <SearchBar
          value={searchTerm}
          onChange={onSearch}
          placeholder="Search users, courses, lessons, quizzes..."
        />
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <button
          className="p-2 rounded-lg bg-fedora-bg border border-fedora-border text-fedora-accent-light hover:bg-fedora-border transition-colors"
          aria-label="Notifications"
        >
          <Bell size={18} />
        </button>

        <div className="w-56">
          <UserMenu collapsed={false} direction="down" />
        </div>
      </div>
    </header>
  );
}
