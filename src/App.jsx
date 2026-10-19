import { Navigate, Routes, Route, Outlet } from "react-router-dom";

import Sidebar from "./components/Sidebar/Sidebar";
import RoleProtectedRoute from "./auth/RoleProtectedRoute";
import AchievementNotification from "./components/Achievements/AchievementNotification";
import AdminLayout from "./components/Admin/AdminLayout";

import Dashboard from "./pages/Dashboard";
import Course from "./pages/Course";
import Labs from "./pages/Labs";
import Commands from "./pages/Commands";
import Lesson from "./pages/Lesson";
import Achievements from "./pages/Achievements";
import Certificates from "./pages/Certificates";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Unauthorized from "./pages/Unauthorized";

import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminCourses from "./pages/admin/Courses";
import AdminLessons from "./pages/admin/Lessons";
import AdminQuizzes from "./pages/admin/Quizzes";
import AdminAchievements from "./pages/admin/Achievements";
import AdminCertificates from "./pages/admin/Certificates";
import AdminAnalytics from "./pages/admin/Analytics";
import AdminSettings from "./pages/admin/Settings";

function AppLayout() {
  return (
    <div className="flex h-screen bg-fedora-bg">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-8 font-body">
        <Outlet />
      </main>

      <AchievementNotification />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/course" element={<Course />} />
        <Route path="/lesson/:id" element={<Lesson />} />
        <Route path="/labs" element={<Labs />} />
        <Route path="/commands" element={<Commands />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/certificates" element={<Certificates />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />

      <Route
        path="/admin"
        element={
          <RoleProtectedRoute roles={["admin"]}>
            <AdminLayout />
          </RoleProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="courses" element={<AdminCourses />} />
        <Route path="lessons" element={<AdminLessons />} />
        <Route path="quizzes" element={<AdminQuizzes />} />
        <Route path="achievements" element={<AdminAchievements />} />
        <Route path="certificates" element={<AdminCertificates />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
    </Routes>
  );
}

export default App;
