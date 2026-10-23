import React, { useState } from 'react';
import { Sun, Moon, CloudRain, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import { SceneMode } from '../types';

interface AtmosphereControllerProps {
  scene: SceneMode;
  onSelectScene: (mode: SceneMode) => void;
  onReset: () => void;
}

export const AtmosphereController: React.FC<AtmosphereControllerProps> = ({
  scene,
  onSelectScene,
  onReset,
}) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const getSceneIcon = () => {
    switch (scene) {
      case 'night':
        return <Moon size={14} color="#cfe0ff" />;
      case 'rain':
        return <CloudRain size={14} color="#a5dcff" />;
      case 'day':
      default:
        return <Sun size={14} color="#ffe082" />;
    }
  };

  const getSceneLabel = () => {
    switch (scene) {
      case 'night':
        return 'Night';
      case 'rain':
        return 'Rain';
      case 'day':
      default:
        return 'Day';
    }
  };

  return (
    <>
      {/* 1. Desktop Atmosphere Bar (Floating Top-Center) */}
      <nav
        aria-label="Desktop Atmosphere Controls"
        className="desktop-atmosphere-bar"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          padding: '5px 8px',
          borderRadius: 'var(--radius-full)',
          background: 'var(--glass)',
          backdropFilter: 'blur(var(--glass-blur)) saturate(160%)',
          WebkitBackdropFilter: 'blur(var(--glass-blur)) saturate(160%)',
          border: '1px solid var(--glass-border)',
          boxShadow: 'var(--shadow-ambient)',
        }}
      >
        {/* Day Scene Button */}
        <button
          type="button"
          onClick={() => onSelectScene('day')}
          aria-pressed={scene === 'day'}
          title="Switch to Daytime Drive"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
            border: 'none',
            background: scene === 'day' ? 'rgba(212, 121, 66, 0.55)' : 'transparent',
            color: scene === 'day' ? '#ffffff' : 'var(--muted-text)',
            boxShadow: scene === 'day' ? '0 0 16px rgba(212, 121, 66, 0.5)' : 'none',
            fontFamily: 'var(--font-main)',
            fontSize: '0.82rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)',
          }}
        >
          <Sun size={15} color={scene === 'day' ? '#ffe082' : 'currentColor'} />
          <span>Day</span>
        </button>

        {/* Night Scene Button */}
        <button
          type="button"
          onClick={() => onSelectScene('night')}
          aria-pressed={scene === 'night'}
          title="Switch to Moonlit Night Drive"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
            border: 'none',
            background: scene === 'night' ? 'rgba(70, 95, 160, 0.55)' : 'transparent',
            color: scene === 'night' ? '#ffffff' : 'var(--muted-text)',
            boxShadow: scene === 'night' ? '0 0 16px rgba(70, 95, 160, 0.5)' : 'none',
            fontFamily: 'var(--font-main)',
            fontSize: '0.82rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)',
          }}
        >
          <Moon size={15} color={scene === 'night' ? '#cfe0ff' : 'currentColor'} />
          <span>Night</span>
        </button>

        {/* Rain Scene Button */}
        <button
          type="button"
          onClick={() => onSelectScene('rain')}
          aria-pressed={scene === 'rain'}
          title="Switch to Monsoon Rainy Drive"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
            border: 'none',
            background: scene === 'rain' ? 'rgba(52, 140, 205, 0.55)' : 'transparent',
            color: scene === 'rain' ? '#ffffff' : 'var(--muted-text)',
            boxShadow: scene === 'rain' ? '0 0 16px rgba(52, 140, 205, 0.5)' : 'none',
            fontFamily: 'var(--font-main)',
            fontSize: '0.82rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)',
          }}
        >
          <CloudRain size={15} color={scene === 'rain' ? '#a5dcff' : 'currentColor'} />
          <span>Rain</span>
        </button>

        {/* Divider */}
        <div
          style={{
            width: '1px',
            height: '16px',
            backgroundColor: 'rgba(255, 240, 208, 0.2)',
            margin: '0 2px',
          }}
        />

        {/* Reset to Day Button */}
        <button
          type="button"
          onClick={onReset}
          title="Reset to daytime drive"
          aria-label="Reset scene"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '6px',
            borderRadius: '50%',
            border: 'none',
            background: 'transparent',
            color: 'var(--subtle-text)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--cream)';
            e.currentTarget.style.transform = 'rotate(-45deg)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--subtle-text)';
            e.currentTarget.style.transform = 'rotate(0deg)';
          }}
        >
          <RotateCcw size={13} />
        </button>
      </nav>

      {/* 2. Mobile Expandable Weather Pill (Positioned below the time card) */}
      <div className="mobile-atmosphere-expandable" style={{ display: 'none' }}>
        {/* Compact trigger button below clock */}
        <button
          type="button"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="glass-pill"
          style={{
            padding: '6px 12px',
            fontSize: '0.78rem',
            fontWeight: 600,
            gap: '6px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.35)',
          }}
        >
          {getSceneIcon()}
          <span>{getSceneLabel()}</span>
          {isMobileOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>

        {/* Expandable Dropdown Options */}
        {isMobileOpen && (
          <div
            className="glass-panel"
            style={{
              position: 'absolute',
              top: '36px',
              left: '0',
              zIndex: 50,
              padding: '6px',
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              minWidth: '130px',
              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.6)',
              animation: 'slideDownFade 0.2s ease',
            }}
          >
            <button
              type="button"
              onClick={() => {
                onSelectScene('day');
                setIsMobileOpen(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '7px 12px',
                borderRadius: '12px',
                border: 'none',
                background: scene === 'day' ? 'rgba(212, 121, 66, 0.55)' : 'transparent',
                color: scene === 'day' ? '#fff' : 'var(--cream)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <Sun size={14} color="#ffe082" />
              <span>Day Drive</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onSelectScene('night');
                setIsMobileOpen(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '7px 12px',
                borderRadius: '12px',
                border: 'none',
                background: scene === 'night' ? 'rgba(70, 95, 160, 0.55)' : 'transparent',
                color: scene === 'night' ? '#fff' : 'var(--cream)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <Moon size={14} color="#cfe0ff" />
              <span>Night Drive</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onSelectScene('rain');
                setIsMobileOpen(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '7px 12px',
                borderRadius: '12px',
                border: 'none',
                background: scene === 'rain' ? 'rgba(52, 140, 205, 0.55)' : 'transparent',
                color: scene === 'rain' ? '#fff' : 'var(--cream)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <CloudRain size={14} color="#a5dcff" />
              <span>Monsoon Rain</span>
            </button>

            <div style={{ height: '1px', background: 'rgba(255, 240, 208, 0.15)', margin: '2px 0' }} />

            <button
              type="button"
              onClick={() => {
                onReset();
                setIsMobileOpen(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                borderRadius: '12px',
                border: 'none',
                background: 'transparent',
                color: 'var(--subtle-text)',
                fontSize: '0.74rem',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <RotateCcw size={12} />
              <span>Reset View</span>
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideDownFade {
          from {
            opacity: 0;
            transform: translateY(-6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @media (max-width: 680px) {
          .desktop-atmosphere-bar {
            display: none !important;
          }
          .mobile-atmosphere-expandable {
            display: block !important;
            position: relative;
          }
        }
      `}</style>
    </>
  );
};
