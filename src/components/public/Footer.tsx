import React, { useState } from 'react';
import { MessageSquare, Twitter, Github, Linkedin, ArrowRight, MessageCircle } from 'lucide-react';
import { useBrandingStore } from '../../store/brandingStore';
import { Link } from 'react-router-dom';
import { toast } from '../ui/Toast';
import logoImg from '../../assets/logo-2.png';

export default function Footer() {
  const { websiteName, websiteLogo } = useBrandingStore();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Subscription Confirmed', 'You have been registered for our weekly updates.');
      setEmail('');
    }, 800);
  };

  return (
    <footer className="py-14 sm:py-20 md:py-24 px-5 sm:px-6 border-t border-white/10 bg-[#07131e] text-white relative overflow-hidden">
      {/* Subtle ambient glow in background */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-[#166534]/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 xl:gap-10">
          
          {/* Main Info */}
          <div className="md:col-span-2 lg:col-span-4 space-y-5 text-left">
            <Link to="/" className="inline-block">
              <img
                src={websiteLogo || logoImg}
                alt={websiteName || "Talkinexx"}
                className="h-9 sm:h-11 md:h-12 w-auto max-w-[180px] sm:max-w-[220px] object-contain shrink-0"
              />
            </Link>
            <p className="text-xs sm:text-sm font-normal text-stone-400 leading-relaxed max-w-sm">
              The enterprise-grade WhatsApp automation platform for teams who value speed, efficiency, and real-time customer engagement.
            </p>
            <div className="flex items-center gap-2.5 pt-1">
              <a 
                href="#" 
                aria-label="Twitter"
                className="w-9 h-9 bg-white/5 hover:bg-[#166534]/20 border border-white/10 hover:border-[#22C55E]/40 rounded-xl flex items-center justify-center text-stone-400 hover:text-[#86efac] transition-all shadow-xs"
              >
                <Twitter size={14} />
              </a>
              <a 
                href="#" 
                aria-label="GitHub"
                className="w-9 h-9 bg-white/5 hover:bg-[#166534]/20 border border-white/10 hover:border-[#22C55E]/40 rounded-xl flex items-center justify-center text-stone-400 hover:text-[#86efac] transition-all shadow-xs"
              >
                <Github size={14} />
              </a>
              <a 
                href="#" 
                aria-label="LinkedIn"
                className="w-9 h-9 bg-white/5 hover:bg-[#166534]/20 border border-white/10 hover:border-[#22C55E]/40 rounded-xl flex items-center justify-center text-stone-400 hover:text-[#86efac] transition-all shadow-xs"
              >
                <Linkedin size={14} />
              </a>
            </div>
          </div>

          {/* Quick Links on Mobile: 2-column side-by-side grid */}
          <div className="md:col-span-2 lg:col-span-4 grid grid-cols-2 gap-8 text-left">
            {/* Services list */}
            <div>
              <h4 className="text-[11px] font-black text-[#22C55E] uppercase tracking-widest mb-4 sm:mb-5">Services</h4>
              <ul className="space-y-3">
                <li><Link to="/services/whatsapp-campaigns" className="text-xs font-semibold text-stone-300 hover:text-white transition-colors block">Campaigns</Link></li>
                <li><Link to="/services/automation" className="text-xs font-semibold text-stone-300 hover:text-white transition-colors block">Automated Messaging</Link></li>
                <li><Link to="/services/ai-responses" className="text-xs font-semibold text-stone-300 hover:text-white transition-colors block">AI Auto Response</Link></li>
                <li><Link to="/services/flow-builder" className="text-xs font-semibold text-stone-300 hover:text-white transition-colors block">Flow Builder</Link></li>
                <li><Link to="/services/team-inbox" className="text-xs font-semibold text-stone-300 hover:text-white transition-colors block">Team Inbox</Link></li>
              </ul>
            </div>

            {/* Company & Legal */}
            <div className="space-y-6">
              <div>
                <h4 className="text-[11px] font-black text-stone-400 uppercase tracking-widest mb-4 sm:mb-5">Company</h4>
                <ul className="space-y-3">
                  <li><Link to="/" className="text-xs font-semibold text-stone-300 hover:text-white transition-colors block">Home</Link></li>
                  <li><Link to="/pricing" className="text-xs font-semibold text-stone-300 hover:text-white transition-colors block">Pricing Plans</Link></li>
                  <li><Link to="/contact" className="text-xs font-semibold text-stone-300 hover:text-white transition-colors block">Contact Sales</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="text-[11px] font-black text-stone-400 uppercase tracking-widest mb-3">Trust</h4>
                <ul className="space-y-2.5">
                  <li><Link to="/privacy" className="text-xs font-semibold text-stone-400 hover:text-stone-200 transition-colors block">Privacy Policy</Link></li>
                  <li><Link to="/terms" className="text-xs font-semibold text-stone-400 hover:text-stone-200 transition-colors block">Terms of Service</Link></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Newsletter subscription form */}
          <div className="md:col-span-2 lg:col-span-4 text-left">
            <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3.5 shadow-lg backdrop-blur-sm">
              <h4 className="text-[11px] font-black text-stone-300 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
                Subscribe to Updates
              </h4>
              <p className="text-xs font-normal text-stone-400 leading-relaxed">
                Get the latest product features, updates, and SaaS benchmarks delivered directly to your inbox weekly.
              </p>
              <form onSubmit={handleSubscribe} className="flex gap-2 pt-1">
                <input 
                  type="email" 
                  placeholder="name@company.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 min-w-0 h-10 px-3.5 bg-[#0a1826] border border-white/10 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#22C55E] transition-colors"
                  required
                />
                <button 
                  type="submit" 
                  disabled={loading}
                  aria-label="Subscribe"
                  className="w-10 h-10 bg-gradient-to-r from-[#166534] to-[#22C55E] hover:from-[#14532d] hover:to-[#16a34a] text-white rounded-xl flex items-center justify-center transition-all shrink-0 disabled:opacity-50 cursor-pointer shadow-md shadow-[#166534]/20 active:scale-95"
                >
                  <ArrowRight size={14} />
                </button>
              </form>
            </div>
          </div>

        </div>

        {/* Bottom Sub-footer */}
        <div className="pt-6 sm:pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-xs font-medium text-stone-400">
            © {new Date().getFullYear()} {websiteName || 'Talkinexx'}. Built for Meta Graph API.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
              Secure by Design
            </span>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
              SLA Guarantee
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
