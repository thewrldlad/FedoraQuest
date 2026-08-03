import { useState } from "react";
import useProfile from "../hooks/useProfile";
import useCourseProgress from "../hooks/useCourseProgress";
import useCertificates from "../hooks/useCertificates";
import CertificateList from "../components/Certificates/CertificateList";
import CertificateViewer from "../components/Certificates/CertificateViewer";
import CertificateDownload from "../components/Certificates/CertificateDownload";
import Button from "../components/Button/Button";

export default function Certificates() {
  const { profile } = useProfile();
  const progress = useCourseProgress();
  const { certificate, verifyCertificateId } = useCertificates({
    isCourseComplete: progress.isCourseComplete,
    courseName: progress.courseTitle,
    studentName: profile.fullName,
  });

  const certificates = certificate ? [certificate] : [];
  const [selected, setSelected] = useState(null);
  const [verifyId, setVerifyId] = useState("");
  const [verifyResult, setVerifyResult] = useState(null);

  const handleVerify = (event) => {
    event.preventDefault();
    setVerifyResult(verifyCertificateId(verifyId));
  };

  if (selected) {
    return (
      <div>
        <Button
          variant="secondary"
          onClick={() => setSelected(null)}
          className="mb-6"
        >
          ← Back to Certificates
        </Button>

        <CertificateViewer certificate={selected} />

        <div className="mt-6 flex justify-center">
          <CertificateDownload />
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-display text-fedora-text mb-2">
        Certificates
      </h1>
      <p className="text-fedora-muted mb-8">
        View and download your FedoraQuest completion certificates.
      </p>

      <CertificateList certificates={certificates} onSelect={setSelected} />

      <section className="bg-fedora-surface border border-fedora-border rounded-xl p-6 mt-8">
        <h2 className="text-lg font-display text-fedora-text mb-3">
          Verify a Certificate
        </h2>
        <form
          onSubmit={handleVerify}
          className="flex flex-col sm:flex-row gap-3"
        >
          <input
            type="text"
            value={verifyId}
            onChange={(event) => setVerifyId(event.target.value)}
            placeholder="Enter certificate ID (e.g. FQ-2026-AB12CD)"
            className="flex-1 bg-fedora-bg border border-fedora-border rounded-lg px-3 py-2 text-fedora-text focus:outline-none focus:border-fedora-accent"
          />
          <Button type="submit">Verify</Button>
        </form>

        {verifyResult !== null && (
          <p
            className={`text-sm mt-3 ${
              verifyResult ? "text-green-400" : "text-red-400"
            }`}
          >
            {verifyResult
              ? "✅ Valid certificate."
              : "❌ No matching certificate found."}
          </p>
        )}

        <p className="text-fedora-muted text-xs mt-3">
          This verifies against certificates stored in this browser only —
          real cross-device verification requires a backend, coming in a
          future update.
        </p>
      </section>
    </div>
  );
}
