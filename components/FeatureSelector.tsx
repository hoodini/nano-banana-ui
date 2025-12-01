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
    <div className="w-full space-y-12 sm:space-y-16">
      <div className="text-center space-y-6 max-w-4xl mx-auto">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold neon-text" style={{ fontFamily: 'Orbitron, monospace', color: 'var(--neon-cyan)' }}>
          Choose Your Feature
        </h2>
        <p className="text-lg sm:text-xl md:text-2xl text-[var(--foreground-muted)] leading-relaxed">
          Select from powerful AI image generation and editing capabilities powered by Google Gemini
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 sm:gap-10 md:gap-12"
      >
        {FEATURES.map((feature) => {
          const isSelected = selectedFeature?.id === feature.id;
          const isSpecial = feature.category === 'special';

          return (
            <motion.button
              key={feature.id}
              variants={itemVariants}
              onClick={() => onFeatureSelect(feature)}
              className={`glass-card p-8 sm:p-9 md:p-10 text-left relative overflow-hidden group cursor-pointer transition-all duration-300 hover:scale-[1.02] ${isSelected ? 'ring-2 ring-[var(--neon-cyan)] shadow-[var(--glow-cyan)]' : ''
                }`}
              whileHover={{ y: -8 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Background gradient overlay */}
              <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${isSpecial
                    ? 'bg-gradient-to-br from-yellow-400 to-orange-500'
                    : 'bg-gradient-to-br from-cyan-400 to-purple-600'
                  }`}
              />

              {/* Special badge */}
              {isSpecial && (
                <div className="absolute top-6 right-6 sm:top-7 sm:right-7 bg-gradient-to-r from-[var(--banana-yellow)] to-orange-500 text-black text-xs sm:text-sm font-bold px-4 py-2 sm:px-5 sm:py-2.5 rounded-full flex items-center gap-2 animate-glow-pulse shadow-lg">
                  <Sparkles size={16} className="sm:w-4 sm:h-4" />
                  <span>SPECIAL</span>
                </div>
              )}

              {/* Model badge */}
              <div className={`absolute top-6 left-6 sm:top-7 sm:left-7 text-xs sm:text-sm font-bold px-4 py-2 sm:px-5 sm:py-2.5 rounded-full flex items-center gap-2 shadow-lg ${feature.modelType === 'pro'
                  ? 'bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-pink)] text-white'
                  : 'bg-[var(--neon-cyan)]/20 text-[var(--neon-cyan)] border-2 border-[var(--neon-cyan)]/50'
                }`}>
                <Zap size={16} className="sm:w-4 sm:h-4" />
                {feature.modelType === 'pro' ? 'Gemini 3 Pro' : 'Flash 2.5'}
              </div>

              {/* Thumbnail image */}
              <div className="mt-16 sm:mt-18 mb-6 sm:mb-7 aspect-video rounded-2xl bg-gradient-to-br from-[var(--background-elevated)] to-[var(--background)] border-2 border-white/10 relative overflow-hidden shadow-2xl">
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon-cyan)]/5 to-[var(--neon-purple)]/5 animate-pulse" />

                <img
                  src={feature.thumbnail}
                  alt={feature.name}
                  className="w-full h-full object-cover relative z-10"
                  loading="lazy"
                />
              </div>

              <div className="relative z-10 space-y-4 sm:space-y-5">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-[var(--foreground)]" style={{ fontFamily: 'Orbitron, monospace' }}>
                  {feature.name}
                </h3>
                <p className="text-base sm:text-lg text-[var(--foreground-muted)] line-clamp-3 leading-relaxed">
                  {feature.description}
                </p>

                <div className="flex flex-wrap gap-2 sm:gap-2.5 pt-2 sm:pt-3">
                  {feature.requiresImage && (
                    <span className="text-xs px-3 py-1.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      Requires Image{feature.requiresMultipleImages ? 's' : ''}
                    </span>
                  )}
                  {feature.maxImages && (
                    <span className="text-xs px-3 py-1.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
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
