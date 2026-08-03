import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import useAdmin from "../../hooks/useAdmin";
import DataTable from "../../components/Admin/DataTable";
import SearchBar from "../../components/Admin/SearchBar";
import AdminFormModal from "../../components/Admin/AdminFormModal";
import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog";
import Button from "../../components/Button/Button";

const CATEGORIES = [
  "Learning",
  "Quizzes",
  "XP",
  "Streaks",
  "Labs",
  "Commands",
  "Community",
];

const EMPTY_FORM = {
  title: "",
  description: "",
  icon: "🏅",
  category: "Learning",
  xpReward: 25,
  unlockCondition: "",
};

export default function AdminAchievements() {
  const { achievements } = useAdmin();
  const { searchTerm: globalSearch } = useOutletContext();

  const [localSearch, setLocalSearch] = useState("");
  const [modalMode, setModalMode] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const query = (localSearch || globalSearch || "").trim().toLowerCase();

  const filtered = achievements.items.filter(
    (achievement) =>
      query === "" ||
      achievement.title.toLowerCase().includes(query) ||
      achievement.description.toLowerCase().includes(query)
  );

  const openCreate = () => {
    setFormData(EMPTY_FORM);
    setModalMode("create");
  };

  const openEdit = (achievement) => {
    setEditingId(achievement.id);
    setFormData({ unlockCondition: "", ...achievement });
    setModalMode("edit");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const payload = { ...formData, xpReward: Number(formData.xpReward) || 0 };

    if (modalMode === "create") {
      achievements.add(payload);
    } else {
      achievements.edit(editingId, payload);
    }

    setModalMode(null);
  };

  const columns = [
    {
      key: "icon",
      label: "",
      render: (row) => <span className="text-xl">{row.icon}</span>,
    },
    { key: "title", label: "Title" },
    { key: "category", label: "Category" },
    { key: "xpReward", label: "XP Reward" },
  ];

  const actions = (row) => (
    <div className="flex justify-end gap-2">
      <Button size="sm" variant="secondary" onClick={() => openEdit(row)}>
        Edit
      </Button>
      <Button size="sm" variant="secondary" onClick={() => setDeleteTarget(row)}>
        Delete
      </Button>
    </div>
  );

  return (
    <div>
      <p className="bg-fedora-surface border border-fedora-border rounded-lg px-4 py-3 text-fedora-muted text-sm mb-6">
        Achievements managed here are a staging area seeded from the real
        achievement catalog. "Unlock Condition" is a free-text note for this
        staging area — actual unlock logic lives in code
        (utils/checkAchievements.js), so entries created here don't
        automatically unlock for students.
      </p>

      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-display text-fedora-text">
          Achievements
        </h1>
        <Button onClick={openCreate}>Create Achievement</Button>
      </div>
      <p className="text-fedora-muted mb-6">
        Manage achievement metadata and XP rewards.
      </p>

      <div className="mb-4 max-w-sm">
        <SearchBar
          value={localSearch}
          onChange={setLocalSearch}
          placeholder="Search achievements..."
        />
      </div>

      <DataTable columns={columns} rows={filtered} actions={actions} />

      {modalMode && (
        <AdminFormModal
          title={modalMode === "create" ? "Create Achievement" : "Edit Achievement"}
          onClose={() => setModalMode(null)}
          footer={
            <>
              <Button type="submit" form="achievement-form">
                Save
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setModalMode(null)}
              >
                Cancel
              </Button>
            </>
          }
        >
          <form id="achievement-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-[80px_1fr] gap-4">
              <div>
                <label className="block text-sm text-fedora-muted mb-1">Icon</label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(event) =>
                    setFormData((current) => ({ ...current, icon: event.target.value }))
                  }
                  className="w-full bg-fedora-bg border border-fedora-border rounded-lg px-3 py-2 text-fedora-text text-center focus:outline-none focus:border-fedora-accent"
                />
              </div>
              <div>
                <label className="block text-sm text-fedora-muted mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(event) =>
                    setFormData((current) => ({ ...current, title: event.target.value }))
                  }
                  className="w-full bg-fedora-bg border border-fedora-border rounded-lg px-3 py-2 text-fedora-text focus:outline-none focus:border-fedora-accent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-fedora-muted mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                rows={2}
                className="w-full bg-fedora-bg border border-fedora-border rounded-lg px-3 py-2 text-fedora-text focus:outline-none focus:border-fedora-accent resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-fedora-muted mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      category: event.target.value,
                    }))
                  }
                  className="w-full bg-fedora-bg border border-fedora-border rounded-lg px-3 py-2 text-fedora-text focus:outline-none focus:border-fedora-accent"
                >
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-fedora-muted mb-1">
                  XP Reward
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.xpReward}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      xpReward: event.target.value,
                    }))
                  }
                  className="w-full bg-fedora-bg border border-fedora-border rounded-lg px-3 py-2 text-fedora-text focus:outline-none focus:border-fedora-accent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-fedora-muted mb-1">
                Unlock Condition (notes only)
              </label>
              <input
                type="text"
                value={formData.unlockCondition}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    unlockCondition: event.target.value,
                  }))
                }
                placeholder="e.g. Complete 20 labs"
                className="w-full bg-fedora-bg border border-fedora-border rounded-lg px-3 py-2 text-fedora-text focus:outline-none focus:border-fedora-accent"
              />
            </div>
          </form>
        </AdminFormModal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete Achievement"
          message={`Delete "${deleteTarget.title}"? This removes it from the staging area only.`}
          confirmLabel="Delete"
          onConfirm={() => {
            achievements.remove(deleteTarget.id);
            setDeleteTarget(null);
          }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
