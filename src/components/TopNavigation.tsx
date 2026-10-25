import React, { useState, useEffect } from 'react';
import { Radio, Moon } from 'lucide-react';

interface TopNavigationProps {
  onOpenStations: () => void;
  onOpenSleepTimer: () => void;
  sleepTimerRemaining: number | null;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  onOpenStations,
  onOpenSleepTimer,
  sleepTimerRemaining,
}) => {
  // 1. Live Clock
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      setTimeStr(`${hours}:${minutes}:${seconds} ${ampm}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // 2. Simulated Decorative Ambient Listener Count (between 400 and 900)
  const [listenerCount, setListenerCount] = useState<number>(648);

  useEffect(() => {
    const interval = setInterval(() => {
      setListenerCount((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2;
        const next = prev + delta;
        return Math.max(420, Math.min(880, next));
      });
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const formatSleepMinutes = (sec: number | null): string => {
    if (!sec || sec <= 0) return '';
    const m = Math.ceil(sec / 60);
    return `${m}m`;
  };

  return (
    <header
      role="banner"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '10px',
        pointerEvents: 'none',
      }}
    >
      {/* Left: Monospace Live Clock */}
      <div
        className="glass-panel"
        style={{
          pointerEvents: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: '7px',
          padding: '7px 14px',
          borderRadius: 'var(--radius-full)',
        }}
      >
        <Radio size={13} style={{ color: 'var(--terracotta-bright)', flexShrink: 0 }} />
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.82rem',
            fontWeight: 500,
            letterSpacing: '0.03em',
            color: 'var(--cream)',
            textShadow: '0 1px 3px rgba(0, 0, 0, 0.6)',
            whiteSpace: 'nowrap',
          }}
        >
          {timeStr || '12:00:00 PM'}
        </span>
      </div>

      {/* Center: Interactive Stations Dial Button */}
      <button
        type="button"
        onClick={onOpenStations}
        className="glass-panel status-pill hide-on-mobile-xs"
        title="Open all 11 Hindi radio stations"
        aria-label="Open Radio Stations"
        style={{
          pointerEvents: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '7px 18px',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--glass-border)',
          cursor: 'pointer',
          background: 'rgba(45, 20, 15, 0.65)',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(200, 90, 58, 0.25)';
          e.currentTarget.style.borderColor = 'rgba(200, 90, 58, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(45, 20, 15, 0.65)';
          e.currentTarget.style.borderColor = 'var(--glass-border)';
        }}
      >
        <span
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#4ade80',
            boxShadow: '0 0 10px #4ade80',
            animation: 'pulse 2s infinite',
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontSize: '0.82rem',
            fontWeight: 700,
            letterSpacing: '0.02em',
            color: 'var(--cream)',
            whiteSpace: 'nowrap',
          }}
        >
          📻 Stations (11) ▾
        </span>
        <span
          style={{
            fontSize: '0.74rem',
            color: 'var(--subtle-text)',
            paddingLeft: '6px',
            borderLeft: '1px solid rgba(255, 240, 208, 0.2)',
            whiteSpace: 'nowrap',
          }}
          className="hide-on-mobile"
        >
          {listenerCount} travelling with you
        </span>
      </button>

      {/* Right: Glass Navigation Buttons (Stations & Sleep Timer) */}
      <nav
        aria-label="Main Navigation"
        style={{
          pointerEvents: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        {/* Stations Button */}
        <button
          type="button"
          onClick={onOpenStations}
          className="glass-pill"
          title="Browse all 11 nostalgic radio stations"
          aria-label="Radio Stations"
          style={{ padding: '7px 14px' }}
        >
          <Radio size={14} />
          <span>Stations</span>
        </button>

        {/* Sleep Timer Button */}
        <button
          type="button"
          onClick={onOpenSleepTimer}
          className={`glass-pill ${sleepTimerRemaining ? 'active' : ''}`}
          title="Set sleep timer"
          aria-label="Sleep timer"
          style={{ padding: '7px 14px' }}
        >
          <Moon size={14} />
          <span className="hide-on-mobile">
            {sleepTimerRemaining ? `Sleep (${formatSleepMinutes(sleepTimerRemaining)})` : 'Sleep'}
          </span>
        </button>
      </nav>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.55; transform: scale(0.9); }
        }
        @media (max-width: 720px) {
          .hide-on-mobile {
            display: none !important;
          }
          header {
            padding: 10px 12px !important;
          }
        }
        @media (max-width: 480px) {
          .hide-on-mobile-xs {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
};
