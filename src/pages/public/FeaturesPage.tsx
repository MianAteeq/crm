import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Navbar from '../../components/public/Navbar';
import Footer from '../../components/public/Footer';
import { 
  Send, Database, Clock, Globe, Users, Sparkles, FileText, BarChart3, 
  CheckCircle2, XCircle, ArrowRight, ArrowLeft, Play, Calendar, Zap, 
  MessageSquare, ChevronDown, HelpCircle, Briefcase, Mail, Check, CreditCard, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

// Import the dashboard illustration image
import crmDashboardHero from '../../assets/crm_dashboard_hero.png';

interface FAQItem {
  question: string;
  answer: string;
}

export default function FeaturesPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const faqItems: FAQItem[] = [
    {
      question: "Do I need my own WhatsApp Business API to get started?",
      answer: "No, we assist you with onboarding directly through the official Meta Embedded Signup process. You can connect your phone number and configure official messaging templates in minutes."
    },
    {
      question: "How does the AI response assistant learn about my business?",
      answer: "You can upload files, link website pages, and insert custom Q&A guidelines into your profile settings. The AI agent analyzes this knowledge base to generate highly accurate replies with confidence thresholds."
    },
    {
      question: "Is there a limit on how many CSV/Excel contacts I can upload?",
      answer: "The number of records you can store depends on your subscription tier (up to 1,000 for free and unlimited for Enterprise). Imports are fast, validate automatically, and let you assign labels immediately."
    },
    {
      question: "Can I schedule posts to multiple social pages simultaneously?",
      answer: "Yes. Our Social Planner supports scheduling drafts, custom captions, and media publishing to Facebook, Instagram, TikTok, LinkedIn, and X (Twitter) simultaneously from a unified scheduling calendar."
    }
  ];

  const servicesGrid = [
    {
      icon: Send,
      title: "WhatsApp Campaigns",
      desc: "Bulk broadcast personalized messages to target lists.",
      bullets: ["Bulk broadcasts", "Read receipts tracking", "Quick-reply buttons"],
      route: "/services/whatsapp-campaigns",
      color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
    },
    {
      icon: Users,
      title: "CRM & Contact Hub",
      desc: "Centralize user pipelines and client logs in one screen.",
      bullets: ["Customer timelines", "Contact labeling tags", "Team representative tasks"],
      route: "/services/crm",
      color: "bg-blue-500/10 text-blue-400 border-blue-500/20"
    },
    {
      icon: Sparkles,
      title: "AI Customer Assistant",
      desc: "Deploy AI models to answer chats and reviews 24/7.",
      bullets: ["Contextual auto-drafts", "Google Review SEO", "Confidence analysis"],
      route: "/services/ai-responses",
      color: "bg-amber-500/10 text-amber-400 border-amber-500/20"
    },
    {
      icon: Clock,
      title: "Marketing Automation",
      desc: "Configure timing rules and re-engagement pathways.",
      bullets: ["Birthday greetings", "Service recall offsets", "Zero human friction"],
      route: "/services/automation",
      color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
    },
    {
      icon: Globe,
      title: "Social Media Planner",
      desc: "Draft, schedule, and publish to multiple channels.",
      bullets: ["Facebook & Instagram", "TikTok & LinkedIn scheduler", "Comments monitoring"],
      route: "/services/social-media",
      color: "bg-purple-500/10 text-purple-400 border-purple-500/20"
    },
    {
      icon: Zap,
      title: "Lead Forms Integration",
      desc: "Sync leads from ads directly to contact lists.",
      bullets: ["Instant webhook sync", "FB, TikTok & Snap APIs", "Auto welcome template"],
      route: "/services/lead-forms",
      color: "bg-rose-500/10 text-rose-400 border-rose-500/20"
    },
    {
      icon: FileText,
      title: "Landing Page Builder",
      desc: "Design responsive pages and survey flows.",
      bullets: ["Drag & drop editor", "CRM linked surveys", "Mobile layout optimizations"],
      route: "/services/page-builder",
      color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
    },
    {
      icon: BarChart3,
      title: "Media & Reporting",
      desc: "Secure media vaults and campaign conversion tracking.",
      bullets: ["Performance graphs", "Unified asset folders", "Team speed benchmarks"],
      route: "/services/media-storage",
      color: "bg-violet-500/10 text-violet-400 border-violet-500/20"
    }
  ];

  return (
    <div className="bg-white text-slate-900 min-h-screen selection:bg-indigo-500/20 selection:text-indigo-900 overflow-x-hidden pt-24 font-sans">
      <Navbar />

      <main>
        {/* ==========================================
            PAGE HERO (LIGHT STYLE - CENTERED)
            ========================================== */}
        <section className="pt-48 pb-36 px-6 bg-[#12263A] text-white text-center relative overflow-hidden">
          {/* Background Tech Mesh & Gradients */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#166534]/25 rounded-full blur-[120px] pointer-events-none z-0 mix-blend-screen" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#22C55E]/15 rounded-full blur-[120px] pointer-events-none z-0 mix-blend-screen" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.1),transparent_70%)] pointer-events-none z-0" />
          
          <div className="max-w-4xl mx-auto space-y-6 relative z-10">
            <span className="text-[10px] font-black text-[#F0FDF4] uppercase tracking-[0.2em] bg-[#166534]/30 px-3.5 py-1.5 rounded-full border border-[#22C55E]/30">
              Core Suite Capabilities
            </span>
            <h1 className="font-display font-[800] text-4xl md:text-6xl tracking-tight text-white">
              Everything You Need to Grow Customer Engagement
            </h1>
            <p className="font-sans font-normal text-stone-300 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              From WhatsApp Business API to AI Automation, CRM, Marketing Automation, Landing Pages, Analytics, and Social Media Management — everything is available in one intelligent platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <NavLink to="/signup" className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#166534] to-[#22C55E] text-white font-bold text-sm tracking-wide rounded-xl hover:scale-[1.02] transition-all text-center">
                Start Free Trial
              </NavLink>
              <NavLink to="/contact" className="w-full sm:w-auto px-8 py-3.5 bg-white/10 border border-white/20 text-white font-bold text-sm tracking-wide rounded-xl hover:bg-white/20 transition-all text-center">
                Book Live Demo
              </NavLink>
            </div>
          </div>
        </section>

        {/* ==========================================
            SERVICES OVERVIEW GRID (LIGHT BG)
            ========================================== */}
        <section className="py-28 px-6 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20 max-w-xl mx-auto space-y-4">
              <span className="font-sans font-[500] text-[13px] uppercase tracking-[1.5px] text-indigo-600 bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-100/50">
                Platform Capabilities
              </span>
              <h2 className="font-display font-[700] text-[32px] md:text-[42px] leading-tight tracking-[-1.5px] text-slate-900">
                One Platform, Eight Core Modules
              </h2>
              <p className="font-sans font-normal text-[16px] text-slate-500">
                Forget paying for 8 separate SaaS subscriptions. Our unified CRM workspace handles everything in a single, lightning-fast dashboard.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {servicesGrid.map((item, idx) => (
                <div 
                  key={idx}
                  className="p-8 bg-white border border-slate-200/60 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-slate-100 hover:-translate-y-1.5 transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-6">
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center border transition-colors", item.color)}>
                      <item.icon size={22} strokeWidth={2.5} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-slate-900 tracking-tight">{item.title}</h3>
                      <p className="text-slate-500 font-medium text-xs leading-relaxed">{item.desc}</p>
                    </div>

                    <ul className="space-y-2 pt-2">
                      {item.bullets.map((b, bIdx) => (
                        <li key={bIdx} className="flex items-center gap-2 text-[10.5px] font-semibold text-slate-450">
                          <CheckCircle2 size={12} className="text-indigo-500" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-6 border-t border-slate-100/80 mt-6">
                    <NavLink to={item.route} className="inline-flex items-center gap-1.5 text-xs font-black text-indigo-650 hover:text-indigo-805 transition-colors uppercase tracking-wider leading-none">
                      Learn More <ArrowRight size={12} />
                    </NavLink>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==========================================
            DETAILED SERVICE SECTIONS
            ========================================== */}

        {/* SERVICE 1: Targeted WhatsApp Campaigns */}
        <section className="py-24 px-6 bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Text column */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <span className="text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-100 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                Service 01
              </span>
              <h2 className="font-display font-[700] text-[28px] md:text-[38px] tracking-[-1.5px] text-slate-900 leading-tight">
                Targeted WhatsApp Campaigns
              </h2>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">
                Send personalized WhatsApp campaigns to customer segments based on behavior, purchases, appointments, tags, and interests. Double your bookings and sales targets.
              </p>
              
              <div className="grid grid-cols-2 gap-4 pt-4">
                {["Bulk Messaging", "Audience Segmentation", "Campaign Scheduling", "Delivery Tracking", "Click Tracking", "Read Receipts", "Conversion Analytics"].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Column */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white text-left shadow-xl space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Campaign Builder Console</span>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-450 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">READY</span>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-950/60 border border-white/5 rounded-2xl space-y-2">
                    <span className="text-[9px] text-indigo-400 font-black block uppercase">Template Parameters</span>
                    <p className="text-xs text-slate-200 font-medium">{"Hello {{name}}! Get 20% off our premier Filler Injection service."}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-950 border border-white/5 rounded-xl">
                      <span className="text-[8px] text-slate-500 block uppercase">Sent Broadcast</span>
                      <span className="text-sm font-bold text-white">4,820</span>
                    </div>
                    <div className="p-3 bg-slate-950 border border-white/5 rounded-xl">
                      <span className="text-[8px] text-slate-500 block uppercase">Delivered</span>
                      <span className="text-sm font-bold text-emerald-400">99.9%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SERVICE 2: CRM & Contact Management */}
        <section className="py-24 px-6 bg-slate-50 border-b border-slate-100">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Visual Column (Left for alternation) */}
            <div className="lg:col-span-6 flex justify-center order-last lg:order-first">
              <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-xl text-left space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Contact Pipeline</span>
                  <span className="text-[9.5px] bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-full font-bold">ACTIVE</span>
                </div>
                <div className="space-y-3">
                  <div className="p-3.5 bg-slate-50 border border-slate-150 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="block text-xs font-bold text-slate-800">Muhammad Ahmad</span>
                      <span className="block text-[9px] text-slate-455 mt-0.5">Assigned to: Fatima (Support)</span>
                    </div>
                    <span className="text-[9px] bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded-full font-bold">New Lead</span>
                  </div>
                  <div className="p-3.5 bg-slate-50 border border-slate-150 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="block text-xs font-bold text-slate-800">Sarah Miller</span>
                      <span className="block text-[9px] text-slate-455 mt-0.5">Assigned to: Zayn (Sales)</span>
                    </div>
                    <span className="text-[9px] bg-purple-50 text-purple-600 border border-purple-100 px-2 py-0.5 rounded-full font-bold">Interested</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Text column */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <span className="text-[10px] bg-blue-50 text-blue-600 border border-blue-100 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                Service 02
              </span>
              <h2 className="font-display font-[700] text-[28px] md:text-[38px] tracking-[-1.5px] text-slate-900 leading-tight">
                CRM & Contact Hub
              </h2>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">
                Manage customers from a centralized CRM with complete conversation history and sales pipelines. Map customer tags, activity timelines, and team representative assignments directly.
              </p>
              
              <div className="grid grid-cols-2 gap-4 pt-4">
                {["Customer Profiles", "Contact Tags", "Notes & Comments", "Sales Pipeline", "Team Assignment", "Lead Scoring", "Activity Timeline"].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <CheckCircle2 size={14} className="text-blue-500" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SERVICE 3: AI Customer Assistant */}
        <section className="py-24 px-6 bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Text column */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <span className="text-[10px] bg-amber-50 text-amber-600 border border-amber-100 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                Service 03
              </span>
              <h2 className="font-display font-[700] text-[28px] md:text-[38px] tracking-[-1.5px] text-slate-900 leading-tight">
                AI Customer Assistant
              </h2>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">
                Automate conversations using AI trained on your business knowledge base. Reply instantly to chat messages and Google Reviews with intelligent intent detection.
              </p>
              
              <div className="grid grid-cols-2 gap-4 pt-4">
                {["AI Replies", "AI Summaries", "AI Campaign Generator", "AI Customer Intent Detection", "Smart Suggestions", "Google Review Replies", "WhatsApp AI"].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <CheckCircle2 size={14} className="text-amber-500" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Column */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="w-full max-w-md bg-slate-950 border border-slate-900 rounded-3xl p-6 text-white text-left shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <span className="text-[10px] text-slate-400 font-bold uppercase font-mono">AI Active Assistant</span>
                  <span className="text-[9.5px] text-amber-455 font-bold">98% Confidence</span>
                </div>
                <div className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-1">
                  <span className="text-[7.5px] text-slate-500 uppercase block font-bold">Customer Query</span>
                  <p className="text-[11.5px] text-slate-200">"What time do you close today?"</p>
                </div>
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-1">
                  <span className="text-[7.5px] text-amber-400 uppercase block font-bold">AI Draft Reply</span>
                  <p className="text-[11.5px] text-slate-200">"We are open until 9:00 PM today. Would you like to schedule an appointment?"</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SERVICE 4: Marketing Automation */}
        <section className="py-24 px-6 bg-slate-50 border-b border-slate-100">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Visual Column (Left) */}
            <div className="lg:col-span-6 flex justify-center order-last lg:order-first">
              <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white text-left shadow-xl space-y-4 font-sans">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Workflow Logic</span>
                  <span className="text-[9px] bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded-full font-bold">RUNNING</span>
                </div>
                <div className="space-y-3 text-[11px] font-medium">
                  <div className="p-3 bg-slate-950 border border-white/5 rounded-xl flex items-center gap-2">
                    <span className="text-indigo-400">Trigger</span>
                    <span className="text-slate-400">→</span>
                    <span className="text-white">Lead Created</span>
                  </div>
                  <div className="p-3 bg-slate-950 border border-white/5 rounded-xl flex items-center gap-2">
                    <span className="text-indigo-400">Delay</span>
                    <span className="text-slate-400">→</span>
                    <span className="text-white">Wait 10 Minutes</span>
                  </div>
                  <div className="p-3 bg-indigo-600/20 border border-indigo-500/30 rounded-xl flex items-center gap-2">
                    <span className="text-indigo-300 font-bold">Action</span>
                    <span className="text-indigo-300">→</span>
                    <span className="text-white font-bold">Send WhatsApp Template</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Text column */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <span className="text-[10px] bg-indigo-50 text-indigo-600 border border-indigo-100 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                Service 04
              </span>
              <h2 className="font-display font-[700] text-[28px] md:text-[38px] tracking-[-1.5px] text-slate-900 leading-tight">
                Marketing Automation
              </h2>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">
                Build automated customer journeys without coding. Trigger birthday messages, touch-up alerts, abandoned-cart follow-ups, and review requests at the exact time.
              </p>
              
              <div className="grid grid-cols-2 gap-4 pt-4">
                {["Welcome Messages", "Birthday Wishes", "Appointment Reminders", "Follow-up Sequences", "Review Requests", "Abandoned Leads Reactivation", "Re-engagement Campaigns"].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <CheckCircle2 size={14} className="text-indigo-500" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SERVICE 5: Social Media Planner */}
        <section className="py-24 px-6 bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Text column */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <span className="text-[10px] bg-purple-50 text-purple-600 border border-purple-100 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                Service 05
              </span>
              <h2 className="font-display font-[700] text-[28px] md:text-[38px] tracking-[-1.5px] text-slate-900 leading-tight">
                Social Media Planner
              </h2>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">
                Manage all social platforms from one calendar interface. Schedule drafts, monitor user comments, and evaluate metrics across Facebook, Instagram, TikTok, LinkedIn, and X.
              </p>
              
              <div className="grid grid-cols-2 gap-4 pt-4">
                {["Schedule Posts", "Interactive Calendar", "Post Analytics", "Comment Management", "Team Collaboration", "LinkedIn & X (Twitter) Support", "Facebook & Instagram Pages"].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <CheckCircle2 size={14} className="text-purple-500" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Column */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-xl text-left space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-[10px] text-slate-400 font-bold uppercase font-mono">Planner Schedule</span>
                  <span className="text-[9px] bg-purple-50 text-purple-600 border border-purple-100 px-2 py-0.5 rounded-full font-bold">SYNCED</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl space-y-1">
                    <span className="text-[8px] text-slate-400 block font-bold">TODAY, 4:00 PM</span>
                    <span className="font-bold text-slate-800">Instagram Reel</span>
                    <span className="block text-[8px] text-emerald-600 font-bold font-mono">✓ Published</span>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl space-y-1">
                    <span className="text-[8px] text-slate-400 block font-bold">TOMORROW, 10:00 AM</span>
                    <span className="font-bold text-slate-800">TikTok Video</span>
                    <span className="block text-[8px] text-indigo-600 font-bold font-mono">📅 Scheduled</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SERVICE 6: Lead Form & CRM Integration */}
        <section className="py-24 px-6 bg-slate-50 border-b border-slate-100">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Visual Column (Left) */}
            <div className="lg:col-span-6 flex justify-center order-last lg:order-first">
              <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white text-left shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <span className="text-[10px] text-slate-400 font-bold uppercase font-mono">Integration Network</span>
                  <span className="text-[9px] bg-rose-500/20 text-rose-455 border border-rose-500/30 px-2 py-0.5 rounded-full font-bold font-sans">LIVE</span>
                </div>
                <div className="flex flex-col gap-2.5 font-mono text-[10px]">
                  <div className="p-2.5 bg-slate-950 border border-white/5 rounded-xl flex justify-between items-center">
                    <span>👥 Facebook Lead Ads</span>
                    <span className="text-emerald-400 font-bold">Connected</span>
                  </div>
                  <div className="p-2.5 bg-slate-950 border border-white/5 rounded-xl flex justify-between items-center">
                    <span>🎵 TikTok Lead Sync</span>
                    <span className="text-emerald-400 font-bold">Connected</span>
                  </div>
                  <div className="p-2.5 bg-slate-950 border border-white/5 rounded-xl flex justify-between items-center">
                    <span>👻 Snapchat Webhook</span>
                    <span className="text-emerald-400 font-bold">Connected</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Text column */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <span className="text-[10px] bg-rose-50 text-rose-600 border border-rose-100 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                Service 06
              </span>
              <h2 className="font-display font-[700] text-[28px] md:text-[38px] tracking-[-1.5px] text-slate-900 leading-tight">
                Lead Form & CRM Integration
              </h2>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">
                Automatically capture leads from multiple social platforms and sync them into your CRM instantly. Connect APIs to distribute tasks and trigger immediate WhatsApp follow-ups.
              </p>
              
              <div className="grid grid-cols-2 gap-4 pt-4">
                {["Facebook Lead Ads", "Instagram DM Sync", "TikTok Form Webhooks", "Snapchat Webhooks", "Website Leads", "Landing Page Leads", "Contact Import Validation"].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <CheckCircle2 size={14} className="text-rose-500" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SERVICE 7: Landing Page & Form Builder */}
        <section className="py-24 px-6 bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Text column */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <span className="text-[10px] bg-cyan-50 text-cyan-600 border border-cyan-100 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                Service 07
              </span>
              <h2 className="font-display font-[700] text-[28px] md:text-[38px] tracking-[-1.5px] text-slate-900 leading-tight">
                Landing Page & Form Builder
              </h2>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">
                Create beautiful landing pages, surveys, questionnaire flows, and booking forms without coding. Connect submissions directly to user profiles.
              </p>
              
              <div className="grid grid-cols-2 gap-4 pt-4">
                {["Drag & Drop Editor", "Mobile Responsive Pages", "Custom Domain Names", "CRM Fields Integration", "A/B Testing Paths", "Form Analytics", "Lightweight Layouts"].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <CheckCircle2 size={14} className="text-cyan-500" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Column */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-xl text-left space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-[10px] text-slate-400 font-bold uppercase font-mono">Page Editor Block</span>
                  <span className="text-[9px] bg-cyan-50 text-cyan-600 border border-cyan-100 px-2 py-0.5 rounded-full font-bold">BUILDER</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl text-center text-xs font-bold text-slate-500 border-dashed">
                  [Section Component: Booking Form]
                </div>
                <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-center text-xs font-bold text-indigo-600">
                  Submit Button: Book Now
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SERVICE 8: Media Library & Reporting */}
        <section className="py-24 px-6 bg-slate-50 border-b border-slate-100">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Visual Column (Left) */}
            <div className="lg:col-span-6 flex justify-center order-last lg:order-first">
              <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white text-left shadow-xl space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <span className="text-[10px] text-slate-400 font-bold uppercase font-sans">Folder Manager</span>
                  <span className="text-[9px] text-slate-500">Workspace Storage: 1.4 GB / 10 GB</span>
                </div>
                <div className="space-y-2 font-sans">
                  <div className="p-3 bg-slate-950 border border-white/5 rounded-xl flex items-center justify-between">
                    <span className="flex items-center gap-2">📁 Ad_Creatives</span>
                    <span className="text-[10px] text-slate-500">12 Files</span>
                  </div>
                  <div className="p-3 bg-slate-950 border border-white/5 rounded-xl flex items-center justify-between">
                    <span className="flex items-center gap-2">📁 Campaigns_Analytics</span>
                    <span className="text-[10px] text-slate-500">8 Files</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Text column */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <span className="text-[10px] bg-violet-50 text-violet-600 border border-violet-100 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                Service 08
              </span>
              <h2 className="font-display font-[700] text-[28px] md:text-[38px] tracking-[-1.5px] text-slate-900 leading-tight">
                Media Vault & Metrics
              </h2>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">
                Securely manage media assets and monitor business performance from a unified reports engine. Track revenue streams, customer journeys, and return-on-investment.
              </p>
              
              <div className="grid grid-cols-2 gap-4 pt-4">
                {["Media Library Folders", "Team Performance Speeds", "Campaign Conversion Analytics", "Revenue Tracker Graphs", "Customer Journey Timelines", "ROI Metrics Tracking", "Export Reports (Excel)"].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <CheckCircle2 size={14} className="text-violet-500" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================
            WHY CHOOSE OUR PLATFORM (COMPARISON TABLE)
            ========================================== */}
        <section className="py-28 px-6 bg-white border-b border-slate-100">
          <div className="max-w-5xl mx-auto text-center space-y-16">
            <div className="space-y-4">
              <span className="text-xs font-[500] uppercase tracking-[1.5px] text-indigo-600 bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-100/50">
                Core Comparison
              </span>
              <h2 className="font-display font-[700] text-[32px] md:text-[42px] leading-tight tracking-[-1.5px] text-slate-900">
                Our Platform vs Traditional Tools
              </h2>
              <p className="font-sans font-normal text-slate-500 max-w-xl mx-auto text-sm md:text-base">
                Why use 8 separate tools when you can centralize your customer journey operations inside one dashboard?
              </p>
            </div>

            {/* Comparison Grid Table */}
            <div className="border border-slate-200 rounded-[2rem] overflow-hidden shadow-md">
              <div className="grid grid-cols-3 bg-slate-950 text-white font-bold p-5 border-b border-slate-800 text-[13px] md:text-[14px]">
                <span className="text-left">Feature capabilities</span>
                <span>Our Unified Platform</span>
                <span>Traditional Tools stack</span>
              </div>
              <div className="divide-y divide-slate-150 font-sans text-xs md:text-sm">
                {[
                  { name: "One Integrated Platform", unified: true, traditional: false },
                  { name: "AI Agent Included", unified: true, traditional: false },
                  { name: "CRM Database Included", unified: true, traditional: false },
                  { name: "WhatsApp Business API Connectivity", unified: true, traditional: false },
                  { name: "Marketing Journeys Automation", unified: true, traditional: false },
                  { name: "Media Assets Storage & Analytics", unified: true, traditional: false },
                  { name: "Social Channels Planner Calendar", unified: true, traditional: false },
                  { name: "Landing Pages & Drag Builder", unified: true, traditional: false }
                ].map((row, idx) => (
                  <div key={idx} className="grid grid-cols-3 p-5 items-center bg-white hover:bg-slate-50 transition-colors">
                    <span className="text-left font-bold text-slate-850">{row.name}</span>
                    <span className="flex items-center justify-center text-emerald-600 font-semibold gap-1.5">
                      <Check size={16} className="bg-emerald-100 text-emerald-700 p-0.5 rounded-full" /> Yes
                    </span>
                    <span className="flex items-center justify-center text-red-500 font-semibold gap-1.5">
                      <XCircle size={16} className="text-red-500/30" /> No
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================
            INTEGRATIONS GRID
            ========================================== */}
        <section className="py-28 px-6 bg-slate-50 border-b border-slate-100">
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="text-center max-w-xl mx-auto space-y-4">
              <span className="text-xs font-[500] uppercase tracking-[1.5px] text-indigo-600 bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-100/50">
                Connected Eco-system
              </span>
              <h2 className="font-display font-[700] text-[32px] md:text-[42px] leading-tight tracking-[-1.5px] text-slate-900">
                Connect Your Entire Marketing Stack
              </h2>
              <p className="font-sans font-normal text-slate-500 text-sm md:text-base">
                We integrate with the industry's leading tools, messaging pipelines, ad platforms, and transaction engines.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-6">
              {[
                { name: "WhatsApp", desc: "Official Business Messaging" },
                { name: "Meta Pages", desc: "Facebook Lead Ads sync" },
                { name: "Instagram", desc: "Story comment replies" },
                { name: "TikTok", desc: "Profile Lead sync webhooks" },
                { name: "Google Business", desc: "Local SEO review replies" },
                { name: "Slack Alerts", desc: "Team notifications feed" },
                { name: "Zapier", desc: "Connect 5,000+ app routes" },
                { name: "Stripe", desc: "Billing & invoice pipelines" },
                { name: "HubSpot", desc: "Two-way contact mapping" },
                { name: "Salesforce", desc: "Enterprise account sync" }
              ].map((row, idx) => (
                <div key={idx} className="p-6 bg-white border border-slate-200/60 rounded-2xl shadow-sm flex flex-col justify-center items-center text-center space-y-2">
                  <span className="text-xl">🔌</span>
                  <h4 className="text-sm font-bold text-slate-800">{row.name}</h4>
                  <p className="text-[10px] text-slate-450 leading-relaxed font-medium">{row.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==========================================
            CUSTOMER SUCCESS STORIES (TESTIMONIALS)
            ========================================== */}
        <section className="py-28 px-6 bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="text-center max-w-xl mx-auto space-y-4">
              <span className="text-xs font-[500] uppercase tracking-[1.5px] text-indigo-600 bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-100/50">
                Client Success
              </span>
              <h2 className="font-display font-[700] text-[32px] md:text-[42px] leading-tight tracking-[-1.5px] text-slate-900">
                Real Results From High-Growth Brands
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  stat: "300% More Leads",
                  quote: "By connecting Facebook lead forms directly to automated WhatsApp welcome sequences, our representative conversion rates surged.",
                  author: "Ahmed Malik",
                  role: "Head of Marketing at Clinic Labs"
                },
                {
                  stat: "80% Faster Response",
                  quote: "The AI agent answers customer questions about pricing and hours instantly. Our team only handles warm booking requests now.",
                  author: "Sarah Connor",
                  role: "Operations Director at Elite Dental"
                },
                {
                  stat: "50% More Bookings",
                  quote: "The service recall engine automatically messages clients 6 months post-treatment. Retargeting database sync is a game-changer.",
                  author: "Liam Wright",
                  role: "CEO at Wright Spa Enterprises"
                }
              ].map((row, idx) => (
                <div key={idx} className="p-8 bg-slate-50/50 border border-slate-200/60 rounded-3xl space-y-6 flex flex-col justify-between hover:border-slate-350 transition-colors">
                  <div className="space-y-4">
                    <span className="block text-3xl font-[900] text-indigo-600 font-sans tracking-tight">{row.stat}</span>
                    <p className="text-slate-600 text-xs font-semibold leading-relaxed">"{row.quote}"</p>
                  </div>
                  <div className="border-t border-slate-200/60 pt-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
                      {row.author[0]}
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-slate-800">{row.author}</span>
                      <span className="block text-[10px] text-slate-400">{row.role}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==========================================
            FAQ ACCORDION SECTION
            ========================================== */}
        <section className="py-28 px-6 bg-slate-50 border-b border-slate-100">
          <div className="max-w-4xl mx-auto space-y-16">
            <div className="text-center space-y-4">
              <span className="text-xs font-[500] uppercase tracking-[1.5px] text-indigo-600 bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-100/50">
                Common Questions
              </span>
              <h2 className="font-display font-[700] text-[32px] md:text-[42px] leading-tight tracking-[-1.5px] text-slate-900">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4 font-sans">
              {faqItems.map((item, idx) => (
                <div 
                  key={idx} 
                  className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden transition-all shadow-sm"
                >
                  <button 
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                    className="w-full p-6 text-left flex items-center justify-between font-bold text-slate-850 hover:bg-slate-50/50 transition-colors gap-4"
                  >
                    <span className="text-sm md:text-base tracking-tight">{item.question}</span>
                    <ChevronDown 
                      size={18} 
                      className={cn("text-slate-400 transition-transform duration-300", activeFaq === idx && "rotate-180")} 
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {activeFaq === idx && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 pt-1 text-slate-500 font-medium text-xs leading-relaxed border-t border-slate-100">
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==========================================
            FINAL CTA (DARK STYLE)
            ========================================== */}
        <section className="py-28 px-6 bg-slate-950 text-white relative overflow-hidden">
          {/* Tech grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08),transparent_60%)] pointer-events-none" />

          <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
            <h2 className="font-display font-[800] text-[36px] md:text-[54px] tracking-[-1.5px] leading-tight text-white">
              Ready to Transform Customer Engagement?
            </h2>
            <p className="font-sans font-normal text-slate-400 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
              Launch targeted campaigns, automate chat replies, and centralize your sales workflows. Set up in less than 5 minutes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <NavLink to="/signup" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#166534] to-[#22C55E] text-white font-sans font-semibold text-[15px] tracking-[0.3px] rounded-xl hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(22,101,52,0.3)] transition-all">
                Start Free Trial
              </NavLink>
              <NavLink to="/contact" className="w-full sm:w-auto px-8 py-4 bg-slate-900 border border-slate-800 text-slate-200 font-sans font-semibold text-[15px] tracking-[0.3px] rounded-xl hover:bg-slate-850 hover:text-white transition-all">
                Book Live Demo
              </NavLink>
              <NavLink to="/contact" className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/10 text-white font-sans font-semibold text-[15px] tracking-[0.3px] rounded-xl hover:bg-white/5 transition-all">
                Contact Sales
              </NavLink>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
