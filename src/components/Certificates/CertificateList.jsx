import CertificateCard from "./CertificateCard";

export default function CertificateList({ certificates, onSelect }) {
  if (certificates.length === 0) {
    return (
      <div className="bg-fedora-surface border border-fedora-border rounded-xl p-8 text-center">
        <p className="text-4xl mb-3">🎓</p>
        <p className="text-fedora-text font-display mb-1">
          No certificates yet
        </p>
        <p className="text-fedora-muted text-sm">
          Complete the course to earn your first certificate.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {certificates.map((certificate) => (
        <CertificateCard
          key={certificate.id}
          certificate={certificate}
          onClick={() => onSelect(certificate)}
        />
      ))}
    </div>
  );
}
