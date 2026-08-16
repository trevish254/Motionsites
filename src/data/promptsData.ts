import { MotionPrompt } from '../types';
import { extractTags, extractFonts, extractAssets } from '../utils/promptUtils';
import { CHUNK_1 } from './chunks/chunk1';
import { CHUNK_2 } from './chunks/chunk2';
import { CHUNK_3 } from './chunks/chunk3';
import { CHUNK_4 } from './chunks/chunk4';
import { CHUNK_5 } from './chunks/chunk5';
import { CHUNK_6 } from './chunks/chunk6';
import { CHUNK_7 } from './chunks/chunk7';
import { CHUNK_8 } from './chunks/chunk8';
import { CHUNK_9 } from './chunks/chunk9';
import { CHUNK_10 } from './chunks/chunk10';

export function enrichPrompt(p: MotionPrompt): MotionPrompt {
  return {
    ...p,
    extractedTags: extractTags(p),
    extractedFonts: extractFonts(p.prompt_text || ''),
    extractedAssets: extractAssets(p.prompt_text || ''),
  };
}

const RAW_ALL_PROMPTS: MotionPrompt[] = [
  ...CHUNK_1,
  ...CHUNK_2,
  ...CHUNK_3,
  ...CHUNK_4,
  ...CHUNK_5,
  ...CHUNK_6,
  ...CHUNK_7,
  ...CHUNK_8,
  ...CHUNK_9,
  ...CHUNK_10,
];

// Pre-enriched in-memory array containing all 328 prompts
export const ALL_PROMPTS: MotionPrompt[] = RAW_ALL_PROMPTS.map(enrichPrompt);
