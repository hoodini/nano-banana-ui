'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Twitter, Instagram, Globe, Link as LinkIcon } from 'lucide-react';
import ApiKeyConfig from '@/components/ApiKeyConfig';
import FeatureSelector from '@/components/FeatureSelector';
import GenerationInterface from '@/components/GenerationInterface';
import { Feature } from '@/types';

export default function Home() {
  const [apiKey, setApiKey] = useState<string>('');
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);

  return (
    <div className="min-h-screen relative">
      {/* Animated gradient orbs */}
      <div className="fixed top-20 right-20 w-96 h-96 bg-[var(--neon-cyan)] rounded-full blur-[150px] opacity-20 animate-pulse" />
      <div className="fixed bottom-20 left-20 w-96 h-96 bg-[var(--neon-purple)] rounded-full blur-[150px] opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Header */}
      <header className="relative z-10 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
          <div className="flex items-center justify-between gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0"
            >
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[var(--banana-yellow)] to-orange-500 flex items-center justify-center text-xl sm:text-2xl animate-glow-pulse">
                  🍌
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold neon-text truncate" style={{ fontFamily: 'Orbitron, monospace', color: 'var(--neon-cyan)' }}>
                  YUV.AI Nano Banana Pro
                </h1>
                <p className="text-xs sm:text-sm text-[var(--foreground-muted)] hidden sm:block">
                  Powered by Google Gemini Image Generation
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden md:flex items-center gap-3"
            >
              <a
                href="https://x.com/yuvalav"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-[var(--background-glass)] border border-white/10 hover:border-[var(--neon-cyan)] transition-all text-[var(--foreground-muted)] hover:text-[var(--neon-cyan)]"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://instagram.com/yuval_770"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-[var(--background-glass)] border border-white/10 hover:border-[var(--neon-pink)] transition-all text-[var(--foreground-muted)] hover:text-[var(--neon-pink)]"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://yuv.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-[var(--background-glass)] border border-white/10 hover:border-[var(--neon-purple)] transition-all text-[var(--foreground-muted)] hover:text-[var(--neon-purple)]"
              >
                <Globe size={20} />
              </a>
              <a
                href="https://linktr.ee/yuvai"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-[var(--background-glass)] border border-white/10 hover:border-[var(--banana-yellow)] transition-all text-[var(--foreground-muted)] hover:text-[var(--banana-yellow)]"
              >
                <LinkIcon size={20} />
              </a>
            </motion.div>
          </div>
        </div>
      </header>

      {/* API Key Configuration */}
      <ApiKeyConfig onApiKeySet={setApiKey} />

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        {!selectedFeature ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 sm:space-y-10 md:space-y-12"
          >
            {/* Hero Section */}
            <div className="text-center space-y-4 sm:space-y-6 py-6 sm:py-8 md:py-12 px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[var(--neon-cyan)]/20 to-[var(--neon-purple)]/20 border border-[var(--neon-cyan)]/30 text-sm font-semibold text-[var(--neon-cyan)]"
              >
                <Sparkles size={16} className="animate-glow-pulse" />
                Professional AI Image Generation Platform
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight px-2"
                style={{ fontFamily: 'Orbitron, monospace' }}
              >
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--neon-cyan)] via-[var(--neon-purple)] to-[var(--neon-pink)]">
                  Create Stunning Images
                </span>
                <br />
                <span className="text-[var(--foreground)]">
                  with AI Power
                </span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-base sm:text-lg md:text-xl text-[var(--foreground-muted)] max-w-3xl mx-auto px-2"
              >
                Harness the full power of Google's Gemini AI to generate, edit, and transform images
                with unprecedented quality and control. From text-to-image to viral social media thumbnails.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-4 justify-center pt-4"
              >
                <div className="glass-card px-6 py-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-sm font-medium">Gemini 2.5 Flash</span>
                </div>
                <div className="glass-card px-6 py-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                  <span className="text-sm font-medium">Gemini 3 Pro</span>
                </div>
                <div className="glass-card px-6 py-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                  <span className="text-sm font-medium">Up to 4K Quality</span>
                </div>
              </motion.div>
            </div>

            {/* Feature Selector */}
            <FeatureSelector
              selectedFeature={selectedFeature}
              onFeatureSelect={setSelectedFeature}
            />
          </motion.div>
        ) : (
          <GenerationInterface
            feature={selectedFeature}
            apiKey={apiKey}
            onBack={() => setSelectedFeature(null)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 mt-12 sm:mt-16 md:mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
            <div className="text-center md:text-left">
              <p className="text-sm text-[var(--foreground-muted)]">
                Created with 💜 by{' '}
                <a
                  href="https://yuv.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--neon-cyan)] hover:text-[var(--neon-purple)] font-semibold transition-colors"
                >
                  Yuval Avidani
                </a>
              </p>
              <p className="text-xs text-[var(--foreground-muted)] mt-1">
                Founder of YUV.AI • @yuvalav • @yuval_770
              </p>
            </div>

            <div className="flex items-center gap-4">
              <a
                href="https://ai.google.dev/gemini-api/docs/image-generation"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[var(--foreground-muted)] hover:text-[var(--neon-cyan)] transition-colors"
              >
                API Docs
              </a>
              <a
                href="https://github.com/hoodini/nano-banana-ui"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[var(--foreground-muted)] hover:text-[var(--neon-cyan)] transition-colors"
              >
                GitHub
              </a>
              <a
                href="https://linktr.ee/yuvai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[var(--foreground-muted)] hover:text-[var(--neon-cyan)] transition-colors"
              >
                LinkTree
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
