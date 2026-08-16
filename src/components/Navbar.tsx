import React, { useState, useEffect, useRef } from 'react';
import {
  Layers,
  BookOpen,
  Code2,
  Heart,
  Download,
  Search,
  Globe,
  Menu,
  X,
  FileJson,
  FileText,
  FileSpreadsheet,
  Sparkles,
  Smartphone,
  ChevronRight,
  User as UserIcon,
  LogIn,
  LogOut,
  Cloud,
  CheckCircle2,
  UploadCloud
} from 'lucide-react';
import { ActiveTab } from '../types';
import { Language, translations } from '../utils/translations';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  totalCount: number;
  freeCount: number;
  premiumCount: number;
  favoritesCount: number;
  onExportAll: (type: 'json' | 'md' | 'csv') => void;
  lang: Language;
  onToggleLanguage: () => void;
  onOpenQuickSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  totalCount,
  freeCount,
  premiumCount,
  favoritesCount,
  onExportAll,
  lang,
  onToggleLanguage,
  onOpenQuickSearch,
}) => {
  const { user, loading: authLoading, signInWithGoogle, logout } = useAuth();
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const t = translations[lang];

  // Close mobile menu when switching tabs
  const handleSelectTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    setShowExportMenu(false);
    setShowUserMenu(false);
  };

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-md border-b-2 border-[#1A1A1A] transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Main Navbar Row */}
        <div className="flex items-center justify-between h-14 sm:h-20 gap-2">
          {/* Brand & Logo */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <div
              onClick={() => handleSelectTab('gallery')}
              className="flex items-center gap-2 sm:gap-3 cursor-pointer group"
            >
              {/* Emblem */}
              <div className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-[#1A1A1A] bg-[#1A1A1A] flex items-center justify-center text-white group-hover:bg-[#FF3E00] group-hover:border-[#FF3E00] transition-colors relative shrink-0">
                <span className="font-serif italic text-sm sm:text-lg font-bold">M</span>
                <span className="w-1.5 h-1.5 bg-[#FF3E00] group-hover:bg-white rounded-full absolute top-1 right-1 sm:top-1.5 sm:right-1.5" />
              </div>

              <div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="font-serif italic text-base sm:text-2xl font-bold tracking-tight text-[#1A1A1A] leading-none">
                    Motion<span className="text-[#FF3E00]">Sites.</span>
                  </span>
                  <span className="text-[8px] sm:text-[10px] px-1 sm:px-1.5 py-0.2 border border-[#1A1A1A] bg-[#1A1A1A] text-white font-mono font-bold uppercase tracking-wider">
                    {totalCount}
                  </span>
                </div>
                <p className="text-[9px] sm:text-[11px] text-[#1A1A1A]/60 font-mono tracking-tight uppercase hidden lg:block mt-0.5">
                  {t.brandSubtitle}
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Center Navigation Tabs (Displayed on lg: screens and above) */}
          <nav className="hidden lg:flex items-center gap-1 p-1 border border-[#1A1A1A] bg-[#FAF9F6] shrink-0">
            <button
              id="tab-gallery"
              onClick={() => handleSelectTab('gallery')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'gallery'
                  ? 'bg-[#1A1A1A] text-white shadow-sm'
                  : 'text-[#1A1A1A] hover:bg-[#1A1A1A]/10'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-[#FF3E00]" />
              <span>{t.tabGallery}</span>
            </button>

            <button
              id="tab-cms"
              onClick={() => handleSelectTab('cms')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'cms'
                  ? 'bg-[#1A1A1A] text-white shadow-sm'
                  : 'text-[#1A1A1A] hover:bg-[#1A1A1A]/10'
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5 text-[#FF3E00]" />
              <span>{t.tabCms}</span>
            </button>

            <button
              id="tab-analysis"
              onClick={() => handleSelectTab('analysis')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'analysis'
                  ? 'bg-[#1A1A1A] text-white shadow-sm'
                  : 'text-[#1A1A1A] hover:bg-[#1A1A1A]/10'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-[#FF3E00]" />
              <span>{t.tabAnalysis}</span>
            </button>

            <button
              id="tab-remixer"
              onClick={() => handleSelectTab('remixer')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'remixer'
                  ? 'bg-[#1A1A1A] text-white shadow-sm'
                  : 'text-[#1A1A1A] hover:bg-[#1A1A1A]/10'
              }`}
            >
              <Code2 className="w-3.5 h-3.5 text-[#FF3E00]" />
              <span>{t.tabRemixer}</span>
            </button>

            <button
              id="tab-favorites"
              onClick={() => handleSelectTab('favorites')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all relative cursor-pointer ${
                activeTab === 'favorites'
                  ? 'bg-[#1A1A1A] text-white shadow-sm'
                  : 'text-[#1A1A1A] hover:bg-[#1A1A1A]/10'
              }`}
            >
              <Heart
                className={`w-3.5 h-3.5 ${
                  favoritesCount > 0
                    ? 'text-[#FF3E00] fill-[#FF3E00]'
                    : activeTab === 'favorites'
                    ? 'text-white'
                    : 'text-[#1A1A1A]'
                }`}
              />
              <span>{t.tabSaved}</span>
              {favoritesCount > 0 && (
                <span className="text-[9px] px-1.5 py-0.2 bg-[#FF3E00] text-white font-mono font-bold">
                  {favoritesCount}
                </span>
              )}
            </button>
          </nav>

          {/* Desktop Right Action Buttons (Search, Lang, Export, Auth) */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            {/* Quick Search Shortcut */}
            <button
              id="btn-quick-search"
              onClick={onOpenQuickSearch}
              className="flex items-center gap-1.5 px-3 py-1.5 border-2 border-[#1A1A1A] bg-white hover:bg-[#1A1A1A] hover:text-white text-xs font-bold uppercase tracking-wider text-[#1A1A1A] transition-colors cursor-pointer shadow-[2px_2px_0px_#1A1A1A]"
              title="Quick Search Prompts (⌘K or /)"
            >
              <Search className="w-3.5 h-3.5 text-[#FF3E00]" />
              <span>{t.quickSearchBtn}</span>
              <kbd className="hidden xl:inline-block text-[9px] px-1 py-0.2 border border-[#1A1A1A]/30 bg-[#FAF9F6] text-[#1A1A1A] font-mono">
                ⌘K
              </kbd>
            </button>

            {/* Translate Button */}
            <button
              id="btn-translate-lang"
              onClick={onToggleLanguage}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 border-2 transition-all cursor-pointer shadow-[2px_2px_0px_#1A1A1A] text-xs font-bold uppercase tracking-wider ${
                lang === 'en'
                  ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white hover:bg-[#FF3E00] hover:border-[#FF3E00]'
                  : 'border-[#FF3E00] bg-[#FF3E00] text-white hover:bg-[#1A1A1A] hover:border-[#1A1A1A]'
              }`}
              title={t.translateTooltip}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'EN' : '中文'}</span>
            </button>

            {/* Export Dropdown */}
            <div className="relative">
              <button
                id="btn-export-menu"
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="flex items-center gap-1.5 px-3 py-1.5 border-2 border-[#1A1A1A] bg-[#FAF9F6] hover:bg-[#1A1A1A] hover:text-white text-xs font-bold uppercase tracking-wider text-[#1A1A1A] transition-colors cursor-pointer shadow-[2px_2px_0px_#1A1A1A]"
                title={t.exportTitle}
              >
                <Download className="w-3.5 h-3.5 text-[#FF3E00]" />
                <span>{t.exportBtn}</span>
              </button>

              {showExportMenu && (
                <div
                  className="absolute right-0 mt-2 w-52 bg-[#FAF9F6] border-2 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setShowExportMenu(false)}
                >
                  <div className="px-3 py-1 text-[10px] font-bold text-[#1A1A1A]/60 uppercase tracking-[0.2em] border-b border-[#1A1A1A] mb-1">
                    {t.exportTitle}
                  </div>
                  <button
                    onClick={() => {
                      onExportAll('json');
                      setShowExportMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-bold text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <FileJson className="w-3.5 h-3.5 text-[#FF3E00]" />
                      {t.exportJson}
                    </span>
                    <span className="text-[10px] opacity-60 font-mono">.json</span>
                  </button>
                  <button
                    onClick={() => {
                      onExportAll('md');
                      setShowExportMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-bold text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-[#FF3E00]" />
                      {t.exportMd}
                    </span>
                    <span className="text-[10px] opacity-60 font-mono">.md</span>
                  </button>
                  <button
                    onClick={() => {
                      onExportAll('csv');
                      setShowExportMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-bold text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <FileSpreadsheet className="w-3.5 h-3.5 text-[#FF3E00]" />
                      {t.exportCsv}
                    </span>
                    <span className="text-[10px] opacity-60 font-mono">.csv</span>
                  </button>
                </div>
              )}
            </div>

            {/* User Profile / Firebase Auth Button */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  id="btn-user-profile"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-1.5 border-2 border-[#1A1A1A] bg-white hover:bg-[#FAF9F6] transition-all cursor-pointer shadow-[2px_2px_0px_#1A1A1A]"
                  title={user.email || user.displayName || 'User Profile'}
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      className="w-5 h-5 rounded-full border border-[#1A1A1A] object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-[#1A1A1A] text-white text-[10px] font-bold flex items-center justify-center">
                      {(user.displayName || user.email || 'U')[0].toUpperCase()}
                    </div>
                  )}
                  <span className="text-xs font-bold text-[#1A1A1A] max-w-[90px] truncate">
                    {user.displayName?.split(' ')[0] || 'Account'}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-100 shrink-0" title="Cloud Synced" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-[#FAF9F6] border-2 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="flex items-center gap-2.5 pb-2.5 border-b border-[#1A1A1A]/20 mb-2.5">
                      {user.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt={user.displayName || 'User'}
                          className="w-9 h-9 rounded-full border border-[#1A1A1A] object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-[#1A1A1A] text-white text-xs font-bold flex items-center justify-center">
                          {(user.displayName || user.email || 'U')[0].toUpperCase()}
                        </div>
                      )}
                      <div className="overflow-hidden">
                        <div className="text-xs font-bold text-[#1A1A1A] truncate">
                          {user.displayName || 'Motion Designer'}
                        </div>
                        <div className="text-[10px] font-mono text-[#1A1A1A]/60 truncate">
                          {user.email}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 px-2 py-1.5 bg-emerald-50 border border-emerald-300 text-emerald-800 text-[10px] font-mono font-bold mb-2.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span>Firebase Cloud Sync Active</span>
                    </div>

                    <button
                      id="btn-sign-out"
                      onClick={async () => {
                        await logout();
                        setShowUserMenu(false);
                      }}
                      className="w-full py-2 px-3 border border-[#1A1A1A] bg-white hover:bg-rose-50 hover:text-rose-600 hover:border-rose-400 text-xs font-bold uppercase tracking-wider text-[#1A1A1A] flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                id="btn-google-signin"
                onClick={async () => {
                  try {
                    await signInWithGoogle();
                  } catch (e) {
                    console.error(e);
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 border-2 border-[#1A1A1A] bg-[#1A1A1A] text-white hover:bg-[#FF3E00] hover:border-[#FF3E00] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-[2px_2px_0px_#1A1A1A]"
                title="Sign in with Google to sync bookmarks to Firebase"
              >
                <LogIn className="w-3.5 h-3.5 text-[#FF3E00] group-hover:text-white" />
                <span>Sign In</span>
              </button>
            )}
          </div>

          {/* Mobile/Tablet Right Controls: Search Icon + Export + Language Toggle + Menu Drawer Toggle */}
          <div className="flex lg:hidden items-center gap-1.5">
            {/* Quick Search Button */}
            <button
              id="mobile-btn-search"
              onClick={onOpenQuickSearch}
              className="p-2 min-w-[36px] min-h-[36px] flex items-center justify-center border-2 border-[#1A1A1A] bg-white active:bg-[#1A1A1A] active:text-white text-[#1A1A1A] transition-colors shadow-[2px_2px_0px_#1A1A1A] cursor-pointer"
              title="Search Prompts"
              aria-label="Search Prompts"
            >
              <Search className="w-4 h-4 text-[#FF3E00]" />
            </button>

            {/* Export Dropdown for Mobile/Tablet */}
            <div className="relative">
              <button
                id="mobile-btn-export"
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="p-2 min-w-[36px] min-h-[36px] flex items-center justify-center border-2 border-[#1A1A1A] bg-[#FAF9F6] active:bg-[#1A1A1A] active:text-white text-[#1A1A1A] transition-colors shadow-[2px_2px_0px_#1A1A1A] cursor-pointer"
                title={t.exportTitle}
                aria-label="Export Data"
              >
                <Download className="w-4 h-4 text-[#FF3E00]" />
              </button>

              {showExportMenu && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-[#FAF9F6] border-2 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setShowExportMenu(false)}
                >
                  <div className="px-3 py-1 text-[10px] font-bold text-[#1A1A1A]/60 uppercase tracking-[0.2em] border-b border-[#1A1A1A] mb-1">
                    {t.exportTitle}
                  </div>
                  <button
                    onClick={() => {
                      onExportAll('json');
                      setShowExportMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-bold text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <FileJson className="w-3.5 h-3.5 text-[#FF3E00]" />
                      {t.exportJson}
                    </span>
                    <span className="text-[10px] opacity-60 font-mono">.json</span>
                  </button>
                  <button
                    onClick={() => {
                      onExportAll('md');
                      setShowExportMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-bold text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-[#FF3E00]" />
                      {t.exportMd}
                    </span>
                    <span className="text-[10px] opacity-60 font-mono">.md</span>
                  </button>
                  <button
                    onClick={() => {
                      onExportAll('csv');
                      setShowExportMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-bold text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <FileSpreadsheet className="w-3.5 h-3.5 text-[#FF3E00]" />
                      {t.exportCsv}
                    </span>
                    <span className="text-[10px] opacity-60 font-mono">.csv</span>
                  </button>
                </div>
              )}
            </div>

            {/* Language Switch Button */}
            <button
              id="mobile-btn-lang"
              onClick={onToggleLanguage}
              className={`px-2 py-1.5 min-h-[36px] flex items-center gap-1 border-2 text-[11px] font-mono font-bold tracking-wider transition-all shadow-[2px_2px_0px_#1A1A1A] cursor-pointer ${
                lang === 'en'
                  ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white active:bg-[#FF3E00]'
                  : 'border-[#FF3E00] bg-[#FF3E00] text-white active:bg-[#1A1A1A]'
              }`}
              title={t.translateTooltip}
              aria-label="Toggle language"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'EN' : '中文'}</span>
            </button>

            {/* Menu / Drawer Toggle */}
            <button
              id="mobile-btn-menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 min-w-[36px] min-h-[36px] flex items-center justify-center border-2 border-[#1A1A1A] transition-colors shadow-[2px_2px_0px_#1A1A1A] cursor-pointer ${
                mobileMenuOpen
                  ? 'bg-[#FF3E00] text-white border-[#FF3E00]'
                  : 'bg-[#FAF9F6] text-[#1A1A1A] active:bg-[#1A1A1A] active:text-white'
              }`}
              title="Toggle Menu"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile/Tablet Navigation Segmented Tab Strip (Always accessible, touch-optimized) */}
        <div className="lg:hidden pb-2 pt-1 border-t border-[#1A1A1A]/10">
          <nav className="grid grid-cols-5 gap-0.5 p-0.5 border border-[#1A1A1A] bg-white">
            <button
              id="mobile-tab-gallery"
              onClick={() => handleSelectTab('gallery')}
              className={`flex flex-col items-center justify-center gap-0.5 py-1.5 px-0.5 text-[10px] font-bold uppercase tracking-tight transition-all min-h-[44px] cursor-pointer ${
                activeTab === 'gallery'
                  ? 'bg-[#1A1A1A] text-white'
                  : 'text-[#1A1A1A] hover:bg-[#1A1A1A]/5 active:bg-[#1A1A1A]/10'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{lang === 'zh' ? '图库' : 'Gallery'}</span>
            </button>

            <button
              id="mobile-tab-cms"
              onClick={() => handleSelectTab('cms')}
              className={`flex flex-col items-center justify-center gap-0.5 py-1.5 px-0.5 text-[10px] font-bold uppercase tracking-tight transition-all min-h-[44px] cursor-pointer ${
                activeTab === 'cms'
                  ? 'bg-[#1A1A1A] text-white'
                  : 'text-[#1A1A1A] hover:bg-[#1A1A1A]/5 active:bg-[#1A1A1A]/10'
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5 text-[#FF3E00]" />
              <span>{lang === 'zh' ? 'CMS' : 'CMS'}</span>
            </button>

            <button
              id="mobile-tab-analysis"
              onClick={() => handleSelectTab('analysis')}
              className={`flex flex-col items-center justify-center gap-0.5 py-1.5 px-0.5 text-[10px] font-bold uppercase tracking-tight transition-all relative min-h-[44px] cursor-pointer ${
                activeTab === 'analysis'
                  ? 'bg-[#1A1A1A] text-white'
                  : 'text-[#1A1A1A] hover:bg-[#1A1A1A]/5 active:bg-[#1A1A1A]/10'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{lang === 'zh' ? '密码' : 'Secrets'}</span>
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#FF3E00] rounded-full" />
            </button>

            <button
              id="mobile-tab-remixer"
              onClick={() => handleSelectTab('remixer')}
              className={`flex flex-col items-center justify-center gap-0.5 py-1.5 px-0.5 text-[10px] font-bold uppercase tracking-tight transition-all min-h-[44px] cursor-pointer ${
                activeTab === 'remixer'
                  ? 'bg-[#1A1A1A] text-white'
                  : 'text-[#1A1A1A] hover:bg-[#1A1A1A]/5 active:bg-[#1A1A1A]/10'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>{lang === 'zh' ? '定制' : 'Remix'}</span>
            </button>

            <button
              id="mobile-tab-favorites"
              onClick={() => handleSelectTab('favorites')}
              className={`flex flex-col items-center justify-center gap-0.5 py-1.5 px-0.5 text-[10px] font-bold uppercase tracking-tight transition-all relative min-h-[44px] cursor-pointer ${
                activeTab === 'favorites'
                  ? 'bg-[#1A1A1A] text-white'
                  : 'text-[#1A1A1A] hover:bg-[#1A1A1A]/5 active:bg-[#1A1A1A]/10'
              }`}
            >
              <Heart
                className={`w-3.5 h-3.5 ${
                  favoritesCount > 0 ? 'text-[#FF3E00] fill-[#FF3E00]' : ''
                }`}
              />
              <span>{lang === 'zh' ? '收藏' : 'Saved'}</span>
              {favoritesCount > 0 && (
                <span className="text-[9px] px-1 py-0.2 bg-[#FF3E00] text-white font-mono font-bold">
                  {favoritesCount}
                </span>
              )}
            </button>
          </nav>
        </div>
      </div>

      {/* Mobile/Tablet Slide-Out Drawer / Backdrop Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[106px] z-50 bg-[#1A1A1A]/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            ref={mobileMenuRef}
            className="bg-[#FAF9F6] border-b-2 border-[#1A1A1A] shadow-[0px_10px_20px_rgba(0,0,0,0.15)] max-h-[calc(100vh-120px)] overflow-y-auto p-4 space-y-4"
          >
            {/* Quick Stats Overview */}
            <div className="p-3 border-2 border-[#1A1A1A] bg-white">
              <div className="text-[10px] font-mono font-bold text-[#FF3E00] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{lang === 'zh' ? '档案统计概览' : 'ARCHIVE COLLECTION STATS'}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 border border-[#1A1A1A]/20 bg-[#FAF9F6]">
                  <div className="text-base font-serif italic font-bold text-[#1A1A1A]">
                    {totalCount}
                  </div>
                  <div className="text-[9px] font-mono text-[#1A1A1A]/60 uppercase">
                    {lang === 'zh' ? '总提示词' : 'Prompts'}
                  </div>
                </div>
                <div className="p-2 border border-[#1A1A1A]/20 bg-[#FAF9F6]">
                  <div className="text-base font-serif italic font-bold text-[#FF3E00]">
                    {freeCount}
                  </div>
                  <div className="text-[9px] font-mono text-[#1A1A1A]/60 uppercase">
                    {lang === 'zh' ? '免费开源' : 'Free'}
                  </div>
                </div>
                <div className="p-2 border border-[#1A1A1A]/20 bg-[#FAF9F6]">
                  <div className="text-base font-serif italic font-bold text-[#1A1A1A]">
                    {premiumCount}
                  </div>
                  <div className="text-[9px] font-mono text-[#1A1A1A]/60 uppercase">
                    {lang === 'zh' ? '高级样式' : 'Premium'}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Search Trigger within drawer */}
            <div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenQuickSearch();
                }}
                className="w-full py-3 px-4 border-2 border-[#1A1A1A] bg-white flex items-center justify-between font-mono text-xs font-bold text-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] active:bg-[#1A1A1A] active:text-white transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-[#FF3E00]" />
                  <span>{t.quickSearchBtn}</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 border border-[#1A1A1A]/30 bg-[#FAF9F6] text-[#1A1A1A]">
                  ⌘K / /
                </span>
              </button>
            </div>

            {/* Export Section */}
            <div className="border-2 border-[#1A1A1A] bg-white p-3 space-y-2">
              <div className="text-[10px] font-mono font-bold text-[#1A1A1A]/70 uppercase tracking-wider flex items-center gap-1.5 pb-1.5 border-b border-[#1A1A1A]/15">
                <Download className="w-3.5 h-3.5 text-[#FF3E00]" />
                <span>{t.exportTitle}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    onExportAll('json');
                    setMobileMenuOpen(false);
                  }}
                  className="p-2 border border-[#1A1A1A] bg-[#FAF9F6] active:bg-[#1A1A1A] active:text-white flex flex-col items-center justify-center gap-1 text-[10px] font-mono font-bold transition-colors cursor-pointer"
                >
                  <FileJson className="w-4 h-4 text-[#FF3E00]" />
                  <span>.JSON</span>
                </button>
                <button
                  onClick={() => {
                    onExportAll('md');
                    setMobileMenuOpen(false);
                  }}
                  className="p-2 border border-[#1A1A1A] bg-[#FAF9F6] active:bg-[#1A1A1A] active:text-white flex flex-col items-center justify-center gap-1 text-[10px] font-mono font-bold transition-colors cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-[#FF3E00]" />
                  <span>.MD</span>
                </button>
                <button
                  onClick={() => {
                    onExportAll('csv');
                    setMobileMenuOpen(false);
                  }}
                  className="p-2 border border-[#1A1A1A] bg-[#FAF9F6] active:bg-[#1A1A1A] active:text-white flex flex-col items-center justify-center gap-1 text-[10px] font-mono font-bold transition-colors cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4 text-[#FF3E00]" />
                  <span>.CSV</span>
                </button>
              </div>
            </div>

            {/* Language Switch Row */}
            <div className="pt-1">
              <button
                onClick={() => {
                  onToggleLanguage();
                }}
                className="w-full py-2.5 px-3 border-2 border-[#1A1A1A] bg-[#FAF9F6] active:bg-[#1A1A1A] active:text-white flex items-center justify-between text-xs font-bold uppercase font-mono tracking-wider transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#FF3E00]" />
                  <span>{lang === 'en' ? 'Switch to 中文 (Chinese)' : '切换为 English (英文)'}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#1A1A1A]/40" />
              </button>
            </div>

            {/* User Account / Firebase Auth Row in Drawer */}
            <div className="pt-2 border-t border-[#1A1A1A]/20">
              {user ? (
                <div className="p-3 border-2 border-[#1A1A1A] bg-white space-y-3">
                  <div className="flex items-center gap-3">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || 'User'}
                        className="w-10 h-10 rounded-full border-2 border-[#1A1A1A] object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#1A1A1A] text-white font-bold flex items-center justify-center">
                        {(user.displayName || user.email || 'U')[0].toUpperCase()}
                      </div>
                    )}
                    <div className="overflow-hidden">
                      <div className="text-xs font-bold text-[#1A1A1A] truncate">
                        {user.displayName || 'Motion Designer'}
                      </div>
                      <div className="text-[10px] font-mono text-[#1A1A1A]/60 truncate">
                        {user.email}
                      </div>
                      <div className="flex items-center gap-1 text-[9px] font-mono text-emerald-600 font-bold mt-0.5">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        <span>Cloud Synced</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={async () => {
                      await logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2 px-3 border border-[#1A1A1A] bg-[#FAF9F6] active:bg-rose-100 text-rose-700 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={async () => {
                    try {
                      await signInWithGoogle();
                      setMobileMenuOpen(false);
                    } catch (e) {
                      console.error(e);
                    }
                  }}
                  className="w-full py-3 px-4 border-2 border-[#1A1A1A] bg-[#1A1A1A] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-[2px_2px_0px_#FF3E00] active:translate-y-0.5 transition-all cursor-pointer"
                >
                  <LogIn className="w-4 h-4 text-[#FF3E00]" />
                  <span>Sign In with Google</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
