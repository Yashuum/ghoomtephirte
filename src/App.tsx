import { useState, useEffect, useCallback } from 'react';
import { SceneMode, PlaybackStatus, TrackMetadata } from './types';
import { ytController } from './audio/youtubePlayer';
import { ambientAudio } from './audio/ambientAudio';
import { SceneBackground } from './components/SceneBackground';
import { HindiHeadline } from './components/HindiHeadline';
import { CursorEffects } from './components/CursorEffects';
import { TopNavigation } from './components/TopNavigation';
import { AtmosphereController } from './components/AtmosphereController';
import { JourneyCard } from './components/JourneyCard';
import { MusicPlayer } from './components/MusicPlayer';
import { InstallDrawer } from './components/InstallDrawer';
import { LoadingScreen } from './components/LoadingScreen';
import { AdminModal } from './components/AdminModal';
import { WifiOff, AlertCircle } from 'lucide-react';

export function App() {
  // Scene mode: 'day' | 'night' | 'rain'
  const [scene, setScene] = useState<SceneMode>('day');
  const [radioHiss, setRadioHiss] = useState<boolean>(false);
  const [rainSound, setRainSound] = useState<boolean>(false);

  // Journey card visibility
  const [isJourneyCardVisible, setIsJourneyCardVisible] = useState<boolean>(true);

  // Install Drawer
  const [isInstallOpen, setIsInstallOpen] = useState<boolean>(false);

  // Secret Admin Control Room
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);

  // Error and offline toast
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);

  // Playback state
  const [playbackStatus, setPlaybackStatus] = useState<PlaybackStatus>('unstarted');
  const [trackMetadata, setTrackMetadata] = useState<TrackMetadata>(ytController.getMetadata());

  // Mouse position for subtle parallax
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0.5, y: 0.5 });

  // Initialize YouTube Controller
  useEffect(() => {
    ytController.init('yt-player-element');

    const unsubscribeStatus = ytController.onStateChange((status) => {
      setPlaybackStatus(status);
    });

    const unsubscribeTrack = ytController.onTrackChange((meta) => {
      setTrackMetadata(meta);
    });

    const unsubscribeError = ytController.onError((err) => {
      setErrorMessage(err);
      setTimeout(() => setErrorMessage(null), 7000);
    });

    return () => {
      unsubscribeStatus();
      unsubscribeTrack();
      unsubscribeError();
      ytController.destroy();
    };
  }, []);

  // Online / Offline detection
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Pointer position tracking for enhanced parallax
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      setMousePos({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, []);

  // Listen to #admin hash or keyboard shortcut (Ctrl+Shift+A) to open Secret Control Room
  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash.toLowerCase() === '#admin') {
        setIsAdminOpen(true);
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setIsAdminOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', checkHash);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Scene Selection: smoothly switches to Day, Night, or Rain
  const handleSelectScene = useCallback((mode: SceneMode) => {
    setScene(mode);
    if (mode === 'rain') {
      setRainSound(true);
      ambientAudio.setRainSound(true);
    } else {
      if (rainSound) {
        setRainSound(false);
        ambientAudio.setRainSound(false);
      }
    }
  }, [rainSound]);

  const handleResetAtmosphere = useCallback(() => {
    setScene('day');
    setRainSound(false);
    setRadioHiss(false);
    ambientAudio.setRainSound(false);
    ambientAudio.setRadioHiss(false);
  }, []);

  // Ambient sound handlers
  const handleToggleRadioHiss = useCallback(() => {
    setRadioHiss((prev) => {
      const next = !prev;
      ambientAudio.setRadioHiss(next);
      return next;
    });
  }, []);

  const handleToggleRainSound = useCallback(() => {
    setRainSound((prev) => {
      const next = !prev;
      ambientAudio.setRainSound(next);
      if (next && scene !== 'rain') {
        setScene('rain');
      }
      return next;
    });
  }, [scene]);

  // Start the journey CTA
  const handleStartJourney = useCallback(() => {
    setIsJourneyCardVisible(false);
    ytController.play();
  }, []);

  const isPlaying = playbackStatus === 'playing';

  return (
    <div
      className={`app-viewport ${scene}`}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100dvh',
        overflow: 'hidden',
      }}
    >
      {/* 0. 4-Second Journey Prep Loading Screen with Disclaimer */}
      <LoadingScreen />

      {/* 1. Cinematic Background with 3 real views (Day, Night, Rain) & car driving motion */}
      <SceneBackground scene={scene} mousePos={mousePos} isPlaying={isPlaying} />

      {/* 2. Large Hindi Cinema Typography: “घूमते फिरते” */}
      <HindiHeadline scene={scene} mousePos={mousePos} />

      {/* 3. Desktop Cursor Glow & Follower */}
      <CursorEffects lighting={scene === 'night' ? 'night' : 'day'} />

      {/* 4. Floating Top Navigation Bar (YouTube, Install) */}
      <TopNavigation
        onOpenInstall={() => setIsInstallOpen(true)}
        isInstallOpen={isInstallOpen}
      />

      {/* 5. Atmosphere Controller: ☀ Day | ☾ Night | ☔ Rain */}
      <div
        className="atmosphere-controller-wrapper"
        style={{
          position: 'fixed',
          top: '64px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 35,
          pointerEvents: 'auto',
          animation: 'fadeIn 0.5s ease',
        }}
      >
        <AtmosphereController
          scene={scene}
          onSelectScene={handleSelectScene}
          onReset={handleResetAtmosphere}
        />
      </div>

      {/* 6. Centered Nostalgic Road Trip Welcome Card */}
      {isJourneyCardVisible && (
        <div
          className="journey-card-positioner"
          style={{
            position: 'fixed',
            top: '52%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 30,
            maxWidth: '420px',
            width: 'calc(100% - 36px)',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <JourneyCard
            onStartJourney={handleStartJourney}
            onDismiss={() => setIsJourneyCardVisible(false)}
          />
        </div>
      )}

      {/* 7. Offline or Error Toast */}
      {(isOffline || errorMessage) && (
        <div
          className="glass-panel"
          style={{
            position: 'fixed',
            top: '124px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 50,
            padding: '10px 18px',
            borderRadius: 'var(--radius-full)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: isOffline ? 'rgba(169, 77, 50, 0.88)' : 'rgba(45, 20, 15, 0.92)',
            border: '1px solid rgba(255, 240, 208, 0.4)',
            color: '#fff',
            fontSize: '0.82rem',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
            animation: 'fadeIn 0.3s ease',
          }}
        >
          {isOffline ? <WifiOff size={16} /> : <AlertCircle size={16} />}
          <span>{isOffline ? 'You are offline. Application shell & sounds are active.' : errorMessage}</span>
        </div>
      )}

      {/* 8. Floating Music Player (iOS Lockscreen card style on mobile) */}
      <MusicPlayer
        status={playbackStatus}
        metadata={trackMetadata}
        radioHiss={radioHiss}
        rainSound={rainSound}
        onToggleRadioHiss={handleToggleRadioHiss}
        onToggleRainSound={handleToggleRainSound}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* 9. Install PWA Drawer */}
      <InstallDrawer
        isOpen={isInstallOpen}
        onClose={() => setIsInstallOpen(false)}
      />

      {/* 10. Secret Admin Playlist Control Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => {
          setIsAdminOpen(false);
          if (window.location.hash.toLowerCase() === '#admin') {
            history.replaceState(null, '', window.location.pathname);
          }
        }}
      />

      {/* 11. Hidden YouTube Player Container for API audio stream */}
      <div
        style={{
          position: 'fixed',
          top: '-9999px',
          left: '-9999px',
          width: '200px',
          height: '200px',
          pointerEvents: 'none',
          opacity: 0,
          visibility: 'hidden',
        }}
      >
        <div id="yt-player-element" />
      </div>

      {/* Responsive adjustments for mobile */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translate(-50%, -8px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        @media (max-width: 680px) {
          .atmosphere-controller-wrapper {
            top: 52px !important;
            left: 14px !important;
            transform: none !important;
          }
          .journey-card-positioner {
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            width: calc(100% - 28px) !important;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
