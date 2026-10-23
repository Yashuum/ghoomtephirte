import React, { useEffect } from 'react';
import { X, ExternalLink, ListMusic, Play, Pause, Radio } from 'lucide-react';
import { PlaybackStatus, TrackMetadata } from '../types';
import { PLAYLIST_ID, PLAYLIST_URL, ytController } from '../audio/youtubePlayer';

interface QueueDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  status: PlaybackStatus;
  metadata: TrackMetadata;
}

export const QueueDrawer: React.FC<QueueDrawerProps> = ({
  isOpen,
  onClose,
  status,
  metadata,
}) => {
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

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Songs Queue and Playlist Player"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 60,
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(15, 8, 6, 0.65)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          animation: 'fadeIn 0.3s ease',
        }}
      />

      {/* Slide-in Drawer */}
      <div
        className="glass-panel"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '480px',
          height: '100%',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-10px 0 35px rgba(0, 0, 0, 0.7)',
          animation: 'slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <ListMusic size={18} style={{ color: 'var(--terracotta-bright)' }} />
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--cream)' }}>
                Songs Queue
              </h2>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--muted-text)' }}>
              Official YouTube Road Trip Playlist
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close queue drawer"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--subtle-text)',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--cream)';
              e.currentTarget.style.background = 'rgba(255, 240, 208, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--subtle-text)';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Current Playing Status Card */}
        <div
          style={{
            background: 'rgba(35, 17, 13, 0.75)',
            border: '1px solid var(--glass-border)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            marginBottom: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--terracotta-bright)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Radio size={12} />
              Current Track
            </span>
            <span
              style={{
                fontSize: '0.72rem',
                padding: '2px 8px',
                borderRadius: '999px',
                background: status === 'playing' ? 'rgba(74, 222, 128, 0.2)' : 'rgba(255, 240, 208, 0.15)',
                color: status === 'playing' ? '#4ade80' : 'var(--cream)',
                fontWeight: 600,
                textTransform: 'capitalize',
              }}
            >
              {status}
            </span>
          </div>

          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--cream)', marginBottom: '4px' }}>
            {metadata.title}
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--muted-text)', marginBottom: '12px' }}>
            {metadata.artist}
          </p>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => ytController.togglePlay()}
              className="glass-pill"
              style={{ padding: '6px 14px', fontSize: '0.8rem' }}
            >
              {status === 'playing' ? <Pause size={14} /> : <Play size={14} />}
              <span>{status === 'playing' ? 'Pause' : 'Play'}</span>
            </button>
            <a
              href={PLAYLIST_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-pill"
              style={{ padding: '6px 14px', fontSize: '0.8rem' }}
            >
              <ExternalLink size={14} />
              <span>Open on YouTube</span>
            </a>
          </div>
        </div>

        {/* Embedded YouTube Playlist Container */}
        <div style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--cream)' }}>
              Playlist Player & Queue
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--subtle-text)' }}>
              ID: {PLAYLIST_ID.substring(0, 12)}...
            </span>
          </div>

          {/* YouTube Player Iframe Element Container */}
          <div
            style={{
              width: '100%',
              height: '240px',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              background: '#000',
              border: '1px solid var(--glass-border)',
              position: 'relative',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
            }}
          >
            <div id="yt-player-element" style={{ width: '100%', height: '100%' }} />
          </div>

          <p style={{ fontSize: '0.75rem', color: 'var(--muted-text)', marginTop: '12px', lineHeight: 1.5 }}>
            The official YouTube playlist API synchronizes directly with the car radio player. You can browse tracks, skip forward/backward, and pause seamlessly.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};
