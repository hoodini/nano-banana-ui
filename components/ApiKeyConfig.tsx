'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Key, Save, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ApiKeyConfigProps {
  onApiKeySet: (key: string) => void;
}

export default function ApiKeyConfig({ onApiKeySet }: ApiKeyConfigProps) {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Check if API key exists in localStorage
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
      setApiKey(savedKey);
      setIsSaved(true);
      onApiKeySet(savedKey);
    } else {
      setShowModal(true);
    }
  }, [onApiKeySet]);

  const handleSaveKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('gemini_api_key', apiKey.trim());
      setIsSaved(true);
      setShowModal(false);
      onApiKeySet(apiKey.trim());
    }
  };

  const handleUpdateKey = () => {
    setShowModal(true);
    setIsSaved(false);
  };

  if (!showModal && isSaved) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <CheckCircle2 className="text-green-400 animate-glow-pulse" size={20} />
          <span className="text-sm text-[var(--foreground-muted)]">API Key Configured</span>
        </div>
        <button
          onClick={handleUpdateKey}
          className="btn-secondary text-xs py-2 px-4"
        >
          Update Key
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4 md:p-6"
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-card p-5 sm:p-6 md:p-8 max-w-2xl w-full relative overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--neon-cyan)] via-[var(--neon-purple)] to-[var(--neon-pink)]" />

        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-br from-[var(--neon-cyan)]/20 to-[var(--neon-purple)]/20 flex-shrink-0">
            <Key className="text-[var(--neon-cyan)]" size={20} />
          </div>
          <div className="min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold" style={{ fontFamily: 'Orbitron, monospace' }}>
              Configure API Key
            </h2>
            <p className="text-xs sm:text-sm text-[var(--foreground-muted)]">
              Enter your Google AI Studio API key to get started
            </p>
          </div>
        </div>

        <div className="mb-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <div className="flex gap-2 items-start">
            <AlertCircle className="text-blue-400 flex-shrink-0 mt-0.5" size={18} />
            <div className="text-sm text-blue-300">
              <p className="font-semibold mb-1">How to get your API key:</p>
              <ol className="list-decimal list-inside space-y-1 text-blue-200">
                <li>Visit <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--neon-cyan)]">Google AI Studio</a></li>
                <li>Sign in with your Google account</li>
                <li>Create a new API key for Gemini</li>
                <li>Copy and paste it below</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIza..."
              className="w-full pr-12"
              autoFocus
            />
            <button
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)] hover:text-[var(--neon-cyan)] transition-colors"
            >
              {showKey ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="text-xs text-[var(--foreground-muted)] p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <strong className="text-yellow-400">Security Note:</strong> Your API key is stored locally in your browser
            and never sent to any server except Google's Gemini API.
          </div>

          <button
            onClick={handleSaveKey}
            disabled={!apiKey.trim()}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={20} />
            Save & Continue
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-white/10 text-center">
          <p className="text-xs text-[var(--foreground-muted)]">
            Created by <a href="https://yuv.ai" target="_blank" rel="noopener noreferrer" className="text-[var(--neon-cyan)] hover:underline">Yuval Avidani</a> •
            <a href="https://linktr.ee/yuvai" target="_blank" rel="noopener noreferrer" className="text-[var(--neon-purple)] hover:underline ml-1">@yuvalav</a>
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
