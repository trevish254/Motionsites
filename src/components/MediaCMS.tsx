import React, { useState, useMemo, useRef } from 'react';
import {
  UploadCloud,
  Image as ImageIcon,
  Film,
  Search,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Sparkles,
  RefreshCw,
  X,
  Play,
  Filter,
  Eye,
  Plus,
  HelpCircle,
  FileCode,
  Layers,
  ArrowUpRight,
  SlidersHorizontal,
  CloudCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MotionPrompt, PromptMedia } from '../types';
import { Language, translations } from '../utils/translations';
import { useAuth } from '../context/AuthContext';
import { savePromptMediaFirestore, deletePromptMediaFirestore } from '../services/firebaseService';

interface MediaCMSProps {
  prompts: MotionPrompt[];
  mediaMap: Record<string, PromptMedia>;
  onMediaUpdated: (promptId: string, media: PromptMedia | null) => void;
  onToast: (msg: string) => void;
  lang?: Language;
  initialSearch?: string;
  onOpenPromptDetail: (prompt: MotionPrompt) => void;
}

// Preset high quality motion animation samples for quick 1-click binding & testing
const PRESET_MOTION_PREVIEWS = [
  {
    name: 'Interactive Canvas Physics',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    type: 'image' as const,
    aspectRatio: '16:9',
  },
  {
    name: 'Kinetic Typography Loop',
    url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    type: 'image' as const,
    aspectRatio: '16:9',
  },
  {
    name: 'Bento Grid Spatial Glow',
    url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80',
    type: 'image' as const,
    aspectRatio: '16:9',
  },
  {
    name: 'Liquid Glass Distortion',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    type: 'image' as const,
    aspectRatio: '16:9',
  },
  {
    name: 'Minimalist Dark Spotlight',
    url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
    type: 'image' as const,
    aspectRatio: '16:9',
  },
];

export const MediaCMS: React.FC<MediaCMSProps> = ({
  prompts,
  mediaMap,
  onMediaUpdated,
  onToast,
  lang = 'en',
  initialSearch = '',
  onOpenPromptDetail,
}) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'with_media' | 'no_media'>('all');
  const [selectedPrompt, setSelectedPrompt] = useState<MotionPrompt | null>(null);

  // Modal / Form state for uploading
  const [inputUrl, setInputUrl] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video' | 'gif'>('image');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [caption, setCaption] = useState('');
  const [uploadTab, setUploadTab] = useState<'file' | 'url' | 'presets'>('file');
  const [isDragOver, setIsDragOver] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stats calculation
  const totalPrompts = prompts.length;
  const attachedCount = useMemo(() => {
    return prompts.filter((p) => !!mediaMap[p.id]?.mediaUrl).length;
  }, [prompts, mediaMap]);
  const missingCount = totalPrompts - attachedCount;

  // Categories list
  const categories = useMemo(() => {
    const cats = new Set<string>();
    prompts.forEach((p) => {
      if (p.category) cats.add(p.category);
    });
    return Array.from(cats);
  }, [prompts]);

  // Filtered prompts
  const filteredPrompts = useMemo(() => {
    return prompts.filter((p) => {
      const hasMedia = !!mediaMap[p.id]?.mediaUrl;
      if (statusFilter === 'with_media' && !hasMedia) return false;
      if (statusFilter === 'no_media' && hasMedia) return false;

      if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchId = p.id.toLowerCase().includes(q);
        const matchDesc = p.description?.toLowerCase().includes(q);
        const matchType = p.type?.toLowerCase().includes(q);
        const matchCat = p.category?.toLowerCase().includes(q);
        if (!matchTitle && !matchId && !matchDesc && !matchType && !matchCat) {
          return false;
        }
      }

      return true;
    });
  }, [prompts, mediaMap, statusFilter, categoryFilter, searchQuery]);

  // Open edit modal for prompt
  const handleOpenEdit = (prompt: MotionPrompt) => {
    setSelectedPrompt(prompt);
    const existing = mediaMap[prompt.id];
    if (existing) {
      setInputUrl(existing.mediaUrl);
      setMediaType(existing.mediaType || 'image');
      setAspectRatio(existing.aspectRatio || '16:9');
      setCaption(existing.caption || '');
      setUploadTab('url');
    } else {
      setInputUrl('');
      setMediaType('image');
      setAspectRatio('16:9');
      setCaption('');
      setUploadTab('file');
    }
  };

  // Close modal
  const handleCloseModal = () => {
    setSelectedPrompt(null);
    setInputUrl('');
    setIsDragOver(false);
  };

  // Handle File selection & Drag and drop
  const handleProcessFile = (file: File) => {
    const isVid = file.type.startsWith('video/');
    const isGif = file.type === 'image/gif';

    if (isVid) {
      setMediaType('video');
    } else if (isGif) {
      setMediaType('gif');
    } else {
      setMediaType('image');
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setInputUrl(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  // Save media binding
  const handleSaveMedia = async () => {
    if (!selectedPrompt) return;
    if (!inputUrl.trim()) {
      onToast('Please select a file or enter a media URL');
      return;
    }

    setIsSaving(true);
    const mediaPayload: PromptMedia = {
      promptId: selectedPrompt.id,
      mediaUrl: inputUrl.trim(),
      mediaType,
      aspectRatio,
      caption: caption.trim() || undefined,
      uploadedBy: user?.displayName || user?.email?.split('@')[0] || 'CMS Designer',
      userId: user?.uid || 'anonymous',
      updatedAt: new Date().toISOString(),
      createdAt: mediaMap[selectedPrompt.id]?.createdAt || new Date().toISOString(),
    };

    try {
      // 1. Update local state instantly for lightning-fast UI
      onMediaUpdated(selectedPrompt.id, mediaPayload);

      // 2. Persist to Firestore
      await savePromptMediaFirestore(mediaPayload);

      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      onToast(`✓ Media linked to "${selectedPrompt.title}" across the site!`);
      handleCloseModal();
    } catch (err) {
      console.error('Failed to save media to Firestore:', err);
      // Still keep in local state
      onToast('Saved locally in browser (Firestore sync warning)');
      handleCloseModal();
    } finally {
      setIsSaving(false);
    }
  };

  // Remove media binding
  const handleRemoveMedia = async (promptId: string) => {
    if (!confirm('Are you sure you want to remove media from this prompt?')) return;

    try {
      onMediaUpdated(promptId, null);
      await deletePromptMediaFirestore(promptId);
      onToast('Media removed from prompt');
      if (selectedPrompt?.id === promptId) {
        handleCloseModal();
      }
    } catch (err) {
      console.error(err);
      onToast('Removed locally');
      if (selectedPrompt?.id === promptId) {
        handleCloseModal();
      }
    }
  };

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-200">
      {/* CMS Header & Stat Banner */}
      <div className="border-2 border-[#1A1A1A] bg-[#FAF9F6] p-6 lg:p-8 shadow-[4px_4px_0px_#1A1A1A]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#1A1A1A]/15">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#1A1A1A] text-white text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <UploadCloud className="w-3.5 h-3.5 text-[#FF3E00]" />
              <span>Prompt Media CMS</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-black text-[#1A1A1A] tracking-tight">
              Content Management System
            </h1>
            <p className="text-xs lg:text-sm text-[#1A1A1A]/70 mt-1 max-w-2xl font-medium">
              Upload, link, and manage high-definition images, GIF loops, or video recordings for any of the 328+ motion design prompts. Media displays directly across cards, search, and full-screen viewers.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-white border-2 border-[#1A1A1A] text-center shadow-[2px_2px_0px_#1A1A1A]">
              <div className="text-[10px] font-mono font-bold uppercase text-[#1A1A1A]/60">Total Prompts</div>
              <div className="text-xl font-black text-[#1A1A1A] mt-0.5">{totalPrompts}</div>
            </div>
            <div className="p-3 bg-emerald-50 border-2 border-[#1A1A1A] text-center shadow-[2px_2px_0px_#1A1A1A]">
              <div className="text-[10px] font-mono font-bold uppercase text-emerald-800">Media Attached</div>
              <div className="text-xl font-black text-emerald-700 mt-0.5">{attachedCount}</div>
            </div>
            <div className="p-3 bg-white border-2 border-[#1A1A1A] text-center shadow-[2px_2px_0px_#1A1A1A]">
              <div className="text-[10px] font-mono font-bold uppercase text-[#1A1A1A]/60">Needs Media</div>
              <div className="text-xl font-black text-[#FF3E00] mt-0.5">{missingCount}</div>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="pt-6 flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#1A1A1A]/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="cms-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Search prompts by name (e.g. "Bolt Studio", "Spotlight", "Bento")...'
              className="w-full pl-10 pr-9 py-2.5 bg-white border-2 border-[#1A1A1A] text-sm text-[#1A1A1A] placeholder:text-[#1A1A1A]/40 font-medium focus:outline-none focus:ring-2 focus:ring-[#FF3E00]/30"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1A1A1A]/50 hover:text-[#1A1A1A]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-white border-2 border-[#1A1A1A] overflow-x-auto">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap ${
                statusFilter === 'all' ? 'bg-[#1A1A1A] text-white' : 'text-[#1A1A1A]/70 hover:text-[#1A1A1A]'
              }`}
            >
              All ({totalPrompts})
            </button>
            <button
              onClick={() => setStatusFilter('with_media')}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                statusFilter === 'with_media'
                  ? 'bg-emerald-600 text-white'
                  : 'text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>With Media ({attachedCount})</span>
            </button>
            <button
              onClick={() => setStatusFilter('no_media')}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap ${
                statusFilter === 'no_media' ? 'bg-[#FF3E00] text-white' : 'text-[#1A1A1A]/70 hover:text-[#1A1A1A]'
              }`}
            >
              Needs Media ({missingCount})
            </button>
          </div>

          {/* Category Dropdown */}
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full md:w-48 px-3 py-2.5 bg-white border-2 border-[#1A1A1A] text-xs font-bold text-[#1A1A1A] uppercase tracking-wider focus:outline-none cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Prompts List & Upload Actions */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#1A1A1A]/70">
            Showing {filteredPrompts.length} of {totalPrompts} Prompts
          </div>
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('all');
                setStatusFilter('all');
              }}
              className="text-xs font-mono font-bold text-[#FF3E00] hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>

        {filteredPrompts.length === 0 ? (
          <div className="border-2 border-dashed border-[#1A1A1A]/30 bg-white p-12 text-center space-y-3">
            <HelpCircle className="w-8 h-8 text-[#1A1A1A]/40 mx-auto" />
            <h3 className="text-base font-bold text-[#1A1A1A]">No matching prompts found</h3>
            <p className="text-xs text-[#1A1A1A]/60 max-w-sm mx-auto font-medium">
              Try modifying your search keywords or switching filter criteria.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setCategoryFilter('all');
              }}
              className="px-4 py-2 border-2 border-[#1A1A1A] bg-[#1A1A1A] text-white text-xs font-bold uppercase tracking-wider"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredPrompts.map((prompt) => {
              const currentMedia = mediaMap[prompt.id];
              const hasMedia = !!currentMedia?.mediaUrl;

              return (
                <div
                  key={prompt.id}
                  id={`cms-card-${prompt.id}`}
                  className={`border-2 border-[#1A1A1A] bg-white p-4 transition-all flex flex-col justify-between group hover:shadow-[4px_4px_0px_#1A1A1A] ${
                    hasMedia ? 'border-emerald-700/80' : ''
                  }`}
                >
                  <div>
                    {/* Media Thumbnail or Empty Drop Area */}
                    {hasMedia ? (
                      <div className="relative aspect-video mb-3.5 bg-[#1A1A1A] border-2 border-[#1A1A1A] overflow-hidden group/media">
                        {currentMedia.mediaType === 'video' ? (
                          <video
                            src={currentMedia.mediaUrl}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <img
                            src={currentMedia.mediaUrl}
                            alt={prompt.title}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        )}
                        <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#1A1A1A]/90 backdrop-blur-xs text-white text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                          {currentMedia.mediaType === 'video' ? (
                            <Film className="w-3 h-3 text-[#FF3E00]" />
                          ) : (
                            <ImageIcon className="w-3 h-3 text-[#FF3E00]" />
                          )}
                          <span>{currentMedia.mediaType}</span>
                        </div>
                        <button
                          onClick={() => handleRemoveMedia(prompt.id)}
                          className="absolute top-2 right-2 p-1.5 bg-rose-600 text-white hover:bg-rose-700 transition-colors opacity-0 group-hover/media:opacity-100 cursor-pointer"
                          title="Remove media"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => handleOpenEdit(prompt)}
                        className="aspect-video mb-3.5 border-2 border-dashed border-[#1A1A1A]/30 bg-[#FAF9F6] hover:bg-[#1A1A1A]/5 hover:border-[#1A1A1A] transition-all flex flex-col items-center justify-center p-3 cursor-pointer text-center group/drop"
                      >
                        <div className="w-8 h-8 rounded-full border border-[#1A1A1A]/30 bg-white flex items-center justify-center mb-1.5 group-hover/drop:scale-110 transition-transform">
                          <Plus className="w-4 h-4 text-[#1A1A1A]" />
                        </div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#1A1A1A]">
                          Upload Image / Video
                        </span>
                        <span className="text-[10px] text-[#1A1A1A]/50 font-mono">
                          Drag & drop or paste URL
                        </span>
                      </div>
                    )}

                    {/* Metadata header */}
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1A1A1A]/60 truncate">
                        {prompt.category || 'Interaction'}
                      </span>
                      <span className="px-1.5 py-0.5 bg-[#1A1A1A]/5 text-[10px] font-mono font-bold text-[#1A1A1A]">
                        #{prompt.id}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-black text-[#1A1A1A] tracking-tight line-clamp-1 mb-1">
                      {prompt.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-[#1A1A1A]/70 line-clamp-2 font-medium mb-4 leading-relaxed">
                      {prompt.description || 'Custom interactive motion specification.'}
                    </p>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-[#1A1A1A]/10 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onOpenPromptDetail(prompt)}
                      className="px-2.5 py-1.5 border border-[#1A1A1A]/30 hover:border-[#1A1A1A] text-[11px] font-bold uppercase tracking-wider text-[#1A1A1A] flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3 h-3" />
                      <span>View</span>
                    </button>

                    <button
                      id={`btn-edit-media-${prompt.id}`}
                      onClick={() => handleOpenEdit(prompt)}
                      className={`px-3 py-1.5 border-2 border-[#1A1A1A] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                        hasMedia
                          ? 'bg-white hover:bg-emerald-50 text-emerald-800'
                          : 'bg-[#1A1A1A] text-white hover:bg-[#FF3E00] hover:border-[#FF3E00]'
                      }`}
                    >
                      {hasMedia ? (
                        <>
                          <SlidersHorizontal className="w-3 h-3" />
                          <span>Edit Media</span>
                        </>
                      ) : (
                        <>
                          <UploadCloud className="w-3 h-3" />
                          <span>Upload Media</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Upload & Binding Modal Form */}
      {selectedPrompt && (
        <div className="fixed inset-0 z-50 bg-[#1A1A1A]/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#FAF9F6] border-2 border-[#1A1A1A] shadow-[8px_8px_0px_#1A1A1A] p-6 lg:p-8 relative animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            {/* Close button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-5 right-5 p-1.5 border border-[#1A1A1A] bg-white hover:bg-rose-50 text-[#1A1A1A] hover:text-rose-600 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="mb-6 pb-4 border-b border-[#1A1A1A]/20 pr-8">
              <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-wider text-[#FF3E00] mb-1">
                <span>Binding Media to #{selectedPrompt.id}</span>
                <span>•</span>
                <span>{selectedPrompt.category}</span>
              </div>
              <h2 className="text-xl font-black text-[#1A1A1A] tracking-tight">
                {selectedPrompt.title}
              </h2>
            </div>

            {/* Upload Method Selector Tabs */}
            <div className="flex items-center gap-2 border-b-2 border-[#1A1A1A] mb-5 pb-0.5">
              <button
                onClick={() => setUploadTab('file')}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border-b-2 -mb-[2px] ${
                  uploadTab === 'file'
                    ? 'border-[#FF3E00] text-[#FF3E00] bg-white'
                    : 'border-transparent text-[#1A1A1A]/60 hover:text-[#1A1A1A]'
                }`}
              >
                Upload File (Drag & Drop)
              </button>
              <button
                onClick={() => setUploadTab('url')}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border-b-2 -mb-[2px] ${
                  uploadTab === 'url'
                    ? 'border-[#FF3E00] text-[#FF3E00] bg-white'
                    : 'border-transparent text-[#1A1A1A]/60 hover:text-[#1A1A1A]'
                }`}
              >
                Direct Image/Video URL
              </button>
              <button
                onClick={() => setUploadTab('presets')}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border-b-2 -mb-[2px] ${
                  uploadTab === 'presets'
                    ? 'border-[#FF3E00] text-[#FF3E00] bg-white'
                    : 'border-transparent text-[#1A1A1A]/60 hover:text-[#1A1A1A]'
                }`}
              >
                Curated Presets
              </button>
            </div>

            {/* Tab 1: File Upload / Drag & Drop */}
            {uploadTab === 'file' && (
              <div className="space-y-4 mb-6">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleProcessFile(e.target.files[0]);
                    }
                  }}
                  accept="image/png,image/jpeg,image/webp,image/gif,video/mp4,video/webm"
                  className="hidden"
                />
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                  }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-2 ${
                    isDragOver
                      ? 'border-[#FF3E00] bg-[#FF3E00]/10 scale-[0.99]'
                      : 'border-[#1A1A1A]/40 bg-white hover:border-[#1A1A1A] hover:bg-[#FAF9F6]'
                  }`}
                >
                  <div className="w-12 h-12 rounded-full border-2 border-[#1A1A1A] bg-[#FAF9F6] flex items-center justify-center mb-1">
                    <UploadCloud className="w-6 h-6 text-[#1A1A1A]" />
                  </div>
                  <div className="text-sm font-bold text-[#1A1A1A]">
                    Click to select or drag and drop image / video here
                  </div>
                  <div className="text-xs font-mono text-[#1A1A1A]/50">
                    Supports PNG, JPG, GIF, WebP, MP4, WebM
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Direct URL */}
            {uploadTab === 'url' && (
              <div className="space-y-3 mb-6">
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#1A1A1A]">
                  Direct Media URL (Image, GIF, or Video MP4):
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={inputUrl}
                    onChange={(e) => {
                      const val = e.target.value;
                      setInputUrl(val);
                      if (val.match(/\.(mp4|webm)$/i)) {
                        setMediaType('video');
                      } else if (val.match(/\.gif$/i)) {
                        setMediaType('gif');
                      }
                    }}
                    placeholder="https://example.com/demo-animation.gif or .mp4 or .png"
                    className="flex-1 px-3 py-2 bg-white border-2 border-[#1A1A1A] text-sm text-[#1A1A1A] font-mono focus:outline-none focus:ring-2 focus:ring-[#FF3E00]/30"
                  />
                  {inputUrl && (
                    <button
                      onClick={() => setInputUrl('')}
                      className="px-3 border-2 border-[#1A1A1A] bg-white text-xs font-bold"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Tab 3: Presets */}
            {uploadTab === 'presets' && (
              <div className="space-y-2 mb-6">
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#1A1A1A] mb-2">
                  Select a curated sample animation:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {PRESET_MOTION_PREVIEWS.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setInputUrl(preset.url);
                        setMediaType(preset.type);
                        setAspectRatio(preset.aspectRatio);
                        setCaption(preset.name);
                      }}
                      className={`p-2.5 border-2 text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                        inputUrl === preset.url
                          ? 'border-[#FF3E00] bg-[#FF3E00]/10 shadow-[2px_2px_0px_#1A1A1A]'
                          : 'border-[#1A1A1A] bg-white hover:bg-[#FAF9F6]'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.name}
                        className="w-10 h-10 object-cover border border-[#1A1A1A] shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="overflow-hidden">
                        <div className="text-xs font-bold text-[#1A1A1A] truncate">{preset.name}</div>
                        <div className="text-[10px] font-mono text-[#1A1A1A]/60">16:9 • High-Res</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Media Attributes Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6 p-3 bg-white border-2 border-[#1A1A1A]">
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#1A1A1A]/70 mb-1">
                  Format Type
                </label>
                <select
                  value={mediaType}
                  onChange={(e) => setMediaType(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 border border-[#1A1A1A] text-xs font-bold text-[#1A1A1A] bg-[#FAF9F6]"
                >
                  <option value="image">Static Image (PNG/JPG)</option>
                  <option value="gif">Animated GIF</option>
                  <option value="video">MP4 / WebM Video</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#1A1A1A]/70 mb-1">
                  Aspect Ratio
                </label>
                <select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-[#1A1A1A] text-xs font-bold text-[#1A1A1A] bg-[#FAF9F6]"
                >
                  <option value="16:9">16:9 Landscape</option>
                  <option value="4:3">4:3 Standard</option>
                  <option value="1:1">1:1 Square</option>
                  <option value="9:16">9:16 Mobile Portrait</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#1A1A1A]/70 mb-1">
                  Caption / Credit (Optional)
                </label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="e.g. Interaction prototype"
                  className="w-full px-2.5 py-1.5 border border-[#1A1A1A] text-xs text-[#1A1A1A] bg-[#FAF9F6]"
                />
              </div>
            </div>

            {/* Live Preview Box */}
            {inputUrl && (
              <div className="mb-6 space-y-2">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#1A1A1A] flex items-center justify-between">
                  <span>Live Preview (How it will display across website):</span>
                  <span className="text-emerald-700 flex items-center gap-1 font-bold">
                    <CheckCircle2 className="w-3 h-3" /> Ready
                  </span>
                </div>
                <div className="relative aspect-video max-h-56 bg-[#1A1A1A] border-2 border-[#1A1A1A] overflow-hidden flex items-center justify-center">
                  {mediaType === 'video' ? (
                    <video
                      src={inputUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      controls
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <img
                      src={inputUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-[#1A1A1A]/20">
              {mediaMap[selectedPrompt.id] ? (
                <button
                  type="button"
                  onClick={() => handleRemoveMedia(selectedPrompt.id)}
                  className="px-4 py-2.5 border border-rose-600 text-rose-700 bg-rose-50 hover:bg-rose-100 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Media</span>
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2.5 border-2 border-[#1A1A1A] bg-white hover:bg-[#FAF9F6] text-xs font-bold uppercase tracking-wider text-[#1A1A1A] cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  id="btn-save-cms-media"
                  type="button"
                  onClick={handleSaveMedia}
                  disabled={isSaving || !inputUrl}
                  className="px-6 py-2.5 border-2 border-[#1A1A1A] bg-[#1A1A1A] hover:bg-[#FF3E00] hover:border-[#FF3E00] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all shadow-[2px_2px_0px_#1A1A1A] disabled:opacity-50"
                >
                  <CloudCheck className="w-4 h-4" />
                  <span>{isSaving ? 'Saving & Syncing...' : 'Save & Publish to Site'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
