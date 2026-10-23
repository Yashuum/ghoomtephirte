import React, { useEffect, useRef, useState } from 'react';

interface CursorEffectsProps {
  lighting: 'day' | 'night';
}

export const CursorEffects: React.FC<CursorEffectsProps> = ({ lighting }) => {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const haloRef = useRef<HTMLDivElement | null>(null);
  const [isTouch, setIsTouch] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const targetPos = useRef({ x: -100, y: -100 });
  const currentDotPos = useRef({ x: -100, y: -100 });
  const currentHaloPos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    // Check if touch device or reduced motion
    const checkTouch = () => {
      const coarse = window.matchMedia('(pointer: coarse)').matches;
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setIsTouch(coarse || reducedMotion || ('ontouchstart' in window));
    };

    checkTouch();
    window.addEventListener('resize', checkTouch);

    if (isTouch) return;

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') {
        setIsTouch(true);
        return;
      }
      targetPos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
    };

    const handlePointerLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('pointerleave', handlePointerLeave);

    let animId: number;

    const loop = () => {
      // Smooth lerp easing for dot
      currentDotPos.current.x += (targetPos.current.x - currentDotPos.current.x) * 0.28;
      currentDotPos.current.y += (targetPos.current.y - currentDotPos.current.y) * 0.28;

      // Slower lerp easing for ambient halo
      currentHaloPos.current.x += (targetPos.current.x - currentHaloPos.current.x) * 0.12;
      currentHaloPos.current.y += (targetPos.current.y - currentHaloPos.current.y) * 0.12;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${currentDotPos.current.x}px, ${currentDotPos.current.y}px, 0)`;
      }
      if (haloRef.current) {
        haloRef.current.style.transform = `translate3d(${currentHaloPos.current.x}px, ${currentHaloPos.current.y}px, 0)`;
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('resize', checkTouch);
    };
  }, [isTouch, isVisible]);

  if (isTouch) return null;

  const dotGlowColor = lighting === 'night' 
    ? 'rgba(255, 185, 95, 0.9)' 
    : 'rgba(255, 235, 180, 0.85)';
  const haloColor = lighting === 'night' 
    ? 'radial-gradient(circle, rgba(255, 150, 50, 0.15) 0%, rgba(200, 80, 30, 0.05) 50%, transparent 75%)' 
    : 'radial-gradient(circle, rgba(255, 220, 140, 0.14) 0%, rgba(255, 190, 100, 0.04) 50%, transparent 75%)';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9999,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }}
    >
      {/* Ambient glowing halo */}
      <div
        ref={haloRef}
        style={{
          position: 'absolute',
          top: -60,
          left: -60,
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: haloColor,
          mixBlendMode: 'screen',
          willChange: 'transform',
        }}
      />

      {/* Warm pointer follower dot */}
      <div
        ref={dotRef}
        style={{
          position: 'absolute',
          top: -5,
          left: -5,
          width: 10,
          height: 10,
          borderRadius: '50%',
          backgroundColor: dotGlowColor,
          boxShadow: `0 0 12px 3px ${dotGlowColor}`,
          willChange: 'transform',
        }}
      />
    </div>
  );
};
