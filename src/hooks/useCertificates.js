import { useEffect, useRef } from "react";
import { useGame } from "../context/GameContext";
import * as certificateService from "../services/certificateService";

const CERTIFICATE_BONUS_XP = 200;

// Call this from anywhere isCourseComplete is known (Course page,
// Certificates page) — certificate creation is idempotent, so multiple
// call sites are safe and just mean the certificate + bonus XP +
// notification fire as soon as completion is first detected, regardless
// of which page the user happens to be on.
export default function useCertificates({ isCourseComplete, courseName, studentName }) {
  const { addXP, pushNotification } = useGame();
  const hasCheckedRef = useRef(false);

  useEffect(() => {
    if (!isCourseComplete || hasCheckedRef.current) return;
    hasCheckedRef.current = true;

    const { isNew } = certificateService.createCertificate({
      courseName,
      studentName,
    });

    if (isNew) {
      addXP(CERTIFICATE_BONUS_XP);
      pushNotification({ type: "certificate", title: courseName });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCourseComplete]);

  const certificate =
    certificateService
      .getCertificates()
      .find((cert) => cert.courseName === courseName) || null;

  return {
    certificate,
    verifyCertificateId: certificateService.verifyCertificateId,
  };
}
