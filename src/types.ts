export interface PromptMedia {
  promptId: string;
  mediaUrl: string;
  mediaType: 'image' | 'video' | 'gif';
  aspectRatio?: string;
  caption?: string;
  uploadedBy?: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MotionPrompt {
  id: string;
  title: string;
  category: string;
  type: string;
  is_free: boolean;
  page_type?: string;
  prompt_text: string;
  description: string;
  platform: 'website' | 'app';
  // Computed / Extracted metadata
  extractedFonts?: string[];
  extractedAssets?: string[];
  extractedTags?: string[];
  // Attached CMS media
  media?: PromptMedia;
}

export type PlatformFilter = 'all' | 'website' | 'app';
export type TierFilter = 'all' | 'free' | 'premium';
export type SortOption = 'default' | 'title-asc' | 'title-desc' | 'length-desc' | 'length-asc';
export type ViewMode = 'grid' | 'compact';
export type ActiveTab = 'gallery' | 'cms' | 'analysis' | 'remixer' | 'favorites';

export interface FilterState {
  searchQuery: string;
  platform: PlatformFilter;
  tier: TierFilter;
  category: string;
  type: string;
  tag: string;
  sort: SortOption;
  onlyFavorites: boolean;
}
