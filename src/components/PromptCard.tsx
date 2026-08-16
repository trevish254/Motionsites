import React from 'react';
import { Copy, Check, Heart, Smartphone, Globe, Code2, ArrowUpRight, Film, Image as ImageIcon } from 'lucide-react';
import { MotionPrompt } from '../types';
import confetti from 'canvas-confetti';
import { Language, translations } from '../utils/translations';

interface PromptCardProps {
  prompt: MotionPrompt;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onOpenModal: (prompt: MotionPrompt) => void;
  onOpenRemix: (prompt: MotionPrompt) => void;
  onToast: (msg: string) => void;
  lang?: Language;
}

export const PromptCard: React.FC<PromptCardProps> = ({
  prompt,
  isFavorite,
  onToggleFavorite,
  onOpenModal,
  onOpenRemix,
  onToast,
  lang = 'en',
}) => {
  const [copied, setCopied] = React.useState(false);
  const t = translations[lang];

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(prompt.prompt_text);
      setCopied(true);
      onToast(`Copied "${prompt.title}" prompt!`);

      // Trigger subtle confetti
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      confetti({
        particleCount: 25,
        spread: 45,
        origin: {
          x: rect.left / window.innerWidth,
          y: rect.top / window.innerHeight,
        },
        colors: ['#FF3E00', '#1A1A1A', '#555555'],
        disableForReducedMotion: true,
      });

      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      onToast('Failed to copy to clipboard');
    }
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(prompt.id);
    onToast(isFavorite ? 'Removed from favorites' : 'Saved to favorites');
  };

  // Preview snippet of prompt text
  const promptSnippet = prompt.prompt_text
    ? prompt.prompt_text.slice(0, 160).replace(/^[#\*\-]+\s*/gm, '') + '...'
    : 'No prompt text available';

  const hasMedia = !!prompt.media?.mediaUrl;

  return (
    <div
      onClick={() => onOpenModal(prompt)}
      className="group relative border-2 border-[#1A1A1A] bg-[#FAF9F6] p-6 flex flex-col justify-between transition-all duration-200 hover:shadow-[6px_6px_0px_#1A1A1A] hover:-translate-x-0.5 hover:-translate-y-0.5 cursor-pointer"
    >
      {/* Top Meta row */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-[#1A1A1A]/15">
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Platform Badge */}
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase px-2 py-0.5 border ${
                prompt.platform === 'app'
                  ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white'
                  : 'border-[#1A1A1A] bg-white text-[#1A1A1A]'
              }`}
            >
              {prompt.platform === 'app' ? (
                <Smartphone className="w-3 h-3 text-[#FF3E00]" />
              ) : (
                <Globe className="w-3 h-3" />
              )}
              {prompt.platform === 'app' ? 'App' : 'Web'}
            </span>

            {/* Tier Badge */}
            <span
              className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 border ${
                prompt.is_free
                  ? 'border-[#FF3E00] bg-[#FF3E00] text-white'
                  : 'border-[#1A1A1A] bg-white text-[#1A1A1A]'
              }`}
            >
              {prompt.is_free ? t.freeBadge : t.premiumBadge}
            </span>

            {/* Category */}
            {prompt.category && (
              <span className="text-[10px] font-mono font-medium px-2 py-0.5 border border-[#1A1A1A]/30 bg-white text-[#1A1A1A]/70 uppercase">
                {prompt.category}
              </span>
            )}
          </div>

          {/* Favorite Button */}
          <button
            onClick={handleFavorite}
            className={`p-1.5 border transition-colors cursor-pointer ${
              isFavorite
                ? 'border-[#FF3E00] bg-[#FF3E00] text-white'
                : 'border-[#1A1A1A]/30 bg-white text-[#1A1A1A]/50 hover:text-[#FF3E00] hover:border-[#FF3E00]'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Attached Visual Media Banner if present */}
        {hasMedia && prompt.media && (
          <div className="relative aspect-video mb-3.5 bg-[#1A1A1A] border-2 border-[#1A1A1A] overflow-hidden group-hover:border-[#FF3E00] transition-colors">
            {prompt.media.mediaType === 'video' ? (
              <video
                src={prompt.media.mediaUrl}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={prompt.media.mediaUrl}
                alt={prompt.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
            )}
            <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#1A1A1A]/90 backdrop-blur-xs text-white text-[9px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 border border-white/20">
              {prompt.media.mediaType === 'video' ? (
                <Film className="w-2.5 h-2.5 text-[#FF3E00]" />
              ) : (
                <ImageIcon className="w-2.5 h-2.5 text-[#FF3E00]" />
              )}
              <span>{prompt.media.mediaType}</span>
            </div>
            {prompt.media.caption && (
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-[10px] text-white/90 truncate font-mono">
                {prompt.media.caption}
              </div>
            )}
          </div>
        )}

        {/* Title */}
        <h3 className="text-xl font-serif italic font-bold text-[#1A1A1A] group-hover:text-[#FF3E00] transition-colors leading-tight line-clamp-1 mb-2">
          {prompt.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-[#1A1A1A]/70 line-clamp-2 mb-4 leading-relaxed font-medium">
          {prompt.description || 'Curated high-fidelity motion interface prompt.'}
        </p>

        {/* Prompt Snippet Box */}
        <div className="border border-[#1A1A1A] bg-white p-3.5 mb-4 font-mono text-[11px] text-[#1A1A1A]/80 line-clamp-3 leading-relaxed relative overflow-hidden group-hover:border-[#FF3E00] transition-colors">
          <div className="text-[9px] text-[#FF3E00] uppercase font-bold tracking-widest mb-1.5 flex items-center gap-1 font-mono">
            <span>●</span>
            PROMPT DIRECTIVE PREVIEW
          </div>
          {promptSnippet}
        </div>
      </div>

      {/* Footer Tags & Actions */}
      <div>
        {/* Extracted Tags */}
        {prompt.extractedTags && prompt.extractedTags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap mb-4">
            {prompt.extractedTags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 border border-[#1A1A1A]/20 bg-white text-[#1A1A1A]/70"
              >
                #{tag}
              </span>
            ))}
            {prompt.extractedTags.length > 3 && (
              <span className="text-[9px] font-mono text-[#1A1A1A]/50 font-bold">
                +{prompt.extractedTags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-3 border-t border-[#1A1A1A]/15">
          {/* One-click Copy Button */}
          <button
            onClick={handleCopy}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 border-2 border-[#1A1A1A] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              copied
                ? 'bg-[#FF3E00] border-[#FF3E00] text-white'
                : 'bg-[#1A1A1A] hover:bg-[#FF3E00] hover:border-[#FF3E00] text-white'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>{t.copiedBtn}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>{t.copyPromptBtn}</span>
              </>
            )}
          </button>

          {/* Quick Remix Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenRemix(prompt);
            }}
            className="p-2 border-2 border-[#1A1A1A] bg-white hover:bg-[#1A1A1A] text-[#1A1A1A] hover:text-white transition-colors cursor-pointer"
            title="Remix & customize prompt"
          >
            <Code2 className="w-4 h-4 text-[#FF3E00]" />
          </button>

          {/* Open Details Button */}
          <button
            onClick={() => onOpenModal(prompt)}
            className="p-2 border-2 border-[#1A1A1A] bg-white hover:bg-[#1A1A1A] text-[#1A1A1A] hover:text-white transition-colors cursor-pointer"
            title="Inspect full prompt & assets"
          >
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
