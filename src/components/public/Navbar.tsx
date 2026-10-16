import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  ChevronDown,
  Send,
  Sparkles,
  Clock,
  Database,
  Users,
  Globe,
  FileText,
  BarChart3,
  MessageCircle
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuthStore } from '../../store/authStore';
import { useBrandingStore } from '../../store/brandingStore';
import logoImg from '../../assets/logo-2.png';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const { user } = useAuthStore();
  const { websiteName, websiteLogo } = useBrandingStore();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHomePage = location.pathname === '/';
  const showTransparent = isHomePage && !isScrolled;

  const servicesList = [
    { label: 'Targeted WhatsApp Campaigns', desc: 'Personalized broadcasts with real-time tracking.', href: '/services/whatsapp-campaigns', icon: Send },
    { label: 'Automated WhatsApp Messaging', desc: 'Birthday greetings & automated follow-ups.', href: '/services/automation', icon: Clock },
    { label: 'WhatsApp AI Copilot', desc: 'Automate chat answers & resolve queries 24/7.', href: '/services/ai-responses', icon: Sparkles },
    { label: 'Contact List Retargeting', desc: 'Boost bookings and conversions via WhatsApp.', href: '/services/retargeting', icon: Database },
    { label: 'WhatsApp Analytics', desc: 'Track message delivery, open rates, and ROI.', href: '/services/analytics', icon: BarChart3 }
  ];

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      showTransparent
        ? "py-5 bg-transparent"
        : "py-3 bg-[#12263A] border-b border-white/5 shadow-xl"
    )}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

        {/* Sleek Logo & Brand */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <img
            src={websiteLogo || logoImg}
            alt={websiteName || "Talkinexx"}
            className="h-10 md:h-12 lg:h-13 w-auto max-w-[260px] object-contain shrink-0 transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className={cn("text-[16px] font-semibold leading-[24px] tracking-[0.2px] transition-colors duration-200",
              showTransparent ? "text-slate-300 hover:text-white" : "text-slate-200 hover:text-white"
            )}
          >
            Home
          </Link>

          {/* Services Mega Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setIsServicesOpen(true)}
            onMouseLeave={() => setIsServicesOpen(false)}
          >
            <button className={cn("text-[16px] font-semibold leading-[24px] tracking-[0.2px] transition-colors duration-200 flex items-center gap-1.5 focus:outline-none cursor-pointer py-2",
              showTransparent ? "text-slate-300 hover:text-white" : "text-slate-200 hover:text-white"
            )}>
              Services <ChevronDown size={15} className={cn("transition-transform duration-200 opacity-70", isServicesOpen && "rotate-180")} />
            </button>

            {/* Megamenu layout: Compact Premium */}
            {isServicesOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 z-50 w-[380px]">
                <div className="bg-white rounded-2xl p-2.5 animate-in fade-in zoom-in-95 duration-200 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] ring-1 ring-slate-200/60 text-left flex flex-col gap-1">
                  
                  {/* Services List */}
                  {servicesList.map((item) => (
                    <Link
                      key={item.label}
                      to={item.href}
                      onClick={() => setIsServicesOpen(false)}
                      className="flex items-start gap-4 p-3.5 rounded-xl hover:bg-slate-50 transition-all duration-200 group/item"
                    >
                      <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200/60 text-slate-500 flex items-center justify-center shrink-0 mt-0.5 group-hover/item:border-indigo-200 group-hover/item:bg-indigo-50 group-hover/item:text-indigo-600 transition-colors duration-300">
                        <item.icon size={18} className="group-hover/item:scale-110 transition-transform duration-300" />
                      </div>
                      <div>
                        <span className="block text-[14px] font-bold text-slate-900 group-hover/item:text-indigo-600 transition-colors">{item.label}</span>
                        <span className="block text-[12px] text-slate-500 leading-snug mt-0.5">{item.desc}</span>
                      </div>
                    </Link>
                  ))}
                  
                  {/* Bottom link inside services */}
                  <div className="mt-1 pt-3 border-t border-slate-100 px-3 pb-1 flex items-center justify-between">
                    <span className="text-[12px] font-medium text-slate-500">Need a custom solution?</span>
                    <Link to="/pricing" className="text-[12px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group/custom">
                      View Pricing
                      <span className="group-hover/custom:translate-x-0.5 transition-transform duration-300">→</span>
                    </Link>
                  </div>

                </div>
              </div>
            )}
          </div>

          <Link
            to="/pricing"
            className={cn("text-[16px] font-semibold leading-[24px] tracking-[0.2px] transition-colors duration-200",
              showTransparent ? "text-slate-300 hover:text-white" : "text-slate-200 hover:text-white"
            )}
          >
            Pricing
          </Link>

          <Link
            to="/contact"
            className={cn("text-[16px] font-semibold leading-[24px] tracking-[0.2px] transition-colors duration-200",
              showTransparent ? "text-slate-300 hover:text-white" : "text-slate-200 hover:text-white"
            )}
          >
            Contact
          </Link>
        </div>

        {/* Clean, High-Conversion CTA Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to={user ? "/dashboard" : "/login"}
            className={cn("text-[16px] font-semibold leading-[24px] tracking-[0.2px] transition-colors duration-200",
              showTransparent ? "text-slate-300 hover:text-white" : "text-slate-200 hover:text-white"
            )}
          >
            Login
          </Link>
          <Link
            to="/contact"
            className={cn("px-6 py-3.5 border rounded-xl text-[16px] font-semibold tracking-[0.3px] transition-all duration-200",
              showTransparent
                ? "border-white/20 text-slate-200 hover:bg-white/5 hover:border-white/40"
                : "border-slate-700 text-slate-200 hover:bg-slate-800 hover:border-slate-500"
            )}
          >
            Book Demo
          </Link>
          {!user && (
            <Link
              to="/signup"
              className="px-7 py-3.5 bg-gradient-to-r from-[#166534] to-[#22C55E] text-white rounded-xl text-[16px] font-semibold tracking-[0.3px] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_4px_20px_rgba(22,101,52,0.25)] active:scale-97"
            >
              Start Free Trial
            </Link>
          )}
        </div>

        {/* Mobile menu controls */}
        <div className="md:hidden flex items-center gap-3">
          {!user && (
            <Link
              to="/signup"
              className="px-3.5 py-1.8 bg-gradient-to-r from-[#166534] to-[#22C55E] text-white rounded-lg text-xs font-bold"
            >
              Start Free
            </Link>
          )}
          <button className={cn("focus:outline-none", showTransparent ? "text-white" : "text-slate-200")} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-slate-200/50 p-6 flex flex-col gap-5 md:hidden animate-in slide-in-from-top-4 duration-300 shadow-xl text-left">

          <Link
            to="/"
            className="text-sm font-bold text-slate-800 pb-2 border-b border-slate-100"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>

          <div className="space-y-3">
            <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Services</span>
            {servicesList.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-xs font-bold text-slate-800 hover:text-indigo-650 pl-2"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <Link to="/pricing" className="text-sm font-bold text-slate-800 border-t border-slate-100 pt-4" onClick={() => setIsMobileMenuOpen(false)}>
            Pricing
          </Link>
          <Link to="/contact" className="text-sm font-bold text-slate-800" onClick={() => setIsMobileMenuOpen(false)}>
            Contact
          </Link>

          <div className="border-t border-slate-100 pt-4 flex flex-col gap-3">
            <Link
              to={user ? "/dashboard" : "/login"}
              className="w-full text-center py-3.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-xs text-slate-900"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              to="/contact"
              className="w-full text-center py-3.5 rounded-xl border border-slate-200 font-bold text-xs text-slate-600"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Book Demo
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
