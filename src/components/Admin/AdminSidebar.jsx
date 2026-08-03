import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FileText,
  HelpCircle,
  Award,
  GraduationCap,
  BarChart3,
  Settings,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { label: "Users", path: "/admin/users", icon: Users },
  { label: "Courses", path: "/admin/courses", icon: BookOpen },
  { label: "Lessons", path: "/admin/lessons", icon: FileText },
  { label: "Quizzes", path: "/admin/quizzes", icon: HelpCircle },
  { label: "Achievements", path: "/admin/achievements", icon: Award },
  { label: "Certificates", path: "/admin/certificates", icon: GraduationCap },
  { label: "Analytics", path: "/admin/analytics", icon: BarChart3 },
  { label: "Settings", path: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
  const location = useLocation();

  return (
    <div className="h-screen w-[248px] flex flex-col bg-fedora-surface border-r border-fedora-border font-body shrink-0">
      <div className="flex items-center gap-2 px-4 py-5 border-b border-fedora-border">
        <div className="w-7 h-7 rounded-md flex items-center justify-center shrink-0 bg-fedora-accent">
          <span className="text-sm font-semibold text-white font-display">
            F
          </span>
        </div>
        <span className="font-medium text-[15px] tracking-tight text-fedora-text font-display truncate">
          FedoraQuest Admin
        </span>
      </div>

      <nav className="px-3 py-4 flex-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 rounded-md px-3 py-2 mb-1 text-sm transition-colors ${
                active
                  ? "bg-fedora-accent text-white"
                  : "text-fedora-text hover:bg-fedora-border"
              }`}
            >
              <Icon size={17} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-fedora-border p-3">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-fedora-muted hover:bg-fedora-border transition-colors"
        >
          ← Back to App
        </Link>
      </div>
    </div>
  );
}
