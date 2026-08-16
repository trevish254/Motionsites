import { MotionPrompt } from '../types';
import rawPromptsData from './allPrompts.json';
import { extractTags, extractFonts, extractAssets } from '../utils/promptUtils';

export const ALL_PROMPTS: MotionPrompt[] = (rawPromptsData as MotionPrompt[]).map((p) => ({
  ...p,
  extractedTags: extractTags(p),
  extractedFonts: extractFonts(p.prompt_text || ''),
  extractedAssets: extractAssets(p.prompt_text || ''),
}));
