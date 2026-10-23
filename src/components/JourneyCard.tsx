import React from 'react';
import { Compass, Sparkles, X } from 'lucide-react';

interface JourneyCardProps {
  onStartJourney: () => void;
  onDismiss: () => void;
}

export const JourneyCard: React.FC<JourneyCardProps> = ({ onStartJourney, onDismiss }) => {
  return (
    <aside
      aria-label="Welcome Journey Card"
      className="glass-panel journey-welcome-card"
      style={{
        position: 'relative',
        maxWidth: '400px',
        width: '100%',
        padding: '24px 28px',
        borderRadius: 'var(--radius-lg)',
        zIndex: 20,
        pointerEvents: 'auto',
        animation: 'fadeInUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Dismiss Button */}
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss journey card"
        title="Dismiss"
        style={{
          position: 'absolute',
          top: '14px',
          right: '14px',
          background: 'transparent',
          border: 'none',
          color: 'var(--subtle-text)',
          cursor: 'pointer',
          padding: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          transition: 'color 0.2s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--cream)')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--subtle-text)')}
      >
        <X size={16} />
      </button>

      {/* Badge */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 12px',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(169, 77, 50, 0.35)',
          border: '1px solid rgba(255, 240, 208, 0.2)',
          color: 'var(--cream)',
          fontSize: '0.72rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: '12px',
        }}
      >
        <Compass size={12} style={{ color: 'var(--cream)' }} />
        <span>Nostalgic Road Trip</span>
      </div>

      {/* Title */}
      <h2
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '1.45rem',
          fontWeight: 600,
          color: 'var(--cream)',
          lineHeight: 1.25,
          marginBottom: '8px',
        }}
      >
        Ready for a little drive?
      </h2>

      {/* Description */}
      <p
        style={{
          fontSize: '0.86rem',
          lineHeight: 1.5,
          color: 'var(--muted-text)',
          marginBottom: '22px',
          maxWidth: '320px',
        }}
      >
        Old streets, favourite songs, and nowhere in particular to be. Take the long way and let the melodies play.
      </p>

      {/* Action Button: Start the Journey only */}
      <button
        type="button"
        onClick={onStartJourney}
        style={{
          width: '100%',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          padding: '12px 24px',
          borderRadius: 'var(--radius-full)',
          background: 'linear-gradient(135deg, #c85a3a 0%, #a94d32 100%)',
          border: '1px solid rgba(255, 240, 208, 0.4)',
          color: '#ffffff',
          fontFamily: 'var(--font-main)',
          fontSize: '0.92rem',
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: '0 4px 18px rgba(169, 77, 50, 0.45)',
          transition: 'all 0.25s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = '0 6px 24px rgba(200, 90, 58, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 18px rgba(169, 77, 50, 0.45)';
        }}
      >
        <Sparkles size={16} />
        <span>Start the Journey</span>
      </button>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(18px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </aside>
  );
};
