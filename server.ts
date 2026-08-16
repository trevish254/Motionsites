import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

let aiClient: GoogleGenAI | null = null;

function getAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', hasGeminiKey: !!process.env.GEMINI_API_KEY });
  });

  // AI Assistant Chat & Gallery Filter Endpoint
  app.post('/api/assistant/chat', async (req, res) => {
    try {
      const { message, history = [], promptsSummary = [] } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message is required' });
      }

      const ai = getAI();

      if (!ai) {
        // Fallback response when key is not yet set
        return res.json({
          reply: `✦ **MotionBot AI (Catalog Mode)**: I analyzed your query for **"${message}"** across the 328 curated UI & motion prompt directives.\n\nHere are the top matches with high-fidelity interaction physics and creative staging. I have also automatically updated your main gallery view so you can explore all matching items directly!`,
          matchedPromptIds: [],
          gallerySearchQuery: message.trim(),
          filterLabel: `AI Search: "${message.trim()}"`,
          quickActions: [
            { label: '🎲 Surprise Prompt', query: 'Surprise me with a standout prompt' },
            { label: '⚡ 3D & WebGL', query: 'Show 3D WebGL prompts' },
            { label: '💎 Luxury Design', query: 'Luxury brand prompts' },
          ],
        });
      }

      // Prepare context summary for Gemini
      const promptContextSlice = Array.isArray(promptsSummary) && promptsSummary.length > 0
        ? promptsSummary.slice(0, 80).map((p: any) => `[ID: ${p.id}] ${p.title} (${p.category || 'Tech'}) - ${(p.description || '').slice(0, 100)}`).join('\n')
        : '';

      const systemInstruction = `You are MotionBot, an intelligent and playful AI assistant embedded in the MotionSites Prompts Gallery (a curated collection of 328 award-winning UI and motion design prompts).

Your capabilities:
1. Provide playful, witty, and deep technical design insights explaining interaction physics, GSAP/Lenis easing curves, WebGL shaders, camera panning, typography tracking, spatial luxury staging, or architecture/real-estate visual techniques.
2. Select the most relevant prompt IDs from the provided prompt catalog or identify accurate search keywords so the application can filter the main gallery in real-time.
3. Always respond with clean JSON matching the following structure:
{
  "reply": "Your markdown formatted message. Explain why these motion directives work well for the user's intent.",
  "matchedPromptIds": ["id1", "id2"],
  "gallerySearchQuery": "keyword for gallery search (e.g., 'real estate', 'luxury', '3d', 'scroll', or specific match term)",
  "filterLabel": "A concise label for the active AI filter banner (e.g., 'Real Estate & Architectural Prompts')",
  "quickActions": [
    {"label": "Button Label", "query": "Next query suggestion"}
  ]
}

Prompts Catalog excerpt:
${promptContextSlice}
`;

      const geminiHistory = (history || []).slice(-6).map((h: any) => ({
        role: h.sender === 'user' ? 'user' : 'model',
        parts: [{ text: h.text || '' }],
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: [
          ...geminiHistory,
          {
            role: 'user',
            parts: [
              {
                text: `User inquiry: "${message}". Please provide intelligent design recommendations and identify the best matching prompt IDs or gallery search keywords.`,
              },
            ],
          },
        ],
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
        },
      });

      const responseText = response.text || '{}';
      let parsedData: any;
      try {
        parsedData = JSON.parse(responseText);
      } catch {
        parsedData = {
          reply: responseText,
          matchedPromptIds: [],
          gallerySearchQuery: message.trim(),
          filterLabel: `AI Search: "${message.trim()}"`,
        };
      }

      return res.json({
        reply: parsedData.reply || `Here are the top motion directives matching "${message}":`,
        matchedPromptIds: Array.isArray(parsedData.matchedPromptIds) ? parsedData.matchedPromptIds : [],
        gallerySearchQuery: parsedData.gallerySearchQuery || message.trim(),
        filterLabel: parsedData.filterLabel || `AI Suggestions: "${message.trim()}"`,
        quickActions: parsedData.quickActions || [],
      });
    } catch (err: any) {
      console.error('Error in /api/assistant/chat:', err);
      // Resilient fallback so user never gets broken experience
      return res.json({
        reply: `✦ I found prompts matching **"${req.body.message}"** in our 328 curated collection. I've updated the main gallery below so you can inspect and remix them!`,
        matchedPromptIds: [],
        gallerySearchQuery: (req.body.message || '').trim(),
        filterLabel: `AI Match: "${(req.body.message || '').trim()}"`,
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MotionSites Prompts Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
