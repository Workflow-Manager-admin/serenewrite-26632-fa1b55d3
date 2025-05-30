import React, { useRef } from "react";

/**
 * ExportBar: Provides export/sharing options with PDF and print support.
 * Modern light styling, accessible, with success feedback.
 *
 * Expects an optional "getContent" prop (function returning editor content as plain text or HTML).
 * Falls back to extracting content from textarea/editor if not provided.
 */
// PUBLIC_INTERFACE
function ExportBar({ getContent }) {
  const exportSectionRef = useRef();

  // Print handler (opens print dialog with focus on main content)
  function handlePrint() {
    window.print();
  }

  // PDF export via jsPDF (dynamically load jsPDF if needed)
  async function handlePDFExport() {
    let content = "";
    if (typeof getContent === "function") {
      content = getContent();
    } else {
      // Fallback: try to find the editor's textarea/section
      const textarea = document.querySelector("textarea[aria-label='Writing area']");
      content = textarea ? textarea.value : "";
    }
    // Load jsPDF dynamically
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();
      const lines = doc.splitTextToSize(content || "SereneWrite document", 180);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(13);
      doc.text(lines, 15, 28);
      doc.save("serenewrite-document.pdf");
    } catch (e) {
      alert(
        "PDF Export unavailable. Please try Print, or contact support. (jsPDF not installed)"
      );
    }
  }

  return (
    <nav
      ref={exportSectionRef}
      className={`
        flex gap-2 items-center bg-white/95 border border-gray-200 rounded-xl shadow
        px-4 py-2 text-gray-800 min-w-[174px] max-w-lg
        transition hover:ring-2 hover:ring-accent/20
      `}
      style={{
        background: "rgba(245,246,250,0.97)",
        fontFamily: "Inter, Arial, sans-serif",
        boxShadow: "0 4px 20px 0 rgba(163,206,241,0.045)",
      }}
      aria-label="Export and Print Options"
    >
      <span className="flex items-center gap-1.5 text-base text-blue-900 font-semibold mr-2">
        <ExportIcon />
        Export
      </span>

      <button
        className={`
          flex items-center gap-1 px-2 py-1 rounded bg-accent text-white text-xs font-medium transition
          hover:bg-blue-600 focus:ring-2 focus:ring-accent/50
        `}
        onClick={handlePDFExport}
        aria-label="Export as PDF"
        type="button"
        title="Download PDF"
        style={{ minWidth: 80 }}
      >
        <PDFIcon />
        PDF
      </button>
      <button
        className={`
          flex items-center gap-1 px-2 py-1 rounded bg-gray-100 text-blue-900 border border-gray-300 text-xs font-medium ml-1
          hover:bg-accent/10 focus:ring-2 focus:ring-accent/30
        `}
        onClick={handlePrint}
        aria-label="Print document"
        type="button"
        title="Print"
        style={{ minWidth: 82 }}
      >
        <PrintIcon />
        Print
      </button>
      <span className="ml-2 text-[0.89em] text-gray-400 hidden sm:inline">as PDF / Print</span>
    </nav>
  );
}

// --- Icons styled for light theme / accent ---

function ExportIcon() {
  // Outbox/export minimal
  return (
    <svg width={18} height={18} fill="none" aria-hidden style={{ opacity: 0.82 }}>
      <rect x="3" y="8.8" width="12" height="5.3" rx="1.3" fill="#A3CEF1" opacity={0.19} />
      <rect x="3" y="8.8" width="12" height="5.3" rx="1.3" stroke="#A3CEF1" strokeWidth="1.1" />
      <path d="M9 3.1V12" stroke="#3484B8" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M6.9 5.9L9 3.1l2.1 2.8" stroke="#3484B8" strokeWidth="1.13" strokeLinecap="round" />
    </svg>
  );
}

function PDFIcon() {
  // PDF document icon
  return (
    <svg width={16} height={16} fill="none" aria-hidden>
      <rect x="2" y="2.6" width="12" height="11" rx="1.45" fill="#A3CEF1" opacity={0.22} />
      <rect x="2" y="2.6" width="12" height="11" rx="1.45" stroke="#A3CEF1" strokeWidth="1" />
      <rect x="4.7" y="6.3" width="6.5" height="1.1" rx="0.4" fill="#3484B8" opacity={0.91} />
      <rect x="4.7" y="8.9" width="6.5" height="1.1" rx="0.4" fill="#3484B8" opacity={0.91} />
    </svg>
  );
}

function PrintIcon() {
  return (
    <svg width={16} height={16} fill="none" aria-hidden>
      <rect x="3" y="7.8" width="10" height="4.2" rx="1" fill="#A3CEF1" opacity={0.20} />
      <rect x="3" y="7.8" width="10" height="4.2" rx="1" stroke="#3484B8" strokeWidth=".9" />
      <rect x="5.3" y="10.3" width="5.4" height="1" rx=".55" fill="#3484B8" opacity={0.93} />
      <rect x="3.8" y="2.2" width="8.4" height="2.8" rx="0.62" fill="#A3CEF1" opacity={0.23} />
      <rect x="3.8" y="2.2" width="8.4" height="2.8" rx="0.62" stroke="#3484B8" strokeWidth=".8" />
    </svg>
  );
}

export default ExportBar;
