import React from 'react';
import { SceneMode } from '../types';

interface HindiHeadlineProps {
  scene: SceneMode;
  mousePos: { x: number; y: number };
}

export const HindiHeadline: React.FC<HindiHeadlineProps> = ({ scene, mousePos }) => {
  // Gentle subtle parallax shift
  const shiftX = (mousePos.x - 0.5) * -10;
  const shiftY = (mousePos.y - 0.5) * -6;

  const getThemeStyles = () => {
    switch (scene) {
      case 'night':
        return {
          textColor: '#fff2d4',
          shadow: `
            0 2px 0 #9e5527,
            0 5px 0 #733512,
            0 8px 0 #4a1e09,
            0 10px 22px rgba(0, 0, 0, 0.9),
            0 0 35px rgba(255, 180, 80, 0.6),
            0 0 70px rgba(255, 140, 40, 0.35)
          `,
        };
      case 'rain':
        return {
          textColor: '#f8f6ee',
          shadow: `
            0 2px 0 #7a6858,
            0 5px 0 #524235,
            0 8px 0 #32251c,
            0 10px 22px rgba(0, 0, 0, 0.9),
            0 0 45px rgba(185, 220, 250, 0.5)
          `,
        };
      case 'day':
      default:
        return {
          textColor: '#fff5dc',
          shadow: `
            0 3px 0 #deb074,
            0 6px 0 #b37e42,
            0 8px 0 #7d4d20,
            0 11px 0 #4e290e,
            0 14px 26px rgba(0, 0, 0, 0.85),
            0 0 45px rgba(255, 230, 160, 0.55)
          `,
        };
    }
  };

  const theme = getThemeStyles();

  return (
    <div
      className="hindi-headline-container"
      style={{
        position: 'fixed',
        top: '11.5%',
        left: '50%',
        transform: `translate(calc(-50% + ${shiftX}px), ${shiftY}px)`,
        zIndex: 15,
        pointerEvents: 'none',
        textAlign: 'center',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        transition: 'transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)',
        width: '100%',
        maxWidth: '96vw',
      }}
    >
      <h1
        className="hindi-headline-text"
        style={{
          fontFamily: "'Rozha One', 'Yatra One', serif",
          fontSize: 'clamp(4.2rem, 10.5vw, 7.8rem)',
          fontWeight: 400,
          color: theme.textColor,
          textShadow: theme.shadow,
          letterSpacing: '0.04em',
          lineHeight: 1.15,
          whiteSpace: 'nowrap',
          filter: 'drop-shadow(0 8px 20px rgba(0, 0, 0, 0.65))',
          transition: 'color 1.2s ease, text-shadow 1.2s ease',
        }}
      >
        “घूमते फिरते”
      </h1>

      <style>{`
        @media (max-width: 1024px) {
          .hindi-headline-container {
            top: 11% !important;
          }
          .hindi-headline-text {
            font-size: clamp(3.6rem, 11vw, 5.8rem) !important;
          }
        }
        @media (max-width: 680px) {
          .hindi-headline-container {
            top: 13.5% !important;
          }
          .hindi-headline-text {
            font-size: clamp(3.8rem, 16.5vw, 5.6rem) !important;
          }
        }
        @media (max-width: 420px) {
          .hindi-headline-container {
            top: 13% !important;
          }
          .hindi-headline-text {
            font-size: clamp(3.2rem, 18vw, 4.4rem) !important;
          }
        }
      `}</style>
    </div>
  );
};
