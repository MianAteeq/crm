import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Menu, X, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuthStore } from '../../store/authStore';

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { isAuthenticated, logout } = useAuthStore();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-surface/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-brand text-black rounded-xl flex items-center justify-center shadow-lg shadow-brand/20 transition-transform group-hover:scale-110">
            <MessageSquare size={24} strokeWidth={3} />
          </div>
          <span className="text-2xl font-black text-white uppercase tracking-tighter">throbtech</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-10">
          <a href="#features" className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] hover:text-white transition-colors">Features</a>
          <a href="#pricing" className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] hover:text-white transition-colors">Pricing</a>
          <a href="#how-it-works" className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] hover:text-white transition-colors">How it works</a>
        </div>

        <div className="hidden lg:flex items-center gap-6">
          {isAuthenticated ? (
            <>
              <Link to="/inbox" className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Dashboard</Link>
              <button onClick={logout} className="px-6 py-3 bg-bg-surface3 border border-border text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:border-brand/40 transition-all">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] hover:text-white">Login</Link>
              <Link to="/signup" className="px-8 py-3 bg-brand text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:brightness-110 transition-all flex items-center gap-2">
                Start Free Trial <ArrowRight size={14} />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="lg:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden absolute top-20 left-0 right-0 bg-bg-surface border-b border-border p-6 space-y-6 animate-in slide-in-from-top duration-300">
          <a href="#features" className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Features</a>
          <a href="#pricing" className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Pricing</a>
          <div className="pt-6 border-t border-border flex flex-col gap-4">
             <Link to="/login" className="w-full text-center py-4 bg-bg-surface3 rounded-xl text-[10px] font-black uppercase text-white tracking-widest">Login</Link>
             <Link to="/signup" className="w-full text-center py-4 bg-brand rounded-xl text-[10px] font-black uppercase text-black tracking-widest">Start Free Trial</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
