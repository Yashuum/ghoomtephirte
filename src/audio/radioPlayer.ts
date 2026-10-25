import { PlaybackStatus, TrackMetadata } from '../types';

export interface RadioStation {
  id: string;
  frequency: string;
  title: string;
  subtitle: string;
  streamUrl: string;
  fallbackUrl?: string;
  era: string;
}

export const STATIONS: RadioStation[] = [
  {
    id: '90s-bollywood-superhits',
    frequency: '92.7 FM',
    title: '90s Bollywood Evergreen Hits',
    subtitle: 'Kumar Sanu, Udit Narayan, Alka Yagnik & A.R. Rahman',
    streamUrl: 'https://stream.zeno.fm/60ef4p33vxquv',
    fallbackUrl: 'https://stream.zeno.fm/f3wvbbqmdg8uv',
    era: '1990 - 1999',
  },
  {
    id: 'kishore-kumar-express',
    frequency: '98.3 FM',
    title: 'Kishore Kumar Non-Stop Express',
    subtitle: 'Evergreen Solos, Yodels, Whistles & Highway Anthems',
    streamUrl: 'https://stream.zeno.fm/0ghtfp8ztm0uv',
    fallbackUrl: 'https://stream.zeno.fm/f3wvbbqmdg8uv',
    era: '1970 - 1989',
  },
  {
    id: 'late-night-ghazals',
    frequency: '104.0 FM',
    title: 'Late Night Soulful Ghazals',
    subtitle: 'Jagjit Singh, Pankaj Udhas, Mehdi Hassan & Ghulam Ali',
    streamUrl: 'https://stream.zeno.fm/yo0kzyzedittv',
    fallbackUrl: 'https://stream.zeno.fm/a83h74591q8uv',
    era: 'Midnight Poetry',
  },
  {
    id: 'purani-jeans-nostalgia',
    frequency: '107.2 FM',
    title: 'Purani Jeans & Vividh Bharati',
    subtitle: 'Akashvani Nostalgia & Classic Vintage Cinema',
    streamUrl: 'https://stream.zeno.fm/f42283921k8uv',
    fallbackUrl: 'https://stream.zeno.fm/f3wvbbqmdg8uv',
    era: 'Evergreen Radio',
  },
  {
    id: '2000s-bollywood-romance',
    frequency: '91.1 FM',
    title: '2000s Bollywood Road Trip',
    subtitle: 'KK, Sonu Nigam, Shreya Ghoshal & Mohit Chauhan',
    streamUrl: 'https://stream.zeno.fm/wn6muavgfr2tv',
    fallbackUrl: 'https://stream.zeno.fm/pxc55r5uyc9uv',
    era: '2000 - 2012',
  },
  {
    id: 'retro-monsoon-drive',
    frequency: '93.5 FM',
    title: 'Retro Monsoon Rain Drive',
    subtitle: 'Rimjhim Gire Sawan & Bheegi Bheegi Raaton Mein',
    streamUrl: 'https://stream.zeno.fm/60ef4p33vxquv',
    fallbackUrl: 'https://stream.zeno.fm/f3wvbbqmdg8uv',
    era: 'Monsoon Magic',
  },
  {
    id: 'mohammed-rafi-classics',
    frequency: '95.0 FM',
    title: 'Mohammed Rafi: The Golden Voice',
    subtitle: 'Kya Hua Tera Wada, Baharon Phool Barsao & Classics',
    streamUrl: 'https://stream.zeno.fm/2xx62x8ztm0uv',
    fallbackUrl: 'https://stream.zeno.fm/0ghtfp8ztm0uv',
    era: 'Golden Era',
  },
  {
    id: 'lata-asha-melodies',
    frequency: '101.4 FM',
    title: 'Lata & Asha: Queens of Melody',
    subtitle: 'Timeless Duets, Solos & Golden Indian Cinema Melodies',
    streamUrl: 'https://stream.zeno.fm/87xam8pf7tzuv',
    fallbackUrl: 'https://stream.zeno.fm/f3wvbbqmdg8uv',
    era: 'Timeless Melodies',
  },
  {
    id: 'sufi-soulful-journey',
    frequency: '102.6 FM',
    title: 'Sufi & Soulful Highway Journeys',
    subtitle: 'Nusrat Fateh Ali Khan, Rahat & Kailash Kher',
    streamUrl: 'https://stream.zeno.fm/a83h74591q8uv',
    fallbackUrl: 'https://stream.zeno.fm/yo0kzyzedittv',
    era: 'Spiritual Sufi',
  },
  {
    id: 'radio-city-hindi-hits',
    frequency: '105.8 FM',
    title: 'Radio City Hindi Hits',
    subtitle: 'Non-Stop Evergreen Bollywood Film Superhits',
    streamUrl: 'https://stream.zeno.fm/pxc55r5uyc9uv',
    fallbackUrl: 'https://stream.zeno.fm/60ef4p33vxquv',
    era: 'All Time Hits',
  },
  {
    id: 'bollywood-acoustic-chill',
    frequency: '106.4 FM',
    title: 'Bollywood Acoustic & Midnight Chill',
    subtitle: 'Warm Acoustic Guitars, Midnight Piano & Unplugged',
    streamUrl: 'https://stream.zeno.fm/f3wvbbqmdg8uv',
    fallbackUrl: 'https://stream.zeno.fm/wn6muavgfr2tv',
    era: 'Acoustic Sunset',
  },
];

type StateListener = (status: PlaybackStatus) => void;
type TrackListener = (metadata: TrackMetadata) => void;
type ErrorListener = (errorMsg: string) => void;

class RadioPlayerController {
  private audio: HTMLAudioElement | null = null;
  private currentStationIndex = 0;
  private currentStatus: PlaybackStatus = 'unstarted';
  private volume = 80;
  private muted = false;
  private retryCount = 0;
  private reconnectTimer: number | null = null;

  private stateListeners: Set<StateListener> = new Set();
  private trackListeners: Set<TrackListener> = new Set();
  private errorListeners: Set<ErrorListener> = new Set();

  // Sleep Timer state
  private sleepTimerSeconds: number | null = null;
  private sleepTimerInterval: number | null = null;
  private sleepTimerListeners: Set<(seconds: number | null) => void> = new Set();

  private trackMetadata: TrackMetadata = {
    title: STATIONS[0].title,
    artist: `${STATIONS[0].frequency} • ${STATIONS[0].subtitle}`,
    duration: 0,
    currentTime: 0,
    playlistIndex: 0,
    totalTracks: STATIONS.length,
    isLive: true,
  };

  public init(_containerId?: string): void {
    if (typeof window === 'undefined') return;

    try {
      this.audio = new Audio();
      this.audio.preload = 'none';
      this.audio.crossOrigin = 'anonymous';
      this.audio.volume = this.volume / 100;

      this.setupAudioEvents();
      this.setupMediaSession();
      this.loadStation(this.currentStationIndex, false);
    } catch (e) {
      console.warn('RadioPlayer init warning:', e);
    }
  }

  private setupAudioEvents(): void {
    if (!this.audio) return;

    this.audio.addEventListener('playing', () => {
      this.retryCount = 0;
      this.setStatus('playing');
      this.updateMetadata();
      this.updateMediaSession();
    });

    this.audio.addEventListener('pause', () => {
      if (this.currentStatus !== 'buffering') {
        this.setStatus('paused');
      }
      this.updateMediaSession();
    });

    this.audio.addEventListener('waiting', () => {
      this.setStatus('buffering');
    });

    this.audio.addEventListener('error', () => {
      console.warn('Audio stream error, attempting fallback/recovery...');
      this.handleStreamError();
    });

    this.audio.addEventListener('timeupdate', () => {
      if (this.audio && this.currentStatus === 'playing') {
        this.trackMetadata.currentTime = this.audio.currentTime || 0;
        this.notifyTrackListeners();
      }
    });
  }

  private handleStreamError(): void {
    const station = STATIONS[this.currentStationIndex];
    if (this.retryCount === 0 && station.fallbackUrl && this.audio) {
      this.retryCount++;
      console.info('Switching to station fallback URL:', station.fallbackUrl);
      this.audio.src = station.fallbackUrl;
      this.audio.play().catch(() => {});
      return;
    }

    this.setStatus('error');
    this.notifyErrorListeners('Radio signal lost. Retrying connection...');

    // Auto reconnect after 3 seconds
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = window.setTimeout(() => {
      if (this.audio && this.currentStatus !== 'paused') {
        this.loadStation(this.currentStationIndex, true);
      }
    }, 3000);
  }

  private loadStation(index: number, autoPlay: boolean): void {
    if (!this.audio) return;

    this.currentStationIndex = ((index % STATIONS.length) + STATIONS.length) % STATIONS.length;
    const station = STATIONS[this.currentStationIndex];

    this.retryCount = 0;
    this.audio.src = station.streamUrl;
    this.audio.load();

    this.updateMetadata();
    this.updateMediaSession();

    if (autoPlay) {
      this.setStatus('buffering');
      this.audio.play().catch((err) => {
        console.warn('AutoPlay blocked or failed:', err);
        this.setStatus('paused');
      });
    }
  }

  private setStatus(status: PlaybackStatus): void {
    this.currentStatus = status;
    this.stateListeners.forEach((fn) => fn(status));
  }

  private updateMetadata(): void {
    const station = STATIONS[this.currentStationIndex];
    this.trackMetadata = {
      title: station.title,
      artist: `${station.frequency} • ${station.subtitle}`,
      duration: 0,
      currentTime: this.audio?.currentTime || 0,
      playlistIndex: this.currentStationIndex,
      totalTracks: STATIONS.length,
      isLive: true,
    };
    this.notifyTrackListeners();
  }

  private setupMediaSession(): void {
    if (typeof window === 'undefined' || !('mediaSession' in navigator)) return;

    try {
      navigator.mediaSession.setActionHandler('play', () => {
        this.play();
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        this.pause();
      });
      navigator.mediaSession.setActionHandler('nexttrack', () => {
        this.next();
      });
      navigator.mediaSession.setActionHandler('previoustrack', () => {
        this.previous();
      });
      navigator.mediaSession.setActionHandler('stop', () => {
        this.pause();
      });
    } catch (e) {
      console.warn('MediaSession handler setup warning:', e);
    }
  }

  private updateMediaSession(): void {
    if (typeof window === 'undefined' || !('mediaSession' in navigator)) return;

    const station = STATIONS[this.currentStationIndex];
    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: station.title,
        artist: `${station.frequency} — ${station.subtitle}`,
        album: 'Ghoomte Phirte (घूमते फिरते) Vintage Car Radio',
        artwork: [
          { src: './icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: './icons/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      });

      navigator.mediaSession.playbackState = this.currentStatus === 'playing' ? 'playing' : 'paused';
    } catch {
      // safe fallback
    }
  }

  public play(): void {
    if (!this.audio) return;

    this.setStatus('buffering');
    this.audio
      .play()
      .then(() => {
        this.setStatus('playing');
        this.updateMediaSession();
      })
      .catch((err) => {
        console.warn('Audio play failed:', err);
        this.setStatus('paused');
      });
  }

  public pause(): void {
    if (!this.audio) return;
    this.audio.pause();
    this.setStatus('paused');
    this.updateMediaSession();
  }

  public togglePlay(): void {
    if (this.currentStatus === 'playing') {
      this.pause();
    } else {
      this.play();
    }
  }

  public next(): void {
    this.loadStation(this.currentStationIndex + 1, true);
  }

  public previous(): void {
    this.loadStation(this.currentStationIndex - 1, true);
  }

  public selectStation(stationId: string): void {
    const idx = STATIONS.findIndex((s) => s.id === stationId);
    if (idx !== -1) {
      this.loadStation(idx, true);
    }
  }

  public getCurrentStation(): RadioStation {
    return STATIONS[this.currentStationIndex];
  }

  public getAllStations(): RadioStation[] {
    return STATIONS;
  }

  public seekTo(_seconds: number): void {
    // Live streams do not seek, but method preserved for interface compatibility
  }

  public setVolume(vol: number): void {
    this.volume = Math.max(0, Math.min(100, vol));
    if (this.audio) {
      this.audio.volume = this.muted ? 0 : this.volume / 100;
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public toggleMute(): void {
    this.muted = !this.muted;
    if (this.audio) {
      this.audio.volume = this.muted ? 0 : this.volume / 100;
    }
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public getMetadata(): TrackMetadata {
    return this.trackMetadata;
  }

  public getStatus(): PlaybackStatus {
    return this.currentStatus;
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

  private notifyTrackListeners(): void {
    this.trackListeners.forEach((fn) => fn(this.trackMetadata));
  }

  private notifyErrorListeners(msg: string): void {
    this.errorListeners.forEach((fn) => fn(msg));
  }

  public setSleepTimer(minutes: number | null): void {
    if (this.sleepTimerInterval) {
      clearInterval(this.sleepTimerInterval);
      this.sleepTimerInterval = null;
    }

    if (!minutes || minutes <= 0) {
      this.sleepTimerSeconds = null;
      this.notifySleepTimerListeners();
      return;
    }

    this.sleepTimerSeconds = Math.round(minutes * 60);
    this.notifySleepTimerListeners();

    this.sleepTimerInterval = window.setInterval(() => {
      if (this.sleepTimerSeconds === null) {
        if (this.sleepTimerInterval) clearInterval(this.sleepTimerInterval);
        return;
      }

      this.sleepTimerSeconds--;

      // Smooth fade-out in final 6 seconds
      if (this.sleepTimerSeconds <= 6 && this.sleepTimerSeconds > 0 && this.audio) {
        const targetVol = (this.volume / 100) * (this.sleepTimerSeconds / 6);
        this.audio.volume = Math.max(0, targetVol);
      }

      if (this.sleepTimerSeconds <= 0) {
        if (this.sleepTimerInterval) {
          clearInterval(this.sleepTimerInterval);
          this.sleepTimerInterval = null;
        }
        this.sleepTimerSeconds = null;
        this.pause();
        // Restore volume for next session
        if (this.audio) {
          this.audio.volume = this.volume / 100;
        }
        this.notifySleepTimerListeners();
        return;
      }

      this.notifySleepTimerListeners();
    }, 1000);
  }

  public getSleepTimerRemaining(): number | null {
    return this.sleepTimerSeconds;
  }

  public onSleepTimerChange(listener: (seconds: number | null) => void): () => void {
    this.sleepTimerListeners.add(listener);
    listener(this.sleepTimerSeconds);
    return () => this.sleepTimerListeners.delete(listener);
  }

  private notifySleepTimerListeners(): void {
    this.sleepTimerListeners.forEach((fn) => fn(this.sleepTimerSeconds));
  }

  public destroy(): void {
    if (this.sleepTimerInterval) clearInterval(this.sleepTimerInterval);
    this.sleepTimerListeners.clear();
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    if (this.audio) {
      this.audio.pause();
      this.audio.src = '';
      this.audio = null;
    }
    this.stateListeners.clear();
    this.trackListeners.clear();
    this.errorListeners.clear();
  }
}

export const radioController = new RadioPlayerController();
