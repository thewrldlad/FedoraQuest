// The only file touching localStorage for certificates. To connect this
// to a real backend later (so certificate IDs can be verified across
// devices, not just in this browser), replace the internals of these
// functions — useCertificates.js and every component that calls it stay
// unchanged.

const CERTIFICATES_KEY = "fedoraquest_certificates";

export function getCertificates() {
  const saved = localStorage.getItem(CERTIFICATES_KEY);
  return saved ? JSON.parse(saved) : [];
}

function saveCertificates(certificates) {
  localStorage.setItem(CERTIFICATES_KEY, JSON.stringify(certificates));
}

function generateCertificateId() {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `FQ-${year}-${random}`;
}

// Idempotent: calling this again for a course that already has a
// certificate just returns the existing one with isNew: false, so it's
// safe to call from multiple places (e.g. both the Course page and the
// Certificates page) without ever creating duplicates or double-awarding
// bonus XP.
export function createCertificate({ courseName, studentName }) {
  const certificates = getCertificates();
  const existing = certificates.find((cert) => cert.courseName === courseName);
  if (existing) return { certificate: existing, isNew: false };

  const certificate = {
    id: generateCertificateId(),
    courseName,
    studentName,
    completionDate: new Date().toISOString(),
    instructor: "FedoraQuest Team",
  };

  saveCertificates([...certificates, certificate]);
  return { certificate, isNew: true };
}

// Local-only verification for now — checks against certificates recorded
// in this browser. Real cross-device verification needs a backend.
export function verifyCertificateId(id) {
  const certificates = getCertificates();
  return certificates.some((cert) => cert.id === id.trim());
}

export function resetCertificates() {
  localStorage.removeItem(CERTIFICATES_KEY);
}
