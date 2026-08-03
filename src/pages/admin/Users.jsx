import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import useAuth from "../../auth/useAuth";
import useAdmin from "../../hooks/useAdmin";
import useToast from "../../hooks/useToast";
import DataTable from "../../components/Admin/DataTable";
import SearchBar from "../../components/Admin/SearchBar";
import AdminFormModal from "../../components/Admin/AdminFormModal";
import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog";
import Toast from "../../components/Settings/Toast";
import Button from "../../components/Button/Button";

const ROLES = ["student", "instructor", "admin"];

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const { users, refreshUsers, changeUserRole, setUserActiveStatus, editUserProfile } =
    useAdmin();
  const { searchTerm: globalSearch } = useOutletContext();
  const { toast, showToast } = useToast();

  const [localSearch, setLocalSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ fullName: "", username: "", email: "" });
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    refreshUsers();
  }, [refreshUsers]);

  const query = (localSearch || globalSearch || "").trim().toLowerCase();

  const filtered = users.filter((user) => {
    const matchesSearch =
      query === "" ||
      user.fullName.toLowerCase().includes(query) ||
      user.username.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query);

    const matchesRole = roleFilter === "All" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const openEdit = (user) => {
    setEditingUser(user);
    setFormData({
      fullName: user.fullName,
      username: user.username,
      email: user.email,
    });
  };

  const handleSaveEdit = async (event) => {
    event.preventDefault();
    await editUserProfile(editingUser.id, formData);
    setEditingUser(null);
  };

  const handleRoleChange = async (user, role) => {
    if (user.id === currentUser.id && role !== "admin") {
      setConfirmAction({
        title: "Change your own role?",
        message:
          "You're about to remove your own admin access. You will lose access to this dashboard immediately.",
        confirmLabel: "Remove my admin role",
        onConfirm: async () => {
          await changeUserRole(user.id, role);
          setConfirmAction(null);
        },
      });
      return;
    }

    await changeUserRole(user.id, role);
  };

  const handleToggleActive = async (user) => {
    await setUserActiveStatus(user.id, user.active === false);
  };

  const handleDelete = (user) => {
    setConfirmAction({
      title: "Delete User",
      message:
        "This is a confirmation-only action — FedoraQuest has no backend yet to cascade-delete a user's account and data, so nothing is actually removed.",
      confirmLabel: "Delete User",
      onConfirm: () => {
        setConfirmAction(null);
        showToast(`Deletion of "${user.fullName}" is a placeholder — no data was removed.`, "error");
      },
    });
  };

  const handleResetProgress = (user) => {
    setConfirmAction({
      title: "Reset User Progress",
      message: `FedoraQuest doesn't yet store learning progress per-user — everyone in this browser shares one progress record. Resetting "${user.fullName}"'s progress isn't possible to target individually until per-user storage exists, so this is a confirmation-only placeholder for now.`,
      confirmLabel: "Acknowledge",
      onConfirm: () => {
        setConfirmAction(null);
        showToast("Per-user progress reset isn't implemented yet.", "error");
      },
    });
  };

  const columns = [
    { key: "fullName", label: "Name" },
    { key: "username", label: "Username" },
    { key: "email", label: "Email" },
    {
      key: "role",
      label: "Role",
      render: (row) => (
        <select
          value={row.role}
          onChange={(event) => handleRoleChange(row, event.target.value)}
          className="bg-fedora-bg border border-fedora-border rounded-md px-2 py-1 text-fedora-text text-xs"
        >
          {ROLES.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      ),
    },
    {
      key: "active",
      label: "Status",
      render: (row) => (
        <span
          className={row.active === false ? "text-red-400" : "text-green-400"}
        >
          {row.active === false ? "Deactivated" : "Active"}
        </span>
      ),
    },
  ];

  const actions = (row) => (
    <div className="flex justify-end gap-2 flex-wrap">
      <Button size="sm" variant="secondary" onClick={() => openEdit(row)}>
        Edit
      </Button>
      <Button size="sm" variant="secondary" onClick={() => handleToggleActive(row)}>
        {row.active === false ? "Activate" : "Deactivate"}
      </Button>
      <Button size="sm" variant="secondary" onClick={() => handleResetProgress(row)}>
        Reset Progress
      </Button>
      <Button size="sm" variant="secondary" onClick={() => handleDelete(row)}>
        Delete
      </Button>
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl font-display text-fedora-text mb-1">Users</h1>
      <p className="text-fedora-muted mb-6">
        Manage registered accounts, roles, and access.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1">
          <SearchBar
            value={localSearch}
            onChange={setLocalSearch}
            placeholder="Search users..."
          />
        </div>
        <select
          value={roleFilter}
          onChange={(event) => setRoleFilter(event.target.value)}
          className="bg-fedora-bg border border-fedora-border rounded-lg px-3 py-2 text-fedora-text text-sm"
        >
          <option value="All">All roles</option>
          {ROLES.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>

      <DataTable columns={columns} rows={filtered} actions={actions} />

      {editingUser && (
        <AdminFormModal
          title="Edit User"
          onClose={() => setEditingUser(null)}
          footer={
            <>
              <Button type="submit" form="edit-user-form">
                Save Changes
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setEditingUser(null)}
              >
                Cancel
              </Button>
            </>
          }
        >
          <form id="edit-user-form" onSubmit={handleSaveEdit} className="space-y-4">
            <div>
              <label className="block text-sm text-fedora-muted mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    fullName: event.target.value,
                  }))
                }
                className="w-full bg-fedora-bg border border-fedora-border rounded-lg px-3 py-2 text-fedora-text focus:outline-none focus:border-fedora-accent"
              />
            </div>
            <div>
              <label className="block text-sm text-fedora-muted mb-1">
                Username
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    username: event.target.value,
                  }))
                }
                className="w-full bg-fedora-bg border border-fedora-border rounded-lg px-3 py-2 text-fedora-text focus:outline-none focus:border-fedora-accent"
              />
            </div>
            <div>
              <label className="block text-sm text-fedora-muted mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
                className="w-full bg-fedora-bg border border-fedora-border rounded-lg px-3 py-2 text-fedora-text focus:outline-none focus:border-fedora-accent"
              />
            </div>
          </form>
        </AdminFormModal>
      )}

      {confirmAction && (
        <ConfirmDialog
          title={confirmAction.title}
          message={confirmAction.message}
          confirmLabel={confirmAction.confirmLabel}
          onConfirm={confirmAction.onConfirm}
          onCancel={() => setConfirmAction(null)}
        />
      )}

      <Toast toast={toast} />
    </div>
  );
}
