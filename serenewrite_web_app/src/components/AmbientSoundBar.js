import React, { useState, useRef } from "react";
import { Howl } from "howler";

/**
 * AmbientSoundBar provides interactive selection and playback of calming ambient soundscapes.
 * Allows play/pause/stop and volume control for background focus audio.
 * Uses howler.js for sound management.
 */
// PUBLIC_INTERFACE
function AmbientSoundBar() {
  // List of available soundscapes (expandable)
  const SOUNDSCAPES = [
    {
      key: "rain",
      label: "Rain",
      url: "https://cdn.pixabay.com/audio/2022/07/26/audio_124b66e927.mp3",
    },
    {
      key: "forest",
      label: "Forest",
      url: "https://cdn.pixabay.com/audio/2023/04/14/audio_141b684b39.mp3",
    },
    {
      key: "waves",
      label: "Waves",
      url: "https://cdn.pixabay.com/audio/2022/03/15/audio_115b3ba2b9.mp3",
    },
    {
      key: "fireplace",
      label: "Fireplace",
      url: "https://cdn.pixabay.com/audio/2022/05/25/audio_1214b494f7.mp3",
    },
  ];

  const [selectedKey, setSelectedKey] = useState(null); // key of current selection
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const howlRef = useRef(null);

  // Play sound
  const handlePlay = () => {
    if (!selectedKey) return;
    stopCurrent(); // Stop any running track
    const soundObj = SOUNDSCAPES.find(s => s.key === selectedKey);
    if (!soundObj) return;
    howlRef.current = new Howl({
      src: [soundObj.url],
      volume: volume,
      loop: true,
      html5: true,
      onend: () => setIsPlaying(false),
    });
    howlRef.current.play();
    setIsPlaying(true);
  };

  // Pause sound
  const handlePause = () => {
    howlRef.current?.pause();
    setIsPlaying(false);
  };

  // Stop and unload sound
  const stopCurrent = () => {
    if (howlRef.current) {
      howlRef.current.stop();
      howlRef.current.unload();
      howlRef.current = null;
    }
    setIsPlaying(false);
  };

  // Change soundscape (stop current, load new selection)
  const handleSelect = (key) => {
    if (key === selectedKey) return; // No change
    stopCurrent();
    setSelectedKey(key);
  };

  // Volume changes
  const handleVolumeChange = (v) => {
    setVolume(v);
    if (howlRef.current) {
      howlRef.current.volume(v);
    }
  };

  // Side effect: if soundscape changes while playing, start new track
  React.useEffect(() => {
    if (selectedKey && isPlaying) {
      handlePlay();
    }
    // eslint-disable-next-line
    // Only run when selectedKey or isPlaying state
    // ignore handlePlay function warning
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedKey]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => stopCurrent();
    // eslint-disable-next-line
  }, []);

  return (
    <div
      className="bg-white/80 border border-gray-200 rounded shadow px-4 py-2 text-xs text-gray-800 min-w-[200px] flex flex-col items-stretch gap-2"
      style={{
        background: "rgba(255,255,255,0.96)",
        fontFamily: "Inter, Arial, sans-serif",
        boxShadow: "0 1px 10px 0 rgba(163,206,241,0.035)"
      }}
      aria-label="Ambient Sound Bar"
    >
      <div className="font-semibold text-gray-700 text-sm mb-1 flex items-center gap-2">
        <svg aria-label="Soundscapes" width="18" height="18" fill="none" className="opacity-80"><circle cx="9" cy="9" r="8" stroke="#A3CEF1" strokeWidth="1.3"/><path d="M4 12.2c2-1.3 2.6-2 2.6-7" stroke="#22223B" strokeWidth="1.1" strokeLinecap="round"/><path d="M14.3 13C13 10.7 14 5.4 9.7 5.4" stroke="#A3CEF1" strokeWidth="1.1" strokeLinecap="round"/></svg>
        Soundscapes
      </div>
      <div className="flex gap-2 justify-between mb-1">
        {SOUNDSCAPES.map((sc) => (
          <button
            key={sc.key}
            className={`px-2 py-1 rounded text-xs font-medium border transition-colors duration-100
              ${selectedKey === sc.key ? 'bg-accent/80 text-white border-accent shadow' : 'bg-white hover:bg-accent/10 text-blue-900 border-gray-200'}
            `}
            aria-pressed={selectedKey === sc.key}
            tabIndex={0}
            onClick={() => handleSelect(sc.key)}
            style={{ minWidth: 50 }}
            title={sc.label}
          >
            {sc.label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-1">
        <button
          className={`px-2 rounded bg-accent text-white border-none text-sm font-bold shadow ${isPlaying ? 'opacity-80' : 'opacity-100'}`}
          title="Play"
          aria-label="Play"
          onClick={handlePlay}
          disabled={!selectedKey || isPlaying}
          style={{ opacity: !selectedKey || isPlaying ? 0.5 : 1 }}
        >
          ►
        </button>
        <button
          className={`px-2 rounded bg-yellow-400 text-white text-sm font-bold shadow ${!isPlaying ? 'opacity-80' : 'opacity-100'}`}
          title="Pause"
          aria-label="Pause"
          onClick={handlePause}
          disabled={!isPlaying}
          style={{ opacity: !isPlaying ? 0.5 : 1 }}
        >
          ❚❚
        </button>
        <button
          className="px-2 rounded bg-gray-300 text-gray-800 text-sm font-bold shadow"
          title="Stop"
          aria-label="Stop"
          onClick={stopCurrent}
          disabled={!isPlaying && !howlRef.current}
          style={{ opacity: (!isPlaying && !howlRef.current) ? 0.45 : 1 }}
        >
          ■
        </button>
        <div className="flex-1 ml-2">
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            aria-label="Volume"
            onChange={e => handleVolumeChange(parseFloat(e.target.value))}
            className="w-full accent-accent"
            style={{ verticalAlign: 'middle' }}
          />
        </div>
      </div>
      <div className="text-[0.76rem] text-blue-900/50 font-medium mt-1">
        {selectedKey ?
          isPlaying
            ? "Playing: " + (SOUNDSCAPES.find(s => s.key === selectedKey)?.label || "Sound") + "..."
            : "Ready: " + (SOUNDSCAPES.find(s => s.key === selectedKey)?.label || "Sound")
        : "Select a soundscape"}
      </div>
    </div>
  );
}

export default AmbientSoundBar;
