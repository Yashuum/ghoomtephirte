import React, { useEffect } from 'react';
import { X, ExternalLink, Disc, Sparkles } from 'lucide-react';
import { PlaylistMood } from '../types';
import { PLAYLIST_URL } from '../audio/youtubePlayer';

interface PlaylistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CURATED_MOODS: PlaylistMood[] = [
  {
    id: 'ghoomte-phirte-official',
    title: 'Ghoomte Phirte (Official)',
    subtitle: 'Kishore Kumar, Mohd. Rafi, Lata Mangeshkar',
    era: 'Featured Soundscape',
    description: 'The hand-picked nostalgic road trip collection for driving through old Indian streets.',
    color: 'linear-gradient(135deg, #a94d32 0%, #2d140f 100%)',
    icon: 'car',
    targetUrl: PLAYLIST_URL,
    isMain: true,
  },
  {
    id: 'old-classics',
    title: 'Old Hindi Classics',
    subtitle: 'Golden Era Nostalgia (1960s – 1970s)',
    era: '1960 – 1979',
    description: 'Timeless melodies that echoed from radio sets in roadside chai stalls and Ambassador cars.',
    color: 'linear-gradient(135deg, #b8860b 0%, #3e2723 100%)',
    icon: 'disc',
    targetUrl: 'https://www.youtube.com/results?search_query=old+hindi+classics+road+trip+60s+70s',
  },
  {
    id: 'evening-drive',
    title: 'Evening Drive',
    subtitle: 'R.D. Burman, Kishore Kumar, Asha Bhosle',
    era: 'Breezy Retro Grooves',
    description: 'Upbeat horn sections, flute solos, and rhythmic basslines as street lanterns flicker to life.',
    color: 'linear-gradient(135deg, #d35400 0%, #1f1105 100%)',
    icon: 'sunset',
    targetUrl: 'https://www.youtube.com/results?search_query=rd+burman+retro+drive+songs',
  },
  {
    id: 'monsoon-memories',
    title: 'Monsoon Memories',
    subtitle: 'Rimjhim Gire Saawan & Rain Melodies',
    era: 'Rainy Nostalgia',
    description: 'Romantic drenched streets, steam rising from fresh tar, and wipers swishing in rhythm.',
    color: 'linear-gradient(135deg, #2980b9 0%, #1a252f 100%)',
    icon: 'rain',
    targetUrl: 'https://www.youtube.com/results?search_query=monsoon+retro+hindi+rain+songs',
  },
  {
    id: 'golden-hour',
    title: 'Golden Hour Sunset',
    subtitle: 'Warm Acoustic Retro Melodies',
    era: 'Chai & Dusk',
    description: 'Sunlight filtering through yellow dust, temple bells fading, and peaceful acoustic guitars.',
    color: 'linear-gradient(135deg, #e67e22 0%, #4a235a 100%)',
    icon: 'sun',
    targetUrl: 'https://www.youtube.com/results?search_query=retro+bollywood+golden+hour+acoustic',
  },
  {
    id: 'quiet-roads',
    title: 'Quiet Roads & Ghazals',
    subtitle: 'Jagjit Singh, Mehdi Hassan, Pankaj Udhas',
    era: 'Soulful & Contemplative',
    description: 'Empty highway stretches under starry skies with deeply moving poetry and harmonium tunes.',
    color: 'linear-gradient(135deg, #5b2c6f 0%, #17202a 100%)',
    icon: 'moon',
    targetUrl: 'https://www.youtube.com/results?search_query=jagjit+singh+ghazals+night+drive',
  },
];

export const PlaylistDrawer: React.FC<PlaylistDrawerProps> = ({ isOpen, onClose }) => {
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

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Curated Vintage Playlists"
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
              <Disc size={18} style={{ color: 'var(--terracotta-bright)' }} />
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--cream)' }}>
                Vintage Moods
              </h2>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--muted-text)' }}>
              Curated playlists inspired by classic Indian road trips
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close playlists drawer"
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

        {/* Playlist Cards List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: '1 1 auto' }}>
          {CURATED_MOODS.map((mood) => (
            <a
              key={mood.id}
              href={mood.targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: 'none',
                background: 'rgba(35, 17, 13, 0.65)',
                border: mood.isMain ? '1px solid rgba(255, 240, 208, 0.45)' : '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                display: 'flex',
                gap: '14px',
                transition: 'all 0.25s ease',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 240, 208, 0.6)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = mood.isMain ? 'rgba(255, 240, 208, 0.45)' : 'var(--glass-border)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Cassette / Vinyl Art Box */}
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  minWidth: '56px',
                  borderRadius: '12px',
                  background: mood.color,
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.35)',
                }}
              >
                <Disc size={26} />
              </div>

              {/* Text Info */}
              <div style={{ flex: '1 1 auto', minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                  <h3
                    style={{
                      fontSize: '0.98rem',
                      fontWeight: 600,
                      color: 'var(--cream)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {mood.title}
                  </h3>
                  {mood.isMain ? (
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        padding: '2px 8px',
                        borderRadius: '999px',
                        background: 'rgba(200, 90, 58, 0.6)',
                        color: '#fff',
                        letterSpacing: '0.04em',
                        flexShrink: 0,
                      }}
                    >
                      Active
                    </span>
                  ) : (
                    <ExternalLink size={13} style={{ color: 'var(--subtle-text)', flexShrink: 0 }} />
                  )}
                </div>

                <div
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--terracotta-bright)',
                    fontWeight: 500,
                    marginTop: '2px',
                  }}
                >
                  {mood.era}
                </div>

                <p
                  style={{
                    fontSize: '0.78rem',
                    color: 'var(--muted-text)',
                    lineHeight: 1.4,
                    marginTop: '6px',
                  }}
                >
                  {mood.description}
                </p>
              </div>
            </a>
          ))}
        </div>

        {/* Footer Note */}
        <div
          style={{
            marginTop: '20px',
            padding: '12px 14px',
            background: 'rgba(255, 240, 208, 0.05)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 240, 208, 0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <Sparkles size={16} style={{ color: 'var(--terracotta-bright)', flexShrink: 0 }} />
          <p style={{ fontSize: '0.74rem', color: 'var(--muted-text)', lineHeight: 1.4 }}>
            Clicking an external mood searches authentic verified retro recordings on YouTube in a new tab.
          </p>
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
