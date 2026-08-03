import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useGame } from "../../context/GameContext";
import UserMenu from "../Auth/UserMenu";
import {
  LayoutDashboard,
  BookOpen,
  Terminal,
  FlaskConical,
  Award,
  User,
  Flame,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

const navGroups = [
  {
    label: "Learn",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        path: "/",
        icon: LayoutDashboard,
      },
      {
        id: "course",
        label: "Course",
        path: "/course",
        icon: BookOpen,
      },
    ],
  },
  {
    label: "Practice",
    items: [
      {
        id: "labs",
        label: "Labs",
        path: "/labs",
        icon: FlaskConical,
      },
      {
        id: "commands",
        label: "Commands",
        path: "/commands",
        icon: Terminal,
      },
    ],
  },
        {
  label: "Track",
  items: [
    {
      id: "achievements",
      label: "Achievements",
      path: "/achievements",
      icon: Award,
    },
    {
      id: "profile",
      label: "Profile",
      path: "/profile",
      icon: User,
    },
  ],
},
 
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { streak } = useGame();

  return (
    <div
      className={`h-screen flex flex-col justify-between transition-all duration-300 bg-fedora-surface border-r border-fedora-border font-body ${
        collapsed ? "w-[76px]" : "w-[248px]"
      }`}
    >
      <div>
        <div className="flex items-center justify-between px-4 py-5 border-b border-fedora-border">
          {!collapsed && (
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-7 h-7 rounded-md flex items-center justify-center shrink-0 bg-fedora-accent">
                <span className="text-sm font-semibold text-white font-display">
                  F
                </span>
              </div>

              <span className="font-medium text-[15px] tracking-tight whitespace-nowrap text-fedora-text font-display">
                Fedora Quest
              </span>
            </div>
          )}

          <button
            onClick={() => setCollapsed((c) => !c)}
            className="rounded-md p-1.5 shrink-0 text-fedora-muted hover:bg-fedora-border transition-colors"
          >
            {collapsed ? (
              <ChevronsRight size={16} />
            ) : (
              <ChevronsLeft size={16} />
            )}
          </button>
        </div>

        <nav className="px-3 py-4">
          {navGroups.map((group) => (
            <div key={group.label} className="mb-5">

              {!collapsed && (
                <p className="text-[11px] font-medium uppercase tracking-wider mb-2 pl-2 text-fedora-muted">
                  {group.label}
                </p>
              )}

              {group.items.map((item) => {
                const Icon = item.icon;
                const active = location.pathname === item.path;

                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    className={`flex items-center gap-3 rounded-md px-3 py-2 mb-1 text-sm transition-colors ${
                      active
                        ? "bg-fedora-accent text-white"
                        : "text-fedora-text hover:bg-fedora-border"
                    }`}
                  >
                    <Icon size={17} />

                    {!collapsed && (
                      <span>{item.label}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </div>


      <div className="border-t border-fedora-border p-3">

        <UserMenu collapsed={collapsed} />

        <div className="mt-3 rounded-md px-3 py-2.5 flex items-center gap-2 bg-fedora-bg">
          <Flame size={16} className="text-fedora-streak" />

          {!collapsed && (
            <span className="text-sm text-fedora-text">
              <span className="font-medium">
                {streak} day
              </span>{" "}
              <span className="text-fedora-muted">
                streak
              </span>
            </span>
          )}

        </div>

      </div>

    </div>
  );
}
