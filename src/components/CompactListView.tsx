import React, { useState } from 'react';
import { Copy, Check, Heart, Eye, Smartphone, Globe, Code2 } from 'lucide-react';
import { MotionPrompt } from '../types';
import confetti from 'canvas-confetti';
import { Language, translations } from '../utils/translations';

interface CompactListViewProps {
  prompts: MotionPrompt[];
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
  onOpenModal: (prompt: MotionPrompt) => void;
  onOpenRemix: (prompt: MotionPrompt) => void;
  onToast: (msg: string) => void;
  lang?: Language;
}

export const CompactListView: React.FC<CompactListViewProps> = ({
  prompts,
  favorites,
  onToggleFavorite,
  onOpenModal,
  onOpenRemix,
  onToast,
  lang = 'en',
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const t = translations[lang];

  const handleCopy = async (prompt: MotionPrompt, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(prompt.prompt_text);
      setCopiedId(prompt.id);
      onToast(`Copied "${prompt.title}"!`);

      const rect = (e.target as HTMLElement).getBoundingClientRect();
      confetti({
        particleCount: 20,
        spread: 40,
        origin: {
          x: rect.left / window.innerWidth,
          y: rect.top / window.innerHeight,
        },
        colors: ['#FF3E00', '#1A1A1A', '#555555'],
        disableForReducedMotion: true,
      });

      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      onToast('Failed to copy');
    }
  };

  return (
    <div className="border-2 border-[#1A1A1A] bg-[#FAF9F6] shadow-[4px_4px_0px_#1A1A1A] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#1A1A1A] text-white font-mono font-bold uppercase tracking-wider text-[10px]">
              <th className="py-3.5 px-4 w-14 text-center border-r border-white/20">{t.thIndex}</th>
              <th className="py-3.5 px-4 border-r border-white/20">{t.thTitleSummary}</th>
              <th className="py-3.5 px-4 w-28 border-r border-white/20">{t.thCategory}</th>
              <th className="py-3.5 px-4 w-24 border-r border-white/20">{t.thPlatform}</th>
              <th className="py-3.5 px-4 w-24 border-r border-white/20">{t.thTier}</th>
              <th className="py-3.5 px-4 w-24 text-right border-r border-white/20">{t.thSize}</th>
              <th className="py-3.5 px-4 w-36 text-center">{t.thActions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1A1A1A]/15 text-[#1A1A1A]">
            {prompts.map((p, idx) => {
              const isFav = favorites.has(p.id);
              const isCopied = copiedId === p.id;

              return (
                <tr
                  key={p.id}
                  onClick={() => onOpenModal(p)}
                  className="hover:bg-[#1A1A1A]/5 transition-colors cursor-pointer group"
                >
                  {/* Number & Fav */}
                  <td className="py-3 px-4 text-center text-[#1A1A1A]/60 font-mono font-bold text-[11px] border-r border-[#1A1A1A]/10">
                    {String(idx + 1).padStart(2, '0')}
                  </td>

                  {/* Title & Description */}
                  <td className="py-3 px-4 border-r border-[#1A1A1A]/10">
                    <div className="font-serif italic font-bold text-base text-[#1A1A1A] group-hover:text-[#FF3E00] transition-colors leading-tight">
                      {p.title}
                    </div>
                    <div className="text-[#1A1A1A]/60 text-[11px] line-clamp-1 mt-0.5 max-w-md font-medium">
                      {p.description || 'Curated high-fidelity interaction prompt'}
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4 border-r border-[#1A1A1A]/10">
                    <span className="px-2 py-0.5 border border-[#1A1A1A]/30 bg-white text-[#1A1A1A] text-[10px] font-mono font-bold uppercase">
                      {p.category || '-'}
                    </span>
                  </td>

                  {/* Platform */}
                  <td className="py-3 px-4 border-r border-[#1A1A1A]/10">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-bold uppercase border ${
                        p.platform === 'app'
                          ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white'
                          : 'border-[#1A1A1A] bg-white text-[#1A1A1A]'
                      }`}
                    >
                      {p.platform === 'app' ? (
                        <Smartphone className="w-3 h-3 text-[#FF3E00]" />
                      ) : (
                        <Globe className="w-3 h-3" />
                      )}
                      {p.platform === 'app' ? 'App' : 'Web'}
                    </span>
                  </td>

                  {/* Tier */}
                  <td className="py-3 px-4 border-r border-[#1A1A1A]/10">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase border ${
                        p.is_free
                          ? 'border-[#FF3E00] bg-[#FF3E00] text-white'
                          : 'border-[#1A1A1A] bg-white text-[#1A1A1A]'
                      }`}
                    >
                      {p.is_free ? t.freeBadge : t.premiumBadge}
                    </span>
                  </td>

                  {/* Characters */}
                  <td className="py-3 px-4 text-right font-mono text-[#1A1A1A]/60 text-[11px] font-semibold border-r border-[#1A1A1A]/10">
                    {p.prompt_text ? `${(p.prompt_text.length / 1000).toFixed(1)}k` : '0'} chars
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      {/* Copy */}
                      <button
                        onClick={(e) => handleCopy(p, e)}
                        className={`p-1.5 border transition-all cursor-pointer ${
                          isCopied
                            ? 'border-[#FF3E00] bg-[#FF3E00] text-white'
                            : 'border-[#1A1A1A] bg-[#1A1A1A] hover:bg-[#FF3E00] hover:border-[#FF3E00] text-white'
                        }`}
                        title="Copy Prompt"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>

                      {/* Remix */}
                      <button
                        onClick={() => onOpenRemix(p)}
                        className="p-1.5 border border-[#1A1A1A] bg-white hover:bg-[#1A1A1A] text-[#1A1A1A] hover:text-white transition-colors cursor-pointer"
                        title="Remix Prompt"
                      >
                        <Code2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Favorite */}
                      <button
                        onClick={() => {
                          onToggleFavorite(p.id);
                          onToast(isFav ? 'Removed from favorites' : 'Saved to favorites');
                        }}
                        className={`p-1.5 border transition-colors cursor-pointer ${
                          isFav
                            ? 'border-[#FF3E00] bg-[#FF3E00] text-white'
                            : 'border-[#1A1A1A]/40 bg-white text-[#1A1A1A]/50 hover:text-[#FF3E00] hover:border-[#FF3E00]'
                        }`}
                        title="Toggle Favorite"
                      >
                        <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-white' : ''}`} />
                      </button>

                      {/* View Modal */}
                      <button
                        onClick={() => onOpenModal(p)}
                        className="p-1.5 border border-[#1A1A1A] bg-white hover:bg-[#1A1A1A] text-[#1A1A1A] hover:text-white transition-colors cursor-pointer"
                        title="Inspect Prompt"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
