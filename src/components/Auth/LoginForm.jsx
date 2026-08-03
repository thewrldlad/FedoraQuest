import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate, useLocation } from "react-router-dom";

import useAuth from "../../auth/useAuth";
import Button from "../Button/Button";
import PasswordInput from "./PasswordInput";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const onSubmit = async (data) => {
    setServerError("");
    try {
      await login(data.email, data.password, data.rememberMe);
      const redirectTo = location.state?.from?.pathname || "/";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setServerError(err.message || "Something went wrong. Please try again.");
    }
  };

  return (
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
          <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
        )}
      </div>

      <PasswordInput
        id="password"
        label="Password"
        error={errors.password?.message}
        {...register("password")}
      />

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-fedora-muted">
          <input
            type="checkbox"
            className="accent-fedora-accent"
            {...register("rememberMe")}
          />
          Remember me
        </label>

        <Link
          to="/forgot-password"
          className="text-sm text-fedora-accent-light hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      {serverError && (
        <p className="text-red-400 text-sm bg-fedora-bg border border-fedora-border rounded-lg px-4 py-3">
          {serverError}
        </p>
      )}

      <Button type="submit" disabled={isSubmitting} className="w-full text-center">
        {isSubmitting ? "Logging in..." : "Login"}
      </Button>

      <p className="text-fedora-muted text-sm text-center">
        Don't have an account?{" "}
        <Link to="/register" className="text-fedora-accent-light hover:underline">
          Register
        </Link>
      </p>
    </form>
  );
}
