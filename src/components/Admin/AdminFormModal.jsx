import { X } from "lucide-react";

// Generic modal shell shared by every admin "Create/Edit X" flow — each
// page supplies its own form fields as children and its own Save/Cancel
// buttons as footer, so the overlay/card/close-button chrome isn't
// duplicated across Courses/Lessons/Quizzes/Achievements/etc.
export default function AdminFormModal({ title, onClose, children, footer }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/60 px-4 py-8 overflow-y-auto">
      <div className="bg-fedora-surface border border-fedora-border rounded-xl p-6 w-full max-w-lg shadow-lg">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-display text-fedora-text">{title}</h2>
          <button
            onClick={onClose}
            className="text-fedora-muted hover:text-fedora-text transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">{children}</div>

        {footer && <div className="flex gap-3 mt-6">{footer}</div>}
      </div>
    </div>
  );
}
