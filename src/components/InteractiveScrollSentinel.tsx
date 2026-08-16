import React, { useEffect, useRef } from 'react';
import { Sparkles, ArrowUp, CheckCircle2, ChevronUp } from 'lucide-react';
import { PromptCardSkeletonGrid, CompactListViewSkeleton, InteractiveMotionLoader } from './Skeletons';
import { ViewMode } from '../types';

interface InteractiveScrollSentinelProps {
  hasMore: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
  loadedCount: number;
  totalCount: number;
  viewMode: ViewMode;
  onScrollToTop: () => void;
}

export const InteractiveScrollSentinel: React.FC<InteractiveScrollSentinelProps> = ({
  hasMore,
  isLoadingMore,
  onLoadMore,
  loadedCount,
  totalCount,
  viewMode,
  onScrollToTop,
}) => {
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Setup IntersectionObserver for auto loading as user scrolls
  useEffect(() => {
    if (!hasMore || isLoadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting) {
          onLoadMore();
        }
      },
      {
        root: null,
        rootMargin: '250px', // Trigger before hitting absolute bottom
        threshold: 0.1,
      }
    );

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel);
      }
    };
  }, [hasMore, isLoadingMore, onLoadMore]);

  return (
    <div className="py-6 space-y-6">
      {/* Loading Skeletons State when loading more */}
      {isLoadingMore && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <InteractiveMotionLoader
            loadedCount={loadedCount}
            totalCount={totalCount}
            message="Loading next motion directives as you scroll..."
          />
          {viewMode === 'grid' ? (
            <PromptCardSkeletonGrid count={6} />
          ) : (
            <CompactListViewSkeleton rows={6} />
          )}
        </div>
      )}

      {/* Sentinel Trigger Node */}
      {hasMore && !isLoadingMore && (
        <div ref={sentinelRef} className="h-12 flex items-center justify-center">
          <button
            onClick={onLoadMore}
            className="text-xs font-mono font-bold uppercase tracking-wider text-[#1A1A1A]/50 hover:text-[#FF3E00] flex items-center gap-1.5 transition-colors cursor-pointer py-2 px-4 border border-dashed border-[#1A1A1A]/20 hover:border-[#FF3E00]"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FF3E00]" />
            <span>Scroll down or click to load next batch</span>
          </button>
        </div>
      )}

      {/* Reached End of Catalog State */}
      {!hasMore && totalCount > 0 && (
        <div className="border-2 border-[#1A1A1A] bg-[#FAF9F6] p-6 text-center space-y-3 shadow-[4px_4px_0px_#1A1A1A] max-w-lg mx-auto">
          <div className="w-10 h-10 mx-auto rounded-full bg-[#1A1A1A] text-white flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-[#FF3E00]" />
          </div>
          <div className="font-serif italic font-bold text-lg text-[#1A1A1A]">
            You've explored all {totalCount} prompts!
          </div>
          <p className="text-xs text-[#1A1A1A]/70 font-mono">
            Every directive, easing curve, and visual showcase is loaded.
          </p>
          <button
            onClick={onScrollToTop}
            className="inline-flex items-center gap-2 px-4 py-2 border-2 border-[#1A1A1A] bg-[#1A1A1A] text-white hover:bg-[#FF3E00] hover:border-[#FF3E00] text-xs font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-[2px_2px_0px_#1A1A1A]"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span>Back to top</span>
          </button>
        </div>
      )}
    </div>
  );
};

/**
 * Floating Back To Top Button with Circular Scroll Meter
 */
export const FloatingScrollTopButton: React.FC = () => {
  const [show, setShow] = React.useState(false);
  const [scrollProgress, setScrollProgress] = React.useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(100, Math.round((scrollY / docHeight) * 100)) : 0;

      setScrollProgress(progress);
      setShow(scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 left-6 z-40 p-3 border-2 border-[#1A1A1A] bg-[#FAF9F6] hover:bg-[#1A1A1A] text-[#1A1A1A] hover:text-white shadow-[4px_4px_0px_#1A1A1A] transition-all cursor-pointer flex flex-col items-center gap-0.5 group animate-in fade-in zoom-in-90 duration-200"
      title="Scroll to Top"
    >
      <ChevronUp className="w-5 h-5 text-[#FF3E00] group-hover:text-white transition-colors" />
      <span className="text-[9px] font-mono font-bold">{scrollProgress}%</span>
    </button>
  );
};
