import { ReactNode, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
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
  ChevronDown
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useAuthStore } from '../../store/authStore';

const menuItems = [
  { group: 'Overview', items: [
    { icon: LayoutDashboard, label: 'Insights', path: '/dashboard' },
  ]},
  { group: 'Engagement', items: [
    { icon: Send, label: 'Campaigns', path: '/campaigns' },
    { icon: MessageSquare, label: 'Inbox', path: '/inbox' },
    { icon: FileText, label: 'Templates', path: '/templates' },
  ]},
  { group: 'Audience', items: [
    { icon: Users, label: 'Contacts', path: '/contacts' },
  ]},
  { group: 'Integration', items: [
    { icon: Smartphone, label: 'WhatsApp Business', path: '/settings/whatsapp' },
    { icon: Settings, label: 'Preferences', path: '/settings/whatsapp' },
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
        className="lg:hidden fixed top-4 right-4 z-[60] p-2.5 bg-slate-900 text-white rounded-xl shadow-lg border border-slate-800"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-slate-950 transform transition-transform duration-300 ease-in-out lg:translate-x-0 border-r border-white/5",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-8">
            <div className="flex items-center gap-3.5 group cursor-pointer" onClick={() => navigate('/dashboard')}>
              <div className="w-11 h-11 bg-white text-slate-950 rounded-2xl flex items-center justify-center transition-all group-hover:scale-105 group-hover:rotate-3 shadow-xl shadow-white/10">
                <Zap size={24} fill="currentColor" />
              </div>
              <div>
                <span className="text-xl font-black text-white tracking-tight block leading-none">THROB</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1.5 block">Automation</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 px-4 py-4 overflow-y-auto custom-scrollbar">
            <div className="space-y-8">
              {menuItems.map((group) => (
                <div key={group.group}>
                  <p className="px-4 mb-4 text-[10px] font-bold text-slate-600 uppercase tracking-[0.15em] leading-none">{group.group}</p>
                  <nav className="space-y-1">
                    {group.items.map((item) => (
                      <NavLink
                        key={item.label}
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={({ isActive }) => cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all group relative",
                          isActive 
                            ? "bg-white/10 text-white" 
                            : "text-slate-400 hover:text-white hover:bg-white/5"
                        )}
                      >
                        {({ isActive }) => (
                          <>
                            {isActive && (
                              <div className="absolute left-0 w-1 h-5 bg-white rounded-r-full" />
                            )}
                            <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} className={cn("transition-colors", isActive ? "text-white" : "text-slate-500 group-hover:text-slate-300")} />
                            <span>{item.label}</span>
                          </>
                        )}
                      </NavLink>
                    ))}
                  </nav>
                </div>
              ))}
            </div>
          </div>

          {/* User Profile / Lower Section */}
          <div className="p-4 mt-auto">
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5 group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-200 to-white flex items-center justify-center text-xs font-black text-slate-950 shadow-inner">
                  {user?.name?.substring(0, 2).toUpperCase() || 'AD'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate leading-tight">{user?.name || 'Administrator'}</p>
                  <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-tighter">Enterprise Plan</p>
                </div>
              </div>
              
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl text-xs font-bold transition-all border border-red-500/20 hover:border-red-500"
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export function Header() {
  return (
    <header className="h-16 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-40">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative max-w-md w-full hidden md:block">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search campaigns, logs, or contacts..." 
            className="w-full bg-slate-100/50 border border-transparent rounded-xl py-2 pl-11 pr-4 text-xs focus:bg-white focus:border-slate-200 focus:ring-4 focus:ring-slate-900/5 transition-all font-medium placeholder:text-slate-400"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all relative group">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-slate-900 rounded-full border-2 border-white ring-2 ring-transparent group-hover:ring-slate-100 transition-all" />
        </button>
        
        <div className="h-6 w-[1px] bg-slate-200 mx-1" />
        
        <div className="flex items-center gap-3 pl-2 cursor-pointer group">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-slate-900 leading-none">V2.4 Cloud</span>
            <div className="flex items-center gap-1.5 mt-1">
               <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
               <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Operational</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-slate-100 group-hover:text-slate-600 transition-all">
            <Settings size={18} />
          </div>
        </div>
      </div>
    </header>
  );
}

export function Layout({ children }: { children?: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 selection:bg-slate-900 selection:text-white">
      <Sidebar />
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <Header />
        <main className="p-6 md:p-10 max-w-[1600px] w-full mx-auto animate-in fade-in slide-in-from-bottom-2 duration-700">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
