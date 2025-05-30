import React, { useState } from "react";

/**
 * AIEnhanceTools provides UI for AI-powered writing/style enhancement actions.
 * Supports interactive buttons for 'Grammar Enhance', 'Style Suggestions', 'Rephrase', and 'Tone Adjust'.
 * Calming, minimal, and accessible design. Functions are stubbed (show toasts/alerts).
 */
// PUBLIC_INTERFACE
function AIEnhanceTools() {
  const [lastMessage, setLastMessage] = useState(null);

  // Simulate feedback for user actions (can use toasts/snackbar or simple alert)
  const handleAction = (action) => {
    // Future: Replace with real AI integration
    const messages = {
      grammar: "Grammar enhanced! (This is a mock/stub.)",
      style: "Style suggestions coming soon. (This is a mock/stub.)",
      rephrase: "Your text has been rephrased! (This is a mock/stub.)",
      tone: "Tone adjusted! (This is a mock/stub.)"
    };
    setLastMessage(messages[action]);
    setTimeout(() => setLastMessage(null), 2100); // Clear after 2s
  };

  return (
    <section
      className="bg-white/95 border border-gray-200 rounded-xl shadow px-5 py-3 flex flex-col items-stretch gap-3 min-w-[180px] max-w-[270px] mx-auto"
      style={{
        background: "rgba(245,246,250,0.97)",
        fontFamily: "Inter, Arial, sans-serif",
        boxShadow: "0 4px 20px 0 rgba(163,206,241,0.055)",
      }}
      aria-label="AI Writing Enhancement Tools"
    >
      <div className="text-[1rem] font-semibold text-gray-800 flex items-center gap-2 pb-1 mb-1 border-b border-accent/20">
        <svg width="18" height="18" aria-hidden style={{opacity: 0.75}}>
          <circle cx="9" cy="9" r="8" stroke="#A3CEF1" strokeWidth="1.12"/>
          <path d="M6.6 7.5l2.2 2.9 2.7-4.2" stroke="#3484B8" strokeWidth="1.15" strokeLinecap="round" fill="none"/>
          <circle cx="9" cy="9" r="3.1" stroke="#A3CEF1" strokeWidth="0.6" fill="#E2F0FB" opacity="0.1"/>
        </svg>
        AI Enhance
      </div>
      <div className="flex flex-col gap-2 mt-1">
        <AIAssistButton
          label="Grammar Enhance"
          icon={<GrammarIcon />}
          onClick={() => handleAction("grammar")}
        />
        <AIAssistButton
          label="Style Suggestions"
          icon={<StyleIcon />}
          onClick={() => handleAction("style")}
        />
        <AIAssistButton
          label="Rephrase"
          icon={<RephraseIcon />}
          onClick={() => handleAction("rephrase")}
        />
        <AIAssistButton
          label="Tone Adjust"
          icon={<ToneIcon />}
          onClick={() => handleAction("tone")}
        />
      </div>
      <div
        className={`mt-3 text-accent text-xs transition-opacity duration-300`}
        role="status"
        aria-live="polite"
        style={{
          opacity: lastMessage ? 1 : 0,
          minHeight: "1.3em",
          fontWeight: 500,
        }}
      >
        {lastMessage}
      </div>
    </section>
  );
}

// PUBLIC_INTERFACE
function AIAssistButton({ label, icon, onClick }) {
  // Accessible, animated, minimalist button for AI assist actions
  return (
    <button
      className={`
        flex items-center gap-2 rounded-lg px-3 py-2 bg-white border border-gray-100 shadow
        text-gray-800 text-sm font-medium transition
        hover:bg-accent/20 hover:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40
        active:bg-accent/30
      `}
      style={{
        background: "rgba(255,255,255,0.99)",
        boxShadow: "0 1px 6px 0 rgba(163,206,241,0.035)",
        minHeight: "38px",
      }}
      type="button"
      tabIndex={0}
      aria-label={label}
      onClick={onClick}
    >
      <span className="w-5 h-5 flex items-center justify-center">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

// --- Icon components (minimal SVGs, soft accent) ---

function GrammarIcon() {
  // Pencil/checkmark
  return (
    <svg width="20" height="20" fill="none">
      <rect x="4" y="12" width="12" height="4" rx="1.2" fill="#A3CEF1" opacity="0.28"/>
      <path d="M7.5 13.7l3.85-6.1c.31-.5.6-.6 1.05-.45.37.12.49.56.28.93l-3.86 6.09c-.31.5-.6.59-1.05.45-.36-.13-.5-.55-.27-.92Z" fill="#3484B8"/>
      <path d="M8.2 11.4l2-3.2" stroke="#3484B8" strokeWidth="1.08" strokeLinecap="round"/>
    </svg>
  );
}

function StyleIcon() {
  // Color palette/fountain-pen minimal
  return (
    <svg width="20" height="20" fill="none">
      <ellipse cx="10" cy="14" rx="6" ry="2.5" fill="#A3CEF1" opacity="0.25"/>
      <path d="M7.8 4.8c1-.6 2.6-.6 3.4 0l3.6 2.9c.6.5.6 1.3 0 1.7l-3.6 2.8c-1 .7-2.5.7-3.5 0l-3.5-2.7c-.6-.5-.6-1.3 0-1.7l3.6-3z"
        fill="#E2F1FA" stroke="#A3CEF1" strokeWidth="1.1"/>
      <circle cx="10" cy="9.5" r="1.3" fill="#3484B8"/>
    </svg>
  );
}

function RephraseIcon() {
  // Circular arrow
  return (
    <svg width="20" height="20" fill="none">
      <circle cx="10" cy="10" r="8" stroke="#A3CEF1" strokeWidth="1.05" />
      <path d="M10 4.3a5.7 5.7 0 1 1-3.4 10.3" stroke="#3484B8" strokeWidth="1.25" fill="none"/>
      <path d="M5.7 14.3A5.6 5.6 0 0 1 10 4.3v-1.6l2.1 2.1-2.1 2v-1.6"
        fill="#A3CEF1" opacity="0.56"/>
    </svg>
  );
}

function ToneIcon() {
  // Sliders (tune bars)
  return (
    <svg width="20" height="20" fill="none">
      <rect x="4" y="5.5" width="12" height="1.7" rx="0.85" fill="#A3CEF1"/>
      <rect x="4" y="12.5" width="12" height="1.7" rx="0.85" fill="#A3CEF1"/>
      <circle cx="9.8" cy="6.3" r="1.2" fill="#3484B8"/>
      <circle cx="14" cy="13.3" r="1.18" fill="#3484B8"/>
    </svg>
  );
}

export default AIEnhanceTools;
