import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Smartphone, Globe, ArrowRight, CornerDownLeft, Sparkles, Tag } from 'lucide-react';
import { MotionPrompt } from '../types';
import { Language, translations } from '../utils/translations';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  prompts: MotionPrompt[];
  onSelectPrompt: (prompt: MotionPrompt) => void;
  lang: Language;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({
  isOpen,
  onClose,
  prompts,
  onSelectPrompt,
  lang,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const t = translations[lang];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const filtered = React.useMemo(() => {
    if (!query.trim()) {
      return prompts.slice(0, 10);
    }
    const q = query.toLowerCase();
    return prompts
      .filter((p) => {
        const titleMatch = (p.title || '').toLowerCase().includes(q);
        const descMatch = (p.description || '').toLowerCase().includes(q);
        const catMatch = (p.category || '').toLowerCase().includes(q);
        const textMatch = (p.prompt_text || '').toLowerCase().includes(q);
        const tagMatch = (p.extractedTags || []).some((t) => t.toLowerCase().includes(q));
        return titleMatch || descMatch || catMatch || textMatch || tagMatch;
      })
      .slice(0, 16);
  }, [prompts, query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation inside search modal
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        onSelectPrompt(filtered[selectedIndex]);
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Search Modal Card */}
      <div 
        className="relative w-full max-w-2xl bg-[#FAF9F6] border-2 border-[#1A1A1A] shadow-[8px_8px_0px_#1A1A1A] overflow-hidden flex flex-col z-10 animate-in fade-in zoom-in-95 duration-150"
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b-2 border-[#1A1A1A] bg-white">
          <Search className="w-5 h-5 text-[#FF3E00] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchModalPlaceholder}
            className="w-full bg-transparent text-sm sm:text-base font-medium text-[#1A1A1A] placeholder-[#1A1A1A]/40 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[#1A1A1A]/50 hover:text-[#1A1A1A] p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <div className="hidden sm:flex items-center gap-1 text-[10px] font-mono text-[#1A1A1A]/50 border border-[#1A1A1A]/30 px-2 py-0.5 bg-[#FAF9F6]">
            ESC
          </div>
        </div>

        {/* Quick Filter Tags Suggestions */}
        <div className="px-4 py-2 bg-[#FAF9F6] border-b border-[#1A1A1A]/20 flex items-center gap-2 flex-wrap text-[11px]">
          <span className="text-[9px] font-mono uppercase font-bold text-[#1A1A1A]/50">
            Quick Jump:
          </span>
          {['Spotlight', 'Landing Page', 'Bento', 'Canvas', 'Dark Theme', 'SaaS', '3D'].map((tag) => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              className="px-2 py-0.5 border border-[#1A1A1A]/30 bg-white hover:bg-[#1A1A1A] hover:text-white text-[10px] font-mono font-medium transition-colors cursor-pointer"
            >
              #{tag}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto divide-y divide-[#1A1A1A]/10 p-1">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-[#1A1A1A]/60 text-xs font-mono">
              {t.searchModalNoResults}
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectPrompt(item);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-3.5 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                    isSelected ? 'bg-[#1A1A1A] text-white' : 'hover:bg-[#1A1A1A]/5 text-[#1A1A1A]'
                  }`}
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-serif italic font-bold text-sm truncate">
                        {item.title}
                      </span>
                      <span
                        className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.2 border ${
                          isSelected
                            ? 'border-white/40 bg-white/20 text-white'
                            : 'border-[#1A1A1A]/30 bg-white text-[#1A1A1A]'
                        }`}
                      >
                        {item.category}
                      </span>
                      <span
                        className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.2 border ${
                          item.is_free
                            ? isSelected
                              ? 'border-[#FF3E00] bg-[#FF3E00] text-white'
                              : 'border-[#FF3E00] text-[#FF3E00] bg-white'
                            : isSelected
                            ? 'border-white/30 text-white/70'
                            : 'border-[#1A1A1A]/20 text-[#1A1A1A]/60'
                        }`}
                      >
                        {item.is_free ? 'Free' : 'Premium'}
                      </span>
                    </div>
                    <p
                      className={`text-[11px] truncate font-sans ${
                        isSelected ? 'text-white/80' : 'text-[#1A1A1A]/70'
                      }`}
                    >
                      {item.description || item.prompt_text.slice(0, 100)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[10px] font-mono ${
                        isSelected ? 'text-white/60' : 'text-[#1A1A1A]/40'
                      }`}
                    >
                      {item.platform === 'app' ? 'App' : 'Web'}
                    </span>
                    <ArrowRight
                      className={`w-4 h-4 transition-transform ${
                        isSelected ? 'translate-x-1 text-[#FF3E00]' : 'opacity-0'
                      }`}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-4 py-2 border-t border-[#1A1A1A]/20 bg-[#FAF9F6] flex items-center justify-between text-[10px] font-mono text-[#1A1A1A]/60">
          <span>
            {filtered.length} {t.promptsCount}
          </span>
          <span className="flex items-center gap-1">
            <span>Use ↑↓ to navigate</span>
            <CornerDownLeft className="w-3 h-3 ml-1" />
            <span>Enter to open</span>
          </span>
        </div>
      </div>
    </div>
  );
};
