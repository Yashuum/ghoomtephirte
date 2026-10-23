import React, { useEffect, useRef } from 'react';
import { SceneMode } from '../types';

interface SceneBackgroundProps {
  scene: SceneMode;
  mousePos: { x: number; y: number };
  isPlaying: boolean;
}

interface RainDrop {
  x: number;
  y: number;
  speed: number;
  length: number;
  opacity: number;
}

interface GlassDroplet {
  x: number;
  y: number;
  radius: number;
  speed: number;
  life: number;
}

export const SceneBackground: React.FC<SceneBackgroundProps> = ({ scene, mousePos, isPlaying }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Canvas Rain Animation (Active during Rain Scene)
  useEffect(() => {
    if (scene !== 'rain') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Falling rain streaks
    const streaks: RainDrop[] = [];
    const maxStreaks = Math.min(130, Math.floor(width / 9));
    for (let i = 0; i < maxStreaks; i++) {
      streaks.push({
        x: Math.random() * (width + 120),
        y: Math.random() * height,
        speed: 15 + Math.random() * 12,
        length: 18 + Math.random() * 24,
        opacity: 0.14 + Math.random() * 0.3,
      });
    }

    // Droplets slowly tracking down the car windshield
    const droplets: GlassDroplet[] = [];
    const maxDroplets = 32;

    const createDroplet = (): GlassDroplet => ({
      x: Math.random() * width,
      y: Math.random() * height * 0.75,
      radius: 1.2 + Math.random() * 2,
      speed: 0.3 + Math.random() * 0.8,
      life: 180 + Math.random() * 200,
    });

    for (let i = 0; i < maxDroplets; i++) {
      droplets.push(createDroplet());
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle falling streaks
      ctx.lineWidth = 1.1;
      for (let i = 0; i < streaks.length; i++) {
        const s = streaks[i];
        ctx.strokeStyle = `rgba(225, 238, 255, ${s.opacity})`;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.length * 0.2, s.y + s.length);
        ctx.stroke();

        s.y += s.speed;
        s.x -= s.speed * 0.2;

        if (s.y > height) {
          s.y = -s.length;
          s.x = Math.random() * (width + 120);
        }
      }

      // Draw windshield glass droplets
      for (let i = 0; i < droplets.length; i++) {
        const d = droplets[i];
        d.y += d.speed;
        d.life--;

        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.beginPath();
        ctx.ellipse(d.x, d.y, d.radius * 0.8, d.radius * 1.2, 0, 0, Math.PI * 2);
        ctx.fill();

        if (d.y > height || d.life <= 0) {
          droplets[i] = createDroplet();
          droplets[i].y = Math.random() * (height * 0.25);
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [scene]);

  // Enhanced mouse parallax movement as requested
  const parallaxX = (mousePos.x - 0.5) * -24;
  const parallaxY = (mousePos.y - 0.5) * -16;

  const sharedSceneStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    transition: 'opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
    willChange: 'opacity',
    WebkitBackfaceVisibility: 'hidden',
    backfaceVisibility: 'hidden',
  };

  return (
    <div
      className={`scene-viewport-root ${scene}`}
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      {/* Parallax Container: moves noticeably when cursor moves */}
      <div
        className="parallax-wrapper"
        style={{
          position: 'absolute',
          inset: '-28px',
          transform: `translate3d(${parallaxX}px, ${parallaxY}px, 0)`,
          transition: 'transform 0.18s cubic-bezier(0.2, 0.8, 0.25, 1)',
          willChange: 'transform',
        }}
      >
        {/* Driving Motion Container: continuous engine vibration and road float when driving */}
        <div
          className={`driving-motion-container ${isPlaying ? 'is-driving' : 'is-idling'}`}
          style={{
            position: 'absolute',
            inset: 0,
          }}
        >
          {/* 1. Day Mode Image Layer */}
          <div
            className="scene-image-layer day-layer"
            style={{
              ...sharedSceneStyle,
              backgroundImage: 'url(/images/scene-day.jpg)',
              opacity: scene === 'day' ? 1 : 0,
            }}
          />

          {/* 2. Night Mode Image Layer */}
          <div
            className="scene-image-layer night-layer"
            style={{
              ...sharedSceneStyle,
              backgroundImage: 'url(/images/scene-night.jpg)',
              opacity: scene === 'night' ? 1 : 0,
            }}
          />

          {/* 3. Rain Mode Image Layer */}
          <div
            className="scene-image-layer rain-layer"
            style={{
              ...sharedSceneStyle,
              backgroundImage: 'url(/images/scene-rain.jpg)',
              opacity: scene === 'rain' ? 1 : 0,
            }}
          />

          {/* 4. Night Atmosphere Warm Console Glow */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at 50% 90%, rgba(255, 145, 45, 0.2) 0%, transparent 55%)',
              opacity: scene === 'night' ? 1 : 0,
              transition: 'opacity 1.2s ease',
              mixBlendMode: 'screen',
            }}
          />

          {/* 5. Rain Windshield Droplets Canvas */}
          <canvas
            ref={canvasRef}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              opacity: scene === 'rain' ? 1 : 0,
              transition: 'opacity 0.8s ease',
            }}
          />
        </div>
      </div>

      {/* 6. Foggy Weather Perimeter & Soft Blurred Corners */}
      <div
        className="windshield-corner-fog"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 50%, transparent 58%, rgba(220, 230, 245, 0.08) 78%, rgba(200, 215, 235, 0.22) 100%)',
          boxShadow: 'inset 0 0 90px 25px rgba(20, 10, 8, 0.45)',
          backdropFilter: 'blur(2px)',
          WebkitBackdropFilter: 'blur(2px)',
          maskImage: 'radial-gradient(ellipse at center, transparent 65%, black 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, transparent 65%, black 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* 7. Soft Cinematic Edge Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 50%, transparent 60%, rgba(15, 6, 4, 0.45) 100%)',
          pointerEvents: 'none',
        }}
      />

      <style>{`
        .scene-image-layer {
          background-position: center bottom;
        }
        @media (max-width: 900px) {
          .scene-image-layer {
            background-position: 8% 70% !important;
          }
        }
        @media (max-width: 600px) {
          .scene-image-layer {
            background-position: 0% 64% !important;
          }
        }
        @media (max-width: 420px) {
          .scene-image-layer {
            background-position: 0% 60% !important;
          }
        }

        /* Continuous road driving vibration & float */
        .is-driving {
          animation: carRoadRumble 0.35s ease-in-out infinite alternate, carRoadSway 3.4s ease-in-out infinite;
        }
        .is-idling {
          animation: carIdleVibration 1.8s ease-in-out infinite alternate;
        }

        @keyframes carRoadRumble {
          0% {
            transform: translate3d(0px, 0px, 0);
          }
          25% {
            transform: translate3d(-1px, -1.2px, 0);
          }
          50% {
            transform: translate3d(1.2px, 0.8px, 0);
          }
          75% {
            transform: translate3d(-0.8px, 1.4px, 0);
          }
          100% {
            transform: translate3d(0.9px, -0.7px, 0);
          }
        }

        @keyframes carRoadSway {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          30% {
            transform: translateY(-2.2px) rotate(0.12deg);
          }
          60% {
            transform: translateY(1.8px) rotate(-0.14deg);
          }
          85% {
            transform: translateY(-1px) rotate(0.08deg);
          }
        }

        @keyframes carIdleVibration {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-0.8px);
          }
        }
      `}</style>
    </div>
  );
};
