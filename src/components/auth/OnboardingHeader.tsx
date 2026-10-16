import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, LogOut, ShieldCheck, Mail } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useBrandingStore } from '../../store/brandingStore';

interface OnboardingHeaderProps {
  showLogout?: boolean;
}

export default function OnboardingHeader({ showLogout = true }: OnboardingHeaderProps) {
  const { user, logout } = useAuthStore();
  const { websiteName, websiteLogo } = useBrandingStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 w-full bg-white/95 backdrop-blur-md border-b border-stone-200/80 sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Logo & Platform Title */}
        <Link to="/" className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#166534] rounded-xl p-1">
          {websiteLogo ? (
            <img 
              src={websiteLogo} 
              alt={websiteName || 'Talkinexx'} 
              className="h-8 w-auto max-w-[160px] object-contain rounded-lg shrink-0 transition-transform duration-300 group-hover:scale-105" 
            />
          ) : (
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#166534] to-[#22C55E] flex items-center justify-center shadow-sm shadow-[#166534]/20">
              <Sparkles size={16} className="text-white" />
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-base font-black tracking-tight text-[#12263A] leading-none">
              {websiteName || 'Talkinexx'}
            </span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-[#166534] mt-0.5">
              Onboarding Setup
            </span>
          </div>
        </Link>

        {/* User Context & Sign Out */}
        <div className="flex items-center gap-3">
          {user?.email && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAFAF9] border border-stone-200/80 text-xs font-semibold text-[#57534E]">
              <Mail size={13} className="text-stone-400" />
              <span className="truncate max-w-[200px]">{user.email}</span>
            </div>
          )}

          {showLogout && (
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-stone-500 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
              title="Sign out and return to login"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
