export default function Logo({
  size = "md",
  className = "",
}) {
  const sizes = {
    sm: "text-2xl",
    md: "text-3xl",
    lg: "text-4xl",
    xl: "text-5xl",
  };

  return (
    <div
      className={`
        inline-block
        animate-fade-up
        animate-glow
        transition-all
        duration-500
        hover:scale-105
        hover:-translate-y-1
        ${className}
      `}
    >
      <h1
        className={`
          ${sizes[size]}
          font-extrabold
          tracking-tight
          select-none
        `}
      >
        <span className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,.20)]">
          Fedora
        </span>

        <span className="text-[var(--color-fedora-accent)] drop-shadow-[0_0_12px_rgba(60,110,180,.60)]">
          Quest
        </span>
      </h1>
    </div>
  );
}
