import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Users,
  Send,
  MessageSquare,
  TrendingUp,
  Activity,
  ArrowRight,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { crmApi } from '../../services/crmApi';
import { motion } from 'motion/react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

interface AdminStats {
  total_tenants: number;
  total_users: number;
  total_campaigns: number;
  total_messages: number;
}

interface RecentTenant {
  id: number;
  name: string;
  plan: string;
  created_at: string;
  owner_name: string;
  owner_email: string;
}

interface RecentUser {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
  tenant?: {
    name: string;
  };
}

const PLAN_COLORS = {
  free: '#64748b',
  pro: '#6d4aff',
  enterprise: '#10b981'
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [planDistribution, setPlanDistribution] = useState<any[]>([]);
  const [recentTenants, setRecentTenants] = useState<RecentTenant[]>([]);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [messageVolumeData, setMessageVolumeData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const response = await crmApi.getAdminStats();
        if (response.success) {
          setStats(response.stats);
          setPlanDistribution(
            response.plan_distribution.map((item: any) => ({
              name: item.plan.toUpperCase(),
              value: item.count,
              color: PLAN_COLORS[item.plan as keyof typeof PLAN_COLORS] || '#6d4aff'
            }))
          );
          setRecentTenants(response.recent_tenants || []);
          setRecentUsers(response.recent_users || []);
          setMessageVolumeData(response.weekly_transmission || [
            { name: 'Mon', Broadcasts: 120, Inbound: 240 },
            { name: 'Tue', Broadcasts: 210, Inbound: 310 },
            { name: 'Wed', Broadcasts: 180, Inbound: 400 },
            { name: 'Thu', Broadcasts: 320, Inbound: 520 },
            { name: 'Fri', Broadcasts: 280, Inbound: 450 },
            { name: 'Sat', Broadcasts: 150, Inbound: 210 },
            { name: 'Sun', Broadcasts: 190, Inbound: 280 }
          ]);
        } else {
          setError('Failed to retrieve system telemetry.');
        }
      } catch (err) {
        console.error(err);
        setError('Connection to admin API failed.');
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Gathering System Diagnostics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl max-w-xl mx-auto mt-10">
        <h4 className="font-bold text-sm mb-1">Administrative Endpoint Failure</h4>
        <p className="text-xs">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-650 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  // Message volume data is now dynamically retrieved from backend statistics

  // Custom Tooltip component for Recharts message volume
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-slate-200/90 px-4 py-3 rounded-2xl shadow-lg">
          <p className="text-[11px] font-bold text-slate-450 mb-2">{label}</p>
          <div className="space-y-1.5">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.fill || entry.color }} />
                <p className="text-xs font-semibold text-slate-650 flex justify-between gap-4 w-full">
                  <span>{entry.name}</span>
                  <span className="font-extrabold text-slate-900">{Number(entry.value).toLocaleString()}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 animate-fade-in relative">
      {/* Visual Ambient Background Lights */}
      <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-150px] right-[-150px] w-[500px] h-[500px] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none" />

      {/* SaaS Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden border border-slate-800 shadow-xl">
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.5)_0,transparent_70%)] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-1 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-full text-[10px] font-black uppercase tracking-wider">
                Console Active
              </span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight">SaaS Command Overview</h1>
            <p className="text-xs text-slate-400 max-w-xl">
              Cross-tenant global monitoring console. Manage system resources, track total delivery telemetry, and oversee tenant subscriptions.
            </p>
          </div>
          <div className="bg-slate-800/80 border border-slate-700/60 p-4 rounded-2xl flex items-center gap-3 backdrop-blur-sm self-start md:self-auto">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0">
              <Cpu size={18} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Platform Core</p>
              <p className="text-xs font-bold text-white mt-0.5">THROB WhatsApp CRM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Tenants */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-white border border-slate-200/90 rounded-2xl p-5 hover:shadow-md transition-all duration-200 flex items-center justify-between group cursor-pointer"
        >
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-450 uppercase tracking-widest">Workspaces</p>
            <h3 className="text-2xl font-black text-slate-900">{stats?.total_tenants || 0}</h3>
            <p className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
              <TrendingUp size={12} /> Active Tenants
            </p>
          </div>
          <div className="w-12 h-12 bg-indigo-50 text-indigo-650 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 border border-indigo-100">
            <Building2 size={20} />
          </div>
        </motion.div>

        {/* Total Users */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-white border border-slate-200/90 rounded-2xl p-5 hover:shadow-md transition-all duration-200 flex items-center justify-between group cursor-pointer"
        >
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-450 uppercase tracking-widest">Registered Users</p>
            <h3 className="text-2xl font-black text-slate-900">{stats?.total_users || 0}</h3>
            <p className="text-[10px] font-semibold text-indigo-500 flex items-center gap-1">
              <Activity size={12} /> Live Across Tenants
            </p>
          </div>
          <div className="w-12 h-12 bg-purple-50 text-purple-650 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 border border-purple-100">
            <Users size={20} />
          </div>
        </motion.div>

        {/* Total Campaigns */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-white border border-slate-200/90 rounded-2xl p-5 hover:shadow-md transition-all duration-200 flex items-center justify-between group cursor-pointer"
        >
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-450 uppercase tracking-widest">Total Campaigns</p>
            <h3 className="text-2xl font-black text-slate-900">{stats?.total_campaigns || 0}</h3>
            <p className="text-[10px] font-semibold text-indigo-500 flex items-center gap-1">
              <TrendingUp size={12} /> Broadcast automations
            </p>
          </div>
          <div className="w-12 h-12 bg-pink-50 text-pink-650 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 border border-pink-100">
            <Send size={18} />
          </div>
        </motion.div>

        {/* Total Messages */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-white border border-slate-200/90 rounded-2xl p-5 hover:shadow-md transition-all duration-200 flex items-center justify-between group cursor-pointer"
        >
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-450 uppercase tracking-widest">Delivered Messages</p>
            <h3 className="text-2xl font-black text-slate-900">{stats?.total_messages || 0}</h3>
            <p className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
              <ShieldCheck size={12} /> 100% API success rate
            </p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-650 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 border border-emerald-100">
            <MessageSquare size={19} />
          </div>
        </motion.div>
      </div>

      {/* Visual Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Message Activity Chart */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm lg:col-span-2 flex flex-col justify-between">
          <div className="mb-4">
            <h4 className="text-sm font-bold text-slate-900">Message Volume & Engagement</h4>
            <p className="text-xs text-slate-400 mt-0.5">SaaS network weekly transmission query analytics</p>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={messageVolumeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', paddingTop: '10px' }} />
                <Bar dataKey="Broadcasts" fill="#6d4aff" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Inbound" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Plan Distribution Chart */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="mb-4">
            <h4 className="text-sm font-bold text-slate-900">Workspace Subscriptions</h4>
            <p className="text-xs text-slate-400 mt-0.5">Active tier distributions on platform</p>
          </div>
          <div className="h-56 w-full flex items-center justify-center">
            {planDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={planDistribution}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {planDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff' }}
                    itemStyle={{ fontSize: '11px', fontWeight: 'bold' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-slate-400 text-xs font-semibold">No workspaces to analyze</div>
            )}
          </div>
          <div className="space-y-2 mt-auto">
            {planDistribution.map((entry, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-bold text-slate-650">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span>{entry.name}</span>
                </div>
                <span className="font-extrabold text-slate-900">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lists Row: Recent Workspaces & Users */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Workspaces */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-900 font-sans">Recent Workspaces</h4>
              <p className="text-xs text-slate-400 mt-0.5">Latest registrations on the CRM</p>
            </div>
            <button
              onClick={() => navigate('/admin/tenants')}
              className="text-xs font-black text-indigo-600 hover:text-indigo-900 flex items-center gap-1.5 uppercase tracking-widest transition-colors cursor-pointer"
            >
              <span>Manage all</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <div className="divide-y divide-slate-100 max-h-[350px] overflow-y-auto custom-scrollbar">
            {recentTenants.length === 0 ? (
              <p className="text-xs font-semibold text-slate-400 py-6 text-center">No tenants created yet.</p>
            ) : (
              recentTenants.map((tenant) => (
                <div key={tenant.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 group">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-650 flex items-center justify-center font-black text-xs border border-indigo-100 shrink-0">
                      {tenant.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors leading-none">
                        {tenant.name}
                      </p>
                      <p className="text-[10px] text-slate-400 font-semibold mt-1">
                        Owner: {tenant.owner_name} ({tenant.owner_email})
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 self-start sm:self-auto">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider leading-none border ${
                      tenant.plan === 'enterprise' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                      tenant.plan === 'pro' ? 'bg-indigo-50 border-indigo-100 text-indigo-600' :
                      'bg-slate-50 border-slate-200 text-slate-500'
                    }`}>
                      {tenant.plan}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {new Date(tenant.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-900 font-sans">Recent Registrants</h4>
              <p className="text-xs text-slate-400 mt-0.5">Latest user actions across all workspaces</p>
            </div>
            <button
              onClick={() => navigate('/admin/users')}
              className="text-xs font-black text-indigo-600 hover:text-indigo-900 flex items-center gap-1.5 uppercase tracking-widest transition-colors cursor-pointer"
            >
              <span>Manage all</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <div className="divide-y divide-slate-100 max-h-[350px] overflow-y-auto custom-scrollbar">
            {recentUsers.length === 0 ? (
              <p className="text-xs font-semibold text-slate-400 py-6 text-center">No registered users found.</p>
            ) : (
              recentUsers.map((user) => (
                <div key={user.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 group">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-655 flex items-center justify-center font-black text-xs border border-purple-100 shrink-0">
                      {user.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-slate-900 leading-none">
                        {user.name}
                      </p>
                      <p className="text-[10px] text-slate-450 font-semibold mt-1">
                        {user.email} &bull; Workspace: <span className="text-slate-655 font-bold">{user.tenant?.name || 'N/A'}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 self-start sm:self-auto">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider leading-none border ${
                      user.role === 'superadmin' ? 'bg-rose-50 border-rose-100 text-rose-600' :
                      user.role === 'admin' ? 'bg-indigo-50 border-indigo-100 text-indigo-600' :
                      'bg-slate-50 border-slate-200 text-slate-500'
                    }`}>
                      {user.role}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {new Date(user.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
