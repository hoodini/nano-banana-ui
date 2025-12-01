'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, Save, Eye, EyeOff, AlertCircle, CheckCircle2, X, Loader2 } from 'lucide-react';

interface ApiKeyConfigProps {
  onApiKeySet: (key: string) => void;
}

export default function ApiKeyConfig({ onApiKeySet }: ApiKeyConfigProps) {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    // Check if API key exists in localStorage
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
      setApiKey(savedKey);
      setIsSaved(true);
      onApiKeySet(savedKey);
    }
    // Don't force modal if no key exists - let user explore first
  }, [onApiKeySet]);

  const validateApiKey = async (key: string): Promise<boolean> => {
    // Basic format validation for Google API keys
    if (!key.startsWith('AIza') || key.length < 39) {
      setValidationError('Invalid API key format. Google API keys start with "AIza" and are at least 39 characters.');
      return false;
    }

    // Test the API key with a simple request
    setIsValidating(true);
    setValidationError('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: 'test',
          images: [],
          config: {},
          apiKey: key,
        }),
      });

      const data = await response.json();

      if (response.ok || data.error?.includes('image data')) {
        // If we get this far, the API key is valid (even if image generation failed for other reasons)
        return true;
      } else if (data.error?.toLowerCase().includes('api key') ||
        data.error?.toLowerCase().includes('invalid') ||
        data.details?.toLowerCase().includes('api_key_invalid')) {
        setValidationError('Invalid API key. Please check your key and try again.');
        return false;
      } else {
        // Other errors mean the key is valid but something else went wrong
        return true;
      }
    } catch (error) {
      setValidationError('Could not validate API key. Please try again.');
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const handleSaveKey = async () => {
    const trimmedKey = apiKey.trim();
    if (!trimmedKey) {
      setValidationError('Please enter an API key');
      return;
    }

    const isValid = await validateApiKey(trimmedKey);

    if (isValid) {
      localStorage.setItem('gemini_api_key', trimmedKey);
      setIsSaved(true);
      setShowModal(false);
      onApiKeySet(trimmedKey);
      setValidationError('');
    }
  };

  const handleUpdateKey = () => {
    setShowModal(true);
    setIsSaved(false);
    setValidationError('');
  };

  const handleCloseModal = () => {
    // Only allow closing if there's already a saved key or user hasn't saved yet
    setShowModal(false);
    setValidationError('');
  };

  const handleSkip = () => {
    // Allow user to explore without API key
    setShowModal(false);
  };

  if (!showModal && isSaved) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-4 right-4 z-40 glass-card p-4 flex items-center justify-between gap-4 shadow-2xl max-w-sm"
      >
        <div className="flex items-center gap-3">
          <CheckCircle2 className="text-green-400 animate-glow-pulse" size={20} />
          <span className="text-sm text-[var(--foreground-muted)]">API Key Configured</span>
        </div>
        <button
          onClick={handleUpdateKey}
          className="btn-secondary text-xs py-2 px-4 whitespace-nowrap"
        >
          Update Key
        </button>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4 md:p-6"
          onClick={handleCloseModal}
        >
          <motion.div
            initial={{ y: 50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-card p-6 sm:p-7 md:p-8 max-w-2xl w-full relative overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            {/* Close button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 p-2 rounded-lg bg-[var(--background-elevated)] hover:bg-red-500/20 border border-white/10 hover:border-red-500/50 text-[var(--foreground-muted)] hover:text-red-400 transition-all z-10"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--neon-cyan)] via-[var(--neon-purple)] to-[var(--neon-pink)]" />

            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 pr-12">
              <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-br from-[var(--neon-cyan)]/20 to-[var(--neon-purple)]/20 flex-shrink-0">
                <Key className="text-[var(--neon-cyan)]" size={20} />
              </div>
              <div className="min-w-0">
                <h2 className="text-xl sm:text-2xl font-bold" style={{ fontFamily: 'Orbitron, monospace' }}>
                  Configure API Key
                </h2>
                <p className="text-xs sm:text-sm text-[var(--foreground-muted)]">
                  Enter your Google AI Studio API key to generate images
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
                  onChange={(e) => {
                    setApiKey(e.target.value);
                    setValidationError('');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && apiKey.trim()) {
                      handleSaveKey();
                    }
                  }}
                  placeholder="AIzaSy..."
                  className="w-full pr-12"
                  autoFocus
                  disabled={isValidating}
                />
                <button
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)] hover:text-[var(--neon-cyan)] transition-colors"
                  type="button"
                >
                  {showKey ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {validationError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-400 p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-2"
                >
                  <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                  <span>{validationError}</span>
                </motion.div>
              )}

              <div className="text-xs text-[var(--foreground-muted)] p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <strong className="text-yellow-400">Security Note:</strong> Your API key is stored locally in your browser
                and never sent to any server except Google's Gemini API.
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSaveKey}
                  disabled={!apiKey.trim() || isValidating}
                  className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isValidating ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Validating...
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      Save & Continue
                    </>
                  )}
                </button>
                {!isSaved && (
                  <button
                    onClick={handleSkip}
                    className="btn-secondary px-6"
                    disabled={isValidating}
                  >
                    Skip for Now
                  </button>
                )}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/10 text-center">
              <p className="text-xs text-[var(--foreground-muted)]">
                Created by <a href="https://yuv.ai" target="_blank" rel="noopener noreferrer" className="text-[var(--neon-cyan)] hover:underline">Yuval Avidani</a> •
                <a href="https://linktr.ee/yuvai" target="_blank" rel="noopener noreferrer" className="text-[var(--neon-purple)] hover:underline ml-1">@yuvalav</a>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
