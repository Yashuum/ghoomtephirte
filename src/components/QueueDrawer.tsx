import React, { useEffect } from 'react';
import { X, Play, Pause, Radio, Check, ListMusic } from 'lucide-react';
import { PlaybackStatus, TrackMetadata } from '../types';
import { radioController, STATIONS } from '../audio/radioPlayer';

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
              onClick={() => radioController.togglePlay()}
              className="glass-pill"
              style={{ padding: '6px 14px', fontSize: '0.8rem' }}
            >
              {status === 'playing' ? <Pause size={14} /> : <Play size={14} />}
              <span>{status === 'playing' ? 'Pause Radio' : 'Play Radio'}</span>
            </button>
          </div>
        </div>

        {/* Live FM Radio Stations List */}
        <div style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--cream)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Select FM Station
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--subtle-text)' }}>
              {STATIONS.length} Stations Available
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {STATIONS.map((station, idx) => {
              const isSelected = metadata.playlistIndex === idx;
              return (
                <div
                  key={station.id}
                  onClick={() => radioController.selectStation(station.id)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: isSelected ? 'rgba(200, 90, 58, 0.28)' : 'rgba(35, 17, 13, 0.55)',
                    border: `1px solid ${isSelected ? 'rgba(200, 90, 58, 0.6)' : 'var(--glass-border)'}`,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: isSelected ? 'var(--terracotta-bright)' : 'var(--cream)',
                          background: 'rgba(0, 0, 0, 0.3)',
                          padding: '1px 6px',
                          borderRadius: '4px',
                        }}
                      >
                        {station.frequency}
                      </span>
                      <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--cream)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {station.title}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.74rem', color: 'var(--muted-text)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {station.subtitle}
                    </p>
                  </div>

                  {isSelected && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#4ade80', flexShrink: 0, marginLeft: '8px' }}>
                      <Check size={16} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <p style={{ fontSize: '0.75rem', color: 'var(--muted-text)', marginTop: '16px', lineHeight: 1.5 }}>
            Native 24/7 high-fidelity Indian retro radio stations. Zero commercial ads, zero lag, and instant background playback when your phone screen is locked.
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
