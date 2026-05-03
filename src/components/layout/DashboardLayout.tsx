import { ReactNode } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Send, 
  Users, 
  LogOut,
  Plus,
  MessageSquare,
  Inbox,
  Terminal,
  User
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';
import { useAuthStore } from '../../store/authStore';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Inbox, label: 'Inbox', path: '/inbox' },
  { icon: Send, label: 'Campaigns', path: '/campaigns' },
  { icon: Users, label: 'Contacts', path: '/contacts' },
  { icon: MessageSquare, label: 'Templates', path: '/templates' },
  { icon: Terminal, label: 'WhatsApp API', path: '/settings/whatsapp' },
];

export function Sidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="w-60 border-r border-border flex flex-col h-screen fixed left-0 top-0 bg-bg-surface z-50">
      <div className="p-8 flex items-center gap-3">
        <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center shadow-[0_0_15px_var(--color-brand-glow)]">
          <div className="w-4 h-4 bg-white rounded-full"></div>
        </div>
        <span className="text-xl font-display font-bold tracking-tight text-text-primary">throbtech</span>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200",
              isActive 
                ? "bg-white/5 text-white font-medium"
                : "text-slate-400 hover:text-white"
            )}
          >
            <item.icon size={18} className="opacity-70" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-6 border-t border-white/5">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-white/10 shrink-0 overflow-hidden">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <User size={18} className="text-white" />
            )}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-white truncate">{user?.name || 'James Dalton'}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
              {user?.businessName || 'Enterprise Plan'}
            </p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-red-400 hover:bg-red-400/5 rounded-lg transition-colors text-xs font-bold uppercase tracking-widest"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

export function Header() {
  const navigate = useNavigate();
  return (
    <header className="h-20 border-b border-border flex items-center justify-between px-8 bg-bg-base/80 backdrop-blur-xl fixed top-0 right-0 left-60 z-40">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-display font-bold text-text-primary uppercase tracking-tighter">Command Center</h1>
      </div>
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/campaigns/create')}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={16} />
          New Campaign
        </button>
      </div>
    </header>
  );
}

export function Layout({ children }: { children?: ReactNode }) {
  return (
    <div className="min-h-screen bg-bg-base select-none">
      <Sidebar />
      <div className="pl-60 flex flex-col min-h-screen">
        <Header />
        <main className="mt-20 p-8 flex-1">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children || <Outlet />}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
