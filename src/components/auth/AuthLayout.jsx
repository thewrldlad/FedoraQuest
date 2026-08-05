import { useEffect, useRef } from "react";
import Logo from "../common/Logo";

export default function AuthLayout({ children }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.85;
    }
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden text-white">

      {/* Background Video */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover scale-105"
      >
        <source src="/videos/login-bg.mp4" type="video/mp4" />
      </video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/55 to-blue-950/60" />

      {/* Content */}
      <div className="relative z-10 grid min-h-screen lg:grid-cols-2">

        {/* LEFT SIDE */}
        <div className="hidden lg:flex flex-col justify-between p-16">

          <Logo size="lg" />

          <div className="max-w-lg">

            <h1 className="text-6xl font-black leading-tight">
              Master Fedora Linux.
            </h1>

            <p className="mt-6 text-xl leading-relaxed text-gray-300">
              Learn Fedora through interactive lessons,
              hands-on labs, real-world projects and
              command-line practice.
            </p>

            <div className="mt-10 space-y-5">
              <Feature text="Interactive Courses" />
              <Feature text="Hands-on Linux Labs" />
              <Feature text="Real Projects" />
              <Feature text="Track Your Progress" />
            </div>

          </div>

          <p className="text-sm text-gray-400">
            © 2026 FedoraQuest
          </p>

        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center p-8">
          {children}
        </div>

      </div>

    </div>
  );
}

function Feature({ text }) {
  return (
    <div className="flex items-center gap-3">

      <div className="h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,.8)]" />

      <span className="text-lg">{text}</span>

    </div>
  );
}
