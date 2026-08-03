import Button from "../Button/Button";

export default function ConfirmDialog({
  title,
  message,
  confirmLabel = "Confirm",
  onConfirm,
  onCancel,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="bg-fedora-surface border border-fedora-border rounded-xl p-6 w-full max-w-sm shadow-lg">
        <h2 className="text-lg font-display text-fedora-text mb-2">
          {title}
        </h2>
        <p className="text-fedora-muted text-sm mb-6">{message}</p>

        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  );
}
