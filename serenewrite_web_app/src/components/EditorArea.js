import React from "react";

/**
 * EditorArea is the minimalist core editor for SereneWrite.
 * Placeholder implementation, styled with Tailwind for a calming light theme.
 */
// PUBLIC_INTERFACE
function EditorArea() {
  return (
    <div
      className="w-full bg-white rounded-lg shadow-md min-h-[350px] max-w-2xl mx-auto p-6
      border border-gray-200 focus-within:shadow-lg transition-shadow"
      aria-label="Main writing editor area"
    >
      <div className="text-gray-400 text-center italic pointer-events-none select-none">
        [EditorArea Placeholder: Begin your writing here...]
      </div>
    </div>
  );
}

export default EditorArea;
