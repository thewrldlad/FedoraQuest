import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, BookOpen, Award, Settings, LogOut } from "lucide-react";
import useAuth from "../../auth/useAuth";

export default function UserMenu({ collapsed }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  if (!user) return null;

  const initials = (user.fullName || user.username || "?")
    .trim()
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    navigate("/login", { replace: true });
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((current) => !current)}
        className="w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm text-fedora-text hover:bg-fedora-border transition-colors"
      >
        <div className="w-7 h-7 rounded-full bg-fedora-accent flex items-center justify-center text-white text-xs font-display font-semibold shrink-0">
          {initials}
        </div>
        {!collapsed && <span className="truncate">{user.fullName}</span>}
      </button>

      {open && (
        <div className="absolute bottom-full left-0 mb-2 w-56 bg-fedora-surface border border-fedora-border rounded-lg shadow-lg py-2 z-10">
          <Link
            to="/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-fedora-text hover:bg-fedora-border transition-colors"
          >
            <User size={16} /> My Profile
          </Link>

          <Link
            to="/course"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-fedora-text hover:bg-fedora-border transition-colors"
          >
            <BookOpen size={16} /> My Courses
          </Link>

          <Link
            to="/achievements"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-fedora-text hover:bg-fedora-border transition-colors"
          >
            <Award size={16} /> Achievements
          </Link>

          <div className="flex items-center gap-2 px-4 py-2 text-sm text-fedora-muted cursor-not-allowed">
            <Settings size={16} /> Settings
            <span className="text-xs">(soon)</span>
          </div>

          <div className="border-t border-fedora-border my-1" />

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-fedora-text hover:bg-fedora-border transition-colors"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      )}
    </div>
  );
}
