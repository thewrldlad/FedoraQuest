import { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../auth/useAuth";
import PasswordInput from "../Auth/PasswordInput";

export default function LoginCard() {
  const { login, loginWithGoogle } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      await login(email, password, rememberMe);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      await loginWithGoogle();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        w-full
        max-w-md
        rounded-[34px]
        border
        border-white/20
        bg-white/10
        backdrop-blur-3xl
        shadow-[0_30px_80px_rgba(0,0,0,.55)]
        p-10
      "
    >
      <h1 className="text-4xl font-black text-white">
        Welcome Back
      </h1>

      <p className="mt-3 text-gray-300">
        Continue your FedoraQuest journey.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-5"
      >

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="
            flex
            w-full
            items-center
            justify-center
            gap-3
            rounded-2xl
            border
            border-gray-300/20
            bg-white
            py-3
            font-medium
            text-gray-800
            transition
            hover:bg-gray-50
            disabled:opacity-60
          "
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="h-5 w-5"
          />

          Continue with Google
        </button>

        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-white/20" />
          <span className="text-sm text-gray-300">
            OR
          </span>
          <div className="h-px flex-1 bg-white/20" />
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/40 bg-red-500/15 p-3 text-red-200">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="
            w-full
            rounded-2xl
            border
            border-white/15
            bg-white/5
            px-5
            py-4
            text-white
            placeholder:text-gray-400
            outline-none
            transition
            focus:border-cyan-400
            focus:bg-white/10
          "
        />

        <PasswordInput
          id="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="flex items-center justify-between text-sm text-gray-300">

          <label className="flex items-center gap-2">

            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="accent-cyan-400"
            />

            Remember me

          </label>

          <Link
            to="/forgot-password"
            className="text-cyan-300 hover:text-cyan-200"
          >
            Forgot password?
          </Link>

        </div>

        <button
          type="submit"
          disabled={loading}
          className="
            w-full
            rounded-2xl
            bg-gradient-to-r
            from-cyan-500
            to-blue-600
            py-4
            text-lg
            font-bold
            text-white
            transition
            hover:brightness-110
            disabled:opacity-60
          "
        >
          {loading ? "Signing in..." : "Log In"}
        </button>

        <p className="text-center text-sm text-gray-300">

          New to FedoraQuest?{" "}

          <Link
            to="/register"
            className="font-semibold text-cyan-300 hover:text-cyan-200"
          >
            Create an account
          </Link>

        </p>

      </form>

    </div>
  );
}
