import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { MotionPrompt, FilterState, ViewMode, ActiveTab, PromptMedia } from './types';
import { ALL_PROMPTS } from './data/promptsData';
import { Navbar } from './components/Navbar';
import { StatsBanner } from './components/StatsBanner';
import { FilterBar } from './components/FilterBar';
import { PromptCard } from './components/PromptCard';
import { CompactListView } from './components/CompactListView';
import { PromptModal } from './components/PromptModal';
import { LuxuryAnalysis } from './components/LuxuryAnalysis';
import { PromptRemixer } from './components/PromptRemixer';
import { MediaCMS } from './components/MediaCMS';
import { QuickSearchModal } from './components/QuickSearchModal';
import { PlayfulAIAssistant } from './components/PlayfulAIAssistant';
import { Toast } from './components/Toast';
import {
  PromptCardSkeletonGrid,
  CompactListViewSkeleton,
  InteractiveMotionLoader,
} from './components/Skeletons';
import {
  PaginationControls,
  PaginationMode,
} from './components/PaginationControls';
import {
  InteractiveScrollSentinel,
  FloatingScrollTopButton,
} from './components/InteractiveScrollSentinel';
import { exportAsJSON, exportAsMarkdown, exportAsCSV } from './utils/promptUtils';
import { Language, translations } from './utils/translations';
import { Heart, AlertCircle, Sparkles } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import {
  subscribeUserFavorites,
  toggleFavoriteFirestore,
  subscribeCustomPrompts,
  subscribeAllPromptMedia
} from './services/firebaseService';

function MotionsitesApp() {
  const { user } = useAuth();
  // Directly initialize all 328 pre-compiled prompts
  const [basePrompts] = useState<MotionPrompt[]>(ALL_PROMPTS);
  const [customPrompts, setCustomPrompts] = useState<MotionPrompt[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('gallery');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [modalPrompt, setModalPrompt] = useState<MotionPrompt | null>(null);
  const [remixPrompt, setRemixPrompt] = useState<MotionPrompt | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('motionsites_pagesize');
      return saved ? Number(saved) : 24;
    } catch {
      return 24;
    }
  });
  const [paginationMode, setPaginationMode] = useState<PaginationMode>(() => {
    try {
      const saved = localStorage.getItem('motionsites_pagination_mode');
      return saved === 'paged' || saved === 'infinite' ? (saved as PaginationMode) : 'infinite';
    } catch {
      return 'infinite';
    }
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [infiniteLoadedCount, setInfiniteLoadedCount] = useState<number>(24);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [isFilterLoading, setIsFilterLoading] = useState<boolean>(false);
  const [isQuickSearchOpen, setIsQuickSearchOpen] = useState(false);

  // Global Media Map for all prompts (cached in localStorage + synced with Firestore)
  const [mediaMap, setMediaMap] = useState<Record<string, PromptMedia>>(() => {
    try {
      const saved = localStorage.getItem('motionsites_media_map');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Subscribe to real-time prompt media from Firestore
  useEffect(() => {
    const unsubMedia = subscribeAllPromptMedia((latestMap) => {
      setMediaMap((prev) => {
        const merged = { ...prev, ...latestMap };
        try {
          localStorage.setItem('motionsites_media_map', JSON.stringify(merged));
        } catch (e) {
          console.error('Failed to cache media map:', e);
        }
        return merged;
      });
    });

    return () => {
      if (unsubMedia) unsubMedia();
    };
  }, []);

  // Handler when media is updated or removed in CMS
  const handleMediaUpdated = useCallback((promptId: string, media: PromptMedia | null) => {
    setMediaMap((prev) => {
      const next = { ...prev };
      if (media) {
        next[promptId] = media;
      } else {
        delete next[promptId];
      }
      try {
        localStorage.setItem('motionsites_media_map', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });

    // Update active modal prompt if currently inspecting
    setModalPrompt((curr) => {
      if (curr && curr.id === promptId) {
        return {
          ...curr,
          media: media || undefined,
        };
      }
      return curr;
    });
  }, []);

  // Combine base prompts with custom Firestore prompts AND attach active visual media
  const prompts = useMemo(() => {
    const all = [...customPrompts, ...basePrompts];
    return all.map((p) => {
      const attachedMedia = mediaMap[p.id];
      if (attachedMedia) {
        return { ...p, media: attachedMedia };
      }
      return p;
    });
  }, [customPrompts, basePrompts, mediaMap]);

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

  // Favorites in localStorage + Firebase sync
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('motionsites_favorites');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Real-time sync with Firebase when user is authenticated
  useEffect(() => {
    if (!user) return;

    // Listen to Firebase favorites
    const unsubFavs = subscribeUserFavorites(user.uid, (firestoreFavIds) => {
      setFavorites((prev) => {
        const combined = new Set([...Array.from(prev), ...firestoreFavIds]);
        try {
          localStorage.setItem('motionsites_favorites', JSON.stringify(Array.from(combined)));
        } catch (e) {
          console.error(e);
        }
        return combined;
      });
    });

    // Listen to Firebase custom prompts
    const unsubCustom = subscribeCustomPrompts(user.uid, (savedCustoms) => {
      setCustomPrompts(savedCustoms);
    });

    return () => {
      if (unsubFavs) unsubFavs();
      if (unsubCustom) unsubCustom();
    };
  }, [user]);

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

  // AI Assistant active filter to sync recommendations directly with the main gallery
  const [aiGalleryFilter, setAiGalleryFilter] = useState<{
    label: string;
    promptIds: string[];
    queryText: string;
  } | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((curr) => (curr === msg ? null : curr));
    }, 2400);
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      const willBeFavorite = !next.has(id);
      if (willBeFavorite) {
        next.add(id);
      } else {
        next.delete(id);
      }
      try {
        localStorage.setItem('motionsites_favorites', JSON.stringify(Array.from(next)));
      } catch (e) {
        console.error(e);
      }

      // Sync to Firebase if user is logged in
      if (user) {
        toggleFavoriteFirestore(user.uid, id, willBeFavorite).catch((err) =>
          console.warn('Could not sync favorite to Firestore:', err)
        );
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
      // AI Assistant active recommendations filter
      if (aiGalleryFilter && Array.isArray(aiGalleryFilter.promptIds) && aiGalleryFilter.promptIds.length > 0) {
        if (!aiGalleryFilter.promptIds.includes(p.id)) {
          return false;
        }
      }

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

  // Reset pagination position and trigger brief skeleton pulse when filters change
  useEffect(() => {
    setCurrentPage(1);
    setInfiniteLoadedCount(pageSize);
    setIsFilterLoading(true);
    const timer = setTimeout(() => {
      setIsFilterLoading(false);
    }, 180);
    return () => clearTimeout(timer);
  }, [filters, aiGalleryFilter, activeTab, pageSize]);

  // Total pages calculation
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredPrompts.length / pageSize));
  }, [filteredPrompts.length, pageSize]);

  // Clamp current page if totalPages changes
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // Displayed prompts slice based on active mode
  const displayedPrompts = useMemo(() => {
    if (paginationMode === 'paged') {
      const startIndex = (currentPage - 1) * pageSize;
      return filteredPrompts.slice(startIndex, startIndex + pageSize);
    } else {
      return filteredPrompts.slice(0, infiniteLoadedCount);
    }
  }, [filteredPrompts, paginationMode, currentPage, pageSize, infiniteLoadedCount]);

  const hasMoreInfinite = infiniteLoadedCount < filteredPrompts.length;

  const handleLoadMoreInfinite = useCallback(() => {
    if (isLoadingMore || infiniteLoadedCount >= filteredPrompts.length) return;
    setIsLoadingMore(true);
    setTimeout(() => {
      setInfiniteLoadedCount((prev) => Math.min(filteredPrompts.length, prev + pageSize));
      setIsLoadingMore(false);
    }, 320);
  }, [isLoadingMore, infiniteLoadedCount, filteredPrompts.length, pageSize]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    setIsFilterLoading(true);
    setTimeout(() => setIsFilterLoading(false), 160);
    const anchor = document.getElementById('gallery-content-anchor');
    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setInfiniteLoadedCount(newSize);
    setCurrentPage(1);
    try {
      localStorage.setItem('motionsites_pagesize', String(newSize));
    } catch (e) {
      console.error(e);
    }
    showToast(`Items per page set to ${newSize}`);
  };

  const handleModeChange = (mode: PaginationMode) => {
    setPaginationMode(mode);
    try {
      localStorage.setItem('motionsites_pagination_mode', mode);
    } catch (e) {
      console.error(e);
    }
    showToast(mode === 'infinite' ? '⚡ Infinite Scroll enabled' : '📄 Page navigation enabled');
  };

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

            {/* AI Assistant Active Filter Banner */}
            {aiGalleryFilter && (
              <div className="border-2 border-[#1A1A1A] bg-[#FAF9F6] p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-[4px_4px_0px_#FF3E00] animate-in fade-in">
                <div className="flex items-center gap-3">
                  <div className="p-2 border-2 border-[#1A1A1A] bg-[#FF3E00] text-white">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#FF3E00] flex items-center gap-1.5">
                      <span>✦ GEMINI AI FILTER ACTIVE</span>
                      <span className="text-[#1A1A1A]/40">•</span>
                      <span className="text-[#1A1A1A]/70">{filteredPrompts.length} PROMPTS FOUND</span>
                    </div>
                    <h2 className="text-base sm:text-lg font-serif italic font-bold text-[#1A1A1A]">
                      {aiGalleryFilter.label}
                    </h2>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setAiGalleryFilter(null);
                    showToast('Cleared AI gallery filter');
                  }}
                  className="px-3 py-1.5 border-2 border-[#1A1A1A] bg-white hover:bg-[#1A1A1A] hover:text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  ✕ Clear AI Filter
                </button>
              </div>
            )}

            <div id="gallery-content-anchor" />

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

            {/* Top Pagination Controls (when in Paged Mode for quick access) */}
            {paginationMode === 'paged' && filteredPrompts.length > pageSize && (
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredPrompts.length}
                pageSize={pageSize}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                paginationMode={paginationMode}
                onModeChange={handleModeChange}
                lang={lang}
              />
            )}

            {/* Prompts Display & Skeleton Loading */}
            {isFilterLoading ? (
              viewMode === 'grid' ? (
                <PromptCardSkeletonGrid count={Math.min(pageSize, 12)} />
              ) : (
                <CompactListViewSkeleton rows={Math.min(pageSize, 12)} />
              )
            ) : filteredPrompts.length === 0 ? (
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

            {/* Bottom Controls based on Active Pagination Mode */}
            {paginationMode === 'paged' ? (
              filteredPrompts.length > 0 && (
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={filteredPrompts.length}
                  pageSize={pageSize}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                  paginationMode={paginationMode}
                  onModeChange={handleModeChange}
                  lang={lang}
                />
              )
            ) : (
              filteredPrompts.length > 0 && (
                <InteractiveScrollSentinel
                  hasMore={hasMoreInfinite}
                  isLoadingMore={isLoadingMore}
                  onLoadMore={handleLoadMoreInfinite}
                  loadedCount={displayedPrompts.length}
                  totalCount={filteredPrompts.length}
                  viewMode={viewMode}
                  onScrollToTop={() => {
                    const anchor = document.getElementById('gallery-content-anchor');
                    if (anchor) {
                      anchor.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                />
              )
            )}
          </div>
        )}

        {/* VIEW 2: MEDIA CMS (Image & Video Uploader) */}
        {activeTab === 'cms' && (
          <MediaCMS
            prompts={prompts}
            mediaMap={mediaMap}
            onMediaUpdated={handleMediaUpdated}
            onToast={showToast}
            lang={lang}
            onOpenPromptDetail={handleOpenModal}
          />
        )}

        {/* VIEW 3: LUXURY DESIGN ANALYSIS (设计密码) */}
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

      {/* Playful Interactive AI Assistant (Draggable + Eye Tracking + Blinking + Gemini AI) */}
      <PlayfulAIAssistant
        prompts={prompts}
        onSelectPrompt={handleOpenModal}
        onSwitchTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'favorites') {
            setFilters((prev) => ({ ...prev, onlyFavorites: true }));
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenRemixWithPrompt={handleOpenRemix}
        onApplyAIGalleryFilter={(filter) => {
          setAiGalleryFilter(filter);
          setActiveTab('gallery');
          setFilters((prev) => ({ ...prev, searchQuery: '' }));
          setTimeout(() => {
            const anchor = document.getElementById('gallery-content-anchor');
            if (anchor) {
              anchor.scrollIntoView({ behavior: 'smooth' });
            }
          }, 100);
        }}
        onToast={showToast}
        lang={lang}
      />

      {/* Floating Back to Top Button with Circular Scroll Meter */}
      <FloatingScrollTopButton />

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

export default function App() {
  return (
    <AuthProvider>
      <MotionsitesApp />
    </AuthProvider>
  );
}
