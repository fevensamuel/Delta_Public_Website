import React, { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Music, SkipForward } from 'lucide-react';
import { useAudioPlayer } from '../audio/AudioPlayerContext';

/**
 * Floating control for the background nasheed/recitation playlist.
 * Positioned bottom-left so it doesn't collide with the WhatsApp cluster
 * (fixed at the right edge). Playback only ever starts from a direct user
 * tap here — browsers block autoplay-with-sound anyway.
 */
export const NasheedPlayerButton: React.FC = () => {
  const {
    isPlaying,
    isMuted,
    currentTrackTitle,
    hasTracks,
    isLoading,
    toggle,
    next,
    toggleMute,
  } = useAudioPlayer();
  const [expanded, setExpanded] = useState(false);

  // Don't show the player while loading or if there are no tracks.
  if (isLoading || !hasTracks) return null;

  return (
    <div className="fixed left-4 sm:left-6 bottom-4 sm:bottom-6 z-40 flex items-center gap-2">
      {expanded && (
        <div className="bg-[#0E0C0A] text-white px-4 py-2.5 shadow-lg border border-white/10 flex items-center gap-3 max-w-[260px]">
          <Music className="w-3.5 h-3.5 text-[#A6853A] flex-shrink-0" />
          <span className="text-[12px] text-[#E7E2D9] truncate">
            {currentTrackTitle || 'Islamic recitation'}
          </span>

          {/* Next track button */}
          <button
            onClick={next}
            aria-label="Next track"
            title="Next track"
            className="text-[#A6853A] hover:text-white transition-colors flex-shrink-0"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          {/* Mute toggle */}
          <button
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
            className="text-[#A6853A] hover:text-white transition-colors flex-shrink-0"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      )}

      <button
        onClick={() => {
          toggle();
          setExpanded(true);
        }}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => !isPlaying && setExpanded(false)}
        aria-label={isPlaying ? 'Pause recitation' : 'Play recitation'}
        title={isPlaying ? 'Pause recitation' : 'Play recitation'}
        className="w-12 h-12 rounded-full bg-[#0E0C0A] hover:bg-[#1A1712] border border-[#A6853A]/50 text-[#A6853A] flex items-center justify-center shadow-lg transition-colors flex-shrink-0"
      >
        {isPlaying ? (
          <Pause className="w-4 h-4 fill-current" />
        ) : (
          <Play className="w-4 h-4 fill-current ml-0.5" />
        )}
      </button>
    </div>
  );
};