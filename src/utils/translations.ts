export type Language = 'en' | 'zh';

export interface TranslationDictionary {
  // Navigation & General
  brandTitle: string;
  brandSubtitle: string;
  volLabel: string;
  tabGallery: string;
  tabAnalysis: string;
  tabAnalysisBadge: string;
  tabRemixer: string;
  tabSaved: string;
  exportBtn: string;
  exportTitle: string;
  exportJson: string;
  exportMd: string;
  exportCsv: string;
  translateBtn: string;
  translateTooltip: string;
  quickSearchBtn: string;
  quickSearchKbd: string;

  // Stats Banner
  bannerSource: string;
  bannerTitle: string;
  bannerDesc: string;
  statTotal: string;
  statWebVsApp: string;
  statFreeTier: string;
  inspireMeBtn: string;
  hotCategories: string;

  // Filter Bar
  searchPlaceholder: string;
  searchAria: string;
  quickSearchHint: string;
  sortLabel: string;
  sortDefault: string;
  sortTitleAsc: string;
  sortTitleDesc: string;
  sortLengthDesc: string;
  sortLengthAsc: string;
  platformAll: string;
  platformWeb: string;
  platformApp: string;
  tierAll: string;
  tierFree: string;
  tierPremium: string;
  categoryAll: string;
  typeAll: string;
  tagAll: string;
  resetFilters: string;
  activeFiltersCount: string;
  showingResults: string;
  promptsCount: string;
  noMatchTitle: string;
  noMatchDesc: string;
  clearFiltersBtn: string;
  loadMoreBtn: string;
  showAllBtn: string;
  remainingCount: string;

  // Saved / Favorites
  favoritesTitle: string;
  favoritesSubtitle: string;
  emptyFavoritesTitle: string;
  emptyFavoritesDesc: string;

  // Prompt Card & Actions
  copyPromptBtn: string;
  copiedBtn: string;
  remixBtn: string;
  inspectBtn: string;
  charsLabel: string;
  freeBadge: string;
  premiumBadge: string;

  // Prompt Modal
  modalTitle: string;
  tabFullPrompt: string;
  tabAiStudio: string;
  tabExtracted: string;
  tabRemix: string;
  copyAiStudioBtn: string;
  copyFullBtn: string;
  prevPromptBtn: string;
  nextPromptBtn: string;
  fontAnalysisTitle: string;
  assetAnalysisTitle: string;
  featuresAnalysisTitle: string;
  noFontsFound: string;
  noAssetsFound: string;

  // Prompt Remixer
  remixerTitle: string;
  remixerSubtitle: string;
  selectBasePrompt: string;
  brandInputLabel: string;
  brandInputPlaceholder: string;
  domainLabel: string;
  domainPlaceholder: string;
  accentColorLabel: string;
  frameworkLabel: string;
  resetRemixerBtn: string;
  copyRemixedBtn: string;
  remixedPreviewTitle: string;

  // Luxury Analysis (设计密码)
  analysisHeroSubtitle: string;
  analysisHeroTitle: string;
  analysisHeroDesc: string;
  statSampleCount: string;
  statSampleSub: string;
  statTopRhetoric: string;
  statTopRhetoricSub: string;
  statHeroRatio: string;
  statHeroRatioSub: string;
  statSignatureBezier: string;
  statSignatureBezierSub: string;

  rhetoricChartTitle: string;
  rhetoricChartDesc: string;
  techChartTitle: string;
  techChartDesc: string;

  principlesTitle: string;
  principlesSubtitle: string;
  p1Title: string;
  p1Desc: string;
  p2Title: string;
  p2Desc: string;
  p3Title: string;
  p3Desc: string;
  p4Title: string;
  p4Desc: string;
  p5Title: string;
  p5Desc: string;
  p6Title: string;
  p6Desc: string;

  typographyTitle: string;
  typographySubtitle: string;
  typeRecipe1Title: string;
  typeRecipe1Body: string;
  typeRecipe1Display: string;
  typeRecipe1Vibe: string;
  typeRecipe2Title: string;
  typeRecipe2Body: string;
  typeRecipe2Display: string;
  typeRecipe2Vibe: string;
  typeRecipe3Title: string;
  typeRecipe3Body: string;
  typeRecipe3Display: string;
  typeRecipe3Vibe: string;
  bodyUiLabel: string;
  headingAccentLabel: string;
  atmosphereLabel: string;

  snippetsTitle: string;
  snippet1Title: string;
  snippet1Desc: string;
  snippet1Btn: string;
  snippet2Title: string;
  snippet2Desc: string;
  snippet2Btn: string;

  // Table View Headers
  thIndex: string;
  thTitleSummary: string;
  thCategory: string;
  thPlatform: string;
  thTier: string;
  thSize: string;
  thActions: string;

  // Quick Search Modal
  searchModalTitle: string;
  searchModalPlaceholder: string;
  searchModalEscHint: string;
  searchModalResults: string;
  searchModalNoResults: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    // Navigation & General
    brandTitle: 'MotionSites.',
    brandSubtitle: 'Curated Artistic Interaction Prompts',
    volLabel: 'Vol. 04',
    tabGallery: 'Gallery',
    tabAnalysis: 'Design Secrets',
    tabAnalysisBadge: 'Deconstructed',
    tabRemixer: 'Remixer',
    tabSaved: 'Saved',
    exportBtn: 'Export',
    exportTitle: 'Export 328 Prompts',
    exportJson: 'JSON Dataset',
    exportMd: 'Markdown Document',
    exportCsv: 'CSV Spreadsheet',
    translateBtn: 'English',
    translateTooltip: 'Translate Chinese texts to English (No AI required)',
    quickSearchBtn: 'Quick Search',
    quickSearchKbd: '⌘K',

    // Stats Banner
    bannerSource: 'Source: xianxian-sensen / Vol. 04',
    bannerTitle: 'MotionSites.',
    bannerDesc:
      'A curated repository of 328 high-fidelity interaction prompts for generative motion design, Canvas physics spotlights, and luxury spatial UI.',
    statTotal: 'TOTAL PROMPTS',
    statWebVsApp: 'WEB / APP',
    statFreeTier: 'FREE TIER',
    inspireMeBtn: 'Inspire Me (Random Prompt)',
    hotCategories: 'Hot Categories:',

    // Filter Bar
    searchPlaceholder: 'Search prompts by keyword, effect (e.g. spotlight, canvas, bento), title or description...',
    searchAria: 'Search prompts',
    quickSearchHint: 'Press / or ⌘K to search instantly',
    sortLabel: 'Sort Order',
    sortDefault: 'Sort: Curated Index',
    sortTitleAsc: 'Title: A to Z',
    sortTitleDesc: 'Title: Z to A',
    sortLengthDesc: 'Detail: Longest First',
    sortLengthAsc: 'Detail: Concise First',
    platformAll: 'All Platforms',
    platformWeb: 'Websites',
    platformApp: 'Mobile Apps',
    tierAll: 'All Tiers',
    tierFree: 'Free Only',
    tierPremium: 'Premium Only',
    categoryAll: 'All Categories',
    typeAll: 'All Types',
    tagAll: 'All Features',
    resetFilters: 'Reset Filters',
    activeFiltersCount: 'filters active',
    showingResults: 'Showing',
    promptsCount: 'prompts',
    noMatchTitle: 'No prompts match your criteria',
    noMatchDesc: 'Try adjusting your search terms, clearing selected tags, or switching categories.',
    clearFiltersBtn: 'Clear All Filters',
    loadMoreBtn: 'Load More Prompts',
    showAllBtn: 'Show All Prompts',
    remainingCount: 'remaining',

    // Saved / Favorites
    favoritesTitle: 'Saved Favorite Prompts',
    favoritesSubtitle: 'bookmarked prompts stored locally in your workspace',
    emptyFavoritesTitle: 'No saved favorites yet',
    emptyFavoritesDesc: 'Click the heart icon on any prompt card to bookmark it for your project.',

    // Prompt Card & Actions
    copyPromptBtn: 'Copy Prompt',
    copiedBtn: 'Copied!',
    remixBtn: 'Remix',
    inspectBtn: 'Inspect',
    charsLabel: 'chars',
    freeBadge: 'Free',
    premiumBadge: 'Premium',

    // Prompt Modal
    modalTitle: 'Prompt Inspector',
    tabFullPrompt: 'Complete Prompt',
    tabAiStudio: 'AI Studio Ready',
    tabExtracted: 'Architecture & Assets',
    tabRemix: 'Customizer',
    copyAiStudioBtn: 'Copy AI Studio Prompt',
    copyFullBtn: 'Copy Raw Prompt',
    prevPromptBtn: 'Previous Prompt',
    nextPromptBtn: 'Next Prompt',
    fontAnalysisTitle: 'Typography Stack Found in Prompt',
    assetAnalysisTitle: 'External Asset & Media URLs',
    featuresAnalysisTitle: 'Extracted Design & Motion Tags',
    noFontsFound: 'No explicit standard font names matched; relies on system sans-serif hierarchy.',
    noAssetsFound: 'Zero external image dependencies; purely procedural CSS/Canvas geometry.',

    // Prompt Remixer
    remixerTitle: 'Prompt Remixer & Customizer',
    remixerSubtitle:
      'Customize any of the 328 MotionSites design prompts for your brand, industry, color theme, and tech stack in seconds.',
    selectBasePrompt: 'Select Base Prompt from Repository',
    brandInputLabel: 'Brand / Project Name',
    brandInputPlaceholder: 'e.g. Lumina, Veloce, Vertex',
    domainLabel: 'Industry Domain',
    domainPlaceholder: 'e.g. AI Intelligence, FinTech, Luxury Fragrance, Spatial Studio',
    accentColorLabel: 'Primary Accent Color Theme',
    frameworkLabel: 'Target Tech Stack & Architecture',
    resetRemixerBtn: 'Reset to Defaults',
    copyRemixedBtn: 'Copy Customized Prompt',
    remixedPreviewTitle: 'Live Generated Prompt Output',

    // Luxury Analysis (设计密码)
    analysisHeroSubtitle: 'The Engineering & Aesthetic Methodology',
    analysisHeroTitle: 'The Deconstructed Design Secrets Behind MotionSites',
    analysisHeroDesc:
      'Through computational text mining and engineering deconstruction of all 328 MotionSites prompts, "luxury design" is revealed not as a superficial aesthetic, but as a quantifiable engineering framework: anchored by high-contrast gallery bases, controlled single-accent breathing tones, React + Tailwind physics damping, and 100dvh spotlight reveals.',
    statSampleCount: 'PROMPT DATASET',
    statSampleSub: '311 Websites + 17 Mobile Apps',
    statTopRhetoric: 'TOP RHETORIC',
    statTopRhetoricSub: 'Emphasis on restrained power',
    statHeroRatio: 'HERO / LANDING SHARE',
    statHeroRatioSub: 'First 3 seconds establish visual trust',
    statSignatureBezier: 'SIGNATURE EASING',
    statSignatureBezierSub: 'Apple-like organic damping',

    rhetoricChartTitle: 'Luxury Rhetoric & Keyword Frequency',
    rhetoricChartDesc:
      'Prompts consistently favor "restrained power" and "controlled friction" over complex gaudy animations, prioritizing breathing room and negative space.',
    techChartTitle: 'Motion Technology Distribution',
    techChartDesc:
      'Declarative component motion (CSS Keyframes and Framer Motion) constitutes 85%+ of templates, with HTML5 Canvas reserved for dynamic mask spotlights.',

    principlesTitle: '6 Production-Ready Luxury Design Principles',
    principlesSubtitle: 'Distilled from 328 real-world prompt templates, ready to apply directly to modern frontend engineering:',
    p1Title: 'Atmospheric Gallery Base + Single Breathing Accent',
    p1Desc:
      'Over 88% of high-craft templates utilize pure gallery bases (Warm White #FAF9F6 or Obsidian Black), punctuated by exactly ONE high-contrast breathing accent (e.g. International Orange #FF3E00). Never clutter with 3+ competing primary colors.',
    p2Title: 'Identity in Typography: Sans-Serif + Serif Contrast',
    p2Desc:
      'UI body elements use sober, objective sans-serifs (Instrument Sans / Inter). Hero headlines and focal keywords contrast with Playfair Display Italic to create dramatic tension between digital rigor and editorial warmth.',
    p3Title: 'Motion is Rhythmic Pacing, Not Loud Effects',
    p3Desc:
      'Eliminate arbitrary spins and flips. Employ intentional staggered delays (0.25s Title → 0.42s Subtitle → 0.70s Body → 0.85s Action CTA) so elements float upward like cinematic titles.',
    p4Title: '100dvh Viewport Lock + Spotlight Reveal',
    p4Desc:
      'Lock the initial viewport to 100dvh. Pair with a lerped mouse spotlight (Canvas maskImage) that gently reveals underlying structural grids or subtle textures as the user explores.',
    p5Title: 'Tactile Micro-Borders & Sharp Architectural Shadows',
    p5Desc:
      'Clean 1-2px solid geometric borders combined with crisp isometric offset shadows (e.g. shadow-[4px_4px_0px_#1A1A1A]) evoke Swiss poster design and physical print craft.',
    p6Title: 'Tactile Physical Feedback on Interaction',
    p6Desc:
      'Buttons translate diagonally (translate-x-0.5 translate-y-0.5) with instantaneous color inversions on hover/active states, delivering the satisfying tactile feedback of physical switches.',

    typographyTitle: '3 Signature Luxury Typography Recipes',
    typographySubtitle: 'Copy and integrate these curated font pairings directly into your design system for instant visual elevation:',
    typeRecipe1Title: 'Modern Sans + Classical Serif (Golden Ratio Pairing)',
    typeRecipe1Body: 'Instrument Sans / Inter (UI Body & Metadata)',
    typeRecipe1Display: 'Playfair Display / YoungSerif (Hero Headlines)',
    typeRecipe1Vibe: 'Editorial authority paired with high-fashion magazine humanist warmth.',
    typeRecipe2Title: 'Geometric Sans + Monospace (Technical Precision)',
    typeRecipe2Body: 'Space Grotesk / Outfit (UI Controls)',
    typeRecipe2Display: 'JetBrains Mono / GeistMono (Focal Numbers & Badges)',
    typeRecipe2Vibe: 'Cutting-edge AI intelligence, physics consoles, and financial engineering.',
    typeRecipe3Title: 'Humanist Sans + Architectural Serif (Heritage & Luxury)',
    typeRecipe3Body: 'Instrument Sans / Plus Jakarta (Copywriting)',
    typeRecipe3Display: 'Cinzel / Fraunces (Monumental Branding)',
    typeRecipe3Vibe: 'High fragrance, architectural studios, and contemporary gallery spaces.',
    bodyUiLabel: 'BODY & UI TEXT',
    headingAccentLabel: 'HEADINGS & EMPHASIS',
    atmosphereLabel: 'AESTHETIC VIBE:',

    snippetsTitle: 'Copyable Production Code Cheatsheets',
    snippet1Title: 'MotionSites Signature Blur-Rise Easing CSS',
    snippet1Desc: 'Physics-inspired keyframe curve with 10px Gaussian blur lift and cubic-bezier(0.16,1,0.3,1).',
    snippet1Btn: 'Copy CSS',
    snippet2Title: 'Lerped Mouse Follow Spotlight React Hook',
    snippet2Desc: 'Smooth 0.1 damping interpolation using requestAnimationFrame to eliminate cursor lag.',
    snippet2Btn: 'Copy Hook',

    // Table View Headers
    thIndex: 'INDEX',
    thTitleSummary: 'TITLE & SUMMARY',
    thCategory: 'CATEGORY',
    thPlatform: 'PLATFORM',
    thTier: 'TIER',
    thSize: 'SIZE',
    thActions: 'ACTIONS',

    // Quick Search Modal
    searchModalTitle: 'Instant Prompt Search',
    searchModalPlaceholder: 'Type any keyword, component (e.g. Hero, Bento, 3D, Canvas)...',
    searchModalEscHint: 'Press ESC to close',
    searchModalResults: 'Matching Prompts',
    searchModalNoResults: 'No prompts match your query.',
  },

  zh: {
    // Navigation & General
    brandTitle: 'MotionSites.',
    brandSubtitle: '艺术动效交互提示词典藏库',
    volLabel: 'Vol. 04',
    tabGallery: '提示词图库',
    tabAnalysis: '设计密码解构',
    tabAnalysisBadge: '深度研究',
    tabRemixer: '提示词重混器',
    tabSaved: '我的收藏',
    exportBtn: '导出数据集',
    exportTitle: '导出 328 条提示词',
    exportJson: 'JSON 格式',
    exportMd: 'Markdown 文档',
    exportCsv: 'CSV 表格',
    translateBtn: '中文',
    translateTooltip: '一键切换英文/中文对照（无需AI，本地静态转换）',
    quickSearchBtn: '快速搜索',
    quickSearchKbd: '⌘K',

    // Stats Banner
    bannerSource: '数据来源: xianxian-sensen / Vol. 04',
    bannerTitle: 'MotionSites.',
    bannerDesc:
      '收录 328 条高保真交互与动效设计提示词，涵盖 Canvas 物理探照灯、艺术化微交互与高奢空间 UI。',
    statTotal: '收录总数',
    statWebVsApp: '网站 / APP',
    statFreeTier: '免费额度',
    inspireMeBtn: '灵感抽卡 (随机提示词)',
    hotCategories: '热门分类:',

    // Filter Bar
    searchPlaceholder: '搜索提示词关键字、特效 (如 spotlight, canvas, bento)、标题或描述...',
    searchAria: '搜索提示词',
    quickSearchHint: '按 / 或 ⌘K 随时快速呼出搜索',
    sortLabel: '排序方式',
    sortDefault: '默认: 精选索引',
    sortTitleAsc: '标题: A 到 Z',
    sortTitleDesc: '标题: Z 到 A',
    sortLengthDesc: '详尽度: 最长优先',
    sortLengthAsc: '详尽度: 精简优先',
    platformAll: '全部平台',
    platformWeb: '网站 Web',
    platformApp: '移动 App',
    tierAll: '全部级别',
    tierFree: '仅看免费',
    tierPremium: '仅看高级',
    categoryAll: '全部分类',
    typeAll: '全部类型',
    tagAll: '全部特征',
    resetFilters: '重置筛选',
    activeFiltersCount: '个已激活过滤项',
    showingResults: '已找到',
    promptsCount: '条提示词',
    noMatchTitle: '未找到符合条件的提示词',
    noMatchDesc: '尝试更换关键词、清除特定标签筛选，或切换所属分类。',
    clearFiltersBtn: '清空所有筛选条件',
    loadMoreBtn: '加载更多提示词',
    showAllBtn: '展开全部提示词',
    remainingCount: '条未展示',

    // Saved / Favorites
    favoritesTitle: '已收藏的提示词',
    favoritesSubtitle: '条本地持久化书签已保存在您的工作空间',
    emptyFavoritesTitle: '暂无收藏的提示词',
    emptyFavoritesDesc: '在任意提示词卡片上点击红心图标即可快速收藏到此列表。',

    // Prompt Card & Actions
    copyPromptBtn: '复制提示词',
    copiedBtn: '已复制！',
    remixBtn: '重混定制',
    inspectBtn: '深入查看',
    charsLabel: '字符',
    freeBadge: '免费',
    premiumBadge: '高级',

    // Prompt Modal
    modalTitle: '提示词检视器',
    tabFullPrompt: '完整提示词',
    tabAiStudio: 'AI Studio 优化版',
    tabExtracted: '架构与素材萃取',
    tabRemix: '快速定制',
    copyAiStudioBtn: '复制 AI Studio 提示词',
    copyFullBtn: '复制原始提示词',
    prevPromptBtn: '上一条',
    nextPromptBtn: '下一条',
    fontAnalysisTitle: '提示词中识别到的字体栈',
    assetAnalysisTitle: '外部素材与媒体引用链接',
    featuresAnalysisTitle: '提取的动效与视觉标签',
    noFontsFound: '未检测到显式特殊字体名，默认采用系统无衬线字体层级。',
    noAssetsFound: '零外部图片依赖，完全由 CSS / Canvas 几何逻辑纯代码渲染。',

    // Prompt Remixer
    remixerTitle: '提示词重混与定制器',
    remixerSubtitle:
      '快速将 328 条 MotionSites 顶级提示词定制为适合您自己的品牌、行业、色彩方案与技术架构。',
    selectBasePrompt: '从仓库选择基础提示词',
    brandInputLabel: '品牌或项目名称',
    brandInputPlaceholder: '例如: Lumina, Veloce, Vertex',
    domainLabel: '所属行业领域',
    domainPlaceholder: '例如: 人工智能、金融科技、高端香氛、空间设计',
    accentColorLabel: '主点缀呼吸色调',
    frameworkLabel: '目标技术栈架构',
    resetRemixerBtn: '重置为默认值',
    copyRemixedBtn: '复制定制后的提示词',
    remixedPreviewTitle: '实时生成的新提示词输出',

    // Luxury Analysis (设计密码)
    analysisHeroSubtitle: '工程与美学方法论',
    analysisHeroTitle: 'MotionSites 提示词中的“高级感”设计密码',
    analysisHeroDesc:
      '通过对 328 条 MotionSites 提示词的深度文本挖掘与工程解构，我们发现“高级感”并非单一视觉滤镜，而是一套严密可量化的设计工程系统：以高对比暖调/深邃基底 + 单一高对比呼吸点缀色为底色，以 React + Tailwind + 精准阻尼缓动为骨架，以 100dvh 全屏首屏 + 探照灯光斑揭示掌控前3秒视觉心智。',
    statSampleCount: '分析提示词样本',
    statSampleSub: '覆盖 311 网站 + 17 App',
    statTopRhetoric: '最高频修辞',
    statTopRhetoricSub: '强调有节制张力与克制留白',
    statHeroRatio: '首屏/Hero 占比',
    statHeroRatioSub: '首屏前3秒决定品质心智',
    statSignatureBezier: '核心缓动曲线',
    statSignatureBezierSub: 'Apple 级别物理阻尼感',

    rhetoricChartTitle: '高级感修辞词频统计',
    rhetoricChartDesc:
      '提示词中反复出现的并非“复杂的特效”，而是“克制的力量”。通过精简修辞明确表达了对呼吸感与空间留白的要求。',
    techChartTitle: '动效实现技术分布',
    techChartDesc:
      '声明式组件动效（CSS Keyframes 与 Framer Motion）占据 85%+，Canvas 2D 主要用于光斑探照灯（Spotlight Reveal），动效服务于叙事。',

    principlesTitle: '5 套可直接复用的高级感设计准则',
    principlesSubtitle: '提取自 328 条实战提示词的核心模式，适用于任何现代 Web & App 前端开发：',
    p1Title: '基底即高级，靠呼吸色点缀',
    p1Desc:
      '88% 的高分模板采用统一纯粹基调（如画廊白 #FAF9F6 或深邃黑），配以单一高对比呼吸点缀色（如国际橘 #FF3E00），绝不随意堆砌三种以上主题色。',
    p2Title: '字体即身份：无衬线 + 衬线混搭',
    p2Desc:
      'UI 正文使用极度冷静客观的 Instrument Sans / Inter；但在主标题或关键词上，采用 Playfair Display Italic 制造“数字冷峻与人文温润”的戏剧冲突。',
    p3Title: '动效是节奏，不是特效',
    p3Desc:
      '拒绝无意义的旋转翻转。使用时间错落（Staggered Delay: 0.25s 标题 → 0.42s 副标 → 0.70s 正文 → 0.85s 按钮），让元素如电影字幕般优雅逐层浮现。',
    p4Title: '全屏首屏 + 探照灯探奇',
    p4Desc:
      '使用 100dvh 锁定完整首屏。结合平滑插值的鼠标光斑（Canvas maskImage），在用户移动光标时隐隐揭示底层结构或质感纹理，形成高沉浸感。',
    p5Title: '极简物理微边框与阴影',
    p5Desc:
      '清晰的 1-2px 实线边框配合硬质几何投影（如 shadow-[4px_4px_0px_#1A1A1A]），建立极高辨识度的瑞士平面海报感与数字画廊空间。',
    p6Title: '物理感交互微动效反馈',
    p6Desc:
      '按钮 hover 产生 translate-x-0.5 translate-y-0.5 与色块即时反转，active 瞬时灵敏响应，提供如同实体按键的灵敏触感。',

    typographyTitle: '三大高奢字体搭配配方 (Typography Recipes)',
    typographySubtitle: '直接复制到您的项目中，立竿见影提升界面设计层级：',
    typeRecipe1Title: '现代无衬线 + 古典衬线 (黄金对比)',
    typeRecipe1Body: 'Instrument Sans / Inter (UI正文与元数据)',
    typeRecipe1Display: 'Playfair Display / YoungSerif (主标题大字)',
    typeRecipe1Vibe: '冷静理性与高定杂志的人文张力',
    typeRecipe2Title: '几何无衬线 + 等宽代码 (极客科技)',
    typeRecipe2Body: 'Space Grotesk / Outfit',
    typeRecipe2Display: 'JetBrains Mono / GeistMono',
    typeRecipe2Vibe: '前沿AI、Web3、物理系统控制台',
    typeRecipe3Title: '人文无衬线 + 建筑雕刻衬线 (奢侈品与艺术)',
    typeRecipe3Body: 'Instrument Sans / Plus Jakarta',
    typeRecipe3Display: 'Cinzel / Fraunces',
    typeRecipe3Vibe: '高端香氛、建筑空间、当代画廊',
    bodyUiLabel: '正文与 UI',
    headingAccentLabel: '标题与大字强调',
    atmosphereLabel: '气质氛围：',

    snippetsTitle: '可直接复制的代码工程速查表',
    snippet1Title: 'MotionSites 标志性模糊升起缓动 CSS',
    snippet1Desc: '带 10px 模糊起伏与 28px Y轴抬升的物理曲线，搭配 cubic-bezier(0.16,1,0.3,1)。',
    snippet1Btn: '复制 CSS',
    snippet2Title: '平滑插值鼠标跟随光斑 React Hook',
    snippet2Desc: '带 0.1 缓动系数的 requestAnimationFrame 鼠标跟随器，消除掉帧与卡顿。',
    snippet2Btn: '复制 Hook',

    // Table View Headers
    thIndex: '序号',
    thTitleSummary: '标题与摘要',
    thCategory: '分类',
    thPlatform: '平台',
    thTier: '级别',
    thSize: '体量',
    thActions: '快捷操作',

    // Quick Search Modal
    searchModalTitle: '即时快速搜索提示词',
    searchModalPlaceholder: '输入任意关键词、组件名称 (例如 Hero, Bento, 3D, Canvas)...',
    searchModalEscHint: '按 ESC 退出',
    searchModalResults: '匹配的提示词',
    searchModalNoResults: '未找到匹配的提示词。',
  },
};

// Static term translations for rhetoric chart and categories
export const rhetoricTranslations: Record<Language, { name: string; count: number; fill: string }[]> = {
  en: [
    { name: 'Bold (Restrained tension)', count: 218, fill: '#FF3E00' },
    { name: 'Interactive (Fluid respiration)', count: 68, fill: '#FF3E00' },
    { name: 'Cinematic (Film texture)', count: 53, fill: '#1A1A1A' },
    { name: 'Modern (Minimalist clarity)', count: 41, fill: '#333333' },
    { name: 'Sleek (Polished micro-flow)', count: 32, fill: '#555555' },
    { name: 'Minimalist (Generous whitespace)', count: 28, fill: '#777777' },
    { name: 'Immersive (Spatial depth)', count: 24, fill: '#222222' },
  ],
  zh: [
    { name: 'bold (有力/张力)', count: 218, fill: '#FF3E00' },
    { name: 'interactive (交互呼吸)', count: 68, fill: '#FF3E00' },
    { name: 'cinematic (电影质感)', count: 53, fill: '#1A1A1A' },
    { name: 'modern (现代极简)', count: 41, fill: '#333333' },
    { name: 'sleek (流畅精致)', count: 32, fill: '#555555' },
    { name: 'minimalist (极简留白)', count: 28, fill: '#777777' },
    { name: 'immersive (沉浸空间)', count: 24, fill: '#222222' },
  ],
};

export const motionEngineTranslations: Record<Language, { name: string; value: number; color: string }[]> = {
  en: [
    { name: 'CSS Keyframes (Base Transitions)', value: 206, color: '#1A1A1A' },
    { name: 'Framer Motion (Physics Springs)', value: 70, color: '#FF3E00' },
    { name: 'HTML5 Canvas (Mask Spotlights)', value: 35, color: '#888888' },
    { name: 'GSAP Timeline (Orchestrated)', value: 17, color: '#cccccc' },
  ],
  zh: [
    { name: 'CSS Keyframes (基础关键帧)', value: 206, color: '#1A1A1A' },
    { name: 'Framer Motion (声明式物理)', value: 70, color: '#FF3E00' },
    { name: 'HTML5 Canvas (光斑探照灯)', value: 35, color: '#888888' },
    { name: 'GSAP Tween (序列时间轴)', value: 17, color: '#cccccc' },
  ],
};
