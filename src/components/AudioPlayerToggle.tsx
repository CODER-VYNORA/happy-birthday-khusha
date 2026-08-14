import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface AudioPlayerToggleProps {
  isPlaying: boolean;
  onToggle: () => void;
}

export const AudioPlayerToggle: React.FC<AudioPlayerToggleProps> = ({ isPlaying, onToggle }) => {
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const handleFirstClick = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
      }
    };
    window.addEventListener('click', handleFirstClick, { once: true });
    return () => window.removeEventListener('click', handleFirstClick);
  }, [hasInteracted]);

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
      <button
        id="btn-music-toggle"
        onClick={() => {
          sound.playSfx('click');
          onToggle();
        }}
        className={`flex items-center gap-2.5 px-3.5 py-2 rounded-full backdrop-blur-md transition-all duration-300 shadow-lg border text-sm font-medium ${
          isPlaying
            ? 'bg-pink-500/20 hover:bg-pink-500/30 text-pink-200 border-pink-500/40 shadow-pink-500/20'
            : 'bg-slate-900/60 hover:bg-slate-800/80 text-slate-300 border-slate-700/50'
        }`}
        title={isPlaying ? 'Mute Background Music' : 'Play Birthday Music'}
      >
        {isPlaying ? (
          <>
            <div className="flex items-end gap-0.5 h-3.5 w-4">
              <span className="w-1 bg-pink-400 rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-full" />
              <span className="w-1 bg-pink-300 rounded-full animate-[pulse_0.8s_ease-in-out_infinite_0.2s] h-2/3" />
              <span className="w-1 bg-pink-400 rounded-full animate-[pulse_0.5s_ease-in-out_infinite_0.4s] h-4/5" />
            </div>
            <span className="text-xs font-semibold tracking-wide">BGM: ON 🎵</span>
          </>
        ) : (
          <>
            <VolumeX className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-medium text-slate-400">Music: OFF</span>
          </>
        )}
      </button>
    </div>
  );
};
