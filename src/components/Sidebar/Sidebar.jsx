import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard,
  BookOpen,
  Terminal,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

const navItems = [
  { id: "dashboard", label: "Dashboard", path: "/", icon: LayoutDashboard },
  { id: "lessons", label: "Lessons", path: "/course", icon: BookOpen },
  { id: "commands", label: "Commands", path: "/commands", icon: Terminal },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div
      className={`h-screen flex flex-col justify-between transition-all duration-300 bg-fedora-surface border-r border-fedora-border font-body ${
        collapsed ? "w-[76px]" : "w-[248px]"
      }`}
    >
      <div>
        <div className="flex items-center justify-between px-4 py-6 border-b border-fedora-border">
          {!collapsed && (
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="font-black text-3xl italic tracking-[0.14em] whitespace-nowrap text-fedora-muted font-display uppercase">
                FEDORA
              </span>
            </div>
          )}
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="rounded-md p-1.5 shrink-0 text-fedora-muted hover:bg-fedora-border transition-colors"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
          </button>
        </div>

        <nav aria-label="Main navigation" className="flex flex-col gap-2 px-3 py-5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`flex items-center gap-3 rounded-md px-3 py-3 text-sm transition-colors ${
                  active
                    ? "bg-fedora-accent text-fedora-muted"
                    : "text-fedora-muted hover:bg-fedora-border"
                }`}
              >
                <Icon size={17} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

    </div>
  );
}
