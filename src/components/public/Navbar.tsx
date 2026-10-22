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
import darkLogoImg from '../../assets/logo.png';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
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
      isMobileMenuOpen
        ? "py-3.5 bg-white border-b border-stone-200/90 shadow-md"
        : showTransparent
          ? "py-5 bg-transparent"
          : "py-3.5 bg-[#12263A]/90 backdrop-blur-xl border-b border-white/10 shadow-2xl"
    )}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

        {/* Sleek Logo & Brand */}
        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
          <img
            src={isMobileMenuOpen ? darkLogoImg : (websiteLogo || logoImg)}
            alt={websiteName || "Talkinexx"}
            className="h-8 sm:h-10 md:h-12 w-auto max-w-[135px] xs:max-w-[160px] sm:max-w-[220px] md:max-w-[260px] object-contain shrink-0 transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className={cn("text-[15px] font-semibold tracking-[0.2px] transition-colors duration-200",
              showTransparent ? "text-slate-300 hover:text-white" : "text-stone-300 hover:text-white"
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
            <button className={cn("text-[15px] font-semibold tracking-[0.2px] transition-colors duration-200 flex items-center gap-1.5 focus:outline-none cursor-pointer py-2",
              showTransparent ? "text-slate-300 hover:text-white" : "text-stone-300 hover:text-white"
            )}>
              Services <ChevronDown size={14} className={cn("transition-transform duration-200 opacity-70", isServicesOpen && "rotate-180")} />
            </button>

            {/* Megamenu layout: Compact Premium */}
            {isServicesOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50 w-[380px]">
                <div className="bg-white rounded-2xl p-2.5 animate-in fade-in zoom-in-95 duration-200 shadow-[0_20px_40px_-15px_rgba(18,38,58,0.15)] ring-1 ring-stone-200/80 text-left flex flex-col gap-1">
                  
                  {/* Services List */}
                  {servicesList.map((item) => (
                    <Link
                      key={item.label}
                      to={item.href}
                      onClick={() => setIsServicesOpen(false)}
                      className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-[#F0FDF4] transition-all duration-200 group/item"
                    >
                      <div className="w-9 h-9 rounded-lg bg-stone-50 border border-stone-200/70 text-[#12263A] flex items-center justify-center shrink-0 mt-0.5 group-hover/item:border-[#bbf7d0] group-hover/item:bg-white group-hover/item:text-[#166534] transition-colors duration-200 shadow-2xs">
                        <item.icon size={17} className="group-hover/item:scale-105 transition-transform duration-200" />
                      </div>
                      <div>
                        <span className="block text-[13.5px] font-bold text-[#12263A] group-hover/item:text-[#166534] transition-colors leading-tight">{item.label}</span>
                        <span className="block text-[11.5px] text-[#57534E] leading-snug mt-0.5">{item.desc}</span>
                      </div>
                    </Link>
                  ))}
                  
                  {/* Bottom link inside services */}
                  <div className="mt-1 pt-2.5 border-t border-stone-100 px-3 pb-1 flex items-center justify-between">
                    <span className="text-[12px] font-medium text-stone-500">Need a custom solution?</span>
                    <Link to="/pricing" className="text-[12px] font-bold text-[#166534] hover:text-[#14532d] flex items-center gap-1 group/custom">
                      View Pricing
                      <span className="group-hover/custom:translate-x-0.5 transition-transform duration-200">→</span>
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
        <div className="md:hidden flex items-center">
          <button
            className={cn(
              "p-2 rounded-lg focus:outline-none transition-colors",
              isMobileMenuOpen
                ? "text-stone-800 hover:bg-stone-100"
                : showTransparent
                  ? "text-white hover:bg-white/10"
                  : "text-stone-200 hover:bg-white/10"
            )}
            onClick={() => {
              setIsMobileMenuOpen(!isMobileMenuOpen);
              if (isMobileMenuOpen) setIsMobileServicesOpen(false);
            }}
            aria-label="Toggle navigation"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-stone-200/80 p-5 sm:p-6 flex flex-col gap-3 md:hidden animate-in slide-in-from-top-4 duration-300 shadow-2xl text-left max-h-[85vh] overflow-y-auto">

          <Link
            to="/"
            className="text-sm font-bold text-stone-900 pb-2.5 border-b border-stone-100 hover:text-[#166534] transition-colors block"
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsMobileServicesOpen(false);
            }}
          >
            Home
          </Link>

          {/* Services Accordion Toggle */}
          <div className="border-b border-stone-100 pb-2">
            <button
              type="button"
              onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
              className="w-full flex items-center justify-between py-1 text-sm font-bold text-stone-900 hover:text-[#166534] transition-colors focus:outline-none"
            >
              <span>Services</span>
              <ChevronDown
                size={16}
                className={cn(
                  "text-stone-400 transition-transform duration-200",
                  isMobileServicesOpen && "rotate-180 text-[#166534]"
                )}
              />
            </button>

            {isMobileServicesOpen && (
              <div className="grid grid-cols-1 gap-1 pl-2 pt-2 pb-1 animate-in fade-in slide-in-from-top-1 duration-200">
                {servicesList.map((item) => (
                  <Link
                    key={item.label}
                    to={item.href}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsMobileServicesOpen(false);
                    }}
                    className="flex items-center gap-2.5 py-2 px-2 rounded-xl hover:bg-[#F0FDF4] text-xs font-semibold text-stone-800 hover:text-[#166534] transition-colors group"
                  >
                    <div className="w-6 h-6 rounded-md bg-[#F0FDF4] border border-stone-200/60 text-[#166534] flex items-center justify-center shrink-0">
                      <item.icon size={13} className="text-[#166534]" />
                    </div>
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link 
            to="/pricing" 
            className="text-sm font-bold text-stone-900 pb-2.5 border-b border-stone-100 hover:text-[#166534] transition-colors" 
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsMobileServicesOpen(false);
            }}
          >
            Pricing
          </Link>
          <Link 
            to="/contact" 
            className="text-sm font-bold text-stone-900 hover:text-[#166534] transition-colors" 
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsMobileServicesOpen(false);
            }}
          >
            Contact
          </Link>

          <div className="border-t border-stone-100 pt-3 flex flex-col gap-2.5">
            <Link
              to={user ? "/dashboard" : "/login"}
              className="w-full text-center py-3 rounded-xl bg-stone-100 border border-stone-200 font-bold text-xs text-stone-900 hover:bg-stone-200 transition-colors"
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsMobileServicesOpen(false);
              }}
            >
              Login
            </Link>
            <Link
              to="/contact"
              className="w-full text-center py-3 rounded-xl border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-50 transition-colors"
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsMobileServicesOpen(false);
              }}
            >
              Book Demo
            </Link>
            {!user && (
              <Link
                to="/signup"
                className="w-full text-center py-3 rounded-xl bg-gradient-to-r from-[#166534] to-[#22C55E] text-white font-bold text-xs shadow-md shadow-[#166534]/20 hover:opacity-95 transition-opacity"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsMobileServicesOpen(false);
                }}
              >
                Start Free Trial
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
