import React, { useEffect, useState } from "react";

/**
 * StreakGoalTracker shows the user's current writing streak,
 * progress toward daily and weekly writing goals, and updates these stats in real time.
 * Persisted via localStorage; designed for distraction-free, calming UI.
 *
 * - Daily streak: consecutive days with any writing.
 * - Daily/weekly word goal: user configurable (default 300/2000 words).
 * - Live update as user writes (listens to window events).
 *
 * Calming light theme, clean typography, subtle animation, and accessible.
 */
// PUBLIC_INTERFACE
function StreakGoalTracker() {
  // Persistent settings and stats (via localStorage)
  const defaultDailyGoal = 300;
  const defaultWeeklyGoal = 2000;
  const [dailyGoal, setDailyGoal] = useState(defaultDailyGoal);
  const [weeklyGoal, setWeeklyGoal] = useState(defaultWeeklyGoal);
  const [todayWords, setTodayWords] = useState(0);
  const [weeklyWords, setWeeklyWords] = useState(0);
  const [streak, setStreak] = useState(0);
  const [streakBroken, setStreakBroken] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Used to trigger re-render on change from editor
  const [lastEdit, setLastEdit] = useState(Date.now());

  // Update stats from localStorage and listen for events
  useEffect(() => {
    loadStats();
    // Listen for custom writing events (dispatched by EditorArea)
    window.addEventListener("serenewrite:editorupdate", handleEditorUpdate);
    // On mount, recalc streak (in case of midnight)
    updateStreakFromHistory();
    return () => {
      window.removeEventListener("serenewrite:editorupdate", handleEditorUpdate);
    };
    // eslint-disable-next-line
  }, []);

  // Recalculate goals and progress bars on edit
  useEffect(() => {
    // (This effect will redraw when words written today change)
    // Nothing needed here, dependencies only for reactivity
  }, [todayWords, weeklyWords, streak, streakBroken, dailyGoal, weeklyGoal, lastEdit]);

  // Handle stats from localStorage or recalculate if missing
  function loadStats() {
    // Pull persisted goals and stats
    try {
      const savedGoal = parseInt(localStorage.getItem("serenewrite.dailyGoal") || defaultDailyGoal);
      const savedWeeklyGoal = parseInt(localStorage.getItem("serenewrite.weeklyGoal") || defaultWeeklyGoal);
      setDailyGoal(isNaN(savedGoal) ? defaultDailyGoal : savedGoal);
      setWeeklyGoal(isNaN(savedWeeklyGoal) ? defaultWeeklyGoal : savedWeeklyGoal);

      // For streak and word count, track by date
      const statObj = loadStatObj();
      const today = getDateStr(new Date());
      const thisWeek = getISOWeek(new Date());

      const todaysWords = statObj.days?.[today]?.words || 0;
      const weekWords = Object.entries(statObj.days || {})
        .filter(([d, _]) => getISOWeekStr(d) === thisWeek)
        .reduce((sum, [_, dayStats]) => sum + (dayStats.words || 0), 0);

      setTodayWords(todaysWords);
      setWeeklyWords(weekWords);

      // Streak calculation (count consecutive prior days with writing)
      const s = computeStreak(statObj);
      setStreak(s.current);
      setStreakBroken(s.broken);

    } catch (err) {
      setDailyGoal(defaultDailyGoal);
      setWeeklyGoal(defaultWeeklyGoal);
      setTodayWords(0);
      setWeeklyWords(0);
      setStreak(0);
      setStreakBroken(false);
    }
  }

  // Listen for "serenewrite:editorupdate" events for real-time updating
  function handleEditorUpdate(e) {
    // e.detail = { wordCount: int }
    if (e.detail && typeof e.detail.wordCount === "number") {
      persistTodayWordCount(e.detail.wordCount);
      setLastEdit(Date.now());
      loadStats(); // refresh UI
    }
  }

  // Store today's word count in localStorage
  function persistTodayWordCount(wordCount) {
    try {
      const statObj = loadStatObj();
      const today = getDateStr(new Date());
      if (!statObj.days) statObj.days = {};
      if (!statObj.days[today]) statObj.days[today] = {};
      statObj.days[today].words = wordCount;
      statObj.days[today].updatedAt = new Date().toISOString();
      localStorage.setItem("serenewrite.stats", JSON.stringify(statObj));
    } catch (e) {
      // Fail silently
    }
  }

  // Streak logic: streak = consecutive days with writing > 0
  function computeStreak(statObj) {
    // Looks at previous days up to streak cutoff (30 days max)
    const days = statObj.days || {};
    let streak = 0;
    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    // Walk backward: fill in gaps for old stats
    for (let i = 0; i < 30; i++) {
      const dateStr = getDateStr(yesterday);
      if (days[dateStr] && days[dateStr].words > 0) {
        streak++;
        yesterday.setDate(yesterday.getDate() - 1);
      } else {
        break;
      }
    }
    // If today has words, add +1
    const todayStr = getDateStr(new Date());
    const today = days[todayStr] && days[todayStr].words > 0;
    return {
      current: today ? streak + 1 : streak,
      broken: !today
    };
  }

  function updateStreakFromHistory() {
    loadStats();
  }

  // Handle goal edits
  function handleGoalSave(e) {
    e.preventDefault();
    let dg = parseInt(e.target.dailyGoal.value, 10);
    let wg = parseInt(e.target.weeklyGoal.value, 10);

    if (isNaN(dg) || dg < 1) dg = defaultDailyGoal;
    if (isNaN(wg) || wg < 1) wg = defaultWeeklyGoal;

    setDailyGoal(dg);
    setWeeklyGoal(wg);
    localStorage.setItem("serenewrite.dailyGoal", dg);
    localStorage.setItem("serenewrite.weeklyGoal", wg);
    setShowSettings(false);
    setLastEdit(Date.now()); // trigger re-render
  }

  // Render
  const dailyProgress = Math.min(1, todayWords / dailyGoal);
  const weeklyProgress = Math.min(1, weeklyWords / (weeklyGoal || 1));

  return (
    <section
      className={`
        bg-white/95 border border-gray-200 rounded-xl shadow px-5 py-3 flex flex-col min-w-[192px] max-w-[340px]
        transition group hover:shadow-lg
      `}
      style={{
        background: "rgba(245,246,250,0.94)",
        fontFamily: "Inter, Arial, sans-serif",
        boxShadow: "0 4px 20px 0 rgba(163,206,241,0.045)",
        cursor: "pointer",
        position: "relative"
      }}
      aria-label="Writing Streak and Goal Tracker"
      tabIndex={0}
    >
      {/* Header */}
      <div className="flex items-center pb-1 mb-1 gap-2 border-b border-accent/20">
        <StreakFlameIcon hasStreak={streak > 0 && !streakBroken} />
        <span className="text-[1.05rem] font-bold text-amber-700">
          {streak}{' '}
          <span className="font-medium text-zinc-700">
            day{streak === 1 ? '' : 's'}
          </span>
        </span>
        <span className={"text-[0.92em] text-gray-400 ml-1"}>
          current streak
        </span>
        <button
          aria-label="Edit goals"
          onClick={e => { e.stopPropagation(); setShowSettings(x => !x); }}
          tabIndex={0}
          className="ml-auto text-accent bg-transparent hover:bg-accent/10 rounded p-1 transition"
        >
          <svg width={16} height={16} fill="none">
            <circle cx="8" cy="8" r="6.5" stroke="#A3CEF1" strokeWidth="1" />
            <path d="M9.6 6.4l-2.13 2.15M8.7 3.85a1 1 0 00.31 1.49l.23.14c.36.21.59.6.59 1.03s-.23.82-.59 1.03a1 1 0 00-.31 1.49l.49.62a1 1 0 001.49.31l.23-.14c.36-.21.82-.21 1.18 0s.36.6 0 .81l-.23.14a1 1 0 00-.31 1.49l-.49.62a1 1 0 00-.31 1.49l.23.14c.36.21.36.6 0 .81l-.23.14a1 1 0 00-.31 1.49l-.49.62a1 1 0 00-1.49-.31l-.23-.14c-.36-.21-.82-.21-1.18 0s-.36.6 0 .81l.23.14a1 1 0 00.31 1.49l.49.62a1 1 0 00.31 1.49l-.23.14c-.36.21-.36.6 0 .81l.23.14a1 1 0 00.31 1.49l.49.62a1 1 0 001.49.31l.23-.14c.36-.21.82-.21 1.18 0s.36.6 0 .81l-.23.14a1 1 0 00-.31 1.49l-.49.62a1 1 0 00-1.49.31l-.23.14c-.36.21-.82.21-1.18 0s-.36-.6 0-.81l.23-.14a1 1 0 00.31-1.49l-.49-.62a1 1 0 00-.31-1.49l-.23-.14c-.36-.21-.36-.6 0-.81z"
              stroke="#3484B8" strokeWidth="1" strokeLinecap="round" opacity={0.5}
            />
          </svg>
        </button>
      </div>
      {/* Goal Progress Section */}
      <div className="flex flex-col gap-2">
        <GoalProgress
          label="Daily"
          current={todayWords}
          goal={dailyGoal}
          progress={dailyProgress}
          accentColor="#A3CEF1"
        />
        <GoalProgress
          label="Weekly"
          current={weeklyWords}
          goal={weeklyGoal}
          progress={weeklyProgress}
          accentColor="#3484B8"
        />
      </div>
      {/* Motivational / status text */}
      <div className="mt-1 text-[0.93em] font-medium text-accent/80">
        {todayWords >= dailyGoal
          ? <span className="text-green-700">✅ Daily goal met!</span>
          : `Write ${dailyGoal - todayWords} more word${dailyGoal - todayWords === 1 ? "" : "s"} for your daily goal`}
      </div>
      {/* Editable settings modal/area */}
      {showSettings && (
        <div className="absolute left-1 top-7 z-20 bg-white border border-accent/40 rounded-lg shadow-lg p-3 w-[230px]">
          <form onSubmit={handleGoalSave}>
            <div className="font-semibold text-gray-800 mb-2 flex gap-1 items-center">
              <svg width={16} height={16} fill="none" className="mr-1" style={{opacity:0.8}}><circle cx="8" cy="8" r="7" stroke="#A3CEF1" strokeWidth="1.2" /><rect x="5.9" y="3.7" width="4.1" height="8.4" rx="1.1" fill="#A3CEF1" opacity={0.08} stroke="#A3CEF1" strokeWidth="0.6" /></svg>
              Edit Writing Goals
            </div>
            <div className="flex flex-col gap-2 text-xs">
              <label>
                Daily goal
                <input
                  className="block w-full rounded border border-gray-200 px-2 py-1 mt-0.5 mb-1"
                  style={{ background: "#F6FAFC" }}
                  type="number"
                  min="1"
                  name="dailyGoal"
                  defaultValue={dailyGoal}
                />
                <span className="text-gray-500 text-[0.87em]">words</span>
              </label>
              <label>
                Weekly goal
                <input
                  className="block w-full rounded border border-gray-200 px-2 py-1 mt-0.5 mb-1"
                  style={{ background: "#F6FAFC" }}
                  type="number"
                  min="1"
                  name="weeklyGoal"
                  defaultValue={weeklyGoal}
                />
                <span className="text-gray-500 text-[0.87em]">words</span>
              </label>
            </div>
            <div className="flex justify-end mt-2 gap-2">
              <button type="button" onClick={() => setShowSettings(false)}
                className="px-3 py-1 rounded bg-gray-100 text-gray-500 font-semibold hover:bg-gray-200 text-xs">Cancel</button>
              <button type="submit"
                className="px-3 py-1 rounded bg-accent text-white font-semibold hover:bg-blue-500 text-xs"
              >Save</button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}

// PUBLIC_INTERFACE
function GoalProgress({ label, current, goal, progress, accentColor = "#A3CEF1" }) {
  return (
    <div>
      <div className="flex items-center text-xs font-semibold text-gray-700">
        {label}&nbsp;
        <span className="text-gray-400 ml-1">
          {current}/{goal}
        </span>
        <span className="text-gray-400 text-xs ml-1"
              style={{fontWeight: 400}}>{label === "Daily" ? "words" : "words this week"}</span>
      </div>
      <div className="w-full h-2 mt-0.5 mb-1 rounded-full bg-gray-100 overflow-hidden"
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={goal}>
        <div style={{
          width: `${Math.min(100, progress * 100)}%`,
          background: `linear-gradient(90deg, ${accentColor} 65%, #F5F6FA 100%)`,
          transition: "width 0.45s cubic-bezier(.56,.21,.28,1.04)",
          height: "100%",
          borderRadius: "inherit",
          minWidth: 7
        }} />
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function StreakFlameIcon({ hasStreak }) {
  // Filled if streak > 0 and not broken
  return (
    <svg width="22" height="22" className="inline" fill="none" viewBox="0 0 20 20">
      <path
        d="M11.1 2.4c.5 1.59 1.81 3.51 2.41 6.02.89 3.59 0 5.56-2.05 7.07C9.12 16.01 7.47 15.27 6.88 13.62c-.26-.76 0-1.61.31-2.17.55-.93 1.56-1.68 1.08-3.02-.18-.48-.57-1.18-1.46-2.07-.45-.45-.64-.75-1.02-1.09C4.57 7.68 3 10 3 13a7 7 0 1014 0c0-4.06-2.22-7.53-5.9-10.6z"
        fill={hasStreak ? "url(#fireGradientSGT)" : "none"}
        stroke="#F29324"
        strokeWidth="0.92"
      />
      <defs>
        <linearGradient id="fireGradientSGT" x1="7" y1="2" x2="13" y2="18" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFD16C" />
          <stop offset="0.7" stopColor="#FF7C36" />
          <stop offset="1" stopColor="#F29324" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// --- Date/utility functions ---
// PUBLIC_INTERFACE
function getDateStr(date) {
  // Format YYYY-MM-DD
  const d = new Date(date);
  return d.toISOString().slice(0, 10);
}
function getISOWeek(date) {
  // Returns week number for "year-week"
  const d = new Date(date);
  d.setHours(0,0,0,0);
  d.setDate(d.getDate() + 4 - (d.getDay()||7));
  const yearStart = new Date(d.getFullYear(),0,1);
  // @ts-ignore
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1)/7);
  return `${d.getFullYear()}-W${weekNo}`;
}
function getISOWeekStr(str) {
  return getISOWeek(new Date(str));
}
function loadStatObj() {
  try {
    let o = JSON.parse(localStorage.getItem("serenewrite.stats") || "{}");
    if (!o.days) o.days = {};
    return o;
  } catch {
    return { days: {} };
  }
}

export default StreakGoalTracker;
