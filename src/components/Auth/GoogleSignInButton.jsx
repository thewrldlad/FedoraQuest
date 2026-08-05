import { useState } from "react";
import useAuth from "../../auth/useAuth";

export default function GoogleSignInButton({ onSuccess, beforeSignIn }) {
  const { loginWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleClick = async () => {
    setError("");
    if (beforeSignIn && !(await beforeSignIn())) return;

    setIsLoading(true);
    try {
      await loginWithGoogle();
      onSuccess?.();
    } catch (signInError) {
      setError(signInError.message || "Google sign-in failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={isLoading}
        className="flex w-full items-center justify-center gap-3 rounded-lg border border-fedora-border bg-fedora-surface px-4 py-2.5 text-sm font-medium text-fedora-text transition-colors hover:bg-fedora-border disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fedora-accent-light"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
          <path fill="#4285F4" d="M21.8 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.5a4.7 4.7 0 0 1-2 3.1v2.5h3.2c1.9-1.8 3.1-4.4 3.1-7.4Z" />
          <path fill="#34A853" d="M12 22c2.7 0 5-.9 6.7-2.4l-3.2-2.5c-.9.6-2 .9-3.5.9-2.7 0-5-1.8-5.8-4.3H2.9v2.6A10 10 0 0 0 12 22Z" />
          <path fill="#FBBC05" d="M6.2 13.7A6 6 0 0 1 5.9 12c0-.6.1-1.2.3-1.7V7.7H2.9A10 10 0 0 0 2 12c0 1.6.4 3.1.9 4.3l3.3-2.6Z" />
          <path fill="#EA4335" d="M12 6a5.4 5.4 0 0 1 3.9 1.5l2.9-2.9A9.8 9.8 0 0 0 2.9 7.7l3.3 2.6C7 7.8 9.3 6 12 6Z" />
        </svg>
        {isLoading ? "Connecting to Google..." : "Continue with Google"}
      </button>
      {error && (
        <p role="alert" className="rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}
