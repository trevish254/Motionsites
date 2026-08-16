import React, { useState, useMemo, useEffect } from 'react';
import { MotionPrompt, FilterState, ViewMode, ActiveTab } from './types';
import { ALL_PROMPTS } from './data/promptsData';
import { Navbar } from './components/Navbar';
import { StatsBanner } from './components/StatsBanner';
import { FilterBar } from './components/FilterBar';
import { PromptCard } from './components/PromptCard';
import { CompactListView } from './components/CompactListView';
import { PromptModal } from './components/PromptModal';
import { LuxuryAnalysis } from './components/LuxuryAnalysis';
import { PromptRemixer } from './components/PromptRemixer';
import { QuickSearchModal } from './components/QuickSearchModal';
import { Toast } from './components/Toast';
import { exportAsJSON, exportAsMarkdown, exportAsCSV } from './utils/promptUtils';
import { Language, translations } from './utils/translations';
import { Heart, AlertCircle, Sparkles } from 'lucide-react';

export default function App() {
  // Directly initialize from statically bundled and enriched dataset
  const [prompts] = useState<MotionPrompt[]>(ALL_PROMPTS);
  const [activeTab, setActiveTab] = useState<ActiveTab>('gallery');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [modalPrompt, setModalPrompt] = useState<MotionPrompt | null>(null);
  const [remixPrompt, setRemixPrompt] = useState<MotionPrompt | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState(48);
  const [isQuickSearchOpen, setIsQuickSearchOpen] = useState(false);

  // Language state (default to English as requested by user to translate Chinese text, with 1-click toggle)
  const [lang, setLang] = useState<Language>(() => {
    try {
      const savedLang = localStorage.getItem('motionsites_lang');
      return (savedLang === 'zh' || savedLang === 'en') ? (savedLang as Language) : 'en';
    } catch {
      return 'en';
    }
  });

  const t = translations[lang];

  const toggleLanguage = () => {
    setLang((prev) => {
      const next: Language = prev === 'en' ? 'zh' : 'en';
      try {
        localStorage.setItem('motionsites_lang', next);
      } catch (e) {
        console.error(e);
      }
      showToast(next === 'en' ? 'Translated to English' : '已切换为中文');
      return next;
    });
  };

  // Favorites in localStorage
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('motionsites_favorites');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    platform: 'all',
    tier: 'all',
    category: 'all',
    type: 'all',
    tag: 'all',
    sort: 'default',
    onlyFavorites: false,
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((curr) => (curr === msg ? null : curr));
    }, 2400);
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      try {
        localStorage.setItem('motionsites_favorites', JSON.stringify(Array.from(next)));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  // Global keyboard shortcut for Quick Search (⌘K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsQuickSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Compute available categories and tags
  const { categories, types, availableTags, freeCount, premiumCount, websiteCount, appCount } = useMemo(() => {
    const cats = new Set<string>();
    const typs = new Set<string>();
    const tagCountMap: Record<string, number> = {};
    let free = 0;
    let prem = 0;
    let web = 0;
    let app = 0;

    prompts.forEach((p) => {
      if (p.category) cats.add(p.category);
      if (p.type) typs.add(p.type);
      if (p.is_free) free++;
      else prem++;
      if (p.platform === 'app') app++;
      else web++;

      (p.extractedTags || []).forEach((t) => {
        tagCountMap[t] = (tagCountMap[t] || 0) + 1;
      });
    });

    const sortedTags = Object.entries(tagCountMap)
      .sort((a, b) => b[1] - a[1])
      .map(([t]) => t);

    return {
      categories: Array.from(cats).sort(),
      types: Array.from(typs).sort(),
      availableTags: sortedTags,
      freeCount: free,
      premiumCount: prem,
      websiteCount: web,
      appCount: app,
    };
  }, [prompts]);

  // Filter and sort prompts
  const filteredPrompts = useMemo(() => {
    return prompts.filter((p) => {
      // Favorites filter
      if ((filters.onlyFavorites || activeTab === 'favorites') && !favorites.has(p.id)) {
        return false;
      }

      // Platform filter
      if (filters.platform !== 'all' && p.platform !== filters.platform) {
        return false;
      }

      // Tier filter
      if (filters.tier === 'free' && !p.is_free) return false;
      if (filters.tier === 'premium' && p.is_free) return false;

      // Category filter
      if (filters.category !== 'all' && p.category !== filters.category) {
        return false;
      }

      // Type filter
      if (filters.type !== 'all' && p.type !== filters.type) {
        return false;
      }

      // Tag filter
      if (filters.tag !== 'all' && !(p.extractedTags || []).includes(filters.tag)) {
        return false;
      }

      // Search query
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchesTitle = (p.title || '').toLowerCase().includes(q);
        const matchesDesc = (p.description || '').toLowerCase().includes(q);
        const matchesCat = (p.category || '').toLowerCase().includes(q);
        const matchesType = (p.type || '').toLowerCase().includes(q);
        const matchesText = (p.prompt_text || '').toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesCat && !matchesType && !matchesText) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (filters.sort === 'title-asc') return a.title.localeCompare(b.title);
      if (filters.sort === 'title-desc') return b.title.localeCompare(a.title);
      if (filters.sort === 'length-desc') return (b.prompt_text?.length || 0) - (a.prompt_text?.length || 0);
      if (filters.sort === 'length-asc') return (a.prompt_text?.length || 0) - (b.prompt_text?.length || 0);
      return 0; // default order
    });
  }, [prompts, filters, favorites, activeTab]);

  // Modal navigation helpers
  const handleOpenModal = (p: MotionPrompt) => {
    setModalPrompt(p);
  };

  const handleOpenRemix = (p: MotionPrompt) => {
    setRemixPrompt(p);
    setActiveTab('remixer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevPrompt = () => {
    if (!modalPrompt) return;
    const currentIndex = filteredPrompts.findIndex((p) => p.id === modalPrompt.id);
    if (currentIndex > 0) {
      setModalPrompt(filteredPrompts[currentIndex - 1]);
    } else {
      setModalPrompt(filteredPrompts[filteredPrompts.length - 1]);
    }
  };

  const handleNextPrompt = () => {
    if (!modalPrompt) return;
    const currentIndex = filteredPrompts.findIndex((p) => p.id === modalPrompt.id);
    if (currentIndex < filteredPrompts.length - 1) {
      setModalPrompt(filteredPrompts[currentIndex + 1]);
    } else {
      setModalPrompt(filteredPrompts[0]);
    }
  };

  const handleRandomPrompt = () => {
    if (prompts.length === 0) return;
    const randomIndex = Math.floor(Math.random() * prompts.length);
    const chosen = prompts[randomIndex];
    setModalPrompt(chosen);
    showToast(`Inspiring you with "${chosen.title}"!`);
  };

  const handleExportAll = (type: 'json' | 'md' | 'csv') => {
    const listToExport = filteredPrompts.length > 0 ? filteredPrompts : prompts;
    if (type === 'json') exportAsJSON(listToExport);
    else if (type === 'md') exportAsMarkdown(listToExport);
    else if (type === 'csv') exportAsCSV(listToExport);
    showToast(`Exported ${listToExport.length} prompts as .${type}`);
  };

  const displayedPrompts = useMemo(() => {
    return filteredPrompts.slice(0, pageSize);
  }, [filteredPrompts, pageSize]);

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1A1A1A] flex flex-col selection:bg-[#FF3E00] selection:text-white font-sans">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'favorites') {
            setFilters((prev) => ({ ...prev, onlyFavorites: true }));
          } else {
            setFilters((prev) => ({ ...prev, onlyFavorites: false }));
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        totalCount={prompts.length}
        freeCount={freeCount}
        premiumCount={premiumCount}
        favoritesCount={favorites.size}
        onExportAll={handleExportAll}
        lang={lang}
        onToggleLanguage={toggleLanguage}
        onOpenQuickSearch={() => setIsQuickSearchOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-16">
        {/* VIEW 1 & 4: PROMPTS GALLERY & FAVORITES */}
        {(activeTab === 'gallery' || activeTab === 'favorites') && (
          <div>
            {/* Stats Banner only on main gallery */}
            {activeTab === 'gallery' && (
              <StatsBanner
                total={prompts.length}
                freeCount={freeCount}
                premiumCount={premiumCount}
                websiteCount={websiteCount}
                appCount={appCount}
                favoritesCount={favorites.size}
                onRandomPrompt={handleRandomPrompt}
                onSelectCategory={(cat) => {
                  setFilters((prev) => ({ ...prev, category: cat }));
                  showToast(`Filtered by ${cat}`);
                }}
                lang={lang}
              />
            )}

            {/* Favorites Header if activeTab === 'favorites' */}
            {activeTab === 'favorites' && (
              <div className="border-2 border-[#1A1A1A] bg-[#FAF9F6] p-6 mb-6 flex items-center justify-between shadow-[4px_4px_0px_#1A1A1A]">
                <div className="flex items-center gap-3">
                  <div className="p-2 border-2 border-[#1A1A1A] bg-[#FF3E00] text-white">
                    <Heart className="w-6 h-6 fill-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-serif italic font-bold text-[#1A1A1A]">
                      {t.favoritesTitle}
                    </h1>
                    <p className="text-xs font-mono text-[#1A1A1A]/70 uppercase">
                      {favorites.size} {t.favoritesSubtitle}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Filter and Search Bar */}
            <FilterBar
              filters={filters}
              setFilters={setFilters}
              categories={categories}
              types={types}
              totalResults={filteredPrompts.length}
              totalPrompts={prompts.length}
              viewMode={viewMode}
              setViewMode={setViewMode}
              availableTags={availableTags}
              lang={lang}
              onOpenQuickSearch={() => setIsQuickSearchOpen(true)}
            />

            {/* Prompts Display */}
            {filteredPrompts.length === 0 ? (
              <div className="border-2 border-[#1A1A1A] bg-white p-12 text-center space-y-4 my-8 shadow-[4px_4px_0px_#1A1A1A]">
                <div className="w-12 h-12 mx-auto border-2 border-[#1A1A1A] bg-[#FAF9F6] flex items-center justify-center text-[#FF3E00]">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-serif italic font-bold text-[#1A1A1A]">
                  {t.noMatchTitle}
                </h3>
                <p className="text-xs text-[#1A1A1A]/70 max-w-md mx-auto font-medium">
                  {t.noMatchDesc}
                </p>
                <button
                  onClick={() =>
                    setFilters({
                      searchQuery: '',
                      platform: 'all',
                      tier: 'all',
                      category: 'all',
                      type: 'all',
                      tag: 'all',
                      sort: 'default',
                      onlyFavorites: false,
                    })
                  }
                  className="px-4 py-2 border-2 border-[#1A1A1A] bg-[#1A1A1A] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#FF3E00] hover:border-[#FF3E00] transition-colors cursor-pointer"
                >
                  {t.clearFiltersBtn}
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedPrompts.map((p) => (
                  <PromptCard
                    key={p.id}
                    prompt={p}
                    isFavorite={favorites.has(p.id)}
                    onToggleFavorite={toggleFavorite}
                    onOpenModal={handleOpenModal}
                    onOpenRemix={handleOpenRemix}
                    onToast={showToast}
                    lang={lang}
                  />
                ))}
              </div>
            ) : (
              <CompactListView
                prompts={displayedPrompts}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                onOpenModal={handleOpenModal}
                onOpenRemix={handleOpenRemix}
                onToast={showToast}
                lang={lang}
              />
            )}

            {/* Pagination / Load More Controls */}
            {filteredPrompts.length > pageSize && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 py-10">
                <button
                  onClick={() => setPageSize((prev) => prev + 48)}
                  className="px-6 py-3 border-2 border-[#1A1A1A] bg-[#1A1A1A] hover:bg-[#FF3E00] hover:border-[#FF3E00] text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-white transition-all shadow-[4px_4px_0px_#1A1A1A] cursor-pointer"
                >
                  {t.loadMoreBtn} ({filteredPrompts.length - pageSize} {t.remainingCount})
                </button>
                <button
                  onClick={() => setPageSize(filteredPrompts.length)}
                  className="px-6 py-3 border-2 border-[#1A1A1A] bg-white hover:bg-[#1A1A1A] hover:text-white text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-[#1A1A1A] transition-all shadow-[4px_4px_0px_#1A1A1A] cursor-pointer"
                >
                  {t.showAllBtn} ({filteredPrompts.length})
                </button>
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: LUXURY DESIGN ANALYSIS (设计密码) */}
        {activeTab === 'analysis' && (
          <LuxuryAnalysis
            onToast={showToast}
            onFilterByCategory={(cat) => {
              setFilters((prev) => ({ ...prev, category: cat }));
              setActiveTab('gallery');
            }}
            lang={lang}
            onToggleLanguage={toggleLanguage}
          />
        )}

        {/* VIEW 3: PROMPT REMIXER & CUSTOMIZER */}
        {activeTab === 'remixer' && (
          <PromptRemixer
            prompts={prompts}
            initialPrompt={remixPrompt}
            onToast={showToast}
            lang={lang}
          />
        )}
      </main>

      {/* Quick Search Modal (⌘K or / or button) */}
      <QuickSearchModal
        isOpen={isQuickSearchOpen}
        onClose={() => setIsQuickSearchOpen(false)}
        prompts={prompts}
        onSelectPrompt={handleOpenModal}
        lang={lang}
      />

      {/* Detail Modal */}
      <PromptModal
        prompt={modalPrompt}
        isOpen={Boolean(modalPrompt)}
        onClose={() => setModalPrompt(null)}
        onPrev={handlePrevPrompt}
        onNext={handleNextPrompt}
        isFavorite={modalPrompt ? favorites.has(modalPrompt.id) : false}
        onToggleFavorite={toggleFavorite}
        onToast={showToast}
        lang={lang}
      />

      {/* Toast Notifications */}
      <Toast message={toastMsg} />

      {/* Footer */}
      <footer className="mt-auto border-t-2 border-[#1A1A1A] bg-[#FAF9F6] py-8 text-center text-xs text-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-serif italic text-sm">
            <span className="font-bold text-[#1A1A1A]">MotionSites Gallery</span>
            <span>—</span>
            <span>328 AI Motion & UI Prompts Collection</span>
          </div>
          <div className="text-[#1A1A1A]/70 text-[11px] font-mono">
            ARCHIVAL REPOSITORY EDITION • <span className="font-bold text-[#1A1A1A]">ARTISTIC FLAIR</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
