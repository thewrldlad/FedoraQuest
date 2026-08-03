import { Navigate, useLocation } from "react-router-dom";
import useAuth from "./useAuth";

export default function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-fedora-bg">
        <div className="w-8 h-8 border-2 border-fedora-accent-light border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
