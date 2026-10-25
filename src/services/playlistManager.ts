import { SavedPlaylist } from '../types';

export const DEFAULT_PLAYLIST_ID = 'PL8A83416F6D9FEEB0';

const DEFAULT_PLAYLISTS: SavedPlaylist[] = [
  {
    id: '90s-bollywood-superhits',
    playlistId: DEFAULT_PLAYLIST_ID,
    title: '90s Bollywood Evergreen Hits (Kumar Sanu, Udit, Alka)',
    isActive: true,
    createdAt: Date.now(),
  },
  {
    id: '90s-romantic-melodies',
    playlistId: 'PLw-VjHDlEOgs658kAHR9LAa45ET44bdQG',
    title: '90s Romantic Melodies & Rain Drive',
    isActive: false,
    createdAt: Date.now() - 50000,
  },
  {
    id: 'golden-era-classics',
    playlistId: 'PLEOiStG7CxDKEx0W4AMsDlEDk2qrlns0I',
    title: 'Golden Era 70s & 80s Highway Classics',
    isActive: false,
    createdAt: Date.now() - 100000,
  },
];

const LOCAL_STORAGE_KEY = 'ghoomte_phirte_admin_playlists_v2';
const CLOUD_ENDPOINT_KEY = 'ghoomte_phirte_cloud_endpoint';
const ADMIN_PASSCODE_KEY = 'ghoomte_phirte_admin_passcode';
const DEFAULT_PASSCODE = 'ghoomte777';

export function extractYouTubePlaylistId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // 1. Direct playlist ID (e.g., starts with PL, OL, RD, etc. or alphanumeric 16-40 chars)
  if (/^[A-Za-z0-9_-]{16,42}$/.test(trimmed)) {
    return trimmed;
  }

  // 2. Full URL with 'list=' parameter
  try {
    const url = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
    const listParam = url.searchParams.get('list');
    if (listParam) {
      return listParam;
    }
  } catch {
    // regex fallback
  }

  const match = trimmed.match(/[?&]list=([A-Za-z0-9_-]+)/);
  if (match && match[1]) {
    return match[1];
  }

  return null;
}

class PlaylistManager {
  private playlists: SavedPlaylist[] = [];
  private listeners: Set<(active: SavedPlaylist, all: SavedPlaylist[]) => void> = new Set();
  private cloudEndpoint: string = '';

  constructor() {
    this.loadInitial();
    this.syncWithRemote();
  }

  private loadInitial(): void {
    if (typeof window === 'undefined') return;

    try {
      this.cloudEndpoint = localStorage.getItem(CLOUD_ENDPOINT_KEY) || '';
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.playlists = parsed;
          return;
        }
      }
    } catch (e) {
      console.warn('PlaylistManager localStorage read error:', e);
    }

    this.playlists = DEFAULT_PLAYLISTS;
    this.saveLocally();
  }

  private saveLocally(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.playlists));
    } catch (e) {
      console.warn('PlaylistManager saveLocally error:', e);
    }
  }

  /**
   * Syncs with remote serverless API or cloud endpoint (e.g. Vercel API or JSONBin)
   * so changes enabled by the admin are shared with all visitors!
   */
  public async syncWithRemote(): Promise<void> {
    if (typeof window === 'undefined') return;

    const endpoint = this.cloudEndpoint || '/api/playlist';

    try {
      const res = await fetch(endpoint, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });

      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.playlists) && data.playlists.length > 0) {
          this.playlists = data.playlists;
          this.saveLocally();
          this.notify();
        }
      }
    } catch {
      // Offline or local fallback
    }
  }

  /**
   * Pushes updated playlists to the remote cloud endpoint for all visitors.
   */
  private async pushToRemote(): Promise<boolean> {
    if (typeof window === 'undefined') return false;

    const endpoint = this.cloudEndpoint || '/api/playlist';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playlists: this.playlists,
          updatedAt: Date.now(),
        }),
      });

      return res.ok;
    } catch (e) {
      console.warn('Remote push failed, saved locally:', e);
      return false;
    }
  }

  public getActivePlaylist(): SavedPlaylist {
    const active = this.playlists.find((p) => p.isActive);
    return active || this.playlists[0] || DEFAULT_PLAYLISTS[0];
  }

  public getAllPlaylists(): SavedPlaylist[] {
    return [...this.playlists];
  }

  /**
   * Adds a new playlist. If makeActive is true, all other playlists are disabled.
   */
  public async addPlaylist(title: string, rawInput: string, makeActive = true): Promise<{ success: boolean; error?: string }> {
    const playlistId = extractYouTubePlaylistId(rawInput);
    if (!playlistId) {
      return { success: false, error: 'Invalid YouTube playlist link or ID.' };
    }

    const cleanTitle = title.trim() || `Playlist ${this.playlists.length + 1}`;

    const newPlaylist: SavedPlaylist = {
      id: `pl-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      playlistId,
      title: cleanTitle,
      isActive: makeActive,
      createdAt: Date.now(),
    };

    if (makeActive) {
      this.playlists = this.playlists.map((p) => ({ ...p, isActive: false }));
    }

    this.playlists.unshift(newPlaylist);
    this.saveLocally();
    this.notify();
    await this.pushToRemote();

    return { success: true };
  }

  /**
   * Enables one playlist and disables all other saved playlists automatically.
   */
  public async activatePlaylist(id: string): Promise<void> {
    this.playlists = this.playlists.map((p) => ({
      ...p,
      isActive: p.id === id,
    }));

    this.saveLocally();
    this.notify();
    await this.pushToRemote();
  }

  /**
   * Deletes a saved playlist. If it was active, activates the first available one.
   */
  public async deletePlaylist(id: string): Promise<boolean> {
    if (this.playlists.length <= 1) {
      return false; // Keep at least one playlist
    }

    const wasActive = this.playlists.find((p) => p.id === id)?.isActive;
    this.playlists = this.playlists.filter((p) => p.id !== id);

    if (wasActive && this.playlists.length > 0) {
      this.playlists[0].isActive = true;
    }

    this.saveLocally();
    this.notify();
    await this.pushToRemote();

    return true;
  }

  public setCloudEndpoint(url: string): void {
    this.cloudEndpoint = url.trim();
    if (typeof window !== 'undefined') {
      localStorage.setItem(CLOUD_ENDPOINT_KEY, this.cloudEndpoint);
    }
    this.syncWithRemote();
  }

  public getCloudEndpoint(): string {
    return this.cloudEndpoint;
  }

  public verifyPasscode(passcode: string): boolean {
    if (typeof window === 'undefined') return false;
    const stored = localStorage.getItem(ADMIN_PASSCODE_KEY) || DEFAULT_PASSCODE;
    return passcode.trim() === stored.trim();
  }

  public updatePasscode(newPasscode: string): void {
    if (typeof window !== 'undefined' && newPasscode.trim()) {
      localStorage.setItem(ADMIN_PASSCODE_KEY, newPasscode.trim());
    }
  }

  public subscribe(callback: (active: SavedPlaylist, all: SavedPlaylist[]) => void): () => void {
    this.listeners.add(callback);
    callback(this.getActivePlaylist(), this.getAllPlaylists());
    return () => this.listeners.delete(callback);
  }

  private notify(): void {
    const active = this.getActivePlaylist();
    const all = this.getAllPlaylists();
    this.listeners.forEach((cb) => cb(active, all));
  }
}

export const playlistManager = new PlaylistManager();
