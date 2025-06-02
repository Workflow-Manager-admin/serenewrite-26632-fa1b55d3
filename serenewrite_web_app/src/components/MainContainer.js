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
 * Applies a cohesive, modern light theme for visual clarity and user comfort,
 * using gentle accent/backgrounds, soft shadows, and separation of writing area vs tools.
 */
// PUBLIC_INTERFACE
function MainContainer() {
  // The layout uses light backgrounds, gentle contrast, rounded elements, subtle accent highlights, and good whitespace.
  // Integrated Tailwind best practices & design tokens reflecting: #F5F6FA (primary), #A3CEF1 (accent), #22223B (secondary).

  return (
    <div className="min-h-screen bg-[#F5F6FA] text-gray-900 flex flex-col items-center break-words w-full transition-colors duration-300 px-2 sm:px-0">
      {/* Top Control Panels: streak, analytics */}
      <div className="w-full flex flex-col items-center pt-20 pb-8">
        <div className="w-full max-w-3xl flex flex-row justify-between items-start gap-2 sm:gap-6 px-1 sm:px-0 mb-3">
          <div className="flex flex-col items-start gap-2">
            {/* Streak Goal Tracker with strong clarity */}
            <div className="transition-all duration-300">
              <StreakGoalTracker />
            </div>
          </div>
          {/* Analytics Panel — visually distinct, high clarity */}
          <div className="transition-all duration-300">
            <AnalyticsPanel />
          </div>
        </div>
        {/* Pomodoro & Soundbar, visually light and easily distinguished */}
        <div className="w-full max-w-2xl flex flex-row justify-center md:justify-end gap-3 mb-2">
          <div className="flex flex-row space-x-2">
            <PomodoroTimer />
            <AmbientSoundBar />
          </div>
        </div>
      </div>
      {/* Main Writing Zone: Editor and Tool Panels */}
      <div className="w-full flex flex-row justify-center items-start gap-4 md:gap-9 lg:gap-16 px-1 sm:px-0 relative z-20">
        {/* AI Tools: gently outlined card, only on large screens */}
        <aside className="hidden lg:flex flex-col pt-3 w-[220px] items-start">
          <div className="transition-opacity duration-200 ease-in opacity-90 hover:opacity-100 focus-within:opacity-100">
            <AIEnhanceTools />
          </div>
        </aside>
        {/* The actual writing/editor and export: strongly separated on a neutral card with shadow */}
        <main className="flex-1 max-w-2xl mx-auto flex flex-col items-center z-10">
          <section className="w-full flex flex-col items-center">
            <EditorArea />
            <div className="w-full flex flex-row justify-end mt-5 transition-opacity duration-200">
              <ExportBar />
            </div>
          </section>
        </main>
      </div>
      {/* Intentional: Light accent border at footer for sense of completion */}
      <footer className="w-full h-4 mt-12 flex items-center justify-center">
        <div className="w-28 h-1.5 rounded-full bg-[linear-gradient(90deg,_#A3CEF1_45%,_#F5F6FA_100%)] opacity-70" />
      </footer>
    </div>
  );
}

export default MainContainer;
