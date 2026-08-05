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
    <h1
      className={`${sizes[size]} font-extrabold tracking-tight ${className}`}
    >
      <span className="text-white">Fedora</span>
      <span className="text-[var(--color-fedora-accent)]">Quest</span>
    </h1>
  );
}
