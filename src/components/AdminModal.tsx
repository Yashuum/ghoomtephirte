import React, { useState, useEffect } from 'react';
import {
  Lock,
  Radio,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle,
  X,
  KeyRound,
  Cloud,
  RefreshCw,
} from 'lucide-react';
import { SavedPlaylist } from '../types';
import { playlistManager } from '../services/playlistManager';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [activePlaylist, setActivePlaylist] = useState<SavedPlaylist>(playlistManager.getActivePlaylist());
  const [playlists, setPlaylists] = useState<SavedPlaylist[]>(playlistManager.getAllPlaylists());

  // Form inputs
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [autoActivate, setAutoActivate] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  // Cloud Endpoint
  const [showCloudSettings, setShowCloudSettings] = useState(false);
  const [cloudUrl, setCloudUrl] = useState(playlistManager.getCloudEndpoint());
  const [newPasscode, setNewPasscode] = useState('');

  useEffect(() => {
    const unsub = playlistManager.subscribe((active, all) => {
      setActivePlaylist(active);
      setPlaylists(all);
    });
    return unsub;
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (playlistManager.verifyPasscode(passcode)) {
      setIsAuthenticated(true);
      setErrorMsg('');
      setPasscode('');
    } else {
      setErrorMsg('Incorrect admin passcode. Default is ghoomte777');
    }
  };

  const handleAddPlaylist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;

    setIsAdding(true);
    setErrorMsg('');

    const res = await playlistManager.addPlaylist(newTitle, newUrl, autoActivate);
    setIsAdding(false);

    if (res.success) {
      setNewTitle('');
      setNewUrl('');
      setSuccessToast(autoActivate ? 'Playlist saved and enabled for everyone!' : 'Playlist saved to library!');
      setTimeout(() => setSuccessToast(''), 4000);
    } else {
      setErrorMsg(res.error || 'Failed to add playlist');
    }
  };

  const handleActivate = async (id: string) => {
    await playlistManager.activatePlaylist(id);
    setSuccessToast('Active playlist updated! Everyone now hears this playlist.');
    setTimeout(() => setSuccessToast(''), 4000);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to remove this playlist from your library?')) {
      const ok = await playlistManager.deletePlaylist(id);
      if (!ok) {
        alert('You must keep at least one saved playlist.');
      }
    }
  };

  const handleSaveCloudUrl = () => {
    playlistManager.setCloudEndpoint(cloudUrl);
    setSuccessToast('Cloud endpoint updated and synced!');
    setTimeout(() => setSuccessToast(''), 4000);
  };

  const handleChangePasscode = () => {
    if (!newPasscode.trim()) return;
    playlistManager.updatePasscode(newPasscode);
    setNewPasscode('');
    setSuccessToast('Admin passcode updated successfully!');
    setTimeout(() => setSuccessToast(''), 4000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Secret Admin Playlist Console"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(15, 7, 5, 0.78)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.25s ease',
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          borderRadius: '24px',
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.8), 0 0 25px rgba(255, 240, 208, 0.1)',
          position: 'relative',
          overflowY: 'auto',
          background: 'rgba(32, 14, 10, 0.92)',
        }}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close admin console"
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'transparent',
            border: 'none',
            color: 'var(--subtle-text)',
            cursor: 'pointer',
            padding: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--cream)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--subtle-text)')}
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #c85a3a 0%, #a94d32 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(169, 77, 50, 0.45)',
            }}
          >
            <Lock size={18} color="#fff" />
          </div>
          <div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--cream)', lineHeight: 1.2 }}>
              Secret Playlist Control Room
            </h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--muted-text)' }}>
              Broadcast manager for Ghoomte Phirte Radio
            </p>
          </div>
        </div>

        {/* 1. Login Screen if not authenticated */}
        {!isAuthenticated ? (
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ fontSize: '0.84rem', color: 'var(--muted-text)', lineHeight: 1.5 }}>
              Enter your secret admin passcode to manage and broadcast YouTube playlists for all visitors.
            </p>

            <div>
              <label
                htmlFor="admin-passcode"
                style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--cream)', marginBottom: '6px' }}
              >
                Admin Passcode
              </label>
              <input
                id="admin-passcode"
                type="password"
                placeholder="Enter passcode (default: ghoomte777)"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                autoFocus
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: 'rgba(255, 240, 208, 0.08)',
                  border: '1px solid var(--glass-border)',
                  color: 'var(--cream)',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
              />
            </div>

            {errorMsg && (
              <p style={{ fontSize: '0.8rem', color: '#ff7b72', fontWeight: 500 }}>{errorMsg}</p>
            )}

            <button
              type="submit"
              style={{
                padding: '12px',
                borderRadius: '999px',
                background: 'linear-gradient(135deg, #c85a3a 0%, #a94d32 100%)',
                border: '1px solid rgba(255, 240, 208, 0.4)',
                color: '#fff',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(169, 77, 50, 0.45)',
              }}
            >
              Unlock Control Room
            </button>

            <span style={{ fontSize: '0.72rem', color: 'var(--subtle-text)', textAlign: 'center' }}>
              Tip: The default passcode is <strong>ghoomte777</strong>
            </span>
          </form>
        ) : (
          /* 2. Admin Dashboard */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Success Toast */}
            {successToast && (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: '12px',
                  background: 'rgba(74, 222, 128, 0.2)',
                  border: '1px solid rgba(74, 222, 128, 0.4)',
                  color: '#4ade80',
                  fontSize: '0.84rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <CheckCircle size={16} />
                <span>{successToast}</span>
              </div>
            )}

            {/* Currently Active Live Playlist Card */}
            <div
              style={{
                padding: '16px',
                borderRadius: '16px',
                background: 'rgba(169, 77, 50, 0.25)',
                border: '1px solid rgba(255, 240, 208, 0.35)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: '#4ade80',
                    letterSpacing: '0.06em',
                  }}
                >
                  <Radio size={13} style={{ animation: 'pulse 1.8s infinite' }} />
                  Currently Live for Everyone
                </span>
                <a
                  href={`https://www.youtube.com/playlist?list=${activePlaylist.playlistId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--cream)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.74rem', textDecoration: 'none' }}
                >
                  <span>Verify on YouTube</span>
                  <ExternalLink size={12} />
                </a>
              </div>

              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
                {activePlaylist.title}
              </h3>
              <p style={{ fontSize: '0.74rem', color: 'var(--muted-text)', fontFamily: 'var(--font-mono)' }}>
                ID: {activePlaylist.playlistId}
              </p>
            </div>

            {/* Add New Playlist Form */}
            <form
              onSubmit={handleAddPlaylist}
              style={{
                padding: '16px',
                borderRadius: '16px',
                background: 'rgba(255, 240, 208, 0.05)',
                border: '1px solid var(--glass-border)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Plus size={16} style={{ color: 'var(--terracotta-bright)' }} />
                <h4 style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--cream)' }}>
                  Add &amp; Broadcast New Playlist
                </h4>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Playlist Name (e.g., Kishore Kumar Late Night Drive)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: 'rgba(255, 240, 208, 0.08)',
                    border: '1px solid var(--glass-border)',
                    color: 'var(--cream)',
                    fontSize: '0.85rem',
                    outline: 'none',
                    marginBottom: '8px',
                  }}
                />
                <input
                  type="text"
                  placeholder="Paste YouTube Playlist URL or Playlist ID"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: 'rgba(255, 240, 208, 0.08)',
                    border: '1px solid var(--glass-border)',
                    color: 'var(--cream)',
                    fontSize: '0.85rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--muted-text)', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={autoActivate}
                    onChange={(e) => setAutoActivate(e.target.checked)}
                    style={{ accentColor: 'var(--terracotta-bright)' }}
                  />
                  <span>Enable immediately for everyone (disables others)</span>
                </label>

                <button
                  type="submit"
                  disabled={isAdding}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '999px',
                    background: 'linear-gradient(135deg, #c85a3a 0%, #a94d32 100%)',
                    border: '1px solid rgba(255, 240, 208, 0.4)',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '0.82rem',
                    cursor: isAdding ? 'default' : 'pointer',
                    opacity: isAdding ? 0.6 : 1,
                  }}
                >
                  {isAdding ? 'Saving...' : 'Add Playlist'}
                </button>
              </div>

              {errorMsg && <p style={{ fontSize: '0.78rem', color: '#ff7b72' }}>{errorMsg}</p>}
            </form>

            {/* Saved Playlists List */}
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--cream)', marginBottom: '10px' }}>
                Saved Playlists ({playlists.length})
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
                {playlists.map((pl) => (
                  <div
                    key={pl.id}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '12px',
                      background: pl.isActive ? 'rgba(169, 77, 50, 0.35)' : 'rgba(255, 240, 208, 0.05)',
                      border: pl.isActive ? '1px solid rgba(255, 240, 208, 0.45)' : '1px solid var(--glass-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                    }}
                  >
                    <div style={{ flex: '1 1 auto', minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--cream)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {pl.title}
                        </span>
                        {pl.isActive && (
                          <span style={{ fontSize: '0.66rem', fontWeight: 700, padding: '2px 8px', borderRadius: '999px', background: '#4ade80', color: '#111' }}>
                            LIVE
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--subtle-text)', fontFamily: 'var(--font-mono)' }}>
                        ID: {pl.playlistId}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                      {!pl.isActive ? (
                        <button
                          type="button"
                          onClick={() => handleActivate(pl.id)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '999px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid var(--glass-border)',
                            color: 'var(--cream)',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          Enable
                        </button>
                      ) : null}

                      {playlists.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDelete(pl.id)}
                          title="Delete playlist"
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--subtle-text)',
                            cursor: 'pointer',
                            padding: '4px',
                          }}
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Collapsible Cloud & Passcode Settings */}
            <div style={{ borderTop: '1px solid rgba(255, 240, 208, 0.15)', paddingTop: '14px' }}>
              <button
                type="button"
                onClick={() => setShowCloudSettings(!showCloudSettings)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--subtle-text)',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <KeyRound size={13} />
                <span>Security &amp; Cloud Provider Settings</span>
              </button>

              {showCloudSettings && (
                <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {/* Change Passcode */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', color: 'var(--cream)', marginBottom: '4px' }}>
                      Change Admin Passcode
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="password"
                        placeholder="New passcode"
                        value={newPasscode}
                        onChange={(e) => setNewPasscode(e.target.value)}
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          borderRadius: '8px',
                          background: 'rgba(255, 240, 208, 0.08)',
                          border: '1px solid var(--glass-border)',
                          color: 'var(--cream)',
                          fontSize: '0.8rem',
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleChangePasscode}
                        style={{
                          padding: '8px 14px',
                          borderRadius: '8px',
                          background: 'rgba(255, 255, 255, 0.12)',
                          border: '1px solid var(--glass-border)',
                          color: 'var(--cream)',
                          fontSize: '0.78rem',
                          cursor: 'pointer',
                        }}
                      >
                        Update
                      </button>
                    </div>
                  </div>

                  {/* Custom Cloud API URL */}
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: 'var(--cream)', marginBottom: '4px' }}>
                      <Cloud size={12} />
                      <span>Remote Cloud Endpoint (defaults to /api/playlist on Vercel)</span>
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="text"
                        placeholder="https://... (or leave blank for Vercel /api/playlist)"
                        value={cloudUrl}
                        onChange={(e) => setCloudUrl(e.target.value)}
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          borderRadius: '8px',
                          background: 'rgba(255, 240, 208, 0.08)',
                          border: '1px solid var(--glass-border)',
                          color: 'var(--cream)',
                          fontSize: '0.8rem',
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleSaveCloudUrl}
                        style={{
                          padding: '8px 14px',
                          borderRadius: '8px',
                          background: 'rgba(255, 255, 255, 0.12)',
                          border: '1px solid var(--glass-border)',
                          color: 'var(--cream)',
                          fontSize: '0.78rem',
                          cursor: 'pointer',
                        }}
                      >
                        Save
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => playlistManager.syncWithRemote()}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--terracotta-bright)',
                      fontSize: '0.76rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <RefreshCw size={12} />
                    <span>Force Re-sync from Cloud</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
