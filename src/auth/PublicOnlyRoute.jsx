import { Navigate } from "react-router-dom";
import useAuth from "./useAuth";

// Not in the originally suggested file list, but needed to avoid
// duplicating the same "already logged in? redirect home" check across
// Login, Register, and ForgotPassword individually.
export default function PublicOnlyRoute({ children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
}
