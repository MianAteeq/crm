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
  Plus,
  Compass,
  CornerDownLeft,
  MousePointerClick
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

export function Sidebar() {
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        className="lg:hidden fixed top-6 right-6 z-[60] w-12 h-12 bg-slate-900 text-white rounded-2xl shadow-floating flex items-center justify-center transition-all active:scale-95"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isMobileMenuOpen ? 'close' : 'open'}
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 90 }}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </motion.div>
        </AnimatePresence>
      </button>

      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-slate-950 transform transition-all duration-500 ease-in-out lg:translate-x-0 border-r border-white/5",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full relative overflow-hidden">
          {/* Background Glow */}
          <div className="absolute top-0 left-0 w-full h-[300px] bg-indigo-500/10 blur-[100px] rounded-full -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
          
          {/* Logo Section */}
          <div className="p-10 relative z-10">
            <div className="flex items-center gap-4 group cursor-pointer" onClick={() => navigate('/dashboard')}>
              <div className="w-12 h-12 bg-gradient-to-br from-white to-slate-200 text-slate-950 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-xl shadow-white/5 relative">
                <Command size={24} strokeWidth={2.5} />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full border-2 border-slate-950 animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-white tracking-tighter block leading-none">THROB</span>
                <span className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.3em] mt-2 block opacity-70">Strategic OS</span>
              </div>
            </div>
          </div>

          {/* User Profile - Top (Niche Layout) */}
          <div className="px-6 mb-10 relative z-10">
             <div className="bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-white/10 p-4 flex items-center gap-4 cursor-pointer group transition-all duration-300 rounded-2xl shadow-inner">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-black text-white shadow-lg shadow-indigo-500/20">
                   {user?.name?.substring(0, 1).toUpperCase() || 'A'}
                </div>
                <div className="flex-1 min-w-0">
                   <p className="text-[11px] font-black text-white truncate leading-none uppercase tracking-widest">{user?.name || 'Administrator'}</p>
                   <p className="text-[9px] text-slate-500 font-bold mt-1.5 uppercase tracking-tighter">Enterprise Mode</p>
                </div>
                <ChevronDown size={14} className="text-slate-500 group-hover:text-white transition-colors duration-300" />
             </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 px-4 overflow-y-auto custom-scrollbar relative z-10">
            <div className="space-y-10 pb-10">
              {menuItems.map((group) => (
                <div key={group.group}>
                  <p className="px-6 mb-4 text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] leading-none">{group.group}</p>
                  <nav className="space-y-1.5">
                    {group.items.map((item) => (
                      <NavLink
                        key={item.label}
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={({ isActive }) => cn(
                          "flex items-center gap-4 px-6 py-3.5 rounded-[1.25rem] text-[11px] font-black uppercase tracking-widest transition-all duration-300 group relative overflow-hidden",
                          isActive 
                            ? "bg-white text-slate-950 shadow-xl shadow-white/5" 
                            : "text-slate-400 hover:text-white hover:bg-white/[0.02]"
                        )}
                      >
                        {({ isActive }) => (
                          <>
                            <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} className={cn("relative z-10 transition-all duration-500", isActive ? "text-slate-950 scale-105" : "text-slate-500 group-hover:text-slate-300 group-hover:scale-105")} />
                            <span className="relative z-10">{item.label}</span>
                            {isActive && (
                               <>
                                 <motion.div 
                                   layoutId="activeNav"
                                   className="absolute inset-0 bg-white"
                                   transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                                 />
                                 <div className="absolute left-2 w-1 h-3 rounded-full bg-indigo-500 z-20" />
                               </>
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

          {/* Footer Actions */}
          <div className="p-6 mt-auto border-t border-white/5 relative z-10">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-3 py-3.5 bg-white/[0.02] hover:bg-red-500/[0.08] text-slate-400 hover:text-red-400 rounded-2xl text-[9px] font-bold uppercase tracking-[0.2em] transition-all duration-300 border border-white/5 hover:border-red-500/20"
              >
                 <LogOut size={13} />
                 Sign Out Protocol
              </button>
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
      
      <div className="flex items-center gap-6">
        <button className="relative w-12 h-12 flex items-center justify-center text-slate-455 hover:text-slate-900 hover:bg-slate-50 rounded-2xl transition-all group">
          <Bell size={20} strokeWidth={2.5} />
          <span className="absolute top-3 right-3 w-3 h-3 bg-indigo-600 rounded-full border-2 border-white ring-4 ring-transparent group-hover:ring-indigo-50 transition-all shadow-sm" />
        </button>
        
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
  return (
    <div className="min-h-screen bg-[#fcfcfd] text-slate-900 selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      <Sidebar />
      <div className="lg:pl-72 flex flex-col min-h-screen">
        <Header />
        <main className="p-8 md:p-12 xl:p-16 max-w-[1800px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
