import React from 'react';
import { Volume2, CloudRain, Radio, X } from 'lucide-react';
import { ambientAudio } from '../audio/ambientAudio';

interface AmbientSoundModalProps {
  isOpen: boolean;
  onClose: () => void;
  radioHiss: boolean;
  rainSound: boolean;
  onToggleRadio: () => void;
  onToggleRain: () => void;
}

export const AmbientSoundModal: React.FC<AmbientSoundModalProps> = ({
  isOpen,
  onClose,
  radioHiss,
  rainSound,
  onToggleRadio,
  onToggleRain,
}) => {
  const [radioVol, setRadioVol] = React.useState<number>(ambientAudio.getRadioVolume());
  const [rainVol, setRainVol] = React.useState<number>(ambientAudio.getRainVolume());

  if (!isOpen) return null;

  const handleRadioVolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setRadioVol(v);
    ambientAudio.setRadioHiss(radioHiss, v);
  };

  const handleRainVolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setRainVol(v);
    ambientAudio.setRainSound(rainSound, v);
  };

  return (
    <div
      role="dialog"
      aria-label="Environmental Ambient Sounds"
      className="glass-panel"
      style={{
        position: 'absolute',
        bottom: '86px',
        right: '24px',
        width: '320px',
        padding: '20px',
        borderRadius: 'var(--radius-md)',
        zIndex: 55,
        boxShadow: '0 20px 45px rgba(0, 0, 0, 0.65)',
        animation: 'popIn 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Volume2 size={16} style={{ color: 'var(--terracotta-bright)' }} />
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--cream)' }}>
            Ambient Atmosphere
          </h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close ambient sounds"
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--subtle-text)',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <X size={16} />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Vintage Radio AM Hiss */}
        <div style={{ padding: '10px 12px', background: 'rgba(255, 240, 208, 0.05)', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Radio size={15} style={{ color: radioHiss ? '#ffb960' : 'var(--subtle-text)' }} />
              <div>
                <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--cream)', display: 'block' }}>
                  Vintage Radio Hiss
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--subtle-text)' }}>AM Band tube warmth</span>
              </div>
            </div>
            <button
              type="button"
              onClick={onToggleRadio}
              style={{
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--glass-border)',
                background: radioHiss ? 'rgba(169, 77, 50, 0.6)' : 'rgba(255, 255, 255, 0.08)',
                color: radioHiss ? '#fff' : 'var(--muted-text)',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {radioHiss ? 'Active' : 'Off'}
            </button>
          </div>
          {radioHiss && (
            <input
              type="range"
              min={0}
              max={0.4}
              step={0.01}
              value={radioVol}
              onChange={handleRadioVolChange}
              aria-label="Radio hiss volume"
              style={{ width: '100%', accentColor: 'var(--terracotta-bright)', cursor: 'pointer' }}
            />
          )}
        </div>

        {/* Monsoon Rain */}
        <div style={{ padding: '10px 12px', background: 'rgba(255, 240, 208, 0.05)', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CloudRain size={15} style={{ color: rainSound ? '#90d4ff' : 'var(--subtle-text)' }} />
              <div>
                <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--cream)', display: 'block' }}>
                  Monsoon Car Roof
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--subtle-text)' }}>Raindrops on metal & glass</span>
              </div>
            </div>
            <button
              type="button"
              onClick={onToggleRain}
              style={{
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--glass-border)',
                background: rainSound ? 'rgba(64, 150, 210, 0.55)' : 'rgba(255, 255, 255, 0.08)',
                color: rainSound ? '#fff' : 'var(--muted-text)',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {rainSound ? 'Active' : 'Off'}
            </button>
          </div>
          {rainSound && (
            <input
              type="range"
              min={0}
              max={0.6}
              step={0.01}
              value={rainVol}
              onChange={handleRainVolChange}
              aria-label="Monsoon rain sound volume"
              style={{ width: '100%', accentColor: '#90d4ff', cursor: 'pointer' }}
            />
          )}
        </div>
      </div>

      <style>{`
        @keyframes popIn {
          from { opacity: 0; transform: translateY(10px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
};
