import { useEffect, useState } from 'react';
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
  UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { crmApi } from '../../services/crmApi';

// ==========================================
// MOCK CLIENT SVG LOGOS
// ==========================================
const StripeLogo = () => (
  <svg className="h-6 opacity-40 hover:opacity-100 hover:text-[#635BFF] transition-all duration-300 fill-current" viewBox="0 0 80 34" xmlns="http://www.w3.org/2000/svg">
    <path d="M41.4 12.3c0-3.3 2.5-4.4 6.7-4.4 3.7 0 7.3.9 10.3 2.5V3.1C55.4 1.7 51.5 1 47.9 1 34.6 1 27.6 8.1 27.6 19c0 9.8 6.7 14.1 16.5 14.1 4 0 7.8-.7 10.7-2.1v-7.3c-2.9 1.5-6.3 2.1-9.4 2.1-5.1 0-7-2-7-6.8h23.2v-1.7H41.4zm0-5c0-1.8 1.2-2.8 3.3-2.8 2.2 0 3.3 1 3.3 2.8H41.4zM24.8 9.5c0-.8-.7-1.4-1.5-1.4h-5.5V1h-9.3v7.1H3c-.8 0-1.4.6-1.4 1.4v6.8c0 .8.6 1.4 1.4 1.4h5.5v15.7h9.3V17.7h5.5c.8 0 1.4-.6 1.4-1.4V9.5z"/>
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
    <path d="M12.2 2L24.4 23H0L12.2 2z"/>
    <text x="32" y="20" className="font-sans font-black tracking-wider text-base">VERCEL</text>
  </svg>
);

const NotionLogo = () => (
  <svg className="h-6 opacity-40 hover:opacity-100 hover:text-slate-900 transition-all duration-300 fill-current" viewBox="0 0 100 24" xmlns="http://www.w3.org/2000/svg">
    <text x="0" y="18" className="font-sans font-black tracking-wider text-lg">NOTION</text>
  </svg>
);

// ==========================================
// HERO SECTION
// ==========================================
export function Hero() {
  // Live Dashboard State Loop (WhatsApp -> CRM -> AI -> Calendar -> Analytics)
  const [pipelineState, setPipelineState] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPipelineState((prev) => (prev + 1) % 5);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[85vh] pt-44 pb-24 px-6 overflow-hidden bg-slate-950 text-white flex flex-col items-center justify-center">
      {/* Background Tech Mesh Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15),transparent_70%)] pointer-events-none z-0" />

      <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10 w-full flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-indigo-500/10 border border-indigo-500/30 rounded-full shadow-lg shadow-indigo-500/5 backdrop-blur-md"
        >
          <Sparkles size={14} className="text-indigo-400 animate-pulse" />
          <span className="font-sans font-[500] text-sm uppercase tracking-[1px] text-indigo-300">API v2.4 Platform Now Live</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-display font-[800] text-[40px] sm:text-[54px] md:text-[68px] lg:text-[76px] leading-[1.05] tracking-[-2.5px] text-white max-w-3xl"
        >
          Unify WhatsApp Marketing & <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-300">Customer CRM</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-sans font-normal text-[18px] md:text-[20px] leading-[1.8] max-w-[720px] text-slate-350 mx-auto"
        >
          Connect your customer database, launch targeted WhatsApp broadcasts, automate birthday greetings, and deploy AI copilot agents to drive repeat sales.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-1 w-full max-w-md"
        >
          <NavLink
            to="/signup"
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-sans font-semibold text-[16px] tracking-[0.3px] rounded-xl transition-all hover:scale-[1.03] hover:shadow-[0_8px_30px_rgba(99,102,241,0.4)] active:scale-97 text-center shadow-lg"
          >
            Start Free Trial
          </NavLink>
          <NavLink
            to="/contact"
            className="w-full sm:w-auto px-8 py-4 bg-slate-900 border border-slate-800 text-slate-200 font-sans font-semibold text-[16px] tracking-[0.3px] rounded-xl transition-all hover:bg-slate-850 hover:text-white active:scale-95 text-center shadow-sm"
          >
            Book Demo
          </NavLink>
        </motion.div>

        {/* Trust Badges Checklist */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="pt-6 border-t border-white/5 flex flex-wrap items-center justify-center gap-y-3 gap-x-6 text-[10.5px] font-bold text-slate-400 uppercase tracking-widest"
        >
          <span className="text-yellow-500 font-sans tracking-normal">★★★★★ Trusted by 2,000+ Businesses</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-indigo-400" /> Official WhatsApp API</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-indigo-400" /> SLA 99.99% Uptime</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-indigo-400" /> GDPR & HIPAA Secure</span>
        </motion.div>
      </div>
    </section>
  );
}

// ==========================================
// TRUSTED BY LOGO MARQUEE SECTION
// ==========================================
export function TrustedBy() {
  return (
    <section className="py-16 border-y border-slate-100 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-10">Trusted by fast-growing SaaS & retail teams globally</p>
        
        {/* Infinite scrolling logo row with responsive Vector SVG logos */}
        <div className="flex w-full overflow-hidden relative">
          <div className="flex gap-24 animate-marquee whitespace-nowrap py-3 shrink-0 items-center">
            <StripeLogo />
            <LinearLogo />
            <HubSpotLogo />
            <VercelLogo />
            <NotionLogo />
            {/* Duplicate for infinite loop */}
            <StripeLogo />
            <LinearLogo />
            <HubSpotLogo />
            <VercelLogo />
            <NotionLogo />
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
    { value: '99.99%', label: 'Platform Uptime', sub: 'SLA Guarantee' },
    { value: '4.9★', label: 'Customer Rating', sub: '2,000+ Reviews' },
    { value: '2 Billion+', label: 'Messages Delivered', sub: 'Meta Cloud API' },
    { value: '150+', label: 'Countries Supported', sub: 'Global Coverage' },
    { value: '24/7', label: 'Priority Support', sub: 'Instant Response' }
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
      color: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
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
          <span className="font-sans font-[500] text-[14px] uppercase tracking-[1px] text-indigo-600 bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-100/50">Capabilities</span>
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
    { num: '1', title: 'Customer Message', desc: 'Inbound message received via WhatsApp, IG, or chat.' },
    { num: '2', title: 'AI Detects Intent', desc: 'Analyzes user context, language, and intent.' },
    { num: '3', title: 'AI Generates Reply', desc: 'Drafts and sends a personalized message in seconds.' },
    { num: '4', title: 'Books Appointment', desc: 'Suggests slots and registers calendar invites.' },
    { num: '5', title: 'Updates CRM', desc: 'Records status and creates custom deals.' },
    { num: '6', title: 'Notifies Sales Team', desc: 'Alerts account managers via unified inbox.' }
  ];

  return (
    <section className="py-32 px-6 bg-slate-950 text-white relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto text-center relative z-10">
        <div className="max-w-2xl mx-auto space-y-4 mb-20 text-center flex flex-col items-center">
          <span className="font-sans font-[500] text-[14px] uppercase tracking-[1px] text-purple-400 bg-purple-500/10 px-3.5 py-1.5 rounded-full border border-purple-500/20">Zero Agent Friction</span>
          <h2 className="font-display font-[700] text-[32px] md:text-[40px] lg:text-[48px] leading-[1.15] tracking-[-1px] text-white">Let AI Handle Every Customer Conversation</h2>
          <p className="font-sans font-normal text-[18px] leading-[1.8] max-w-[620px] text-slate-300">Connect AI to your WhatsApp business settings to automate response generation, support workflows, and pipeline progression dynamically.</p>
        </div>

        {/* Step-by-Step Flow diagram */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 relative">
          {/* Connecting Line Overlay for Desktop */}
          <div className="hidden md:block absolute top-[28px] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-indigo-500/20 via-purple-500/40 to-indigo-500/20 -z-10" />

          {steps.map((s, idx) => (
            <motion.div 
              key={s.num}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="flex flex-col items-center group bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md hover:border-purple-500/30 hover:bg-white/10 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/30 text-purple-400 font-display font-bold rounded-xl flex items-center justify-center text-base shadow-inner group-hover:bg-purple-600 group-hover:text-white group-hover:border-purple-600 transition-all duration-300 relative">
                {s.num}
                {/* Pulse dot */}
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-purple-500 rounded-full animate-pulse" />
              </div>
              <h3 className="font-display font-[700] text-[16px] text-white mt-6 mb-2 tracking-tight group-hover:text-purple-300 transition-colors">{s.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">{s.desc}</p>
            </motion.div>
          ))}
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
    { icon: Smartphone, name: 'SMS', color: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' },
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
                <span className="text-xs font-bold tracking-tight text-slate-200">Shared Unified Inbox</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-lg border border-white/5 text-[9px] font-mono text-slate-400">
                <span>6 ACTIVE CHANNELS</span>
              </div>
            </div>

            {/* Console Body Split */}
            <div className="flex-1 flex gap-4 mt-3 overflow-hidden">
              
              {/* Channel Switcher Sidebar */}
              <div className="w-1/3 border-r border-white/5 pr-3 space-y-2 text-[10.5px] font-bold text-slate-450">
                <div className="p-2 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-between">
                  <span className="flex items-center gap-1.5">💬 WhatsApp</span>
                  <span className="w-4 h-4 bg-indigo-600 text-white text-[8px] rounded-full flex items-center justify-center">4</span>
                </div>
                <div className="p-2 hover:bg-white/5 rounded-xl flex items-center justify-between transition-colors cursor-pointer">
                  <span className="flex items-center gap-1.5 text-slate-300">📸 Instagram</span>
                  <span className="w-4 h-4 bg-pink-500 text-white text-[8px] rounded-full flex items-center justify-center">2</span>
                </div>
                <div className="p-2 hover:bg-white/5 rounded-xl flex items-center gap-1.5 text-slate-400 transition-colors cursor-pointer">
                  <span>👥 Messenger</span>
                </div>
                <div className="p-2 hover:bg-white/5 rounded-xl flex items-center gap-1.5 text-slate-400 transition-colors cursor-pointer">
                  <span>🌐 Live Chat</span>
                </div>
                <div className="p-2 hover:bg-white/5 rounded-xl flex items-center gap-1.5 text-slate-400 transition-colors cursor-pointer">
                  <span>✉️ Email</span>
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
                  <span className="text-[8.5px] text-indigo-400 font-bold bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">AI suggested</span>
                </div>

                {/* Message feed */}
                <div className="flex-1 flex flex-col justify-end gap-3 my-3">
                  
                  {/* Incoming */}
                  <div className="flex flex-col items-start max-w-[85%] self-start space-y-1">
                    <div className="p-3 bg-slate-950 border border-white/5 rounded-2xl rounded-tl-none text-xs leading-relaxed text-slate-200">
                      "Hi! Do you have slots available for a demo call today?"
                    </div>
                    <span className="text-[8px] text-slate-500 font-semibold pl-1">Ahmad • 10:41 AM</span>
                  </div>

                  {/* AI Suggested Response */}
                  <div className="flex flex-col items-end max-w-[85%] self-end space-y-1">
                    <div className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl rounded-tr-none text-xs leading-relaxed text-white relative">
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
                    className="flex-1 bg-slate-950 border border-white/5 rounded-xl h-8 px-3 text-[10px] placeholder-slate-650 focus:outline-none focus:border-indigo-650"
                    disabled
                  />
                  <button className="h-8 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] rounded-xl flex items-center justify-center cursor-default">
                    Send
                  </button>
                </div>

              </div>

            </div>

          </div>
        </div>

        {/* Text Area */}
        <div className="lg:col-span-6 space-y-8 text-left">
          <span className="font-sans font-[500] text-[14px] uppercase tracking-[1px] text-indigo-600 bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-100/50">Omnichannel Hub</span>
          <h2 className="font-display font-[700] text-[32px] md:text-[40px] lg:text-[48px] leading-[1.15] tracking-[-1px] text-slate-900">Unify all your channels in one dashboard</h2>
          <p className="font-sans font-normal text-[18px] leading-[1.8] max-w-[620px] text-slate-500">Stop swapping tabs between WhatsApp settings, Instagram DMs, support emails, and live chat. Throb routes all incoming messages to one shared workspace so agents solve tickets faster.</p>
          
          <div className="grid grid-cols-2 gap-6 pt-4">
            <div className="space-y-2">
              <span className="block text-2xl font-black text-slate-900">45%</span>
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Faster Response Time</span>
            </div>
            <div className="space-y-2">
              <span className="block text-2xl font-black text-slate-900">100%</span>
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Unified Lead Capture</span>
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
          <span className="font-sans font-[500] text-[14px] uppercase tracking-[1px] text-indigo-600 bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-100/50">Core Engine</span>
          <h2 className="font-display font-[700] text-[32px] md:text-[40px] lg:text-[48px] leading-[1.15] tracking-[-1px] text-slate-900">Complete Customer Relationship Pipeline</h2>
          <p className="font-sans font-normal text-[18px] leading-[1.8] max-w-[620px] text-slate-500">Monitor deals, track lead status, view active customer profiles, and review task timelines from one central workspace.</p>
        </div>

        {/* Kanban Board Interface Mockup */}
        <div className="w-full bg-white border border-slate-200 shadow-xl rounded-[2.5rem] p-8 flex flex-col gap-8">
          
          {/* Header of Board */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-6 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse" />
                <h3 className="text-base font-bold text-slate-900 tracking-tight">Throb Active Deals Board</h3>
              </div>
              <span className="text-[11px] font-semibold text-slate-450 mt-0.5 block">Pipeline Value: <strong className="text-indigo-600">$14,600 USD</strong> • 3 active customer profiles</span>
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
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-lg">{col.value}</span>
                </div>

                {/* Cards List inside column */}
                <div className="space-y-3 flex-1">
                  {col.deals.map((deal, dealIdx) => (
                    <div key={dealIdx} className="p-4 bg-white border border-slate-200/60 shadow-sm rounded-2xl flex flex-col gap-3.5 hover:border-indigo-400 hover:shadow-md transition-all duration-350 group">
                      
                      {/* Card Header Profile & Tag */}
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8.5 h-8.5 rounded-xl bg-indigo-50 border border-indigo-100/50 text-indigo-650 flex items-center justify-center text-xs font-bold shadow-sm">
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
          <span className="font-sans font-[500] text-[14px] uppercase tracking-[1px] text-indigo-600 bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-100/50">Automation Flow</span>
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
    <section id="integrations" className="py-32 px-6 bg-slate-950 text-white overflow-hidden relative">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* Text Area */}
        <div className="lg:col-span-5 space-y-8 text-left">
          <span className="font-sans font-[500] text-[14px] uppercase tracking-[1px] text-indigo-400 bg-indigo-500/10 px-3.5 py-1.5 rounded-full border border-indigo-500/20">Unified Metrics</span>
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
          <span className="font-sans font-[500] text-[14px] uppercase tracking-[1px] text-indigo-600 bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-100/50">Connectivity</span>
          <h2 className="font-display font-[700] text-[32px] md:text-[40px] lg:text-[48px] leading-[1.15] tracking-[-1px] text-slate-900">Connected Integrations Ecosystem</h2>
          <p className="font-sans font-normal text-[18px] leading-[1.8] max-w-[620px] text-slate-500">Sync contact fields, events, tags, pipelines, and trigger workflows instantly using secure REST endpoints and native webhooks.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {integrations.map((int) => (
            <div key={int.name} className="p-8 bg-slate-50/50 border border-slate-150 rounded-3xl hover:border-slate-300 transition-colors flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-10 h-10 bg-white border border-slate-200 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
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
      logo: "TechCorp"
    },
    {
      text: "Our marketing workflows became unified in minutes. The WhatsApp Graph API integration is compliant, robust, and performs flawlessly during high-volume promo sales events.",
      author: "Marcus Aurel",
      role: "Founder, FissionMonster",
      stats: "4x Faster Response Time",
      logo: "FissionMonster"
    }
  ];

  return (
    <section id="resources" className="py-32 px-6 bg-white">
      <div className="max-w-7xl mx-auto space-y-24">
        <div className="text-center max-w-xl mx-auto space-y-4">
          <span className="font-sans font-[500] text-[14px] uppercase tracking-[1px] text-indigo-600 bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-100/50">Testimonials</span>
          <h2 className="font-display font-[700] text-[32px] md:text-[40px] lg:text-[48px] leading-[1.15] tracking-[-1px] text-slate-900">Hear it from teams who build on Throb</h2>
          <p className="font-sans font-normal text-[18px] leading-[1.8] max-w-[620px] text-slate-500">See how high-growth startups and local businesses streamline customer support, scale marketing outreach, and automate replies.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {reviews.map((r) => (
            <div key={r.author} className="p-12 bg-slate-50 border border-slate-150 rounded-[3rem] flex flex-col justify-between hover:border-slate-300 transition-all">
              <div className="space-y-6">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-500 text-lg">★</span>
                  ))}
                </div>
                <p className="text-slate-600 font-medium italic text-base leading-relaxed">"{r.text}"</p>
              </div>

              <div className="mt-10 pt-8 border-t border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-sm text-slate-900 block">{r.author}</span>
                  <span className="text-xs text-slate-500 font-medium block mt-1">{r.role}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-indigo-650 block uppercase tracking-wider">{r.stats}</span>
                  <span className="text-[10px] text-slate-400 font-bold block mt-1 uppercase tracking-widest">{r.logo}</span>
                </div>
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
    { name: 'Starter', price: 0, features: ['1,000 Contacts Limit', 'Basic Analytics Tracker', 'Standard Support Line', '5 Automation Workflows'], highlighted: false, key: 'free' },
    { name: 'Business', price: 49, features: ['10,000 Contacts Limit', 'Advanced Workflow Paths', 'Priority 24/7 Support Line', 'Complete CRM Sync'], highlighted: true, key: 'pro' },
    { name: 'Enterprise', price: 'Custom', features: ['Unlimited Contacts Cap', 'Meta API Verification Help', 'Dedicated Manager Assign', 'Full Developer API Access'], highlighted: false, key: 'enterprise' }
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
      price: numericPrice,
      features: [
        `${p.limits.contacts} Contacts Ceiling`,
        `${p.limits.messages} Broadcasts Capacity`,
        p.limits.campaigns.toLowerCase() !== 'disabled' ? 'Automation Campaigns Included' : 'Manual Campaigns Only',
        p.limits.ai_replies.toLowerCase() !== 'disabled' ? `AI replies: ${p.limits.ai_replies}` : 'No AI Copilot Replies',
        'Meta Cloud API Integration'
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
    <section id="pricing" className="py-32 px-6 bg-slate-50/50">
       <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 max-w-xl mx-auto space-y-4">
             <span className="font-sans font-[500] text-[14px] uppercase tracking-[1px] text-indigo-600 bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-100/50">Pricing Plans</span>
             <h2 className="font-display font-[700] text-[32px] md:text-[40px] lg:text-[48px] leading-[1.15] tracking-[-1px] text-slate-900">Flexible plans for high-growth teams</h2>
             <p className="font-sans font-normal text-[18px] leading-[1.8] max-w-[620px] text-slate-500">Choose a plan that fits your business scale. Unlock unlimited contacts, advanced AI auto-replies, automated sequence flows, and CRM integrations.</p>
          </div>

          {/* Monthly / Yearly billing Toggle Switch */}
          <div className="flex items-center justify-center gap-4 mb-20">
            <span className={cn("text-xs font-black uppercase tracking-wider", !isYearly ? "text-slate-900" : "text-slate-400")}>Monthly Billing</span>
            <button 
              onClick={() => setIsYearly(!isYearly)}
              className="w-14 h-7 bg-slate-900 rounded-full p-1 transition-all duration-300 relative focus:outline-none cursor-pointer"
            >
              <div className={cn("w-5 h-5 bg-white rounded-full transition-all duration-300", isYearly ? "translate-x-7" : "translate-x-0")} />
            </button>
            <div className="flex items-center gap-2">
              <span className={cn("text-xs font-black uppercase tracking-wider", isYearly ? "text-indigo-600" : "text-slate-400")}>Yearly Billing</span>
              <span className="text-[8px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-200">Save 20%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {displayPlans.map((plan) => (
               <div key={plan.name} className={cn(
                 "p-12 rounded-[3.5rem] border flex flex-col transition-all duration-300 hover:-translate-y-2 relative overflow-hidden",
                 plan.highlighted 
                   ? "bg-slate-900 text-white border-slate-900 shadow-2xl scale-105 z-10 hover:shadow-[0_15px_40px_rgba(99,102,241,0.2)]" 
                   : "bg-white border-slate-200 text-slate-900 hover:border-slate-300"
               )}>
                  {plan.highlighted && (
                    <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[8.5px] font-black uppercase tracking-widest px-5 py-2.5 rounded-bl-3xl shadow-sm">
                      Most Popular
                    </div>
                  )}

                  <h3 className={cn("text-xs font-bold uppercase tracking-[0.3em] mb-4", plan.highlighted ? "text-indigo-400" : "text-slate-400")}>{plan.name}</h3>
                  <div className="flex items-baseline gap-2 mb-10">
                     <span className="text-5xl font-black tracking-tight">{getPriceLabel(plan)}</span>
                     {plan.price !== 'Custom' && <span className={cn("text-xs font-medium uppercase", plan.highlighted ? "text-slate-400" : "text-slate-450")}>/mo</span>}
                  </div>
                  
                  {isYearly && plan.price !== 'Custom' && (
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-6 -mt-8">Billed annually</span>
                  )}

                  <ul className="space-y-4 mb-12 flex-1">
                     {plan.features.map(f => (
                       <li key={f} className="flex items-center gap-3 text-sm font-medium opacity-80">
                          <div className={cn("w-1.5 h-1.5 rounded-full", plan.highlighted ? "bg-indigo-400" : "bg-slate-900")} />
                          {f}
                       </li>
                     ))}
                  </ul>
                  <NavLink 
                    to={`/signup?plan=${plan.key}`}
                    className={cn(
                      "w-full py-5 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all active:scale-95 cursor-pointer text-center block",
                      plan.highlighted 
                        ? "bg-indigo-600 text-white hover:bg-indigo-750 shadow-lg shadow-indigo-600/20" 
                        : "bg-slate-900 text-white hover:bg-slate-800"
                    )}
                  >
                    Get Started
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
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const faqs = [
    {
      q: "Can I try the platform before subscribing?",
      a: "Yes, you can register for our Starter free plan without entering credit card details. It allows you to explore visual builder automation and sync up to 1,000 contacts instantly."
    },
    {
      q: "How does the WhatsApp Graph API connection work?",
      a: "We connect directly to Meta's official WhatsApp Business Cloud API. You supply your access token and phone number ID, ensuring 100% security, zero server maintenance, and stable delivery speeds."
    },
    {
      q: "Is there any limit to workflows or campaigns?",
      a: "Starter plans support up to 5 workflows. Business and Enterprise plans provide unlimited workflows, allowing custom branches, delayed queues, API integrations, and webhook triggers."
    },
    {
      q: "Can I connect my CRM like HubSpot or Salesforce?",
      a: "Absolutely. Our CRM lead integration pulls leads directly from HubSpot, Salesforce, Facebook Lead Ads, Instagram forms, and webhook links automatically."
    }
  ];

  return (
    <section className="py-32 px-6 bg-white">
      <div className="max-w-4xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <span className="font-sans font-[500] text-[14px] uppercase tracking-[1px] text-indigo-600 bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-100/50">FAQ</span>
          <h2 className="font-display font-[700] text-[32px] md:text-[40px] lg:text-[48px] leading-[1.15] tracking-[-1px] text-slate-900">Frequently Asked Questions</h2>
          <p className="font-sans font-normal text-[18px] leading-[1.8] max-w-[620px] text-slate-500">Find answers to common questions about accounts, setup, billing, automation limits, compliance guidelines, and CRM connections.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div 
                key={idx} 
                className="border border-slate-150 rounded-2xl overflow-hidden bg-slate-50/30 transition-all duration-300 hover:border-slate-300"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-bold text-slate-905 text-sm md:text-base cursor-pointer focus:outline-none"
                >
                  <span>{faq.q}</span>
                  <div className="shrink-0 text-slate-500">
                    {isOpen ? <Minus size={16} strokeWidth={2.5} /> : <Plus size={16} strokeWidth={2.5} />}
                  </div>
                </button>
                
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 text-xs md:text-sm font-medium text-slate-500 leading-relaxed border-t border-slate-100 pt-4">
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
    <section id="contact" className="py-36 px-6 bg-slate-950 text-white text-center relative overflow-hidden">
      {/* Mesh Grid & Radial Glow overlays */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.12),transparent_70%)] pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-10 relative z-10 flex flex-col items-center">
        
        {/* Sparkles tag */}
        <span className="font-sans font-[500] text-[14px] uppercase tracking-[1px] text-indigo-300 bg-indigo-500/10 px-3.5 py-1.5 rounded-full border border-indigo-500/20 flex items-center gap-1.5">
          <Sparkles size={12} className="text-indigo-400 animate-pulse" />
          Get Started Today
        </span>

        {/* Header */}
        <h2 className="font-display font-[800] text-[38px] md:text-[48px] lg:text-[60px] xl:text-[68px] leading-[1.05] tracking-[-2px] text-white max-w-3xl">
          Ready to Transform Customer <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-300">Communication?</span>
        </h2>

        {/* Description */}
        <p className="font-sans font-normal text-[18px] leading-[1.8] max-w-[620px] text-slate-400">
          Join thousands of high-growth teams who automate WhatsApp messages, nurture leads, and scale conversion pipelines automatically.
        </p>
        
        {/* Glassmorphic Checklist Bar */}
        <div className="flex flex-wrap items-center justify-center gap-y-3 gap-x-8 text-[12px] font-semibold text-slate-300 font-sans uppercase tracking-[0.5px] bg-white/5 border border-white/10 px-8 py-3.5 rounded-full backdrop-blur-md">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={13} className="text-indigo-455" />
            <span>Unlimited Messaging</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={13} className="text-indigo-455" />
            <span>AI Included</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={13} className="text-indigo-455" />
            <span>CRM Included</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={13} className="text-indigo-455" />
            <span>No Credit Card</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 w-full">
          <NavLink
            to="/signup"
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-sans font-semibold text-[16px] tracking-[0.3px] rounded-xl transition-all hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(99,102,241,0.4)] active:scale-97 text-center shadow-lg"
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
