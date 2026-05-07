import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { MessageSquare, Menu, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuthStore } from '../../store/authStore';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
      isScrolled ? "py-4 bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm" : "py-6 bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 bg-black text-white rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
            <MessageSquare size={20} strokeWidth={2.5} />
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">throbtech</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {['Features', 'Marketplace', 'Pricing', 'API'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`}
              className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
            >
              {item}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <NavLink 
            to={user ? "/dashboard" : "/login"} 
            className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
          >
            {user ? 'Dashboard' : 'Login'}
          </NavLink>
          {!user && (
            <NavLink 
              to="/register" 
              className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold transition-all hover:bg-slate-800 active:scale-95 shadow-lg shadow-slate-100"
            >
              Start Free
            </NavLink>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-slate-900" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-slate-200 p-6 flex flex-col gap-6 md:hidden animate-in slide-in-from-top-4 duration-300">
          {['Features', 'Marketplace', 'Pricing', 'API'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`}
              className="text-sm font-bold text-slate-600 uppercase tracking-widest"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item}
            </a>
          ))}
          <NavLink 
            to={user ? "/dashboard" : "/login"} 
            className="w-full text-center py-4 rounded-xl bg-slate-50 border border-slate-200 font-bold uppercase tracking-widest text-xs text-slate-900"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {user ? 'Dashboard' : 'Login'}
          </NavLink>
        </div>
      )}
    </nav>
  );
}
