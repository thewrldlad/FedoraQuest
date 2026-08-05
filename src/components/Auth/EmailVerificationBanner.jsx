import { useState } from "react";
import { CheckCircle2, Mail } from "lucide-react";
import useAuth from "../../auth/useAuth";

export default function EmailVerificationBanner() {
  const { user, resendEmailVerification, refreshEmailVerification } = useAuth();
  const [isSending, setIsSending] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  if (!user || user.emailVerified) return null;

  const resend = async () => {
    setError("");
    setMessage("");
    setIsSending(true);
    try {
      await resendEmailVerification();
      setMessage("A new verification email has been sent.");
    } catch (sendError) {
      setError(sendError.message || "We couldn't send another verification email.");
    } finally {
      setIsSending(false);
    }
  };

  const checkVerification = async () => {
    setError("");
    setMessage("");
    setIsChecking(true);
    try {
      const refreshedUser = await refreshEmailVerification();
      setMessage(
        refreshedUser.emailVerified
          ? "Your email address is verified."
          : "Your email is not verified yet. Check your inbox, then try again."
      );
    } catch (checkError) {
      setError(checkError.message || "We couldn't check your verification status.");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="mb-6 rounded-xl border border-fedora-accent/50 bg-fedora-accent/10 p-4" role="status">
      <div className="flex gap-3">
        <Mail className="mt-0.5 shrink-0 text-fedora-accent-light" size={20} aria-hidden="true" />
        <div className="min-w-0">
          <p className="font-medium text-fedora-text">Verify your email address</p>
          <p className="mt-1 text-sm text-fedora-muted">
            We sent a verification link to {user.email}. Verify it to help protect your account.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" onClick={resend} disabled={isSending} className="text-sm font-medium text-fedora-accent-light hover:text-fedora-text disabled:cursor-not-allowed disabled:opacity-60">
              {isSending ? "Sending..." : "Resend email"}
            </button>
            <button type="button" onClick={checkVerification} disabled={isChecking} className="text-sm font-medium text-fedora-accent-light hover:text-fedora-text disabled:cursor-not-allowed disabled:opacity-60">
              {isChecking ? "Checking..." : "I've verified it"}
            </button>
          </div>
          {message && <p className="mt-2 flex items-center gap-1.5 text-sm text-green-400"><CheckCircle2 size={15} aria-hidden="true" />{message}</p>}
          {error && <p role="alert" className="mt-2 text-sm text-red-300">{error}</p>}
        </div>
      </div>
    </div>
  );
}
