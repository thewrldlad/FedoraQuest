import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  BookOpen,
  FileText,
  HelpCircle,
  GraduationCap,
  Award,
  Trophy,
} from "lucide-react";
import { useGame } from "../../context/GameContext";
import useAdmin from "../../hooks/useAdmin";
import StatCard from "../../components/StatCard/StatCard";

export default function AdminDashboard() {
  const { xp, achievements } = useGame();
  const { users, refreshUsers, certificates, refreshCertificates, courses, lessons, quizzes } =
    useAdmin();

  useEffect(() => {
    refreshUsers();
    refreshCertificates();
  }, [refreshUsers, refreshCertificates]);

  const activeUsers = users.filter((user) => user.active !== false).length;
  const certificatesIssued = certificates.length;

  return (
    <div>
      <h1 className="text-2xl font-display text-fedora-text mb-1">
        Admin Dashboard
      </h1>
      <p className="text-fedora-muted mb-6">
        Platform overview and management.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard icon={Users} title="Total Users" value={users.length} />
        <StatCard icon={Users} title="Active Users" value={activeUsers} />
        <StatCard
          icon={BookOpen}
          title="Courses"
          value={courses.items.length}
        />
        <StatCard
          icon={FileText}
          title="Lessons"
          value={lessons.items.length}
        />
        <StatCard
          icon={HelpCircle}
          title="Quizzes"
          value={quizzes.items.length}
        />
        <StatCard
          icon={GraduationCap}
          title="Certificates Issued"
          value={certificatesIssued}
        />
        <StatCard
          icon={Award}
          title="Achievements Earned"
          value={achievements.length}
          subtitle="Your account only"
        />
        <StatCard
          icon={Trophy}
          title="Total XP Awarded"
          value={xp.toLocaleString()}
          subtitle="Your account only"
        />
      </div>

      <section className="bg-fedora-surface border border-fedora-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-display text-fedora-text">
            Analytics Preview
          </h2>
          <Link
            to="/admin/analytics"
            className="text-sm text-fedora-accent-light hover:underline"
          >
            View full analytics →
          </Link>
        </div>
        <p className="text-fedora-muted text-sm">
          "Achievements Earned" and "Total XP Awarded" reflect your own
          admin account's progress only — a true cross-user total needs
          a Firestore aggregation query (or a Cloud Function that keeps a
          running total) reading every user's progress document, which
          is future work beyond this migration.
        </p>
      </section>
    </div>
  );
}
