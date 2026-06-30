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

  const servicesColumn1 = [
    { label: 'Targeted WhatsApp Campaigns', desc: 'Personalized broadcasts with real-time tracking.', href: '/services/whatsapp-campaigns', icon: Send },
    { label: 'Automated Messaging', desc: 'Birthday greetings & service touch-up reminders.', href: '/services/automation', icon: Clock },
    { label: 'AI-Powered Responses', desc: 'Automate chat answers & Google reviews with AI.', href: '/services/ai-responses', icon: Sparkles },
    { label: 'Data Upload & Retargeting', desc: 'Boost database bookings and conversions.', href: '/services/retargeting', icon: Database }
  ];

  const servicesColumn2 = [
    { label: 'Lead Form CRM Integration', desc: 'Capture lead data from FB, IG, TikTok, Snapchat.', href: '/services/lead-forms', icon: Users },
    { label: 'Social Media Planner', desc: 'Schedule posts & measure cross-channel engagement.', href: '/services/social-media', icon: Globe },
    { label: 'Page & Form Builder', desc: 'Build landing pages & surveys linking to CRM.', href: '/services/page-builder', icon: FileText },
    { label: 'Media Storage & Reporting', desc: 'Secure asset folders & performance metrics dashboards.', href: '/services/media-storage', icon: BarChart3 }
  ];

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      showTransparent 
        ? "py-5 bg-transparent"
        : "py-3 bg-white/80 backdrop-blur-xl border-b border-slate-200/40 shadow-glass"
    )}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* Sleek Logo & Brand */}
        <Link to="/" className="flex items-center gap-2 group">
          {websiteLogo ? (
            <img src={websiteLogo} alt="Logo" className="w-9 h-9 object-contain rounded-lg shrink-0 transition-transform duration-300 group-hover:scale-105" />
          ) : (
            <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shadow-sm",
              showTransparent ? "bg-white text-slate-950" : "bg-slate-950 text-white"
            )}>
              <MessageCircle size={18} strokeWidth={2.5} />
            </div>
          )}
          <span className={cn("text-xl font-bold tracking-tight transition-colors duration-200",
            showTransparent ? "text-white group-hover:text-indigo-400" : "text-slate-900 group-hover:text-indigo-650"
          )}>{websiteName}</span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          
          {/* Services Mega Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setIsServicesOpen(true)}
            onMouseLeave={() => setIsServicesOpen(false)}
          >
            <button className={cn("text-[16px] font-semibold leading-[24px] tracking-[0.2px] transition-colors duration-200 flex items-center gap-1.5 focus:outline-none cursor-pointer py-2",
              showTransparent ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
            )}>
              Services <ChevronDown size={15} className={cn("transition-transform duration-200 opacity-70", isServicesOpen && "rotate-180")} />
            </button>

            {/* Megamenu layout: 2 Columns of Services */}
            {isServicesOpen && (
              <div className="absolute top-full left-[-220px] mt-1 w-[680px] bg-white border border-slate-200/50 shadow-2xl rounded-2xl p-6 animate-in fade-in duration-200 z-50 grid grid-cols-2 gap-x-8 gap-y-4 text-left">
                
                {/* Column 1 */}
                <div className="space-y-4">
                  <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1.5">Messaging & Automation</span>
                  <div className="space-y-2">
                    {servicesColumn1.map((item) => (
                      <Link 
                        key={item.label}
                        to={item.href}
                        onClick={() => setIsServicesOpen(false)}
                        className="flex items-start gap-3.5 p-2 rounded-xl hover:bg-slate-50 transition-colors group/item"
                      >
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100/50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5 group-hover/item:bg-indigo-600 group-hover/item:text-white transition-all">
                          <item.icon size={15} />
                        </div>
                        <div>
                          <span className="block text-xs font-bold text-slate-800 group-hover/item:text-indigo-650 transition-colors">{item.label}</span>
                          <span className="block text-[10.5px] text-slate-455 mt-0.5 leading-normal">{item.desc}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Column 2 */}
                <div className="space-y-4">
                  <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1.5">Marketing & Integration</span>
                  <div className="space-y-2">
                    {servicesColumn2.map((item) => (
                      <Link 
                        key={item.label}
                        to={item.href}
                        onClick={() => setIsServicesOpen(false)}
                        className="flex items-start gap-3.5 p-2 rounded-xl hover:bg-slate-50 transition-colors group/item"
                      >
                        <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 text-slate-650 flex items-center justify-center shrink-0 mt-0.5 group-hover/item:bg-indigo-600 group-hover/item:text-white transition-all">
                          <item.icon size={15} />
                        </div>
                        <div>
                          <span className="block text-xs font-bold text-slate-800 group-hover/item:text-indigo-650 transition-colors">{item.label}</span>
                          <span className="block text-[10.5px] text-slate-455 mt-0.5 leading-normal">{item.desc}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

              </div>
            )}
          </div>

          <Link 
            to="/pricing" 
            className={cn("text-[16px] font-semibold leading-[24px] tracking-[0.2px] transition-colors duration-200",
              showTransparent ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
            )}
          >
            Pricing
          </Link>

          <Link 
            to="/contact" 
            className={cn("text-[16px] font-semibold leading-[24px] tracking-[0.2px] transition-colors duration-200",
              showTransparent ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
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
              showTransparent ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
            )}
          >
            Login
          </Link>
          <Link 
            to="/contact" 
            className={cn("px-6 py-3.5 border rounded-xl text-[16px] font-semibold tracking-[0.3px] transition-all duration-200",
              showTransparent 
                ? "border-white/20 text-slate-200 hover:bg-white/5 hover:border-white/40"
                : "border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-400" 
            )}
          >
            Book Demo
          </Link>
          {!user && (
            <Link 
              to="/signup" 
              className="px-7 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-[16px] font-semibold tracking-[0.3px] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_4px_20px_rgba(99,102,241,0.25)] active:scale-97"
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
              className="px-3.5 py-1.8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-xs font-bold"
            >
              Start Free
            </Link>
          )}
          <button className={cn("focus:outline-none", showTransparent ? "text-white" : "text-slate-900")} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-slate-200/50 p-6 flex flex-col gap-5 md:hidden animate-in slide-in-from-top-4 duration-300 shadow-xl text-left">
          
          <div className="space-y-3">
            <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Services</span>
            {[...servicesColumn1, ...servicesColumn2].map((item) => (
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
