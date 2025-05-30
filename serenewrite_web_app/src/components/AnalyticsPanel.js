import React from "react";

/**
 * AnalyticsPanel displays writing analytics (stub view for now).
 * Includes word/char count, streak, goals, etc.
 */
// PUBLIC_INTERFACE
function AnalyticsPanel() {
  return (
    <div className="bg-white/80 rounded-xl shadow p-3 mt-4 text-sm min-w-[130px] max-w-[160px] border border-gray-100 text-gray-800">
      <span className="font-medium">[AnalyticsPanel]</span>
      <div className="opacity-60">Word Count, Streak, etc.</div>
    </div>
  );
}

export default AnalyticsPanel;
