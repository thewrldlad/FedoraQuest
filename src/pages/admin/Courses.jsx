import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { ArrowUp, ArrowDown } from "lucide-react";
import useAdmin from "../../hooks/useAdmin";
import DataTable from "../../components/Admin/DataTable";
import SearchBar from "../../components/Admin/SearchBar";
import AdminFormModal from "../../components/Admin/AdminFormModal";
import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog";
import Button from "../../components/Button/Button";

const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];

const EMPTY_FORM = {
  title: "",
  description: "",
  difficulty: "Beginner",
  estimatedDuration: "",
  thumbnailUrl: "",
  published: false,
};

export default function AdminCourses() {
  const { courses, uploadCourseThumbnail } = useAdmin();
  const { searchTerm: globalSearch } = useOutletContext();

  const [localSearch, setLocalSearch] = useState("");
  const [modalMode, setModalMode] = useState(null); // "create" | "edit" | null
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const query = (localSearch || globalSearch || "").trim().toLowerCase();

  const filtered = courses.items.filter(
    (course) =>
      query === "" ||
      course.title.toLowerCase().includes(query) ||
      course.description.toLowerCase().includes(query)
  );

  const openCreate = () => {
    setFormData(EMPTY_FORM);
    setModalMode("create");
  };

  const openEdit = (course) => {
    setEditingId(course.id);
    setFormData(course);
    setModalMode("edit");
  };

  const handleThumbnailChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const thumbnailUrl = await uploadCourseThumbnail(file);
    setFormData((current) => ({ ...current, thumbnailUrl }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (modalMode === "create") {
      courses.add(formData);
    } else {
      courses.edit(editingId, formData);
    }

    setModalMode(null);
  };

  const columns = [
    {
      key: "thumbnailUrl",
      label: "",
      render: (row) =>
        row.thumbnailUrl ? (
          <img
            src={row.thumbnailUrl}
            alt=""
            className="w-12 h-8 object-cover rounded border border-fedora-border"
          />
        ) : (
          <div className="w-12 h-8 rounded border border-fedora-border bg-fedora-bg" />
        ),
    },
    { key: "title", label: "Title" },
    { key: "difficulty", label: "Difficulty" },
    { key: "estimatedDuration", label: "Duration" },
    {
      key: "published",
      label: "Status",
      render: (row) => (
        <button
          onClick={() => courses.edit(row.id, { published: !row.published })}
          className={row.published ? "text-green-400" : "text-fedora-muted"}
        >
          {row.published ? "Published" : "Draft"}
        </button>
      ),
    },
  ];

  const actions = (row) => (
    <div className="flex justify-end gap-2">
      <button
        onClick={() => courses.reorder(row.id, "up")}
        className="text-fedora-muted hover:text-fedora-text"
        aria-label="Move up"
      >
        <ArrowUp size={16} />
      </button>
      <button
        onClick={() => courses.reorder(row.id, "down")}
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
        Courses managed here are a staging area seeded from the real
        curriculum — changes here don't yet appear to students. See the
        Admin Dashboard summary for why.
      </p>

      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-display text-fedora-text">Courses</h1>
        <Button onClick={openCreate}>Create Course</Button>
      </div>
      <p className="text-fedora-muted mb-6">
        Manage course metadata, thumbnails, and publish status.
      </p>

      <div className="mb-4 max-w-sm">
        <SearchBar
          value={localSearch}
          onChange={setLocalSearch}
          placeholder="Search courses..."
        />
      </div>

      <DataTable columns={columns} rows={filtered} actions={actions} />

      {modalMode && (
        <AdminFormModal
          title={modalMode === "create" ? "Create Course" : "Edit Course"}
          onClose={() => setModalMode(null)}
          footer={
            <>
              <Button type="submit" form="course-form">
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
          <form id="course-form" onSubmit={handleSubmit} className="space-y-4">
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
                rows={3}
                className="w-full bg-fedora-bg border border-fedora-border rounded-lg px-3 py-2 text-fedora-text focus:outline-none focus:border-fedora-accent resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-fedora-muted mb-1">
                  Difficulty
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      difficulty: event.target.value,
                    }))
                  }
                  className="w-full bg-fedora-bg border border-fedora-border rounded-lg px-3 py-2 text-fedora-text focus:outline-none focus:border-fedora-accent"
                >
                  {DIFFICULTIES.map((difficulty) => (
                    <option key={difficulty} value={difficulty}>
                      {difficulty}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-fedora-muted mb-1">
                  Estimated Duration
                </label>
                <input
                  type="text"
                  value={formData.estimatedDuration}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      estimatedDuration: event.target.value,
                    }))
                  }
                  placeholder="e.g. 6 hours"
                  className="w-full bg-fedora-bg border border-fedora-border rounded-lg px-3 py-2 text-fedora-text focus:outline-none focus:border-fedora-accent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-fedora-muted mb-1">
                Thumbnail
              </label>
              <input
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleThumbnailChange}
                className="text-sm text-fedora-text"
              />
              {formData.thumbnailUrl && (
                <img
                  src={formData.thumbnailUrl}
                  alt=""
                  className="w-32 h-20 object-cover rounded border border-fedora-border mt-2"
                />
              )}
            </div>

            <label className="flex items-center gap-2 text-sm text-fedora-muted">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    published: event.target.checked,
                  }))
                }
                className="accent-fedora-accent"
              />
              Published
            </label>
          </form>
        </AdminFormModal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete Course"
          message={`Delete "${deleteTarget.title}"? This removes it from the staging area only.`}
          confirmLabel="Delete"
          onConfirm={() => {
            courses.remove(deleteTarget.id);
            setDeleteTarget(null);
          }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
