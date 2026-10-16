import { useEffect, useState, FormEvent } from 'react';
import {
  Building2,
  Search,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Trash2,
  CheckCircle,
  AlertCircle,
  X,
  ShieldAlert,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { crmApi } from '../../services/crmApi';

interface TenantItem {
  id: number;
  name: string;
  plan: string;
  created_at: string;
  owner_name: string;
  owner_email: string;
  users_count: number;
}

export default function AdminTenants() {
  const [tenants, setTenants] = useState<TenantItem[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit modal state
  const [editingTenant, setEditingTenant] = useState<TenantItem | null>(null);
  const [editName, setEditName] = useState('');
  const [editPlan, setEditPlan] = useState('free');
  const [plans, setPlans] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'success' | 'error' | null>(null);

  // Delete modal state
  const [deletingTenant, setDeletingTenant] = useState<TenantItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadPlans = async () => {
    try {
      const res = await crmApi.getAdminPlans();
      if (res.success) {
        setPlans(res.plans || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadTenants = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await crmApi.getAdminTenants({ search, page });
      if (response.success) {
        setTenants(response.data.items);
        setPage(response.data.current_page);
        setLastPage(response.data.last_page);
        setTotal(response.data.total);
      } else {
        setError('Failed to retrieve workspace data.');
      }
    } catch (err) {
      console.error(err);
      setError('Connection to backend endpoints lost.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlans();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadTenants();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, page]);

  const handleOpenEdit = (tenant: TenantItem) => {
    setEditingTenant(tenant);
    setEditName(tenant.name);
    setEditPlan(tenant.plan);
    setSaveStatus(null);
  };

  const handleSaveEdit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingTenant || !editName.trim()) return;
    setSaving(true);
    setSaveStatus(null);
    try {
      const res = await crmApi.updateAdminTenant(editingTenant.id, {
        name: editName.trim(),
        plan: editPlan
      });
      if (res.success) {
        setSaveStatus('success');
        setTenants(prev => prev.map(item => item.id === editingTenant.id ? {
          ...item,
          name: editName.trim(),
          plan: editPlan
        } : item));
        setTimeout(() => {
          setEditingTenant(null);
        }, 1000);
      } else {
        throw new Error(res.message || 'Update failed');
      }
    } catch (err) {
      console.error(err);
      setSaveStatus('error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTenant = async () => {
    if (!deletingTenant) return;
    setDeleting(true);
    try {
      const res = await crmApi.deleteAdminTenant(deletingTenant.id);
      if (res.success) {
        setTenants(prev => prev.filter(item => item.id !== deletingTenant.id));
        setTotal(prev => prev - 1);
        setDeletingTenant(null);
      } else {
        alert(res.message || 'Deletion failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Delete request failed.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900">Workspaces & Tenancy</h1>
          <p className="text-xs text-slate-400 mt-1">Manage global enterprise tenants, database limits, and plan tiers.</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
          <Building2 size={15} className="text-slate-500" />
          <span className="text-xs font-black text-slate-700 uppercase tracking-wide">
            {total} Active Tenant{total !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Control bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search tenant name or company..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full bg-slate-50 border border-slate-200/65 rounded-xl py-2.5 pl-11 pr-4 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-[#166534] transition-all"
          />
        </div>
      </div>

      {/* Main Table view */}
      <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-sm">
        {loading && tenants.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center gap-2">
            <Loader2 size={24} className="animate-spin text-[#166534]" />
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-2">Loading Tenant Records...</p>
          </div>
        ) : error ? (
          <div className="py-16 text-center text-red-500 text-xs font-semibold">{error}</div>
        ) : tenants.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs font-semibold">No workspaces match the query.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest select-none">
                  <th className="py-4 px-6">Workspace Name</th>
                  <th className="py-4 px-6">Owner Account</th>
                  <th className="py-4 px-6 text-center">User Count</th>
                  <th className="py-4 px-6">Tier Plan</th>
                  <th className="py-4 px-6">Created At</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {tenants.map((tenant) => (
                  <tr key={tenant.id} className="hover:bg-slate-50/30 transition-colors text-xs font-medium">
                    <td className="py-4.5 px-6 font-extrabold text-slate-900">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#166534]/10 text-[#166534] flex items-center justify-center font-black text-[10px] uppercase">
                          {tenant.name.substring(0, 2).toUpperCase()}
                        </div>
                        <span>{tenant.name}</span>
                      </div>
                    </td>
                    <td className="py-4.5 px-6">
                      <div>
                        <p className="font-bold text-slate-900 leading-tight">{tenant.owner_name}</p>
                        <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{tenant.owner_email}</p>
                      </div>
                    </td>
                    <td className="py-4.5 px-6 text-center font-bold text-slate-800">
                      {tenant.users_count}
                    </td>
                    <td className="py-4.5 px-6">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider leading-none border ${
                        tenant.plan === 'enterprise' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                        tenant.plan === 'pro' ? 'bg-[#F0FDF4] border-[#bbf7d0] text-[#166534]' :
                        'bg-slate-50 border-slate-200 text-slate-550'
                      }`}>
                        {tenant.plan}
                      </span>
                    </td>
                    <td className="py-4.5 px-6 text-slate-400 font-semibold">
                      {new Date(tenant.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(tenant)}
                          className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 hover:bg-[#F0FDF4] hover:border-[#bbf7d0] text-slate-500 hover:text-[#166534] flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-90"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => setDeletingTenant(tenant)}
                          className="w-8 h-8 rounded-lg bg-rose-50/60 border border-rose-100 hover:bg-rose-600 hover:border-rose-600 text-rose-500 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-90"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination controls */}
        {lastPage > 1 && (
          <div className="bg-slate-50/50 border-t border-slate-100 px-6 py-4 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Showing page <strong className="text-slate-800">{page}</strong> of <strong className="text-slate-800">{lastPage}</strong>
            </span>
            <div className="flex items-center gap-1.5">
              <button
                disabled={page === 1}
                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                className="w-8.5 h-8.5 rounded-xl border border-slate-200 bg-white hover:bg-[#F0FDF4] hover:text-[#166534] hover:border-[#bbf7d0] text-slate-600 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center cursor-pointer transition-all active:scale-95 shadow-xs"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                disabled={page === lastPage}
                onClick={() => setPage(prev => Math.min(prev + 1, lastPage))}
                className="w-8.5 h-8.5 rounded-xl border border-slate-200 bg-white hover:bg-[#F0FDF4] hover:text-[#166534] hover:border-[#bbf7d0] text-slate-600 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center cursor-pointer transition-all active:scale-95 shadow-xs"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Tenant Dialog Modal */}
      <AnimatePresence>
        {editingTenant && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" 
              onClick={() => !saving && setEditingTenant(null)} 
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden z-[110]"
            >
              <form onSubmit={handleSaveEdit} className="flex flex-col">
                <div className="bg-slate-50 border-b border-slate-100 p-6 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-9 h-9 rounded-xl bg-[#F0FDF4] border border-[#bbf7d0] flex items-center justify-center text-[#166534]"><Edit2 size={15} /></span>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Edit Workspace</h3>
                      <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Modify tenant workspace config</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingTenant(null)}
                    disabled={saving}
                    className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <label className="block mb-1.5 text-xs font-bold text-slate-550">Workspace Name</label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200/65 rounded-xl py-3 px-4 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:ring-4 focus:ring-[#22C55E]/10 focus:border-[#166534] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block mb-1.5 text-xs font-bold text-slate-550 font-sans">Subscription Plan Tier</label>
                    <select
                      value={editPlan}
                      onChange={(e) => setEditPlan(e.target.value)}
                      className="w-full bg-slate-55 border border-slate-200/65 rounded-xl py-3 px-4 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:ring-4 focus:ring-[#22C55E]/10 focus:border-[#166534] transition-all font-sans"
                    >
                      {plans.length > 0 ? (
                        plans.map(p => (
                          <option key={p.id} value={p.key}>{p.name} ({p.price})</option>
                        ))
                      ) : (
                        <>
                          <option value="free">Free Tier</option>
                          <option value="pro">Pro Tier</option>
                          <option value="enterprise">Enterprise Tier</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex items-center justify-between">
                  <div>
                    {saveStatus === 'success' && (
                      <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                        <CheckCircle size={14} /> Save success
                      </p>
                    )}
                    {saveStatus === 'error' && (
                      <p className="text-xs font-semibold text-red-500 flex items-center gap-1">
                        <AlertCircle size={14} /> Save error
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingTenant(null)}
                      disabled={saving}
                      className="px-4.5 py-2.5 border border-slate-200 bg-white hover:bg-[#F0FDF4] hover:border-[#bbf7d0] text-xs font-bold text-[#57534E] hover:text-[#166534] rounded-xl transition-all cursor-pointer shadow-xs active:scale-95"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving || saveStatus === 'success'}
                      className="px-5 py-2.5 bg-[#166534] hover:bg-[#14532d] text-xs font-bold text-white rounded-xl transition-all flex items-center gap-2 shadow-sm hover:shadow-[#166534]/15 active:scale-95 cursor-pointer disabled:opacity-50"
                    >
                      {saving && <Loader2 size={13} className="animate-spin text-white" />}
                      <span>Save Changes</span>
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Tenant Confirmation Dialog */}
      <AnimatePresence>
        {deletingTenant && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" 
              onClick={() => !deleting && setDeletingTenant(null)} 
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-sm bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden z-[110]"
            >
              <div className="p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto border border-rose-100 shadow-sm">
                  <ShieldAlert size={22} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-900">Destroy Tenant Workspace?</h3>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed">
                    This action is irreversible. All contacts, chat messages, campaign history, and settings belonging to{' '}
                    <strong className="text-slate-800">"{deletingTenant.name}"</strong> will be permanently purged.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex gap-2 justify-center">
                <button
                  type="button"
                  onClick={() => setDeletingTenant(null)}
                  disabled={deleting}
                  className="flex-1 py-2.5 border border-slate-200 bg-white hover:bg-slate-100 text-xs font-bold text-slate-600 rounded-xl transition-all cursor-pointer"
                >
                  Keep Workspace
                </button>
                <button
                  type="button"
                  onClick={handleDeleteTenant}
                  disabled={deleting}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm hover:shadow-rose-600/15 active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  {deleting && <Loader2 size={13} className="animate-spin text-white" />}
                  <span>Confirm Purge</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
