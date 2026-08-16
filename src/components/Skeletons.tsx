import React from 'react';
import { Sparkles, Layers, RefreshCw } from 'lucide-react';

/**
 * Neo-Brutalist Shimmer Skeleton for Prompt Card
 */
export const PromptCardSkeleton: React.FC<{ index?: number }> = ({ index = 0 }) => {
  return (
    <div
      className="relative border-2 border-[#1A1A1A] bg-[#FAF9F6] p-6 flex flex-col justify-between shadow-[4px_4px_0px_#1A1A1A] animate-pulse overflow-hidden select-none"
      style={{ animationDelay: `${(index % 6) * 120}ms` }}
    >
      {/* Top Meta Row */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-[#1A1A1A]/15">
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Platform pill skeleton */}
            <div className="w-14 h-5 bg-[#1A1A1A]/15 border border-[#1A1A1A]/20" />
            {/* Tier pill skeleton */}
            <div className="w-12 h-5 bg-[#FF3E00]/20 border border-[#FF3E00]/30" />
            {/* Category pill skeleton */}
            <div className="w-20 h-5 bg-[#1A1A1A]/10 border border-[#1A1A1A]/15" />
          </div>
          {/* Favorite button skeleton */}
          <div className="w-7 h-7 bg-[#1A1A1A]/10 border border-[#1A1A1A]/20" />
        </div>

        {/* Media thumbnail skeleton placeholder (intermittent) */}
        {index % 2 === 0 && (
          <div className="mb-4 h-36 bg-[#1A1A1A]/10 border border-[#1A1A1A]/20 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_1.8s_infinite]" />
            <Layers className="w-6 h-6 text-[#1A1A1A]/20" />
          </div>
        )}

        {/* Title skeleton */}
        <div className="space-y-2 mb-3">
          <div className="h-6 bg-[#1A1A1A]/25 w-[85%]" />
          <div className="h-4 bg-[#1A1A1A]/15 w-[60%]" />
        </div>

        {/* Description snippet lines */}
        <div className="space-y-2 mb-4">
          <div className="h-3 bg-[#1A1A1A]/15 w-full" />
          <div className="h-3 bg-[#1A1A1A]/15 w-[92%]" />
          <div className="h-3 bg-[#1A1A1A]/15 w-[75%]" />
        </div>

        {/* Tags row skeleton */}
        <div className="flex items-center gap-1.5 flex-wrap mb-4">
          <div className="w-14 h-4 bg-[#1A1A1A]/10" />
          <div className="w-16 h-4 bg-[#1A1A1A]/10" />
          <div className="w-12 h-4 bg-[#1A1A1A]/10" />
        </div>
      </div>

      {/* Card Footer Actions Skeleton */}
      <div className="pt-4 border-t border-[#1A1A1A]/15 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <div className="w-8 h-8 bg-[#1A1A1A]/15 border border-[#1A1A1A]/25" />
          <div className="w-8 h-8 bg-[#1A1A1A]/15 border border-[#1A1A1A]/25" />
        </div>
        <div className="w-24 h-8 bg-[#1A1A1A]/20 border border-[#1A1A1A]/30" />
      </div>

      {/* Shimmer sweep effect */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
    </div>
  );
};

/**
 * Grid of Skeleton Cards
 */
export const PromptCardSkeletonGrid: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <PromptCardSkeleton key={i} index={i} />
      ))}
    </div>
  );
};

/**
 * Compact Table View Skeleton Rows
 */
export const CompactListViewSkeleton: React.FC<{ rows?: number }> = ({ rows = 8 }) => {
  return (
    <div className="border-2 border-[#1A1A1A] bg-[#FAF9F6] shadow-[4px_4px_0px_#1A1A1A] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#1A1A1A] text-white font-mono font-bold uppercase tracking-wider text-[10px]">
              <th className="py-3.5 px-4 w-14 text-center border-r border-white/20">#</th>
              <th className="py-3.5 px-4 w-28">Type / Platform</th>
              <th className="py-3.5 px-4">Title & Details</th>
              <th className="py-3.5 px-4 w-40">Category</th>
              <th className="py-3.5 px-4 w-36 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1A1A1A]/15">
            {Array.from({ length: rows }).map((_, i) => (
              <tr key={i} className="animate-pulse bg-white/60">
                <td className="py-4 px-4 text-center border-r border-[#1A1A1A]/10">
                  <div className="w-6 h-4 bg-[#1A1A1A]/20 mx-auto" />
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-1.5">
                    <div className="w-10 h-4 bg-[#1A1A1A]/15" />
                    <div className="w-12 h-4 bg-[#FF3E00]/20" />
                  </div>
                </td>
                <td className="py-4 px-4 space-y-1.5">
                  <div className="w-48 h-4 bg-[#1A1A1A]/25" />
                  <div className="w-72 h-3 bg-[#1A1A1A]/15" />
                </td>
                <td className="py-4 px-4">
                  <div className="w-24 h-4 bg-[#1A1A1A]/15" />
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-7 h-7 bg-[#1A1A1A]/15" />
                    <div className="w-7 h-7 bg-[#1A1A1A]/15" />
                    <div className="w-7 h-7 bg-[#1A1A1A]/15" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/**
 * Neo-Brutalist Interactive Motion Loader Widget
 */
export const InteractiveMotionLoader: React.FC<{
  loadedCount: number;
  totalCount: number;
  message?: string;
}> = ({ loadedCount, totalCount, message = 'Loading more motion directives...' }) => {
  const percentage = Math.round((loadedCount / Math.max(1, totalCount)) * 100);

  return (
    <div className="border-2 border-[#1A1A1A] bg-[#FAF9F6] p-6 shadow-[6px_6px_0px_#1A1A1A] my-8 max-w-xl mx-auto flex flex-col items-center text-center space-y-4">
      {/* Animated Neo-Brutalist Cube Loader */}
      <div className="relative w-12 h-12 flex items-center justify-center">
        <div className="absolute inset-0 border-2 border-[#1A1A1A] bg-[#FF3E00] animate-spin" style={{ animationDuration: '3s' }} />
        <div className="relative z-10 w-6 h-6 border-2 border-white bg-[#1A1A1A] flex items-center justify-center text-white">
          <Sparkles className="w-3.5 h-3.5 text-[#FF3E00] animate-pulse" />
        </div>
      </div>

      <div className="space-y-1">
        <div className="font-serif italic font-bold text-base text-[#1A1A1A]">
          {message}
        </div>
        <div className="text-xs font-mono text-[#1A1A1A]/70 uppercase tracking-wider flex items-center justify-center gap-2">
          <span>Loaded {loadedCount} of {totalCount} prompts</span>
          <span>•</span>
          <span className="font-bold text-[#FF3E00]">{percentage}%</span>
        </div>
      </div>

      {/* Progress Track */}
      <div className="w-full h-2.5 border-2 border-[#1A1A1A] bg-white p-0.5 overflow-hidden">
        <div
          className="h-full bg-[#FF3E00] transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
