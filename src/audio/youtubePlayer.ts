import { PlaybackStatus, TrackMetadata } from '../types';
import { playlistManager } from '../services/playlistManager';

export const PLAYLIST_ID = 'PLEOiStG7CxDKEx0W4AMsDlEDk2qrlns0I';
export const PLAYLIST_URL = `https://www.youtube.com/playlist?list=${PLAYLIST_ID}`;

// 1-second silent PCM WAV audio base64 data URI to keep mobile audio session alive
const SILENT_AUDIO_URI = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';

// Declare minimal YT window interface
declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string | HTMLElement,
        options: {
          height?: string | number;
          width?: string | number;
          videoId?: string;
          playerVars?: Record<string, string | number | boolean>;
          events?: {
            onReady?: (event: { target: YTPlayerInstance }) => void;
            onStateChange?: (event: { data: number; target: YTPlayerInstance }) => void;
            onError?: (event: { data: number }) => void;
          };
        }
      ) => YTPlayerInstance;
      PlayerState: {
        UNSTARTED: number;
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
        BUFFERING: number;
        CUED: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

export interface YTPlayerInstance {
  playVideo: () => void;
  pauseVideo: () => void;
  stopVideo: () => void;
  nextVideo: () => void;
  previousVideo: () => void;
  playVideoAt?: (index: number) => void;
  setShuffle?: (shuffle: boolean) => void;
  loadPlaylist?: (options: { list: string; listType?: string; index?: number; startSeconds?: number }) => void;
  cuePlaylist?: (options: { list: string; listType?: string; index?: number; startSeconds?: number }) => void;
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void;
  setVolume: (volume: number) => void;
  getVolume: () => number;
  mute: () => void;
  unMute: () => void;
  isMuted: () => boolean;
  getPlayerState: () => number;
  getCurrentTime: () => number;
  getDuration: () => number;
  getVideoData?: () => {
    title?: string;
    author?: string;
    video_id?: string;
  };
  getPlaylist?: () => string[];
  getPlaylistIndex?: () => number;
  destroy: () => void;
}

type StateListener = (status: PlaybackStatus) => void;
type TrackListener = (metadata: TrackMetadata) => void;
type ErrorListener = (errorMsg: string) => void;

class YouTubePlayerController {
  private player: YTPlayerInstance | null = null;
  private isApiLoaded = false;
  private isPlayerReady = false;
  private containerId = 'yt-player-element';
  private currentStatus: PlaybackStatus = 'unstarted';
  private trackMetadata: TrackMetadata = {
    title: 'Ghoomte Phirte Radio',
    artist: 'Your road trip soundtrack',
    duration: 0,
    currentTime: 0,
    playlistIndex: 0,
    totalTracks: 0,
  };
  private pollInterval: number | null = null;
  private volume = 75;
  private muted = false;
  private hasStarted = false;
  private currentPlaylistId = playlistManager.getActivePlaylist().playlistId;

  // Background Audio Keep-Alive for mobile
  private bgAudio: HTMLAudioElement | null = null;
  private wasPlayingBeforeHide = false;

  private stateListeners: Set<StateListener> = new Set();
  private trackListeners: Set<TrackListener> = new Set();
  private errorListeners: Set<ErrorListener> = new Set();

  public init(containerId: string): void {
    this.containerId = containerId;
    this.initBackgroundAudioBridge();
    this.initVisibilityListener();
    this.setupMediaSession();
    this.subscribePlaylistManager();
    this.loadIframeScript();
  }

  private subscribePlaylistManager(): void {
    playlistManager.subscribe((active) => {
      if (active && active.playlistId && active.playlistId !== this.currentPlaylistId) {
        this.changePlaylist(active.playlistId);
      }
    });
  }

  public changePlaylist(newPlaylistId: string): void {
    this.currentPlaylistId = newPlaylistId;
    if (this.player && this.isPlayerReady) {
      try {
        if (typeof this.player.loadPlaylist === 'function') {
          this.player.loadPlaylist({
            list: newPlaylistId,
            listType: 'playlist',
          });
          if (typeof this.player.setShuffle === 'function') {
            this.player.setShuffle(true);
          }
        }
      } catch (e) {
        console.warn('Change playlist failed:', e);
      }
    }
  }

  public getPlaylistId(): string {
    return this.currentPlaylistId;
  }

  public getPlaylistUrl(): string {
    return `https://www.youtube.com/playlist?list=${this.currentPlaylistId}`;
  }

  /**
   * Initializes background audio bridge using silent audio element
   * to register audio pipeline with mobile OS (iOS/Android).
   */
  private initBackgroundAudioBridge(): void {
    if (typeof window === 'undefined') return;
    try {
      this.bgAudio = new Audio(SILENT_AUDIO_URI);
      this.bgAudio.loop = true;
      this.bgAudio.preload = 'auto';
    } catch (e) {
      console.warn('Background audio bridge init warning:', e);
    }
  }

  /**
   * Listens to visibility changes so when user minimizes or returns,
   * we handle state gracefully and resume audio.
   */
  private initVisibilityListener(): void {
    if (typeof document === 'undefined') return;

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        if (this.currentStatus === 'playing') {
          this.wasPlayingBeforeHide = true;
          // Keep background keep-alive active
          if (this.bgAudio) {
            this.bgAudio.play().catch(() => {});
          }
        }
      } else if (document.visibilityState === 'visible') {
        if (this.wasPlayingBeforeHide) {
          this.wasPlayingBeforeHide = false;
          // Resume YouTube playback if paused by browser visibility change
          if (this.currentStatus !== 'playing') {
            setTimeout(() => {
              this.play();
            }, 250);
          }
        }
      }
    });
  }

  /**
   * Registers Media Session API for iOS Lockscreen / Android Notification controls.
   */
  private setupMediaSession(): void {
    if (typeof window === 'undefined' || !('mediaSession' in navigator)) return;

    try {
      navigator.mediaSession.setActionHandler('play', () => {
        this.play();
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        this.pause();
      });
      navigator.mediaSession.setActionHandler('previoustrack', () => {
        this.previous();
      });
      navigator.mediaSession.setActionHandler('nexttrack', () => {
        this.next();
      });
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.seekTime !== undefined) {
          this.seekTo(details.seekTime);
        }
      });
    } catch (e) {
      console.warn('MediaSession handler warning:', e);
    }
  }

  private updateMediaSession(): void {
    if (typeof window === 'undefined' || !('mediaSession' in navigator)) return;

    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: this.trackMetadata.title || 'Ghoomte Phirte Radio',
        artist: this.trackMetadata.artist || 'Road Trip Classics',
        album: 'Ghoomte Phirte (घूमते फिरते)',
        artwork: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      });

      navigator.mediaSession.playbackState = this.currentStatus === 'playing' ? 'playing' : 'paused';

      if ('setPositionState' in navigator.mediaSession && this.trackMetadata.duration > 0) {
        navigator.mediaSession.setPositionState({
          duration: this.trackMetadata.duration,
          playbackRate: 1,
          position: Math.min(this.trackMetadata.currentTime, this.trackMetadata.duration),
        });
      }
    } catch {
      // safe fallback
    }
  }

  private loadIframeScript(): void {
    if (window.YT && window.YT.Player) {
      this.isApiLoaded = true;
      this.createPlayer();
      return;
    }

    if (document.getElementById('yt-iframe-api-script')) {
      return;
    }

    const tag = document.createElement('script');
    tag.id = 'yt-iframe-api-script';
    tag.src = 'https://www.youtube.com/iframe_api';

    const prevReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (prevReady) prevReady();
      this.isApiLoaded = true;
      this.createPlayer();
    };

    const firstScriptTag = document.getElementsByTagName('script')[0];
    if (firstScriptTag && firstScriptTag.parentNode) {
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    } else {
      document.head.appendChild(tag);
    }
  }

  private createPlayer(): void {
    const el = document.getElementById(this.containerId);
    if (!el || !window.YT || !window.YT.Player) return;

    try {
      this.player = new window.YT.Player(this.containerId, {
        height: '100%',
        width: '100%',
        playerVars: {
          listType: 'playlist',
          list: this.currentPlaylistId,
          autoplay: 0,
          controls: 1,
          enablejsapi: 1,
          fs: 0,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          origin: window.location.origin,
        },
        events: {
          onReady: (event) => {
            this.isPlayerReady = true;
            this.player = event.target;
            this.player.setVolume(this.volume);
            if (typeof this.player.setShuffle === 'function') {
              this.player.setShuffle(true);
            }
            this.updateMetadata();
            this.startPolling();
          },
          onStateChange: (event) => {
            const state = event.data;
            if (window.YT && window.YT.PlayerState) {
              switch (state) {
                case window.YT.PlayerState.PLAYING:
                  this.currentStatus = 'playing';
                  if (this.bgAudio) this.bgAudio.play().catch(() => {});
                  break;
                case window.YT.PlayerState.PAUSED:
                  this.currentStatus = 'paused';
                  break;
                case window.YT.PlayerState.BUFFERING:
                  this.currentStatus = 'buffering';
                  break;
                case window.YT.PlayerState.ENDED:
                  this.currentStatus = 'ended';
                  break;
                default:
                  this.currentStatus = 'unstarted';
              }
            }
            this.notifyStateListeners();
            this.updateMetadata();
            this.updateMediaSession();
          },
          onError: (event) => {
            console.warn('YouTube Player Event Error:', event.data);
            this.currentStatus = 'error';
            this.notifyStateListeners();
            this.notifyErrorListeners(`Playback issue (${event.data}). You can open the playlist on YouTube.`);
          },
        },
      });
    } catch (err) {
      console.error('Failed to initialize YouTube Player:', err);
    }
  }

  private startPolling(): void {
    if (this.pollInterval) clearInterval(this.pollInterval);
    this.pollInterval = window.setInterval(() => {
      if (this.player && this.isPlayerReady) {
        this.updateMetadata();
      }
    }, 1000);
  }

  private updateMetadata(): void {
    if (!this.player || !this.isPlayerReady) return;

    try {
      let title = this.trackMetadata.title;
      let artist = this.trackMetadata.artist;

      if (typeof this.player.getVideoData === 'function') {
        const videoData = this.player.getVideoData();
        if (videoData && videoData.title) {
          title = videoData.title;
          artist = videoData.author || 'Hindi Classic';
        }
      }

      let duration = 0;
      let currentTime = 0;

      if (typeof this.player.getDuration === 'function') {
        duration = this.player.getDuration() || 0;
      }
      if (typeof this.player.getCurrentTime === 'function') {
        currentTime = this.player.getCurrentTime() || 0;
      }

      let playlistIndex = 0;
      let totalTracks = 0;

      if (typeof this.player.getPlaylistIndex === 'function') {
        playlistIndex = this.player.getPlaylistIndex() || 0;
      }
      if (typeof this.player.getPlaylist === 'function') {
        const list = this.player.getPlaylist();
        if (list && Array.isArray(list)) {
          totalTracks = list.length;
        }
      }

      this.trackMetadata = {
        title,
        artist,
        duration,
        currentTime,
        playlistIndex,
        totalTracks,
      };

      this.notifyTrackListeners();
      this.updateMediaSession();
    } catch {
      // safe fallback
    }
  }

  public play(): void {
    if (this.bgAudio) {
      this.bgAudio.play().catch(() => {});
    }

    if (this.player && this.isPlayerReady) {
      try {
        if (!this.hasStarted) {
          this.hasStarted = true;
          if (typeof this.player.setShuffle === 'function') {
            this.player.setShuffle(true);
          }
          if (typeof this.player.getPlaylist === 'function' && typeof this.player.playVideoAt === 'function') {
            const list = this.player.getPlaylist();
            if (list && list.length > 1) {
              const randomIndex = Math.floor(Math.random() * list.length);
              this.player.playVideoAt(randomIndex);
              return;
            }
          }
        }
        this.player.playVideo();
      } catch (e) {
        console.warn('Play video failed:', e);
      }
    }
  }

  public pause(): void {
    if (this.player && this.isPlayerReady) {
      try {
        this.player.pauseVideo();
        if (this.bgAudio) {
          this.bgAudio.pause();
        }
      } catch (e) {
        console.warn('Pause video failed:', e);
      }
    }
  }

  public togglePlay(): void {
    if (this.currentStatus === 'playing') {
      this.pause();
    } else {
      this.play();
    }
  }

  public next(): void {
    if (this.player && this.isPlayerReady) {
      try {
        this.player.nextVideo();
      } catch (e) {
        console.warn('Next video failed:', e);
      }
    }
  }

  public previous(): void {
    if (this.player && this.isPlayerReady) {
      try {
        this.player.previousVideo();
      } catch (e) {
        console.warn('Previous video failed:', e);
      }
    }
  }

  public seekTo(seconds: number): void {
    if (this.player && this.isPlayerReady) {
      try {
        this.player.seekTo(seconds, true);
        this.trackMetadata.currentTime = seconds;
        this.notifyTrackListeners();
        this.updateMediaSession();
      } catch (e) {
        console.warn('SeekTo failed:', e);
      }
    }
  }

  public setVolume(vol: number): void {
    this.volume = Math.max(0, Math.min(100, vol));
    if (this.player && this.isPlayerReady) {
      try {
        this.player.setVolume(this.volume);
        if (this.volume > 0 && this.muted) {
          this.unMute();
        }
      } catch (e) {
        console.warn('Set volume failed:', e);
      }
    }
  }

  public toggleMute(): void {
    if (!this.player || !this.isPlayerReady) return;
    try {
      if (this.muted) {
        this.unMute();
      } else {
        this.mute();
      }
    } catch (e) {
      console.warn('Toggle mute failed:', e);
    }
  }

  public mute(): void {
    if (this.player && this.isPlayerReady) {
      this.player.mute();
      this.muted = true;
    }
  }

  public unMute(): void {
    if (this.player && this.isPlayerReady) {
      this.player.unMute();
      this.muted = false;
    }
  }

  public isLoaded(): boolean {
    return this.isApiLoaded;
  }

  public getVolume(): number {
    return this.volume;
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public getStatus(): PlaybackStatus {
    return this.currentStatus;
  }

  public getMetadata(): TrackMetadata {
    return this.trackMetadata;
  }

  public onStateChange(listener: StateListener): () => void {
    this.stateListeners.add(listener);
    listener(this.currentStatus);
    return () => this.stateListeners.delete(listener);
  }

  public onTrackChange(listener: TrackListener): () => void {
    this.trackListeners.add(listener);
    listener(this.trackMetadata);
    return () => this.trackListeners.delete(listener);
  }

  public onError(listener: ErrorListener): () => void {
    this.errorListeners.add(listener);
    return () => this.errorListeners.delete(listener);
  }

  private notifyStateListeners(): void {
    this.stateListeners.forEach((l) => l(this.currentStatus));
  }

  private notifyTrackListeners(): void {
    this.trackListeners.forEach((l) => l(this.trackMetadata));
  }

  private notifyErrorListeners(msg: string): void {
    this.errorListeners.forEach((l) => l(msg));
  }

  public destroy(): void {
    if (this.pollInterval) clearInterval(this.pollInterval);
    if (this.bgAudio) {
      try {
        this.bgAudio.pause();
        this.bgAudio = null;
      } catch {
        // ignore
      }
    }
    if (this.player && typeof this.player.destroy === 'function') {
      try {
        this.player.destroy();
      } catch {
        // ignore
      }
    }
    this.player = null;
    this.isPlayerReady = false;
  }
}

export const ytController = new YouTubePlayerController();
