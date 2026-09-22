// src/data/audioTracks.ts
import { api } from '../api/client';

/**
 * A single track as consumed by the AudioPlayerContext.
 * The backend returns AudioTrack (id, titleEn, titleAm, titleAr, audioUrl, ...).
 * We normalize it here into a simple shape the player understands.
 */
export interface AudioPlaylistTrack {
  id: string;
  title: string;
  src: string;
  titleEn?: string;
  titleAm?: string;
  titleAr?: string;
}

/**
 * Static fallback playlist.
 * Keep empty by default — the frontend now fetches real tracks from the
 * backend at /api/audio. If the API fails or returns nothing, the player
 * will simply have no tracks and hide itself.
 */
export const AUDIO_PLAYLIST: AudioPlaylistTrack[] = [];

/**
 * Pick the right localized title for a track based on the active language.
 */
function pickTitle(
  track: {
    titleEn?: string;
    titleAm?: string;
    titleAr?: string;
    title?: string;
  },
  lang: string
): string {
  const l = (lang || 'en').toLowerCase();
  if (l.startsWith('ar') && track.titleAr) return track.titleAr;
  if (l.startsWith('am') && track.titleAm) return track.titleAm;
  return track.titleEn || track.title || 'Untitled';
}

/**
 * Fetch active audio tracks from the backend.
 * Returns a normalized playlist ready for the AudioPlayerContext.
 * Returns [] on any error so the player never crashes.
 */
export async function fetchAudioPlaylist(lang: string): Promise<AudioPlaylistTrack[]> {
  try {
    const res = await api.get<any>('/audio');
    const list = Array.isArray(res?.data) ? res.data : [];
    if (!list.length) return [];

    return list
      .filter((t: any) => t && t.audioUrl)
      .map((t: any) => ({
        id: String(t.id),
        title: pickTitle(t, lang),
        src: t.audioUrl,
        titleEn: t.titleEn || '',
        titleAm: t.titleAm || '',
        titleAr: t.titleAr || '',
      }));
  } catch (error) {
    console.warn('⚠️ Failed to fetch audio playlist from API:', error);
    return [];
  }
}