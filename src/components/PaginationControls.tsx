import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Infinity as InfinityIcon,
  Layers,
  ArrowUp,
  SlidersHorizontal,
} from 'lucide-react';
import { Language, translations } from '../utils/translations';

export type PaginationMode = 'infinite' | 'paged';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  paginationMode: PaginationMode;
  onModeChange: (mode: PaginationMode) => void;
  lang?: Language;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  paginationMode,
  onModeChange,
  lang = 'en',
}) => {
  const t = translations[lang] || {};

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers with smart ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push('...');
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="border-2 border-[#1A1A1A] bg-[#FAF9F6] p-4 sm:p-5 my-8 shadow-[4px_4px_0px_#1A1A1A] space-y-4">
      {/* Top Meta & Mode Selector Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#1A1A1A]/15">
        {/* Current range info */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#FF3E00] animate-pulse" />
          <span className="text-xs font-mono font-bold text-[#1A1A1A] uppercase tracking-wider">
            Showing {startItem}–{endItem} of {totalItems} Prompts
          </span>
        </div>

        {/* Mode Toggle & Items Per Page Selector */}
        <div className="flex items-center gap-2.5 flex-wrap self-end sm:self-auto">
          {/* Mode Switcher: Infinite vs Paged */}
          <div className="flex items-center border-2 border-[#1A1A1A] bg-white p-0.5 shadow-[2px_2px_0px_#1A1A1A]">
            <button
              onClick={() => onModeChange('paged')}
              className={`px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer ${
                paginationMode === 'paged'
                  ? 'bg-[#1A1A1A] text-white'
                  : 'text-[#1A1A1A] hover:bg-[#FAF9F6]'
              }`}
              title="Numbered Pages Mode"
            >
              <Layers className="w-3 h-3" />
              <span>Pages</span>
            </button>
            <button
              onClick={() => onModeChange('infinite')}
              className={`px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer ${
                paginationMode === 'infinite'
                  ? 'bg-[#FF3E00] text-white'
                  : 'text-[#1A1A1A] hover:bg-[#FAF9F6]'
              }`}
              title="Infinite Scroll Mode"
            >
              <InfinityIcon className="w-3 h-3" />
              <span>Infinite</span>
            </button>
          </div>

          {/* Items Per Page dropdown */}
          <div className="flex items-center gap-1.5 bg-white border-2 border-[#1A1A1A] px-2 py-1 shadow-[2px_2px_0px_#1A1A1A]">
            <span className="text-[10px] font-mono font-bold uppercase text-[#1A1A1A]/60">Per Page:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="bg-transparent text-xs font-mono font-bold uppercase text-[#1A1A1A] focus:outline-none cursor-pointer"
            >
              <option value={12}>12</option>
              <option value={24}>24</option>
              <option value={36}>36</option>
              <option value={48}>48</option>
              <option value={96}>96</option>
            </select>
          </div>
        </div>
      </div>

      {/* Numbered Page Buttons (Visible in 'paged' mode) */}
      {paginationMode === 'paged' && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
          {/* Navigation Arrows */}
          <div className="flex items-center gap-1">
            {/* First page */}
            <button
              disabled={currentPage === 1}
              onClick={() => onPageChange(1)}
              className="p-2 border-2 border-[#1A1A1A] bg-white hover:bg-[#1A1A1A] hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-[#1A1A1A] transition-colors shadow-[2px_2px_0px_#1A1A1A] cursor-pointer"
              title="First Page"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            {/* Previous page */}
            <button
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="p-2 border-2 border-[#1A1A1A] bg-white hover:bg-[#1A1A1A] hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-[#1A1A1A] transition-colors shadow-[2px_2px_0px_#1A1A1A] cursor-pointer"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Numbered page pills */}
          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            {getPageNumbers().map((p, idx) => {
              if (p === '...') {
                return (
                  <span
                    key={`ellipsis-${idx}`}
                    className="px-2 py-1 text-xs font-mono font-bold text-[#1A1A1A]/40"
                  >
                    ...
                  </span>
                );
              }
              const pageNum = Number(p);
              const isActive = pageNum === currentPage;
              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`min-w-[34px] h-[34px] px-2 text-xs font-mono font-bold border-2 border-[#1A1A1A] transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#1A1A1A] text-white shadow-[2px_2px_0px_#FF3E00] -translate-y-0.5'
                      : 'bg-white text-[#1A1A1A] hover:bg-[#FF3E00] hover:text-white shadow-[2px_2px_0px_#1A1A1A]'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          {/* Next / Last Arrows */}
          <div className="flex items-center gap-1">
            {/* Next page */}
            <button
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="p-2 border-2 border-[#1A1A1A] bg-white hover:bg-[#1A1A1A] hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-[#1A1A1A] transition-colors shadow-[2px_2px_0px_#1A1A1A] cursor-pointer"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            {/* Last page */}
            <button
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(totalPages)}
              className="p-2 border-2 border-[#1A1A1A] bg-white hover:bg-[#1A1A1A] hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-[#1A1A1A] transition-colors shadow-[2px_2px_0px_#1A1A1A] cursor-pointer"
              title="Last Page"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
