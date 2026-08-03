import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  BookOpen,
  Award,
  GraduationCap,
  Settings,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import useAuth from "../../auth/useAuth";

export default function UserMenu({ collapsed, direction = "up" }) {
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
        <div
          className={`absolute left-0 w-56 bg-fedora-surface border border-fedora-border rounded-lg shadow-lg py-2 z-10 ${
            direction === "down" ? "top-full mt-2" : "bottom-full mb-2"
          }`}
        >
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

          <Link
            to="/certificates"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-fedora-text hover:bg-fedora-border transition-colors"
          >
            <GraduationCap size={16} /> Certificates
          </Link>

          <Link
            to="/settings"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-fedora-text hover:bg-fedora-border transition-colors"
          >
            <Settings size={16} /> Settings
          </Link>

          {user.role === "admin" && (
            <Link
              to="/admin"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-fedora-accent-light hover:bg-fedora-border transition-colors"
            >
              <ShieldCheck size={16} /> Admin Dashboard
            </Link>
          )}

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
