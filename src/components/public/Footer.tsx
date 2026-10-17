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
    <footer className="py-24 px-6 border-t border-slate-100 bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-6 xl:gap-8">
          
          {/* Main Info */}
          <div className="sm:col-span-2 lg:col-span-3 space-y-6 text-left lg:pr-4">
            <Link to="/" className="flex items-center">
              <img
                src={websiteLogo || logoImg}
                alt={websiteName || "ThrobTech"}
                className="h-11 md:h-13 w-auto max-w-[260px] object-contain shrink-0"
              />
            </Link>
            <p className="text-xs font-medium text-slate-400 leading-relaxed max-w-sm">
              The enterprise-grade WhatsApp automation platform for teams who value speed, efficiency, and real-time customer engagement.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-all">
                <Twitter size={14} />
              </a>
              <a href="#" className="w-9 h-9 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-all">
                <Github size={14} />
              </a>
              <a href="#" className="w-9 h-9 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-all">
                <Linkedin size={14} />
              </a>
            </div>
          </div>
          
          {/* Company links */}
          <div className="lg:col-span-2">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Company</h4>
            <ul className="space-y-3.5 text-left">
              <li><Link to="/" className="text-xs font-bold text-slate-400 hover:text-white transition-colors">Home Page</Link></li>
              <li><Link to="/pricing" className="text-xs font-bold text-slate-400 hover:text-white transition-colors">Pricing Plans</Link></li>
              <li><Link to="/contact" className="text-xs font-bold text-slate-400 hover:text-white transition-colors">Contact Sales</Link></li>
            </ul>
          </div>

          {/* Services list (reflecting the exact user list) */}
          <div className="lg:col-span-2">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Services</h4>
            <ul className="space-y-3.5 text-left">
              <li><Link to="/services/whatsapp-campaigns" className="text-xs font-bold text-slate-400 hover:text-white transition-colors">WhatsApp Campaigns</Link></li>
              <li><Link to="/services/automation" className="text-xs font-bold text-slate-400 hover:text-white transition-colors">Automated Messaging</Link></li>
              <li><Link to="/services/ai-responses" className="text-xs font-bold text-slate-400 hover:text-white transition-colors">AI Auto Response</Link></li>
              <li><Link to="/services/flow-builder" className="text-xs font-bold text-slate-400 hover:text-white transition-colors">WhatsApp Flow Builder</Link></li>
              <li><Link to="/services/team-inbox" className="text-xs font-bold text-slate-400 hover:text-white transition-colors">Shared Team Inbox</Link></li>
            </ul>
          </div>

          {/* Legal & Trust */}
          <div className="lg:col-span-2">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Trust & Legal</h4>
            <ul className="space-y-3.5 text-left">
              <li><Link to="/privacy" className="text-xs font-bold text-slate-400 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-xs font-bold text-slate-400 hover:text-white transition-colors">Terms & Conditions</Link></li>
              <li><a href="#" className="text-xs font-bold text-slate-400 hover:text-white transition-colors">SLA Guarantee</a></li>
              <li><a href="#" className="text-xs font-bold text-slate-400 hover:text-white transition-colors">Secure by Design</a></li>
            </ul>
          </div>

          {/* Newsletter subscription form */}
          <div className="sm:col-span-2 lg:col-span-3 space-y-4 text-left">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Subscribe to Updates</h4>
            <p className="text-[11px] font-semibold text-slate-400 leading-normal">Get the latest product features, updates, and SaaS benchmarks delivered directly to your inbox weekly.</p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input 
                type="email" 
                placeholder="name@company.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 h-10 px-3 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-650 transition-colors"
                required
              />
              <button 
                type="submit" 
                disabled={loading}
                className="w-10 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center justify-center transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
              >
                <ArrowRight size={14} />
              </button>
            </form>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs font-medium text-slate-500">© {new Date().getFullYear()} {websiteName}. Built for Meta Graph API.</p>
          <div className="flex gap-6">
             <span className="text-[9px] font-bold text-slate-605 uppercase tracking-[0.2em]">Secure by Design</span>
             <span className="text-[9px] font-bold text-slate-605 uppercase tracking-[0.2em]">SLA Guarantee</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
