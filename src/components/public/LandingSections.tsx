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
  Phone
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
  <svg className="h-6 opacity-40 hover:opacity-100 hover:text-slate-900 transition-all duration-300 fill-current" viewBox="0 0 34 22" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 10h4v11h4V10h4V6H9V1H5v5H1v4zm15-4v15h16v-4h-11v-2h8v-3h-8v-2h11V6H16z" />
  </svg>
);

const StripeLogo = () => (
  <svg className="h-6 opacity-40 hover:opacity-100 hover:text-[#635BFF] transition-all duration-300 fill-current" viewBox="0 0 80 34" xmlns="http://www.w3.org/2000/svg">
    <path d="M41.4 12.3c0-3.3 2.5-4.4 6.7-4.4 3.7 0 7.3.9 10.3 2.5V3.1C55.4 1.7 51.5 1 47.9 1 34.6 1 27.6 8.1 27.6 19c0 9.8 6.7 14.1 16.5 14.1 4 0 7.8-.7 10.7-2.1v-7.3c-2.9 1.5-6.3 2.1-9.4 2.1-5.1 0-7-2-7-6.8h23.2v-1.7H41.4zm0-5c0-1.8 1.2-2.8 3.3-2.8 2.2 0 3.3 1 3.3 2.8H41.4zM24.8 9.5c0-.8-.7-1.4-1.5-1.4h-5.5V1h-9.3v7.1H3c-.8 0-1.4.6-1.4 1.4v6.8c0 .8.6 1.4 1.4 1.4h5.5v15.7h9.3V17.7h5.5c.8 0 1.4-.6 1.4-1.4V9.5z" />
  </svg>
);

const LinearLogo = () => (
  <svg className="h-6 opacity-40 hover:opacity-100 hover:text-white transition-all duration-300 fill-current" viewBox="0 0 100 24" xmlns="http://www.w3.org/2000/svg">
    <text x="0" y="18" className="font-sans font-black tracking-wider text-lg">LINEAR</text>
  </svg>
);

const HubSpotLogo = () => (
  <svg className="h-6 opacity-40 hover:opacity-100 hover:text-[#FF7A59] transition-all duration-300 fill-current" viewBox="0 0 100 28" xmlns="http://www.w3.org/2000/svg">
    <text x="0" y="20" className="font-sans font-black tracking-wider text-lg">HUBSPOT</text>
  </svg>
);

const VercelLogo = () => (
  <svg className="h-5 opacity-40 hover:opacity-100 hover:text-white transition-all duration-300 fill-current" viewBox="0 0 116 26" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.2 2L24.4 23H0L12.2 2z" />
    <text x="32" y="20" className="font-sans font-black tracking-wider text-base">VERCEL</text>
  </svg>
);

const NotionLogo = () => (
  <svg className="h-6 opacity-40 hover:opacity-100 hover:text-slate-900 transition-all duration-300 fill-current" viewBox="0 0 100 24" xmlns="http://www.w3.org/2000/svg">
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

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    const userMsg = inputValue.trim();
    setInputValue("");

    // Add user message
    setMessages(prev => [...prev, { id: Date.now(), text: userMsg, isUser: true }]);
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false);
      const lowerInput = userMsg.toLowerCase();
      let responseText = "Understood! I've updated your preferences. You'll receive automated updates directly through WhatsApp.";

      if (lowerInput.includes('pricing') || lowerInput.includes('cost')) {
        responseText = "Our plans start with full WhatsApp Cloud API access and unlimited contacts. Would you like a link to our plan details?";
      } else if (lowerInput.includes('calendar') || lowerInput.includes('yes') || lowerInput.includes('invite')) {
        responseText = "Awesome! The calendar invite has been sent to your email. See you tomorrow at 3:00 PM! 📅";
      } else if (lowerInput.includes('help') || lowerInput.includes('support')) {
        responseText = "I'm here to help! Our team is available 24/7 if you need human assistance as well.";
      } else if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
        responseText = "Hello there! 👋 How can I help you today?";
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, text: responseText, isUser: false }]);
    }, 1100);
  };

  return (
    <div className="w-full max-w-[360px] bg-[#0b141a] border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col h-[480px] relative group transition-all hover:shadow-indigo-500/10">
      {/* WhatsApp Header Mockup */}
      <div className="bg-[#202c33] px-4 py-3 flex items-center gap-3 border-b border-white/5 relative z-10 shadow-sm">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center p-0.5 shadow-lg shadow-indigo-500/20">
          <div className="w-full h-full bg-[#202c33] rounded-full flex items-center justify-center">
            <Bot size={22} className="text-[#22C55E]" />
          </div>
        </div>
        <div>
          <h4 className="text-slate-100 font-semibold text-[15px] leading-tight flex items-center gap-1.5">
            AI Copilot Agent <CheckCircle2 size={12} className="text-[#22C55E]" />
          </h4>
          <span className="text-emerald-500 text-[11px] font-medium flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Always Active
          </span>
        </div>
      </div>

      {/* Chat Background (Subtle Texture) */}
      <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CiAgPHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPgogIDxwYXRoIGQ9Ik0wIDEwaDQwdjJIMHptMCAyMGg0MHYySDB6IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjEiLz4KPC9zdmc+')] pointer-events-none" />

      {/* Messages Area */}
      <div ref={scrollContainerRef} className="flex-1 p-4 flex flex-col gap-3 overflow-y-auto z-10 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "max-w-[85%] rounded-[1.25rem] p-3 text-[13.5px] leading-[1.45] relative shadow-md backdrop-blur-md",
                msg.isUser
                  ? "bg-[#005c4b] text-white self-end rounded-tr-sm"
                  : "bg-[#202c33] text-slate-100 self-start rounded-tl-sm border border-white/5"
              )}
            >
              {!msg.isUser && (
                <Sparkles size={12} className="absolute -top-1.5 -left-1.5 text-[#22C55E]" />
              )}
              <div className="whitespace-pre-wrap">{msg.text}</div>
              <div className="text-[10px] text-white/50 text-right mt-1.5 flex justify-end items-center gap-1">
                <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                {msg.isUser && <CheckCircle2 size={12} className="text-[#53bdeb]" />}
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
              className="bg-[#202c33] text-white self-start rounded-[1.25rem] rounded-tl-sm p-3.5 border border-white/5 flex gap-1.5 w-16 shadow-md"
            >
              <motion.div className="w-1.5 h-1.5 bg-slate-400 rounded-full" animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} />
              <motion.div className="w-1.5 h-1.5 bg-slate-400 rounded-full" animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} />
              <motion.div className="w-1.5 h-1.5 bg-slate-400 rounded-full" animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Interactive Input Area */}
      <form onSubmit={handleSend} className="bg-[#202c33] px-3 py-3 flex items-center gap-2 border-t border-white/5 z-10">
        <div className="w-8 h-8 rounded-full text-slate-400 flex items-center justify-center hover:bg-white/5 cursor-pointer transition-colors shrink-0">
          <Plus size={20} />
        </div>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Message AI Copilot..."
          className="flex-1 bg-[#2a3942] focus:bg-[#344651] transition-colors rounded-full h-10 px-4 text-slate-200 text-[13.5px] border border-white/5 outline-none placeholder:text-slate-400"
        />
        <button
          type="submit"
          disabled={!inputValue.trim() || isTyping}
          className="w-10 h-10 rounded-full bg-[#166534] disabled:bg-[#166534]/50 text-white flex items-center justify-center shadow-lg hover:bg-[#F0FDF4]0 transition-colors shrink-0 disabled:cursor-not-allowed"
        >
          <Send size={16} className="ml-0.5" />
        </button>
      </form>
    </div>
  );
};

export function Hero() {
  return (
    <section className="relative min-h-[90vh] pt-40 pb-24 px-6 overflow-hidden bg-[#12263A] text-white flex items-center">
      {/* Background Animated Tech Mesh & Gradients */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#166534]/25 rounded-full blur-[120px] pointer-events-none z-0 mix-blend-screen" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#22C55E]/15 rounded-full blur-[120px] pointer-events-none z-0 mix-blend-screen" />

      {/* Floating Automation Icons (Background) */}
      <motion.div
        animate={{ y: [-15, 15, -15], rotate: [0, 5, -5, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        className="absolute top-[20%] left-[10%] opacity-20 hidden lg:block"
      >
        <MessageCircle size={48} className="text-[#22C55E]" />
      </motion.div>
      <motion.div
        animate={{ y: [15, -15, 15], rotate: [0, -10, 10, 0] }}
        transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
        className="absolute bottom-[20%] right-[8%] opacity-20 hidden lg:block"
      >
        <Zap size={56} className="text-[#166534]" />
      </motion.div>
      <motion.div
        animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.1, 0.3, 0.1] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="absolute top-[30%] right-[15%] hidden lg:block"
      >
        <Bot size={40} className="text-[#22C55E]" />
      </motion.div>

      <div className="max-w-7xl mx-auto relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

        {/* Left Content Column */}
        <div className="space-y-8 flex flex-col items-center lg:items-start text-center lg:text-left z-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#166534]/30 border border-[#22C55E]/30 rounded-full shadow-lg shadow-[#166534]/10 backdrop-blur-md"
          >
            <Sparkles size={14} className="text-[#22C55E]" />
            <span className="font-sans font-medium text-[13px] tracking-wide text-[#F0FDF4]">Modern Conversational CRM & Marketing</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display font-[800] text-[44px] sm:text-[54px] md:text-[64px] lg:text-[72px] leading-[1.05] tracking-[-2.5px] text-white max-w-2xl"
          >
            Turn WhatsApp & Email Into Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#22C55E] to-[#166534]">Highest-ROI</span> Channels
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-sans font-normal text-[18px] md:text-[20px] leading-[1.7] max-w-[580px] text-stone-300"
          >
            Launch targeted broadcast campaigns, automate customer journeys, and resolve customer inquiries faster with an all-in-one conversational CRM.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2 w-full max-w-md lg:max-w-none"
          >
            <NavLink
              to="/signup"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#166534] to-[#22C55E] text-white font-sans font-bold text-[16px] tracking-[0.3px] rounded-xl transition-all hover:scale-[1.03] hover:shadow-[0_8px_30px_rgba(34,197,94,0.3)] active:scale-97 text-center shadow-lg flex items-center justify-center gap-2"
            >
              Start Free Trial <ArrowRight size={18} />
            </NavLink>
            <NavLink
              to="/contact"
              className="w-full sm:w-auto px-8 py-4 bg-white/10 border border-white/20 text-white font-sans font-semibold text-[16px] tracking-[0.3px] rounded-xl transition-all hover:bg-white/20 hover:text-white active:scale-95 text-center shadow-sm flex items-center justify-center gap-2"
            >
              <Bot size={18} className="text-[#22C55E]" /> See AI Demo
            </NavLink>
          </motion.div>

          {/* Trust Badges Checklist */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="pt-6 mt-4 border-t border-white/10 flex flex-wrap items-center justify-center lg:justify-start gap-y-3 gap-x-6 text-[11px] font-bold text-stone-400 uppercase tracking-widest"
          >
            <span className="flex items-center gap-1.5 text-stone-300"><CheckCircle2 size={14} className="text-[#22C55E]" /> Official WhatsApp API</span>
            <span className="flex items-center gap-1.5 text-stone-300"><CheckCircle2 size={14} className="text-[#22C55E]" /> Advanced AI Routing</span>
            <span className="flex items-center gap-1.5 text-stone-300"><CheckCircle2 size={14} className="text-[#22C55E]" /> 24/7 Autopilot</span>
          </motion.div>
        </div>

        {/* Right Content Column - AI Chat Mockup */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
          className="flex justify-center lg:justify-end relative z-10 mt-8 lg:mt-0"
        >
          {/* Decorative halo around mockup */}
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 blur-3xl -z-10 rounded-full transform scale-110" />
          <AnimatedChatMockup />
        </motion.div>

      </div>
    </section>
  );
}

// ==========================================
// TRUSTED BY LOGO MARQUEE SECTION
// ==========================================
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
            className="h-6 max-h-7 w-auto object-contain opacity-40 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0"
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
        <span className="font-sans font-black tracking-widest text-base uppercase opacity-40 hover:opacity-100 hover:text-slate-900 transition-all duration-300 text-slate-700">
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
        className="shrink-0 inline-flex items-center justify-center transition-transform duration-200 hover:scale-105"
      >
        {logoElement}
      </a>
    );
  };

  return (
    <section className="py-16 border-y border-slate-100 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-10">
          {integrationTitle || 'INTEGRATES SEAMLESSLY WITH YOUR EXISTING STACK & TOOLS'}
        </p>

        {/* Infinite scrolling logo row with responsive Vector SVG logos */}
        <div className="flex w-full overflow-hidden relative">
          <div className="flex gap-24 animate-marquee whitespace-nowrap py-3 shrink-0 items-center">
            {activeLogos.map((item, idx) => renderLogo(item, idx))}
            {/* Duplicate for infinite loop */}
            {activeLogos.map((item, idx) => renderLogo(item, idx + activeLogos.length))}
          </div>
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
    <section className="py-20 px-6 bg-slate-50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {stats.map((s, idx) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="text-center space-y-2 border-r border-slate-200/50 last:border-0"
            >
              <span className="block text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">{s.value}</span>
              <span className="block text-[11px] font-black text-slate-400 uppercase tracking-wider">{s.label}</span>
              <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest">{s.sub}</span>
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
      color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
      route: '/services/whatsapp-campaigns'
    },
    {
      icon: Database,
      title: 'Data Upload & Retargeting',
      desc: 'Re-engage your existing customer database with effective campaigns designed to boost bookings and conversions.',
      bullets: ['Excel & CSV imports', 'Database list retargeting', 'Advanced booking triggers'],
      color: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      route: '/services/retargeting'
    },
    {
      icon: Clock,
      title: 'Automated Messaging',
      desc: 'Automate birthday greetings and service reminders (e.g., Filler touch-ups) at the perfect time to enhance customer loyalty.',
      bullets: ['Birthday wish triggers', 'Service follow-up alerts', 'Customer loyalty engine'],
      color: 'bg-[#F0FDF4]0/10 text-[#166534] border-indigo-500/20',
      route: '/services/automation'
    },
    {
      icon: Globe,
      title: 'Social Media Planner',
      desc: 'Schedule and publish content, monitor comments, and measure engagement across all platforms from a single dashboard.',
      bullets: ['Cross-channel scheduler', 'Comments monitoring feed', 'Unified engagement metrics'],
      color: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
      route: '/services/social-media'
    },
    {
      icon: Users,
      title: 'Lead Form CRM Integration',
      desc: 'Automatically capture lead data from your campaigns on Facebook, Instagram, TikTok, and Snapchat to maximize deals.',
      bullets: ['FB & IG lead forms sync', 'TikTok & Snapchat webhooks', 'Automatic contact assignment'],
      color: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
      route: '/services/lead-forms'
    },
    {
      icon: Sparkles,
      title: 'AI-Powered Automated Response',
      desc: 'Provide fast, professional, and consistent responses to chat inquiries and Google Reviews using our integrated AI.',
      bullets: ['Chat assistant replies', 'Google reviews automation', '24/7 intelligent answering'],
      color: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
      route: '/services/ai-responses'
    },
    {
      icon: FileText,
      title: 'Page & Form Builder',
      desc: 'Create sleek landing pages, micro-websites, and surveys that link directly to your CRM without writing any code.',
      bullets: ['Sleek drag-drop builder', 'CRM linked custom surveys', 'Fast micro-websites templates'],
      color: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20',
      route: '/services/page-builder'
    },
    {
      icon: BarChart3,
      title: 'Media Storage & Advanced Reporting',
      desc: 'Securely store your media assets and access detailed performance reports for both your ads and team to make data-driven decisions.',
      bullets: ['Secure assets storage drive', 'Ads analytics reports', 'Team performance monitoring'],
      color: 'bg-violet-500/10 text-violet-600 border-violet-500/20',
      route: '/services/media-storage'
    }
  ];

  return (
    <section id="features" className="py-32 px-6 bg-slate-50/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24 max-w-xl mx-auto space-y-4">
          <span className="font-sans font-[500] text-[14px] uppercase tracking-[1px] text-[#166534] bg-[#F0FDF4] px-3.5 py-1.5 rounded-full border border-[#bbf7d0]/50">Capabilities</span>
          <h2 className="font-display font-[700] text-[32px] md:text-[40px] lg:text-[48px] leading-[1.15] tracking-[-1px] text-slate-900">Everything you need to automate & engage</h2>
          <p className="font-sans font-normal text-[18px] leading-[1.8] max-w-[620px] text-slate-500">Ditch multiple subscription services. Manage your marketing campaigns, workflows, messaging pipelines, and customer support from one interface.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {allFeatures.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.05 }}
              className="p-8 bg-white border border-slate-200/60 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-slate-100 hover:-translate-y-2 hover:border-indigo-500/30 transition-all group flex flex-col justify-between relative overflow-hidden"
            >
              <div>
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center border transition-colors mb-6", f.color)}>
                  <f.icon size={22} strokeWidth={2.5} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3 tracking-tight">{f.title}</h3>
                <p className="text-slate-500 font-medium text-xs leading-relaxed mb-6">{f.desc}</p>

                {/* Benefits Bullet Checklist */}
                <ul className="space-y-2 mb-6">
                  {f.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2 text-[10.5px] font-semibold text-slate-450">
                      <CheckCircle2 size={12} className="text-indigo-500" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-4 border-t border-slate-100/80">
                <NavLink to={f.route} className="inline-flex items-center gap-1.5 text-xs font-black text-indigo-650 hover:text-indigo-805 transition-colors uppercase tracking-wider leading-none">
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
// AI WORKFLOW ANIMATED SECTION
// ==========================================
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
    <section className="py-32 px-6 bg-[#12263A] text-white relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto text-center relative z-10">
        <div className="max-w-2xl mx-auto space-y-4 mb-20 text-center flex flex-col items-center">
          <span className="font-sans font-[500] text-[14px] uppercase tracking-[1px] text-purple-400 bg-purple-500/10 px-3.5 py-1.5 rounded-full border border-purple-500/20 flex items-center gap-2">
            <Sparkles size={14} className="text-purple-400" />
            100% Automated Workflow
          </span>
          <h2 className="font-display font-[700] text-[32px] md:text-[40px] lg:text-[48px] leading-[1.15] tracking-[-1px] text-white">Turn WhatsApp Into Your Best Employee</h2>
          <p className="font-sans font-normal text-[18px] leading-[1.8] max-w-[620px] text-slate-300">Deploy AI on your WhatsApp Business number to automate response generation, support workflows, and pipeline progression 24/7.</p>
        </div>

        {/* Step-by-Step Flow diagram */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 relative">
          {/* Connecting Line Overlay for Desktop */}
          <div className="hidden md:block absolute top-[28px] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-purple-500/0 via-purple-500/40 to-purple-500/0 -z-10" />

          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col items-center group bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md hover:border-purple-500/30 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-14 h-14 bg-purple-500/10 border border-purple-500/30 text-purple-400 rounded-xl flex items-center justify-center shadow-inner group-hover:bg-purple-600 group-hover:text-white group-hover:border-purple-600 transition-all duration-300 relative">
                  <Icon size={24} strokeWidth={2} />
                  {/* Pulse dot (kept Emerald for WhatsApp vibe) */}
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                </div>
                <h3 className="font-display font-[700] text-[16px] text-white mt-6 mb-2 tracking-tight text-center group-hover:text-purple-300 transition-colors">{s.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-normal text-center">{s.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  );
}

// ==========================================
// OMNICHANNEL INBOX PIPELINE
// ==========================================
export function OmnichannelInbox() {
  const channels = [
    { icon: MessageCircle, name: 'WhatsApp', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
    { icon: Facebook, name: 'Facebook Messenger', color: 'bg-blue-600/10 text-blue-500 border-blue-600/20' },
    { icon: Instagram, name: 'Instagram DM', color: 'bg-pink-500/10 text-pink-500 border-pink-500/20' },
    { icon: Smartphone, name: 'SMS', color: 'bg-[#F0FDF4]0/10 text-indigo-500 border-indigo-500/20' },
    { icon: Mail, name: 'Email Inbox', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
    { icon: Globe, name: 'Web ChatWidget', color: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20' }
  ];

  return (
    <section id="solutions" className="py-32 px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

        {/* Visual Console Mockup */}
        <div className="lg:col-span-6 w-full flex justify-center">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-[2.5rem] p-5 shadow-2xl relative overflow-hidden flex flex-col h-[380px] text-white">

            {/* Console Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold tracking-tight text-slate-200">WhatsApp Workspace</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#12263A] px-2.5 py-1 rounded-lg border border-white/5 text-[9px] font-mono text-emerald-400">
                <span>OFFICIAL API</span>
              </div>
            </div>

            {/* Console Body Split */}
            <div className="flex-1 flex gap-4 mt-3 overflow-hidden">

              {/* Channel Switcher Sidebar -> WhatsApp Views Sidebar */}
              <div className="w-1/3 border-r border-white/5 pr-3 space-y-2 text-[10.5px] font-bold text-slate-450">
                <div className="p-2 bg-[#166534]/10 border border-indigo-500/20 text-[#22C55E] rounded-xl flex items-center justify-between">
                  <span className="flex items-center gap-1.5">💬 All Chats</span>
                  <span className="w-4 h-4 bg-emerald-500 text-white text-[8px] rounded-full flex items-center justify-center">4</span>
                </div>
                <div className="p-2 hover:bg-white/5 rounded-xl flex items-center justify-between transition-colors cursor-pointer">
                  <span className="flex items-center gap-1.5 text-slate-300">🤖 AI Copilot</span>
                </div>
                <div className="p-2 hover:bg-white/5 rounded-xl flex items-center gap-1.5 text-slate-400 transition-colors cursor-pointer">
                  <span>🏷️ Sales Leads</span>
                </div>
                <div className="p-2 hover:bg-white/5 rounded-xl flex items-center gap-1.5 text-slate-400 transition-colors cursor-pointer">
                  <span>🎫 Support</span>
                </div>
                <div className="p-2 hover:bg-white/5 rounded-xl flex items-center gap-1.5 text-slate-400 transition-colors cursor-pointer">
                  <span>🚀 Broadcasts</span>
                </div>
              </div>

              {/* Chat Thread Area */}
              <div className="flex-1 flex flex-col justify-between">

                {/* Active contact bar */}
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <div>
                    <span className="text-[10.5px] font-bold text-white block">Ahmad Khan</span>
                    <span className="text-[8.5px] text-slate-500 block">via WhatsApp Business</span>
                  </div>
                  <span className="text-[8.5px] text-[#22C55E] font-bold bg-[#F0FDF4]0/10 border border-indigo-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">AI suggested</span>
                </div>

                {/* Message feed */}
                <div className="flex-1 flex flex-col justify-end gap-3 my-3">

                  {/* Incoming */}
                  <div className="flex flex-col items-start max-w-[85%] self-start space-y-1">
                    <div className="p-3 bg-[#12263A] border border-white/5 rounded-2xl rounded-tl-none text-xs leading-relaxed text-slate-200">
                      "Hi! Do you have slots available for a demo call today?"
                    </div>
                    <span className="text-[8px] text-slate-500 font-semibold pl-1">Ahmad • 10:41 AM</span>
                  </div>

                  {/* AI Suggested Response */}
                  <div className="flex flex-col items-end max-w-[85%] self-end space-y-1">
                    <div className="p-3 bg-gradient-to-r from-[#166534] to-[#22C55E] rounded-2xl rounded-tr-none text-xs leading-relaxed text-white relative">
                      <Sparkles size={10} className="absolute top-2 right-2 text-indigo-200 animate-pulse" />
                      "Yes, Ahmed! We have slots open at 3:00 PM and 5:00 PM. Book here."
                    </div>
                    <span className="text-[8px] text-slate-500 font-semibold pr-1">AI Copilot Draft • 10:41 AM</span>
                  </div>

                </div>

                {/* Response Input block */}
                <div className="flex items-center gap-2 border-t border-white/5 pt-2">
                  <input
                    type="text"
                    placeholder="Send auto-reply or type response..."
                    className="flex-1 bg-[#12263A] border border-white/5 rounded-xl h-8 px-3 text-[10px] placeholder-slate-650 focus:outline-none focus:border-indigo-650"
                    disabled
                  />
                  <button className="h-8 px-3 bg-[#166534] hover:bg-[#14532d] text-white font-bold text-[10px] rounded-xl flex items-center justify-center cursor-default">
                    Send
                  </button>
                </div>

              </div>

            </div>

          </div>
        </div>

        {/* Text Area */}
        <div className="lg:col-span-6 space-y-8 text-left">
          <span className="font-sans font-[500] text-[14px] uppercase tracking-[1px] text-[#166534] bg-[#F0FDF4] px-3.5 py-1.5 rounded-full border border-[#bbf7d0]/50">WhatsApp Automation</span>
          <h2 className="font-display font-[700] text-[32px] md:text-[40px] lg:text-[48px] leading-[1.15] tracking-[-1px] text-slate-900">Scale your business on WhatsApp</h2>
          <p className="font-sans font-normal text-[18px] leading-[1.8] max-w-[620px] text-slate-500">Stop manually replying to repetitive queries. Automate responses, route conversations to the right team, and send targeted broadcast campaigns on the world's most popular messaging app.</p>

          <div className="grid grid-cols-2 gap-6 pt-4">
            <div className="space-y-2">
              <span className="block text-2xl font-black text-slate-900">98%</span>
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Message Open Rate</span>
            </div>
            <div className="space-y-2">
              <span className="block text-2xl font-black text-slate-900">24/7</span>
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Automated Support</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

// CRM DASHBOARD PREVIEW
// ==========================================
export function CRMDashboardPreview() {
  const columns = [
    {
      title: 'Qualification',
      count: '1 Lead',
      value: '$4,500',
      color: 'border-t-indigo-500',
      deals: [
        {
          initials: 'AK',
          name: 'Ahmad Khan Support',
          deal: '$4,500 CRM Integration',
          time: 'Active 2m ago',
          channel: '💬 WhatsApp API',
          tag: 'High Priority',
          tagColor: 'bg-rose-50 text-rose-600 border-rose-100',
          desc: 'Needs segment routing and automated follow-ups configuration.'
        }
      ]
    },
    {
      title: 'Proposal & AI Review',
      count: '1 Lead',
      value: '$1,200',
      color: 'border-t-purple-500',
      deals: [
        {
          initials: 'SM',
          name: 'Sarah Miller Retail',
          deal: '$1,200 Campaign Setup',
          time: 'Active 15m ago',
          channel: '📸 Instagram DM',
          tag: 'AI Replied',
          tagColor: 'bg-purple-50 text-purple-600 border-purple-100',
          desc: 'AI suggested birthday auto-coupon template has been drafted.'
        }
      ]
    },
    {
      title: 'Closed Won',
      count: '1 Lead',
      value: '$8,900',
      color: 'border-t-emerald-500',
      deals: [
        {
          initials: 'ZM',
          name: 'Zayn Malik Labs',
          deal: '$8,900 Enterprise Hub',
          time: 'Completed 1h ago',
          channel: '👥 Messenger Chat',
          tag: 'API Integrated',
          tagColor: 'bg-emerald-50 text-emerald-600 border-emerald-100',
          desc: 'Database fields synced. REST webhook callbacks are operational.'
        }
      ]
    }
  ];

  return (
    <section className="py-32 px-6 bg-slate-50/50">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="text-center max-w-xl mx-auto space-y-4">
          <span className="font-sans font-[500] text-[14px] uppercase tracking-[1px] text-[#166534] bg-[#F0FDF4] px-3.5 py-1.5 rounded-full border border-[#bbf7d0]/50">Core Engine</span>
          <h2 className="font-display font-[700] text-[32px] md:text-[40px] lg:text-[48px] leading-[1.15] tracking-[-1px] text-slate-900">Complete Customer Relationship Pipeline</h2>
          <p className="font-sans font-normal text-[18px] leading-[1.8] max-w-[620px] text-slate-500">Monitor deals, track lead status, view active customer profiles, and review task timelines from one central workspace.</p>
        </div>

        {/* Kanban Board Interface Mockup */}
        <div className="w-full bg-white border border-slate-200 shadow-xl rounded-[2.5rem] p-8 flex flex-col gap-8">

          {/* Header of Board */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-6 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#166534] animate-pulse" />
                <h3 className="text-base font-bold text-slate-900 tracking-tight">Throb Active Deals Board</h3>
              </div>
              <span className="text-[11px] font-semibold text-slate-450 mt-0.5 block">Pipeline Value: <strong className="text-[#166534]">$14,600 USD</strong> • 3 active customer profiles</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">REST API: Active</span>
              <a href="#contact" className="px-4 py-2 bg-slate-900 hover:bg-indigo-650 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm">
                Open CRM Workspace <ArrowRight size={12} />
              </a>
            </div>
          </div>

          {/* Kanban Columns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {columns.map((col) => (
              <div key={col.title} className={cn("p-5 bg-slate-50/50 border border-slate-200/80 rounded-2.5xl flex flex-col gap-4 border-t-4", col.color)}>

                {/* Column header info */}
                <div className="flex justify-between items-center border-b border-slate-200/50 pb-2">
                  <div>
                    <span className="font-display font-[700] text-sm text-slate-800 block">{col.title}</span>
                    <span className="text-[9.5px] text-slate-450 font-semibold">{col.count}</span>
                  </div>
                  <span className="text-xs font-bold text-[#166534] bg-[#F0FDF4] border border-[#bbf7d0] px-2 py-0.5 rounded-lg">{col.value}</span>
                </div>

                {/* Cards List inside column */}
                <div className="space-y-3 flex-1">
                  {col.deals.map((deal, dealIdx) => (
                    <div key={dealIdx} className="p-4 bg-white border border-slate-200/60 shadow-sm rounded-2xl flex flex-col gap-3.5 hover:border-indigo-400 hover:shadow-md transition-all duration-350 group">

                      {/* Card Header Profile & Tag */}
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8.5 h-8.5 rounded-xl bg-[#F0FDF4] border border-[#bbf7d0]/50 text-indigo-650 flex items-center justify-center text-xs font-bold shadow-sm">
                            {deal.initials}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-850 group-hover:text-indigo-650 transition-colors block">{deal.name}</span>
                            <span className="text-[9.5px] text-slate-400 font-medium block">{deal.channel}</span>
                          </div>
                        </div>
                        <span className={cn("text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border shrink-0", deal.tagColor)}>
                          {deal.tag}
                        </span>
                      </div>

                      {/* Card Body Detail */}
                      <div className="space-y-1">
                        <span className="text-[11.5px] font-bold text-slate-800 block leading-tight">{deal.deal}</span>
                        <p className="text-[10px] text-slate-500 leading-normal font-normal">{deal.desc}</p>
                      </div>

                      {/* Card Footer actions */}
                      <div className="pt-2.5 border-t border-slate-100 flex justify-between items-center text-[9px] text-slate-450 font-semibold">
                        <span>{deal.time}</span>
                        <span className="text-indigo-650 group-hover:underline cursor-pointer flex items-center gap-0.5">Edit Deal <ArrowUpRight size={10} /></span>
                      </div>

                    </div>
                  ))}
                </div>

              </div>
            ))}
          </div>

          {/* Quick interactive note */}
          <div className="pt-2 flex justify-between items-center text-[10.5px] text-slate-400 font-semibold">
            <span className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-indigo-500" /> Database profiles update in real-time as users enter landing forms or chat webhooks.</span>
          </div>

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
    <section className="py-32 px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-20">
        <div className="text-center max-w-xl mx-auto space-y-4">
          <span className="font-sans font-[500] text-[14px] uppercase tracking-[1px] text-[#166534] bg-[#F0FDF4] px-3.5 py-1.5 rounded-full border border-[#bbf7d0]/50">Automation Flow</span>
          <h2 className="font-display font-[700] text-[32px] md:text-[40px] lg:text-[48px] leading-[1.15] tracking-[-1px] text-slate-900">Advanced marketing workflow mapping</h2>
          <p className="font-sans font-normal text-[18px] leading-[1.8] max-w-[620px] text-slate-500">Visually model how users engage with your brand touchpoints. Create custom wait delays, filter conditions, message blocks, and alerts.</p>
        </div>

        <div className="relative flex flex-col md:flex-row gap-6 justify-between items-center">
          {/* Linking Line for desktop */}
          <div className="hidden md:block absolute top-[44px] left-[5%] right-[5%] h-0.5 bg-slate-100 -z-10" />

          {pipeline.map((item, idx) => (
            <div key={item.label} className="w-full md:w-44 bg-slate-50 border border-slate-150 p-6 rounded-3xl text-left relative hover:border-indigo-400 transition-colors">
              <div className="w-8 h-8 rounded-xl bg-indigo-650 text-white flex items-center justify-center text-xs font-black mb-4">
                {idx + 1}
              </div>
              <h3 className="text-xs font-extrabold text-slate-900 mb-1 tracking-tight">{item.label}</h3>
              <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">{item.desc}</p>
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
    <section id="integrations" className="py-32 px-6 bg-[#12263A] text-white overflow-hidden relative">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#F0FDF4]0/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

        {/* Text Area */}
        <div className="lg:col-span-5 space-y-8 text-left">
          <span className="font-sans font-[500] text-[14px] uppercase tracking-[1px] text-[#22C55E] bg-[#F0FDF4]0/10 px-3.5 py-1.5 rounded-full border border-indigo-500/20">Unified Metrics</span>
          <h2 className="font-display font-[700] text-[32px] md:text-[40px] lg:text-[48px] leading-[1.15] tracking-[-1px] text-white">Campaign analytics with pixel-perfect accuracy</h2>
          <p className="font-sans font-normal text-[18px] leading-[1.8] max-w-[620px] text-slate-300">Monitor conversion rates, sales pipelines, message volume, and support resolution metrics. Our real-time data visualizer tracks agent response speeds and total return-on-investment automatically.</p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded bg-emerald-500/20 flex items-center justify-center"><CheckCircle2 size={12} className="text-emerald-400" /></div>
              <span className="text-xs font-bold text-slate-200">Exportable custom PDF reports</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded bg-emerald-500/20 flex items-center justify-center"><CheckCircle2 size={12} className="text-emerald-400" /></div>
              <span className="text-xs font-bold text-slate-200">Daily summaries delivered via Slack/Email</span>
            </div>
          </div>
        </div>

        {/* Custom Premium Chart Visual */}
        <div className="lg:col-span-7 w-full">
          <div className="w-full bg-slate-900/60 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl space-y-8">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div>
                <span className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">Workspace report</span>
                <h3 className="text-sm font-extrabold text-white">Monthly Conversation Volume</h3>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-emerald-400 flex items-center gap-1 justify-end">
                  <TrendingUp size={12} /> +24%
                </span>
                <span className="text-[9px] text-slate-500 font-bold block mt-0.5">Vs Last Quarter</span>
              </div>
            </div>

            {/* Custom SVG Line Chart */}
            <div className="w-full aspect-[2/1] relative">
              <svg className="w-full h-full" viewBox="0 0 600 300">
                {/* Grid Lines */}
                <line x1="50" y1="50" x2="550" y2="50" stroke="rgba(255,255,255,0.05)" />
                <line x1="50" y1="125" x2="550" y2="125" stroke="rgba(255,255,255,0.05)" />
                <line x1="50" y1="200" x2="550" y2="200" stroke="rgba(255,255,255,0.05)" />
                <line x1="50" y1="250" x2="550" y2="250" stroke="rgba(255,255,255,0.08)" />

                {/* Line Path */}
                <path
                  d="M50,220 C120,180 180,120 250,140 C320,160 380,80 450,100 C520,120 530,60 550,50"
                  fill="none"
                  stroke="url(#chartGradient)"
                  strokeWidth="4"
                  strokeLinecap="round"
                />

                {/* Gradient Definition */}
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="50%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>

                {/* Active Points */}
                <circle cx="250" cy="140" r="5" fill="#a855f7" stroke="#ffffff" strokeWidth="2" />
                <circle cx="450" cy="100" r="5" fill="#ec4899" stroke="#ffffff" strokeWidth="2" />

                {/* Labels */}
                <text x="50" y="275" fill="#64748b" fontSize="10" fontWeight="bold">Jan</text>
                <text x="150" y="275" fill="#64748b" fontSize="10" fontWeight="bold">Feb</text>
                <text x="250" y="275" fill="#64748b" fontSize="10" fontWeight="bold">Mar</text>
                <text x="350" y="275" fill="#64748b" fontSize="10" fontWeight="bold">Apr</text>
                <text x="450" y="275" fill="#64748b" fontSize="10" fontWeight="bold">May</text>
                <text x="550" y="275" fill="#64748b" fontSize="10" fontWeight="bold">Jun</text>
              </svg>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-3 gap-4 border-t border-white/5 pt-6">
              <div>
                <span className="text-[9px] text-slate-500 font-bold block uppercase mb-1">Delivered</span>
                <span className="text-sm font-extrabold text-white">99.8%</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-500 font-bold block uppercase mb-1">Click Rate</span>
                <span className="text-sm font-extrabold text-white">18.4%</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-500 font-bold block uppercase mb-1">Total ROI</span>
                <span className="text-sm font-extrabold text-emerald-450">4.2x</span>
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
    <section className="py-32 px-6 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="text-center max-w-xl mx-auto space-y-4">
          <span className="font-sans font-[500] text-[14px] uppercase tracking-[1px] text-[#166534] bg-[#F0FDF4] px-3.5 py-1.5 rounded-full border border-[#bbf7d0]/50">Connectivity</span>
          <h2 className="font-display font-[700] text-[32px] md:text-[40px] lg:text-[48px] leading-[1.15] tracking-[-1px] text-slate-900">Connected Integrations Ecosystem</h2>
          <p className="font-sans font-normal text-[18px] leading-[1.8] max-w-[620px] text-slate-500">Sync contact fields, events, tags, pipelines, and trigger workflows instantly using secure REST endpoints and native webhooks.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {integrations.map((int) => (
            <div key={int.name} className="p-8 bg-slate-50/50 border border-slate-150 rounded-3xl hover:border-slate-300 transition-colors flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-10 h-10 bg-white border border-slate-200 text-[#166534] rounded-xl flex items-center justify-center shrink-0">
                  <int.icon size={18} strokeWidth={2.5} />
                </div>
                <h3 className="text-base font-bold text-slate-900 block tracking-tight">{int.name}</h3>
                <p className="text-slate-550 font-medium text-xs leading-relaxed">{int.desc}</p>
              </div>
              <div className="pt-4 mt-6 border-t border-slate-200/50 text-[9px] font-black uppercase text-slate-400 tracking-wider">
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
// TESTIMONIALS SECTION
// ==========================================
export function Testimonials() {
  const reviews = [
    {
      text: "Switching from standard template CRM tools was an instant growth catalyst. Our sales teams responded in minutes instead of hours, completely scaling our marketing conversion metrics.",
      author: "Jessica Lin",
      role: "VP of Support, TechCorp",
      stats: "300% Higher Conversion",
      logo: "TechCorp",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
      gradient: "from-indigo-500/5 to-purple-500/5"
    },
    {
      text: "Our marketing workflows became unified in minutes. The WhatsApp Graph API integration is compliant, robust, and performs flawlessly during high-volume promo sales events.",
      author: "Marcus Aurel",
      role: "Founder, NexxDigital",
      stats: "4x Faster Response",
      logo: "NexxDigital",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
      gradient: "from-purple-500/5 to-pink-500/5"
    }
  ];

  return (
    <section id="resources" className="py-32 px-6 bg-slate-50 relative overflow-hidden border-y border-slate-100">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-[#F0FDF4]0/5 blur-[120px] rounded-full" />
        <div className="absolute top-[60%] -right-[10%] w-[50%] h-[50%] bg-purple-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto space-y-20 relative z-10">
        <div className="text-center max-w-2xl mx-auto space-y-6">
          <span className="font-sans font-[600] text-[13px] uppercase tracking-[1.5px] text-[#166534] bg-white px-4 py-2 rounded-full border border-[#bbf7d0] shadow-sm shadow-indigo-100/50 inline-flex items-center gap-2">
            <Star size={14} className="fill-indigo-600 text-[#166534]" />
            Success Stories
          </span>
          <h2 className="font-display font-[800] text-[36px] md:text-[48px] lg:text-[56px] leading-[1.1] tracking-[-1.5px] text-slate-900">
            Hear it from teams who <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#166534] to-[#22C55E]">build on Throb</span>
          </h2>
          <p className="font-sans font-medium text-[18px] leading-[1.8] max-w-[620px] mx-auto text-slate-500">
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
              transition={{ delay: idx * 0.2 }}
              className="group relative bg-white p-10 md:p-12 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-500 flex flex-col justify-between overflow-hidden"
            >
              {/* Subtle background gradient on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${r.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              {/* Massive decorative quote mark */}
              <div className="absolute -top-6 -left-6 text-slate-50 opacity-100 group-hover:text-indigo-50/80 transition-colors duration-500 pointer-events-none">
                <svg width="180" height="180" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.017 18L14.017 10.609C14.017 4.905 17.748 1.039 23 0L23.995 2.151C21.563 3.068 20 5.789 20 8H24V18H14.017ZM0 18V10.609C0 4.905 3.748 1.038 9 0L9.996 2.151C7.563 3.068 6 5.789 6 8H9.983L9.983 18L0 18Z" />
                </svg>
              </div>

              <div className="relative z-10 space-y-8 flex-1">
                <div className="flex gap-1.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} className="fill-yellow-400 text-yellow-400 drop-shadow-sm" />
                  ))}
                </div>
                <p className="text-slate-700 font-display font-medium text-[20px] md:text-[22px] leading-[1.6] tracking-tight">
                  "{r.text}"
                </p>
              </div>

              <div className="relative z-10 mt-12 pt-8 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src={r.avatar} alt={r.author} className="w-14 h-14 rounded-full border-2 border-white shadow-md object-cover" />
                  <div>
                    <span className="font-bold text-[16px] text-slate-900 block">{r.author}</span>
                    <span className="text-[13px] text-slate-500 font-medium block mt-0.5">{r.role}</span>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-1.5">
                  <span className="text-[11px] font-black text-[#166534] bg-[#F0FDF4] px-2.5 py-1 rounded-md uppercase tracking-wider">{r.stats}</span>
                  <span className="text-[11px] text-slate-400 font-bold block uppercase tracking-widest">{r.logo}</span>
                </div>
              </div>
            </motion.div>
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
    <section id="pricing" className="py-32 px-6 bg-white relative overflow-hidden border-t border-slate-100">
      {/* Background glow effects */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#F0FDF4]/50 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 max-w-2xl mx-auto space-y-4">
          <span className="font-sans font-[500] text-[14px] uppercase tracking-[1px] text-[#166534] bg-[#F0FDF4] px-3.5 py-1.5 rounded-full border border-[#bbf7d0]/50">Pricing Plans</span>
          <h2 className="font-display font-[700] text-[32px] md:text-[40px] lg:text-[48px] leading-[1.15] tracking-[-1px] text-slate-900">Scale your WhatsApp operations</h2>
          <p className="font-sans font-normal text-[18px] leading-[1.8] text-slate-500">Choose a plan that fits your business scale. Unlock unlimited contacts, advanced AI auto-replies, and seamless CRM integrations.</p>
        </div>

        {/* Monthly / Yearly billing Toggle Switch */}
        <div className="flex items-center justify-center gap-4 mb-20">
          <span className={cn("text-xs font-black uppercase tracking-wider", !isYearly ? "text-slate-900" : "text-slate-400")}>Monthly Billing</span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className="w-14 h-7 bg-[#F0FDF4] border border-[#bbf7d0] rounded-full p-1 transition-all duration-300 relative focus:outline-none cursor-pointer hover:bg-[#dcfce7]"
          >
            <div className={cn("w-5 h-5 bg-[#166534] rounded-full transition-all duration-300 shadow-sm", isYearly ? "translate-x-7" : "translate-x-0")} />
          </button>
          <div className="flex items-center gap-2">
            <span className={cn("text-xs font-black uppercase tracking-wider", isYearly ? "text-slate-900" : "text-slate-400")}>Yearly Billing</span>
            <span className="text-[9px] font-black uppercase tracking-widest bg-[#dcfce7] text-[#166534] px-2.5 py-1 rounded-md border border-[#bbf7d0]">Save 20%</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-6xl mx-auto">
          {displayPlans.map((plan) => (
            <div key={plan.name} className={cn(
              "p-10 rounded-[2.5rem] flex flex-col transition-all duration-500 relative group overflow-hidden",
              plan.highlighted
                ? "bg-white text-slate-900 border-2 border-[#166534] shadow-[0_20px_60px_rgba(22,101,52,0.12)] md:-translate-y-4 z-10"
                : "bg-white text-slate-900 border border-slate-200/80 hover:border-[#bbf7d0] hover:shadow-xl hover:shadow-indigo-900/5 hover:-translate-y-2"
            )}>

              {plan.highlighted && (
                <div className="absolute top-6 right-6 bg-[#F0FDF4] text-[#166534] border border-[#bbf7d0] text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                  <Sparkles size={12} className="text-[#166534]" /> Most Popular
                </div>
              )}

              <h3 className={cn("text-sm font-black uppercase tracking-[0.2em] mb-2", plan.highlighted ? "text-[#166534]" : "text-slate-500")}>{plan.name}</h3>
              <p className="text-slate-500 text-xs font-medium mb-6 min-h-[32px]">{plan.desc}</p>

              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-5xl font-black tracking-tight text-slate-900">{getPriceLabel(plan)}</span>
                {plan.price !== 'Custom' && <span className="text-sm font-medium text-slate-400">/mo</span>}
              </div>

              <div className="h-6 mb-8">
                {isYearly && plan.price !== 'Custom' && (
                  <span className="block text-[10.5px] font-bold text-[#166534] uppercase tracking-wider bg-[#F0FDF4] w-fit px-2.5 py-1 rounded-md border border-[#bbf7d0]">Billed annually</span>
                )}
              </div>

              <div className="flex-1 space-y-4 mb-10">
                {plan.features.map((f: string) => (
                  <div key={f} className="flex items-start gap-3 text-sm font-medium text-slate-700">
                    <CheckCircle2 size={18} className={cn("shrink-0 mt-0.5", plan.highlighted ? "text-[#166534]" : "text-[#22C55E]")} />
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              <NavLink
                to={`/signup?plan=${plan.key}`}
                className={cn(
                  "w-full py-4 rounded-xl font-bold text-[13px] uppercase tracking-widest transition-all active:scale-95 cursor-pointer text-center block relative overflow-hidden group-hover:shadow-md",
                  plan.highlighted
                    ? "bg-[#166534] text-white hover:bg-[#14532d] shadow-lg shadow-[#166534]/30"
                    : "bg-slate-50 border border-slate-200 text-slate-800 hover:border-[#166534] hover:text-[#166534] hover:bg-white"
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
    <section className="py-32 px-6 bg-slate-50 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[#F0FDF4]/50 -skew-x-12 transform origin-top-right z-0" />
      <div className="absolute top-20 right-20 w-72 h-72 bg-purple-200/50 rounded-full blur-[80px] pointer-events-none z-0" />
      <div className="absolute bottom-20 left-20 w-72 h-72 bg-indigo-200/50 rounded-full blur-[80px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

        {/* Left Content Area */}
        <div className="lg:col-span-5 space-y-8 sticky top-24">
          <div className="space-y-4">
            <span className="font-sans font-[600] text-[13px] uppercase tracking-[1.5px] text-[#166534] bg-white px-4 py-2 rounded-full border border-[#bbf7d0] shadow-sm shadow-indigo-100/50 inline-flex items-center gap-2">
              <HelpCircle size={14} className="text-[#166534]" />
              Support Center
            </span>
            <h2 className="font-display font-[800] text-[36px] md:text-[44px] leading-[1.1] tracking-[-1px] text-slate-900">
              Got questions about <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#166534] to-[#22C55E]">WhatsApp AI?</span>
            </h2>
            <p className="font-sans font-medium text-[18px] leading-[1.7] text-slate-500">
              Everything you need to know about setting up your WhatsApp Business API, automation limits, compliance, and CRM integrations.
            </p>
          </div>

          <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#F0FDF4] flex items-center justify-center shrink-0">
              <MessageCircle size={24} className="text-[#166534]" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-1">Still have questions?</h4>
              <p className="text-sm text-slate-500 mb-3">Our WhatsApp automation experts are ready to help you build the perfect workflow.</p>
              <a href="#contact" className="text-sm font-bold text-[#166534] hover:text-[#166534] flex items-center gap-1.5 transition-colors">
                Chat with our team <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>

        {/* Right FAQ Accordion Area */}
        <div className="lg:col-span-7 space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className={cn(
                  "border rounded-2xl overflow-hidden transition-all duration-300",
                  isOpen
                    ? "bg-white border-[#bbf7d0] shadow-lg shadow-indigo-900/5"
                    : "bg-white/60 border-slate-200/80 hover:bg-white hover:border-slate-300"
                )}
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-6 text-left flex items-start justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <div className="flex gap-4">
                    <span className={cn(
                      "font-mono text-xs font-bold mt-1 shrink-0",
                      isOpen ? "text-[#166534]" : "text-slate-400"
                    )}>
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className={cn(
                      "font-bold text-[15px] md:text-[17px] leading-snug transition-colors",
                      isOpen ? "text-indigo-900" : "text-slate-800"
                    )}>
                      {faq.q}
                    </span>
                  </div>
                  <div className={cn(
                    "shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                    isOpen ? "bg-[#166534] text-white" : "bg-slate-100 text-slate-500"
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
                      <div className="px-6 pb-6 pl-[52px] text-[14px] md:text-[15px] font-medium text-slate-500 leading-relaxed">
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

// ==========================================
// FINAL CTA SECTION
// ==========================================
export function FinalCTA() {
  return (
    <section id="contact" className="py-36 px-6 bg-[#12263A] text-white text-center relative overflow-hidden">
      {/* Mesh Grid & Radial Glow overlays */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.12),transparent_70%)] pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-10 relative z-10 flex flex-col items-center">

        {/* Sparkles tag */}
        <span className="font-sans font-[500] text-[14px] uppercase tracking-[1px] text-[#22C55E] bg-[#166534]/30 px-3.5 py-1.5 rounded-full border border-[#22C55E]/30 flex items-center gap-1.5">
          <Sparkles size={12} className="text-[#22C55E] animate-pulse" />
          Get Started Today
        </span>

        {/* Header */}
        <h2 className="font-display font-[800] text-[38px] md:text-[48px] lg:text-[60px] xl:text-[68px] leading-[1.05] tracking-[-2px] text-white max-w-3xl">
          Ready to Transform Customer <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#22C55E] via-[#86efac] to-[#bbf7d0]">Communication?</span>
        </h2>

        {/* Description */}
        <p className="font-sans font-normal text-[18px] leading-[1.8] max-w-[620px] text-slate-400">
          Join thousands of high-growth teams who automate WhatsApp messages, nurture leads, and scale conversion pipelines automatically.
        </p>

        {/* Glassmorphic Checklist Bar */}
        <div className="flex flex-wrap items-center justify-center gap-y-3 gap-x-8 text-[12px] font-semibold text-slate-300 font-sans uppercase tracking-[0.5px] bg-white/5 border border-white/10 px-8 py-3.5 rounded-full backdrop-blur-md">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={13} className="text-[#22C55E]" />
            <span>Unlimited Messaging</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={13} className="text-[#22C55E]" />
            <span>AI Included</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={13} className="text-[#22C55E]" />
            <span>CRM Included</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={13} className="text-[#22C55E]" />
            <span>No Credit Card</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 w-full">
          <NavLink
            to="/signup"
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#166534] to-[#22C55E] text-white font-sans font-semibold text-[16px] tracking-[0.3px] rounded-xl transition-all hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(22,101,52,0.35)] active:scale-97 text-center shadow-lg"
          >
            Start Free Trial
          </NavLink>
          <NavLink
            to="/contact"
            className="w-full sm:w-auto px-8 py-4 bg-slate-900 border border-slate-800 text-slate-200 font-sans font-semibold text-[16px] tracking-[0.3px] rounded-xl transition-all hover:bg-slate-850 hover:text-white active:scale-95 text-center shadow-sm"
          >
            Book Demo
          </NavLink>
        </div>
      </div>
    </section>
  );
}

// ==========================================
// AI WHATSAPP AUTOMATION SECTION
// ==========================================
export function WhatsAppAutomation() {
  const sectionRef = useRef<HTMLElement>(null);

  const features = [
    {
      icon: Bot,
      title: '24/7 AI Customer Replies',
      desc: 'Automatically answer customer messages day and night using predefined intelligent workflows.',
      color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
    },
    {
      icon: MessageCircle,
      title: 'Instant Welcome Message',
      desc: 'Send personalized greetings immediately when a customer starts a WhatsApp conversation.',
      color: 'bg-blue-500/10 text-blue-600 border-blue-500/20'
    },
    {
      icon: FileText,
      title: 'Interactive Service Selection',
      desc: 'Display business services as clickable WhatsApp buttons so customers can quickly navigate to the service they need.',
      color: 'bg-[#F0FDF4]0/10 text-[#166534] border-indigo-500/20'
    },
    {
      icon: Calendar,
      title: 'Appointment Booking Automation',
      desc: 'Automatically collect customer information, preferred date, available time slots, and confirm appointments without staff involvement.',
      color: 'bg-purple-500/10 text-purple-600 border-purple-500/20'
    },
    {
      icon: MousePointerClick,
      title: 'Click-to-WhatsApp Advertising',
      desc: 'Integrate TikTok, Facebook, Instagram, Snapchat, and Google Ads so customers who click ads land directly into a WhatsApp conversation.',
      color: 'bg-rose-500/10 text-rose-600 border-rose-500/20'
    },
    {
      icon: Database,
      title: 'CRM & Lead Management',
      desc: 'Automatically save customer information, create leads, notify sales representatives, and synchronize conversations with the CRM.',
      color: 'bg-amber-500/10 text-amber-600 border-amber-500/20'
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
      {/* ========== MAIN TWO-COLUMN SECTION ========== */}
      <section
        ref={sectionRef}
        id="whatsapp-automation"
        className="py-32 px-6 bg-white overflow-hidden"
      >
        <div className="max-w-7xl mx-auto">

          {/* Section Badge + Title */}
          <div className="text-center mb-20 max-w-2xl mx-auto space-y-4 flex flex-col items-center">
            <span className="font-sans font-[500] text-[14px] uppercase tracking-[1px] text-[#166534] bg-[#F0FDF4] px-3.5 py-1.5 rounded-full border border-[#bbf7d0]/50 flex items-center gap-1.5 w-fit">
              <MessageCircle size={14} className="text-indigo-500" />
              WhatsApp Automation
            </span>
            <h2 className="font-display font-[700] text-[32px] md:text-[40px] lg:text-[48px] leading-[1.15] tracking-[-1px] text-slate-900">
              AI WhatsApp Automation for <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#22C55E] via-[#86efac] to-[#bbf7d0]">Businesses & Clinics</span>
            </h2>
            <p className="font-sans font-normal text-[18px] leading-[1.8] max-w-[700px] text-slate-500">
              Transform customer communication with intelligent WhatsApp automation that replies instantly, guides customers through services, books appointments, captures leads, and integrates directly with your marketing campaigns.
            </p>
          </div>

          {/* Two-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

            {/* ---- LEFT COLUMN ---- */}
            <div className="lg:col-span-5 space-y-10">
              <div className="space-y-5">
                <h3 className="font-display font-[700] text-[24px] md:text-[28px] leading-[1.2] tracking-[-0.5px] text-slate-900">
                  Automate every customer touchpoint from ad click to appointment booking
                </h3>
                <p className="font-sans font-normal text-[16px] leading-[1.8] text-slate-500">
                  Deploy AI-powered WhatsApp workflows that handle lead capture, service inquiries, appointment scheduling, and CRM synchronization — completely hands-free.
                </p>
              </div>

              {/* Feature Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((f, idx) => (
                  <motion.div
                    key={f.title}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ delay: idx * 0.06 }}
                    className="p-5 bg-white border border-slate-200/60 rounded-2xl shadow-sm hover:shadow-lg hover:shadow-slate-100 hover:-translate-y-1 hover:border-indigo-500/30 transition-all duration-300 group"
                  >
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border transition-colors mb-3", f.color)}>
                      <f.icon size={18} strokeWidth={2.5} />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mb-1.5 tracking-tight group-hover:text-[#166534] transition-colors">{f.title}</h4>
                    <p className="text-slate-500 font-medium text-[11px] leading-relaxed">{f.desc}</p>
                  </motion.div>
                ))}
              </div>

              {/* Primary CTA */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="pt-2"
              >
                <NavLink
                  to="/contact"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#166534] to-[#22C55E] text-white font-sans font-semibold text-[15px] tracking-[0.3px] rounded-xl transition-all hover:scale-[1.03] hover:shadow-[0_8px_30px_rgba(22,101,52,0.35)] active:scale-97 shadow-lg"
                >
                  Get Started with WhatsApp AI
                  <ArrowRight size={16} />
                </NavLink>
              </motion.div>
            </div>

            {/* ---- RIGHT COLUMN: Workflow Visualization ---- */}
            <div className="lg:col-span-7 w-full">
              <div className="w-full bg-[#12263A] border border-slate-800 rounded-[2.5rem] p-6 md:p-8 shadow-2xl relative overflow-hidden">

                {/* Background glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[#F0FDF4]0/5 rounded-full blur-[80px] pointer-events-none" />

                {/* Console Header */}
                <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6 relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#F0FDF4]0 animate-pulse" />
                    <span className="text-xs font-bold tracking-tight text-slate-200">WhatsApp Automation Pipeline</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1 rounded-lg border border-white/5 text-[9px] font-mono text-[#22C55E]">
                    <span>LIVE • 8 STEPS</span>
                  </div>
                </div>

                {/* Workflow Steps */}
                <div className="space-y-3 relative z-10">
                  {workflowSteps.map((step, idx) => (
                    <motion.div
                      key={step.label}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-30px" }}
                      transition={{ delay: idx * 0.08, duration: 0.4 }}
                    >
                      {/* Step Card */}
                      <div className="flex items-center gap-4 p-3.5 bg-white/5 border border-white/8 rounded-xl backdrop-blur-sm hover:bg-white/8 hover:border-purple-500/20 transition-all duration-300 group">
                        {/* Step Number */}
                        <div className="w-9 h-9 bg-purple-500/10 border border-purple-500/25 text-purple-400 font-display font-bold rounded-lg flex items-center justify-center text-xs shrink-0 group-hover:bg-purple-600 group-hover:text-white group-hover:border-purple-600 transition-all duration-300">
                          {idx + 1}
                        </div>

                        {/* Step Icon */}
                        <div className="w-8 h-8 bg-slate-800/80 border border-white/5 rounded-lg flex items-center justify-center shrink-0">
                          <step.icon size={14} className="text-slate-300 group-hover:text-purple-400 transition-colors" />
                        </div>

                        {/* Step Content */}
                        <div className="flex-1 min-w-0">
                          <span className="text-[12px] font-bold text-white block leading-tight group-hover:text-purple-300 transition-colors">{step.label}</span>
                          <span className="text-[10px] text-slate-500 font-medium block mt-0.5 truncate">{step.sub}</span>
                        </div>

                        {/* Status Indicator */}
                        <div className="w-2 h-2 rounded-full bg-purple-500/50 group-hover:bg-purple-400 transition-colors shrink-0" />
                      </div>

                      {/* Connector Arrow (except last) */}
                      {idx < workflowSteps.length - 1 && (
                        <div className="flex justify-center py-0.5">
                          <motion.div
                            initial={{ opacity: 0, scaleY: 0 }}
                            whileInView={{ opacity: 1, scaleY: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.08 + 0.15 }}
                            className="flex flex-col items-center"
                          >
                            <div className="w-px h-2 bg-gradient-to-b from-indigo-500/40 to-indigo-500/10" />
                            <ChevronDown size={10} className="text-indigo-500/40 -mt-0.5" />
                          </motion.div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Bottom Status Bar */}
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] relative z-10">
                  <span className="flex items-center gap-1.5 text-slate-400 font-semibold">
                    <CheckCircle2 size={11} className="text-[#22C55E]" />
                    End-to-end automation • Zero manual intervention
                  </span>
                  <span className="text-[#22C55E] font-bold uppercase tracking-wider text-[9px]">Active</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========== STATISTICS STRIP ========== */}
      <section className="py-20 px-6 bg-white relative overflow-hidden">

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="bg-[#12263A] border border-slate-800/60 shadow-[0_20px_60px_rgba(0,0,0,0.15)] rounded-[2.5rem] p-10 md:p-14 relative overflow-hidden group">
            {/* Animated Background Glows */}
            <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-[#F0FDF4]0/20 blur-[100px] pointer-events-none rounded-full group-hover:bg-[#F0FDF4]0/30 transition-colors duration-700" />
            <div className="absolute bottom-0 right-1/4 w-1/2 h-1/2 bg-purple-500/20 blur-[100px] pointer-events-none rounded-full group-hover:bg-purple-500/30 transition-colors duration-700" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8 relative z-10">
              {stats.map((s, idx) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex flex-col items-center text-center group/stat"
                >
                  <div className="relative mb-5">
                    <span className="text-5xl md:text-6xl font-display font-extrabold bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-slate-400 tracking-tighter group-hover/stat:scale-110 group-hover/stat:-translate-y-1 transition-all duration-500 block drop-shadow-lg">
                      {s.value}
                    </span>
                    {/* Tiny decorative WhatsApp green dot on hover */}
                    <span className="absolute top-0 -right-4 w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_12px_rgba(52,211,153,1)] opacity-0 group-hover/stat:opacity-100 transition-opacity duration-300" />
                  </div>
                  <span className="block text-[12px] font-black text-indigo-300 uppercase tracking-[0.2em] mb-1.5">{s.label}</span>
                  <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">{s.sub}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== CTA SECTION ========== */}
      <section className="py-28 px-6 bg-[#12263A] text-white text-center relative overflow-hidden">
        {/* Background overlays */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.12),transparent_70%)] pointer-events-none" />

        <div className="max-w-3xl mx-auto space-y-8 relative z-10 flex flex-col items-center">
          <span className="font-sans font-[500] text-[14px] uppercase tracking-[1px] text-[#22C55E] bg-[#166534]/30 px-3.5 py-1.5 rounded-full border border-[#22C55E]/30 flex items-center gap-1.5">
            <Sparkles size={12} className="text-[#22C55E] animate-pulse" />
            WhatsApp AI
          </span>

          <h2 className="font-display font-[800] text-[32px] md:text-[42px] lg:text-[52px] leading-[1.08] tracking-[-2px] text-white max-w-2xl">
            Ready to Automate Your Customer <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#22C55E] via-[#86efac] to-[#bbf7d0]">Conversations?</span>
          </h2>

          <p className="font-sans font-normal text-[17px] leading-[1.8] max-w-[600px] text-slate-400">
            Deploy AI-powered WhatsApp automation for your business or clinic and never miss another customer again.
          </p>

          {/* Glassmorphic Features Bar */}
          <div className="flex flex-wrap items-center justify-center gap-y-3 gap-x-8 text-[12px] font-semibold text-slate-300 font-sans uppercase tracking-[0.5px] bg-white/5 border border-white/10 px-8 py-3.5 rounded-full backdrop-blur-md">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={13} className="text-[#22C55E]" />
              <span>Click-to-WhatsApp Ads</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={13} className="text-[#22C55E]" />
              <span>AI Booking</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={13} className="text-[#22C55E]" />
              <span>CRM Sync</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={13} className="text-[#22C55E]" />
              <span>24/7 Auto-Reply</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 w-full">
            <NavLink
              to="/signup"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#166534] to-[#22C55E] text-white font-sans font-semibold text-[16px] tracking-[0.3px] rounded-xl transition-all hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(22,101,52,0.35)] active:scale-97 text-center shadow-lg"
            >
              Get Started
            </NavLink>
            <NavLink
              to="/contact"
              className="w-full sm:w-auto px-8 py-4 bg-slate-900 border border-slate-800 text-slate-200 font-sans font-semibold text-[16px] tracking-[0.3px] rounded-xl transition-all hover:bg-slate-850 hover:text-white active:scale-95 text-center shadow-sm"
            >
              Book a Live Demo
            </NavLink>
          </div>
        </div>
      </section>
    </>
  );
}
