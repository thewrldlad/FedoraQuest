import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { ArrowUp, ArrowDown } from "lucide-react";
import useAdmin from "../../hooks/useAdmin";
import DataTable from "../../components/Admin/DataTable";
import SearchBar from "../../components/Admin/SearchBar";
import AdminFormModal from "../../components/Admin/AdminFormModal";
import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog";
import Button from "../../components/Button/Button";

const EMPTY_FORM = {
  courseId: "",
  day: "",
  title: "",
  description: "",
  xp: 100,
  markdownContent: "",
  codeBlock: "",
  resources: "",
};

export default function AdminLessons() {
  const { lessons, courses } = useAdmin();
  const { searchTerm: globalSearch } = useOutletContext();

  const [localSearch, setLocalSearch] = useState("");
  const [modalMode, setModalMode] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const query = (localSearch || globalSearch || "").trim().toLowerCase();

  const courseTitle = (courseId) =>
    courses.items.find((course) => course.id === courseId)?.title || "—";

  const filtered = lessons.items.filter(
    (lesson) =>
      query === "" ||
      lesson.title.toLowerCase().includes(query) ||
      lesson.description.toLowerCase().includes(query)
  );

  const openCreate = () => {
    setFormData(EMPTY_FORM);
    setModalMode("create");
  };

  const openEdit = (lesson) => {
    setEditingId(lesson.id);
    setFormData({
      ...lesson,
      resources: (lesson.resources || []).join(", "),
    });
    setModalMode("edit");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const payload = {
      ...formData,
      courseId: formData.courseId ? Number(formData.courseId) : null,
      xp: Number(formData.xp) || 0,
      resources: formData.resources
        .split(",")
        .map((url) => url.trim())
        .filter(Boolean),
    };

    if (modalMode === "create") {
      lessons.add(payload);
    } else {
      lessons.edit(editingId, payload);
    }

    setModalMode(null);
  };

  const columns = [
    {
      key: "courseId",
      label: "Course",
      render: (row) => courseTitle(row.courseId),
    },
    { key: "day", label: "Day" },
    { key: "title", label: "Title" },
    { key: "xp", label: "XP" },
  ];

  const actions = (row) => (
    <div className="flex justify-end gap-2">
      <button
        onClick={() => lessons.reorder(row.id, "up")}
        className="text-fedora-muted hover:text-fedora-text"
        aria-label="Move up"
      >
        <ArrowUp size={16} />
      </button>
      <button
        onClick={() => lessons.reorder(row.id, "down")}
        className="text-fedora-muted hover:text-fedora-text"
        aria-label="Move down"
      >
        <ArrowDown size={16} />
      </button>
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
        Lessons managed here are a staging area seeded from the real
        curriculum — changes here don't yet appear to students.
      </p>

      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-display text-fedora-text">Lessons</h1>
        <Button onClick={openCreate}>Create Lesson</Button>
      </div>
      <p className="text-fedora-muted mb-6">
        Manage lesson content, code blocks, and resources.
      </p>

      <div className="mb-4 max-w-sm">
        <SearchBar
          value={localSearch}
          onChange={setLocalSearch}
          placeholder="Search lessons..."
        />
      </div>

      <DataTable columns={columns} rows={filtered} actions={actions} />

      {modalMode && (
        <AdminFormModal
          title={modalMode === "create" ? "Create Lesson" : "Edit Lesson"}
          onClose={() => setModalMode(null)}
          footer={
            <>
              <Button type="submit" form="lesson-form">
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
          <form id="lesson-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-fedora-muted mb-1">
                  Course
                </label>
                <select
                  value={formData.courseId || ""}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      courseId: event.target.value,
                    }))
                  }
                  className="w-full bg-fedora-bg border border-fedora-border rounded-lg px-3 py-2 text-fedora-text focus:outline-none focus:border-fedora-accent"
                >
                  <option value="">— None —</option>
                  {courses.items.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-fedora-muted mb-1">Day</label>
                <input
                  type="text"
                  value={formData.day}
                  onChange={(event) =>
                    setFormData((current) => ({ ...current, day: event.target.value }))
                  }
                  placeholder="Day 1"
                  className="w-full bg-fedora-bg border border-fedora-border rounded-lg px-3 py-2 text-fedora-text focus:outline-none focus:border-fedora-accent"
                />
              </div>
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

            <div>
              <label className="block text-sm text-fedora-muted mb-1">
                Markdown Content
              </label>
              <textarea
                value={formData.markdownContent}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    markdownContent: event.target.value,
                  }))
                }
                rows={4}
                placeholder="## Section title&#10;Lesson body in Markdown..."
                className="w-full bg-fedora-bg border border-fedora-border rounded-lg px-3 py-2 text-fedora-text font-mono text-sm focus:outline-none focus:border-fedora-accent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm text-fedora-muted mb-1">
                Code Block
              </label>
              <textarea
                value={formData.codeBlock}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    codeBlock: event.target.value,
                  }))
                }
                rows={3}
                placeholder="$ dnf install httpd"
                className="w-full bg-fedora-bg border border-fedora-border rounded-lg px-3 py-2 text-fedora-text font-mono text-sm focus:outline-none focus:border-fedora-accent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm text-fedora-muted mb-1">
                Downloadable Resources (comma-separated URLs)
              </label>
              <input
                type="text"
                value={formData.resources}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    resources: event.target.value,
                  }))
                }
                placeholder="https://example.com/handout.pdf"
                className="w-full bg-fedora-bg border border-fedora-border rounded-lg px-3 py-2 text-fedora-text focus:outline-none focus:border-fedora-accent"
              />
            </div>

            <div>
              <label className="block text-sm text-fedora-muted mb-1">
                XP Reward
              </label>
              <input
                type="number"
                min="0"
                value={formData.xp}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, xp: event.target.value }))
                }
                className="w-full bg-fedora-bg border border-fedora-border rounded-lg px-3 py-2 text-fedora-text focus:outline-none focus:border-fedora-accent"
              />
            </div>
          </form>
        </AdminFormModal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete Lesson"
          message={`Delete "${deleteTarget.title}"? This removes it from the staging area only.`}
          confirmLabel="Delete"
          onConfirm={() => {
            lessons.remove(deleteTarget.id);
            setDeleteTarget(null);
          }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
