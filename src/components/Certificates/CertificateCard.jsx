import { Award } from "lucide-react";

export default function CertificateCard({ certificate, onClick }) {
  const completionDate = new Date(certificate.completionDate).toLocaleDateString();

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-fedora-surface border border-fedora-border rounded-xl p-5 hover:border-fedora-accent transition-colors"
    >
      <div className="flex items-center gap-3">
        <Award size={24} className="text-fedora-accent-light shrink-0" />
        <div>
          <h3 className="font-display text-fedora-text">
            {certificate.courseName}
          </h3>
          <p className="text-fedora-muted text-sm">
            Completed {completionDate}
          </p>
        </div>
      </div>
    </button>
  );
}
