import React, { useState } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Sliders,
  Mail,
  Disc,
  Lock,
  Radio,
  Moon,
} from 'lucide-react';
import { PlaybackStatus, TrackMetadata } from '../types';
import { radioController } from '../audio/radioPlayer';
import { AmbientSoundModal } from './AmbientSoundModal';

interface MusicPlayerProps {
  status: PlaybackStatus;
  metadata: TrackMetadata;
  radioHiss: boolean;
  rainSound: boolean;
  onToggleRadioHiss: () => void;
  onToggleRainSound: () => void;
  onOpenAdmin?: () => void;
  onOpenStations?: () => void;
  onOpenSleepTimer?: () => void;
  sleepTimerRemaining?: number | null;
}

const formatTime = (sec: number): string => {
  if (isNaN(sec) || sec < 0) return '0:00';
  const minutes = Math.floor(sec / 60);
  const seconds = Math.floor(sec % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
  status,
  metadata,
  radioHiss,
  rainSound,
  onToggleRadioHiss,
  onToggleRainSound,
  onOpenAdmin,
  onOpenStations,
  onOpenSleepTimer,
  sleepTimerRemaining,
}) => {
  const [isAmbientModalOpen, setIsAmbientModalOpen] = useState(false);
  const [localVolume, setLocalVolume] = useState<number>(radioController.getVolume());
  const [isMuted, setIsMuted] = useState<boolean>(radioController.isMuted());
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekValue, setSeekValue] = useState<number>(0);

  const isPlaying = status === 'playing';

  const handleTogglePlay = () => {
    radioController.togglePlay();
  };

  const handlePrev = () => {
    radioController.previous();
  };

  const handleNext = () => {
    radioController.next();
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSeeking(true);
    setSeekValue(parseFloat(e.target.value));
  };

  const handleSeekCommit = () => {
    setIsSeeking(false);
    radioController.seekTo(seekValue);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setLocalVolume(val);
    radioController.setVolume(val);
    if (val > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const handleToggleMute = () => {
    radioController.toggleMute();
    setIsMuted(radioController.isMuted());
  };

  const currentDisplayTime = isSeeking ? seekValue : metadata.currentTime;
  const progressPercent = metadata.duration > 0 ? (currentDisplayTime / metadata.duration) * 100 : 0;

  return (
    <div
      role="region"
      aria-label="Floating Music Player"
      className="player-viewport-wrapper"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 45,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pointerEvents: 'none',
      }}
    >
      {/* Ambient Sound Popover */}
      <div style={{ pointerEvents: 'auto', position: 'relative', width: '100%', maxWidth: '940px' }}>
        <AmbientSoundModal
          isOpen={isAmbientModalOpen}
          onClose={() => setIsAmbientModalOpen(false)}
          radioHiss={radioHiss}
          rainSound={rainSound}
          onToggleRadio={onToggleRadioHiss}
          onToggleRain={onToggleRainSound}
        />
      </div>

      {/* Main Player Card */}
      <div
        className="glass-panel main-player-card"
        style={{
          pointerEvents: 'auto',
          width: '100%',
          maxWidth: '940px',
          position: 'relative',
        }}
      >
        {/* Top Info & Vinyl Section */}
        <div className="player-top-row" style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: '1 1 50%', minWidth: 0 }}>
          {/* Vinyl Record */}
          <div
            className="vinyl-wrapper"
            style={{
              position: 'relative',
              borderRadius: '50%',
              background: 'radial-gradient(circle, #2d140f 25%, #180b08 30%, #301610 50%, #150906 70%, #200d09 100%)',
              border: '2px solid rgba(255, 240, 208, 0.35)',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'spin 5s linear infinite',
              animationPlayState: isPlaying ? 'running' : 'paused',
              cursor: 'pointer',
              flexShrink: 0,
            }}
            onClick={handleTogglePlay}
            title={isPlaying ? 'Click to Pause' : 'Click to Play'}
          >
            {/* Center Label */}
            <div
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #c85a3a 0%, #a94d32 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Disc size={11} color="#fff" />
            </div>
          </div>

          {/* Title & Metadata */}
          <div className="player-track-meta" style={{ flex: '1 1 auto', minWidth: 0, display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <div className="player-title-line" style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '8px' }}>
              <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                <span
                  className="player-title-text"
                  style={{
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    color: 'var(--cream)',
                    letterSpacing: '0.01em',
                  }}
                  title={metadata.title}
                >
                  {metadata.title}
                </span>
                <span
                  style={{
                    fontSize: '0.76rem',
                    color: 'var(--muted-text)',
                    marginLeft: '8px',
                  }}
                  className="hide-on-compact"
                >
                  {metadata.artist}
                </span>
              </div>

              {/* Desktop inline time display */}
              <div
                className="desktop-time-display"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  color: 'var(--muted-text)',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: isPlaying ? '#4ade80' : '#f59e0b',
                    boxShadow: isPlaying ? '0 0 8px #4ade80' : 'none',
                  }}
                />
                <span style={{ fontWeight: 600, color: 'var(--cream)', letterSpacing: '0.04em' }}>
                  {isPlaying ? 'LIVE FM' : 'FM STANDBY'}
                </span>
              </div>
            </div>

            {/* Subtitle on mobile */}
            <div className="mobile-artist-label" style={{ display: 'none', fontSize: '0.78rem', color: 'var(--muted-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {metadata.artist}
            </div>

            {/* Desktop Seek Bar / Radio Tuning Line */}
            <div className="desktop-seekbar-container" style={{ position: 'relative', width: '100%', height: '14px', display: 'flex', alignItems: 'center' }}>
              <div
                style={{
                  width: '100%',
                  height: '4px',
                  borderRadius: '2px',
                  background: 'rgba(255, 240, 208, 0.15)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: `${((metadata.playlistIndex + 1) / (metadata.totalTracks || 4)) * 100}%`,
                    width: '10px',
                    background: 'var(--terracotta-bright, #c85a3a)',
                    borderRadius: '2px',
                    boxShadow: '0 0 8px #c85a3a',
                    transform: 'translateX(-50%)',
                    transition: 'left 0.4s cubic-bezier(0.2, 0.8, 0.25, 1)',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Quick atmosphere button on mobile top-right */}
          <div className="mobile-ambient-quick-btn" style={{ display: 'none' }}>
            <button
              type="button"
              onClick={() => setIsAmbientModalOpen(!isAmbientModalOpen)}
              className={`glass-pill ${radioHiss || rainSound ? 'active' : ''}`}
              style={{ padding: '6px 10px', fontSize: '0.74rem' }}
            >
              <Sliders size={13} />
            </button>
          </div>
        </div>

        {/* Mobile Full-Width Scrubber & Dual Timestamps (iOS Lockscreen style) */}
        <div className="mobile-scrub-section" style={{ display: 'none', width: '100%', flexDirection: 'column', gap: '5px' }}>
          <input
            type="range"
            min={0}
            max={metadata.duration || 100}
            step={1}
            value={currentDisplayTime}
            onChange={handleSeekChange}
            onMouseUp={handleSeekCommit}
            onTouchEnd={handleSeekCommit}
            disabled={metadata.duration <= 0}
            aria-label="Seek track position"
            style={{
              width: '100%',
              height: '5px',
              appearance: 'none',
              WebkitAppearance: 'none',
              background: `linear-gradient(to right, #c85a3a 0%, #c85a3a ${progressPercent}%, rgba(255, 240, 208, 0.22) ${progressPercent}%, rgba(255, 240, 208, 0.22) 100%)`,
              borderRadius: '3px',
              cursor: metadata.duration > 0 ? 'pointer' : 'default',
              outline: 'none',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--muted-text)' }}>
            <span>{formatTime(currentDisplayTime)}</span>
            <span>{metadata.duration > 0 ? formatTime(metadata.duration) : '--:--'}</span>
          </div>
        </div>

        {/* Transport & Audio Controls */}
        <div className="player-controls-row" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          {/* Previous Video Button */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous track"
            title="Previous track"
            className="player-prev-btn"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--cream)',
              padding: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              transition: 'transform 0.15s ease, color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--cream)')}
          >
            <SkipBack size={20} />
          </button>

          {/* Primary Play/Pause Button */}
          <button
            type="button"
            onClick={handleTogglePlay}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            title={isPlaying ? 'Pause' : 'Play'}
            className="player-main-play-btn"
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: 'var(--cream)',
              border: 'none',
              color: 'var(--espresso-dark)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.35), 0 0 14px rgba(255, 240, 208, 0.35)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 240, 208, 0.45)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.35), 0 0 14px rgba(255, 240, 208, 0.35)';
            }}
          >
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" style={{ marginLeft: '2px' }} />}
          </button>

          {/* Next Video Button */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next track"
            title="Next track"
            className="player-next-btn"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--cream)',
              padding: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              transition: 'transform 0.15s ease, color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--cream)')}
          >
            <SkipForward size={20} />
          </button>

          {/* Volume Control (Desktop / Tablet) */}
          <div
            className="hide-on-mobile volume-control-wrapper"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '4px' }}
          >
            <button
              type="button"
              onClick={handleToggleMute}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
              title={isMuted ? 'Unmute' : 'Mute'}
              style={{
                background: 'transparent',
                border: 'none',
                color: isMuted ? 'var(--terracotta-bright)' : 'var(--muted-text)',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {isMuted || localVolume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <input
              type="range"
              min={0}
              max={100}
              value={isMuted ? 0 : localVolume}
              onChange={handleVolumeChange}
              aria-label="Master volume"
              style={{
                width: '65px',
                accentColor: 'var(--cream)',
                cursor: 'pointer',
                height: '4px',
              }}
            />
          </div>

          {/* Stations Button */}
          {onOpenStations && (
            <button
              type="button"
              onClick={onOpenStations}
              aria-label="Open 11 Hindi radio stations"
              title="Browse all 11 stations"
              className="glass-pill"
              style={{
                padding: '6px 12px',
                fontSize: '0.78rem',
                gap: '6px',
              }}
            >
              <Radio size={13} color="var(--terracotta-bright)" />
              <span className="hide-on-compact">Stations</span>
            </button>
          )}

          {/* Sleep Timer Button */}
          {onOpenSleepTimer && (
            <button
              type="button"
              onClick={onOpenSleepTimer}
              aria-label="Set sleep timer"
              title="Set radio sleep timer"
              className={`glass-pill ${sleepTimerRemaining ? 'active' : ''}`}
              style={{
                padding: '6px 12px',
                fontSize: '0.78rem',
                gap: '6px',
              }}
            >
              <Moon size={13} />
              <span className="hide-on-compact">
                {sleepTimerRemaining ? `${Math.ceil(sleepTimerRemaining / 60)}m` : 'Sleep'}
              </span>
            </button>
          )}

          {/* Ambient Atmosphere Button on Desktop */}
          <button
            type="button"
            onClick={() => setIsAmbientModalOpen(!isAmbientModalOpen)}
            aria-label="Ambient sound controls"
            title="Ambient radio hiss & monsoon sound"
            className={`glass-pill desktop-ambient-btn ${radioHiss || rainSound ? 'active' : ''}`}
            style={{
              padding: '6px 12px',
              fontSize: '0.78rem',
              gap: '6px',
            }}
          >
            <Sliders size={13} />
            <span className="hide-on-compact">Sounds</span>
          </button>
        </div>
      </div>

      {/* Footer Contact Link */}
      <footer
        style={{
          marginTop: '6px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          pointerEvents: 'auto',
          fontSize: '0.72rem',
          color: 'var(--subtle-text)',
        }}
      >
        <Mail size={11} style={{ color: 'var(--terracotta-bright)' }} />
        <span>contact: </span>
        <a
          href="mailto:singhyashwant559@gmail.com"
          style={{
            color: 'var(--cream)',
            textDecoration: 'none',
            borderBottom: '1px dotted rgba(255, 240, 208, 0.4)',
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--cream)')}
        >
          singhyashwant559@gmail.com
        </a>

        {onOpenAdmin && (
          <button
            type="button"
            onClick={onOpenAdmin}
            title="Secret Admin Control Room"
            aria-label="Admin Control Room"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'rgba(255, 240, 208, 0.28)',
              cursor: 'pointer',
              padding: '2px 5px',
              display: 'inline-flex',
              alignItems: 'center',
              borderRadius: '4px',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--cream)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 240, 208, 0.28)')}
          >
            <Lock size={10} />
          </button>
        )}
      </footer>

      <style>{`
        @keyframes spin {
          100% {
            transform: rotate(360deg);
          }
        }
        .player-viewport-wrapper {
          padding: 0 20px 14px 20px;
        }
        .main-player-card {
          border-radius: var(--radius-full);
          padding: 10px 22px;
          display: flex;
          alignItems: center;
          justify-content: space-between;
          gap: 14px;
        }
        .vinyl-wrapper {
          width: 46px;
          height: 46px;
          min-width: 46px;
        }

        @media (max-width: 768px) {
          .hide-on-compact {
            display: none !important;
          }
        }

        /* --- iOS Lockscreen Style Mobile Player Card --- */
        @media (max-width: 640px) {
          .player-viewport-wrapper {
            bottom: calc(14px + env(safe-area-inset-bottom, 0px)) !important;
            padding: 0 16px !important;
          }
          .main-player-card {
            flex-direction: column !important;
            border-radius: 26px !important;
            padding: 16px 18px !important;
            gap: 12px !important;
            max-width: 440px !important;
            background: rgba(30, 14, 10, 0.78) !important;
            backdrop-filter: blur(28px) saturate(180%) !important;
            -webkit-backdrop-filter: blur(28px) saturate(180%) !important;
            border: 1px solid rgba(255, 240, 208, 0.3) !important;
            box-shadow: 0 16px 45px rgba(0, 0, 0, 0.7), 0 0 20px rgba(255, 240, 208, 0.12) !important;
          }
          .vinyl-wrapper {
            width: 52px !important;
            height: 52px !important;
            min-width: 52px !important;
          }
          .player-title-text {
            font-size: 1.02rem !important;
          }
          .desktop-time-display,
          .desktop-seekbar-container,
          .desktop-ambient-btn,
          .volume-control-wrapper {
            display: none !important;
          }
          .mobile-artist-label {
            display: block !important;
          }
          .mobile-ambient-quick-btn {
            display: block !important;
          }
          .mobile-scrub-section {
            display: flex !important;
          }
          .player-controls-row {
            width: 100% !important;
            justifyContent: center !important;
            gap: 28px !important;
            padding-top: 2px !important;
          }
          .player-main-play-btn {
            width: 52px !important;
            height: 52px !important;
          }
          .player-prev-btn, .player-next-btn {
            padding: 8px !important;
          }
        }
      `}</style>
    </div>
  );
};
