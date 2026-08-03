import { Printer } from "lucide-react";
import Button from "../Button/Button";

// "Download as PDF" uses the browser's native print-to-PDF (window.print
// + print-specific CSS in index.css), not a client-side PDF library —
// choosing "Save as PDF" as the print destination produces the same
// result with zero new dependencies.
export default function CertificateDownload() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="text-center">
      <Button onClick={handlePrint}>
        <span className="flex items-center gap-2">
          <Printer size={16} /> Print / Save as PDF
        </span>
      </Button>
      <p className="text-fedora-muted text-xs mt-2">
        Choose "Save as PDF" as the destination in the print dialog to
        download.
      </p>
    </div>
  );
}
