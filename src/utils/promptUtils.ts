import { MotionPrompt } from '../types';

// Extract fonts mentioned in prompt text
export function extractFonts(promptText: string): string[] {
  const fonts = new Set<string>();
  const commonFonts = [
    'Inter',
    'Playfair Display',
    'Space Grotesk',
    'Instrument Sans',
    'YoungSerif',
    'Geist',
    'GeistMono',
    'JetBrains Mono',
    'Plus Jakarta Sans',
    'Cinzel',
    'Syne',
    'Outfit',
    'Cabinet Grotesk',
    'Clash Display',
    'Satoshi',
    'General Sans',
    'Fraunces',
    'DM Sans',
    'Roboto'
  ];

  commonFonts.forEach(font => {
    if (new RegExp(`\\b${font}\\b`, 'i').test(promptText)) {
      fonts.add(font);
    }
  });

  return Array.from(fonts);
}

// Extract images/asset URLs
export function extractAssets(promptText: string): string[] {
  const regex = /https?:\/\/[^\s\)"']+\.(?:png|jpg|jpeg|webp|svg|gif)[^\s\)"']*/gi;
  const matches = promptText.match(regex) || [];
  return Array.from(new Set(matches));
}

// Extract feature tags
export function extractTags(prompt: MotionPrompt): string[] {
  const tags = new Set<string>();
  const text = (prompt.title + ' ' + prompt.description + ' ' + prompt.prompt_text).toLowerCase();

  if (text.includes('spotlight') || text.includes('cursor')) tags.add('Cursor Spotlight');
  if (text.includes('canvas')) tags.add('HTML5 Canvas');
  if (text.includes('framer') || text.includes('motion')) tags.add('Motion Animation');
  if (text.includes('bento')) tags.add('Bento Grid');
  if (text.includes('parallax')) tags.add('Parallax');
  if (text.includes('3d') || text.includes('three.js') || text.includes('spline')) tags.add('3D / WebGL');
  if (text.includes('marquee')) tags.add('Marquee');
  if (text.includes('dark') || text.includes('bg-black') || text.includes('#0b0c10') || text.includes('#000')) tags.add('Dark Theme');
  if (text.includes('light') || text.includes('bg-white')) tags.add('Light Theme');
  if (text.includes('audio') || text.includes('sound') || text.includes('synth')) tags.add('Audio / Sound');
  if (text.includes('accordion') || text.includes('tabs')) tags.add('Interactive Tabs');
  if (text.includes('lucide')) tags.add('Lucide Icons');
  if (text.includes('glass') || text.includes('backdrop-blur')) tags.add('Glassmorphism');
  if (text.includes('gradient')) tags.add('Gradients');
  if (text.includes('hover') || text.includes('card')) tags.add('Interactive Hover');

  return Array.from(tags);
}

// Format prompt for Gemini / Google AI Studio / Claude
export function formatForAIStudio(prompt: MotionPrompt, customRole?: string): string {
  const prefix = customRole || 
    `You are an expert full-stack frontend engineer and award-winning motion designer. Build the following production-ready component with high visual craft, smooth animations, zero broken assets, and responsive layout:`;

  return `${prefix}\n\n--- COMPONENT REQUIREMENT: ${prompt.title} (${prompt.platform === 'app' ? 'Mobile App' : 'Web Page'}) ---\n\n${prompt.prompt_text}\n\n### Quality Checklist\n1. Ensure responsive viewport handling (100dvh, flex/grid constraints).\n2. Apply smooth cubic-bezier transitions for hover states.\n3. Make sure all icons are imported from 'lucide-react'.\n4. Use Tailwind CSS utility classes cleanly.`;
}

// Clean prompt (extract pure text or instructions)
export function getCleanPrompt(promptText: string): string {
  return promptText.trim();
}

// Remix / Customize a prompt
export function remixPrompt(
  originalPrompt: string,
  options: {
    brandName?: string;
    domainTopic?: string;
    colorTheme?: string;
    framework?: string;
  }
): string {
  let remixed = originalPrompt;

  if (options.brandName && options.brandName.trim()) {
    // Replace common brand placeholders
    remixed = remixed
      .replace(/Lithos/gi, options.brandName)
      .replace(/Aether/gi, options.brandName)
      .replace(/Nova/gi, options.brandName)
      .replace(/Lumina/gi, options.brandName);
  }

  if (options.colorTheme) {
    const colorMap: Record<string, string> = {
      violet: '#7c3aed',
      emerald: '#10b981',
      amber: '#f59e0b',
      rose: '#f43f5e',
      cyan: '#06b6d4',
      monochrome: '#ffffff',
    };
    if (colorMap[options.colorTheme]) {
      // Mention color requirement in instruction
      remixed = `/* Color Theme Accent: ${options.colorTheme.toUpperCase()} (${colorMap[options.colorTheme]}) */\n` + remixed;
    }
  }

  if (options.framework && options.framework !== 'React 18 + TypeScript + Vite + Tailwind CSS') {
    remixed = remixed.replace(
      /React 18 \+ TypeScript \+ Vite \+ Tailwind CSS/gi,
      options.framework
    );
  }

  return remixed;
}

// Export helpers
export function exportAsJSON(prompts: MotionPrompt[], filename = 'motionsites-prompts.json') {
  const jsonStr = JSON.stringify(prompts, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportAsMarkdown(prompts: MotionPrompt[], filename = 'motionsites-prompts.md') {
  let md = `# MotionSites Curated Prompts Export\n\nTotal Prompts: ${prompts.length}\nGenerated on: ${new Date().toLocaleDateString()}\n\n---\n\n`;

  prompts.forEach((p, idx) => {
    md += `## ${idx + 1}. ${p.title} (${p.platform.toUpperCase()} - ${p.is_free ? 'Free' : 'Premium'})\n\n`;
    md += `- **Category**: ${p.category || 'N/A'}\n`;
    md += `- **Type**: ${p.type || 'N/A'}\n`;
    md += `- **Description**: ${p.description || 'N/A'}\n\n`;
    md += `### Prompt\n\`\`\`\n${p.prompt_text}\n\`\`\`\n\n---\n\n`;
  });

  const blob = new Blob([md], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportAsCSV(prompts: MotionPrompt[], filename = 'motionsites-prompts.csv') {
  const headers = ['ID', 'Title', 'Category', 'Type', 'Platform', 'Tier', 'Description', 'Prompt Length'];
  const rows = prompts.map(p => [
    `"${p.id}"`,
    `"${(p.title || '').replace(/"/g, '""')}"`,
    `"${(p.category || '').replace(/"/g, '""')}"`,
    `"${(p.type || '').replace(/"/g, '""')}"`,
    `"${p.platform}"`,
    `"${p.is_free ? 'Free' : 'Premium'}"`,
    `"${(p.description || '').replace(/"/g, '""')}"`,
    p.prompt_text ? p.prompt_text.length : 0
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
