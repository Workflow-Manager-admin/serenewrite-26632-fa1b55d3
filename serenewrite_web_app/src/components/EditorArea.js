import React, { useState, useRef } from "react";

/**
 * EditorArea is the minimalist core editor for SereneWrite.
 * Replaces the placeholder with a real styled textarea input, themed calming light.
 */
// PUBLIC_INTERFACE
function EditorArea() {
  // Editor content state
  const [content, setContent] = useState("");
  // Focus state for visual cues
  const [isFocused, setIsFocused] = useState(false);
  // Ref for textarea to support future features
  const textareaRef = useRef(null);

  // Handler for content change
  const handleChange = (e) => {
    setContent(e.target.value);
  };

  // Handlers for focus/blur (for styling and potential analytics)
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <section
      className={`w-full max-w-2xl mx-auto bg-white rounded-lg border border-gray-200 shadow-md p-0 flex flex-col transition-shadow
        min-h-[350px] outline-none
        ${isFocused ? "ring-2 ring-accent shadow-lg" : "focus-within:shadow-lg"}
      `}
      aria-label="Main writing editor area"
      tabIndex={-1}
      style={{
        background: "#F5F6FA",
        boxShadow:
          isFocused
            ? "0 0 0 2px #A3CEF1, 0 3px 12px 0 rgba(163,206,241,0.05)"
            : "0 1px 6px 0 rgba(60,60,90,0.12)",
      }}
    >
      <textarea
        ref={textareaRef}
        className={`flex-1 w-full resize-none bg-transparent rounded-lg py-6 px-8 text-lg leading-relaxed
          text-gray-800 placeholder-gray-400 border-none outline-none focus:outline-none
          transition-colors duration-100 font-sans
          ${isFocused ? "bg-white" : "bg-white/80"}
        `}
        placeholder="Begin your writing here..."
        value={content}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        aria-label="Writing area"
        rows={14}
        spellCheck={true}
        autoFocus={false}
        autoCorrect="on"
      />
      {/* Optional: subtle shadow and border for interaction feedback */}
      <div
        className={`h-2 transition-all duration-200 ${
          isFocused
            ? "bg-gradient-to-r from-accent/30 to-accent/0"
            : "bg-transparent"
        } rounded-b-lg`}
      />
    </section>
  );
}

export default EditorArea;
