import React, { useState, useEffect } from 'react';
import { Key, Shield, Radio, Sparkles } from 'lucide-react';

interface LoadingScreenProps {
  onComplete?: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const phases = [
    { text: 'Looking for keys...', icon: Key },
    { text: 'Tightening up seatbelts...', icon: Shield },
    { text: 'Tuning on the radio...', icon: Radio },
  ];

  useEffect(() => {
    // Phase message updates (spread across 6 seconds)
    const t1 = setTimeout(() => setPhaseIndex(1), 2000);
    const t2 = setTimeout(() => setPhaseIndex(2), 4000);

    // Progress bar animation for 6 seconds
    const startTime = Date.now();
    const duration = 6000;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const p = Math.min(100, (elapsed / duration) * 100);
      setProgress(p);

      if (elapsed >= duration) {
        clearInterval(interval);
        setIsFadingOut(true);
        setTimeout(() => {
          setIsVisible(false);
          if (onComplete) onComplete();
        }, 800);
      }
    }, 40);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearInterval(interval);
    };
  }, [onComplete]);

  if (!isVisible) return null;

  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, 400);
  };

  const CurrentIcon = phases[phaseIndex].icon;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Loading Experience"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'radial-gradient(ellipse at 50% 35%, #2d140f 0%, #150906 70%, #0c0504 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '36px 24px',
        opacity: isFadingOut ? 0 : 1,
        transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: isFadingOut ? 'none' : 'auto',
        overflowY: 'auto',
        userSelect: 'none',
        WebkitUserSelect: 'none',
      }}
    >
      {/* Top subtle decorative pill */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '999px',
          background: 'rgba(255, 240, 208, 0.08)',
          border: '1px solid rgba(255, 240, 208, 0.18)',
          fontSize: '0.75rem',
          color: 'var(--cream)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          fontWeight: 600,
        }}
      >
        <Sparkles size={13} style={{ color: 'var(--terracotta-bright)' }} />
        <span>Nostalgic Road Trip Experience</span>
      </div>

      {/* Main Center Content: Title, Prep Step & Animated Bar */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: '520px',
          width: '100%',
          margin: 'auto 0',
          padding: '20px 0',
        }}
      >
        {/* English Typography Title */}
        <h1
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(2.4rem, 6vw, 3.8rem)',
            fontWeight: 700,
            color: '#fff3db',
            letterSpacing: '0.02em',
            lineHeight: 1.15,
            marginBottom: '6px',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.8), 0 0 25px rgba(255, 225, 160, 0.35)',
          }}
        >
          Ghoomte Phirte
        </h1>

        {/* Subtitle in Vintage Sans */}
        <p
          style={{
            fontFamily: 'var(--font-main)',
            fontSize: 'clamp(0.9rem, 2.5vw, 1.15rem)',
            fontWeight: 500,
            color: 'var(--terracotta-bright)',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            marginBottom: '32px',
          }}
        >
          Radio &bull; Vintage Indian Drive
        </p>

        {/* Phase Animation Box */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 24px',
            borderRadius: '999px',
            background: 'rgba(45, 20, 15, 0.65)',
            border: '1px solid rgba(255, 240, 208, 0.25)',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)',
            marginBottom: '20px',
            minHeight: '48px',
          }}
        >
          <CurrentIcon
            size={18}
            style={{
              color: 'var(--terracotta-bright)',
              animation: 'spinPulse 1.2s ease infinite',
            }}
          />
          <span
            key={phaseIndex}
            style={{
              fontFamily: 'var(--font-main)',
              fontSize: '0.96rem',
              fontWeight: 500,
              color: 'var(--cream)',
              animation: 'fadeInUpShort 0.3s ease',
            }}
          >
            {phases[phaseIndex].text}
          </span>
        </div>

        {/* Progress Bar Container */}
        <div
          style={{
            width: '260px',
            height: '4px',
            borderRadius: '2px',
            background: 'rgba(255, 240, 208, 0.15)',
            overflow: 'hidden',
            position: 'relative',
            marginBottom: '16px',
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #a94d32 0%, #ffbe76 100%)',
              borderRadius: '2px',
              boxShadow: '0 0 10px rgba(255, 190, 118, 0.7)',
              transition: 'width 0.08s linear',
            }}
          />
        </div>

        {/* Quick Skip button */}
        <button
          type="button"
          onClick={handleSkip}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--subtle-text)',
            fontSize: '0.78rem',
            cursor: 'pointer',
            padding: '4px 10px',
            textDecoration: 'underline',
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--cream)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--subtle-text)')}
        >
          Skip intro
        </button>
      </div>

      {/* Bottom Music & Content Disclaimer Card */}
      <footer
        className="glass-panel"
        style={{
          maxWidth: '680px',
          width: '100%',
          padding: '16px 20px',
          borderRadius: '16px',
          background: 'rgba(35, 16, 12, 0.65)',
          border: '1px solid rgba(255, 240, 208, 0.18)',
          textAlign: 'center',
        }}
      >
        <h4
          style={{
            fontSize: '0.78rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: 'var(--cream)',
            marginBottom: '6px',
          }}
        >
          Music &amp; Content Disclaimer
        </h4>
        <p
          style={{
            fontSize: '0.72rem',
            lineHeight: 1.5,
            color: 'var(--muted-text)',
            marginBottom: '6px',
          }}
        >
          Ghoomte Phirte is an independent, nostalgia-inspired web experience. Music is played through YouTube&apos;s official embedded player and remains subject to YouTube&apos;s terms and the respective rights holders&apos; policies. We do not host, download, or claim ownership of third-party music. All music rights belong to their respective owners. For music availability, copyright concerns, or playback issues, please visit YouTube.
        </p>
        <p
          style={{
            fontSize: '0.68rem',
            color: 'var(--subtle-text)',
            fontStyle: 'italic',
          }}
        >
          Ghoomte Phirte is not affiliated with or endorsed by YouTube or the artists featured.
        </p>
      </footer>

      <style>{`
        @keyframes fadeInUpShort {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes spinPulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.15);
          }
        }
      `}</style>
    </div>
  );
};
