import React, { useState, useEffect } from 'react';
import { ExternalLink, Download, Radio } from 'lucide-react';
import { playlistManager } from '../services/playlistManager';

interface TopNavigationProps {
  onOpenInstall: () => void;
  isInstallOpen: boolean;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  onOpenInstall,
  isInstallOpen,
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

  // 3. Active YouTube Playlist URL tracking
  const [activeUrl, setActiveUrl] = useState<string>(
    `https://www.youtube.com/playlist?list=${playlistManager.getActivePlaylist().playlistId}`
  );

  useEffect(() => {
    const unsub = playlistManager.subscribe((active) => {
      setActiveUrl(`https://www.youtube.com/playlist?list=${active.playlistId}`);
    });
    return unsub;
  }, []);

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

      {/* Center: Journey Status Pill */}
      <div
        className="glass-panel status-pill hide-on-mobile-xs"
        style={{
          pointerEvents: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '7px 16px',
          borderRadius: 'var(--radius-full)',
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
            fontWeight: 600,
            letterSpacing: '0.02em',
            color: 'var(--cream)',
            whiteSpace: 'nowrap',
          }}
        >
          On the road
        </span>
        <span
          style={{
            fontSize: '0.74rem',
            color: 'var(--subtle-text)',
            paddingLeft: '4px',
            borderLeft: '1px solid rgba(255, 240, 208, 0.2)',
            whiteSpace: 'nowrap',
          }}
          className="hide-on-mobile"
        >
          {listenerCount} travelling with you
        </span>
      </div>

      {/* Right: Glass Navigation Pills (YouTube, Install) */}
      <nav
        aria-label="Main Navigation"
        style={{
          pointerEvents: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        {/* YouTube Playlist Link */}
        <a
          href={activeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="glass-pill"
          title="Open official playlist on YouTube"
          aria-label="Open YouTube playlist"
          style={{ padding: '7px 14px' }}
        >
          <ExternalLink size={14} />
          <span className="hide-on-mobile">YouTube</span>
        </a>

        {/* Install App Button */}
        <button
          type="button"
          onClick={onOpenInstall}
          className={`glass-pill ${isInstallOpen ? 'active' : ''}`}
          title="Install as Progressive Web App"
          aria-label="Install app"
          style={{ padding: '7px 14px' }}
        >
          <Download size={14} />
          <span className="hide-on-mobile">Install</span>
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
