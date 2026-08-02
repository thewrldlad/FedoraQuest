const VARIANT_CLASSES = {
  primary:
    "bg-fedora-accent hover:opacity-90 transition-opacity text-white disabled:opacity-50 disabled:cursor-not-allowed",
  secondary:
    "border border-fedora-border text-fedora-text hover:bg-fedora-border transition-colors",
  success: "bg-green-600 text-white cursor-not-allowed transition-opacity",
};

const SIZE_CLASSES = {
  md: "px-5 py-2",
  sm: "px-4 py-2 text-sm",
};

export default function Button({
  as: Component = "button",
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}) {
  const classes = [
    "inline-block rounded-lg",
    SIZE_CLASSES[size],
    VARIANT_CLASSES[variant],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
}
