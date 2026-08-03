import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";

import useAuth from "../../auth/useAuth";
import { getPasswordStrength } from "../../auth/authService";
import Button from "../Button/Button";
import PasswordInput from "./PasswordInput";

const registerSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Only letters, numbers, and underscores allowed"
      ),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms to continue",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function RegisterForm() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  const password = useWatch({ control, name: "password" });
  const strength = getPasswordStrength(password);

  const onSubmit = async (data) => {
    setServerError("");
    try {
      await registerUser(data.fullName, data.username, data.email, data.password);
      navigate("/", { replace: true });
    } catch (err) {
      setServerError(err.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label
          htmlFor="fullName"
          className="block text-sm text-fedora-muted mb-1"
        >
          Full Name
        </label>
        <input
          id="fullName"
          type="text"
          className="w-full bg-fedora-bg border border-fedora-border rounded-lg px-3 py-2 text-fedora-text focus:outline-none focus:border-fedora-accent"
          {...register("fullName")}
        />
        {errors.fullName && (
          <p className="text-red-400 text-xs mt-1">
            {errors.fullName.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="username"
          className="block text-sm text-fedora-muted mb-1"
        >
          Username
        </label>
        <input
          id="username"
          type="text"
          className="w-full bg-fedora-bg border border-fedora-border rounded-lg px-3 py-2 text-fedora-text focus:outline-none focus:border-fedora-accent"
          {...register("username")}
        />
        {errors.username && (
          <p className="text-red-400 text-xs mt-1">
            {errors.username.message}
          </p>
        )}
      </div>

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

      <div>
        <PasswordInput
          id="password"
          label="Password"
          error={errors.password?.message}
          {...register("password")}
        />

        {password && (
          <div className="mt-2">
            <div className="flex gap-1">
              {[0, 1, 2, 3].map((index) => (
                <div
                  key={index}
                  className={`h-1.5 flex-1 rounded-full ${
                    index <= strength.score
                      ? strength.score <= 1
                        ? "bg-red-400"
                        : strength.score === 2
                        ? "bg-yellow-400"
                        : "bg-green-400"
                      : "bg-fedora-border"
                  }`}
                />
              ))}
            </div>
            <p className="text-fedora-muted text-xs mt-1">
              Password strength: {strength.label}
            </p>
          </div>
        )}
      </div>

      <PasswordInput
        id="confirmPassword"
        label="Confirm Password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      <div>
        <label className="flex items-start gap-2 text-sm text-fedora-muted">
          <input
            type="checkbox"
            className="accent-fedora-accent mt-0.5"
            {...register("acceptTerms")}
          />
          <span>I accept the Terms of Service and Privacy Policy</span>
        </label>
        {errors.acceptTerms && (
          <p className="text-red-400 text-xs mt-1">
            {errors.acceptTerms.message}
          </p>
        )}
      </div>

      {serverError && (
        <p className="text-red-400 text-sm bg-fedora-bg border border-fedora-border rounded-lg px-4 py-3">
          {serverError}
        </p>
      )}

      <Button type="submit" disabled={isSubmitting} className="w-full text-center">
        {isSubmitting ? "Creating account..." : "Create Account"}
      </Button>

      <p className="text-fedora-muted text-sm text-center">
        Already have an account?{" "}
        <Link to="/login" className="text-fedora-accent-light hover:underline">
          Login
        </Link>
      </p>
    </form>
  );
}
