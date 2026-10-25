import React, { useState, useEffect, useRef } from 'react';
import { Key, Shield, Radio, Sparkles, Compass } from 'lucide-react';

interface LoadingScreenProps {
  onComplete?: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isKeyTurned, setIsKeyTurned] = useState(false);

  // 3D Tilt coordinates (-1 to 1)
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);

  const phases = [
    { text: 'Looking for the car keys...', icon: Key, needleAngle: -45 },
    { text: 'Tightening up seatbelts...', icon: Shield, needleAngle: 0 },
    { text: 'Tuning in the nostalgic radio...', icon: Radio, needleAngle: 48 },
  ];

  // Mouse & Touch 3D Parallax Tracking
  useEffect(() => {
    let animFrame: number;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const width = window.innerWidth;
      const height = window.innerHeight;

      targetX = ((clientX / width) - 0.5) * 2;
      targetY = ((clientY / height) - 0.5) * 2;
    };

    const updateTilt = () => {
      // Smooth interpolation
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      setTilt({ x: currentX, y: currentY });
      animFrame = requestAnimationFrame(updateTilt);
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    animFrame = requestAnimationFrame(updateTilt);

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      cancelAnimationFrame(animFrame);
    };
  }, []);

  // Timed Progress & Phase Updates (6 seconds)
  useEffect(() => {
    const t1 = setTimeout(() => setPhaseIndex(1), 2000);
    const t2 = setTimeout(() => setPhaseIndex(2), 4000);

    const startTime = Date.now();
    const duration = 6000;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const p = Math.min(100, (elapsed / duration) * 100);
      setProgress(p);

      if (elapsed >= duration) {
        clearInterval(interval);
        handleFinish();
      }
    }, 40);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearInterval(interval);
    };
  }, []);

  const handleFinish = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, 700);
  };

  const handleTurnKey = () => {
    if (isKeyTurned) return;
    setIsKeyTurned(true);
    setProgress(100);
    setPhaseIndex(2);
    setTimeout(() => {
      handleFinish();
    }, 550);
  };

  if (!isVisible) return null;

  const CurrentIcon = phases[phaseIndex].icon;

  // 3D rotation angles
  const rotX = -tilt.y * 14;
  const rotY = tilt.x * 16;

  // Radio needle rotation angle tied to progress (-60deg to +60deg)
  const needleRot = -60 + (progress / 100) * 120;

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label="Loading Nostalgic Road Trip"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'radial-gradient(ellipse at 50% 40%, #2b130e 0%, #170906 65%, #080302 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '24px 20px',
        opacity: isFadingOut ? 0 : 1,
        transition: 'opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: isFadingOut ? 'none' : 'auto',
        overflowY: 'auto',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        perspective: '1200px',
      }}
    >
      {/* Background Animated Floating Ambient Dust Particles in 3D */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
          zIndex: 0,
        }}
      >
        <div className="dust-particle p1" />
        <div className="dust-particle p2" />
        <div className="dust-particle p3" />
        <div className="dust-particle p4" />
        <div className="dust-particle p5" />
      </div>

      {/* Top Header Badge */}
      <div
        style={{
          zIndex: 10,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '999px',
          background: 'rgba(255, 240, 208, 0.08)',
          border: '1px solid rgba(255, 240, 208, 0.2)',
          fontSize: '0.74rem',
          color: 'var(--cream)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          fontWeight: 600,
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
        }}
      >
        <Sparkles size={13} style={{ color: 'var(--terracotta-bright)' }} />
        <span>Nostalgic Road Trip Experience</span>
      </div>

      {/* Main Center: 3D Interactive Stage */}
      <div
        className="interactive-3d-stage"
        style={{
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: '540px',
          width: '100%',
          margin: 'auto 0',
          padding: '16px 0',
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
          transition: 'transform 0.12s cubic-bezier(0.2, 0.8, 0.25, 1)',
        }}
      >
        {/* Layer 1: 3D Hindi & English Cinema Headline */}
        <div style={{ transform: 'translateZ(45px)', transformStyle: 'preserve-3d' }}>
          <h1
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(2.5rem, 6.5vw, 4rem)',
              fontWeight: 700,
              color: '#fff3db',
              letterSpacing: '0.02em',
              lineHeight: 1.15,
              margin: '0 0 4px 0',
              textShadow:
                '0 4px 10px rgba(0, 0, 0, 0.9), 0 0 35px rgba(255, 190, 118, 0.45)',
            }}
          >
            Ghoomte Phirte
          </h1>

          <p
            style={{
              fontFamily: 'var(--font-main)',
              fontSize: 'clamp(0.85rem, 2.4vw, 1.05rem)',
              fontWeight: 500,
              color: 'var(--terracotta-bright)',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              margin: '0 0 20px 0',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)',
            }}
          >
            घूमते फिरते &bull; Vintage Indian Road Trip
          </p>
        </div>

        {/* Layer 2: 3D Vintage Speedometer & Radio Dial Gauge (Interactive Key in Center) */}
        <div
          className="vintage-3d-gauge"
          onClick={handleTurnKey}
          title="Click to turn ignition key & start journey!"
          style={{
            transform: 'translateZ(70px)',
            transformStyle: 'preserve-3d',
            position: 'relative',
            width: '210px',
            height: '210px',
            borderRadius: '50%',
            background:
              'radial-gradient(circle at 40% 35%, #3a1811 0%, #200d08 60%, #110503 100%)',
            border: '4px solid #8e422c',
            boxShadow:
              '0 18px 45px rgba(0, 0, 0, 0.85), inset 0 0 24px rgba(0, 0, 0, 0.9), inset 0 2px 10px rgba(255, 230, 180, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            marginBottom: '22px',
          }}
        >
          {/* Outer Chrome Bezel Ring */}
          <div
            style={{
              position: 'absolute',
              inset: '-8px',
              borderRadius: '50%',
              border: '2px solid rgba(255, 235, 200, 0.4)',
              boxShadow: '0 0 20px rgba(200, 90, 58, 0.3)',
              pointerEvents: 'none',
            }}
          />

          {/* Radio Frequency Numbers around Dial */}
          <span className="gauge-label top">91.1 FM</span>
          <span className="gauge-label right">104.0</span>
          <span className="gauge-label bottom">107.2 FM</span>
          <span className="gauge-label left">92.7</span>

          {/* 3D Moving Needle */}
          <div
            style={{
              position: 'absolute',
              width: '4px',
              height: '84px',
              bottom: '105px',
              left: 'calc(50% - 2px)',
              background: 'linear-gradient(to top, #ffbe76 0%, #ff5233 100%)',
              borderRadius: '3px',
              transformOrigin: 'bottom center',
              transform: `rotate(${needleRot}deg)`,
              transition: 'transform 0.12s cubic-bezier(0.2, 0.8, 0.25, 1)',
              boxShadow: '0 0 10px rgba(255, 82, 51, 0.8)',
              pointerEvents: 'none',
              zIndex: 3,
            }}
          />

          {/* 3D Center Ignition Key Hub */}
          <div
            style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              background:
                'radial-gradient(circle at 35% 35%, #6a2a19 0%, #2f1008 70%, #150603 100%)',
              border: '2px solid rgba(255, 220, 160, 0.5)',
              boxShadow: '0 4px 18px rgba(0, 0, 0, 0.9), inset 0 2px 6px rgba(255, 255, 255, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 4,
              transform: `rotate(${isKeyTurned ? 65 : 0}deg)`,
              transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            <Key
              size={28}
              style={{
                color: isKeyTurned ? '#4ade80' : '#ffbe76',
                filter: 'drop-shadow(0 2px 5px rgba(0, 0, 0, 0.8))',
                transform: 'rotate(-45deg)',
                transition: 'color 0.3s ease',
              }}
            />
          </div>

          {/* Glass Glare Reflection overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              background:
                'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.04) 45%, transparent 65%)',
              pointerEvents: 'none',
              zIndex: 5,
            }}
          />
        </div>

        {/* Layer 3: Interactive Instruction Pill */}
        <div style={{ transform: 'translateZ(55px)', marginBottom: '16px' }}>
          <button
            type="button"
            onClick={handleTurnKey}
            className="glass-pill"
            style={{
              padding: '8px 18px',
              fontSize: '0.82rem',
              fontWeight: 600,
              gap: '8px',
              cursor: 'pointer',
              background: isKeyTurned ? 'rgba(74, 222, 128, 0.25)' : 'rgba(200, 90, 58, 0.35)',
              borderColor: isKeyTurned ? 'rgba(74, 222, 128, 0.6)' : 'rgba(255, 240, 208, 0.35)',
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.5)',
              transition: 'all 0.25s ease',
            }}
          >
            <Compass size={14} style={{ color: 'var(--cream)' }} />
            <span>
              {isKeyTurned ? 'Ignition Turned! Starting...' : 'Tap Key to Turn Ignition'}
            </span>
          </button>
        </div>

        {/* Layer 4: Prep Phase Step Animation */}
        <div
          style={{
            transform: 'translateZ(40px)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 22px',
            borderRadius: '999px',
            background: 'rgba(38, 16, 12, 0.75)',
            border: '1px solid rgba(255, 240, 208, 0.22)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
            marginBottom: '16px',
            minHeight: '44px',
          }}
        >
          <CurrentIcon
            size={16}
            style={{
              color: 'var(--terracotta-bright)',
              animation: 'spinPulse 1.4s ease infinite',
            }}
          />
          <span
            key={phaseIndex}
            style={{
              fontFamily: 'var(--font-main)',
              fontSize: '0.92rem',
              fontWeight: 500,
              color: 'var(--cream)',
              animation: 'fadeInUpShort 0.3s ease',
            }}
          >
            {phases[phaseIndex].text}
          </span>
        </div>

        {/* Layer 5: Progress Bar Container */}
        <div
          style={{
            transform: 'translateZ(30px)',
            width: '280px',
            height: '4px',
            borderRadius: '2px',
            background: 'rgba(255, 240, 208, 0.15)',
            overflow: 'hidden',
            position: 'relative',
            marginBottom: '14px',
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #a94d32 0%, #ffbe76 100%)',
              borderRadius: '2px',
              boxShadow: '0 0 12px rgba(255, 190, 118, 0.7)',
              transition: 'width 0.08s linear',
            }}
          />
        </div>

        {/* Skip button */}
        <button
          type="button"
          onClick={handleFinish}
          style={{
            transform: 'translateZ(20px)',
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
          Skip intro &bull; Drive immediately
        </button>
      </div>

      {/* Bottom Platform & Broadcast Disclaimer Card */}
      <footer
        className="glass-panel"
        style={{
          zIndex: 10,
          maxWidth: '680px',
          width: '100%',
          padding: '14px 20px',
          borderRadius: '14px',
          background: 'rgba(32, 14, 10, 0.7)',
          border: '1px solid rgba(255, 240, 208, 0.16)',
          textAlign: 'center',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)',
        }}
      >
        <h4
          style={{
            fontSize: '0.76rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--cream)',
            margin: '0 0 5px 0',
          }}
        >
          Platform &amp; Radio Broadcast Notice
        </h4>
        <p
          style={{
            fontSize: '0.73rem',
            lineHeight: 1.5,
            color: 'var(--muted-text)',
            margin: '0 0 5px 0',
          }}
        >
          Ghoomte Phirte is an independent, non-commercial nostalgia experience designed as an interactive portal tuning into publicly accessible third-party web radio streams. We do not broadcast, store, host, or download any media files. All musical compositions, streams, and copyrights remain the exclusive property of their respective radio stations, broadcast networks, and rights holders.
        </p>
        <p
          style={{
            fontSize: '0.69rem',
            color: 'var(--subtle-text)',
            fontStyle: 'italic',
            margin: 0,
          }}
        >
          For stream availability, song inquiries, or licensing matters, please contact the originating radio broadcasters directly.
        </p>
      </footer>

      {/* 3D Styles & Ambient Keyframes */}
      <style>{`
        .gauge-label {
          position: absolute;
          font-family: var(--font-mono);
          font-size: 0.68rem;
          font-weight: 700;
          color: rgba(255, 240, 208, 0.65);
          letter-spacing: 0.04em;
          pointer-events: none;
        }
        .gauge-label.top { top: 14px; }
        .gauge-label.bottom { bottom: 14px; }
        .gauge-label.left { left: 16px; }
        .gauge-label.right { right: 14px; }

        .dust-particle {
          position: absolute;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: rgba(255, 190, 118, 0.4);
          box-shadow: 0 0 8px rgba(255, 190, 118, 0.8);
          animation: floatDust 12s infinite linear;
        }
        .dust-particle.p1 { top: 20%; left: 15%; animation-duration: 9s; }
        .dust-particle.p2 { top: 70%; left: 80%; animation-duration: 14s; }
        .dust-particle.p3 { top: 40%; left: 65%; animation-duration: 11s; }
        .dust-particle.p4 { top: 85%; left: 25%; animation-duration: 16s; }
        .dust-particle.p5 { top: 15%; left: 75%; animation-duration: 13s; }

        @keyframes floatDust {
          0% { transform: translateY(0px) translateX(0px); opacity: 0; }
          30% { opacity: 0.8; }
          70% { opacity: 0.8; }
          100% { transform: translateY(-140px) translateX(30px); opacity: 0; }
        }

        @keyframes fadeInUpShort {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes spinPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }

        @media (max-width: 600px) {
          .vintage-3d-gauge {
            width: 170px !important;
            height: 170px !important;
            margin-bottom: 16px !important;
          }
          .interactive-3d-stage {
            padding: 8px 0 !important;
          }
        }
      `}</style>
    </div>
  );
};
