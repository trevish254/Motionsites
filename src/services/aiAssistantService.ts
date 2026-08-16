import { MotionPrompt } from '../types';

export interface AssistantMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: number;
  suggestedPrompts?: MotionPrompt[];
  matchedPromptIds?: string[];
  gallerySearchQuery?: string;
  filterLabel?: string;
  quickActions?: { label: string; query?: string; action?: () => void }[];
}

export interface AssistantResponse {
  text: string;
  matchedPromptIds: string[];
  gallerySearchQuery: string;
  filterLabel: string;
  suggestedPrompts: MotionPrompt[];
  quickActions?: { label: string; query?: string; action?: () => void }[];
}

/**
 * Searches local prompt catalog by keywords, categories, and tags
 */
export function findPromptsLocally(query: string, allPrompts: MotionPrompt[]): MotionPrompt[] {
  const q = query.toLowerCase().trim();
  const words = q.split(/\s+/).filter((w) => w.length > 2);

  // Real estate & architectural synonyms
  const isRealEstate = /real\s*estate|property|architect|house|interior|residence|villa|apartment|showroom|building|living/i.test(q);
  if (isRealEstate) {
    const estateMatches = allPrompts.filter((p) => {
      const text = `${p.title} ${p.category} ${p.description} ${p.prompt_text} ${(p.extractedTags || []).join(' ')}`.toLowerCase();
      return /architect|estate|residence|luxury|interior|gallery|spatial|minimal|room|showroom|3d|living/i.test(text);
    });
    if (estateMatches.length > 0) {
      return estateMatches;
    }
  }

  // 3D / WebGL
  const is3D = /3d|webgl|three|shader|canvas|spatial|spline/i.test(q);
  if (is3D) {
    return allPrompts.filter((p) => {
      const text = `${p.title} ${p.category} ${p.description} ${p.prompt_text}`.toLowerCase();
      return /3d|webgl|three|shader|spatial|canvas|orbital/i.test(text);
    });
  }

  // Scroll / Parallax
  const isScroll = /scroll|parallax|lenis|locomotive|scrub|smooth/i.test(q);
  if (isScroll) {
    return allPrompts.filter((p) => {
      const text = `${p.title} ${p.category} ${p.description} ${p.prompt_text}`.toLowerCase();
      return /scroll|parallax|lenis|scrub|inertia/i.test(text);
    });
  }

  // Luxury / Fashion
  const isLuxury = /luxury|fashion|editorial|couture|watch|jewelry/i.test(q);
  if (isLuxury) {
    return allPrompts.filter((p) => {
      const text = `${p.title} ${p.category} ${p.description} ${p.prompt_text}`.toLowerCase();
      return /luxury|fashion|editorial|couture|minimal/i.test(text);
    });
  }

  // General multi-word matching
  const matched = allPrompts.filter((p) => {
    const hay = `${p.title} ${p.category} ${p.type} ${p.description} ${p.prompt_text} ${(p.extractedTags || []).join(' ')}`.toLowerCase();
    return words.some((w) => hay.includes(w));
  });

  return matched.length > 0 ? matched : allPrompts.slice(0, 8);
}

/**
 * Asynchronously generates intelligent AI response using server Gemini API,
 * with real-time prompt search and gallery sync.
 */
export async function askAIAssistant(
  userQuery: string,
  history: AssistantMessage[],
  allPrompts: MotionPrompt[]
): Promise<AssistantResponse> {
  const query = userQuery.trim();

  try {
    const summarySlice = allPrompts.map((p) => ({
      id: p.id,
      title: p.title,
      category: p.category,
      description: p.description || p.prompt_text.slice(0, 100),
    }));

    const response = await fetch('/api/assistant/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: query,
        history: history.slice(-6).map((h) => ({
          sender: h.sender,
          text: h.text,
        })),
        promptsSummary: summarySlice,
      }),
    });

    if (response.ok) {
      const data = await response.json();

      let matchedList: MotionPrompt[] = [];

      // If backend identified specific IDs
      if (Array.isArray(data.matchedPromptIds) && data.matchedPromptIds.length > 0) {
        matchedList = allPrompts.filter((p) => data.matchedPromptIds.includes(p.id));
      }

      // If fewer than 2 matched, augment with smart semantic search
      if (matchedList.length < 2) {
        const fallbackList = findPromptsLocally(data.gallerySearchQuery || query, allPrompts);
        const existingIds = new Set(matchedList.map((p) => p.id));
        fallbackList.forEach((p) => {
          if (!existingIds.has(p.id)) {
            matchedList.push(p);
            existingIds.add(p.id);
          }
        });
      }

      return {
        text: data.reply || `Here are top curated motion directives matching **"${query}"**:`,
        matchedPromptIds: matchedList.map((p) => p.id),
        gallerySearchQuery: data.gallerySearchQuery || query,
        filterLabel: data.filterLabel || `AI Filter: "${query}"`,
        suggestedPrompts: matchedList.slice(0, 8),
        quickActions: data.quickActions || [
          { label: '🎲 Surprise Prompt', query: 'Surprise me with a standout prompt' },
          { label: '⚡ 3D / WebGL', query: 'Show 3D WebGL prompts' },
          { label: '💎 Luxury Design', query: 'Luxury brand prompts' },
        ],
      };
    }
  } catch (err) {
    console.warn('Backend AI assistant request error, using smart local engine:', err);
  }

  // Fallback to local smart semantic engine
  const matched = findPromptsLocally(query, allPrompts);
  const qLower = query.toLowerCase();

  let replyText = `✦ **MotionBot AI**: I found **${matched.length} curated motion prompt${matched.length > 1 ? 's' : ''}** tailored for **"${query}"**.\n\nI have automatically updated the **Main Gallery** page so you can browse, copy, and remix all of them directly!`;

  if (qLower.includes('real estate') || qLower.includes('property') || qLower.includes('architect')) {
    replyText = `🏛️ **Real Estate & Architectural Interaction Directives**\n\nHigh-end architectural showcases emphasize:
- **Cinematic Camera Sweeps**: Smooth 3D spatial orbit and easing curves (0.25, 1, 0.5, 1).
- **Interactive Floorplan Layers**: Micro-interaction pins with floating blur cards.
- **Ambient Lighting & Materiality**: Subtle cursor-driven specular highlights and depth-of-field transitions.

I've populated **${matched.length} matching architectural & luxury showcase prompts** directly into your **Main Gallery** below!`;
  } else if (qLower.includes('3d') || qLower.includes('webgl')) {
    replyText = `🔮 **3D & WebGL Spatial Directives**\n\nThese directives leverage WebGL canvas, Three.js shaders, orbital camera easing, and particle physics. All **${matched.length} 3D prompts** are now active in the Main Gallery!`;
  } else if (qLower.includes('luxury') || qLower.includes('fashion')) {
    replyText = `💎 **Luxury Brand & High-Fashion Aesthetics**\n\nCharacterized by subtle micro-interaction restraint, editorial serif typography tracking, and graceful opacity fades. All **${matched.length} luxury prompts** are now displayed in the Main Gallery!`;
  }

  return {
    text: replyText,
    matchedPromptIds: matched.map((p) => p.id),
    gallerySearchQuery: query,
    filterLabel: `AI Search: "${query}"`,
    suggestedPrompts: matched.slice(0, 8),
    quickActions: [
      { label: '🎲 Surprise Prompt', query: 'Surprise me with a standout prompt' },
      { label: '⚡ 3D & WebGL', query: 'Show 3D WebGL prompts' },
      { label: '💎 Luxury Design', query: 'Luxury brand prompts' },
    ],
  };
}
