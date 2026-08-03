import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";

import useAuth from "../auth/useAuth";
import Button from "../components/Button/Button";
import AuthLayout from "../components/Auth/AuthLayout";
import AuthCard from "../components/Auth/AuthCard";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
});

export default function ForgotPassword() {
  const { requestPasswordReset } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data) => {
    setServerError("");
    try {
      await requestPasswordReset(data.email);
      setSubmitted(true);
    } catch (err) {
      setServerError(err.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <AuthLayout>
      <AuthCard
        title="Reset your password"
        subtitle="Enter your email and we'll send you reset instructions."
      >
        {submitted ? (
          <div className="text-center">
            <p className="text-fedora-text mb-4">
              If an account exists for that email, password reset
              instructions have been sent.
            </p>
            <Link
              to="/login"
              className="text-fedora-accent-light hover:underline text-sm"
            >
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm text-fedora-muted mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full bg-fedora-bg border border-fedora-border rounded-lg px-3 py-2 text-fedora-text focus:outline-none focus:border-fedora-accent"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {serverError && (
              <p className="text-red-400 text-sm bg-fedora-bg border border-fedora-border rounded-lg px-4 py-3">
                {serverError}
              </p>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full text-center"
            >
              {isSubmitting ? "Sending..." : "Send Reset Link"}
            </Button>

            <p className="text-fedora-muted text-sm text-center">
              Remembered your password?{" "}
              <Link
                to="/login"
                className="text-fedora-accent-light hover:underline"
              >
                Login
              </Link>
            </p>
          </form>
        )}
      </AuthCard>
    </AuthLayout>
  );
}
