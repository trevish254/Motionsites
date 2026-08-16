import React from 'react';
import { Shuffle, Flame, ArrowUpRight } from 'lucide-react';
import { Language, translations } from '../utils/translations';

interface StatsBannerProps {
  total: number;
  freeCount: number;
  premiumCount: number;
  websiteCount: number;
  appCount: number;
  favoritesCount: number;
  onRandomPrompt: () => void;
  onSelectCategory: (category: string) => void;
  lang: Language;
}

export const StatsBanner: React.FC<StatsBannerProps> = ({
  total,
  freeCount,
  premiumCount,
  websiteCount,
  appCount,
  favoritesCount,
  onRandomPrompt,
  onSelectCategory,
  lang,
}) => {
  const t = translations[lang];

  const topCategories = [
    { name: 'Landing Page', count: 60 },
    { name: 'Hero', count: 57 },
    { name: 'SaaS', count: 28 },
    { name: 'Agency', count: 9 },
    { name: 'Features', count: 8 },
    { name: 'Pricing', count: 6 },
    { name: 'Portfolio', count: 5 },
  ];

  return (
    <div className="border-2 border-[#1A1A1A] bg-[#FAF9F6] p-6 sm:p-10 mb-8 relative overflow-hidden group">
      {/* Background Hero Video Asset */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute right-0 top-1/2 -translate-y-1/2 w-full md:w-[75%] lg:w-[65%] h-full object-cover object-center opacity-40 sm:opacity-55 mix-blend-multiply select-none"
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260802_081931_d0adfc37-7ace-4c83-939e-4a6e0e9d9763.mp4"
            type="video/mp4"
          />
        </video>

        {/* White / Neutral Gradient Blur Layers to blend with corners & edges */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FAF9F6] via-[#FAF9F6]/85 sm:via-[#FAF9F6]/60 to-transparent z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF9F6] via-transparent to-[#FAF9F6] z-[1]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(250,249,246,0.95)_0%,transparent_60%)] z-[1]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(250,249,246,0.95)_0%,transparent_60%)] z-[1]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(250,249,246,0.85)_0%,transparent_50%)] z-[1]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(250,249,246,0.95)_0%,transparent_60%)] z-[1]" />
        
        {/* Soft edge blur layer */}
        <div className="absolute inset-0 backdrop-blur-[0.5px] pointer-events-none z-[1]" />
      </div>

      {/* Decorative vertical line accent & Main Hero Content */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 border-b border-[#1A1A1A]">
        {/* Left Headline Section */}
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-[#FF3E00] rounded-full inline-block"></span>
            <span className="text-[10px] uppercase tracking-[0.4em] font-black opacity-60 font-mono">
              {t.bannerSource}
            </span>
          </div>
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-serif italic font-light tracking-tighter leading-[0.95] text-[#1A1A1A]">
            Motion<br className="hidden sm:inline" />Sites.
          </h1>
          <p className="text-xs sm:text-sm text-[#1A1A1A]/80 font-medium max-w-xl leading-relaxed pt-2">
            {t.bannerDesc}
          </p>
        </div>

        {/* Right Action and Stats Snapshot */}
        <div className="flex flex-col items-start lg:items-end gap-5">
          <div className="grid grid-cols-3 gap-4 border-l lg:border-l-0 lg:border-r border-[#1A1A1A] pl-4 lg:pl-0 lg:pr-4">
            <div>
              <span className="block text-[9px] uppercase font-mono font-bold opacity-50">
                {t.statTotal}
              </span>
              <span className="text-xl sm:text-2xl font-mono font-bold text-[#1A1A1A]">{total}</span>
            </div>
            <div>
              <span className="block text-[9px] uppercase font-mono font-bold opacity-50">
                {t.statWebVsApp}
              </span>
              <span className="text-xl sm:text-2xl font-mono font-bold text-[#1A1A1A]">{websiteCount}/{appCount}</span>
            </div>
            <div>
              <span className="block text-[9px] uppercase font-mono font-bold opacity-50">
                {t.statFreeTier}
              </span>
              <span className="text-xl sm:text-2xl font-mono font-bold text-[#FF3E00]">{freeCount}</span>
            </div>
          </div>

          <button
            id="btn-random-prompt"
            onClick={onRandomPrompt}
            className="flex items-center justify-center gap-2 px-5 py-3 border-2 border-[#1A1A1A] bg-[#1A1A1A] text-white hover:bg-[#FF3E00] hover:border-[#FF3E00] text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors shadow-[4px_4px_0px_#1A1A1A] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 cursor-pointer"
          >
            <Shuffle className="w-4 h-4" />
            <span>{t.inspireMeBtn}</span>
            <ArrowUpRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>

      {/* Quick Category Jump Chips */}
      <div className="relative z-10 flex items-center gap-2.5 flex-wrap pt-5">
        <span className="text-xs text-[#1A1A1A] font-bold uppercase tracking-widest flex items-center gap-1.5 mr-2 font-mono">
          <Flame className="w-4 h-4 text-[#FF3E00]" />
          {t.hotCategories}:
        </span>
        {topCategories.map((cat) => (
          <button
            key={cat.name}
            id={`btn-category-${cat.name.toLowerCase().replace(/\s+/g, '-')}`}
            onClick={() => onSelectCategory(cat.name)}
            className="text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 border-2 border-[#1A1A1A] bg-white text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-all flex items-center gap-2 cursor-pointer shadow-[2px_2px_0px_#1A1A1A] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5"
          >
            <span className="font-semibold text-[#1A1A1A] group-hover:text-white">{cat.name}</span>
            <span className="font-mono text-[10px] px-1.5 py-0.5 border border-[#1A1A1A]/30 bg-[#FAF9F6] text-[#1A1A1A] rounded-xs">
              {cat.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
