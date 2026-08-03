import { Routes, Route, Outlet } from "react-router-dom";

import Sidebar from "./components/Sidebar/Sidebar";
import ProtectedRoute from "./auth/ProtectedRoute";
import PublicOnlyRoute from "./auth/PublicOnlyRoute";

import Dashboard from "./pages/Dashboard";
import Course from "./pages/Course";
import Labs from "./pages/Labs";
import Commands from "./pages/Commands";
import Lesson from "./pages/Lesson";
import Achievements from "./pages/Achievements";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

function AppLayout() {
  return (
    <div className="flex h-screen bg-fedora-bg">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-8 font-body">
        <Outlet />
      </main>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <Register />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicOnlyRoute>
            <ForgotPassword />
          </PublicOnlyRoute>
        }
      />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/course" element={<Course />} />
        <Route path="/lesson/:id" element={<Lesson />} />
        <Route path="/labs" element={<Labs />} />
        <Route path="/commands" element={<Commands />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;
