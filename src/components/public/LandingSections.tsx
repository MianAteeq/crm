import React, { useEffect, useState, useRef } from 'react';
import {
  MessageSquare,
  Users,
  BarChart3,
  Zap,
  Send,
  ArrowRight,
  Database,
  Calendar,
  FileText,
  MessageCircle,
  HelpCircle,
  Plus,
  Minus,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Inbox,
  Facebook,
  Instagram,
  Mail,
  Smartphone,
  Globe,
  Clock,
  Briefcase,
  Play,
  ArrowUpRight,
  Star,
  Settings,
  ChevronRight,
  ShieldCheck,
  UserCheck,
  Bot,
  PhoneCall,
  MousePointerClick,
  BellRing,
  ChevronDown,
  CheckCheck,
  Paperclip,
  Smile,
  Mic,
  MoreVertical,
  Activity,
  Flame,
  Radio,
  Video,
  Phone,
  Layers,
  Cpu,
  Compass,
  Shield,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { crmApi } from '../../services/crmApi';
import { useBrandingStore, DEFAULT_INTEGRATION_LOGOS, IntegrationLogoItem } from '../../store/brandingStore';

// ==========================================
// MOCK CLIENT SVG LOGOS
// ==========================================
const TcLogo = () => (
  <svg className="h-6 opacity-50 hover:opacity-100 hover:text-slate-900 transition-all duration-300 fill-current" viewBox="0 0 34 22" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 10h4v11h4V10h4V6H9V1H5v5H1v4zm15-4v15h16v-4h-11v-2h8v-3h-8v-2h11V6H16z" />
  </svg>
);

const StripeLogo = () => (
  <svg className="h-6 opacity-50 hover:opacity-100 hover:text-[#635BFF] transition-all duration-300 fill-current" viewBox="0 0 80 34" xmlns="http://www.w3.org/2000/svg">
    <path d="M41.4 12.3c0-3.3 2.5-4.4 6.7-4.4 3.7 0 7.3.9 10.3 2.5V3.1C55.4 1.7 51.5 1 47.9 1 34.6 1 27.6 8.1 27.6 19c0 9.8 6.7 14.1 16.5 14.1 4 0 7.8-.7 10.7-2.1v-7.3c-2.9 1.5-6.3 2.1-9.4 2.1-5.1 0-7-2-7-6.8h23.2v-1.7H41.4zm0-5c0-1.8 1.2-2.8 3.3-2.8 2.2 0 3.3 1 3.3 2.8H41.4zM24.8 9.5c0-.8-.7-1.4-1.5-1.4h-5.5V1h-9.3v7.1H3c-.8 0-1.4.6-1.4 1.4v6.8c0 .8.6 1.4 1.4 1.4h5.5v15.7h9.3V17.7h5.5c.8 0 1.4-.6 1.4-1.4V9.5z" />
  </svg>
);

const LinearLogo = () => (
  <svg className="h-6 opacity-50 hover:opacity-100 hover:text-slate-900 transition-all duration-300 fill-current" viewBox="0 0 100 24" xmlns="http://www.w3.org/2000/svg">
    <text x="0" y="18" className="font-sans font-black tracking-wider text-lg">LINEAR</text>
  </svg>
);

const HubSpotLogo = () => (
  <svg className="h-6 opacity-50 hover:opacity-100 hover:text-[#FF7A59] transition-all duration-300 fill-current" viewBox="0 0 100 28" xmlns="http://www.w3.org/2000/svg">
    <text x="0" y="20" className="font-sans font-black tracking-wider text-lg">HUBSPOT</text>
  </svg>
);

const VercelLogo = () => (
  <svg className="h-5 opacity-50 hover:opacity-100 hover:text-slate-900 transition-all duration-300 fill-current" viewBox="0 0 116 26" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.2 2L24.4 23H0L12.2 2z" />
    <text x="32" y="20" className="font-sans font-black tracking-wider text-base">VERCEL</text>
  </svg>
);

const NotionLogo = () => (
  <svg className="h-6 opacity-50 hover:opacity-100 hover:text-slate-900 transition-all duration-300 fill-current" viewBox="0 0 100 24" xmlns="http://www.w3.org/2000/svg">
    <text x="0" y="18" className="font-sans font-black tracking-wider text-lg">NOTION</text>
  </svg>
);

// ==========================================
// HERO SECTION & CHAT MOCKUP
// ==========================================
const AnimatedChatMockup = () => {
  const [messages, setMessages] = useState<any[]>([
    { id: 1, text: "Hi Sarah! 👋 Thanks for reaching out. Your consultation is confirmed for tomorrow at 3:00 PM. Would you like a calendar invite or SMS reminder?", isUser: false }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (textToSend?: string | React.FormEvent) => {
    if (textToSend && typeof textToSend !== 'string') {
      textToSend.preventDefault();
    }
    const rawText = typeof textToSend === 'string' ? textToSend : inputValue;
    if (!rawText.trim() || isTyping) return;

    const userMsg = rawText.trim();
    setInputValue("");

    setMessages(prev => [...prev, { id: Date.now(), text: userMsg, isUser: true }]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const lowerInput = userMsg.toLowerCase();
      let responseText = "Understood! I've updated your preferences. You'll receive automated updates directly through WhatsApp.";

      if (lowerInput.includes('pricing') || lowerInput.includes('cost')) {
        responseText = "Our plans start with full WhatsApp Cloud API access and unlimited contacts. Would you like a link to our plan details?";
      } else if (lowerInput.includes('calendar') || lowerInput.includes('yes') || lowerInput.includes('invite') || lowerInput.includes('tomorrow')) {
        responseText = "Awesome! The calendar invite has been sent to your email. See you tomorrow at 3:00 PM! 📅";
      } else if (lowerInput.includes('help') || lowerInput.includes('support') || lowerInput.includes('human')) {
        responseText = "I'm here to help! Our team is available 24/7 if you need human assistance as well.";
      } else if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
        responseText = "Hello there! 👋 How can I help you today?";
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, text: responseText, isUser: false }]);
    }, 1000);
  };

  const quickPrompts = ["Tomorrow at 3:00 PM", "View Pricing", "Need Human Support"];

  return (
    <div className="w-full max-w-[390px] bg-[#0c1622] border border-white/10 rounded-[2.25rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_50px_rgba(34,197,94,0.12)] ring-1 ring-white/10 overflow-hidden flex flex-col h-[520px] relative group transition-all duration-300">
      {/* WhatsApp Header Mockup */}
      <div className="bg-[#132232] px-4 py-3 flex items-center justify-between border-b border-white/10 relative z-10 shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#166534] to-[#22C55E] flex items-center justify-center p-0.5 shadow-md">
              <div className="w-full h-full bg-[#132232] rounded-full flex items-center justify-center">
                <Bot size={20} className="text-[#22C55E]" />
              </div>
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#22C55E] border-2 border-[#132232] rounded-full shadow-[0_0_8px_rgba(34,197,94,0.9)]" />
          </div>
          <div>
            <h4 className="text-white font-semibold text-[14px] leading-tight flex items-center gap-1.5">
              AI Copilot Agent <CheckCircle2 size={13} className="text-[#22C55E]" />
            </h4>
            <span className="text-[#22C55E] text-[10.5px] font-medium flex items-center gap-1">
              Online • Official Cloud API
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-stone-400">
          <Video size={17} className="hover:text-white transition-colors cursor-pointer" />
          <Phone size={16} className="hover:text-white transition-colors cursor-pointer" />
          <MoreVertical size={16} className="hover:text-white transition-colors cursor-pointer" />
        </div>
      </div>

      {/* Date Divider */}
      <div className="py-2.5 flex justify-center relative z-10 bg-[#0c1622]/80 backdrop-blur-sm">
        <span className="bg-[#182838] text-stone-300 text-[10px] font-semibold px-3 py-0.5 rounded-full border border-white/5 uppercase tracking-wider">
          Today
        </span>
      </div>

      {/* Messages Area */}
      <div ref={scrollContainerRef} className="flex-1 p-4 pt-1 flex flex-col gap-3 overflow-y-auto z-10 custom-scrollbar">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "max-w-[85%] rounded-[1.15rem] p-3 text-[13px] leading-[1.5] relative shadow-md",
                msg.isUser
                  ? "bg-gradient-to-r from-[#166534] to-[#1e7e43] text-white self-end rounded-tr-xs border border-emerald-500/30"
                  : "bg-[#182838] text-stone-100 self-start rounded-tl-xs border border-white/10"
              )}
            >
              {!msg.isUser && (
                <div className="flex items-center gap-1 text-[10px] text-[#22C55E] font-semibold mb-1">
                  <Sparkles size={11} /> Auto Copilot
                </div>
              )}
              <div className="whitespace-pre-wrap">{msg.text}</div>
              <div className="text-[10px] text-white/60 text-right mt-1.5 flex justify-end items-center gap-1">
                <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                {msg.isUser ? (
                  <CheckCheck size={14} className="text-[#53bdeb]" />
                ) : (
                  <CheckCheck size={14} className="text-white/40" />
                )}
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
              className="bg-[#182838] text-white self-start rounded-[1.15rem] rounded-tl-xs p-3 border border-white/10 flex items-center gap-1.5 w-16 shadow-md"
            >
              <motion.div className="w-1.5 h-1.5 bg-[#22C55E] rounded-full" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} />
              <motion.div className="w-1.5 h-1.5 bg-[#22C55E] rounded-full" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} />
              <motion.div className="w-1.5 h-1.5 bg-[#22C55E] rounded-full" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quick Action Suggestion Chips */}
      <div className="px-3 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar z-10 shrink-0 bg-[#0c1622]/90 border-t border-white/5">
        {quickPrompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => handleSend(prompt)}
            className="text-[11px] font-medium text-stone-300 bg-[#162534] hover:bg-[#1f3246] hover:text-white border border-white/10 rounded-full px-3 py-1 transition-all whitespace-nowrap active:scale-95 cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Interactive Input Area */}
      <form onSubmit={(e) => handleSend(e)} className="bg-[#132232] px-3 py-2.5 flex items-center gap-2 border-t border-white/10 z-10 shrink-0">
        <div className="w-8 h-8 rounded-full text-stone-400 flex items-center justify-center hover:bg-white/5 cursor-pointer transition-colors shrink-0">
          <Smile size={18} />
        </div>
        <div className="w-8 h-8 rounded-full text-stone-400 flex items-center justify-center hover:bg-white/5 cursor-pointer transition-colors shrink-0 -ml-1">
          <Paperclip size={17} />
        </div>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Message AI Copilot..."
          className="flex-1 bg-[#1a2c3e] focus:bg-[#20364d] transition-colors rounded-full h-9 px-4 text-stone-100 text-[13px] border border-white/10 outline-none placeholder:text-stone-400"
        />
        <button
          type="submit"
          disabled={!inputValue.trim() || isTyping}
          className="w-9 h-9 rounded-full bg-gradient-to-r from-[#166534] to-[#22C55E] disabled:opacity-40 text-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all shrink-0 disabled:cursor-not-allowed cursor-pointer"
        >
          <Send size={15} className="ml-0.5" />
        </button>
      </form>
    </div>
  );
};

// 1. HERO (🌙 DARK)
export function Hero() {
  const [dispatcherTab, setDispatcherTab] = useState<'campaign' | 'routing' | 'events'>('campaign');

  return (
    <section className="relative min-h-screen pt-36 pb-28 px-4 sm:px-6 overflow-hidden bg-[#0a1826] text-white flex flex-col items-center justify-center">
      {/* Background Architectural Grid & Subtle Static Ambient Highlights (No flow effect) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:36px_36px] pointer-events-none z-0" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#166534]/20 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-[#22C55E]/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-[#12263A] rounded-full blur-[130px] pointer-events-none z-0" />

      {/* Hero Header Presentation */}
      <div className="max-w-5xl mx-auto relative z-10 w-full flex flex-col items-center text-center space-y-7">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-[#166534]/30 border border-[#22C55E]/40 rounded-full shadow-[0_0_25px_rgba(34,197,94,0.18)] backdrop-blur-md"
        >
          <span className="w-2 h-2 rounded-full bg-[#22C55E] shadow-[0_0_8px_rgba(34,197,94,0.9)]" />
          <span className="font-sans font-semibold text-[13px] tracking-wide text-[#F0FDF4]">
            Modern Conversational CRM & Marketing
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-display font-[800] text-[32px] xs:text-[42px] sm:text-[54px] md:text-[66px] lg:text-[74px] leading-[1.08] tracking-[-0.035em] text-white max-w-4xl px-2"
        >
          Turn WhatsApp & Email Into Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#22C55E] via-[#4ade80] to-[#bbf7d0]">Highest-ROI</span> Channels
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-sans font-normal text-[17px] md:text-[19px] leading-[1.75] max-w-2xl text-stone-300"
        >
          Launch targeted broadcast campaigns, automate customer journeys, and resolve customer inquiries faster with an all-in-one conversational CRM.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 w-full max-w-md sm:max-w-none"
        >
          <NavLink
            to="/signup"
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#166534] to-[#22C55E] hover:from-[#14532d] hover:to-[#16a34a] text-white font-sans font-bold text-[15px] tracking-[0.2px] rounded-xl transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_12px_35px_rgba(34,197,94,0.4)] active:scale-[0.98] text-center shadow-lg flex items-center justify-center gap-2 group cursor-pointer"
          >
            Start Free Trial 
            <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
          </NavLink>
          <NavLink
            to="/contact"
            className="w-full sm:w-auto px-8 py-4 bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 hover:border-white/30 text-white font-sans font-semibold text-[15px] tracking-[0.2px] rounded-xl transition-all duration-200 backdrop-blur-md active:scale-[0.98] text-center shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <Bot size={18} className="text-[#22C55E]" /> See AI Demo
          </NavLink>
        </motion.div>

        {/* Trust Badges Dock */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-x-8 text-[10.5px] sm:text-[11px] font-bold text-stone-300 uppercase tracking-wider bg-white/[0.03] border border-white/10 px-5 sm:px-6 py-3 sm:py-2.5 rounded-2xl sm:rounded-full backdrop-blur-md shadow-inner text-center"
        >
          <span className="flex items-center justify-center gap-1.5"><CheckCircle2 size={15} className="text-[#22C55E] shrink-0" /> Official WhatsApp API</span>
          <span className="flex items-center justify-center gap-1.5"><CheckCircle2 size={15} className="text-[#22C55E] shrink-0" /> Advanced AI Routing</span>
          <span className="flex items-center justify-center gap-1.5"><CheckCircle2 size={15} className="text-[#22C55E] shrink-0" /> 24/7 Autopilot</span>
        </motion.div>
      </div>

      {/* Panoramic Command-Center Deck: Dual-Engine Workstation */}
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.7 }}
        className="w-full max-w-6xl mx-auto mt-14 relative z-10"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-[#166534]/40 via-[#22C55E]/20 to-[#12263A] rounded-[2.6rem] blur-xl opacity-70 -z-10" />

        <div className="bg-[#0b1725]/95 border border-white/10 rounded-[2.5rem] shadow-[0_30px_90px_rgba(0,0,0,0.8)] backdrop-blur-2xl ring-1 ring-white/10 overflow-hidden flex flex-col">
          <div className="px-3.5 sm:px-6 py-2.5 sm:py-3.5 bg-[#0f2032] border-b border-white/10 flex items-center justify-between gap-2 overflow-hidden">
            <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-emerald-500/80 inline-block" />
              </div>
              <div className="h-4 w-px bg-white/10 mx-1 hidden sm:block" />
              <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-stone-300">
                <span className="text-[#22C55E]">talkinexx-hub</span>
                <span className="text-stone-500">/</span>
                <span>live-automation-deck</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="inline-flex items-center gap-1.5 text-[9px] sm:text-[10px] font-mono text-[#86efac] bg-[#166534]/30 border border-[#22C55E]/30 px-2.5 sm:px-3 py-1 rounded-full uppercase tracking-wider shrink-0 whitespace-nowrap">
                <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-[#22C55E] animate-pulse shrink-0" />
                <span>Meta Cloud API Active <span className="hidden xs:inline">• 99.9% Uptime</span></span>
              </span>
            </div>
          </div>

          <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-gradient-to-b from-[#0b1725] to-[#08121d]">
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#22C55E] uppercase tracking-wider">
                    <Activity size={14} className="text-[#22C55E]" />
                    <span>Live Operations Dispatcher</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
                    High-Throughput Campaign & Chat Ingestion
                  </h3>
                </div>

                {/* Dispatcher View Switcher Tabs */}
                <div className="hidden sm:flex items-center gap-1 bg-[#122437] border border-white/10 p-1 rounded-xl text-[10px] font-mono">
                  <button
                    onClick={() => setDispatcherTab('campaign')}
                    className={cn("px-2.5 py-1 rounded-lg transition-all cursor-pointer", dispatcherTab === 'campaign' ? "bg-[#166534] text-white font-bold" : "text-stone-400 hover:text-white")}
                  >
                    Campaign
                  </button>
                  <button
                    onClick={() => setDispatcherTab('routing')}
                    className={cn("px-2.5 py-1 rounded-lg transition-all cursor-pointer", dispatcherTab === 'routing' ? "bg-[#166534] text-white font-bold" : "text-stone-400 hover:text-white")}
                  >
                    Routing
                  </button>
                  <button
                    onClick={() => setDispatcherTab('events')}
                    className={cn("px-2.5 py-1 rounded-lg transition-all cursor-pointer", dispatcherTab === 'events' ? "bg-[#166534] text-white font-bold" : "text-stone-400 hover:text-white")}
                  >
                    Events
                  </button>
                </div>
              </div>

              <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
                Real-time event streams process every inbound query, execute contextual AI routing, and sync deal status directly with your customer database.
              </p>

              {dispatcherTab === 'campaign' && (
                <div className="bg-[#122437] border border-white/10 rounded-2xl p-4.5 space-y-3.5 shadow-lg animate-in fade-in duration-200">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="w-8 h-8 rounded-xl bg-[#166534]/40 border border-[#22C55E]/30 text-[#22C55E] flex items-center justify-center shrink-0">
                        <Send size={15} />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-white block truncate">VIP Spring Flash Promo</span>
                        <span className="text-[10px] text-stone-400 font-mono block truncate">2,480 recipients • Instant delivery</span>
                      </div>
                    </div>
                    <span className="text-[9.5px] sm:text-[10px] font-mono font-bold text-[#86efac] bg-[#166534]/30 border border-[#22C55E]/30 px-2 sm:px-2.5 py-1 rounded-md shrink-0 whitespace-nowrap">
                      98.4% Delivered
                    </span>
                  </div>

                  <div className="w-full bg-[#0a1826] h-2 rounded-full overflow-hidden border border-white/5">
                    <div className="bg-gradient-to-r from-[#166534] via-[#22C55E] to-[#86efac] h-full w-[98%]" />
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-1 border-t border-white/5 text-center">
                    <div className="p-2 rounded-lg bg-white/[0.02]">
                      <span className="text-[9px] uppercase tracking-widest text-stone-400 font-semibold block">Response Time</span>
                      <span className="text-xs font-mono font-bold text-white">&lt; 1.2s</span>
                    </div>
                    <div className="p-2 rounded-lg bg-white/[0.02]">
                      <span className="text-[9px] uppercase tracking-widest text-stone-400 font-semibold block">Campaign ROI</span>
                      <span className="text-xs font-mono font-bold text-[#86efac]">4.2x Avg</span>
                    </div>
                    <div className="p-2 rounded-lg bg-white/[0.02]">
                      <span className="text-[9px] uppercase tracking-widest text-stone-400 font-semibold block">Meta Cloud Tier</span>
                      <span className="text-xs font-mono font-bold text-white">Tier 3 (100k/d)</span>
                    </div>
                  </div>
                </div>
              )}

              {dispatcherTab === 'routing' && (
                <div className="bg-[#122437] border border-white/10 rounded-2xl p-4.5 space-y-3 shadow-lg animate-in fade-in duration-200 text-xs font-mono">
                  <div className="flex items-center justify-between pb-2 border-b border-white/5 text-stone-300">
                    <span className="text-[11px] text-[#22C55E] font-bold">Topology Node</span>
                    <span className="text-[10px] text-stone-400">Latency</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02]">
                    <span className="flex items-center gap-2 text-stone-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      1. Ad Ingestion (TikTok / Meta)
                    </span>
                    <span className="text-stone-400 font-bold">12ms</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02]">
                    <span className="flex items-center gap-2 text-stone-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      2. Context Intent Classifier
                    </span>
                    <span className="text-stone-400 font-bold">38ms</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02]">
                    <span className="flex items-center gap-2 text-stone-200">
                      <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
                      3. WhatsApp Cloud API Dispatch
                    </span>
                    <span className="text-[#86efac] font-bold">Active</span>
                  </div>
                </div>
              )}

              {dispatcherTab === 'events' && (
                <div className="bg-[#122437] border border-white/10 rounded-2xl p-4.5 space-y-2 shadow-lg animate-in fade-in duration-200">
                  <span className="text-[10.5px] font-mono text-stone-400 uppercase tracking-widest flex items-center gap-1.5 pb-2 border-b border-white/5">
                    <Radio size={12} className="text-[#22C55E]" /> Live Broadcast Stream
                  </span>
                  <div className="space-y-1.5 font-mono text-[11px]">
                    <div className="p-2 rounded-lg bg-white/[0.03] border border-white/5 flex items-center justify-between text-stone-300">
                      <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                        <span>Sarah M. booked 3:00 PM slot via WhatsApp</span>
                      </span>
                      <span className="text-stone-500 text-[10px]">Just now</span>
                    </div>
                    <div className="p-2 rounded-lg bg-white/[0.03] border border-white/5 flex items-center justify-between text-stone-300">
                      <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                        <span>CRM deal created: Sarah Miller ($1,200)</span>
                      </span>
                      <span className="text-stone-500 text-[10px]">1m ago</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <span className="text-[10.5px] font-mono text-stone-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Radio size={12} className="text-[#22C55E]" /> Live Activity Log
                </span>
                <div className="space-y-1.5 font-mono text-[11px]">
                  <div className="p-2 rounded-lg bg-white/[0.03] border border-white/5 flex items-center justify-between text-stone-300">
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                      <span>Sarah M. booked 3:00 PM slot via WhatsApp</span>
                    </span>
                    <span className="text-stone-500 text-[10px]">Just now</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white/[0.03] border border-white/5 flex items-center justify-between text-stone-300">
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                      <span>CRM deal created: Sarah Miller ($1,200)</span>
                    </span>
                    <span className="text-stone-500 text-[10px]">1m ago</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <AnimatedChatMockup />
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

// 2. TRUSTED BY (☀️ LIGHT)
export function TrustedBy() {
  const { integrationTitle, integrationLogos, loadBranding } = useBrandingStore();

  useEffect(() => {
    loadBranding();
  }, [loadBranding]);

  const activeLogos = (integrationLogos && integrationLogos.length > 0
    ? integrationLogos.filter(l => l.active !== false)
    : DEFAULT_INTEGRATION_LOGOS);

  const renderLogo = (item: IntegrationLogoItem, index: number) => {
    if (item.logo_url) {
      return (
        <a
          key={`${item.id}-${index}`}
          href={item.url || '#'}
          target={item.url ? '_blank' : undefined}
          rel="noreferrer"
          className="shrink-0 transition-transform duration-200 hover:scale-105"
        >
          <img
            src={item.logo_url}
            alt={item.name}
            className="h-6 max-h-7 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0"
          />
        </a>
      );
    }

    const type = (item.type || item.name || '').toLowerCase();

    let logoElement: React.ReactNode = null;
    if (type.includes('notion')) {
      logoElement = <NotionLogo />;
    } else if (type.includes('tc') || type.includes('techcrunch')) {
      logoElement = <TcLogo />;
    } else if (type.includes('linear')) {
      logoElement = <LinearLogo />;
    } else if (type.includes('hubspot')) {
      logoElement = <HubSpotLogo />;
    } else if (type.includes('vercel')) {
      logoElement = <VercelLogo />;
    } else if (type.includes('stripe')) {
      logoElement = <StripeLogo />;
    } else {
      logoElement = (
        <span className="font-sans font-black tracking-widest text-base uppercase opacity-60 hover:opacity-100 hover:text-slate-900 transition-all duration-300 text-stone-700">
          {item.name}
        </span>
      );
    }

    return (
      <a
        key={`${item.id}-${index}`}
        href={item.url || '#'}
        target={item.url ? '_blank' : undefined}
        rel="noreferrer"
        className="shrink-0 inline-flex items-center justify-center transition-transform duration-200 hover:scale-105 text-stone-600"
      >
        {logoElement}
      </a>
    );
  };

  return (
    <section className="py-14 border-y border-stone-200/80 bg-[#FAFAF9] overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-[11px] font-bold text-stone-400 uppercase tracking-[0.2em] mb-8">
          {integrationTitle || 'INTEGRATES SEAMLESSLY WITH YOUR EXISTING STACK & TOOLS'}
        </p>

        <div className="flex w-full overflow-hidden relative [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
          <div className="flex gap-24 animate-marquee whitespace-nowrap py-3 shrink-0 items-center">
            {activeLogos.map((item, idx) => renderLogo(item, idx))}
            {activeLogos.map((item, idx) => renderLogo(item, idx + activeLogos.length))}
          </div>
        </div>
      </div>
    </section>
  );
}

// 3. OMNICHANNEL INBOX (☀️ LIGHT SECTION WITH HIGH-CONTRAST DARK CONSOLE)
export function OmnichannelInbox() {
  const [selectedChannel, setSelectedChannel] = useState<'all' | 'copilot' | 'sales' | 'support' | 'broadcasts'>('all');

  const channelData = {
    all: {
      name: 'Ahmad Khan',
      source: 'via WhatsApp Business',
      tag: 'AI suggested',
      msg: '"Hi! Do you have slots available for a demo call today?"',
      author: 'Ahmad • 10:41 AM',
      reply: '"Yes, Ahmed! We have slots open at 3:00 PM and 5:00 PM. Book here."',
      replyMeta: 'AI Copilot Draft • 10:41 AM'
    },
    copilot: {
      name: 'Dr. Elena Vance',
      source: 'via Medical Clinic Bot',
      tag: 'Autonomous Flow',
      msg: '"Can I reschedule my appointment from Tuesday to Thursday?"',
      author: 'Elena • 11:05 AM',
      reply: '"Certainly! Rescheduled to Thursday at 4:00 PM. Google Calendar invite sent."',
      replyMeta: 'Auto-Confirmed • 11:05 AM'
    },
    sales: {
      name: 'Sarah Miller Retail',
      source: 'via Instagram DM Ad',
      tag: 'High Priority Lead',
      msg: '"Saw your ad on Instagram. What is the onboarding timeframe?"',
      author: 'Sarah • 11:15 AM',
      reply: '"We onboard in under 15 minutes with official Meta Cloud API templates!"',
      replyMeta: 'Sales Qualified • 11:15 AM'
    },
    support: {
      name: 'David Chen',
      source: 'via Web ChatWidget',
      tag: 'Tech Support',
      msg: '"Does the CRM support custom webhook payloads?"',
      author: 'David • 11:20 AM',
      reply: '"Yes, full REST JSON webhook support with instant delivery callbacks."',
      replyMeta: 'Verified Answer • 11:20 AM'
    },
    broadcasts: {
      name: 'Marketing Dispatcher',
      source: 'via WhatsApp Broadcast',
      tag: 'Campaign Blast',
      msg: '"Broadcast campaign \'VIP Spring Flash Promo\' sent to 2,480 users."',
      author: 'System • 11:30 AM',
      reply: '"98.4% delivered • 18.2% click-through rate in 8 minutes."',
      replyMeta: 'High ROI • 11:30 AM'
    }
  };

  const active = channelData[selectedChannel];

  return (
    <section id="solutions" className="py-32 px-6 bg-white text-[#12263A] border-b border-stone-200/80 overflow-hidden relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">
        {/* Visual Console Mockup (Dark Workstation in Light Section) */}
        <div className="lg:col-span-6 w-full flex justify-center">
          <div className="w-full max-w-lg bg-[#0a1826] border border-stone-800 rounded-2xl sm:rounded-[2.25rem] shadow-[0_25px_60px_rgba(18,38,58,0.18)] ring-1 ring-black/5 p-3.5 sm:p-5 relative overflow-hidden flex flex-col min-h-[440px] sm:h-[420px] text-white">
            {/* Console Header with macOS Window Dots */}
            <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2.5 sm:pb-3 overflow-hidden">
              <div className="flex items-center gap-2 min-w-0">
                <div className="flex items-center gap-1.5 mr-1 shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-[11px] sm:text-xs font-semibold tracking-tight text-stone-200 truncate">Talkinexx Workspace</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#12263A] px-2 sm:px-2.5 py-1 rounded-md border border-white/10 text-[8.5px] sm:text-[9px] font-mono text-[#22C55E] shrink-0 whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] shrink-0" />
                <span>OFFICIAL CLOUD API</span>
              </div>
            </div>

            {/* Console Body Split with Interactive Channel Switcher */}
            <div className="flex-1 flex flex-col sm:flex-row gap-3 sm:gap-4 mt-3 overflow-hidden">
              <div className="flex sm:flex-col sm:w-1/3 border-b sm:border-b-0 sm:border-r border-white/5 pb-2.5 sm:pb-0 sm:pr-3 gap-1.5 sm:space-y-1.5 text-[11px] font-medium text-stone-400 overflow-x-auto sm:overflow-visible shrink-0">
                <button
                  type="button"
                  onClick={() => setSelectedChannel('all')}
                  className={cn("p-2 rounded-xl flex items-center justify-between font-semibold transition-all cursor-pointer text-left shrink-0 whitespace-nowrap sm:w-full",
                    selectedChannel === 'all'
                      ? "bg-[#166534]/30 border border-[#22C55E]/30 text-[#86efac]"
                      : "hover:bg-white/5 text-stone-300"
                  )}
                >
                  <span className="flex items-center gap-1.5">💬 All Chats</span>
                  <span className="w-4 h-4 bg-[#22C55E] text-slate-950 font-bold text-[9px] rounded-full flex items-center justify-center ml-2 sm:ml-0">4</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedChannel('copilot')}
                  className={cn("p-2 rounded-xl flex items-center justify-between transition-all cursor-pointer text-left shrink-0 whitespace-nowrap sm:w-full",
                    selectedChannel === 'copilot'
                      ? "bg-[#166534]/30 border border-[#22C55E]/30 text-[#86efac] font-semibold"
                      : "hover:bg-white/5 text-stone-300"
                  )}
                >
                  <span className="flex items-center gap-1.5">🤖 AI Copilot</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedChannel('sales')}
                  className={cn("p-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer text-left shrink-0 whitespace-nowrap sm:w-full",
                    selectedChannel === 'sales'
                      ? "bg-[#166534]/30 border border-[#22C55E]/30 text-[#86efac] font-semibold"
                      : "hover:bg-white/5 text-stone-400"
                  )}
                >
                  <span>🏷️ Sales Leads</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedChannel('support')}
                  className={cn("p-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer text-left shrink-0 whitespace-nowrap sm:w-full",
                    selectedChannel === 'support'
                      ? "bg-[#166534]/30 border border-[#22C55E]/30 text-[#86efac] font-semibold"
                      : "hover:bg-white/5 text-stone-400"
                  )}
                >
                  <span>🎫 Support</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedChannel('broadcasts')}
                  className={cn("p-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer text-left shrink-0 whitespace-nowrap sm:w-full",
                    selectedChannel === 'broadcasts'
                      ? "bg-[#166534]/30 border border-[#22C55E]/30 text-[#86efac] font-semibold"
                      : "hover:bg-white/5 text-stone-400"
                  )}
                >
                  <span>🚀 Broadcasts</span>
                </button>
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#166534] text-white flex items-center justify-center text-[10px] font-bold">
                      {active.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-white block leading-tight">{active.name}</span>
                      <span className="text-[9px] text-[#22C55E] block">{active.source}</span>
                    </div>
                  </div>
                  <span className="text-[9px] text-[#22C55E] font-semibold bg-[#166534]/30 border border-[#22C55E]/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {active.tag}
                  </span>
                </div>

                <div className="flex-1 flex flex-col justify-end gap-2.5 my-2">
                  <div className="flex flex-col items-start max-w-[88%] self-start space-y-1">
                    <div className="p-3 bg-[#12263A] border border-white/10 rounded-2xl rounded-tl-none text-xs leading-relaxed text-stone-200">
                      {active.msg}
                    </div>
                    <span className="text-[8.5px] text-stone-400 font-medium pl-1">{active.author}</span>
                  </div>

                  <div className="flex flex-col items-end max-w-[88%] self-end space-y-1">
                    <div className="p-3 bg-gradient-to-r from-[#166534] to-[#22C55E] rounded-2xl rounded-tr-none text-xs leading-relaxed text-white relative shadow-md">
                      <Sparkles size={11} className="absolute top-2 right-2 text-emerald-200" />
                      {active.reply}
                    </div>
                    <span className="text-[8.5px] text-[#22C55E] font-medium pr-1 flex items-center gap-1">
                      <CheckCheck size={12} /> {active.replyMeta}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 border-t border-white/5 pt-2.5 pb-1 mt-auto">
                  <input
                    type="text"
                    placeholder="Send auto-reply or type response..."
                    className="flex-1 min-w-0 bg-[#12263A] border border-white/10 rounded-xl h-8 px-3 text-[10.5px] sm:text-[11px] text-stone-300 placeholder-stone-500 focus:outline-none"
                    disabled
                  />
                  <button className="h-8 px-3 bg-gradient-to-r from-[#166534] to-[#22C55E] text-white font-bold text-[10px] rounded-xl flex items-center justify-center cursor-default shadow-sm shrink-0">
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Text Area */}
        <div className="lg:col-span-6 space-y-6 text-left">
          <span className="font-sans font-semibold text-[13px] uppercase tracking-[1.5px] text-[#166534] bg-[#F0FDF4] px-4 py-1.5 rounded-full border border-[#bbf7d0] inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#166534]" />
            WhatsApp Automation
          </span>
          <h2 className="font-display font-[800] text-[34px] md:text-[42px] lg:text-[48px] leading-[1.12] tracking-[-0.03em] text-[#12263A]">
            Scale your business on WhatsApp
          </h2>
          <p className="font-sans font-normal text-[17px] leading-[1.75] max-w-[620px] text-[#57534E]">
            Stop manually replying to repetitive queries. Automate responses, route conversations to the right team, and send targeted broadcast campaigns on the world's most popular messaging app.
          </p>

          <div className="grid grid-cols-2 gap-5 pt-3">
            <div className="p-5 rounded-2xl bg-[#FAFAF9] border border-stone-200/80 shadow-xs hover:border-[#166534]/40 hover:shadow-md transition-all">
              <span className="block text-3xl md:text-4xl font-display font-extrabold text-[#12263A]">
                98%
              </span>
              <span className="block text-[11px] font-bold text-stone-400 uppercase tracking-widest mt-1">
                Message Open Rate
              </span>
            </div>
            <div className="p-5 rounded-2xl bg-[#FAFAF9] border border-stone-200/80 shadow-xs hover:border-[#166534]/40 hover:shadow-md transition-all">
              <span className="block text-3xl md:text-4xl font-display font-extrabold text-[#166534]">
                24/7
              </span>
              <span className="block text-[11px] font-bold text-stone-400 uppercase tracking-widest mt-1">
                Automated Support
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// 4. AI WORKFLOW (🌙 DARK BENTO GRID)
export function AIWorkflow() {
  const steps = [
    { icon: MessageCircle, title: 'Inbound Message', desc: 'Customer texts your WhatsApp number or scans a QR code.' },
    { icon: Zap, title: 'AI Context Engine', desc: 'Instantly analyzes context, language, and purchasing intent.' },
    { icon: Send, title: 'Interactive Reply', desc: 'Fires back personalized replies with WhatsApp buttons & lists.' },
    { icon: Calendar, title: 'In-Chat Booking', desc: 'Customer books a meeting slot directly within the chat window.' },
    { icon: Database, title: 'CRM Sync', desc: 'Automatically logs the lead, tags intent, and updates your CRM.' },
    { icon: Users, title: 'Smart Handoff', desc: 'Routes complex or high-value chats to human agents seamlessly.' }
  ];

  return (
    <section className="py-32 px-6 bg-[#0d1c2d] text-white relative overflow-hidden border-b border-white/[0.08]">
      {/* Background Radial Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#166534]/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[350px] h-[350px] bg-[#22C55E]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto text-center relative z-10">
        <div className="max-w-2xl mx-auto space-y-4 mb-20 text-center flex flex-col items-center">
          <span className="font-sans font-semibold text-[13px] uppercase tracking-[1.5px] text-[#22C55E] bg-[#166534]/30 px-4 py-1.5 rounded-full border border-[#22C55E]/30 flex items-center gap-2 backdrop-blur-md shadow-[0_0_15px_rgba(34,197,94,0.1)]">
            <Sparkles size={14} className="text-[#22C55E]" />
            100% Automated Workflow
          </span>
          <h2 className="font-display font-[800] text-[32px] md:text-[42px] lg:text-[50px] leading-[1.12] tracking-[-0.03em] text-white">
            Turn WhatsApp Into Your Best Employee
          </h2>
          <p className="font-sans font-normal text-[17px] leading-[1.75] max-w-[620px] text-stone-300">
            Deploy AI on your WhatsApp Business number to automate response generation, support workflows, and pipeline progression 24/7.
          </p>
        </div>

        {/* Step-by-Step Modern Bento Grid Architecture */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="group bg-[#12263A]/80 border border-white/10 hover:border-[#22C55E]/50 hover:bg-[#16304a] p-7 rounded-[1.75rem] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 relative shadow-xl text-left flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-13 h-13 bg-[#166534]/30 border border-[#22C55E]/30 text-[#22C55E] rounded-2xl flex items-center justify-center shadow-inner group-hover:bg-gradient-to-br group-hover:from-[#166534] group-hover:to-[#22C55E] group-hover:text-white transition-all duration-300">
                      <Icon size={24} strokeWidth={2} />
                    </div>
                    <span className="font-mono text-xs font-bold text-stone-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg group-hover:text-[#22C55E] group-hover:border-[#22C55E]/30 transition-colors">
                      STAGE 0{idx + 1}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-white mb-2 tracking-tight group-hover:text-[#86efac] transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-sm text-stone-300 leading-relaxed font-normal">
                    {s.desc}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-stone-400">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                    <span>Real-time Autopilot</span>
                  </span>
                  <span className="text-[#22C55E] opacity-0 group-hover:opacity-100 transition-opacity">
                    Active →
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// 5. WHATSAPP AUTOMATION (☀️ LIGHT SECTION WITH HIGH-CONTRAST DUAL VISUALS)
export function WhatsAppAutomation() {
  const sectionRef = useRef<HTMLElement>(null);

  const features = [
    {
      icon: Bot,
      title: '24/7 AI Customer Replies',
      desc: 'Automatically answer customer messages day and night using predefined intelligent workflows.',
      color: 'bg-[#F0FDF4] text-[#166534] border-[#bbf7d0]'
    },
    {
      icon: MessageCircle,
      title: 'Instant Welcome Message',
      desc: 'Send personalized greetings immediately when a customer starts a WhatsApp conversation.',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      icon: FileText,
      title: 'Interactive Service Selection',
      desc: 'Display business services as clickable WhatsApp buttons so customers can quickly navigate to the service they need.',
      color: 'bg-[#166534]/10 text-[#166534] border-[#166534]/20'
    },
    {
      icon: Calendar,
      title: 'Appointment Booking Automation',
      desc: 'Automatically collect customer information, preferred date, available time slots, and confirm appointments without staff involvement.',
      color: 'bg-[#12263A]/10 text-[#12263A] border-[#12263A]/20'
    },
    {
      icon: MousePointerClick,
      title: 'Click-to-WhatsApp Advertising',
      desc: 'Integrate TikTok, Facebook, Instagram, Snapchat, and Google Ads so customers who click ads land directly into a WhatsApp conversation.',
      color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
    },
    {
      icon: Database,
      title: 'CRM & Lead Management',
      desc: 'Automatically save customer information, create leads, notify sales representatives, and synchronize conversations with the CRM.',
      color: 'bg-stone-100 text-stone-700 border-stone-200'
    }
  ];

  const workflowSteps = [
    { label: 'Customer Clicks Ad', sub: 'TikTok • Facebook • Instagram • Snapchat • Google', icon: MousePointerClick },
    { label: 'WhatsApp Opens Instantly', sub: 'Direct deep-link conversation', icon: MessageCircle },
    { label: 'Automatic Welcome Message', sub: '"Welcome to Talkinexx 👋"', icon: Send },
    { label: 'Customer Selects Service', sub: 'Book • Quote • Services • Support', icon: FileText },
    { label: 'AI Asks Required Questions', sub: 'Smart contextual follow-ups', icon: Bot },
    { label: 'Booking Confirmed', sub: 'Appointment or quote locked in', icon: Calendar },
    { label: 'Info Saved & Lead Created', sub: 'CRM auto-sync & lead pipeline', icon: Database },
    { label: 'Sales Team Notified', sub: 'Instant alerts to account managers', icon: BellRing }
  ];

  const stats = [
    { value: '24/7', label: 'AI Availability', sub: 'Non-stop coverage' },
    { value: '98%', label: 'Instant Response Rate', sub: 'Under 3 seconds' },
    { value: '3X', label: 'Higher Conversion', sub: 'vs traditional forms' },
    { value: '0', label: 'Manual Intervention', sub: 'Fully automated' }
  ];

  return (
    <>
      {/* Main Two-Column Section (☀️ LIGHT) */}
      <section
        ref={sectionRef}
        id="whatsapp-automation"
        className="py-32 px-6 bg-[#FAFAF9] text-[#12263A] border-b border-stone-200/80 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto">
          {/* Section Badge + Title */}
          <div className="text-center mb-20 max-w-2xl mx-auto space-y-4 flex flex-col items-center">
            <span className="font-sans font-semibold text-[13px] uppercase tracking-[1.5px] text-[#166534] bg-[#F0FDF4] px-4 py-1.5 rounded-full border border-[#bbf7d0] flex items-center gap-1.5 w-fit">
              <MessageCircle size={14} className="text-[#166534]" />
              WhatsApp Automation
            </span>
            <h2 className="font-display font-[800] text-[34px] md:text-[42px] lg:text-[48px] leading-[1.12] tracking-[-0.03em] text-[#12263A]">
              AI WhatsApp Automation for <span className="text-[#166534]">Businesses & Clinics</span>
            </h2>
            <p className="font-sans font-normal text-[17px] leading-[1.75] max-w-[700px] text-[#57534E]">
              Transform customer communication with intelligent WhatsApp automation that replies instantly, guides customers through services, books appointments, captures leads, and integrates directly with your marketing campaigns.
            </p>
          </div>

          {/* Two-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            {/* Left Column: 6 Features (Light Cards) */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-4">
                <h3 className="font-display font-[800] text-[24px] md:text-[28px] leading-[1.2] tracking-[-0.02em] text-[#12263A]">
                  Automate every customer touchpoint from ad click to appointment booking
                </h3>
                <p className="font-sans font-normal text-[16px] leading-[1.75] text-[#57534E]">
                  Deploy AI-powered WhatsApp workflows that handle lead capture, service inquiries, appointment scheduling, and CRM synchronization — completely hands-free.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((f, idx) => (
                  <motion.div
                    key={f.title}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ delay: idx * 0.05 }}
                    className="p-5 bg-white border border-stone-200/80 rounded-2xl shadow-xs hover:shadow-md hover:border-[#166534]/40 hover:-translate-y-1 transition-all duration-300 group ring-1 ring-black/5"
                  >
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border transition-all mb-3", f.color)}>
                      <f.icon size={18} strokeWidth={2.2} />
                    </div>
                    <h4 className="text-sm font-bold text-[#12263A] mb-1.5 tracking-tight group-hover:text-[#166534] transition-colors">{f.title}</h4>
                    <p className="text-[#57534E] font-medium text-[11px] leading-relaxed">{f.desc}</p>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="pt-2"
              >
                <NavLink
                  to="/contact"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#166534] to-[#22C55E] hover:from-[#14532d] hover:to-[#16a34a] text-white font-sans font-bold text-[15px] tracking-[0.2px] rounded-xl transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_10px_30px_rgba(34,197,94,0.35)] active:scale-[0.98] shadow-lg cursor-pointer"
                >
                  Get Started with WhatsApp AI
                  <ArrowRight size={16} />
                </NavLink>
              </motion.div>
            </div>

            {/* Right Column: 8-Step Pipeline (Dark Contrast Console) */}
            <div className="lg:col-span-7 w-full">
              <div className="w-full bg-[#0a1826] border border-stone-800 rounded-[2.25rem] p-6 md:p-8 shadow-[0_20px_50px_rgba(18,38,58,0.18)] ring-1 ring-white/10 relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6 relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 mr-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    </div>
                    <span className="text-xs font-semibold tracking-tight text-stone-200">WhatsApp Automation Pipeline</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#12263A] px-2.5 py-1 rounded-md border border-white/10 text-[9px] font-mono text-[#22C55E]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                    <span>LIVE • 8 STEPS</span>
                  </div>
                </div>

                <div className="space-y-2.5 relative z-10">
                  {workflowSteps.map((step, idx) => (
                    <motion.div
                      key={step.label}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-30px" }}
                      transition={{ delay: idx * 0.06, duration: 0.3 }}
                    >
                      <div className="flex items-center gap-4 p-3 bg-white/[0.04] border border-white/[0.08] rounded-xl backdrop-blur-sm hover:bg-white/[0.08] hover:border-[#22C55E]/30 transition-all duration-300 group">
                        <div className="w-8 h-8 bg-[#166534]/40 border border-[#22C55E]/30 text-[#22C55E] font-mono font-bold rounded-lg flex items-center justify-center text-xs shrink-0 group-hover:bg-[#166534] group-hover:text-white transition-all duration-300">
                          {idx + 1}
                        </div>

                        <div className="w-8 h-8 bg-[#12263A] border border-white/10 rounded-lg flex items-center justify-center shrink-0">
                          <step.icon size={14} className="text-stone-300 group-hover:text-[#22C55E] transition-colors" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <span className="text-[12px] font-bold text-white block leading-tight group-hover:text-[#86efac] transition-colors">{step.label}</span>
                          <span className="text-[10px] text-stone-400 font-medium block mt-0.5 truncate">{step.sub}</span>
                        </div>

                        <div className="w-2 h-2 rounded-full bg-[#22C55E]/60 group-hover:bg-[#22C55E] transition-colors shrink-0" />
                      </div>

                      {idx < workflowSteps.length - 1 && (
                        <div className="flex justify-center py-0.5">
                          <div className="w-px h-1.5 bg-[#22C55E]/30" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                <div className="mt-5 pt-3.5 border-t border-white/10 flex items-center justify-between text-[10px] relative z-10">
                  <span className="flex items-center gap-1.5 text-stone-300 font-medium">
                    <CheckCircle2 size={12} className="text-[#22C55E]" />
                    End-to-end automation • Zero manual intervention
                  </span>
                  <span className="text-[#22C55E] font-bold uppercase tracking-wider text-[9px] bg-[#166534]/30 border border-[#22C55E]/30 px-2 py-0.5 rounded-full">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Strip (🌙 DARK POD) */}
      <section className="py-20 px-6 bg-[#0a1826] relative overflow-hidden border-b border-white/[0.08]">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="bg-gradient-to-r from-[#0d1d2e] via-[#12263A] to-[#0d1d2e] border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.6)] rounded-[2.25rem] p-10 md:p-14 relative overflow-hidden ring-1 ring-white/10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:divide-x md:divide-white/[0.08] relative z-10">
              {stats.map((s, idx) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  className={cn(
                    "flex flex-col items-center justify-center text-center group/stat",
                    idx > 0 && "md:pl-6"
                  )}
                >
                  <div className="relative mb-2 sm:mb-3">
                    <span className="text-3xl sm:text-5xl md:text-6xl font-display font-extrabold bg-clip-text text-transparent bg-gradient-to-b from-white via-[#F0FDF4] to-[#86efac] tracking-tighter block drop-shadow-md">
                      {s.value}
                    </span>
                  </div>
                  <span className="block text-[11px] sm:text-[12px] font-bold text-[#22C55E] uppercase tracking-[0.15em] sm:tracking-[0.18em] mb-1">{s.label}</span>
                  <span className="block text-[9.5px] sm:text-[10px] font-semibold text-stone-400 uppercase tracking-widest">{s.sub}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Secondary CTA Section (🌙 DARK) */}
      <section className="py-28 px-6 bg-[#0d1c2d] text-white text-center relative overflow-hidden border-b border-white/[0.08]">
        <div className="max-w-3xl mx-auto space-y-8 relative z-10 flex flex-col items-center">
          <span className="font-sans font-semibold text-[13px] uppercase tracking-[1.5px] text-[#22C55E] bg-[#166534]/30 px-4 py-1.5 rounded-full border border-[#22C55E]/30 flex items-center gap-1.5 backdrop-blur-md">
            <Sparkles size={13} className="text-[#22C55E]" />
            WhatsApp AI
          </span>

          <h2 className="font-display font-[800] text-[32px] md:text-[42px] lg:text-[50px] leading-[1.1] tracking-[-0.03em] text-white max-w-2xl">
            Ready to Automate Your Customer <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#22C55E] via-[#4ade80] to-[#bbf7d0]">Conversations?</span>
          </h2>

          <p className="font-sans font-normal text-[17px] leading-[1.75] max-w-[600px] text-stone-300">
            Deploy AI-powered WhatsApp automation for your business or clinic and never miss another customer again.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-x-8 text-[11px] sm:text-[12px] font-semibold text-stone-200 font-sans uppercase tracking-[0.5px] bg-white/[0.06] border border-white/10 px-5 sm:px-8 py-3.5 rounded-2xl sm:rounded-full backdrop-blur-md shadow-inner text-center">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-[#22C55E] shrink-0" />
              <span>Click-to-WhatsApp Ads</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-[#22C55E] shrink-0" />
              <span>AI Booking</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-[#22C55E] shrink-0" />
              <span>CRM Sync</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-[#22C55E] shrink-0" />
              <span>24/7 Auto-Reply</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 w-full">
            <NavLink
              to="/signup"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#166534] to-[#22C55E] hover:from-[#14532d] hover:to-[#16a34a] text-white font-sans font-bold text-[15px] tracking-[0.2px] rounded-xl transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_10px_30px_rgba(34,197,94,0.35)] active:scale-[0.98] text-center shadow-lg cursor-pointer"
            >
              Get Started
            </NavLink>
            <NavLink
              to="/contact"
              className="w-full sm:w-auto px-8 py-4 bg-white/[0.07] hover:bg-white/[0.12] border border-white/15 hover:border-white/30 text-white font-sans font-semibold text-[15px] tracking-[0.2px] rounded-xl transition-all duration-200 backdrop-blur-sm active:scale-[0.98] text-center shadow-sm cursor-pointer"
            >
              Book a Live Demo
            </NavLink>
          </div>
        </div>
      </section>
    </>
  );
}

// 6. CRM DASHBOARD PREVIEW (☀️ LIGHT SECTION WITH CRISP MAC OS BOARD)
export function CRMDashboardPreview() {
  const { websiteName } = useBrandingStore();
  const [dealFilter, setDealFilter] = useState<'all' | 'whatsapp' | 'instagram' | 'messenger'>('all');

  const rawColumns = [
    {
      title: 'Qualification',
      count: '1 Lead',
      value: '$4,500',
      color: 'border-t-[#12263A]',
      deals: [
        {
          initials: 'AK',
          name: 'Ahmad Khan Support',
          deal: '$4,500 CRM Integration',
          time: 'Active 2m ago',
          channel: '💬 WhatsApp API',
          channelType: 'whatsapp',
          tag: 'High Priority',
          tagColor: 'bg-rose-50 text-rose-600 border-rose-200',
          desc: 'Needs segment routing and automated follow-ups configuration.'
        }
      ]
    },
    {
      title: 'Proposal & AI Review',
      count: '1 Lead',
      value: '$1,200',
      color: 'border-t-[#166534]',
      deals: [
        {
          initials: 'SM',
          name: 'Sarah Miller Retail',
          deal: '$1,200 Campaign Setup',
          time: 'Active 15m ago',
          channel: '📸 Instagram DM',
          channelType: 'instagram',
          tag: 'AI Replied',
          tagColor: 'bg-[#F0FDF4] text-[#166534] border-[#bbf7d0]',
          desc: 'AI suggested birthday auto-coupon template has been drafted.'
        }
      ]
    },
    {
      title: 'Closed Won',
      count: '1 Lead',
      value: '$8,900',
      color: 'border-t-[#22C55E]',
      deals: [
        {
          initials: 'ZM',
          name: 'Zayn Malik Labs',
          deal: '$8,900 Enterprise Hub',
          time: 'Completed 1h ago',
          channel: '👥 Messenger Chat',
          channelType: 'messenger',
          tag: 'API Integrated',
          tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          desc: 'Database fields synced. REST webhook callbacks are operational.'
        }
      ]
    }
  ];

  const columns = rawColumns.map(col => ({
    ...col,
    deals: col.deals.filter(d => dealFilter === 'all' || d.channelType === dealFilter)
  }));

  return (
    <section className="py-32 px-6 bg-white text-[#12263A] border-b border-stone-200/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="text-center max-w-xl mx-auto space-y-4">
          <span className="font-sans font-semibold text-[13px] uppercase tracking-[1.5px] text-[#166534] bg-[#F0FDF4] px-4 py-1.5 rounded-full border border-[#bbf7d0] inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#166534]" />
            Core Engine
          </span>
          <h2 className="font-display font-[800] text-[34px] md:text-[42px] lg:text-[48px] leading-[1.12] tracking-[-0.03em] text-[#12263A]">
            Complete Customer Relationship Pipeline
          </h2>
          <p className="font-sans font-normal text-[17px] leading-[1.75] max-w-[620px] text-[#57534E]">
            Monitor deals, track lead status, view active customer profiles, and review task timelines from one central workspace.
          </p>
        </div>

        {/* Kanban Board Interface Mockup */}
        <div className="w-full bg-[#FAFAF9] border border-stone-200/90 shadow-[0_20px_50px_rgba(18,38,58,0.06)] rounded-[2.25rem] p-6 sm:p-8 flex flex-col gap-6 ring-1 ring-black/5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-stone-200/70 pb-4 sm:pb-6 gap-3 sm:gap-4">
            <div className="flex items-start sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-1.5 mt-1 sm:mt-0 shrink-0">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              </div>
              <div className="h-4 w-px bg-stone-300 mx-0.5 sm:mx-1 hidden xs:block" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#22C55E] shrink-0" />
                  <h3 className="text-xs sm:text-base font-bold text-[#12263A] tracking-tight truncate">{websiteName || 'Talkinexx'} Active Deals Board</h3>
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-stone-500 mt-0.5 block truncate">Pipeline Value: <strong className="text-[#166534] font-bold">$14,600 USD</strong> • 3 active customer profiles</span>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-3 w-full sm:w-auto pt-1 sm:pt-0">
              <span className="text-[9.5px] sm:text-[10.5px] font-mono font-bold text-stone-600 uppercase tracking-wider bg-white border border-stone-200 px-2.5 sm:px-3 py-1.5 rounded-xl shadow-xs shrink-0 whitespace-nowrap">REST API: Active</span>
              <NavLink to="/contact" className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-[#12263A] to-[#166534] hover:from-[#0a1826] hover:to-[#14532d] text-white rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95 shrink-0 whitespace-nowrap">
                <span>Open CRM Workspace</span> <ArrowRight size={12} className="shrink-0" />
              </NavLink>
            </div>
          </div>

          {/* Filter Bar Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-stone-400 font-semibold text-[11px] flex items-center gap-1 shrink-0 mr-1">
              <Filter size={13} /> Filter:
            </span>
            <button
              onClick={() => setDealFilter('all')}
              className={cn("px-3 py-1 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap",
                dealFilter === 'all'
                  ? "bg-[#12263A] text-white shadow-xs"
                  : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-50"
              )}
            >
              All Deals (3)
            </button>
            <button
              onClick={() => setDealFilter('whatsapp')}
              className={cn("px-3 py-1 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap",
                dealFilter === 'whatsapp'
                  ? "bg-[#166534] text-white shadow-xs"
                  : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-50"
              )}
            >
              💬 WhatsApp ($4,500)
            </button>
            <button
              onClick={() => setDealFilter('instagram')}
              className={cn("px-3 py-1 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap",
                dealFilter === 'instagram'
                  ? "bg-[#166534] text-white shadow-xs"
                  : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-50"
              )}
            >
              📸 Instagram ($1,200)
            </button>
            <button
              onClick={() => setDealFilter('messenger')}
              className={cn("px-3 py-1 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap",
                dealFilter === 'messenger'
                  ? "bg-[#166534] text-white shadow-xs"
                  : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-50"
              )}
            >
              👥 Messenger ($8,900)
            </button>
          </div>

          {/* Kanban Columns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {columns.map((col) => (
              <div key={col.title} className={cn("p-5 bg-white border border-stone-200/90 rounded-2xl flex flex-col gap-4 border-t-4 shadow-xs", col.color)}>
                <div className="flex justify-between items-center border-b border-stone-100 pb-2.5">
                  <div>
                    <span className="font-display font-[700] text-sm text-[#12263A] block">{col.title}</span>
                    <span className="text-[10px] text-stone-400 font-semibold">{col.deals.length} Lead{col.deals.length !== 1 ? 's' : ''}</span>
                  </div>
                  <span className="text-xs font-bold text-[#166534] bg-[#F0FDF4] border border-[#bbf7d0] px-2.5 py-0.5 rounded-lg">{col.value}</span>
                </div>

                <div className="space-y-3 flex-1 min-h-[140px]">
                  {col.deals.length > 0 ? (
                    col.deals.map((deal, dealIdx) => (
                      <div key={dealIdx} className="p-4 bg-[#FAFAF9] border border-stone-200/70 shadow-xs rounded-xl flex flex-col gap-3.5 hover:border-[#166534]/40 hover:shadow-md transition-all duration-300 group">
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-[#F0FDF4] border border-[#bbf7d0] text-[#166534] flex items-center justify-center text-xs font-bold">
                              {deal.initials}
                            </div>
                            <div>
                              <span className="text-xs font-bold text-[#12263A] group-hover:text-[#166534] transition-colors block leading-tight">{deal.name}</span>
                              <span className="text-[10px] text-stone-400 font-medium block mt-0.5">{deal.channel}</span>
                            </div>
                          </div>
                          <span className={cn("text-[8.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border shrink-0", deal.tagColor)}>
                            {deal.tag}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[11.5px] font-bold text-[#12263A] block leading-tight">{deal.deal}</span>
                          <p className="text-[10.5px] text-[#57534E] leading-normal font-normal">{deal.desc}</p>
                        </div>

                        <div className="pt-2.5 border-t border-stone-200/60 flex justify-between items-center text-[9.5px] text-stone-400 font-semibold">
                          <span>{deal.time}</span>
                          <span className="text-[#166534] group-hover:underline cursor-pointer flex items-center gap-0.5">Edit Deal <ArrowUpRight size={10} /></span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="h-full flex items-center justify-center p-6 border border-dashed border-stone-200 rounded-xl text-stone-400 text-xs text-center font-mono">
                      No matching leads for current filter
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 flex justify-between items-center text-[11px] text-stone-500 font-medium">
            <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-[#22C55E]" /> Database profiles update in real-time as users enter landing forms or chat webhooks.</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// 7. TESTIMONIALS (☀️ LIGHT)
export function Testimonials() {
  const { websiteName } = useBrandingStore();
  const reviews = [
    {
      text: "Switching from standard template CRM tools was an instant growth catalyst. Our sales teams responded in minutes instead of hours, completely scaling our marketing conversion metrics.",
      author: "Jessica Lin",
      role: "VP of Support, TechCorp",
      stats: "300% Higher Conversion",
      logo: "TechCorp",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d"
    },
    {
      text: "Our marketing workflows became unified in minutes. The WhatsApp Graph API integration is compliant, robust, and performs flawlessly during high-volume promo sales events.",
      author: "Marcus Aurel",
      role: "Founder, NexxDigital",
      stats: "4x Faster Response",
      logo: "NexxDigital",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d"
    }
  ];

  return (
    <section id="resources" className="py-32 px-6 bg-[#FAFAF9] text-[#12263A] relative overflow-hidden border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto space-y-20 relative z-10">
        <div className="text-center max-w-2xl mx-auto space-y-6">
          <span className="font-sans font-semibold text-[13px] uppercase tracking-[1.5px] text-[#166534] bg-white px-4 py-2 rounded-full border border-[#bbf7d0] shadow-xs inline-flex items-center gap-2">
            <Star size={14} className="fill-[#166534] text-[#166534]" />
            Success Stories
          </span>
          <h2 className="font-display font-[800] text-[36px] md:text-[48px] lg:text-[56px] leading-[1.1] tracking-[-0.03em] text-[#12263A]">
            Hear it from teams who <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#166534] to-[#22C55E]">build on {websiteName || 'Talkinexx'}</span>
          </h2>
          <p className="font-sans font-medium text-[17px] md:text-[18px] leading-[1.75] max-w-[620px] mx-auto text-[#57534E]">
            See how high-growth startups and local businesses streamline customer support, scale marketing outreach, and automate replies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          {reviews.map((r, idx) => (
            <motion.div
              key={r.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="group relative bg-white p-6 sm:p-10 md:p-12 rounded-2xl sm:rounded-[2.25rem] shadow-[0_10px_35px_rgba(18,38,58,0.04)] border border-stone-200/80 hover:shadow-[0_20px_45px_rgba(18,38,58,0.08)] hover:border-[#166534]/30 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden ring-1 ring-black/5"
            >
              <div className="relative z-10 space-y-6 flex-1">
                <div className="flex gap-1.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-[#12263A] font-display font-medium text-[19px] md:text-[21px] leading-[1.6] tracking-tight">
                  "{r.text}"
                </p>
              </div>

              <div className="relative z-10 mt-8 pt-5 border-t border-stone-100 flex flex-col xs:flex-row xs:items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <img src={r.avatar} alt={r.author} className="w-11 sm:w-13 h-11 sm:h-13 rounded-full border-2 border-white shadow-sm object-cover ring-2 ring-[#22C55E]/30 shrink-0" />
                    <span className="absolute bottom-0 right-0 w-2.5 sm:w-3 h-2.5 sm:h-3 bg-[#22C55E] border-2 border-white rounded-full" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-sm sm:text-[15px] text-[#12263A] block leading-tight truncate">{r.author}</span>
                    <span className="text-[11px] sm:text-[12px] text-stone-400 font-medium block mt-0.5 truncate">{r.role}</span>
                  </div>
                </div>
                <div className="text-left xs:text-right flex xs:flex-col items-start xs:items-end justify-between xs:justify-start gap-1 shrink-0">
                  <span className="text-[9.5px] sm:text-[10.5px] font-bold text-[#166534] bg-[#F0FDF4] border border-[#bbf7d0] px-2 sm:px-2.5 py-1 rounded-md uppercase tracking-wider shrink-0 whitespace-nowrap">{r.stats}</span>
                  <span className="text-[9.5px] sm:text-[10px] text-stone-400 font-bold block uppercase tracking-widest">{r.logo}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// 8. FINAL CTA (🌙 DARK)
export function FinalCTA() {
  return (
    <section id="contact" className="py-36 px-6 bg-[#060e17] text-white text-center relative overflow-hidden">
      {/* Mesh Grid & Radial Glow overlays */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.15),transparent_70%)] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#166534]/25 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-10 relative z-10 flex flex-col items-center">
        <span className="font-sans font-semibold text-[13px] uppercase tracking-[1.5px] text-[#22C55E] bg-[#166534]/30 px-4 py-1.5 rounded-full border border-[#22C55E]/30 flex items-center gap-1.5 backdrop-blur-md shadow-[0_0_15px_rgba(34,197,94,0.12)]">
          <Sparkles size={13} className="text-[#22C55E]" />
          Get Started Today
        </span>

        <h2 className="font-display font-[800] text-[36px] sm:text-[46px] md:text-[56px] lg:text-[64px] leading-[1.08] tracking-[-0.035em] text-white max-w-3xl">
          Ready to Transform Customer <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#22C55E] via-[#4ade80] to-[#bbf7d0]">Communication?</span>
        </h2>

        <p className="font-sans font-normal text-[17px] md:text-[19px] leading-[1.75] max-w-[620px] text-stone-300">
          Join thousands of high-growth teams who automate WhatsApp messages, nurture leads, and scale conversion pipelines automatically.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-x-8 text-[11px] sm:text-[12px] font-semibold text-stone-200 font-sans uppercase tracking-[0.5px] bg-white/[0.06] border border-white/10 px-5 sm:px-8 py-3.5 rounded-2xl sm:rounded-full backdrop-blur-md shadow-inner text-center">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-[#22C55E] shrink-0" />
            <span>Unlimited Messaging</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-[#22C55E] shrink-0" />
            <span>AI Included</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-[#22C55E] shrink-0" />
            <span>CRM Included</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-[#22C55E] shrink-0" />
            <span>No Credit Card</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 w-full">
          <NavLink
            to="/signup"
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#166534] to-[#22C55E] hover:from-[#14532d] hover:to-[#16a34a] text-white font-sans font-bold text-[15px] tracking-[0.2px] rounded-xl transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_10px_30px_rgba(34,197,94,0.35)] active:scale-[0.98] text-center shadow-lg cursor-pointer"
          >
            Start Free Trial
          </NavLink>
          <NavLink
            to="/contact"
            className="w-full sm:w-auto px-8 py-4 bg-white/[0.07] hover:bg-white/[0.12] border border-white/15 hover:border-white/30 text-white font-sans font-semibold text-[15px] tracking-[0.2px] rounded-xl transition-all duration-200 backdrop-blur-sm active:scale-[0.98] text-center shadow-sm cursor-pointer"
          >
            Book Demo
          </NavLink>
        </div>
      </div>
    </section>
  );
}

// ==========================================
// STATISTICS COUNTER PANEL
// ==========================================
export function Statistics() {
  const stats = [
    { value: '99.9%', label: 'Platform Uptime', sub: 'Enterprise SLA' },
    { value: '< 250ms', label: 'Message Latency', sub: 'High Throughput' },
    { value: 'Official', label: 'Meta Cloud API', sub: 'Verified Partner' },
    { value: '150+', label: 'Countries Supported', sub: 'Global Routing' },
    { value: '24/7', label: 'Automation & Support', sub: 'Zero Downtime' }
  ];

  return (
    <section className="py-20 px-6 bg-[#0a1826] border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {stats.map((s, idx) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="text-center space-y-2 border-r border-white/10 last:border-0"
            >
              <span className="block text-3xl md:text-4xl font-extrabold text-white tracking-tight">{s.value}</span>
              <span className="block text-[11px] font-black text-[#22C55E] uppercase tracking-wider">{s.label}</span>
              <span className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest">{s.sub}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ==========================================
// 8 FEATURES SECTION WITH GLASS CARDS
// ==========================================
export function Features() {
  const allFeatures = [
    {
      icon: Send,
      title: 'Targeted WhatsApp Campaigns',
      desc: 'Send personalized messages based on customer segments (Offers - Reminders - Follow-ups - New Services) while tracking performance in real-time.',
      bullets: ['Segmented broadcasts', 'Interactive reply headers', 'Live delivery tracking'],
      color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      route: '/services/whatsapp-campaigns'
    },
    {
      icon: Database,
      title: 'Data Upload & Retargeting',
      desc: 'Re-engage your existing customer database with effective campaigns designed to boost bookings and conversions.',
      bullets: ['Excel & CSV imports', 'Database list retargeting', 'Advanced booking triggers'],
      color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      route: '/services/retargeting'
    },
    {
      icon: Clock,
      title: 'Automated Messaging',
      desc: 'Automate birthday greetings and service reminders (e.g., Filler touch-ups) at the perfect time to enhance customer loyalty.',
      bullets: ['Birthday wish triggers', 'Service follow-up alerts', 'Customer loyalty engine'],
      color: 'bg-[#166534]/20 text-[#86efac] border-[#22C55E]/30',
      route: '/services/automation'
    },
    {
      icon: Globe,
      title: 'Social Media Planner',
      desc: 'Schedule and publish content, monitor comments, and measure engagement across all platforms from a single dashboard.',
      bullets: ['Cross-channel scheduler', 'Comments monitoring feed', 'Unified engagement metrics'],
      color: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      route: '/services/social-media'
    },
    {
      icon: Users,
      title: 'Lead Form CRM Integration',
      desc: 'Automatically capture lead data from your campaigns on Facebook, Instagram, TikTok, and Snapchat to maximize deals.',
      bullets: ['FB & IG lead forms sync', 'TikTok & Snapchat webhooks', 'Automatic contact assignment'],
      color: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      route: '/services/lead-forms'
    },
    {
      icon: Sparkles,
      title: 'AI-Powered Automated Response',
      desc: 'Provide fast, professional, and consistent responses to chat inquiries and Google Reviews using our integrated AI.',
      bullets: ['Chat assistant replies', 'Google reviews automation', '24/7 intelligent answering'],
      color: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      route: '/services/ai-responses'
    },
    {
      icon: FileText,
      title: 'Page & Form Builder',
      desc: 'Create sleek landing pages, micro-websites, and surveys that link directly to your CRM without writing any code.',
      bullets: ['Sleek drag-drop builder', 'CRM linked custom surveys', 'Fast micro-websites templates'],
      color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      route: '/services/page-builder'
    },
    {
      icon: BarChart3,
      title: 'Media Storage & Advanced Reporting',
      desc: 'Securely store your media assets and access detailed performance reports for both your ads and team to make data-driven decisions.',
      bullets: ['Secure assets storage drive', 'Ads analytics reports', 'Team performance monitoring'],
      color: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
      route: '/services/media-storage'
    }
  ];

  return (
    <section id="features" className="py-32 px-6 bg-[#0a1826] text-white border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24 max-w-xl mx-auto space-y-4">
          <span className="font-sans font-semibold text-[13px] uppercase tracking-[1.5px] text-[#22C55E] bg-[#166534]/30 px-4 py-1.5 rounded-full border border-[#22C55E]/30">Capabilities</span>
          <h2 className="font-display font-[800] text-[32px] md:text-[40px] lg:text-[48px] leading-[1.15] tracking-[-1px] text-white">Everything you need to automate & engage</h2>
          <p className="font-sans font-normal text-[17px] leading-[1.8] max-w-[620px] text-stone-300">Ditch multiple subscription services. Manage your marketing campaigns, workflows, messaging pipelines, and customer support from one interface.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {allFeatures.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.05 }}
              className="p-8 bg-[#0e1f30] border border-white/10 rounded-3xl shadow-lg hover:border-[#22C55E]/40 hover:-translate-y-2 transition-all group flex flex-col justify-between relative overflow-hidden"
            >
              <div>
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center border transition-colors mb-6", f.color)}>
                  <f.icon size={22} strokeWidth={2.5} />
                </div>
                <h3 className="text-lg font-bold text-white mb-3 tracking-tight">{f.title}</h3>
                <p className="text-stone-300 font-medium text-xs leading-relaxed mb-6">{f.desc}</p>

                <ul className="space-y-2 mb-6">
                  {f.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2 text-[10.5px] font-semibold text-stone-400">
                      <CheckCircle2 size={12} className="text-[#22C55E]" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-4 border-t border-white/10">
                <NavLink to={f.route} className="inline-flex items-center gap-1.5 text-xs font-black text-[#86efac] hover:text-white transition-colors uppercase tracking-wider leading-none">
                  Learn More <ArrowRight size={12} />
                </NavLink>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ==========================================
// MARKETING AUTOMATION PIPELINE VISUALIZER
// ==========================================
export function MarketingAutomation() {
  const pipeline = [
    { label: 'Lead Generated', desc: 'Auto-sync from landing page forms.' },
    { label: 'Welcome Message', desc: 'Sends immediate text coupon code.' },
    { label: 'Reminder Out', desc: 'Fires WhatsApp notice after 2 hours.' },
    { label: 'Agent Handover', desc: 'Dispatches query to unified inbox.' },
    { label: 'Review Request', desc: 'Prompts review flow 1 day post-buy.' },
    { label: 'Repeat Purchase', desc: 'Enters loyalty retargeting campaign.' }
  ];

  return (
    <section className="py-32 px-6 bg-[#0a1826] text-white border-b border-white/[0.08] overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-20">
        <div className="text-center max-w-xl mx-auto space-y-4">
          <span className="font-sans font-semibold text-[13px] uppercase tracking-[1.5px] text-[#22C55E] bg-[#166534]/30 px-4 py-1.5 rounded-full border border-[#22C55E]/30">Automation Flow</span>
          <h2 className="font-display font-[800] text-[32px] md:text-[40px] lg:text-[48px] leading-[1.15] tracking-[-1px] text-white">Advanced marketing workflow mapping</h2>
          <p className="font-sans font-normal text-[17px] leading-[1.8] max-w-[620px] text-stone-300">Visually model how users engage with your brand touchpoints. Create custom wait delays, filter conditions, message blocks, and alerts.</p>
        </div>

        <div className="relative flex flex-col md:flex-row gap-6 justify-between items-center">
          <div className="hidden md:block absolute top-[44px] left-[5%] right-[5%] h-0.5 bg-white/10 -z-10" />

          {pipeline.map((item, idx) => (
            <div key={item.label} className="w-full md:w-44 bg-[#0d1d2e] border border-white/10 p-6 rounded-3xl text-left relative hover:border-[#22C55E]/40 transition-colors">
              <div className="w-8 h-8 rounded-xl bg-[#166534] text-white flex items-center justify-center text-xs font-black mb-4">
                {idx + 1}
              </div>
              <h3 className="text-xs font-extrabold text-white mb-1 tracking-tight">{item.label}</h3>
              <p className="text-[10px] text-stone-400 leading-relaxed font-semibold">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ==========================================
// ANALYTICS SECTION WITH NATIVE ANIMATED CHART
// ==========================================
export function AnalyticsDashboard() {
  return (
    <section id="integrations" className="py-32 px-6 bg-[#0b1827] text-white overflow-hidden relative border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        <div className="lg:col-span-5 space-y-8 text-left">
          <span className="font-sans font-semibold text-[13px] uppercase tracking-[1.5px] text-[#22C55E] bg-[#166534]/30 px-4 py-1.5 rounded-full border border-[#22C55E]/30">Unified Metrics</span>
          <h2 className="font-display font-[800] text-[32px] md:text-[40px] lg:text-[48px] leading-[1.15] tracking-[-1px] text-white">Campaign analytics with pixel-perfect accuracy</h2>
          <p className="font-sans font-normal text-[17px] leading-[1.8] max-w-[620px] text-stone-300">Monitor conversion rates, sales pipelines, message volume, and support resolution metrics. Our real-time data visualizer tracks agent response speeds and total return-on-investment automatically.</p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded bg-emerald-500/20 flex items-center justify-center"><CheckCircle2 size={12} className="text-emerald-400" /></div>
              <span className="text-xs font-bold text-stone-200">Exportable custom PDF reports</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded bg-emerald-500/20 flex items-center justify-center"><CheckCircle2 size={12} className="text-emerald-400" /></div>
              <span className="text-xs font-bold text-stone-200">Daily summaries delivered via Slack/Email</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 w-full">
          <div className="w-full bg-[#0d1d2e] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl space-y-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">Workspace report</span>
                <h3 className="text-sm font-extrabold text-white">Monthly Conversation Volume</h3>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-emerald-400 flex items-center gap-1 justify-end">
                  <TrendingUp size={12} /> +24%
                </span>
                <span className="text-[9px] text-stone-400 font-bold block mt-0.5">Vs Last Quarter</span>
              </div>
            </div>

            <div className="w-full aspect-[2/1] relative">
              <svg className="w-full h-full" viewBox="0 0 600 300">
                <line x1="50" y1="50" x2="550" y2="50" stroke="rgba(255,255,255,0.05)" />
                <line x1="50" y1="125" x2="550" y2="125" stroke="rgba(255,255,255,0.05)" />
                <line x1="50" y1="200" x2="550" y2="200" stroke="rgba(255,255,255,0.05)" />
                <line x1="50" y1="250" x2="550" y2="250" stroke="rgba(255,255,255,0.08)" />

                <path
                  d="M50,220 C120,180 180,120 250,140 C320,160 380,80 450,100 C520,120 530,60 550,50"
                  fill="none"
                  stroke="url(#chartGradient)"
                  strokeWidth="4"
                  strokeLinecap="round"
                />

                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#166534" />
                    <stop offset="50%" stopColor="#22C55E" />
                    <stop offset="100%" stopColor="#86efac" />
                  </linearGradient>
                </defs>

                <circle cx="250" cy="140" r="5" fill="#22C55E" stroke="#ffffff" strokeWidth="2" />
                <circle cx="450" cy="100" r="5" fill="#86efac" stroke="#ffffff" strokeWidth="2" />

                <text x="50" y="275" fill="#94a3b8" fontSize="10" fontWeight="bold">Jan</text>
                <text x="150" y="275" fill="#94a3b8" fontSize="10" fontWeight="bold">Feb</text>
                <text x="250" y="275" fill="#94a3b8" fontSize="10" fontWeight="bold">Mar</text>
                <text x="350" y="275" fill="#94a3b8" fontSize="10" fontWeight="bold">Apr</text>
                <text x="450" y="275" fill="#94a3b8" fontSize="10" fontWeight="bold">May</text>
                <text x="550" y="275" fill="#94a3b8" fontSize="10" fontWeight="bold">Jun</text>
              </svg>
            </div>

            <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
              <div>
                <span className="text-[9px] text-stone-400 font-bold block uppercase mb-1">Delivered</span>
                <span className="text-sm font-extrabold text-white">99.8%</span>
              </div>
              <div>
                <span className="text-[9px] text-stone-400 font-bold block uppercase mb-1">Click Rate</span>
                <span className="text-sm font-extrabold text-white">18.4%</span>
              </div>
              <div>
                <span className="text-[9px] text-stone-400 font-bold block uppercase mb-1">Total ROI</span>
                <span className="text-sm font-extrabold text-emerald-400">4.2x</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ==========================================
// INTEGRATIONS GRID SECTION
// ==========================================
export function IntegrationsGrid() {
  const integrations = [
    { name: 'WhatsApp', icon: MessageCircle, category: 'Official API', desc: 'Connect Meta WhatsApp Business account templates directly.' },
    { name: 'HubSpot', icon: Inbox, category: 'CRM Sync', desc: 'Direct two-way profile synchronization and deal progression mapping.' },
    { name: 'OpenAI', icon: Sparkles, category: 'AI Models', desc: 'Deploy automated response models using business intelligence bases.' },
    { name: 'Salesforce', icon: Briefcase, category: 'Enterprise CRM', desc: 'Sync high-volume deal pipelines with central account databases.' },
    { name: 'Slack', icon: Send, category: 'Team Chat', desc: 'Ping sales groups instantly when qualified leads submit forms.' },
    { name: 'Zapier', icon: Zap, category: 'Web Automate', desc: 'Create messaging integrations matching 5,000+ external apps.' }
  ];

  return (
    <section className="py-32 px-6 bg-[#0a1826] text-white border-t border-white/[0.08]">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="text-center max-w-xl mx-auto space-y-4">
          <span className="font-sans font-semibold text-[13px] uppercase tracking-[1.5px] text-[#22C55E] bg-[#166534]/30 px-4 py-1.5 rounded-full border border-[#22C55E]/30">Connectivity</span>
          <h2 className="font-display font-[800] text-[32px] md:text-[40px] lg:text-[48px] leading-[1.15] tracking-[-1px] text-white">Connected Integrations Ecosystem</h2>
          <p className="font-sans font-normal text-[17px] leading-[1.8] max-w-[620px] text-stone-300">Sync contact fields, events, tags, pipelines, and trigger workflows instantly using secure REST endpoints and native webhooks.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {integrations.map((int) => (
            <div key={int.name} className="p-8 bg-[#0d1d2e] border border-white/10 rounded-3xl hover:border-[#22C55E]/40 transition-colors flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-10 h-10 bg-[#166534]/30 border border-[#22C55E]/30 text-[#22C55E] rounded-xl flex items-center justify-center shrink-0">
                  <int.icon size={18} strokeWidth={2.5} />
                </div>
                <h3 className="text-base font-bold text-white block tracking-tight">{int.name}</h3>
                <p className="text-stone-300 font-medium text-xs leading-relaxed">{int.desc}</p>
              </div>
              <div className="pt-4 mt-6 border-t border-white/10 text-[9px] font-black uppercase text-stone-400 tracking-wider">
                Category: {int.category}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ==========================================
// PRICING SECTION WITH BILLING TOGGLE
// ==========================================
export function Pricing() {
  const [plans, setPlans] = useState<any[]>([]);
  const [isYearly, setIsYearly] = useState(false);

  useEffect(() => {
    async function loadPlans() {
      try {
        const res = await crmApi.getPublicPlans();
        if (res.success) {
          setPlans(res.plans || []);
        }
      } catch (err) {
        console.error('Failed to retrieve plans', err);
      }
    }
    loadPlans();
  }, []);

  const defaultPlans = [
    {
      name: 'Starter',
      price: 0,
      desc: 'Perfect for small businesses starting out.',
      features: ['1 WhatsApp Number', '100 AI Auto-Replies / mo', 'Basic WhatsApp Broadcasts', 'Standard Team Inbox'],
      highlighted: false,
      key: 'free'
    },
    {
      name: 'Business',
      price: 49,
      desc: 'For high-growth teams scaling their reach.',
      features: ['Official WhatsApp API', 'Unlimited AI Copilot Replies', 'Advanced Sequence Flows', 'Full CRM & Store Sync'],
      highlighted: true,
      key: 'pro'
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      desc: 'Custom workflows and dedicated support.',
      features: ['Unlimited WhatsApp Numbers', 'Meta Green Tick Assistance', 'Custom Interactive Flows', 'Dedicated Success Manager'],
      highlighted: false,
      key: 'enterprise'
    }
  ];

  const displayPlans = plans.length > 0 ? plans.map(p => {
    let rawPrice = p.price.toLowerCase().includes('/month')
      ? p.price.replace(/\/month/i, '')
      : p.price.toLowerCase().includes('custom')
        ? 'Custom'
        : p.price;

    let numericPrice = parseFloat(rawPrice.replace(/[^0-9.]/g, ''));
    if (isNaN(numericPrice)) {
      numericPrice = rawPrice;
    }

    return {
      name: p.name,
      desc: p.key === 'pro' ? 'For high-growth teams scaling their reach.' : p.key === 'enterprise' ? 'Custom workflows and dedicated support.' : 'Perfect for small businesses starting out.',
      price: numericPrice,
      features: [
        `${p.limits.contacts} Contacts Ceiling`,
        `${p.limits.messages} Broadcasts Capacity`,
        p.limits.campaigns.toLowerCase() !== 'disabled' ? 'Advanced Automation Flows' : 'Manual Campaigns Only',
        p.limits.ai_replies.toLowerCase() !== 'disabled' ? `AI replies: ${p.limits.ai_replies}` : 'No AI Copilot Replies',
        'Official WhatsApp API Integration'
      ],
      highlighted: p.key === 'pro',
      key: p.key
    };
  }) : defaultPlans;

  const getPriceLabel = (p: any) => {
    if (p.price === 'Custom') return 'Custom';
    const numPrice = typeof p.price === 'string' ? parseFloat(p.price) : p.price;
    const finalPrice = isYearly ? Math.floor(numPrice * 0.8) : numPrice;
    return `$${finalPrice}`;
  };

  return (
    <section id="pricing" className="py-32 px-6 bg-[#FAFAF9] text-[#12263A] relative overflow-hidden border-t border-stone-200">
      <div className="absolute inset-0 bg-[radial-gradient(#166534_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 max-w-2xl mx-auto space-y-4">
          <span className="font-sans font-semibold text-[13px] uppercase tracking-[1.5px] text-[#166534] bg-[#F0FDF4] px-4 py-1.5 rounded-full border border-[#22C55E]/30 inline-flex items-center gap-2 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
            Pricing Plans
          </span>
          <h2 className="font-display font-[800] text-[32px] md:text-[40px] lg:text-[48px] leading-[1.15] tracking-[-1px] text-[#12263A]">Scale your WhatsApp operations</h2>
          <p className="font-sans font-normal text-[17px] leading-[1.8] text-stone-600">Choose a plan that fits your business scale. Unlock unlimited contacts, advanced AI auto-replies, and seamless CRM integrations.</p>
        </div>

        <div className="flex items-center justify-center gap-4 mb-20">
          <span className={cn("text-xs font-black uppercase tracking-wider", !isYearly ? "text-[#12263A]" : "text-stone-400")}>Monthly Billing</span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className="w-14 h-7 bg-stone-200/80 border border-stone-300 rounded-full p-1 transition-all duration-300 relative focus:outline-none cursor-pointer"
          >
            <div className={cn("w-5 h-5 bg-[#166534] rounded-full transition-all duration-300 shadow-sm", isYearly ? "translate-x-7" : "translate-x-0")} />
          </button>
          <div className="flex items-center gap-2">
            <span className={cn("text-xs font-black uppercase tracking-wider", isYearly ? "text-[#12263A]" : "text-stone-400")}>Yearly Billing</span>
            <span className="text-[9px] font-black uppercase tracking-widest bg-[#F0FDF4] text-[#166534] px-2.5 py-1 rounded-md border border-[#22C55E]/30 font-bold">Save 20%</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-6xl mx-auto">
          {displayPlans.map((plan) => (
            <div key={plan.name} className={cn(
              "p-10 rounded-[2.5rem] flex flex-col transition-all duration-500 relative group overflow-hidden",
              plan.highlighted
                ? "bg-[#0a1826] text-white border-2 border-[#22C55E] shadow-[0_25px_60px_rgba(18,38,58,0.25)] md:-translate-y-4 z-10"
                : "bg-white text-[#12263A] border border-stone-200/90 shadow-sm hover:border-[#22C55E]/50 hover:shadow-xl hover:-translate-y-2"
            )}>
              {plan.highlighted && (
                <div className="absolute top-6 right-6 bg-[#166534]/50 text-[#86efac] border border-[#22C55E]/40 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                  <Sparkles size={12} className="text-[#22C55E]" /> Most Popular
                </div>
              )}

              <h3 className={cn("text-sm font-black uppercase tracking-[0.2em] mb-2", plan.highlighted ? "text-[#86efac]" : "text-stone-500")}>{plan.name}</h3>
              <p className={cn("text-xs font-medium mb-6 min-h-[32px]", plan.highlighted ? "text-stone-300" : "text-stone-600")}>{plan.desc}</p>

              <div className="flex items-baseline gap-2 mb-2">
                <span className={cn("text-5xl font-black tracking-tight", plan.highlighted ? "text-white" : "text-[#12263A]")}>{getPriceLabel(plan)}</span>
                {plan.price !== 'Custom' && <span className={cn("text-sm font-medium", plan.highlighted ? "text-stone-400" : "text-stone-500")}>/mo</span>}
              </div>

              <div className="h-6 mb-8">
                {isYearly && plan.price !== 'Custom' && (
                  <span className={cn(
                    "block text-[10.5px] font-bold uppercase tracking-wider w-fit px-2.5 py-1 rounded-md border",
                    plan.highlighted
                      ? "bg-[#166534]/40 text-[#86efac] border-[#22C55E]/30"
                      : "bg-[#F0FDF4] text-[#166534] border-[#22C55E]/30"
                  )}>Billed annually</span>
                )}
              </div>

              <div className="flex-1 space-y-4 mb-10">
                {plan.features.map((f: string) => (
                  <div key={f} className={cn("flex items-start gap-3 text-sm font-medium", plan.highlighted ? "text-stone-200" : "text-stone-700")}>
                    <CheckCircle2 size={18} className="shrink-0 mt-0.5 text-[#22C55E]" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              <NavLink
                to={`/signup?plan=${plan.key}`}
                className={cn(
                  "w-full py-4 rounded-xl font-bold text-[13px] uppercase tracking-widest transition-all active:scale-95 cursor-pointer text-center block relative overflow-hidden shadow-sm",
                  plan.highlighted
                    ? "bg-gradient-to-r from-[#166534] to-[#22C55E] text-white hover:from-[#14532d] hover:to-[#16a34a] shadow-lg shadow-[#166534]/30"
                    : "bg-[#0a1826] text-white hover:bg-[#166534] hover:shadow-md"
                )}
              >
                <span className="relative z-10">Get Started</span>
              </NavLink>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ==========================================
// FAQ ACCORDION SECTION
// ==========================================
export function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "How do I connect my WhatsApp number to the AI automation platform?",
      a: "We use Meta's official WhatsApp Business Cloud API. You simply verify your business and link your phone number ID. It's 100% secure, fully compliant, and ensures maximum message delivery rates."
    },
    {
      q: "Can the AI copilot handle customer support and bookings simultaneously?",
      a: "Yes! Our AI is trained to understand context. It can answer FAQs, route complex queries to your human agents, and instantly trigger WhatsApp booking flows right inside the chat."
    },
    {
      q: "Is there a limit to how many WhatsApp broadcast messages I can send?",
      a: "Broadcast limits are determined by your Meta API tier (starting at 1,000 to 100K+ messages/day). Our platform seamlessly supports high-volume broadcasts for your marketing campaigns without throttling."
    },
    {
      q: "Can I integrate my existing CRM with your WhatsApp automation?",
      a: "Absolutely. We offer native integrations for HubSpot, Salesforce, and custom webhooks. Whenever a lead interacts with your WhatsApp bot, their profile and chat history automatically sync to your CRM."
    },
    {
      q: "Will my WhatsApp account get banned for using automation?",
      a: "No. Because we use the official Meta Cloud API, you are fully compliant with WhatsApp's terms of service. You will not risk being banned, unlike unofficial web scraping tools."
    }
  ];

  return (
    <section className="py-32 px-6 bg-[#091522] text-white relative overflow-hidden border-t border-white/[0.08]">
      <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        <div className="lg:col-span-5 space-y-8 sticky top-24">
          <div className="space-y-4">
            <span className="font-sans font-semibold text-[13px] uppercase tracking-[1.5px] text-[#22C55E] bg-[#166534]/30 px-4 py-2 rounded-full border border-[#22C55E]/30 inline-flex items-center gap-2">
              <HelpCircle size={14} className="text-[#22C55E]" />
              Support Center
            </span>
            <h2 className="font-display font-[800] text-[36px] md:text-[44px] leading-[1.1] tracking-[-1px] text-white">
              Got questions about <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22C55E] via-[#4ade80] to-[#bbf7d0]">WhatsApp AI?</span>
            </h2>
            <p className="font-sans font-medium text-[18px] leading-[1.7] text-stone-300">
              Everything you need to know about setting up your WhatsApp Business API, automation limits, compliance, and CRM integrations.
            </p>
          </div>

          <div className="p-6 bg-[#0e1f30] border border-white/10 rounded-2xl shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#166534]/30 border border-[#22C55E]/30 flex items-center justify-center shrink-0">
              <MessageCircle size={24} className="text-[#22C55E]" />
            </div>
            <div>
              <h4 className="font-bold text-white mb-1">Still have questions?</h4>
              <p className="text-sm text-stone-300 mb-3">Our WhatsApp automation experts are ready to help you build the perfect workflow.</p>
              <NavLink to="/contact" className="text-sm font-bold text-[#86efac] hover:text-white flex items-center gap-1.5 transition-colors">
                Chat with our team <ArrowRight size={14} />
              </NavLink>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className={cn(
                  "border rounded-2xl overflow-hidden transition-all duration-300",
                  isOpen
                    ? "bg-[#0e2133] border-[#22C55E]/40 shadow-xl"
                    : "bg-[#0d1d2e]/80 border-white/10 hover:border-white/20"
                )}
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-6 text-left flex items-start justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <div className="flex gap-4">
                    <span className={cn(
                      "font-mono text-xs font-bold mt-1 shrink-0",
                      isOpen ? "text-[#22C55E]" : "text-stone-400"
                    )}>
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className={cn(
                      "font-bold text-[15px] md:text-[17px] leading-snug transition-colors",
                      isOpen ? "text-white" : "text-stone-200"
                    )}>
                      {faq.q}
                    </span>
                  </div>
                  <div className={cn(
                    "shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                    isOpen ? "bg-[#166534] text-white" : "bg-white/5 text-stone-400"
                  )}>
                    {isOpen ? <Minus size={16} strokeWidth={2.5} /> : <Plus size={16} strokeWidth={2.5} />}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 pl-[52px] text-[14px] md:text-[15px] font-medium text-stone-300 leading-relaxed">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
