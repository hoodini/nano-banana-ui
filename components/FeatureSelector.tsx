'use client';

import { motion } from 'framer-motion';
import { Feature, FEATURES } from '@/types';
import { Sparkles, Zap } from 'lucide-react';

interface FeatureSelectorProps {
  selectedFeature: Feature | null;
  onFeatureSelect: (feature: Feature) => void;
}

export default function FeatureSelector({ selectedFeature, onFeatureSelect }: FeatureSelectorProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center space-y-2 px-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold neon-text" style={{ fontFamily: 'Orbitron, monospace', color: 'var(--neon-cyan)' }}>
          Choose Your Feature
        </h2>
        <p className="text-sm sm:text-base text-[var(--foreground-muted)] max-w-2xl mx-auto">
          Select from powerful AI image generation and editing capabilities
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6"
      >
        {FEATURES.map((feature) => {
          const isSelected = selectedFeature?.id === feature.id;
          const isSpecial = feature.category === 'special';

          return (
            <motion.button
              key={feature.id}
              variants={itemVariants}
              onClick={() => onFeatureSelect(feature)}
              className={`glass-card p-4 sm:p-5 md:p-6 text-left relative overflow-hidden group cursor-pointer transition-all duration-300 ${
                isSelected ? 'ring-2 ring-[var(--neon-cyan)] shadow-[var(--glow-cyan)]' : ''
              }`}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Background gradient overlay */}
              <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${
                  isSpecial
                    ? 'bg-gradient-to-br from-yellow-400 to-orange-500'
                    : 'bg-gradient-to-br from-cyan-400 to-purple-600'
                }`}
              />

              {/* Special badge */}
              {isSpecial && (
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-gradient-to-r from-[var(--banana-yellow)] to-orange-500 text-black text-[10px] sm:text-xs font-bold px-2 py-1 sm:px-3 rounded-full flex items-center gap-1 animate-glow-pulse">
                  <Sparkles size={10} className="sm:w-3 sm:h-3" />
                  <span className="hidden sm:inline">SPECIAL</span>
                  <span className="sm:hidden">★</span>
                </div>
              )}

              {/* Model badge */}
              <div className={`absolute top-3 left-3 sm:top-4 sm:left-4 text-[10px] sm:text-xs font-bold px-2 py-1 sm:px-3 rounded-full flex items-center gap-1 ${
                feature.modelType === 'pro'
                  ? 'bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-pink)] text-white'
                  : 'bg-[var(--neon-cyan)]/20 text-[var(--neon-cyan)] border border-[var(--neon-cyan)]/30'
              }`}>
                <Zap size={10} className="sm:w-3 sm:h-3" />
                {feature.modelType === 'pro' ? 'Pro' : 'Flash'}
              </div>

              {/* Thumbnail image */}
              <div className="mt-10 sm:mt-12 mb-3 sm:mb-4 aspect-video rounded-xl bg-gradient-to-br from-[var(--background-elevated)] to-[var(--background)] border border-white/10 relative overflow-hidden">
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon-cyan)]/5 to-[var(--neon-purple)]/5 animate-pulse" />

                <img
                  src={feature.thumbnail}
                  alt={feature.name}
                  className="w-full h-full object-cover relative z-10"
                  loading="lazy"
                />
              </div>

              <div className="relative z-10 space-y-1.5 sm:space-y-2">
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-[var(--foreground)]" style={{ fontFamily: 'Orbitron, monospace' }}>
                  {feature.name}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--foreground-muted)] line-clamp-2">
                  {feature.description}
                </p>

                <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1.5 sm:pt-2">
                  {feature.requiresImage && (
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      Requires Image{feature.requiresMultipleImages ? 's' : ''}
                    </span>
                  )}
                  {feature.maxImages && (
                    <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      Up to {feature.maxImages} images
                    </span>
                  )}
                </div>
              </div>

              {/* Selection indicator */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-[var(--neon-cyan)] flex items-center justify-center"
                >
                  <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
