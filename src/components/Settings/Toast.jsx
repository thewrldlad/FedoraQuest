export default function Toast({ toast }) {
  if (!toast) return null;

  return (
    <div
      role="status"
      className={`fixed bottom-6 right-6 px-4 py-3 rounded-lg shadow-lg border text-sm z-50 bg-fedora-surface ${
        toast.type === "error"
          ? "border-red-400 text-red-400"
          : "border-fedora-accent text-fedora-text"
      }`}
    >
      {toast.message}
    </div>
  );
}
