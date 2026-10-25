import React, { useEffect } from 'react';
import { X, Radio } from 'lucide-react';
import { radioController, STATIONS, RadioStation } from '../audio/radioPlayer';
import { PlaybackStatus } from '../types';

interface StationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: PlaybackStatus;
  currentStationId: string;
}

export const StationsModal: React.FC<StationsModalProps> = ({
  isOpen,
  onClose,
  status,
  currentStationId,
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

  const isPlaying = status === 'playing';

  const handleSelectStation = (station: RadioStation) => {
    radioController.selectStation(station.id);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Select Hindi Radio Station"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(15, 8, 6, 0.72)',
          backdropFilter: 'blur(8px)',
          animation: 'fadeIn 0.25s ease',
        }}
      />

      {/* Modal Dialog Container */}
      <div
        className="glass-panel"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '680px',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.7)',
          border: '1px solid var(--glass-border)',
          overflow: 'hidden',
          animation: 'scaleIn 0.3s cubic-bezier(0.2, 0.8, 0.25, 1)',
          pointerEvents: 'auto',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px 16px',
            borderBottom: '1px solid rgba(255, 240, 208, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(25, 10, 7, 0.6)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(200, 90, 58, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--terracotta-bright)',
              }}
            >
              <Radio size={20} />
            </div>
            <div>
              <h2
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  color: 'var(--cream)',
                  letterSpacing: '0.02em',
                  margin: 0,
                }}
              >
                घूमते फिरते Radio Stations
              </h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--muted-text)', margin: '2px 0 0' }}>
                11 Live Nostalgic FM Channels • Commercial-Free & Uninterrupted
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close stations modal"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--subtle-text)',
              cursor: 'pointer',
              padding: '6px',
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

        {/* Scrollable Stations Grid */}
        <div
          style={{
            flex: '1 1 auto',
            overflowY: 'auto',
            padding: '18px 22px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {STATIONS.map((station) => {
            const isSelected = currentStationId === station.id;
            return (
              <div
                key={station.id}
                onClick={() => handleSelectStation(station)}
                style={{
                  position: 'relative',
                  padding: '14px 18px',
                  borderRadius: 'var(--radius-md)',
                  background: isSelected
                    ? 'linear-gradient(135deg, rgba(200, 90, 58, 0.32) 0%, rgba(130, 50, 30, 0.22) 100%)'
                    : 'rgba(35, 17, 13, 0.55)',
                  border: isSelected
                    ? '1.5px solid rgba(200, 90, 58, 0.75)'
                    : '1px solid rgba(255, 240, 208, 0.12)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '14px',
                  transition: 'all 0.22s ease',
                  boxShadow: isSelected ? '0 6px 20px rgba(200, 90, 58, 0.25)' : 'none',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = 'rgba(45, 22, 17, 0.75)';
                    e.currentTarget.style.borderColor = 'rgba(255, 240, 208, 0.25)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = 'rgba(35, 17, 13, 0.55)';
                    e.currentTarget.style.borderColor = 'rgba(255, 240, 208, 0.12)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                {/* Left Station Dial Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      color: isSelected ? '#fff' : 'var(--cream)',
                      background: isSelected
                        ? 'linear-gradient(135deg, #c85a3a 0%, #a94d32 100%)'
                        : 'rgba(0, 0, 0, 0.4)',
                      padding: '5px 9px',
                      borderRadius: '6px',
                      letterSpacing: '0.04em',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                      boxShadow: isSelected ? '0 2px 8px rgba(200, 90, 58, 0.5)' : 'none',
                    }}
                  >
                    {station.frequency}
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                      <h3
                        style={{
                          fontSize: '0.94rem',
                          fontWeight: 600,
                          color: 'var(--cream)',
                          margin: 0,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {station.title}
                      </h3>
                      <span
                        style={{
                          fontSize: '0.68rem',
                          color: 'var(--subtle-text)',
                          background: 'rgba(255, 240, 208, 0.08)',
                          padding: '1px 6px',
                          borderRadius: '4px',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {station.era}
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: '0.78rem',
                        color: 'var(--muted-text)',
                        margin: 0,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {station.subtitle}
                    </p>
                  </div>
                </div>

                {/* Right Status Badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  {isSelected ? (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 10px',
                        borderRadius: '999px',
                        background: isPlaying ? 'rgba(74, 222, 128, 0.18)' : 'rgba(245, 158, 11, 0.18)',
                        border: `1px solid ${isPlaying ? 'rgba(74, 222, 128, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`,
                        color: isPlaying ? '#4ade80' : '#f59e0b',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                      }}
                    >
                      {isPlaying && (
                        <span
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: '#4ade80',
                            boxShadow: '0 0 6px #4ade80',
                            animation: 'pulse 1.6s infinite',
                          }}
                        />
                      )}
                      <span>{isPlaying ? 'TUNED IN' : 'STANDBY'}</span>
                    </div>
                  ) : (
                    <span
                      style={{
                        fontSize: '0.74rem',
                        color: 'var(--subtle-text)',
                        padding: '4px 10px',
                        borderRadius: '999px',
                        background: 'rgba(255, 240, 208, 0.06)',
                      }}
                    >
                      Tune In
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div
          style={{
            padding: '12px 24px',
            borderTop: '1px solid rgba(255, 240, 208, 0.1)',
            background: 'rgba(20, 8, 5, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            color: 'var(--subtle-text)',
          }}
        >
          <span>Tip: Use Next (⏭) and Prev (⏮) on your car dashboard or phone lockscreen to flip stations</span>
          <button
            type="button"
            onClick={onClose}
            className="glass-pill"
            style={{ padding: '4px 12px', fontSize: '0.76rem' }}
          >
            Done
          </button>
        </div>
      </div>

      <style>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};
