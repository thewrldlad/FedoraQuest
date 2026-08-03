export default function CertificateViewer({ certificate }) {
  if (!certificate) return null;

  const completionDate = new Date(certificate.completionDate).toLocaleDateString(
    undefined,
    { year: "numeric", month: "long", day: "numeric" }
  );

  return (
    <div className="certificate-print bg-fedora-surface border-4 border-fedora-accent rounded-xl p-10 text-center relative overflow-hidden">
      <div className="absolute inset-3 border-2 border-fedora-border rounded-lg pointer-events-none" />

      <div className="relative">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-md flex items-center justify-center bg-fedora-accent">
            <span className="text-lg font-semibold text-white font-display">
              F
            </span>
          </div>
          <span className="font-display text-xl text-fedora-text">
            Fedora Quest
          </span>
        </div>

        <p className="text-fedora-muted uppercase tracking-widest text-sm mb-2">
          Certificate of Completion
        </p>

        <p className="text-fedora-muted mb-1">This certifies that</p>
        <h2 className="text-3xl font-display text-fedora-text mb-4">
          {certificate.studentName}
        </h2>

        <p className="text-fedora-muted mb-1">has successfully completed</p>
        <h3 className="text-2xl font-display text-fedora-accent-light mb-6">
          {certificate.courseName}
        </h3>

        <div className="flex flex-wrap justify-center gap-12 mt-10 mb-8">
          <div>
            <p className="font-display italic text-fedora-text border-b border-fedora-border pb-1 px-6">
              {certificate.instructor}
            </p>
            <p className="text-fedora-muted text-xs mt-1">Instructor</p>
          </div>
          <div>
            <p className="font-display text-fedora-text border-b border-fedora-border pb-1 px-6">
              {completionDate}
            </p>
            <p className="text-fedora-muted text-xs mt-1">Completion Date</p>
          </div>
        </div>

        <p className="text-fedora-muted text-xs">
          Certificate ID: {certificate.id}
        </p>
      </div>
    </div>
  );
}
