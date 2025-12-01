'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Feature, GenerationConfig } from '@/types';
import {
  Upload,
  X,
  Wand2,
  Loader2,
  Download,
  ImagePlus,
  Settings,
  Sparkles,
} from 'lucide-react';

interface GenerationInterfaceProps {
  feature: Feature;
  apiKey: string;
  onBack: () => void;
}

export default function GenerationInterface({ feature, apiKey, onBack }: GenerationInterfaceProps) {
  const [prompt, setPrompt] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [config, setConfig] = useState<GenerationConfig>({
    aspectRatio: '16:9',
    imageSize: '2K',
    useGoogleSearch: false,
  });
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const maxImages = feature.maxImages || 1;

    if (images.length + files.length > maxImages) {
      setError(`Maximum ${maxImages} images allowed`);
      return;
    }

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGenerate = async () => {
    if (!prompt.trim() && feature.id !== 'image-editing') {
      setError('Please enter a prompt');
      return;
    }

    if (feature.requiresImage && images.length === 0) {
      setError('Please upload at least one image');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);

    try {
      // Prepare the prompt based on feature type
      let finalPrompt = prompt;
      if (feature.id === 'social-media-thumbnail') {
        finalPrompt = `Create a VIRAL YouTube/Social Media thumbnail with these elements:
- DRAMATIC, eye-catching scene with shocked/surprised facial expression
- BIG, BOLD text overlays with key phrases (use vibrant colors like yellow, red, white)
- Arrows, circles, or highlighting elements pointing to important parts
- High contrast and saturated colors for maximum impact
- Professional editing style that screams "CLICK ME!"
- Energy and urgency in the composition

User's custom requirements: ${prompt}

Style: Photorealistic, professional thumbnail editing, viral content aesthetics`;
      } else if (feature.id === 'style-transfer') {
        // For style transfer, enhance the prompt if images are provided
        if (images.length === 2) {
          finalPrompt = prompt || 'Apply the artistic style and aesthetic from the first image to the content and composition of the second image. Preserve the subject matter of the second image while adopting the color palette, brushstrokes, texture, and artistic techniques of the first image.';
        } else if (images.length === 1) {
          finalPrompt = prompt || 'Transform this image into an artistic masterpiece. Apply creative stylization while maintaining the core composition and subject matter.';
        }
      }

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: finalPrompt,
          images: images.map((img) => img.split(',')[1]), // Remove data:image/...;base64, prefix
          config,
          featureId: feature.id,
          apiKey,
        }),
      });

      const data = await response.json();

      if (data.success && data.imageData) {
        setGeneratedImage(`data:image/png;base64,${data.imageData}`);
      } else {
        const errorMessage = data.error || 'Failed to generate image';
        const debugInfo = data.debug ? ` (${data.debug})` : '';
        const detailsInfo = data.details ? `\n\nDetails: ${data.details}` : '';
        setError(errorMessage + debugInfo + detailsInfo);
        console.error('Generation failed:', data);
      }
    } catch (err) {
      setError('An error occurred during generation: ' + (err instanceof Error ? err.message : String(err)));
      console.error('Generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = () => {
    if (!generatedImage) return;

    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `nano-banana-${feature.id}-${Date.now()}.png`;
    link.click();
  };

  // Special prompt templates for social media
  const socialMediaTemplates = [
    'Excited person pointing at [your subject], dramatic lighting, shocked expression',
    'Before and after transformation scene, split screen effect',
    'Action scene with motion blur, dynamic angle, urgent energy',
    'Reveal moment with glowing highlight effects, surprised reaction',
  ];

  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-4 sm:space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-4 sm:p-5 md:p-6 space-y-4"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
            <button
              onClick={onBack}
              className="btn-secondary text-xs sm:text-sm py-2 px-3 sm:px-4 flex-shrink-0"
            >
              ← Back
            </button>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold flex items-center gap-2" style={{ fontFamily: 'Orbitron, monospace' }}>
                <span className="text-2xl sm:text-3xl md:text-4xl">{feature.icon}</span>
                <span className="truncate">{feature.name}</span>
              </h2>
              <p className="text-xs sm:text-sm text-[var(--foreground-muted)] line-clamp-2">{feature.description}</p>
            </div>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`btn-secondary text-xs sm:text-sm py-2.5 px-4 sm:px-5 flex items-center gap-2 flex-shrink-0 self-end sm:self-auto transition-all ${
              showSettings
                ? 'bg-[var(--neon-cyan)]/20 border-[var(--neon-cyan)] shadow-[var(--glow-cyan)]'
                : 'hover:border-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/10'
            }`}
          >
            <Settings size={18} className="sm:w-5 sm:h-5" />
            <span className="font-semibold">Settings</span>
          </button>
        </div>

        {/* Quick Settings Preview */}
        {!showSettings && (
          <div className="flex flex-wrap gap-2 sm:gap-3 items-center text-xs sm:text-sm text-[var(--foreground-muted)]">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--background-elevated)] border border-white/10">
              <span className="font-medium text-[var(--neon-cyan)]">{config.aspectRatio}</span>
              <span>Aspect Ratio</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--background-elevated)] border border-white/10">
              <span className="font-medium text-[var(--neon-purple)]">{config.imageSize}</span>
              <span>Quality</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--background-elevated)] border border-white/10">
              <span className={`font-medium ${feature.modelType === 'pro' ? 'text-[var(--neon-purple)]' : 'text-[var(--neon-cyan)]'}`}>
                {feature.modelType === 'pro' ? 'Gemini 3 Pro' : 'Gemini 2.5 Flash'}
              </span>
            </div>
            <button
              onClick={() => setShowSettings(true)}
              className="text-[var(--neon-cyan)] hover:text-[var(--neon-purple)] transition-colors ml-auto"
            >
              Click to adjust →
            </button>
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4 sm:space-y-5 md:space-y-6"
        >
          {/* Image Upload */}
          {feature.requiresImage && (
            <div className="glass-card p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4">
              <h3 className="text-lg sm:text-xl font-bold" style={{ fontFamily: 'Orbitron, monospace' }}>
                Upload Image{feature.requiresMultipleImages ? 's' : ''}
              </h3>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple={feature.requiresMultipleImages}
                onChange={handleImageUpload}
                className="hidden"
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-4 border-2 border-dashed border-[var(--neon-cyan)]/30 rounded-xl hover:border-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/5 transition-all flex flex-col items-center gap-2 text-[var(--foreground-muted)] hover:text-[var(--neon-cyan)]"
              >
                <ImagePlus size={32} />
                <span className="font-medium">
                  Click to upload{feature.requiresMultipleImages && ` (max ${feature.maxImages})`}
                </span>
              </button>

              {images.length > 0 && (
                <div className="grid grid-cols-2 gap-3">
                  {images.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img}
                        alt={`Upload ${index + 1}`}
                        className="w-full aspect-square object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Prompt Input */}
          <div className="glass-card p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <h3 className="text-lg sm:text-xl font-bold" style={{ fontFamily: 'Orbitron, monospace' }}>
                Prompt
              </h3>
              <div className="flex items-center gap-2 flex-wrap">
                {feature.examplePrompt && (
                  <button
                    onClick={() => setPrompt(feature.examplePrompt!)}
                    className="text-xs text-[var(--banana-yellow)] hover:text-[var(--neon-cyan)] flex items-center gap-1 px-2 py-1 rounded-lg bg-[var(--banana-yellow)]/10 border border-[var(--banana-yellow)]/30"
                  >
                    <Sparkles size={14} />
                    Use Example
                  </button>
                )}
                {feature.id === 'social-media-thumbnail' && (
                  <button
                    onClick={() => setPrompt(socialMediaTemplates[Math.floor(Math.random() * socialMediaTemplates.length)])}
                    className="text-xs text-[var(--neon-cyan)] hover:text-[var(--neon-purple)] flex items-center gap-1"
                  >
                    <Sparkles size={14} />
                    Random Template
                  </button>
                )}
              </div>
            </div>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={
                feature.id === 'social-media-thumbnail'
                  ? 'Describe the subject, emotion, and key elements you want in your thumbnail...'
                  : 'Describe the image you want to generate...'
              }
              className="w-full min-h-[150px] resize-none"
            />

            {feature.id === 'social-media-thumbnail' && (
              <div className="p-3 rounded-lg bg-[var(--banana-yellow)]/10 border border-[var(--banana-yellow)]/30 text-sm">
                <p className="text-[var(--banana-yellow)] font-semibold mb-1">💡 Pro Tip:</p>
                <p className="text-[var(--foreground-muted)]">
                  Describe the emotion and action you want! The AI will automatically add dramatic effects,
                  bold text, and viral thumbnail styling.
                </p>
              </div>
            )}
          </div>

          {/* Settings Panel */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="glass-card p-6 space-y-4 overflow-hidden"
              >
                <h3 className="text-xl font-bold" style={{ fontFamily: 'Orbitron, monospace' }}>
                  Generation Settings
                </h3>

                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                      Aspect Ratio
                    </label>
                    <select
                      value={config.aspectRatio}
                      onChange={(e) => setConfig({ ...config, aspectRatio: e.target.value as any })}
                      className="w-full"
                    >
                      <option value="1:1">1:1 (Square - Instagram Post)</option>
                      <option value="4:5">4:5 (Instagram Portrait)</option>
                      <option value="9:16">9:16 (Story/Reels)</option>
                      <option value="16:9">16:9 (YouTube Thumbnail)</option>
                      <option value="21:9">21:9 (Ultra Wide)</option>
                      <option value="3:2">3:2 (Classic Photo)</option>
                      <option value="4:3">4:3 (Standard)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                      Image Quality
                      {feature.modelType === 'flash' && (
                        <span className="ml-2 text-xs text-[var(--neon-cyan)] font-normal">
                          (Gemini 2.5 Flash)
                        </span>
                      )}
                      {feature.modelType === 'pro' && (
                        <span className="ml-2 text-xs text-[var(--neon-purple)] font-normal">
                          (Gemini 3 Pro)
                        </span>
                      )}
                    </label>
                    <select
                      value={config.imageSize}
                      onChange={(e) => setConfig({ ...config, imageSize: e.target.value as any })}
                      className="w-full"
                    >
                      <option value="1K">1K - Fast Generation</option>
                      <option value="2K">2K - Balanced Quality</option>
                      <option value="4K">4K - Maximum Quality</option>
                    </select>
                    <p className="text-xs text-[var(--foreground-muted)] mt-1.5">
                      Higher quality takes longer but produces better results
                    </p>
                  </div>

                  {feature.id === 'search-grounding' && (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                      <div>
                        <span className="text-sm font-medium">Use Google Search</span>
                        <p className="text-xs text-[var(--foreground-muted)] mt-0.5">
                          Ground generation with real-time data
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={config.useGoogleSearch}
                        onChange={(e) => setConfig({ ...config, useGoogleSearch: e.target.checked })}
                        className="w-5 h-5"
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Loader2 className="animate-spin" size={24} />
                Generating Magic...
              </>
            ) : (
              <>
                <Wand2 size={24} />
                Generate Image
              </>
            )}
          </button>

          {/* Error Display */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="glass-card p-4 bg-red-500/10 border-red-500/30 text-red-300"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Output Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-6 space-y-4"
        >
          <h3 className="text-xl font-bold" style={{ fontFamily: 'Orbitron, monospace' }}>
            Generated Image
          </h3>

          <div className="aspect-video bg-[var(--background-elevated)] rounded-xl flex items-center justify-center relative overflow-hidden">
            {isGenerating && (
              <div className="flex flex-col items-center gap-4">
                <div className="loading-spinner" />
                <p className="text-[var(--foreground-muted)] animate-pulse">
                  Creating your masterpiece...
                </p>
              </div>
            )}

            {!isGenerating && !generatedImage && (
              <div className="text-center p-8 text-[var(--foreground-muted)]">
                <Wand2 size={48} className="mx-auto mb-4 opacity-30" />
                <p>Your generated image will appear here</p>
              </div>
            )}

            {generatedImage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative w-full h-full"
              >
                <img
                  src={generatedImage}
                  alt="Generated"
                  className="w-full h-full object-contain"
                />
              </motion.div>
            )}
          </div>

          {generatedImage && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={downloadImage}
              className="btn-secondary w-full flex items-center justify-center gap-2"
            >
              <Download size={20} />
              Download Image
            </motion.button>
          )}
        </motion.div>
      </div>
    </div>
  );
}
