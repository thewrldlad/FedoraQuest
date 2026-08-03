import { Navigate } from "react-router-dom";
import useAuth from "./useAuth";

// Generic role gate — pass roles={["admin"]} today, or e.g.
// roles={["admin", "instructor"]} later without touching this file.
// Handles the "not logged in" case itself, so it's used standalone
// rather than nested inside ProtectedRoute.
export default function RoleProtectedRoute({ roles, children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-fedora-bg">
        <div className="w-8 h-8 border-2 border-fedora-accent-light border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
