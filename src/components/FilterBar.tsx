import React, { useRef, useEffect } from 'react';
import { Search, X, Grid, List, RotateCcw, Smartphone, Globe, Tag, Sparkles } from 'lucide-react';
import { FilterState, SortOption, ViewMode } from '../types';
import { Language, translations } from '../utils/translations';

interface FilterBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  categories: string[];
  types: string[];
  totalResults: number;
  totalPrompts: number;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  availableTags: string[];
  lang: Language;
  onOpenQuickSearch?: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  setFilters,
  categories,
  types,
  totalResults,
  totalPrompts,
  viewMode,
  setViewMode,
  availableTags,
  lang,
  onOpenQuickSearch,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const t = translations[lang];

  const hasActiveFilters =
    filters.searchQuery !== '' ||
    filters.platform !== 'all' ||
    filters.tier !== 'all' ||
    filters.category !== 'all' ||
    filters.type !== 'all' ||
    filters.tag !== 'all' ||
    filters.sort !== 'default';

  const handleReset = () => {
    setFilters({
      searchQuery: '',
      platform: 'all',
      tier: 'all',
      category: 'all',
      type: 'all',
      tag: 'all',
      sort: 'default',
      onlyFavorites: filters.onlyFavorites,
    });
  };

  // Keyboard shortcut '/' to focus search bar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="border-2 border-[#1A1A1A] bg-[#FAF9F6] p-4 sm:p-6 mb-8 space-y-4 shadow-[4px_4px_0px_#1A1A1A]">
      {/* Top row: Main Search Bar and View Mode Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search input with shortcut badge */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#FF3E00] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            ref={searchInputRef}
            id="search-input"
            type="text"
            value={filters.searchQuery}
            onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
            placeholder={t.searchPlaceholder}
            className="w-full bg-white border-2 border-[#1A1A1A] pl-10 pr-20 py-2.5 text-xs sm:text-sm text-[#1A1A1A] placeholder-[#1A1A1A]/40 font-medium focus:outline-none focus:bg-[#FAF9F6] focus:border-[#FF3E00] transition-colors"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            {filters.searchQuery ? (
              <button
                onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
                className="text-[#1A1A1A]/60 hover:text-[#FF3E00] p-1 cursor-pointer"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <kbd className="hidden sm:inline text-[10px] px-1.5 py-0.5 border border-[#1A1A1A]/30 bg-[#FAF9F6] text-[#1A1A1A]/60 font-mono">
                /
              </kbd>
            )}
          </div>
        </div>

        {/* View Mode and Sort Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Sort Selector */}
          <select
            id="sort-select"
            value={filters.sort}
            onChange={(e) => setFilters((prev) => ({ ...prev, sort: e.target.value as SortOption }))}
            className="bg-white border-2 border-[#1A1A1A] px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-[#1A1A1A] focus:outline-none focus:border-[#FF3E00] cursor-pointer"
          >
            <option value="default">{t.sortDefault}</option>
            <option value="title-asc">{t.sortTitleAsc}</option>
            <option value="title-desc">{t.sortTitleDesc}</option>
            <option value="length-desc">{t.sortLengthDesc}</option>
            <option value="length-asc">{t.sortLengthAsc}</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center border-2 border-[#1A1A1A] bg-white">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-[#1A1A1A] text-white' : 'text-[#1A1A1A] hover:bg-[#1A1A1A]/10'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('compact')}
              className={`p-2 transition-colors cursor-pointer ${
                viewMode === 'compact' ? 'bg-[#1A1A1A] text-white' : 'text-[#1A1A1A] hover:bg-[#1A1A1A]/10'
              }`}
              title="Compact Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Second row: Dropdown and Tag Filters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2.5 pt-2 border-t border-[#1A1A1A]/15">
        {/* Platform Filter */}
        <div>
          <label className="block text-[10px] font-mono font-bold uppercase text-[#1A1A1A]/60 mb-1">
            {lang === 'zh' ? '运行平台' : 'Platform'}
          </label>
          <select
            value={filters.platform}
            onChange={(e) => setFilters((prev) => ({ ...prev, platform: e.target.value as any }))}
            className="w-full bg-white border border-[#1A1A1A] px-2.5 py-1.5 text-xs font-semibold text-[#1A1A1A] focus:outline-none focus:border-[#FF3E00] cursor-pointer"
          >
            <option value="all">{t.platformAll}</option>
            <option value="website">{t.platformWeb}</option>
            <option value="app">{t.platformApp}</option>
          </select>
        </div>

        {/* Tier Filter */}
        <div>
          <label className="block text-[10px] font-mono font-bold uppercase text-[#1A1A1A]/60 mb-1">
            {lang === 'zh' ? '访问级别' : 'Access Tier'}
          </label>
          <select
            value={filters.tier}
            onChange={(e) => setFilters((prev) => ({ ...prev, tier: e.target.value as any }))}
            className="w-full bg-white border border-[#1A1A1A] px-2.5 py-1.5 text-xs font-semibold text-[#1A1A1A] focus:outline-none focus:border-[#FF3E00] cursor-pointer"
          >
            <option value="all">{t.tierAll}</option>
            <option value="free">{t.tierFree}</option>
            <option value="premium">{t.tierPremium}</option>
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-[10px] font-mono font-bold uppercase text-[#1A1A1A]/60 mb-1">
            {lang === 'zh' ? '组件类型' : 'Component Category'}
          </label>
          <select
            value={filters.category}
            onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
            className="w-full bg-white border border-[#1A1A1A] px-2.5 py-1.5 text-xs font-semibold text-[#1A1A1A] focus:outline-none focus:border-[#FF3E00] cursor-pointer"
          >
            <option value="all">{t.categoryAll} ({categories.length})</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Type / Style Filter */}
        <div>
          <label className="block text-[10px] font-mono font-bold uppercase text-[#1A1A1A]/60 mb-1">
            {lang === 'zh' ? '页面形式' : 'Format Type'}
          </label>
          <select
            value={filters.type}
            onChange={(e) => setFilters((prev) => ({ ...prev, type: e.target.value }))}
            className="w-full bg-white border border-[#1A1A1A] px-2.5 py-1.5 text-xs font-semibold text-[#1A1A1A] focus:outline-none focus:border-[#FF3E00] cursor-pointer"
          >
            <option value="all">{t.typeAll} ({types.length})</option>
            {types.map((tp) => (
              <option key={tp} value={tp}>
                {tp}
              </option>
            ))}
          </select>
        </div>

        {/* Feature Tag Filter */}
        <div className="col-span-2 sm:col-span-4 lg:col-span-1">
          <label className="block text-[10px] font-mono font-bold uppercase text-[#1A1A1A]/60 mb-1">
            {lang === 'zh' ? '动效/材质特征' : 'Motion/Visual Feature'}
          </label>
          <select
            value={filters.tag}
            onChange={(e) => setFilters((prev) => ({ ...prev, tag: e.target.value }))}
            className="w-full bg-white border border-[#1A1A1A] px-2.5 py-1.5 text-xs font-semibold text-[#1A1A1A] focus:outline-none focus:border-[#FF3E00] cursor-pointer"
          >
            <option value="all">{t.tagAll} ({availableTags.length})</option>
            {availableTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bottom Summary & Active Filters Status */}
      <div className="flex items-center justify-between text-xs pt-2 text-[#1A1A1A]/80 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-[#1A1A1A]">
            {t.showingResults} <span className="text-[#FF3E00] font-mono font-bold text-sm">{totalResults}</span> / {totalPrompts} {t.promptsCount}
          </span>
          {hasActiveFilters && (
            <span className="text-[10px] font-mono px-2 py-0.5 border border-[#1A1A1A] bg-[#1A1A1A] text-white">
              {t.activeFiltersCount}
            </span>
          )}
        </div>

        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-[11px] font-mono font-bold uppercase tracking-wider text-[#FF3E00] hover:text-[#1A1A1A] hover:underline cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{t.resetFilters}</span>
          </button>
        )}
      </div>
    </div>
  );
};
