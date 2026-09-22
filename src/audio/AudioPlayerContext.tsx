import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import {
  AudioPlaylistTrack,
  AUDIO_PLAYLIST,
  fetchAudioPlaylist,
} from '../data/audioTracks';
import { getCurrentLanguage } from '../api/client';
import { useLanguage } from '../i18n/LanguageContext';

interface AudioContextType {
  isPlaying: boolean;
  isMuted: boolean;
  currentTrackTitle: string | null;
  hasTracks: boolean;
  isLoading: boolean;
  toggle: () => void;
  next: () => void;
  toggleMute: () => void;
}

const AudioPlayerContext = createContext<AudioContextType | undefined>(undefined);

const MUTE_STORAGE_KEY = 'dvt_audio_muted';

export const AudioPlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Try to read active language from LanguageContext if present.
  // Falls back to the localStorage-based helper.
  let activeLanguage = 'en';
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { language } = useLanguage();
    activeLanguage = language || 'en';
  } catch {
    activeLanguage = getCurrentLanguage();
  }

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playlist, setPlaylist] = useState<AudioPlaylistTrack[]>(AUDIO_PLAYLIST);
  const [isLoading, setIsLoading] = useState(true);
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(() => {
    try {
      return localStorage.getItem(MUTE_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const hasTracks = playlist.length > 0;
  const currentTrack = hasTracks ? playlist[trackIndex % playlist.length] : null;

  // Fetch the playlist from the backend whenever the language changes.
  // The backend returns the same tracks regardless of language, but we
  // re-pick localized titles here.
  useEffect(() => {
    let mounted = true;
    setIsLoading(true);

    fetchAudioPlaylist(activeLanguage)
      .then((tracks) => {
        if (!mounted) return;
        setPlaylist(tracks);
        setTrackIndex(0);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeLanguage]);

  // Create the <audio> element once and keep it alive for the life of
  // the app so playback survives navigation within the SPA.
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'none';
    audioRef.current = audio;

    const handleEnded = () => {
      setTrackIndex((i) => (playlist.length ? (i + 1) % playlist.length : i));
    };
    const handlePause = () => setIsPlaying(false);
    const handlePlay = () => setIsPlaying(true);

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('play', handlePlay);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('play', handlePlay);
      audio.pause();
      audioRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the element's muted state in sync + persist the preference.
  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = isMuted;
    try {
      localStorage.setItem(MUTE_STORAGE_KEY, String(isMuted));
    } catch {
      // ignore
    }
  }, [isMuted]);

  // When the track index changes, load the new source. If playback was
  // already underway, keep it going with the next track.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    const wasPlaying = isPlaying;
    audio.src = currentTrack.src;
    if (wasPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackIndex, playlist]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    if (isPlaying) {
      audio.pause();
      return;
    }

    if (!audio.src) {
      audio.src = currentTrack.src;
    }
    audio.play().catch(() => setIsPlaying(false));
  };

  const next = () => {
    if (!hasTracks) return;
    setTrackIndex((i) => (i + 1) % playlist.length);
  };

  const toggleMute = () => setIsMuted((m) => !m);

  return (
    <AudioPlayerContext.Provider
      value={{
        isPlaying,
        isMuted,
        currentTrackTitle: currentTrack?.title ?? null,
        hasTracks,
        isLoading,
        toggle,
        next,
        toggleMute,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};

export function useAudioPlayer(): AudioContextType {
  const ctx = useContext(AudioPlayerContext);
  if (!ctx) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
  }
  return ctx;
}