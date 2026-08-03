// The only file touching Cloud Firestore for certificates. Certificates
// live in a top-level `certificates` collection with a `uid` field
// (rather than a subcollection) so the admin Certificates page can query
// every certificate ever issued in one read, while students only ever
// see their own via a `where("uid", "==", uid)` query.

import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

const CERTIFICATES_COLLECTION = "certificates";

function certificatesRef() {
  return collection(db, CERTIFICATES_COLLECTION);
}

function generateCertificateId() {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `FQ-${year}-${random}`;
}

// `id` here is the human-readable "FQ-2026-XXXX" string (what
// CertificateViewer.jsx displays as "Certificate ID") — not the
// Firestore document's own auto-generated ID, which callers never need.
export async function getCertificates(uid) {
  const certQuery = query(certificatesRef(), where("uid", "==", uid));
  const snapshot = await getDocs(certQuery);
  return snapshot.docs.map((docSnap) => docSnap.data());
}

// Admin-facing: every certificate ever issued, across every user.
export async function getAllCertificates() {
  const snapshot = await getDocs(certificatesRef());
  return snapshot.docs.map((docSnap) => docSnap.data());
}

// Idempotent: calling this again for a course the user already has a
// certificate for just returns the existing one with isNew: false, so
// it's safe to call from multiple places (e.g. both the Course page and
// the Certificates page) without ever creating duplicates or
// double-awarding bonus XP.
export async function createCertificate({ uid, courseName, studentName }) {
  const existing = await getCertificates(uid);
  const match = existing.find((cert) => cert.courseName === courseName);
  if (match) return { certificate: match, isNew: false };

  const certificate = {
    id: generateCertificateId(),
    uid,
    courseName,
    studentName,
    completionDate: new Date().toISOString(),
    instructor: "FedoraQuest Team",
  };

  await addDoc(certificatesRef(), certificate);
  return { certificate, isNew: true };
}

export async function verifyCertificateId(id) {
  const certQuery = query(certificatesRef(), where("id", "==", id.trim()));
  const snapshot = await getDocs(certQuery);
  return !snapshot.empty;
}
