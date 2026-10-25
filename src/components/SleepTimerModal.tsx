import React, { useEffect, useState } from 'react';
import { Moon, Clock, X, Check, Timer } from 'lucide-react';
import { radioController } from '../audio/radioPlayer';

interface SleepTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TIMER_PRESETS = [
  { label: '15 Minutes', minutes: 15 },
  { label: '30 Minutes', minutes: 30 },
  { label: '45 Minutes', minutes: 45 },
  { label: '60 Minutes', minutes: 60 },
  { label: '90 Minutes', minutes: 90 },
];

export const SleepTimerModal: React.FC<SleepTimerModalProps> = ({ isOpen, onClose }) => {
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(
    radioController.getSleepTimerRemaining()
  );

  useEffect(() => {
    const unsub = radioController.onSleepTimerChange((sec) => {
      setRemainingSeconds(sec);
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

  const handleSelectPreset = (minutes: number) => {
    radioController.setSleepTimer(minutes);
    onClose();
  };

  const handleCancelTimer = () => {
    radioController.setSleepTimer(null);
    onClose();
  };

  const formatRemaining = (sec: number | null): string => {
    if (sec === null || sec <= 0) return '';
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Radio Sleep Timer"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 65,
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
          background: 'rgba(15, 8, 6, 0.7)',
          backdropFilter: 'blur(6px)',
        }}
      />

      {/* Popover Card */}
      <div
        className="glass-panel"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '380px',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.65)',
          border: '1px solid var(--glass-border)',
          overflow: 'hidden',
          animation: 'scaleIn 0.25s ease',
          pointerEvents: 'auto',
          background: 'rgba(35, 17, 13, 0.92)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '18px 20px 14px',
            borderBottom: '1px solid rgba(255, 240, 208, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(200, 90, 58, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--terracotta-bright)',
              }}
            >
              <Moon size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--cream)', margin: 0 }}>
                Radio Sleep Timer
              </h3>
              <p style={{ fontSize: '0.74rem', color: 'var(--muted-text)', margin: '1px 0 0' }}>
                Softly fades out music for a restful night
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close sleep timer"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--subtle-text)',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '50%',
              display: 'flex',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '18px 20px' }}>
          {/* Active Countdown Banner if active */}
          {remainingSeconds !== null && remainingSeconds > 0 && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(74, 222, 128, 0.15)',
                border: '1px solid rgba(74, 222, 128, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4ade80' }}>
                <Timer size={16} />
                <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                  Active: {formatRemaining(remainingSeconds)} left
                </span>
              </div>
              <button
                type="button"
                onClick={handleCancelTimer}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--terracotta-bright)',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Cancel Timer
              </button>
            </div>
          )}

          {/* Preset Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {TIMER_PRESETS.map((preset) => {
              const isSelected =
                remainingSeconds !== null &&
                Math.abs(remainingSeconds - preset.minutes * 60) <= 2;

              return (
                <button
                  key={preset.minutes}
                  type="button"
                  onClick={() => handleSelectPreset(preset.minutes)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    background: isSelected
                      ? 'rgba(200, 90, 58, 0.35)'
                      : 'rgba(255, 240, 208, 0.05)',
                    border: `1px solid ${
                      isSelected ? 'rgba(200, 90, 58, 0.8)' : 'rgba(255, 240, 208, 0.1)'
                    }`,
                    color: 'var(--cream)',
                    fontSize: '0.88rem',
                    fontWeight: isSelected ? 700 : 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.background = 'rgba(255, 240, 208, 0.1)';
                      e.currentTarget.style.borderColor = 'rgba(255, 240, 208, 0.25)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.background = 'rgba(255, 240, 208, 0.05)';
                      e.currentTarget.style.borderColor = 'rgba(255, 240, 208, 0.1)';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Clock size={16} color="var(--terracotta-bright)" />
                    <span>{preset.label}</span>
                  </div>
                  {isSelected && <Check size={16} color="#4ade80" />}
                </button>
              );
            })}

            {/* Turn Off button if active */}
            {remainingSeconds !== null && (
              <button
                type="button"
                onClick={handleCancelTimer}
                style={{
                  marginTop: '6px',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'transparent',
                  border: '1px solid rgba(255, 240, 208, 0.15)',
                  color: 'var(--muted-text)',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                Turn Off Sleep Timer
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
