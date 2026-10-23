export type SceneMode = 'day' | 'night' | 'rain';

export interface AtmosphereState {
  scene: SceneMode;
  radioHiss: boolean;
  rainSound: boolean;
}

export type PlaybackStatus = 'unstarted' | 'playing' | 'paused' | 'buffering' | 'ended' | 'error';

export interface TrackMetadata {
  title: string;
  artist: string;
  duration: number;
  currentTime: number;
  playlistIndex: number;
  totalTracks: number;
  isLive?: boolean;
}

export interface PlaylistMood {
  id: string;
  title: string;
  subtitle: string;
  era: string;
  description: string;
  color: string;
  icon: string;
  targetUrl: string;
  isMain?: boolean;
}

export interface SavedPlaylist {
  id: string;
  playlistId: string;
  title: string;
  isActive: boolean;
  createdAt: number;
}
