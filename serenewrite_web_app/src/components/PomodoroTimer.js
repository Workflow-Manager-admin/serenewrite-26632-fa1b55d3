import React, { useState, useRef, useEffect } from "react";

/**
 * PomodoroTimer provides live Pomodoro session timing with control buttons.
 * Includes customizable duration, session/break logic, visual timer, and calming styling.
 */
// PUBLIC_INTERFACE
function PomodoroTimer({
  sessionLengthMin = 25,
  breakLengthMin = 5,
  longBreakMin = 15,
  sessionsTillLongBreak = 4,
}) {
  // State
  const [mode, setMode] = useState("session"); // 'session', 'break', 'long-break'
  const [sessionCount, setSessionCount] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(sessionLengthMin * 60);
  const [running, setRunning] = useState(false);
  const timerRef = useRef(null);

  // Derived
  const totalSeconds =
    mode === "session"
      ? sessionLengthMin * 60
      : mode === "break"
      ? breakLengthMin * 60
      : longBreakMin * 60;
  const percent = Math.max(0, Math.min(1, secondsLeft / totalSeconds)); // progress for visual
  const cyclesUntilLong = sessionsTillLongBreak - (sessionCount % sessionsTillLongBreak);

  // Effects: Timer interval
  useEffect(() => {
    if (!running) {
      clearTimer();
      return;
    }
    timerRef.current = setInterval(() => {
      setSecondsLeft((sec) => {
        if (sec > 1) return sec - 1;
        clearTimer();

        // Mode transition logic
        if (mode === "session") {
          // Completed work session
          setSessionCount((c) => c + 1);
          if ((sessionCount + 1) % sessionsTillLongBreak === 0) {
            setMode("long-break");
            setSecondsLeft(longBreakMin * 60);
          } else {
            setMode("break");
            setSecondsLeft(breakLengthMin * 60);
          }
        } else {
          // Completed break or long-break → always go to session
          setMode("session");
          setSecondsLeft(sessionLengthMin * 60);
        }
        return 0;
      });
    }, 1000);

    return clearTimer;
    // eslint-disable-next-line
  }, [running, mode, sessionCount, sessionLengthMin, breakLengthMin, longBreakMin]);

  // When mode changes (by auto or user), reset timer to full for that mode
  useEffect(() => {
    if (mode === "session") setSecondsLeft(sessionLengthMin * 60);
    else if (mode === "break") setSecondsLeft(breakLengthMin * 60);
    else setSecondsLeft(longBreakMin * 60);
    // eslint-disable-next-line
  }, [mode, sessionLengthMin, breakLengthMin, longBreakMin]);

  // Cleanup
  function clearTimer() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }
  useEffect(() => {
    return () => clearTimer();
  }, []);

  // Handlers
  function handleStart() {
    setRunning(true);
  }
  function handlePause() {
    setRunning(false);
  }
  function handleReset() {
    setRunning(false);
    setMode("session");
    setSessionCount(0);
    setSecondsLeft(sessionLengthMin * 60);
  }
  function handleSkip() {
    setRunning(false);
    // Force end of phase
    if (mode === "session") {
      setMode((sessionCount + 1) % sessionsTillLongBreak === 0 ? "long-break" : "break");
    } else {
      setMode("session");
    }
  }

  // UI styles
  const colorMap = {
    session: "from-accent/70 to-accent/30",
    break: "from-green-300 to-green-100",
    "long-break": "from-orange-200 to-amber-100",
  };
  const labelMap = {
    session: "Focus",
    break: "Short Break",
    "long-break": "Long Break",
  };

  return (
    <div
      className={`
        bg-white/90 border border-gray-200 rounded-xl shadow px-4 py-3 flex flex-col items-center min-w-[170px] max-w-[200px]
        text-gray-900
        `}
      style={{
        background: "rgba(245,246,250,0.96)",
        fontFamily: "Inter, Arial, sans-serif",
        boxShadow: "0 1px 8px 0 rgba(163,206,241,0.045)",
      }}
      aria-label="Pomodoro Timer"
    >
      <div className="font-semibold text-gray-600 text-sm mb-2 flex items-center gap-2">
        <svg width={18} height={18} fill="none" style={{ opacity: 0.72 }}>
          <circle cx="9" cy="9" r="8" stroke="#A3CEF1" strokeWidth="1.3" />
          <path
            d="M9 4v5.7a1 1 0 0 0 .52.87l3.5 2.04"
            stroke="#22223B"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
        Pomodoro
      </div>
      <div className={`relative w-full flex flex-col items-center`}>
        {/* Live Circular Timer */}
        <PomodoroProgress
          percent={percent}
          time={secondsLeft}
          mode={mode}
          color="var(--accent, #A3CEF1)"
        />
        <div className={`text-xs text-gray-500 mt-1 mb-1`}>
          {labelMap[mode]} {mode === "session" ? `#${sessionCount + 1}` : ""}
        </div>
      </div>
      <div className="flex gap-2 my-2">
        <button
          className={`px-2 py-1 rounded bg-accent text-white font-medium text-xs transition ${
            running ? "opacity-60 cursor-default" : "hover:bg-blue-500"
          }`}
          onClick={handleStart}
          disabled={running}
          style={{ opacity: running ? 0.6 : 1 }}
        >Start</button>
        <button
          className={`px-2 py-1 rounded bg-yellow-400 text-white font-medium text-xs transition ${!running ? "opacity-60 cursor-default" : "hover:bg-yellow-500"}`}
          onClick={handlePause}
          disabled={!running}
          style={{ opacity: !running ? 0.6 : 1 }}
        >Pause</button>
        <button
          className={`px-2 py-1 rounded bg-gray-300 text-gray-800 font-medium text-xs transition hover:bg-gray-200`}
          onClick={handleReset}
        >Reset</button>
        <button
          className="px-2 py-1 rounded bg-gray-100 text-gray-500 font-medium text-xs transition hover:bg-gray-200"
          style={{ fontSize: "1.1em" }}
          onClick={handleSkip}
          title="Skip to next phase"
        >›</button>
      </div>
      {/* Cycle/streak display */}
      <div className="flex justify-between w-full text-[0.8rem] text-gray-400 mt-1">
        <div>
          {mode === "session"
            ? `${cyclesUntilLong} ${cyclesUntilLong === 1 ? "to long break" : "to long break"}`
            : mode === "long-break"
            ? "Long break"
            : "Break"}
        </div>
        <div>
          <span className="font-semibold text-accent">{sessionCount}</span> {sessionCount === 1 ? "cycle" : "cycles"}
        </div>
      </div>
    </div>
  );
}

/**
 * PomodoroProgress renders a circular progress visual timer and numeric countdown.
 * @param {object} props
 */
function PomodoroProgress({ percent, time, mode, color }) {
  const sz = 48;
  const stroke = 5.5;
  const r = (sz - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = percent * circ;

  return (
    <div className="relative my-1" style={{ width: sz, height: sz }}>
      <svg
        width={sz}
        height={sz}
        viewBox={`0 0 ${sz} ${sz}`}
        className="block"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        {/* Track */}
        <circle
          cx={sz / 2}
          cy={sz / 2}
          r={r}
          stroke="#E0E7EF"
          strokeWidth={stroke}
          fill="none"
        />
        {/* Progress */}
        <circle
          cx={sz / 2}
          cy={sz / 2}
          r={r}
          stroke={mode === "session" ? "#A3CEF1" : mode === "break" ? "#8ED1A5" : "#FAD97F"}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circ}
          strokeDashoffset={circ - dash}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.35s linear" }}
        />
      </svg>
      <span
        className="absolute inset-0 flex items-center justify-center text-[1.13rem] font-semibold select-none"
        style={{ color: mode === "session" ? "#3484B8" : mode === "break" ? "#3C9361" : "#C08C23" }}
      >
        {formatMSS(time)}
      </span>
    </div>
  );
}

// PUBLIC_INTERFACE
function formatMSS(sec) {
  // Formats seconds as MM:SS (or H:MM:SS if needed)
  sec = Math.max(0, Math.floor(sec));
  const mins = Math.floor(sec / 60);
  const secs = sec % 60;
  if (mins >= 60) {
    const hrs = Math.floor(mins / 60);
    return `${hrs}:${(mins % 60).toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default PomodoroTimer;
