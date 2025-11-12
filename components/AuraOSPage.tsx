import React, { useState, useEffect } from 'react';
import { Card } from './common/Card';
import { Button } from './common/Button';

interface AuraOSPageProps {
  onNavigate: (page: 'home' | 'about' | 'services' | 'pricing' | 'testimonials' | 'forum' | 'discussions' | 'tests' | 'auraos') => void;
}

export const AuraOSPage: React.FC<AuraOSPageProps> = ({ onNavigate }) => {
  const [iframeAvailable, setIframeAvailable] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to load iframe and detect if blocked
    const timer = setTimeout(() => {
      const iframe = document.querySelector('#auraos-iframe') as HTMLIFrameElement;
      if (iframe && !iframe.contentDocument && !iframe.contentWindow) {
        setIframeAvailable(false);
      }
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--bg-primary)] via-[var(--bg-secondary)] to-[var(--bg-primary)] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-500)] to-purple-400 mb-3">
            ✨ Aura OS ✨
          </h1>
          <p className="text-xl text-[var(--text-secondary)] mb-2">
            Integral Life Practice Framework
          </p>
          <p className="text-[var(--text-secondary)]">
            Complementary wisdom for holistic personal development
          </p>
        </div>

        {/* Bridge Content */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="border-l-4 border-[var(--primary-500)]">
            <div className="text-3xl mb-3">🧠</div>
            <h3 className="font-bold text-white mb-2">Schema Therapy</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Explores deep emotional patterns and unmet needs, healing the wounds that shape our behaviors.
            </p>
          </Card>

          <Card className="border-t-4 border-[var(--accent-500)] md:border-t-0 md:border-l-4">
            <div className="text-3xl mb-3">🌀</div>
            <h3 className="font-bold text-white mb-2">Synergy</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Together they form a complete developmental system—heal the past while building an integrated future self.
            </p>
          </Card>

          <Card className="border-l-4 border-purple-500">
            <div className="text-3xl mb-3">🔮</div>
            <h3 className="font-bold text-white mb-2">Integral Practice</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Honors all dimensions of human existence—body, mind, spirit, and cultural evolution (Wilber's Four Quadrants).
            </p>
          </Card>
        </div>

        {/* Main Embedding Section */}
        {iframeAvailable && loading ? (
          <div className="mb-8">
            <Card className="bg-[var(--card-bg)]/50 backdrop-blur border-2 border-[var(--accent-500)]/30">
              <div className="text-center py-12">
                <div className="inline-block animate-pulse">
                  <div className="text-5xl mb-3">✨</div>
                  <p className="text-white font-semibold">Loading Aura OS...</p>
                </div>
              </div>
            </Card>
          </div>
        ) : iframeAvailable ? (
          <div className="mb-8">
            <Card className="p-0 overflow-hidden border-2 border-[var(--accent-500)]/30">
              <iframe
                id="auraos-iframe"
                src="https://auraos.space/"
                className="w-full border-none"
                style={{ height: '800px' }}
                title="Aura OS - Integral Life Practice"
                onLoad={() => setLoading(false)}
                onError={() => {
                  setIframeAvailable(false);
                  setLoading(false);
                }}
              />
            </Card>
          </div>
        ) : (
          <div className="mb-12">
            <Card className="bg-gradient-to-br from-[var(--accent-500)]/10 to-purple-500/10 border-2 border-[var(--accent-500)]/50">
              <div className="text-center py-12">
                <div className="text-5xl mb-4">🌌</div>
                <h2 className="text-2xl font-bold text-white mb-4">Aura OS Portal</h2>
                <p className="text-[var(--text-secondary)] mb-6 max-w-xl mx-auto">
                  Explore Integral Life Practice and the wisdom of Ken Wilber's transformative framework for holistic human development.
                </p>
                <div className="space-y-3">
                  <p className="text-sm text-[var(--text-secondary)] mb-6">
                    <strong>How it complements Burundanga:</strong> While Schema Therapy helps you heal past wounds and understand emotional patterns, Integral Life Practice provides a comprehensive map for developing all dimensions of yourself—physical, emotional, intellectual, and spiritual.
                  </p>
                  <a
                    href="https://auraos.space/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block"
                  >
                    <Button className="bg-gradient-to-r from-[var(--accent-500)] to-purple-500 hover:from-[var(--accent-600)] hover:to-purple-600 text-white px-8">
                      Visit Aura OS →
                    </Button>
                  </a>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Framework Info */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card className="border-l-4 border-blue-500">
            <h3 className="text-xl font-bold text-white mb-4">🔷 Four Quadrants of Integral Practice</h3>
            <ul className="space-y-3 text-[var(--text-secondary)] text-sm">
              <li className="flex gap-3">
                <span className="text-blue-400 font-bold">I</span>
                <span><strong>Interior-Individual:</strong> Consciousness, emotions, shadow work (Schema Therapy fits here)</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-400 font-bold">We</span>
                <span><strong>Interior-Collective:</strong> Relationships, cultural values, shared meaning</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-400 font-bold">It</span>
                <span><strong>Exterior-Individual:</strong> Body, behavior, physical practices</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-400 font-bold">Its</span>
                <span><strong>Exterior-Collective:</strong> Systems, environment, culture</span>
              </li>
            </ul>
          </Card>

          <Card className="border-l-4 border-purple-500">
            <h3 className="text-xl font-bold text-white mb-4">🔮 Your Integrated Journey</h3>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-4">
              Use <strong>Burundanga's Schema Therapy</strong> to understand and heal your emotional schemas, then integrate that healing into a <strong>broader Integral Practice</strong> that honors all dimensions of your being.
            </p>
            <p className="text-[var(--text-secondary)] text-sm">
              Together, these frameworks offer a path to wholeness—healing what was broken while building what can be elevated.
            </p>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-[var(--primary-500)]/10 to-[var(--accent-500)]/10 border-2 border-[var(--primary-500)]/30">
            <h3 className="text-2xl font-bold text-white mb-4">🌟 Two Paths, One Destination</h3>
            <p className="text-[var(--text-secondary)] mb-6">
              Start your journey of integrated personal development today
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button onClick={() => onNavigate('forum')} className="bg-[var(--primary-500)] hover:bg-[var(--primary-600)]">
                Back to Burundanga Forum
              </Button>
              <a href="https://auraos.space/" target="_blank" rel="noopener noreferrer">
                <Button className="bg-[var(--accent-500)] hover:bg-purple-600">
                  Explore Aura OS
                </Button>
              </a>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
