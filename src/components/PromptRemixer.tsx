import React, { useState } from 'react';
import {
  Sliders,
  Copy,
  Check,
  RotateCcw,
  Bot,
  Layers,
  Palette,
  Type,
  Code2,
  Terminal,
} from 'lucide-react';
import { MotionPrompt } from '../types';
import { remixPrompt, formatForAIStudio } from '../utils/promptUtils';
import confetti from 'canvas-confetti';
import { Language, translations } from '../utils/translations';

interface PromptRemixerProps {
  prompts: MotionPrompt[];
  initialPrompt?: MotionPrompt | null;
  onToast: (msg: string) => void;
  lang?: Language;
}

export const PromptRemixer: React.FC<PromptRemixerProps> = ({
  prompts,
  initialPrompt,
  onToast,
  lang = 'en',
}) => {
  const defaultBasePrompt = initialPrompt || prompts[0] || null;
  const t = translations[lang];

  const [selectedPromptId, setSelectedPromptId] = useState<string>(
    defaultBasePrompt?.id || ''
  );
  const [brandName, setBrandName] = useState('Aether');
  const [industry, setIndustry] = useState('AI & Developer Cloud');
  const [colorTheme, setColorTheme] = useState('international-orange');
  const [framework, setFramework] = useState('React 18 + TypeScript + Vite + Tailwind CSS');
  const [fontPairing, setFontPairing] = useState('Instrument Sans + Playfair Display (Serif Accent)');
  const [includeAIWrapper, setIncludeAIWrapper] = useState(true);
  const [copied, setCopied] = useState(false);

  const currentBasePrompt =
    prompts.find((p) => p.id === selectedPromptId) || defaultBasePrompt;

  // Compute remixed prompt text
  const generatePrompt = () => {
    if (!currentBasePrompt) return '';

    let text = currentBasePrompt.prompt_text;

    // Apply custom brand name
    if (brandName.trim()) {
      text = text
        .replace(/Lithos/gi, brandName)
        .replace(/Aether/gi, brandName)
        .replace(/Nova/gi, brandName)
        .replace(/Lumina/gi, brandName);
    }

    // Apply color palette requirement at top
    const colorNotes: Record<string, string> = {
      'international-orange': '/* Primary Accent: International Orange (#FF3E00) with Warm Off-White (#FAF9F6) and Ink Black (#1A1A1A) */\n',
      'monochrome': '/* Primary Accent: Strict Monochrome (#1A1A1A / #FFFFFF) with High Contrast Geometry */\n',
      'violet': '/* Primary Accent: Electric Violet (#7C3AED) with Dark Canvas Matrix */\n',
      'emerald': '/* Primary Accent: Emerald Forest (#10B981) with Clean Glassmorphic Sheen */\n',
      'amber': '/* Primary Accent: Warm Amber Gold (#F59E0B) with Luxury Warm Undertones */\n',
      'rose': '/* Primary Accent: Editorial Rose (#F43F5E) with Subtle Glows */\n',
    };

    if (colorNotes[colorTheme]) {
      text = colorNotes[colorTheme] + text;
    }

    // Replace tech stack
    if (framework !== 'React 18 + TypeScript + Vite + Tailwind CSS') {
      text = text.replace(/React 18 \+ TypeScript \+ Vite \+ Tailwind CSS/gi, framework);
    }

    // Append font guidance
    text += `\n\n/* Typography Hierarchy Directives: Use ${fontPairing} */`;

    if (includeAIWrapper) {
      return formatForAIStudio({
        ...currentBasePrompt,
        title: `${brandName || currentBasePrompt.title} - Custom Component`,
        prompt_text: text,
      });
    }

    return text;
  };

  const remixedResult = generatePrompt();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(remixedResult);
      setCopied(true);
      onToast(lang === 'zh' ? '已复制定制后的提示词！' : 'Copied remixed prompt!');

      confetti({
        particleCount: 35,
        spread: 50,
        origin: { y: 0.6 },
        colors: ['#FF3E00', '#1A1A1A', '#555555'],
        disableForReducedMotion: true,
      });

      setTimeout(() => setCopied(false), 2000);
    } catch {
      onToast('Failed to copy');
    }
  };

  const handleReset = () => {
    setBrandName('Aether');
    setIndustry('AI & Developer Cloud');
    setColorTheme('international-orange');
    setFramework('React 18 + TypeScript + Vite + Tailwind CSS');
    setFontPairing('Instrument Sans + Playfair Display (Serif Accent)');
    setIncludeAIWrapper(true);
    onToast(lang === 'zh' ? '已重置为默认值' : 'Reset to default parameters');
  };

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="border-2 border-[#1A1A1A] bg-[#FAF9F6] p-6 sm:p-8 shadow-[6px_6px_0px_#1A1A1A] space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 border-2 border-[#1A1A1A] bg-[#1A1A1A] text-white">
            <Sliders className="w-5 h-5 text-[#FF3E00]" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif italic font-bold text-[#1A1A1A]">
              {t.remixerTitle}
            </h1>
            <p className="text-xs sm:text-sm text-[#1A1A1A]/70 font-medium">
              {t.remixerSubtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Control Panel (5 cols) & Live Output (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="border-2 border-[#1A1A1A] bg-[#FAF9F6] p-6 shadow-[4px_4px_0px_#1A1A1A] space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A]">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1A1A1A] flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#FF3E00]" />
                {lang === 'zh' ? '参数配置面板' : 'Customization Controls'}
              </span>
              <button
                onClick={handleReset}
                className="text-[10px] font-mono font-bold text-[#FF3E00] hover:text-[#1A1A1A] flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{t.resetRemixerBtn}</span>
              </button>
            </div>

            {/* Base Prompt Picker */}
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase text-[#1A1A1A] mb-1.5">
                {t.selectBasePrompt}
              </label>
              <select
                id="remix-base-prompt-select"
                value={selectedPromptId}
                onChange={(e) => setSelectedPromptId(e.target.value)}
                className="w-full bg-white border border-[#1A1A1A] p-2 text-xs font-semibold text-[#1A1A1A] focus:outline-none focus:border-[#FF3E00] cursor-pointer"
              >
                {prompts.map((p, idx) => (
                  <option key={p.id} value={p.id}>
                    #{String(idx + 1).padStart(3, '0')} - {p.title} ({p.category || 'UI'})
                  </option>
                ))}
              </select>
            </div>

            {/* Brand / Project Name */}
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase text-[#1A1A1A] mb-1.5">
                {t.brandInputLabel}
              </label>
              <input
                id="remix-brand-input"
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder={t.brandInputPlaceholder}
                className="w-full bg-white border border-[#1A1A1A] p-2 text-xs font-medium text-[#1A1A1A] focus:outline-none focus:border-[#FF3E00]"
              />
            </div>

            {/* Industry / Domain */}
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase text-[#1A1A1A] mb-1.5">
                {t.domainLabel}
              </label>
              <input
                id="remix-industry-input"
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder={t.domainPlaceholder}
                className="w-full bg-white border border-[#1A1A1A] p-2 text-xs font-medium text-[#1A1A1A] focus:outline-none focus:border-[#FF3E00]"
              />
            </div>

            {/* Accent Color Palette */}
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase text-[#1A1A1A] mb-1.5 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-[#FF3E00]" />
                {t.accentColorLabel}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'international-orange', label: 'Orange', dot: 'bg-[#FF3E00]' },
                  { id: 'monochrome', label: 'Ink Black', dot: 'bg-[#1A1A1A]' },
                  { id: 'violet', label: 'Violet', dot: 'bg-[#7c3aed]' },
                  { id: 'emerald', label: 'Emerald', dot: 'bg-[#10b981]' },
                  { id: 'amber', label: 'Amber', dot: 'bg-[#f59e0b]' },
                  { id: 'rose', label: 'Rose', dot: 'bg-[#f43f5e]' },
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setColorTheme(c.id)}
                    className={`flex items-center gap-1.5 p-2 border text-[10px] font-mono font-bold uppercase transition-all cursor-pointer ${
                      colorTheme === c.id
                        ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                        : 'bg-white border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A]/10'
                    }`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full border border-current ${c.dot}`} />
                    <span className="truncate">{c.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Target Tech Stack */}
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase text-[#1A1A1A] mb-1.5 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-[#FF3E00]" />
                {t.frameworkLabel}
              </label>
              <select
                id="remix-framework-select"
                value={framework}
                onChange={(e) => setFramework(e.target.value)}
                className="w-full bg-white border border-[#1A1A1A] p-2 text-xs font-medium text-[#1A1A1A] focus:outline-none focus:border-[#FF3E00] cursor-pointer"
              >
                <option value="React 18 + TypeScript + Vite + Tailwind CSS">
                  React 18 + TypeScript + Vite + Tailwind CSS
                </option>
                <option value="Next.js 14 (App Router) + TypeScript + Tailwind CSS">
                  Next.js 14 (App Router) + TypeScript + Tailwind CSS
                </option>
                <option value="Vue 3 + TypeScript + Vite + Tailwind CSS">
                  Vue 3 + TypeScript + Vite + Tailwind CSS
                </option>
                <option value="HTML5 + Tailwind CSS + Vanilla JS">
                  HTML5 + Tailwind CSS + Vanilla JS
                </option>
              </select>
            </div>

            {/* Font Pairings */}
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase text-[#1A1A1A] mb-1.5 flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-[#FF3E00]" />
                {lang === 'zh' ? '字体搭配组合' : 'Typography Pairing'}
              </label>
              <select
                id="remix-fonts-select"
                value={fontPairing}
                onChange={(e) => setFontPairing(e.target.value)}
                className="w-full bg-white border border-[#1A1A1A] p-2 text-xs font-medium text-[#1A1A1A] focus:outline-none focus:border-[#FF3E00] cursor-pointer"
              >
                <option value="Instrument Sans + Playfair Display (Serif Accent)">
                  Instrument Sans + Playfair Display (Artistic Flair)
                </option>
                <option value="Inter + YoungSerif (Editorial Luxury)">
                  Inter + YoungSerif (Editorial Luxury)
                </option>
                <option value="Space Grotesk + JetBrains Mono (Tech/Dev)">
                  Space Grotesk + JetBrains Mono (Tech/Dev)
                </option>
                <option value="Plus Jakarta + Cinzel (High Luxury)">
                  Plus Jakarta + Cinzel (High Luxury)
                </option>
              </select>
            </div>

            {/* AI Agent System Prompt Wrapper Toggle */}
            <div className="pt-2 border-t border-[#1A1A1A]/20">
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-[#FF3E00]" />
                  <div>
                    <div className="text-xs font-bold text-[#1A1A1A]">AI Studio / Gemini Wrapper</div>
                    <div className="text-[10px] text-[#1A1A1A]/60">Include prompt engineering directives</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={includeAIWrapper}
                  onChange={(e) => setIncludeAIWrapper(e.target.checked)}
                  className="w-4 h-4 accent-[#FF3E00] cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Live Output & 1-Click Copy (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="border-2 border-[#1A1A1A] bg-[#FAF9F6] p-6 shadow-[4px_4px_0px_#1A1A1A] flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#FF3E00]" />
                  <h3 className="text-xs font-mono font-bold uppercase text-[#1A1A1A]">
                    {t.remixedPreviewTitle} ({remixedResult.length} {t.charsLabel})
                  </h3>
                </div>

                <button
                  id="btn-copy-remix"
                  onClick={handleCopy}
                  className={`flex items-center gap-1.5 px-4 py-2 border-2 border-[#1A1A1A] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
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
                      <span>{t.copyRemixedBtn}</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs text-[#1A1A1A]/70 mb-3 leading-relaxed font-medium">
                Ready to paste into Google AI Studio, Gemini, or coding agents to build this exact customized component immediately.
              </p>
            </div>

            {/* Live Prompt Box */}
            <div className="border-2 border-[#1A1A1A] bg-white p-4 font-mono text-xs sm:text-[13px] text-[#1A1A1A] whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-y-auto selection:bg-[#FF3E00] selection:text-white">
              {remixedResult}
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-[#1A1A1A]/60 pt-3 border-t border-[#1A1A1A]/20 mt-4">
              <span>READY FOR AI STUDIO GENERATION</span>
              <span className="font-bold text-[#FF3E00]">~{Math.round(remixedResult.length / 4)} TOKENS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
