import { ReactNode, useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Layout as LayoutIcon,
  MessageSquare, 
  Send, 
  Users, 
  Settings, 
  LogOut, 
  FileText,
  Zap,
  Menu,
  X,
  Smartphone,
  Search,
  Bell,
  ChevronDown,
  Sparkles,
  Command,
  Loader2,
  ChevronRight,
  ChevronLeft,
  Plus,
  Compass,
  CornerDownLeft,
  MousePointerClick,
  User as UserIcon,
  Mail,
  Briefcase,
  Copy,
  CheckCircle2,
  Lock,
  Activity,
  Cpu,
  Terminal,
  HelpCircle,
  Shield,
  Workflow
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useAuthStore } from '../../store/authStore';
import { motion, AnimatePresence } from 'motion/react';
import { crmApi } from '../../services/crmApi';
import { whatsappApi } from '../../services/whatsappApi';
import { Contact, Campaign } from '../../types';
import { WhatsAppTemplate } from '../../types/whatsapp';

const menuItems = [
  { group: 'Intelligence', items: [
    { icon: LayoutDashboard, label: 'Insights', path: '/dashboard' },
  ]},
  { group: 'Engagement', items: [
    { icon: Send, label: 'Campaigns', path: '/campaigns' },
    { icon: MessageSquare, label: 'Inbox', path: '/inbox' },
    { icon: LayoutIcon, label: 'Templates', path: '/templates' },
  ]},
  { group: 'Network', items: [
    { icon: Users, label: 'Contacts', path: '/contacts' },
  ]},
  { group: 'Systems', items: [
    { icon: Smartphone, label: 'Integrations', path: '/settings/whatsapp' },
  ]}
];

const GRADIENTS = {
  royal: "from-indigo-500 to-purple-600 shadow-indigo-500/20 bg-gradient-to-br text-white",
  neon: "from-pink-500 to-rose-600 shadow-rose-500/20 bg-gradient-to-br text-white",
  flare: "from-amber-500 to-orange-500 shadow-orange-500/20 bg-gradient-to-br text-white",
  ocean: "from-blue-600 to-cyan-500 shadow-blue-500/20 bg-gradient-to-br text-white",
  emerald: "from-emerald-500 to-teal-600 shadow-emerald-500/20 bg-gradient-to-br text-white",
  charcoal: "from-slate-700 to-zinc-900 shadow-slate-500/10 bg-gradient-to-br text-white",
};

export function Sidebar({ 
  isCollapsed = false, 
  setIsCollapsed = () => {} 
}: { 
  isCollapsed?: boolean; 
  setIsCollapsed?: (v: boolean) => void;
}) {
  const navigate = useNavigate();
  const { logout, user, updateProfile } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Profile modal state
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [selectedGradient, setSelectedGradient] = useState<keyof typeof GRADIENTS>('royal');
  const [isSaving, setIsSaving] = useState(false);
  const [showStatus, setShowStatus] = useState<'success' | 'error' | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // AI Co-pilot State
  const [aiStep, setAiStep] = useState<'idle' | 'simulating' | 'done'>('idle');
  const [aiLogs, setAiLogs] = useState<string[]>([]);

  // Sync data with store
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setBusinessName(user.businessName || '');
      setSelectedGradient((user.avatar as keyof typeof GRADIENTS) || 'royal');
    }
  }, [user, isProfileModalOpen]);

  const handleSaveProfile = async (e: any) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      updateProfile({
        name: name.trim(),
        businessName: businessName.trim(),
        avatar: selectedGradient,
      });
      setShowStatus('success');
      setTimeout(() => {
        setShowStatus(null);
        setIsProfileModalOpen(false);
      }, 1200);
    } catch (err) {
      setShowStatus('error');
      setTimeout(() => setShowStatus(null), 2000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyTenantId = () => {
    if (!user?.tenantId) return;
    navigator.clipboard.writeText(user.tenantId);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const triggerAiPilot = () => {
    setAiStep('simulating');
    setAiLogs(['Booting THROB AI Cortex...', 'Resolving OS endpoints...']);
    
    setTimeout(() => {
      setAiLogs(prev => [...prev, 'Mapping CRM segment patterns...']);
    }, 450);

    setTimeout(() => {
      setAiLogs(prev => [...prev, 'Optimal delivery slot computed.']);
    }, 950);

    setTimeout(() => {
      setAiLogs(prev => [...prev, 'OS Orchestration COMPLETE ✔']);
      setAiStep('done');
    }, 1400);
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        className="lg:hidden fixed top-6 right-6 z-[60] w-12 h-12 bg-[#090d16] text-white rounded-2xl shadow-floating flex items-center justify-center transition-all active:scale-95 border border-white/10"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isMobileMenuOpen ? 'close' : 'open'}
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 90 }}
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </motion.div>
        </AnimatePresence>
      </button>

      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 bg-gradient-to-b from-[#040814] via-[#090f23] to-[#01030a] transform transition-all duration-300 ease-in-out lg:translate-x-0 border-r border-[#1e293b]/50 shadow-[4px_0_30px_rgba(0,0,0,0.7)] flex flex-col justify-between overflow-visible",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        isCollapsed ? "w-20" : "w-72"
      )}>
        {/* Glowing atmospheric auroras */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-indigo-500/5 blur-[80px] rounded-full -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-10 right-0 w-56 h-56 bg-violet-600/5 blur-[70px] rounded-full translate-x-1/3 pointer-events-none" />

        {/* Collapsible Trigger for Desktop */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex absolute right-[-14px] top-12 z-50 w-7 h-7 bg-[#090f23] hover:bg-[#121b36] border border-[#2e3e60]/70 rounded-full text-indigo-400 hover:text-white items-center justify-center cursor-pointer transition-all hover:scale-110 active:scale-95 shadow-[0_0_12px_rgba(99,102,241,0.25)]"
        >
          <ChevronLeft size={12} className={cn("transition-transform duration-300", isCollapsed && "rotate-180")} />
        </button>

        <div className="flex flex-col h-full relative z-10">
          
          {/* 1. Logo Section */}
          <div className={cn("relative transition-all duration-300", isCollapsed ? "p-4 flex justify-center" : "p-8")}>
            <div className={cn("flex items-center gap-3.5 group cursor-pointer", isCollapsed ? "justify-center" : "")} onClick={() => navigate('/dashboard')}>
              <div className="relative w-11 h-11 bg-gradient-to-br from-[#121b36] to-[#040814] border border-[#2e3e60] text-indigo-400 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-105 group-hover:border-indigo-500 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.35)] shadow-inner shrink-0">
                <Cpu size={20} className="text-indigo-400 group-hover:text-white transition-colors" />
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-slate-950 animate-ping" />
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-slate-950" />
              </div>
              {!isCollapsed && (
                <div className="flex flex-col select-none">
                  <span className="text-lg font-black text-white tracking-widest block leading-none flex items-center gap-1.5 font-display">
                    THROB <span className="text-[9px] bg-indigo-500/10 border border-indigo-500/25 px-1.5 py-0.5 rounded text-indigo-400 font-bold uppercase tracking-widest font-sans">OS</span>
                  </span>
                  <span className="text-[8px] font-bold text-slate-500 uppercase tracking-[0.28em] mt-1.5 block opacity-85">Strategic Intelligence</span>
                </div>
              )}
            </div>
          </div>

          {/* 2. Workspace switcher style user card */}
          <div className={cn("px-4 mb-6 relative select-none", isCollapsed ? "flex justify-center" : "")}>
            <div 
              onClick={() => setIsProfileModalOpen(true)}
              className={cn(
                "bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 hover:border-indigo-500/25 flex items-center cursor-pointer group transition-all duration-300 rounded-2xl shadow-xl",
                isCollapsed ? "p-2 justify-center w-12 h-12" : "p-3.5 gap-3.5 w-full"
              )}
            >
              <div className={cn(
                "rounded-xl flex items-center justify-center font-black transition-all duration-300 shrink-0 shadow-md relative group-hover:scale-105",
                isCollapsed ? "w-8 h-8 text-[11px]" : "w-10 h-10 text-xs",
                GRADIENTS[selectedGradient]
              )}>
                {name ? name.substring(0, 1).toUpperCase() : 'A'}
                <span className="absolute bottom-[-1px] right-[-1px] w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#090f23]" />
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-[10px] font-black text-white truncate leading-none uppercase tracking-wider">{businessName || 'Workspace OS'}</p>
                  <p className="text-[8px] text-indigo-400 font-bold mt-1 uppercase tracking-widest flex items-center gap-1">
                    <span className="w-1 h-1 bg-indigo-400 rounded-full animate-pulse" />
                    Secure Core Node
                  </p>
                </div>
              )}
              {!isCollapsed && <ChevronDown size={11} className="text-slate-500 group-hover:text-white transition-colors duration-300 mr-0.5 shrink-0" />}
            </div>
          </div>

          {/* 3 & 4. Navigation & Active indicators */}
          <div className="flex-1 px-1 overflow-y-auto custom-scrollbar relative">
            <div className="space-y-6 pb-6">
              {menuItems.map((group) => (
                <div key={group.group} className="space-y-1">
                  {!isCollapsed ? (
                    <div className="flex items-center justify-between px-6 mb-2 mt-4 select-none">
                      <span className="text-[8.5px] font-bold text-slate-500 uppercase tracking-[0.25em] leading-none">{group.group}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                    </div>
                  ) : (
                    <div className="w-full h-px bg-white/[0.03] my-4" />
                  )}
                  <nav className="space-y-1">
                    {group.items.map((item) => (
                      <NavLink
                        key={item.label}
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={({ isActive }) => cn(
                          "flex items-center rounded-xl text-[10px] font-semibold uppercase tracking-widest transition-all duration-200 group relative cursor-pointer",
                          isCollapsed ? "p-3.5 justify-center mx-2.5" : "px-5 py-3.5 gap-4 mx-3",
                          isActive 
                            ? "bg-gradient-to-r from-indigo-500/10 to-violet-500/5 text-white border border-indigo-500/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_0_12px_rgba(99,102,241,0.06)] font-bold" 
                            : "text-slate-400 hover:text-white hover:bg-white/[0.02] border border-transparent"
                        )}
                      >
                        {({ isActive }) => (
                          <>
                            {/* Animated Left glowing bar on active */}
                            {isActive && (
                              <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r bg-indigo-500 shadow-[0_0_8px_#6366f1] z-20" />
                            )}
                            
                            <item.icon size={16} strokeWidth={isActive ? 2.5 : 2} className={cn("relative z-10 transition-all duration-200 shrink-0", isActive ? "text-indigo-400 scale-105" : "text-slate-500 group-hover:text-indigo-400 group-hover:scale-105")} />
                            
                            {!isCollapsed && (
                              <span className="relative z-10 flex-1">{item.label}</span>
                            )}

                            {/* Hover Tooltips for Collapsed state */}
                            {isCollapsed && (
                              <div className="absolute left-[78px] top-1/2 -translate-y-1/2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-x-1.5 translate-x-[-10px] transition-all duration-250 bg-[#060a16] border border-indigo-500/20 text-white rounded-lg px-3 py-1.5 whitespace-nowrap text-[8px] font-black uppercase tracking-wider shadow-floating z-[70] flex items-center gap-2">
                                <span>{item.label}</span>
                              </div>
                            )}
                          </>
                        )}
                      </NavLink>
                    ))}
                  </nav>
                </div>
              ))}



            </div>
          </div>

          {/* 5 & 6. Hover interactions & Bottom logout/action area */}
          <div className="border-t border-white/[0.04] bg-[#020510]/50 sticky bottom-0 z-20">
            {!isCollapsed ? (
              <div className="p-4">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-3 py-3 bg-[#111827]/40 hover:bg-rose-500/[0.06] text-slate-400 hover:text-rose-400 rounded-xl text-[8.5px] font-black uppercase tracking-widest transition-all duration-250 border border-white/5 hover:border-rose-500/20 cursor-pointer shadow-sm"
                >
                   <LogOut size={12} className="shrink-0" />
                   Sign Out Protocol
                </button>
              </div>
            ) : (
              <div className="p-4 flex flex-col items-center">
                <button 
                  onClick={handleLogout}
                  className="w-10 h-10 flex items-center justify-center bg-[#111827]/40 hover:bg-rose-500/[0.06] text-slate-400 hover:text-rose-400 rounded-xl border border-white/5 hover:border-rose-500/20 cursor-pointer shadow-sm group relative"
                >
                   <LogOut size={12} />
                   <div className="absolute left-[58px] top-1/2 -translate-y-1/2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-x-1.5 translate-x-[-10px] transition-all duration-250 bg-[#060a16] border border-[#2e3e60]/20 text-rose-450 text-rose-400 rounded-lg px-3 py-1.5 whitespace-nowrap text-[8px] font-black uppercase tracking-wider shadow-floating z-[70]">
                     Sign Out Protocol
                   </div>
                </button>
              </div>
            )}
          </div>

        </div>
      </aside>

      {/* Backdrop for mobile */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Profile Settings Modal */}
      <AnimatePresence>
        {isProfileModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Soft Backdrop blur overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!isSaving) setIsProfileModalOpen(false);
              }}
              className="fixed inset-0 bg-slate-950/65 backdrop-blur-md"
            />

            {/* Modal Body Container */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.1 }}
              className="relative w-full max-w-lg bg-white border border-slate-200/90 rounded-3xl shadow-xl overflow-hidden z-[110]"
            >
              <form onSubmit={handleSaveProfile} className="flex flex-col">
                {/* Header Profile Title */}
                <div className="bg-slate-50 border-b border-slate-100 p-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-650"><Settings size={16} /></span>
                    <div>
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Enterprise Profile Settings</h3>
                      <p className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase tracking-wide">Configure identity & design parameters</p>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setIsProfileModalOpen(false)}
                    disabled={isSaving}
                    className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </div>

                <div className="p-8 space-y-6">
                  {/* Avatar Profile Preview & Selector */}
                  <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl flex flex-col sm:flex-row items-center gap-6">
                    <div className={cn(
                      "w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-black transition-all duration-300 shadow-md shrink-0",
                      GRADIENTS[selectedGradient]
                    )}>
                      {name ? name.substring(0, 1).toUpperCase() : 'A'}
                    </div>
                    <div className="flex-1 w-full space-y-2.5">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center sm:text-left">Configure Vector Accent</p>
                      <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                        {Object.keys(GRADIENTS).map((key) => (
                          <button
                            key={key}
                            type="button"
                            onClick={() => setSelectedGradient(key as keyof typeof GRADIENTS)}
                            className={cn(
                              "w-8 h-8 rounded-lg cursor-pointer transition-all duration-300 relative border-2 flex items-center justify-center hover:scale-105 active:scale-95 shadow-sm",
                              GRADIENTS[key as keyof typeof GRADIENTS],
                              selectedGradient === key ? "border-indigo-600 scale-110 shadow" : "border-transparent opacity-85 hover:opacity-100"
                            )}
                          >
                            {selectedGradient === key && <CheckCircle2 size={12} className="text-white drop-shadow" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Form Inputs */}
                  <div className="space-y-4">
                    <div>
                      <label className="block mb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Username</label>
                      <div className="relative">
                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="E.g. Jane Doe"
                          className="w-full bg-slate-50 border border-slate-200/65 rounded-xl py-3 pl-11 pr-4 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-500 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block mb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Enterprise Business Name</label>
                      <div className="relative">
                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input
                          type="text"
                          required
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          placeholder="Corporate Organization"
                          className="w-full bg-slate-50 border border-slate-200/65 rounded-xl py-3 pl-11 pr-4 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-500 transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Corporate Email</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
                          <input
                            type="email"
                            disabled
                            value={email}
                            className="w-full bg-slate-100/80 border border-slate-200/40 rounded-xl py-3 pl-11 pr-4 text-xs font-bold text-[#555] cursor-not-allowed"
                          />
                          <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 opacity-60" size={10} />
                        </div>
                      </div>

                      <div>
                        <label className="block mb-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">System tenant identity</label>
                        <button
                          type="button"
                          onClick={handleCopyTenantId}
                          className="w-full bg-slate-100/80 hover:bg-slate-200/50 border border-slate-200/40 rounded-xl py-3 px-4 text-xs font-bold text-[#555] flex items-center justify-between transition-all group cursor-pointer"
                        >
                          <span className="font-mono text-slate-500">{user?.tenantId || 'Tenant-1'}</span>
                          {isCopied ? (
                            <span className="text-[8.5px] font-black text-indigo-600 uppercase tracking-widest">Copied</span>
                          ) : (
                            <Copy size={11} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Actions */}
                <div className="bg-slate-50 border-t border-slate-100 px-8 py-5 flex items-center justify-between">
                  <div>
                    {showStatus === 'success' && (
                      <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1.5 animate-none">
                        <CheckCircle2 size={12} />
                        Profile Configured!
                      </p>
                    )}
                    {showStatus === 'error' && (
                      <p className="text-[10px] font-black text-red-500 uppercase tracking-widest flex items-center gap-1.5 animate-none">
                        <X size={12} />
                        Update Failed
                      </p>
                    )}
                    {!showStatus && (
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">Syncs to system memory</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={() => setIsProfileModalOpen(false)}
                      className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer"
                    >
                      Cancel Setup
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving || showStatus !== null}
                      className="relative min-w-[120px] px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-950 text-[10px] font-black uppercase tracking-wider text-[#FFFFFF] shadow-md active:scale-95 transition-all cursor-pointer flex items-center justify-center"
                    >
                      {isSaving ? (
                        <Loader2 size={12} className="animate-spin text-[#FFFFFF]" />
                      ) : (
                        "Save Protocol"
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export function Header() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoadedIndex, setHasLoadedIndex] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Campaign Complete',
      desc: '"Q2 Customer Retargeting" has finished broadcasting successfully.',
      time: '15m ago',
      unread: true,
      category: 'campaign'
    },
    {
      id: 2,
      title: 'Template Approved',
      desc: 'Your WhatsApp template "Feedback Loop V2" was approved by Meta.',
      time: '2h ago',
      unread: true,
      category: 'whatsapp'
    },
    {
      id: 3,
      title: 'New Lead Inbound',
      desc: 'A new user (+1 555-019-2834) messaged your active broadcast.',
      time: '1d ago',
      unread: false,
      category: 'inbox'
    },
    {
      id: 4,
      title: 'Database Synced',
      desc: 'Contacts index synchronized with clean schema references.',
      time: '3d ago',
      unread: false,
      category: 'system'
    }
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const clearNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleNotificationClick = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  // Search source indexes
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([]);

  // Keyboard shortcut listener to focus search (Cmd/Ctrl + K and ESC to blur)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsFocused(true);
      }
      if (e.key === 'Escape') {
        setIsFocused(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const loadSearchIndexes = async () => {
    if (hasLoadedIndex) return;
    setIsLoading(true);
    try {
      const [contRes, campRes, tempRes] = await Promise.allSettled([
        crmApi.getContacts(),
        crmApi.getCampaignsList(),
        whatsappApi.fetchTemplates()
      ]);

      if (contRes.status === 'fulfilled') {
        setContacts(contRes.value || []);
      }
      if (campRes.status === 'fulfilled') {
        const value = campRes.value;
        const arrayList = Array.isArray(value) 
          ? value 
          : (value?.data || value?.campaigns || []);
        
        // Map raw database attributes if needed
        const mappedCampaigns = arrayList.map((c: any) => ({
          id: String(c.id),
          name: c.name || 'Untitled Campaign',
          type: c.type || 'Broadcast',
          status: c.status || 'Draft',
          messageContent: c.message_content || c.messageContent || ''
        }));
        setCampaigns(mappedCampaigns);
      }
      if (tempRes.status === 'fulfilled') {
        setTemplates(tempRes.value || []);
      }
      setHasLoadedIndex(true);
    } catch (err) {
      console.warn('Failed to construct live search index:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      loadSearchIndexes();
    }
  }, [isFocused]);

  // Filtering lists
  const matchStr = query.trim().toLowerCase();
  
  const filteredContacts = matchStr 
    ? contacts.filter(c => 
        (c.name || '').toLowerCase().includes(matchStr) ||
        (c.phone || '').toLowerCase().includes(matchStr) ||
        (c.email || '').toLowerCase().includes(matchStr) ||
        (c.company || '').toLowerCase().includes(matchStr)
      ).slice(0, 5)
    : [];

  const filteredCampaigns = matchStr 
    ? campaigns.filter(c => 
        (c.name || '').toLowerCase().includes(matchStr) ||
        (c.status || '').toLowerCase().includes(matchStr) ||
        (c.messageContent || '').toLowerCase().includes(matchStr)
      ).slice(0, 4)
    : [];

  const filteredTemplates = matchStr 
    ? templates.filter(t => 
        (t.name || '').toLowerCase().includes(matchStr) ||
        (t.category || '').toLowerCase().includes(matchStr) ||
        (t.body?.text || '').toLowerCase().includes(matchStr)
      ).slice(0, 4)
    : [];

  const hasResults = filteredContacts.length > 0 || filteredCampaigns.length > 0 || filteredTemplates.length > 0;

  const handleSelectResult = (path: string, searchParam?: string) => {
    setQuery('');
    setIsFocused(false);
    if (searchParam) {
      navigate(`${path}?search=${encodeURIComponent(searchParam)}`);
    } else {
      navigate(path);
    }
  };

  return (
    <header className="h-20 flex items-center justify-between px-10 bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-40">
      {/* Click-away overlay when search results are open */}
      {isFocused && (
        <div 
          className="fixed inset-0 z-40 bg-transparent"
          onClick={() => setIsFocused(false)}
        />
      )}

      <div className="flex items-center gap-6 flex-1 relative z-50">
        <div className="relative max-w-lg w-full hidden md:block group">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-all" strokeWidth={2.5}/>
          <input 
            ref={inputRef}
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="Search Contacts, Campaigns or Templates..." 
            className="w-full bg-slate-50 border border-slate-100/50 rounded-2xl py-3.5 pl-12 pr-12 text-[11px] font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 shadow-inner transition-all placeholder:text-slate-400 placeholder:uppercase placeholder:tracking-widest"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-md text-[9px] font-black text-slate-400 border border-slate-200 uppercase tracking-widest pointer-events-none">
            <Command size={10} strokeWidth={3} className="-mt-0.5" />
            <span>K</span>
          </div>

          <AnimatePresence>
            {isFocused && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="absolute left-0 right-0 mt-4 bg-white border border-slate-200/85 rounded-2xl shadow-floating max-h-[500px] overflow-y-auto z-50 overflow-x-hidden custom-scrollbar flex flex-col"
              >
                {/* Search Meta Info */}
                <div className="bg-slate-50 border-b border-slate-100 px-5 py-3 flex items-center justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  <span>✨ Universal OS Intelligence</span>
                  {isLoading ? (
                    <span className="flex items-center gap-2 text-indigo-600">
                      <Loader2 size={10} className="animate-spin" />
                      Constructing Index...
                    </span>
                  ) : (
                    <span className="text-slate-500">
                      {query ? 'Filter Matches' : 'Command Centre'}
                    </span>
                  )}
                </div>

                <div className="p-4 space-y-4">
                  {/* Empty Query - Quick Shortcuts */}
                  {!query && (
                    <div className="space-y-4">
                      <div>
                        <p className="px-2 mb-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">⚡ QUICK PILOTS</p>
                        <div className="grid grid-cols-2 gap-2">
                          <button 
                            onClick={() => handleSelectResult('/contacts/add')}
                            className="flex items-center gap-3 p-3 text-left rounded-xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-100 hover:border-indigo-100 text-[11px] font-bold text-slate-700 hover:text-indigo-950 transition-all duration-300"
                          >
                            <span className="w-6 h-6 rounded-lg bg-white flex items-center justify-center border border-slate-100 text-indigo-500 group-hover:scale-110 shadow-sm"><Plus size={14} /></span>
                            <span>Add Contact</span>
                          </button>
                          <button 
                            onClick={() => handleSelectResult('/campaigns/add')}
                            className="flex items-center gap-3 p-3 text-left rounded-xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-100 hover:border-indigo-100 text-[11px] font-bold text-slate-700 hover:text-indigo-950 transition-all duration-300"
                          >
                            <span className="w-6 h-6 rounded-lg bg-white flex items-center justify-center border border-slate-100 text-purple-500 group-hover:scale-110 shadow-sm"><Send size={12} /></span>
                            <span>Broadcast Setup</span>
                          </button>
                          <button 
                            onClick={() => handleSelectResult('/templates/add')}
                            className="flex items-center gap-3 p-3 text-left rounded-xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-100 hover:border-indigo-100 text-[11px] font-bold text-slate-700 hover:text-indigo-950 transition-all duration-300"
                          >
                            <span className="w-6 h-6 rounded-lg bg-white flex items-center justify-center border border-slate-100 text-emerald-500 group-hover:scale-110 shadow-sm"><LayoutIcon size={12} /></span>
                            <span>Create Template</span>
                          </button>
                          <button 
                            onClick={() => handleSelectResult('/inbox')}
                            className="flex items-center gap-3 p-3 text-left rounded-xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-100 hover:border-indigo-100 text-[11px] font-bold text-slate-700 hover:text-indigo-950 transition-all duration-300"
                          >
                            <span className="w-6 h-6 rounded-lg bg-white flex items-center justify-center border border-slate-100 text-amber-500 group-hover:scale-110 shadow-sm"><MessageSquare size={12} /></span>
                            <span>Live Inbox</span>
                          </button>
                        </div>
                      </div>

                      <div>
                        <p className="px-2 mb-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">🧭 SYSTEM SHORTCUTS</p>
                        <div className="space-y-1">
                          <button 
                            onClick={() => handleSelectResult('/dashboard')}
                            className="w-full flex items-center justify-between p-2 rounded-lg text-slate-600 hover:text-indigo-950 text-[11px] font-semibold hover:bg-slate-50 transition-all"
                          >
                            <span className="flex items-center gap-2"><Compass size={14} /> Insights Center</span>
                            <span className="text-[9px] tracking-widest text-slate-300">GO/INSIGHTS</span>
                          </button>
                          <button 
                            onClick={() => handleSelectResult('/contacts')}
                            className="w-full flex items-center justify-between p-2 rounded-lg text-slate-600 hover:text-indigo-950 text-[11px] font-semibold hover:bg-slate-50 transition-all"
                          >
                            <span className="flex items-center gap-2"><Users size={14} /> CRM Audience Database</span>
                            <span className="text-[9px] tracking-widest text-slate-300">GO/CONTACTS</span>
                          </button>
                          <button 
                            onClick={() => handleSelectResult('/campaigns')}
                            className="w-full flex items-center justify-between p-2 rounded-lg text-slate-600 hover:text-indigo-950 text-[11px] font-semibold hover:bg-slate-50 transition-all"
                          >
                            <span className="flex items-center gap-2"><Send size={14} /> Engagement Campaigns</span>
                            <span className="text-[9px] tracking-widest text-slate-300">GO/CAMPAIGNS</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Active Query - Search Results */}
                  {query && (
                    <div className="space-y-4">
                      {/* Contacts Results */}
                      {filteredContacts.length > 0 && (
                        <div>
                          <p className="px-2 mb-2 text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-between">
                            <span>Contacts ({filteredContacts.length})</span>
                            <Users size={12} />
                          </p>
                          <div className="space-y-1">
                            {filteredContacts.map(c => (
                              <button
                                key={c.id}
                                onClick={() => handleSelectResult('/contacts', c.name)}
                                className="w-full flex items-center justify-between p-2 text-left rounded-xl hover:bg-slate-50 transition-all flex-row group animate-none"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center text-[10px] font-black uppercase">
                                    {c.name?.substring(0, 1) || 'A'}
                                  </div>
                                  <div>
                                    <p className="text-[11px] font-bold text-slate-900 leading-tight">{c.name}</p>
                                    <p className="text-[9px] font-semibold text-slate-500">{c.phone}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {c.company && (
                                    <span className="hidden sm:inline bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md text-[9px] font-black tracking-tight uppercase leading-none border border-slate-250">
                                      {c.company}
                                    </span>
                                  )}
                                  <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Campaigns Results */}
                      {filteredCampaigns.length > 0 && (
                        <div>
                          <p className="px-2 mb-2 text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-between">
                            <span>Campaigns ({filteredCampaigns.length})</span>
                            <Send size={11} />
                          </p>
                          <div className="space-y-1">
                            {filteredCampaigns.map(c => (
                              <button
                                key={c.id}
                                onClick={() => handleSelectResult('/campaigns', c.name)}
                                className="w-full flex items-center justify-between p-2 text-left rounded-xl hover:bg-slate-50 transition-all group"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-pink-500/10 text-pink-600 flex items-center justify-center text-[10px] font-black uppercase">
                                    <Send size={12} />
                                  </div>
                                  <div>
                                    <p className="text-[11px] font-bold text-slate-900 leading-tight">{c.name}</p>
                                    <p className="text-[9px] font-semibold text-pink-500 uppercase tracking-widest mt-0.5">{c.type}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className={cn(
                                    "px-2 py-0.5 rounded-full text-[8.5px] font-bold tracking-widest uppercase leading-none border",
                                    c.status === 'Running' || c.status === 'Completed' 
                                      ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
                                      : 'bg-amber-50 border-amber-100 text-amber-600'
                                  )}>
                                    {c.status}
                                  </span>
                                  <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Templates Results */}
                      {filteredTemplates.length > 0 && (
                        <div>
                          <p className="px-2 mb-2 text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-between">
                            <span>Templates ({filteredTemplates.length})</span>
                            <LayoutIcon size={12} />
                          </p>
                          <div className="space-y-1">
                            {filteredTemplates.map(t => (
                              <button
                                key={t.id}
                                onClick={() => handleSelectResult('/templates', t.name)}
                                className="w-full flex items-center justify-between p-2 text-left rounded-xl hover:bg-slate-50 transition-all group"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center text-[10px] font-black uppercase">
                                    <LayoutIcon size={12} />
                                  </div>
                                  <div>
                                    <p className="text-[11px] font-bold text-slate-900 leading-tight">{t.name}</p>
                                    <p className="text-[9px] font-semibold text-slate-400 mt-0.5 uppercase tracking-wide">{t.category}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md text-[9px] font-mono leading-none border border-slate-200 lowercase">
                                    {t.language}
                                  </span>
                                  <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Not Found state */}
                      {!hasResults && (
                        <div className="py-8 px-4 text-center">
                          <p className="text-[11px] font-bold text-slate-500">No indexing matches found for "{query}"</p>
                          <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest mt-1.5 hover:underline cursor-pointer flex items-center justify-center gap-1.5" onClick={() => handleSelectResult('/contacts', query)}>
                            <span>Force Search in CRM Contacts</span>
                            <ChevronRight size={10} />
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="bg-slate-50 border-t border-slate-100 px-5 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-between mt-auto animate-none">
                  <span className="flex items-center gap-1.5">
                    <MousePointerClick size={10} />
                    Click element to navigate
                  </span>
                  <span className="flex items-center gap-1 bg-white border border-slate-200 text-slate-400 px-1 py-0.5 rounded-md">
                    <span>ESC TO DISMISS</span>
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Click-away overlay when notifications are open */}
      {showNotifications && (
        <div 
          className="fixed inset-0 z-40 bg-transparent"
          onClick={() => setShowNotifications(false)}
        />
      )}

      <div className="flex items-center gap-6 relative z-50">
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={cn(
              "relative w-12 h-12 flex items-center justify-center rounded-2xl transition-all group cursor-pointer",
              showNotifications 
                ? "bg-indigo-50 text-indigo-600 border border-indigo-100" 
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 border border-transparent"
            )}
          >
            <Bell size={20} strokeWidth={2.5} />
            {unreadCount > 0 && (
              <span className="absolute top-3 right-3 w-3 h-3 bg-indigo-600 rounded-full border-2 border-white ring-4 ring-transparent group-hover:ring-indigo-50 transition-all shadow-sm" />
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="absolute right-0 mt-3 w-96 bg-white border border-slate-250/95 rounded-2xl shadow-floating overflow-hidden z-50 flex flex-col"
              >
                {/* Header */}
                <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-800 uppercase tracking-wider">Alert Center</span>
                    {unreadCount > 0 && (
                      <span className="bg-indigo-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full leading-none">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllAsRead}
                      className="text-[9.5px] font-black text-indigo-600 hover:text-indigo-900 uppercase tracking-widest transition-colors cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                {/* Notifications List */}
                <div className="max-h-[360px] overflow-y-auto custom-scrollbar divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="py-12 px-6 text-center select-none">
                      <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto mb-3 border border-emerald-100">
                        <CheckCircle2 size={16} strokeWidth={2.5} />
                      </div>
                      <p className="text-[11px] font-bold text-slate-900">All Core Systems Nominal</p>
                      <p className="text-[9.5px] font-semibold text-slate-400 mt-1 uppercase tracking-wide">No pending action items or alerts</p>
                    </div>
                  ) : (
                    notifications.map((n) => {
                      const Icon = n.category === 'campaign' ? Send 
                                 : n.category === 'whatsapp' ? LayoutIcon 
                                 : n.category === 'inbox' ? MessageSquare 
                                 : Zap;
                      return (
                        <div 
                          key={n.id}
                          onClick={() => handleNotificationClick(n.id)}
                          className={cn(
                            "p-4 flex items-start gap-3.5 transition-all cursor-pointer group hover:bg-slate-50 relative",
                            n.unread ? "bg-indigo-50/15" : ""
                          )}
                        >
                          {/* Left icon wrapper */}
                          <div className={cn(
                            "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border",
                            n.category === 'campaign' && "bg-indigo-500/5 text-indigo-600 border-indigo-500/10",
                            n.category === 'whatsapp' && "bg-amber-500/5 text-amber-600 border-amber-500/10",
                            n.category === 'inbox' && "bg-rose-500/5 text-rose-600 border-rose-500/10",
                            n.category === 'system' && "bg-emerald-500/5 text-emerald-600 border-emerald-500/10"
                          )}>
                            <Icon size={14} strokeWidth={2.5} />
                          </div>

                          {/* Info content */}
                          <div className="flex-1 min-w-0 pr-4">
                            <div className="flex items-baseline justify-between gap-2">
                              <p className={cn(
                                "text-[11px] leading-tight truncate",
                                n.unread ? "font-extrabold text-slate-900" : "font-semibold text-slate-700"
                              )}>
                                {n.title}
                              </p>
                              <span className="text-[8.5px] font-bold text-slate-400 uppercase whitespace-nowrap shrink-0">{n.time}</span>
                            </div>
                            <p className="text-[9.5px] text-slate-500 font-medium leading-relaxed mt-0.5">{n.desc}</p>
                          </div>

                          {/* Quick dismiss button */}
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              clearNotification(n.id);
                            }}
                            className="absolute right-3.5 top-4 opacity-0 group-hover:opacity-100 hover:bg-slate-250/20 p-1 rounded-md text-slate-400 hover:text-slate-700 transition-all cursor-pointer focus:outline-none"
                          >
                            <X size={12} strokeWidth={3} />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Simulator Footer */}
                <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[7.5px] font-black text-slate-400 uppercase tracking-wider">Interactive Sandbox Alert</span>
                  <button
                    onClick={() => {
                      const id = Date.now();
                      const mockAlerts = [
                        { id, title: 'Inbound WhatsApp Reply', desc: 'New system event: incoming broadcast query from lead +33 605 2921.', category: 'inbox', time: 'Just now', unread: true },
                        { id, title: 'Network Backup Triggered', desc: 'Secure database backup accomplished on high frequency node.', category: 'system', time: 'Just now', unread: true },
                        { id, title: 'High Peak Engagement', desc: 'Real-time campaign open rate exceeded target matrix.', category: 'campaign', time: 'Just now', unread: true }
                      ];
                      const selectedAlert = mockAlerts[Math.floor(Math.random() * mockAlerts.length)];
                      setNotifications(prev => [selectedAlert, ...prev]);
                    }}
                    className="flex items-center gap-1 bg-white border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/30 text-slate-500 hover:text-indigo-600 px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer shadow-sm"
                  >
                    <Plus size={9} strokeWidth={3} />
                    <span>Trigger Mock Alert</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="h-8 w-px bg-slate-200 mx-1" />
        
        <div className="flex items-center gap-4 pl-2 cursor-pointer group">
          <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:border-slate-900 group-hover:text-white transition-all shadow-premium group-hover:shadow-floating">
            <Settings size={20} strokeWidth={2.5} />
          </div>
        </div>
      </div>
    </header>
  );
}

export function Layout({ children }: { children?: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const stored = localStorage.getItem('sidebar_is_collapsed');
    return stored === 'true';
  });

  const toggleCollapsed = (val: boolean) => {
    setIsCollapsed(val);
    localStorage.setItem('sidebar_is_collapsed', String(val));
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] text-slate-900 selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={toggleCollapsed} />
      <div className={cn(
        "flex flex-col min-h-screen transition-all duration-300 ease-in-out",
        isCollapsed ? "lg:pl-20" : "lg:pl-72"
      )}>
        <Header />
        <main className="p-8 md:p-12 xl:p-16 max-w-[1800px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
