import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Sparkles,
  X,
  Send,
  Bot,
  Copy,
  Check,
  Code2,
  ExternalLink,
  Minimize2,
  Maximize2,
  Move,
  Search,
  LayoutGrid,
  Zap
} from 'lucide-react';
import { MotionPrompt } from '../types';
import { askAIAssistant, AssistantMessage } from '../services/aiAssistantService';
import confetti from 'canvas-confetti';
import { Language } from '../utils/translations';

interface PlayfulAIAssistantProps {
  prompts: MotionPrompt[];
  onSelectPrompt: (prompt: MotionPrompt) => void;
  onSwitchTab: (tab: 'gallery' | 'cms' | 'analysis' | 'remixer' | 'favorites') => void;
  onOpenRemixWithPrompt?: (prompt: MotionPrompt) => void;
  onApplyAIGalleryFilter?: (filter: { label: string; promptIds: string[]; queryText: string }) => void;
  onToast: (msg: string) => void;
  lang?: Language;
}

export const PlayfulAIAssistant: React.FC<PlayfulAIAssistantProps> = ({
  prompts,
  onSelectPrompt,
  onSwitchTab,
  onOpenRemixWithPrompt,
  onApplyAIGalleryFilter,
  onToast,
  lang = 'en',
}) => {
  // Character Draggable Position
  const [pos, setPos] = useState<{ x: number; y: number }>(() => {
    if (typeof window !== 'undefined') {
      const initX = Math.max(16, window.innerWidth - 88);
      const initY = Math.max(16, window.innerHeight - 88);
      return { x: initX, y: initY };
    }
    return { x: 300, y: 500 };
  });

  const [isDragging, setIsDragging] = useState(false);
  const dragInfoRef = useRef<{
    startX: number;
    startY: number;
    initialPosX: number;
    initialPosY: number;
    hasMovedPastThreshold: boolean;
    startTime: number;
  }>({
    startX: 0,
    startY: 0,
    initialPosX: 0,
    initialPosY: 0,
    hasMovedPastThreshold: false,
    startTime: 0,
  });

  // Eye Tracking State
  const [pupilOffset, setPupilOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showSpeechBubble, setShowSpeechBubble] = useState(true);
  const [bubbleText] = useState('Hey! Drag me or click to chat ✦');

  // Chat Window State
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: "👋 **Hello! I'm MotionBot AI** — connected to Gemini AI intelligence!\n\nI can analyze our **328 curated UI & motion prompt directives** (Real Estate, 3D WebGL, Luxury Brands, SaaS Dashboards, Fluid Physics, etc.).\n\nWhen you ask for a topic, I'll provide design insights and **automatically display all matching prompts right in the Main Gallery**!",
      timestamp: Date.now(),
      quickActions: [
        { label: '🏛️ Real Estate Prompts', query: 'Find me prompts related to real estate & luxury architectural showcases' },
        { label: '⚡ 3D & WebGL', query: 'Show 3D WebGL hero prompts' },
        { label: '💎 Luxury Brand Design', query: 'Best motion prompts for luxury and fashion brands' },
        { label: '🎲 Surprise Prompt', query: 'Surprise me with a standout prompt' },
      ],
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);

  const charRef = useRef<HTMLDivElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Initialize and keep clamped on window resize
  useEffect(() => {
    const handleResize = () => {
      setPos((prev) => {
        const maxX = Math.max(16, window.innerWidth - 88);
        const maxY = Math.max(16, window.innerHeight - 88);
        return {
          x: Math.min(maxX, Math.max(16, prev.x)),
          y: Math.min(maxY, Math.max(16, prev.y)),
        };
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Eye tracking: calculate angle & offset toward mouse cursor anywhere on screen
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!charRef.current) return;
      const rect = charRef.current.getBoundingClientRect();
      const charCenterX = rect.left + rect.width / 2;
      const charCenterY = rect.top + rect.height / 2;

      const dx = e.clientX - charCenterX;
      const dy = e.clientY - charCenterY;
      const dist = Math.hypot(dx, dy);

      // Max pupil movement radius
      const maxOffset = 5;
      const clampedDist = Math.min(maxOffset, dist / 40);
      const angle = Math.atan2(dy, dx);

      setPupilOffset({
        x: Math.cos(angle) * clampedDist,
        y: Math.sin(angle) * clampedDist,
      });

      // Curious reaction when cursor passes very close (< 90px)
      if (dist < 90 && !isHovered) {
        setIsHovered(true);
      } else if (dist >= 90 && isHovered && !isDragging) {
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isHovered, isDragging]);

  // Periodic natural random blinking
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      triggerBlink();
    }, 3800 + Math.random() * 2500);

    return () => clearInterval(blinkInterval);
  }, []);

  const triggerBlink = useCallback(() => {
    setIsBlinking(true);
    setTimeout(() => {
      setIsBlinking(false);
    }, 160);
  }, []);

  // Pointer down: initiate potential drag or click
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    if ((e.target as HTMLElement).closest('button')) {
      return;
    }

    dragInfoRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialPosX: pos.x,
      initialPosY: pos.y,
      hasMovedPastThreshold: false,
      startTime: Date.now(),
    };

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - dragInfoRef.current.startX;
      const deltaY = moveEvent.clientY - dragInfoRef.current.startY;
      const distance = Math.hypot(deltaX, deltaY);

      // Threshold: 5 pixels to distinguish click from drag
      if (distance > 5) {
        dragInfoRef.current.hasMovedPastThreshold = true;
        setIsDragging(true);

        const nextX = Math.min(
          window.innerWidth - 80,
          Math.max(16, dragInfoRef.current.initialPosX + deltaX)
        );
        const nextY = Math.min(
          window.innerHeight - 80,
          Math.max(16, dragInfoRef.current.initialPosY + deltaY)
        );

        setPos({ x: nextX, y: nextY });
      }
    };

    const handlePointerUp = () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);

      const isDrag = dragInfoRef.current.hasMovedPastThreshold;
      const elapsed = Date.now() - dragInfoRef.current.startTime;

      setIsDragging(false);

      if (!isDrag && elapsed < 500) {
        triggerBlink();
        setIsOpen((prev) => !prev);
        setIsMinimized(false);
        setShowSpeechBubble(false);
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: false });
    window.addEventListener('pointerup', handlePointerUp, { passive: false });
  };

  // Send message to Gemini AI
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isThinking) return;

    const userMsg: AssistantMessage = {
      id: String(Date.now()),
      sender: 'user',
      text,
      timestamp: Date.now(),
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    if (!textToSend) setInputText('');
    setIsThinking(true);
    triggerBlink();

    try {
      const res = await askAIAssistant(text, nextMessages, prompts);

      const botMsg: AssistantMessage = {
        id: String(Date.now() + 1),
        sender: 'bot',
        text: res.text,
        timestamp: Date.now(),
        suggestedPrompts: res.suggestedPrompts,
        matchedPromptIds: res.matchedPromptIds,
        gallerySearchQuery: res.gallerySearchQuery,
        filterLabel: res.filterLabel,
        quickActions: res.quickActions,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsThinking(false);
      triggerBlink();

      // Automatically apply suggestions directly to the Main Gallery
      if (onApplyAIGalleryFilter && res.matchedPromptIds.length > 0) {
        onApplyAIGalleryFilter({
          label: res.filterLabel || `AI Results: "${text}"`,
          promptIds: res.matchedPromptIds,
          queryText: res.gallerySearchQuery || text,
        });
        onToast(`✦ Displaying ${res.matchedPromptIds.length} matching prompts in Main Gallery`);
      }
    } catch (e) {
      console.error(e);
      setIsThinking(false);
    }
  };

  // Scroll chat to bottom on new messages
  useEffect(() => {
    if (isOpen && !isMinimized) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized, isThinking]);

  // Copy directive helper
  const handleCopyPrompt = (p: MotionPrompt, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(p.prompt_text);
    setCopiedPromptId(p.id);
    onToast(`Copied directive: "${p.title}"`);
    try {
      confetti({
        particleCount: 25,
        spread: 45,
        origin: { y: 0.8 },
      });
    } catch {
      // ignore
    }
    setTimeout(() => setCopiedPromptId(null), 2000);
  };

  // Smart chat positioning: stays on screen relative to character pos
  const getChatPositionStyle = () => {
    const chatWidth = 390;
    const chatHeight = 540;

    let left = pos.x - chatWidth + 70;
    let top = pos.y - chatHeight - 12;

    if (left < 16) {
      left = pos.x - 10;
    }
    if (left + chatWidth > window.innerWidth - 16) {
      left = window.innerWidth - chatWidth - 16;
    }

    if (top < 16) {
      top = pos.y + 80;
    }
    if (top + chatHeight > window.innerHeight - 16) {
      top = window.innerHeight - chatHeight - 16;
    }

    return {
      left: Math.max(16, left),
      top: Math.max(16, top),
    };
  };

  return (
    <>
      {/* 1. PLAYFUL DRAGGABLE CHARACTER ICON */}
      <div
        ref={charRef}
        id="playful-ai-assistant-character"
        onPointerDown={handlePointerDown}
        onMouseEnter={() => {
          setIsHovered(true);
          triggerBlink();
        }}
        onMouseLeave={() => {
          if (!isDragging) setIsHovered(false);
        }}
        style={{
          transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
          touchAction: 'none',
        }}
        className={`fixed top-0 left-0 z-50 select-none cursor-pointer ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        {/* Playful Floating Speech Bubble */}
        {showSpeechBubble && !isOpen && (
          <div className="absolute -top-10 right-0 whitespace-nowrap bg-[#1A1A1A] text-white text-[11px] font-mono font-bold px-2.5 py-1 border border-[#FF3E00] shadow-[2px_2px_0px_#FF3E00] flex items-center gap-1.5 animate-bounce pointer-events-none">
            <Sparkles className="w-3 h-3 text-[#FF3E00]" />
            <span>{bubbleText}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowSpeechBubble(false);
              }}
              className="ml-1 text-white/50 hover:text-white pointer-events-auto cursor-pointer"
            >
              ×
            </button>
          </div>
        )}

        {/* Character Avatar Canvas */}
        <div
          className={`relative w-16 h-16 rounded-2xl border-2 border-[#1A1A1A] bg-[#FAF9F6] shadow-[4px_4px_0px_#1A1A1A] flex flex-col items-center justify-center overflow-visible transition-colors ${
            isOpen ? 'bg-[#1A1A1A] text-white border-[#FF3E00]' : 'hover:bg-white'
          }`}
        >
          {/* Glowing Antenna */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <div
              className={`w-2.5 h-2.5 rounded-full border border-[#1A1A1A] transition-colors ${
                isThinking
                  ? 'bg-amber-400 animate-ping'
                  : isOpen || isHovered
                  ? 'bg-[#FF3E00]'
                  : 'bg-[#1A1A1A]'
              }`}
            />
            <div className="w-0.5 h-2 bg-[#1A1A1A]" />
          </div>

          {/* Ears / Side Pads */}
          <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-4 bg-[#FF3E00] rounded-l-sm border-l border-t border-b border-[#1A1A1A]" />
          <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-1.5 h-4 bg-[#FF3E00] rounded-r-sm border-r border-t border-b border-[#1A1A1A]" />

          {/* Character Screen / Face Plate */}
          <div
            className={`w-12 h-10 rounded-xl border border-[#1A1A1A] flex flex-col items-center justify-center p-1 relative transition-colors ${
              isOpen ? 'bg-[#111111]' : 'bg-[#1A1A1A]'
            }`}
          >
            {/* Eyes Container */}
            <div className="flex items-center justify-center gap-2.5 w-full">
              {/* Left Eye */}
              <div
                className="w-3.5 h-3.5 rounded-full bg-white relative overflow-hidden flex items-center justify-center transition-transform"
                style={{
                  transform: isBlinking ? 'scaleY(0.12)' : 'scaleY(1)',
                  transition: 'transform 0.12s ease-in-out',
                }}
              >
                <div
                  className="w-2 h-2 rounded-full bg-[#FF3E00] flex items-center justify-center absolute transition-transform"
                  style={{
                    transform: `translate(${pupilOffset.x}px, ${pupilOffset.y}px)`,
                  }}
                >
                  <div className="w-0.5 h-0.5 rounded-full bg-white absolute -top-0.5 -left-0.5" />
                </div>
              </div>

              {/* Right Eye */}
              <div
                className="w-3.5 h-3.5 rounded-full bg-white relative overflow-hidden flex items-center justify-center transition-transform"
                style={{
                  transform: isBlinking ? 'scaleY(0.12)' : 'scaleY(1)',
                  transition: 'transform 0.12s ease-in-out',
                }}
              >
                <div
                  className="w-2 h-2 rounded-full bg-[#FF3E00] flex items-center justify-center absolute transition-transform"
                  style={{
                    transform: `translate(${pupilOffset.x}px, ${pupilOffset.y}px)`,
                  }}
                >
                  <div className="w-0.5 h-0.5 rounded-full bg-white absolute -top-0.5 -left-0.5" />
                </div>
              </div>
            </div>

            {/* Animated Mouth & Cheeks */}
            <div className="flex items-center justify-between w-full px-1 mt-1">
              <div
                className={`w-1.5 h-0.5 rounded-full transition-opacity ${
                  isHovered || isOpen ? 'bg-[#FF3E00] opacity-100' : 'opacity-0'
                }`}
              />

              <div
                className={`transition-all ${
                  isThinking
                    ? 'w-2 h-2 rounded-full border border-amber-400 animate-spin'
                    : isHovered || isOpen
                    ? 'w-2.5 h-1 border-b-2 border-white rounded-b-full'
                    : 'w-1.5 h-0.5 bg-white/70 rounded-full'
                }`}
              />

              <div
                className={`w-1.5 h-0.5 rounded-full transition-opacity ${
                  isHovered || isOpen ? 'bg-[#FF3E00] opacity-100' : 'opacity-0'
                }`}
              />
            </div>
          </div>

          {/* Drag Handle Indicator */}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 px-1 py-0.2 bg-[#FAF9F6] border border-[#1A1A1A] rounded-xs text-[7px] font-mono font-bold uppercase tracking-widest text-[#1A1A1A] flex items-center gap-0.5">
            <Move className="w-2 h-2 text-[#FF3E00]" />
          </div>
        </div>
      </div>

      {/* 2. CHAT POPUP WINDOW */}
      {isOpen && (
        <div
          id="playful-ai-assistant-window"
          style={getChatPositionStyle()}
          className="fixed z-50 w-[370px] sm:w-[420px] max-w-[calc(100vw-32px)] bg-[#FAF9F6] border-2 border-[#1A1A1A] shadow-[8px_8px_0px_#1A1A1A] flex flex-col animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#1A1A1A] text-white border-b-2 border-[#1A1A1A]">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#FF3E00] flex items-center justify-center text-white">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="font-serif italic font-bold text-sm text-white flex items-center gap-1.5">
                  <span>MotionBot AI</span>
                  <span className="text-[9px] font-mono px-1 py-0.2 bg-[#FF3E00] text-white font-bold uppercase flex items-center gap-0.5">
                    <Sparkles className="w-2 h-2" /> Gemini AI
                  </span>
                </div>
                <div className="text-[10px] text-white/60 font-mono">
                  328 Motion Prompts Directives Knowledge Base
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                title={isMinimized ? 'Expand Chat' : 'Minimize Chat'}
              >
                {isMinimized ? (
                  <Maximize2 className="w-3.5 h-3.5" />
                ) : (
                  <Minimize2 className="w-3.5 h-3.5" />
                )}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                title="Close Assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages Body */}
              <div className="p-4 overflow-y-auto max-h-[380px] min-h-[260px] space-y-3.5 text-xs">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.sender === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-[92%] p-3 rounded-none border ${
                        msg.sender === 'user'
                          ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                          : 'bg-white text-[#1A1A1A] border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]'
                      }`}
                    >
                      <div className="whitespace-pre-line leading-relaxed font-sans">
                        {msg.text}
                      </div>

                      {/* Main Gallery Sync Banner within message */}
                      {msg.matchedPromptIds && msg.matchedPromptIds.length > 0 && onApplyAIGalleryFilter && (
                        <div className="mt-3 p-2 border-2 border-[#1A1A1A] bg-[#FAF9F6] flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-[#1A1A1A]">
                            <LayoutGrid className="w-3.5 h-3.5 text-[#FF3E00]" />
                            <span>{msg.matchedPromptIds.length} Prompts in Main Gallery</span>
                          </div>
                          <button
                            onClick={() => {
                              onApplyAIGalleryFilter({
                                label: msg.filterLabel || 'AI Filter',
                                promptIds: msg.matchedPromptIds || [],
                                queryText: msg.gallerySearchQuery || '',
                              });
                              onSwitchTab('gallery');
                              onToast(`Active: ${msg.matchedPromptIds?.length} prompts in Main Gallery`);
                            }}
                            className="px-2 py-1 bg-[#1A1A1A] hover:bg-[#FF3E00] text-white text-[9px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <span>Go to Gallery</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      )}

                      {/* Attached Suggested Prompts Cards */}
                      {msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-[#1A1A1A]/15 space-y-2">
                          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#FF3E00] flex items-center justify-between">
                            <span>TOP SUGGESTIONS</span>
                            <span className="text-[#1A1A1A]/50">({msg.suggestedPrompts.length})</span>
                          </div>
                          {msg.suggestedPrompts.slice(0, 3).map((p) => (
                            <div
                              key={p.id}
                              className="p-2 border border-[#1A1A1A] bg-[#FAF9F6] hover:border-[#FF3E00] transition-colors"
                            >
                              <div className="flex items-start justify-between gap-1 mb-1">
                                <div className="font-serif italic font-bold text-xs text-[#1A1A1A] line-clamp-1">
                                  {p.title}
                                </div>
                                <span className="text-[8px] font-mono px-1 py-0.2 border border-[#1A1A1A]/20 bg-white text-[#1A1A1A]/70 uppercase">
                                  {p.category || 'Tech'}
                                </span>
                              </div>
                              <p className="text-[10px] text-[#1A1A1A]/70 line-clamp-2 mb-2 font-mono">
                                {p.description || p.prompt_text.slice(0, 80)}
                              </p>
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => {
                                    onSelectPrompt(p);
                                    onToast(`Opened: ${p.title}`);
                                  }}
                                  className="flex-1 py-1 px-2 border border-[#1A1A1A] bg-[#1A1A1A] hover:bg-[#FF3E00] hover:border-[#FF3E00] text-white text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-colors cursor-pointer"
                                >
                                  <ExternalLink className="w-2.5 h-2.5" />
                                  <span>View</span>
                                </button>
                                <button
                                  onClick={(e) => handleCopyPrompt(p, e)}
                                  className="py-1 px-2 border border-[#1A1A1A] bg-white hover:bg-[#FAF9F6] text-[#1A1A1A] text-[10px] font-bold uppercase flex items-center justify-center gap-1 transition-colors cursor-pointer"
                                  title="Copy Prompt Directive"
                                >
                                  {copiedPromptId === p.id ? (
                                    <Check className="w-2.5 h-2.5 text-emerald-600" />
                                  ) : (
                                    <Copy className="w-2.5 h-2.5 text-[#FF3E00]" />
                                  )}
                                </button>
                                {onOpenRemixWithPrompt && (
                                  <button
                                    onClick={() => onOpenRemixWithPrompt(p)}
                                    className="py-1 px-2 border border-[#1A1A1A] bg-white hover:bg-[#FAF9F6] text-[#1A1A1A] text-[10px] font-bold uppercase flex items-center justify-center gap-1 transition-colors cursor-pointer"
                                    title="Remix Prompt"
                                  >
                                    <Code2 className="w-2.5 h-2.5 text-[#FF3E00]" />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Quick Action Buttons */}
                      {msg.quickActions && msg.quickActions.length > 0 && (
                        <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                          {msg.quickActions.map((qa, i) => (
                            <button
                              key={i}
                              onClick={() => {
                                if (qa.query) {
                                  handleSendMessage(qa.query);
                                } else if (qa.action) {
                                  qa.action();
                                }
                              }}
                              className="text-[10px] font-mono font-bold uppercase px-2 py-1 border border-[#1A1A1A] bg-white hover:bg-[#1A1A1A] hover:text-white transition-colors cursor-pointer"
                            >
                              {qa.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isThinking && (
                  <div className="flex items-center gap-2 text-[#1A1A1A]/80 text-xs font-mono p-3 bg-white border border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]">
                    <Sparkles className="w-4 h-4 text-[#FF3E00] animate-spin" />
                    <span>Gemini AI is analyzing prompt directives & syncing gallery...</span>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Quick Query Starters */}
              <div className="px-3 py-1.5 bg-white border-t border-b border-[#1A1A1A]/10 flex items-center gap-1.5 overflow-x-auto">
                <button
                  onClick={() => handleSendMessage('Find me prompts related to real estate & luxury architectural showcases')}
                  className="whitespace-nowrap px-2.5 py-1 text-[10px] font-mono font-bold border border-[#1A1A1A]/20 bg-[#FAF9F6] hover:border-[#FF3E00] hover:text-[#FF3E00] transition-colors cursor-pointer"
                >
                  🏛️ Real Estate
                </button>
                <button
                  onClick={() => handleSendMessage('Show top 3D & WebGL interaction prompts')}
                  className="whitespace-nowrap px-2.5 py-1 text-[10px] font-mono font-bold border border-[#1A1A1A]/20 bg-[#FAF9F6] hover:border-[#FF3E00] hover:text-[#FF3E00] transition-colors cursor-pointer"
                >
                  ⚡ 3D / WebGL
                </button>
                <button
                  onClick={() => handleSendMessage('Best motion prompts for Luxury and Fashion brands')}
                  className="whitespace-nowrap px-2.5 py-1 text-[10px] font-mono font-bold border border-[#1A1A1A]/20 bg-[#FAF9F6] hover:border-[#FF3E00] hover:text-[#FF3E00] transition-colors cursor-pointer"
                >
                  💎 Luxury
                </button>
                <button
                  onClick={() => handleSendMessage('Surprise me with a standout prompt')}
                  className="whitespace-nowrap px-2.5 py-1 text-[10px] font-mono font-bold border border-[#1A1A1A]/20 bg-[#FAF9F6] hover:border-[#FF3E00] hover:text-[#FF3E00] transition-colors cursor-pointer"
                >
                  🎲 Surprise
                </button>
              </div>

              {/* Input Area */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="p-3 bg-white flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="e.g. Find real estate prompts, 3D heroes..."
                  className="flex-1 px-3 py-2 border border-[#1A1A1A] text-xs font-mono bg-[#FAF9F6] focus:outline-none focus:border-[#FF3E00]"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || isThinking}
                  className="p-2 border-2 border-[#1A1A1A] bg-[#1A1A1A] hover:bg-[#FF3E00] hover:border-[#FF3E00] disabled:opacity-40 text-white transition-colors cursor-pointer"
                  title="Send message to AI"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
};
