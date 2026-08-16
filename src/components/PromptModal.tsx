import React, { useState, useEffect } from 'react';
import {
  X,
  Copy,
  Check,
  Heart,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ExternalLink,
  Code2,
  FileText,
  Sliders,
  Bot,
  Type,
  Image as ImageIcon,
  Tag,
  Palette,
} from 'lucide-react';
import { MotionPrompt } from '../types';
import { extractFonts, extractAssets, formatForAIStudio, remixPrompt } from '../utils/promptUtils';
import confetti from 'canvas-confetti';
import { Language, translations } from '../utils/translations';

interface PromptModalProps {
  prompt: MotionPrompt | null;
  isOpen: boolean;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onToast: (msg: string) => void;
  lang?: Language;
}

export const PromptModal: React.FC<PromptModalProps> = ({
  prompt,
  isOpen,
  onClose,
  onPrev,
  onNext,
  isFavorite,
  onToggleFavorite,
  onToast,
  lang = 'en',
}) => {
  const [activeTab, setActiveTab] = useState<'prompt' | 'ai-studio' | 'assets' | 'remix'>('prompt');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const t = translations[lang];

  // Customizer state
  const [brandName, setBrandName] = useState('');
  const [colorTheme, setColorTheme] = useState('monochrome');
  const [framework, setFramework] = useState('React 18 + TypeScript + Vite + Tailwind CSS');

  useEffect(() => {
    // Reset tabs when prompt changes
    setActiveTab('prompt');
    setCopiedKey(null);
  }, [prompt?.id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
      if (e.key === 'ArrowRight' && onNext) onNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onPrev, onNext, onClose]);

  if (!isOpen || !prompt) return null;

  const handleCopy = async (text: string, key: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      onToast(`Copied ${label}!`);

      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.6 },
        colors: ['#FF3E00', '#1A1A1A', '#555555'],
        disableForReducedMotion: true,
      });

      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      onToast('Failed to copy to clipboard');
    }
  };

  const fonts = prompt.extractedFonts || extractFonts(prompt.prompt_text || '');
  const assets = prompt.extractedAssets || extractAssets(prompt.prompt_text || '');

  const remixedPromptText = remixPrompt(prompt.prompt_text, {
    brandName,
    colorTheme,
    framework,
  });

  const aiStudioText = formatForAIStudio(prompt);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-4xl bg-[#FAF9F6] border-2 border-[#1A1A1A] shadow-[8px_8px_0px_#1A1A1A] overflow-hidden flex flex-col max-h-[90vh] z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-[#1A1A1A] bg-[#FAF9F6]">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 border ${
                prompt.is_free
                  ? 'border-[#FF3E00] bg-[#FF3E00] text-white'
                  : 'border-[#1A1A1A] bg-[#1A1A1A] text-white'
              }`}
            >
              {prompt.is_free ? t.freeBadge : t.premiumBadge}
            </span>
            <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 border border-[#1A1A1A] bg-white text-[#1A1A1A]">
              {prompt.platform === 'app' ? 'Mobile App' : 'Web Layout'}
            </span>
            {prompt.category && (
              <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 border border-[#1A1A1A]/30 bg-white text-[#1A1A1A]/70">
                {prompt.category}
              </span>
            )}
          </div>

          {/* Action buttons on top right */}
          <div className="flex items-center gap-1.5">
            {/* Prev & Next navigation */}
            {onPrev && (
              <button
                onClick={onPrev}
                className="p-1.5 border border-[#1A1A1A] bg-white hover:bg-[#1A1A1A] text-[#1A1A1A] hover:text-white transition-colors cursor-pointer"
                title={t.prevPromptBtn}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            {onNext && (
              <button
                onClick={onNext}
                className="p-1.5 border border-[#1A1A1A] bg-white hover:bg-[#1A1A1A] text-[#1A1A1A] hover:text-white transition-colors cursor-pointer"
                title={t.nextPromptBtn}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {/* Favorite toggle */}
            <button
              onClick={() => {
                onToggleFavorite(prompt.id);
                onToast(isFavorite ? 'Removed from favorites' : 'Saved to favorites');
              }}
              className={`p-1.5 border transition-colors cursor-pointer ${
                isFavorite
                  ? 'border-[#FF3E00] bg-[#FF3E00] text-white'
                  : 'border-[#1A1A1A] bg-white text-[#1A1A1A] hover:text-[#FF3E00]'
              }`}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
            </button>

            {/* Close button */}
            <button
              onClick={onClose}
              className="p-1.5 border border-[#1A1A1A] bg-[#1A1A1A] hover:bg-[#FF3E00] hover:border-[#FF3E00] text-white transition-colors ml-2 cursor-pointer"
              title="Close modal (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Title and Description */}
        <div className="px-6 py-4 bg-[#FAF9F6] border-b border-[#1A1A1A]">
          <h2 className="text-2xl sm:text-3xl font-serif italic font-bold text-[#1A1A1A] tracking-tight">
            {prompt.title}
          </h2>
          <p className="text-xs sm:text-sm text-[#1A1A1A]/70 mt-1 leading-relaxed font-medium">
            {prompt.description || 'High-fidelity motion and interactive design prompt specification.'}
          </p>
        </div>

        {/* Attached Visual Media Preview Banner (if exists) */}
        {prompt.media?.mediaUrl && (
          <div className="px-6 pt-4 pb-0 bg-[#FAF9F6]">
            <div className="relative aspect-video max-h-72 w-full bg-[#1A1A1A] border-2 border-[#1A1A1A] overflow-hidden flex items-center justify-center shadow-[4px_4px_0px_#1A1A1A]">
              {prompt.media.mediaType === 'video' ? (
                <video
                  src={prompt.media.mediaUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls
                  className="w-full h-full object-contain"
                />
              ) : (
                <img
                  src={prompt.media.mediaUrl}
                  alt={prompt.title}
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              )}
              <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#1A1A1A]/90 backdrop-blur-xs text-white text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 border border-white/20">
                <Sparkles className="w-3 h-3 text-[#FF3E00]" />
                <span>Motion Preview ({prompt.media.mediaType})</span>
              </div>
              {prompt.media.caption && (
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 text-xs text-white font-mono">
                  {prompt.media.caption}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal Navigation Sub-tabs */}
        <div className="flex items-center gap-1 px-6 py-2 bg-white border-b border-[#1A1A1A] overflow-x-auto">
          <button
            onClick={() => setActiveTab('prompt')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'prompt'
                ? 'bg-[#1A1A1A] text-white'
                : 'text-[#1A1A1A] hover:bg-[#1A1A1A]/10'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{t.tabFullPrompt}</span>
          </button>

          <button
            onClick={() => setActiveTab('ai-studio')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'ai-studio'
                ? 'bg-[#1A1A1A] text-white'
                : 'text-[#1A1A1A] hover:bg-[#1A1A1A]/10'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>{t.tabAiStudio}</span>
          </button>

          <button
            onClick={() => setActiveTab('assets')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'assets'
                ? 'bg-[#1A1A1A] text-white'
                : 'text-[#1A1A1A] hover:bg-[#1A1A1A]/10'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>{t.tabExtracted} ({assets.length + fonts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('remix')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'remix'
                ? 'bg-[#1A1A1A] text-white'
                : 'text-[#1A1A1A] hover:bg-[#1A1A1A]/10'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{t.tabRemix}</span>
          </button>
        </div>

        {/* Content Body Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* TAB 1: RAW FULL PROMPT */}
          {activeTab === 'prompt' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-[#1A1A1A]/70 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF3E00]" />
                  {prompt.prompt_text.length} {t.charsLabel}
                </span>
                <button
                  onClick={() => handleCopy(prompt.prompt_text, 'raw', 'Raw Prompt')}
                  className="flex items-center gap-1.5 px-4 py-2 border-2 border-[#1A1A1A] bg-[#1A1A1A] text-white hover:bg-[#FF3E00] hover:border-[#FF3E00] text-xs font-bold uppercase tracking-wider transition-all shadow-[2px_2px_0px_#1A1A1A] cursor-pointer"
                >
                  {copiedKey === 'raw' ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{t.copiedBtn}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{t.copyFullBtn}</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="p-4 sm:p-6 bg-white border-2 border-[#1A1A1A] font-mono text-xs text-[#1A1A1A] whitespace-pre-wrap break-words leading-relaxed overflow-x-auto">
                {prompt.prompt_text}
              </pre>
            </div>
          )}

          {/* TAB 2: AI STUDIO READY FORMAT */}
          {activeTab === 'ai-studio' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-[#1A1A1A]/70 flex items-center gap-1.5">
                  <Bot className="w-3.5 h-3.5 text-[#FF3E00]" />
                  Optimized Role & Requirement Prompt
                </span>
                <button
                  onClick={() => handleCopy(aiStudioText, 'aistudio', 'AI Studio Prompt')}
                  className="flex items-center gap-1.5 px-4 py-2 border-2 border-[#1A1A1A] bg-[#FF3E00] text-white hover:bg-[#1A1A1A] hover:border-[#1A1A1A] text-xs font-bold uppercase tracking-wider transition-all shadow-[2px_2px_0px_#1A1A1A] cursor-pointer"
                >
                  {copiedKey === 'aistudio' ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{t.copiedBtn}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{t.copyAiStudioBtn}</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="p-4 sm:p-6 bg-white border-2 border-[#1A1A1A] font-mono text-xs text-[#1A1A1A] whitespace-pre-wrap break-words leading-relaxed">
                {aiStudioText}
              </pre>
            </div>
          )}

          {/* TAB 3: EXTRACTED ARCHITECTURE & ASSETS */}
          {activeTab === 'assets' && (
            <div className="space-y-6">
              {/* Fonts */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A1A1A] flex items-center gap-2">
                  <Type className="w-4 h-4 text-[#FF3E00]" />
                  {t.fontAnalysisTitle}
                </h3>
                {fonts.length === 0 ? (
                  <p className="text-xs text-[#1A1A1A]/60 font-mono bg-white p-3 border border-[#1A1A1A]">
                    {t.noFontsFound}
                  </p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {fonts.map((f) => (
                      <div key={f} className="p-3 border border-[#1A1A1A] bg-white flex items-center justify-between">
                        <span className="font-serif italic font-bold text-sm text-[#1A1A1A]">{f}</span>
                        <span className="text-[10px] font-mono text-[#1A1A1A]/50">Google Fonts</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Assets & Image URLs */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A1A1A] flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#FF3E00]" />
                  {t.assetAnalysisTitle}
                </h3>
                {assets.length === 0 ? (
                  <p className="text-xs text-[#1A1A1A]/60 font-mono bg-white p-3 border border-[#1A1A1A]">
                    {t.noAssetsFound}
                  </p>
                ) : (
                  <div className="space-y-2">
                    {assets.map((url, idx) => (
                      <div key={idx} className="p-2.5 border border-[#1A1A1A] bg-white flex items-center justify-between gap-2 text-xs">
                        <span className="font-mono text-[#1A1A1A] truncate max-w-md">{url}</span>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-2 py-1 bg-[#1A1A1A] text-white text-[10px] font-mono font-bold hover:bg-[#FF3E00] transition-colors"
                        >
                          <span>Open</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A1A1A] flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#FF3E00]" />
                  {t.featuresAnalysisTitle}
                </h3>
                <div className="flex items-center gap-2 flex-wrap">
                  {(prompt.extractedTags || []).map((tag) => (
                    <span key={tag} className="px-2.5 py-1 border border-[#1A1A1A] bg-white font-mono text-xs font-bold text-[#1A1A1A]">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: QUICK REMIXER INSIDE MODAL */}
          {activeTab === 'remix' && (
            <div className="space-y-6">
              <div className="p-4 border-2 border-[#1A1A1A] bg-white space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A1A1A] flex items-center gap-2">
                  <Palette className="w-4 h-4 text-[#FF3E00]" />
                  Quick Parameter Customization
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-[#1A1A1A] mb-1">
                      {t.brandInputLabel}
                    </label>
                    <input
                      type="text"
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      placeholder={t.brandInputPlaceholder}
                      className="w-full bg-[#FAF9F6] border border-[#1A1A1A] px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#FF3E00]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-[#1A1A1A] mb-1">
                      {t.accentColorLabel}
                    </label>
                    <select
                      value={colorTheme}
                      onChange={(e) => setColorTheme(e.target.value)}
                      className="w-full bg-[#FAF9F6] border border-[#1A1A1A] px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#FF3E00]"
                    >
                      <option value="monochrome">Monochrome & Gallery Accent (#FF3E00)</option>
                      <option value="violet">Electric Violet (#7C3AED)</option>
                      <option value="emerald">Emerald Forest (#10B981)</option>
                      <option value="amber">Warm Amber Gold (#F59E0B)</option>
                      <option value="rose">Artistic Rose (#F43F5E)</option>
                      <option value="cyan">Cyber Cyan (#06B6D4)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Remixed Output */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase text-[#1A1A1A]/70">
                    {t.remixedPreviewTitle}
                  </span>
                  <button
                    onClick={() => handleCopy(remixedPromptText, 'remix', 'Remixed Prompt')}
                    className="flex items-center gap-1.5 px-4 py-2 border-2 border-[#1A1A1A] bg-[#1A1A1A] text-white hover:bg-[#FF3E00] hover:border-[#FF3E00] text-xs font-bold uppercase tracking-wider transition-all shadow-[2px_2px_0px_#1A1A1A] cursor-pointer"
                  >
                    {copiedKey === 'remix' ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>{t.copiedBtn}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{t.copyRemixedBtn}</span>
                      </>
                    )}
                  </button>
                </div>

                <pre className="p-4 sm:p-6 bg-white border-2 border-[#1A1A1A] font-mono text-xs text-[#1A1A1A] whitespace-pre-wrap break-words leading-relaxed max-h-80 overflow-y-auto">
                  {remixedPromptText}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions Footer */}
        <div className="px-6 py-3 bg-[#FAF9F6] border-t-2 border-[#1A1A1A] flex items-center justify-between text-xs">
          <span className="text-[11px] font-mono text-[#1A1A1A]/60">
            ID: {prompt.id} • Vol. 04 MotionSites
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 border border-[#1A1A1A] bg-white hover:bg-[#1A1A1A] hover:text-white font-mono font-bold uppercase text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
