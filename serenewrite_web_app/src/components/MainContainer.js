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
  // Modern, minimal layout:
  // - Soft background expands full viewport; writing area is centered and gently shadowed.
  // - Tool panels (analytics, AI, streak, ambience, Pomodoro) are visually minimized, faded, or shown only on hover/focus.
  // - Uses Tailwind for all layout and visuals.

  return (
    <div className="min-h-screen w-full bg-[#F5F6FA] text-gray-900 flex flex-col items-center justify-center transition-colors duration-300 px-0">
      {/* Floating control zone: analytics, pomodoro, sound, streak at edge or slide in/out */}
      <div className="relative flex flex-col items-center w-full z-10 pt-16 pb-6">

        <div className="w-full max-w-3xl flex flex-row justify-between items-start px-2 md:px-0 mb-4">
          <div className="flex flex-row gap-3 items-start">
            {/* Streak Goal Tracker fades out until focused */}
            <div className="group relative transition-all duration-300">
              <div className="opacity-70 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200">
                <StreakGoalTracker />
              </div>
            </div>
          </div>

          {/* Analytics Panel floats right, minimal unless hovered */}
          <div className="group relative transition-all duration-300">
            <div className="opacity-70 hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
              <AnalyticsPanel />
            </div>
          </div>
        </div>
        
        {/* Ambient/Pomodoro bar gently overlayed at top center on hover/focus or minimal at sm */}
        <div className="w-full max-w-2xl flex flex-row justify-center md:justify-end gap-3 mb-2">
          {/* Controls fade/minimize; appear on hover/focus */}
          <div className="group flex flex-row space-x-2 pointer-events-none md:pointer-events-auto">
            <div className="opacity-70 hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 pointer-events-auto">
              <PomodoroTimer />
            </div>
            <div className="opacity-70 hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 pointer-events-auto">
              <AmbientSoundBar />
            </div>
          </div>
        </div>

        {/* Main central writing area with subtle card shadow and minimalist UI */}
        <div className="relative w-full flex flex-row justify-center items-start gap-7">
          {/* AI Tools panel hidden on mobile, fades in on hover/focus */}
          <aside className="hidden lg:flex flex-col pt-3 w-[220px] items-start">
            <div className="opacity-60 hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
              <AIEnhanceTools />
            </div>
          </aside>

          <main className="flex-1 max-w-2xl mx-auto flex flex-col items-center z-10">
            <EditorArea />
            <div className="w-full flex flex-row justify-end mt-4 opacity-70 hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
              <ExportBar />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default MainContainer;
