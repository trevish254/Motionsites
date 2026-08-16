import React, { useState } from 'react';
import {
  TrendingUp,
  Activity,
  Layers,
  Code,
  Copy,
  Check,
  Type,
  Globe,
  Sparkles,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from 'recharts';
import { Language, translations, rhetoricTranslations, motionEngineTranslations } from '../utils/translations';

interface LuxuryAnalysisProps {
  onToast: (msg: string) => void;
  onFilterByCategory?: (category: string) => void;
  lang: Language;
  onToggleLanguage?: () => void;
}

export const LuxuryAnalysis: React.FC<LuxuryAnalysisProps> = ({
  onToast,
  onFilterByCategory,
  lang,
  onToggleLanguage,
}) => {
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  const t = translations[lang];

  const handleCopy = (text: string, key: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(key);
    onToast(`Copied ${label} snippet!`);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  // Data for Charts based on active language
  const rhetoricData = rhetoricTranslations[lang];
  const motionEngineData = motionEngineTranslations[lang];

  const fontPairs = [
    {
      title: t.typeRecipe1Title,
      uiFont: t.typeRecipe1Body,
      displayFont: t.typeRecipe1Display,
      vibe: t.typeRecipe1Vibe,
      example: 'Lithos, Lumina, Aether, MotionSites',
    },
    {
      title: t.typeRecipe2Title,
      uiFont: t.typeRecipe2Body,
      displayFont: t.typeRecipe2Display,
      vibe: t.typeRecipe2Vibe,
      example: 'NeuralWave, PulseEngine',
    },
    {
      title: t.typeRecipe3Title,
      uiFont: t.typeRecipe3Body,
      displayFont: t.typeRecipe3Display,
      vibe: t.typeRecipe3Vibe,
      example: 'Aura, Solstice, Maison',
    },
  ];

  const signatureBezierCode = `@keyframes artisticReveal {
  0% {
    opacity: 0;
    transform: translateY(28px);
    filter: blur(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}

.artistic-motion {
  opacity: 0;
  animation-fill-mode: forwards;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  animation-duration: 1.1s;
}`;

  const spotlightLerpCode = `// Signature Lerped Spotlight Tracking
const mouse = useRef({ x: -999, y: -999 });
const smooth = useRef({ x: -999, y: -999 });

useEffect(() => {
  const handleMove = (e: MouseEvent) => {
    mouse.current = { x: e.clientX, y: e.clientY };
  };
  window.addEventListener('mousemove', handleMove);

  let rafId: number;
  const loop = () => {
    // 0.1 damping interpolation
    smooth.current.x += (mouse.current.x - smooth.current.x) * 0.1;
    smooth.current.y += (mouse.current.y - smooth.current.y) * 0.1;
    setPos({ x: smooth.current.x, y: smooth.current.y });
    rafId = requestAnimationFrame(loop);
  };
  loop();

  return () => {
    window.removeEventListener('mousemove', handleMove);
    cancelAnimationFrame(rafId);
  };
}, []);`;

  return (
    <div className="space-y-10 pb-16 animate-in fade-in duration-200">
      {/* Hero Banner for Analysis */}
      <div className="border-2 border-[#1A1A1A] bg-[#FAF9F6] p-6 sm:p-10 shadow-[6px_6px_0px_#1A1A1A] space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 bg-[#FF3E00] rounded-full inline-block"></span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-[#1A1A1A]/70">
                {t.analysisHeroSubtitle}
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif italic font-light tracking-tight text-[#1A1A1A] leading-tight">
              {t.analysisHeroTitle}
            </h1>
            <p className="text-xs sm:text-sm text-[#1A1A1A]/80 leading-relaxed font-medium">
              {t.analysisHeroDesc}
            </p>
          </div>

          {/* Language Toggle Button on Analysis Page */}
          {onToggleLanguage && (
            <button
              onClick={onToggleLanguage}
              className="self-start flex items-center gap-2 px-3.5 py-2 border-2 border-[#1A1A1A] bg-white hover:bg-[#1A1A1A] hover:text-white text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-[3px_3px_0px_#1A1A1A] cursor-pointer shrink-0"
              title={t.translateTooltip}
            >
              <Globe className="w-4 h-4 text-[#FF3E00]" />
              <span>{lang === 'en' ? 'Switch to 中文' : 'Translate to English'}</span>
            </button>
          )}
        </div>

        {/* 4 Quick Stat Callouts */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t-2 border-[#1A1A1A]">
          <div className="border border-[#1A1A1A] bg-white p-4">
            <div className="text-[10px] font-mono uppercase font-bold text-[#1A1A1A]/60">
              {t.statSampleCount}
            </div>
            <div className="text-2xl sm:text-3xl font-mono font-bold text-[#1A1A1A] mt-1">
              328 <span className="text-xs font-sans font-normal opacity-70">Total</span>
            </div>
            <div className="text-[10px] font-mono text-[#1A1A1A]/50 mt-1">
              {t.statSampleSub}
            </div>
          </div>

          <div className="border border-[#1A1A1A] bg-white p-4">
            <div className="text-[10px] font-mono uppercase font-bold text-[#1A1A1A]/60">
              {t.statTopRhetoric}
            </div>
            <div className="text-2xl sm:text-3xl font-serif italic font-bold text-[#FF3E00] mt-1">
              "Bold" <span className="text-xs font-mono font-normal opacity-70 text-[#1A1A1A]">218</span>
            </div>
            <div className="text-[10px] font-mono text-[#1A1A1A]/50 mt-1">
              {t.statTopRhetoricSub}
            </div>
          </div>

          <div className="border border-[#1A1A1A] bg-white p-4">
            <div className="text-[10px] font-mono uppercase font-bold text-[#1A1A1A]/60">
              {t.statHeroRatio}
            </div>
            <div className="text-2xl sm:text-3xl font-mono font-bold text-[#1A1A1A] mt-1">
              46.0% <span className="text-xs font-mono font-normal opacity-70">151</span>
            </div>
            <div className="text-[10px] font-mono text-[#1A1A1A]/50 mt-1">
              {t.statHeroRatioSub}
            </div>
          </div>

          <div className="border border-[#1A1A1A] bg-white p-4">
            <div className="text-[10px] font-mono uppercase font-bold text-[#1A1A1A]/60">
              {t.statSignatureBezier}
            </div>
            <div className="text-xs font-mono font-bold text-[#FF3E00] mt-2 truncate">
              cubic-bezier(0.16,1,0.3,1)
            </div>
            <div className="text-[10px] font-mono text-[#1A1A1A]/50 mt-1">
              {t.statSignatureBezierSub}
            </div>
          </div>
        </div>
      </div>

      {/* Section 1: The Lexicon of Luxury & Motion Engines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Rhetoric Frequency */}
        <div className="border-2 border-[#1A1A1A] bg-[#FAF9F6] p-6 shadow-[4px_4px_0px_#1A1A1A]">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-[#FF3E00]" />
            <h2 className="text-xl font-serif italic font-bold text-[#1A1A1A]">
              {t.rhetoricChartTitle}
            </h2>
          </div>
          <p className="text-xs text-[#1A1A1A]/70 mb-6 leading-relaxed font-medium">
            {t.rhetoricChartDesc}
          </p>

          <div className="h-64 w-full bg-white p-3 border border-[#1A1A1A]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rhetoricData} layout="vertical" margin={{ left: 10, right: 20 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="rgba(26,26,26,0.1)" horizontal={false} />
                <XAxis type="number" stroke="#1A1A1A" fontSize={10} fontStyle="italic" />
                <YAxis dataKey="name" type="category" stroke="#1A1A1A" fontSize={10} width={150} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FAF9F6',
                    border: '2px solid #1A1A1A',
                    color: '#1A1A1A',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                  }}
                />
                <Bar dataKey="count" radius={[0, 0, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Motion Engines */}
        <div className="border-2 border-[#1A1A1A] bg-[#FAF9F6] p-6 shadow-[4px_4px_0px_#1A1A1A]">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-[#FF3E00]" />
            <h2 className="text-xl font-serif italic font-bold text-[#1A1A1A]">
              {t.techChartTitle}
            </h2>
          </div>
          <p className="text-xs text-[#1A1A1A]/70 mb-6 leading-relaxed font-medium">
            {t.techChartDesc}
          </p>

          <div className="h-64 w-full bg-white p-3 border border-[#1A1A1A] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={motionEngineData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {motionEngineData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#1A1A1A" strokeWidth={1} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FAF9F6',
                    border: '2px solid #1A1A1A',
                    color: '#1A1A1A',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-4 flex-wrap text-xs font-mono text-[#1A1A1A] pt-3">
            {motionEngineData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 border border-[#1A1A1A]" style={{ backgroundColor: d.color }}></span>
                <span className="text-[10px] font-bold">{d.name} ({d.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 2: 6 Golden Design Principles */}
      <div className="border-2 border-[#1A1A1A] bg-[#FAF9F6] p-6 sm:p-8 shadow-[6px_6px_0px_#1A1A1A] space-y-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif italic font-bold text-[#1A1A1A] flex items-center gap-2">
            <Layers className="w-6 h-6 text-[#FF3E00]" />
            {t.principlesTitle}
          </h2>
          <p className="text-xs sm:text-sm text-[#1A1A1A]/70 mt-1 font-medium">
            {t.principlesSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Principle 1 */}
          <div className="border-2 border-[#1A1A1A] bg-white p-5 space-y-3">
            <div className="w-8 h-8 border border-[#1A1A1A] bg-[#1A1A1A] text-white flex items-center justify-center font-serif italic font-bold text-sm">
              01
            </div>
            <h3 className="text-base font-bold text-[#1A1A1A]">{t.p1Title}</h3>
            <p className="text-xs text-[#1A1A1A]/75 leading-relaxed font-medium">
              {t.p1Desc}
            </p>
          </div>

          {/* Principle 2 */}
          <div className="border-2 border-[#1A1A1A] bg-white p-5 space-y-3">
            <div className="w-8 h-8 border border-[#1A1A1A] bg-[#1A1A1A] text-white flex items-center justify-center font-serif italic font-bold text-sm">
              02
            </div>
            <h3 className="text-base font-bold text-[#1A1A1A]">{t.p2Title}</h3>
            <p className="text-xs text-[#1A1A1A]/75 leading-relaxed font-medium">
              {t.p2Desc}
            </p>
          </div>

          {/* Principle 3 */}
          <div className="border-2 border-[#1A1A1A] bg-white p-5 space-y-3">
            <div className="w-8 h-8 border border-[#1A1A1A] bg-[#1A1A1A] text-white flex items-center justify-center font-serif italic font-bold text-sm">
              03
            </div>
            <h3 className="text-base font-bold text-[#1A1A1A]">{t.p3Title}</h3>
            <p className="text-xs text-[#1A1A1A]/75 leading-relaxed font-medium">
              {t.p3Desc}
            </p>
          </div>

          {/* Principle 4 */}
          <div className="border-2 border-[#1A1A1A] bg-white p-5 space-y-3">
            <div className="w-8 h-8 border border-[#1A1A1A] bg-[#1A1A1A] text-white flex items-center justify-center font-serif italic font-bold text-sm">
              04
            </div>
            <h3 className="text-base font-bold text-[#1A1A1A]">{t.p4Title}</h3>
            <p className="text-xs text-[#1A1A1A]/75 leading-relaxed font-medium">
              {t.p4Desc}
            </p>
          </div>

          {/* Principle 5 */}
          <div className="border-2 border-[#1A1A1A] bg-white p-5 space-y-3">
            <div className="w-8 h-8 border border-[#1A1A1A] bg-[#1A1A1A] text-white flex items-center justify-center font-serif italic font-bold text-sm">
              05
            </div>
            <h3 className="text-base font-bold text-[#1A1A1A]">{t.p5Title}</h3>
            <p className="text-xs text-[#1A1A1A]/75 leading-relaxed font-medium">
              {t.p5Desc}
            </p>
          </div>

          {/* Principle 6 */}
          <div className="border-2 border-[#1A1A1A] bg-white p-5 space-y-3">
            <div className="w-8 h-8 border border-[#1A1A1A] bg-[#1A1A1A] text-white flex items-center justify-center font-serif italic font-bold text-sm">
              06
            </div>
            <h3 className="text-base font-bold text-[#1A1A1A]">{t.p6Title}</h3>
            <p className="text-xs text-[#1A1A1A]/75 leading-relaxed font-medium">
              {t.p6Desc}
            </p>
          </div>
        </div>
      </div>

      {/* Section 3: Signature Typography Recipes */}
      <div className="border-2 border-[#1A1A1A] bg-[#FAF9F6] p-6 sm:p-8 shadow-[6px_6px_0px_#1A1A1A] space-y-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif italic font-bold text-[#1A1A1A] flex items-center gap-2">
            <Type className="w-6 h-6 text-[#FF3E00]" />
            {t.typographyTitle}
          </h2>
          <p className="text-xs sm:text-sm text-[#1A1A1A]/70 mt-1 font-medium">
            {t.typographySubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {fontPairs.map((pair, idx) => (
            <div
              key={idx}
              className="border-2 border-[#1A1A1A] bg-white p-5 flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 border border-[#1A1A1A] bg-[#1A1A1A] text-white">
                  Recipe {String(idx + 1).padStart(2, '0')}
                </span>
                <h3 className="text-sm font-bold text-[#1A1A1A] mt-3 mb-3">{pair.title}</h3>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 border border-[#1A1A1A] bg-[#FAF9F6]">
                    <span className="text-[#1A1A1A]/50 block text-[9px] font-mono uppercase font-bold">
                      {t.bodyUiLabel}
                    </span>
                    <span className="text-[#1A1A1A] font-mono font-bold">{pair.uiFont}</span>
                  </div>
                  <div className="p-2.5 border border-[#1A1A1A] bg-[#FAF9F6]">
                    <span className="text-[#1A1A1A]/50 block text-[9px] font-mono uppercase font-bold">
                      {t.headingAccentLabel}
                    </span>
                    <span className="text-[#FF3E00] font-serif italic font-bold text-base">{pair.displayFont}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-[#1A1A1A] text-[11px] text-[#1A1A1A]/70 font-medium">
                <span className="font-bold text-[#1A1A1A]">{t.atmosphereLabel}</span> {pair.vibe}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 4: Copyable Code Engineering Cheatsheets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Code Snippet 1 */}
        <div className="border-2 border-[#1A1A1A] bg-[#FAF9F6] p-6 shadow-[4px_4px_0px_#1A1A1A] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-[#FF3E00]" />
                <h3 className="text-sm font-bold text-[#1A1A1A] font-mono uppercase">
                  {t.snippet1Title}
                </h3>
              </div>
              <button
                onClick={() => handleCopy(signatureBezierCode, 'bezier', 'CSS Keyframes')}
                className="flex items-center gap-1 text-xs px-3 py-1 border border-[#1A1A1A] bg-[#1A1A1A] text-white hover:bg-[#FF3E00] hover:border-[#FF3E00] font-mono font-bold transition-all cursor-pointer"
              >
                {copiedSnippet === 'bezier' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSnippet === 'bezier' ? (lang === 'zh' ? '已复制' : 'Copied!') : t.snippet1Btn}</span>
              </button>
            </div>
            <p className="text-xs text-[#1A1A1A]/70 mb-3 font-medium">
              {t.snippet1Desc}
            </p>
          </div>
          <pre className="border-2 border-[#1A1A1A] bg-white p-4 font-mono text-[11px] text-[#1A1A1A] overflow-x-auto leading-relaxed">
            {signatureBezierCode}
          </pre>
        </div>

        {/* Code Snippet 2 */}
        <div className="border-2 border-[#1A1A1A] bg-[#FAF9F6] p-6 shadow-[4px_4px_0px_#1A1A1A] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-[#FF3E00]" />
                <h3 className="text-sm font-bold text-[#1A1A1A] font-mono uppercase">
                  {t.snippet2Title}
                </h3>
              </div>
              <button
                onClick={() => handleCopy(spotlightLerpCode, 'lerp', 'React Hook')}
                className="flex items-center gap-1 text-xs px-3 py-1 border border-[#1A1A1A] bg-[#1A1A1A] text-white hover:bg-[#FF3E00] hover:border-[#FF3E00] font-mono font-bold transition-all cursor-pointer"
              >
                {copiedSnippet === 'lerp' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSnippet === 'lerp' ? (lang === 'zh' ? '已复制' : 'Copied!') : t.snippet2Btn}</span>
              </button>
            </div>
            <p className="text-xs text-[#1A1A1A]/70 mb-3 font-medium">
              {t.snippet2Desc}
            </p>
          </div>
          <pre className="border-2 border-[#1A1A1A] bg-white p-4 font-mono text-[11px] text-[#1A1A1A] overflow-x-auto leading-relaxed">
            {spotlightLerpCode}
          </pre>
        </div>
      </div>
    </div>
  );
};
