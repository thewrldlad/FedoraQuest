import { useState } from "react";
import useAdmin from "../../hooks/useAdmin";
import useToast from "../../hooks/useToast";
import * as certificateService from "../../services/certificateService";
import DataTable from "../../components/Admin/DataTable";
import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog";
import Toast from "../../components/Settings/Toast";
import Button from "../../components/Button/Button";

export default function AdminCertificates() {
  const { certificateTemplate, editCertificateTemplate } = useAdmin();
  const { toast, showToast } = useToast();
  const [regenerateTarget, setRegenerateTarget] = useState(null);

  const certificates = certificateService.getCertificates();

  const handleTemplateChange = (field) => (event) => {
    editCertificateTemplate({ [field]: event.target.value });
  };

  const columns = [
    { key: "id", label: "Certificate ID" },
    { key: "studentName", label: "Student" },
    { key: "courseName", label: "Course" },
    {
      key: "completionDate",
      label: "Completed",
      render: (row) => new Date(row.completionDate).toLocaleDateString(),
    },
  ];

  const actions = (row) => (
    <Button size="sm" variant="secondary" onClick={() => setRegenerateTarget(row)}>
      Regenerate
    </Button>
  );

  return (
    <div>
      <h1 className="text-2xl font-display text-fedora-text mb-1">
        Certificates
      </h1>
      <p className="text-fedora-muted mb-6">
        View issued certificates and configure certificate branding.
      </p>

      <h2 className="text-lg font-display text-fedora-text mb-3">
        Issued Certificates
      </h2>
      <DataTable columns={columns} rows={certificates} actions={actions} />

      <div className="mt-8 bg-fedora-surface border border-fedora-border rounded-xl p-6">
        <h2 className="text-lg font-display text-fedora-text mb-1">
          Certificate Template
        </h2>
        <p className="text-fedora-muted text-sm mb-4">
          Stored for future use — the live certificate viewer doesn't yet
          read these values, to avoid changing what students see without
          being able to verify it visually first.
        </p>

        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm text-fedora-muted mb-1">
              Branding Text
            </label>
            <input
              type="text"
              value={certificateTemplate.brandingText}
              onChange={handleTemplateChange("brandingText")}
              className="w-full bg-fedora-bg border border-fedora-border rounded-lg px-3 py-2 text-fedora-text focus:outline-none focus:border-fedora-accent"
            />
          </div>

          <div>
            <label className="block text-sm text-fedora-muted mb-1">
              Accent Color
            </label>
            <input
              type="color"
              value={certificateTemplate.accentColor}
              onChange={handleTemplateChange("accentColor")}
              className="h-10 w-20 bg-fedora-bg border border-fedora-border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm text-fedora-muted mb-1">
              Footer Note
            </label>
            <input
              type="text"
              value={certificateTemplate.footerNote}
              onChange={handleTemplateChange("footerNote")}
              className="w-full bg-fedora-bg border border-fedora-border rounded-lg px-3 py-2 text-fedora-text focus:outline-none focus:border-fedora-accent"
            />
          </div>
        </div>
      </div>

      {regenerateTarget && (
        <ConfirmDialog
          title="Regenerate Certificate"
          message={`Regenerate the certificate for "${regenerateTarget.studentName}"? Certificate regeneration isn't implemented yet — this is a placeholder for a future update.`}
          confirmLabel="Regenerate"
          onConfirm={() => {
            setRegenerateTarget(null);
            showToast("Certificate regeneration isn't implemented yet.", "error");
          }}
          onCancel={() => setRegenerateTarget(null)}
        />
      )}

      <Toast toast={toast} />
    </div>
  );
}
