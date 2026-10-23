import React, { useEffect, useState } from 'react';
import { X, Download, Smartphone, Apple, Monitor, CheckCircle, WifiOff } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface InstallDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallDrawer: React.FC<InstallDrawerProps> = ({ isOpen, onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } catch (err) {
      console.warn('Install prompt error:', err);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Install Ghoomte Phirte Web App"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 60,
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(15, 8, 6, 0.65)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          animation: 'fadeIn 0.3s ease',
        }}
      />

      {/* Slide-in Drawer */}
      <div
        className="glass-panel"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '460px',
          height: '100%',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-10px 0 35px rgba(0, 0, 0, 0.7)',
          animation: 'slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Download size={18} style={{ color: 'var(--terracotta-bright)' }} />
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--cream)' }}>
                Install App
              </h2>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--muted-text)' }}>
              Add Ghoomte Phirte to your home screen for the full immersive drive
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close install drawer"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--subtle-text)',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--cream)';
              e.currentTarget.style.background = 'rgba(255, 240, 208, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--subtle-text)';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* 1-Click Install Button (When Supported) */}
        {deferredPrompt && !isInstalled && (
          <div
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, rgba(200, 90, 58, 0.25) 0%, rgba(45, 20, 15, 0.6) 100%)',
              border: '1px solid rgba(255, 240, 208, 0.35)',
              marginBottom: '20px',
            }}
          >
            <h3 style={{ fontSize: '0.96rem', fontWeight: 600, color: '#fff', marginBottom: '6px' }}>
              Instant Installation
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--muted-text)', marginBottom: '14px' }}>
              Your browser supports one-click PWA installation.
            </p>
            <button
              type="button"
              onClick={handleInstallClick}
              style={{
                width: '100%',
                padding: '10px 16px',
                borderRadius: 'var(--radius-full)',
                background: 'linear-gradient(135deg, #c85a3a 0%, #a94d32 100%)',
                border: '1px solid rgba(255, 240, 208, 0.4)',
                color: '#fff',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <Download size={15} />
              <span>Install to Home Screen</span>
            </button>
          </div>
        )}

        {isInstalled && (
          <div
            style={{
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(74, 222, 128, 0.15)',
              border: '1px solid rgba(74, 222, 128, 0.35)',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <CheckCircle size={18} style={{ color: '#4ade80', flexShrink: 0 }} />
            <span style={{ fontSize: '0.84rem', color: '#4ade80', fontWeight: 500 }}>
              Ghoomte Phirte is already installed as a standalone app on this device!
            </span>
          </div>
        )}

        {/* Step-by-Step Device Guidance */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: '1 1 auto' }}>
          {/* Android */}
          <div
            style={{
              background: 'rgba(35, 17, 13, 0.65)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Smartphone size={18} style={{ color: 'var(--terracotta-bright)' }} />
              <h3 style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--cream)' }}>
                Android (Chrome, Edge, Samsung)
              </h3>
            </div>
            <ol style={{ paddingLeft: '20px', fontSize: '0.8rem', color: 'var(--muted-text)', lineHeight: 1.6 }}>
              <li>Open the browser menu (<strong>⋮</strong> three dots at top-right).</li>
              <li>Tap <strong>Install app</strong> or <strong>Add to Home screen</strong>.</li>
              <li>Confirm and launch directly from your home screen.</li>
            </ol>
          </div>

          {/* iOS Safari */}
          <div
            style={{
              background: 'rgba(35, 17, 13, 0.65)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Apple size={18} style={{ color: 'var(--cream)' }} />
              <h3 style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--cream)' }}>
                iPhone & iPad (Safari)
              </h3>
            </div>
            <ol style={{ paddingLeft: '20px', fontSize: '0.8rem', color: 'var(--muted-text)', lineHeight: 1.6 }}>
              <li>Open this website in <strong>Apple Safari</strong>.</li>
              <li>Tap the <strong>Share</strong> button (box with upward arrow).</li>
              <li>Scroll down and tap <strong>Add to Home Screen</strong>.</li>
              <li>Tap <strong>Add</strong> in the top-right corner.</li>
            </ol>
          </div>

          {/* Desktop Chrome / Edge */}
          <div
            style={{
              background: 'rgba(35, 17, 13, 0.65)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Monitor size={18} style={{ color: 'var(--olive)' }} />
              <h3 style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--cream)' }}>
                Desktop (Chrome, Edge, Brave)
              </h3>
            </div>
            <ol style={{ paddingLeft: '20px', fontSize: '0.8rem', color: 'var(--muted-text)', lineHeight: 1.6 }}>
              <li>Look for the <strong>Install</strong> icon in the right side of the address bar.</li>
              <li>Or click the browser menu (<strong>⋮</strong>) and choose <strong>Install Ghoomte Phirte</strong>.</li>
              <li>Enjoy in full-screen windowed mode without browser tabs.</li>
            </ol>
          </div>

          {/* Offline Information */}
          <div
            style={{
              padding: '12px 14px',
              background: 'rgba(255, 240, 208, 0.05)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 240, 208, 0.1)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              marginTop: '8px',
            }}
          >
            <WifiOff size={16} style={{ color: 'var(--subtle-text)', marginTop: '2px', flexShrink: 0 }} />
            <p style={{ fontSize: '0.74rem', color: 'var(--muted-text)', lineHeight: 1.4 }}>
              <strong>Offline Caching:</strong> The scene, ambient sounds, controls, and styles are cached for instant offline loading. Note that YouTube video streaming requires internet connectivity.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};
