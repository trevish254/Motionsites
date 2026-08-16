import { MotionPrompt } from '../types';
import { INITIAL_PROMPTS } from './initialPrompts';
import { extractTags, extractFonts, extractAssets } from '../utils/promptUtils';

export function enrichPrompt(p: MotionPrompt): MotionPrompt {
  return {
    ...p,
    extractedTags: extractTags(p),
    extractedFonts: extractFonts(p.prompt_text || ''),
    extractedAssets: extractAssets(p.prompt_text || ''),
  };
}

export const ALL_INITIAL_PROMPTS: MotionPrompt[] = INITIAL_PROMPTS.map(enrichPrompt);

let cachedPrompts: MotionPrompt[] | null = null;

export async function fetchAllPrompts(): Promise<MotionPrompt[]> {
  if (cachedPrompts && cachedPrompts.length > 20) {
    return cachedPrompts;
  }

  try {
    const res = await fetch('/prompts.json');
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const rawData: MotionPrompt[] = await res.json();
    if (Array.isArray(rawData) && rawData.length > 0) {
      cachedPrompts = rawData.map(enrichPrompt);
      return cachedPrompts;
    }
  } catch (err) {
    console.warn('Failed to load /prompts.json, using initial dataset fallback', err);
  }

  return ALL_INITIAL_PROMPTS;
}
