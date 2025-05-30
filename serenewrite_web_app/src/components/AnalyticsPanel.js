import React, { useState, useEffect, useRef } from "react";

/**
 * AnalyticsPanel provides real-time writing analytics:
 * - Live word/character count
 * - Time spent writing (only increments while user is actively writing)
 * - Visual writing streaks (simple simulated streak for MVP—replace with real data on integration)
 * - Calming, minimal, responsive design
 *
 * Props:
 *   content (string): The current text in the editor (to be passed from EditorArea/MainContainer).
 *   userStats (optional, object): Allows for prop-driven extensions (e.g. actual streak data).
 *
 * If no props are passed, an internal textarea (demo mode) is rendered for test/dev/demo.
 */
// PUBLIC_INTERFACE
function AnalyticsPanel({ content: externalContent, userStats }) {
  // If content is not passed as prop, use local state for demo/test.
  const [localContent, setLocalContent] = useState("");
  const [contentToTrack, setContentToTrack] = useState(externalContent || localContent);

  // --- Word and Character Count ---
  const wordCount = countWords(contentToTrack);
  const charCount = contentToTrack.length;

  // --- Writing "Active" Detection, Time Spent ---
  // Time spent writing in seconds
  const [timeSpent, setTimeSpent] = useState(0);
  // Tracks last time of user input for "activity"
  const lastEditTime = useRef(Date.now());
  // Is currently "writing" (typing/active)? Used to pause time on inactivity.
  const [writingActive, setWritingActive] = useState(false);

  // Handle switching from external prop/live demo mode
  useEffect(() => {
    if (externalContent !== undefined) {
      setContentToTrack(externalContent);
    } else {
      setContentToTrack(localContent);
    }
  }, [externalContent, localContent]);

  // Start timer when content changes (writing active for 4s since last input)
  useEffect(() => {
    if (contentToTrack.length > 0) {
      setWritingActive(true);
      lastEditTime.current = Date.now();
    }
  }, [contentToTrack]);

  // Main timer effect: increments only while writingActive
  useEffect(() => {
    if (!writingActive) return;

    const tick = () => {
      const timeSinceEdit = (Date.now() - lastEditTime.current) / 1000;
      if (timeSinceEdit >= 4) {
        setWritingActive(false); // Pause timer after 4s inactivity
        return;
      }
      setTimeSpent(t => t + 1);
    };

    // Every second, check if still "active"
    const interval = setInterval(() => {
      tick();
    }, 1000);

    return () => clearInterval(interval);
  }, [writingActive]);

  // --- Writing Streaks (demo visual, static or simulated) ---
  // In real usage streak info would come from backend or localstorage
  const today = new Date();
  const fakeStreakDays = computeStreak(userStats);

  // --- For demo/dev only: lightweight local textarea ---
  const inDemoMode = externalContent === undefined;

  return (
    <div
      className="
        bg-white/80 rounded-2xl shadow-md px-5 py-4 border border-gray-100 text-gray-800
        min-w-[176px] max-w-xs flex flex-col gap-3 relative transition-all
        hover:shadow-xl hover:ring-2 hover:ring-accent/25
        "
      style={{
        background: "rgba(245,246,250,0.92)",
        boxShadow: "0 2px 16px 0 rgba(163,206,241,0.055)",
        fontFamily: "Inter, Arial, sans-serif",
      }}
      aria-label="Your Writing Analytics"
    >
      <div className="flex items-center gap-2 mb-1">
        <svg width="20" height="20" className="inline-block opacity-70 mr-1" fill="none" viewBox="0 0 20 20">
          <circle cx="10" cy="10" r="9" stroke="#A3CEF1" strokeWidth="2" />
          <path d="M10 5v5l3 2.5" stroke="#22223B" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
        <span className="font-semibold tracking-tight text-[1.1rem] text-gray-700">Analytics</span>
      </div>
      <div className="flex gap-4 items-center justify-between">
        <div>
          <div className="text-xs uppercase text-gray-400 font-medium mb-0.5 tracking-wider">Words</div>
          <div className="text-lg font-semibold text-accent">{wordCount}</div>
        </div>
        <div>
          <div className="text-xs uppercase text-gray-400 font-medium mb-0.5 tracking-wider">Time</div>
          <div className="text-base font-medium text-blue-900">
            {formatTime(timeSpent)}
          </div>
        </div>
        <div>
          <div className="text-xs uppercase text-gray-400 font-medium mb-0.5 tracking-wider">Chars</div>
          <div className="text-md font-semibold text-blue-600">{charCount}</div>
        </div>
      </div>
      <div className="flex flex-col gap-1 mt-3">
        <div className="flex items-center gap-2">
          <StreakIcon />
          <span className="text-base font-semibold text-orange-600">{fakeStreakDays} day{fakeStreakDays !== 1 ? "s" : ""}</span>
          <span className="text-[0.84rem] text-gray-400 ml-1">Current streak</span>
        </div>
        <div className="h-2 bg-gradient-to-r from-accent/80 to-accent/0 rounded-full transition-all" style={{ width: Math.min(100, 20 + fakeStreakDays * 12) + "%" }} />
      </div>
      {/* Demo Mode: include a local editor for testing the panel standalone */}
      {inDemoMode && (
        <div className="mt-2 text-xs">
          <label htmlFor="demo-analytics-textarea" className="block mb-1 text-gray-500">Demo editor (for isolation):</label>
          <textarea
            id="demo-analytics-textarea"
            rows={3}
            className="w-full rounded-md border px-2 py-1 text-[0.98rem] text-gray-700 shadow"
            value={localContent}
            onChange={e => setLocalContent(e.target.value)}
            placeholder="Type here to test AnalyticsPanel..."
            style={{
              background: "#F5F6FA",
              resize: "none"
            }}
          />
        </div>
      )}
    </div>
  );
}

// PUBLIC_INTERFACE
function countWords(text = "") {
  /**
   * Counts the number of words in a string.
   * (A word is a sequence of letters, numbers, or underscores, ignoring punctuation)
   */
  return (
    text
      .trim()
      .split(/\s+/)
      .filter(word => word.length > 0)
      .length
  );
}

// PUBLIC_INTERFACE
function formatTime(totalSeconds = 0) {
  /**
   * Converts seconds to M:SS or H:MM:SS for display.
   */
  const hours = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  if (hours > 0) {
    return `${hours}:${mins.toString().padStart(2,"0")}:${secs.toString().padStart(2,"0")}`;
  }
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// PUBLIC_INTERFACE
function computeStreak(userStats) {
  /**
   * Placeholder: Computes writing streak (consecutive days written).
   * When integrated, uses userStats.realStreak or actual backend.
   * Here we return a simulated value (e.g., 4 days).
   */
  if (userStats && typeof userStats.streakDays === "number") {
    return userStats.streakDays;
  }
  return 4;
}

// Icon for streak/flame (minimal)
function StreakIcon() {
  return (
    <svg width="20" height="20" className="inline mb-0.5" viewBox="0 0 20 20" fill="none">
      <path
        d="M11.1 2.4c.5 1.59 1.81 3.51 2.41 6.02.89 3.59 0 5.56-2.05 7.07C9.12 16.01 7.47 15.27 6.88 13.62c-.26-.76 0-1.61.31-2.17.55-.93 1.56-1.68 1.08-3.02-.18-.48-.57-1.18-1.46-2.07-.45-.45-.64-.75-1.02-1.09C4.57 7.68 3 10 3 13a7 7 0 1014 0c0-4.06-2.22-7.53-5.9-10.6z"
        fill="url(#fireGradient)" stroke="#F29324" strokeWidth="0.8"
      />
      <defs>
        <linearGradient id="fireGradient" x1="7" y1="2" x2="13" y2="18" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFD16C" />
          <stop offset="0.7" stopColor="#FF7C36" />
          <stop offset="1" stopColor="#F29324" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default AnalyticsPanel;
