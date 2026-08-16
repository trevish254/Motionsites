import { MotionPrompt } from '../types';
import { RAW_PROMPTS } from './promptsRaw';
import { extractTags, extractFonts, extractAssets } from '../utils/promptUtils';

export const ALL_PROMPTS: MotionPrompt[] = RAW_PROMPTS.map((p) => ({
  ...p,
  extractedTags: extractTags(p),
  extractedFonts: extractFonts(p.prompt_text || ''),
  extractedAssets: extractAssets(p.prompt_text || ''),
}));
