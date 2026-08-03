import { Link } from "react-router-dom";
import Button from "../components/Button/Button";

export default function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20">
      <p className="text-4xl mb-3">🔒</p>
      <h1 className="text-2xl font-display text-fedora-text mb-2">
        Access Denied
      </h1>
      <p className="text-fedora-muted mb-6 max-w-sm">
        You don't have permission to view this page. This area is
        restricted to administrators.
      </p>
      <Button as={Link} to="/">
        Back to Dashboard
      </Button>
    </div>
  );
}
