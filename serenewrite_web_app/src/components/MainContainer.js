import React from "react";
import EditorArea from "./EditorArea";
import AnalyticsPanel from "./AnalyticsPanel";
import AmbientSoundBar from "./AmbientSoundBar";
import PomodoroTimer from "./PomodoroTimer";
import AIEnhanceTools from "./AIEnhanceTools";
import StreakGoalTracker from "./StreakGoalTracker";
import ExportBar from "./ExportBar";

/**
 * MainContainer is the root view housing all key functional areas for SereneWrite.
 * All subcomponents are imported and arranged according to the minimalist UI layout.
 * Layout uses Tailwind utility classes.
 */
// PUBLIC_INTERFACE
function MainContainer() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col items-center justify-center transition-colors">
      {/* Topbar & controls */}
      <div className="w-full max-w-5xl flex items-center justify-between pt-8 pb-4 px-6">
        {/* Streak & Goal Tracker on left */}
        <StreakGoalTracker />
        {/* Pomodoro and AmbientSoundBar on right */}
        <div className="flex gap-3">
          <PomodoroTimer />
          <AmbientSoundBar />
        </div>
      </div>
      {/* Main writing/editor area with sidebar tools */}
      <div className="relative w-full max-w-5xl flex flex-1 items-stretch gap-6 px-4 pb-12">
        {/* (Optional future) sidebar zone for tools */}
        <aside className="hidden md:block w-48">
          <AIEnhanceTools />
        </aside>
        <main className="flex-1 flex flex-col items-center">
          <EditorArea />
          <div className="w-full flex justify-end mt-2">
            <ExportBar />
          </div>
        </main>
        {/* Analytics panel floating or at the edge */}
        <aside className="w-48 flex justify-end">
          <AnalyticsPanel />
        </aside>
      </div>
    </div>
  );
}

export default MainContainer;
