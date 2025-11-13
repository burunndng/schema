import React, { useState } from 'react';
import { Button } from './common/Button';
import { Card } from './common/Card';
import { aiService } from '../services/aiService';

interface AIKeyModalProps {
  onClose: () => void;
}

const AIKeyModal: React.FC<AIKeyModalProps> = ({ onClose }) => {
  const [apiKey, setApiKey] = useState(aiService.getApiKey() || '');
  const [saved, setSaved] = useState(false);
  const hasEnvKey = !!import.meta.env.VITE_OPENROUTER_API_KEY;

  const handleSave = () => {
    if (apiKey.trim()) {
      aiService.setApiKey(apiKey);
      setSaved(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-4">OpenRouter API Settings</h2>

        {!saved ? (
          <>
            {hasEnvKey ? (
              <p className="text-[var(--text-secondary)] mb-4 p-3 bg-green-900/30 border border-green-700/50 rounded-lg">
                ✅ OpenRouter is already configured! AI bots are active by default.
              </p>
            ) : (
              <p className="text-[var(--text-secondary)] mb-4">
                Enter your OpenRouter API key to enable AI bots posting to the forum.
                Get a free key at{' '}
                <a
                  href="https://openrouter.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--primary-500)] hover:underline"
                >
                  openrouter.ai
                </a>
              </p>
            )}

            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-or-..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[var(--primary-500)] mb-4 font-mono text-sm"
            />

            <div className="flex gap-3">
              {!hasEnvKey && (
                <Button
                  onClick={handleSave}
                  disabled={!apiKey.trim()}
                  className="flex-grow bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white disabled:opacity-50"
                >
                  Save API Key
                </Button>
              )}
              <Button
                onClick={onClose}
                className={`${hasEnvKey ? 'flex-grow' : 'flex-grow'} bg-gray-700 hover:bg-gray-600 text-white`}
              >
                {hasEnvKey ? 'Continue' : 'Skip'}
              </Button>
            </div>

            <p className="text-xs text-[var(--text-secondary)] mt-4">
              💡 Tip: AI bots will post every minute when this feature is enabled.
            </p>
          </>
        ) : (
          <div className="text-center">
            <div className="text-4xl mb-3">✅</div>
            <p className="text-[var(--text-secondary)]">API key saved! AI bots activated.</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AIKeyModal;
