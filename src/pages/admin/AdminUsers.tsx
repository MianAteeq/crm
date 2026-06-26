import { useEffect, useState, FormEvent } from 'react';
import {
  Users,
  Search,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Trash2,
  CheckCircle,
  AlertCircle,
  X,
  ShieldAlert,
  Loader2,
  KeyRound,
  Building,
  Mail,
  Calendar,
  Lock,
  UserCheck,
  UserX,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { crmApi } from '../../services/crmApi';

interface UserItem {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
  tenant_id: number | null;
  tenant?: {
    name: string;
  } | null;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit modal state
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState('agent');
  const [editStatus, setEditStatus] = useState('active');
  const [editPassword, setEditPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'success' | 'error' | null>(null);

  // Delete modal state
  const [deletingUser, setDeletingUser] = useState<UserItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await crmApi.getAdminUsers({ search, page });
      if (response.success) {
        setUsers(response.data.data || []);
        setPage(response.data.current_page || 1);
        setLastPage(response.data.last_page || 1);
        setTotal(response.data.total || 0);
      } else {
        setError('Failed to retrieve user accounts.');
      }
    } catch (err) {
      console.error(err);
      setError('Connection to admin API failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadUsers();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, page]);

  const handleOpenEdit = (user: UserItem) => {
    setEditingUser(user);
    setEditName(user.name);
    setEditRole(user.role);
    setEditStatus(user.status || 'active');
    setEditPassword('');
    setSaveStatus(null);
  };

  const handleSaveEdit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingUser || !editName.trim()) return;
    setSaving(true);
    setSaveStatus(null);
    try {
      const payload: any = {
        name: editName.trim(),
        role: editRole,
        status: editStatus
      };
      if (editPassword) {
        payload.password = editPassword;
      }
      const res = await crmApi.updateAdminUser(editingUser.id, payload);
      if (res.success) {
        setSaveStatus('success');
        setUsers(prev => prev.map(item => item.id === editingUser.id ? {
          ...item,
          name: editName.trim(),
          role: editRole,
          status: editStatus
        } : item));
        setTimeout(() => {
          setEditingUser(null);
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

  const handleDeleteUser = async () => {
    if (!deletingUser) return;
    setDeleting(true);
    try {
      const res = await crmApi.deleteAdminUser(deletingUser.id);
      if (res.success) {
        setUsers(prev => prev.filter(item => item.id !== deletingUser.id));
        setTotal(prev => prev - 1);
        setDeletingUser(null);
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

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case 'superadmin':
        return 'bg-rose-500/10 border-rose-500/20 text-rose-500 hover:bg-rose-500/15';
      case 'admin':
        return 'bg-violet-500/10 border-violet-500/20 text-violet-500 hover:bg-violet-500/15';
      case 'agent':
        return 'bg-blue-500/10 border-blue-500/20 text-blue-500 hover:bg-blue-500/15';
      default:
        return 'bg-slate-500/10 border-slate-500/20 text-slate-500 hover:bg-slate-500/15';
    }
  };

  const getAvatarGradient = (role: string) => {
    switch (role) {
      case 'superadmin':
        return 'from-rose-500 to-orange-500 text-white';
      case 'admin':
        return 'from-violet-500 to-indigo-500 text-white';
      case 'agent':
        return 'from-blue-500 to-cyan-500 text-white';
      default:
        return 'from-slate-400 to-slate-500 text-white';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header section with ambient light effect */}
      <div className="relative overflow-hidden bg-slate-900 text-white p-8 rounded-3xl border border-slate-800 shadow-xl">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2.5 text-xs text-indigo-400 font-bold tracking-widest uppercase mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              <span>Identity Orchestrator</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">System Users Directory</h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
              Audit access, adjust workspace boundaries, configure elevated system privileges, and control authentication status parameters.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2.5 rounded-2xl shrink-0 backdrop-blur-md">
            <Users size={16} className="text-indigo-400" />
            <div className="text-left">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Registers</p>
              <p className="text-sm font-black text-white leading-none mt-0.5">
                {total} User{total !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Control bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4 shadow-sm">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full bg-slate-50 border border-slate-200/60 rounded-xl py-3 pl-11 pr-4 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all"
          />
        </div>
        {search && (
          <button
            onClick={() => setSearch('')}
            className="text-xs font-bold text-slate-450 hover:text-slate-900 transition-colors"
          >
            Clear Search
          </button>
        )}
      </div>

      {/* Main Directory Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">
        {loading && users.length === 0 ? (
          <div className="py-24 text-center flex flex-col items-center gap-3">
            <Loader2 size={28} className="animate-spin text-indigo-650" />
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Quarrying user catalog...</p>
          </div>
        ) : error ? (
          <div className="py-20 text-center text-red-500 text-xs font-semibold flex flex-col items-center gap-2">
            <AlertCircle size={24} />
            <span>{error}</span>
          </div>
        ) : users.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center gap-3">
            <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
              <User size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">No members found</p>
              <p className="text-xs text-slate-400 mt-0.5">Try altering your search keywords.</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest select-none">
                  <th className="py-4.5 px-6">Identity</th>
                  <th className="py-4.5 px-6">Workspace Workspace</th>
                  <th className="py-4.5 px-6">System Role</th>
                  <th className="py-4.5 px-6">Status State</th>
                  <th className="py-4.5 px-6">Date Registered</th>
                  <th className="py-4.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/40 transition-colors duration-150 text-xs font-medium group">
                    <td className="py-4.5 px-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${getAvatarGradient(user.role)} flex items-center justify-center font-black text-xs uppercase shadow-sm select-none`}>
                          {user.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-extrabold text-slate-900 leading-none group-hover:text-indigo-650 transition-colors">{user.name}</p>
                          <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-450 font-semibold">
                            <Mail size={11} className="text-slate-400" />
                            <span>{user.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4.5 px-6">
                      {user.tenant ? (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-650 shrink-0">
                            <Building size={12} />
                          </div>
                          <span className="font-extrabold text-slate-800 tracking-tight">{user.tenant.name}</span>
                        </div>
                      ) : (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 border border-slate-100 px-2.5 py-0.5 rounded-full select-none">
                          No Tenant Linked
                        </span>
                      )}
                    </td>
                    <td className="py-4.5 px-6">
                      <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider leading-none border transition-all ${getRoleBadgeStyle(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4.5 px-6">
                      {user.status === 'blocked' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider leading-none border bg-rose-50 border-rose-100 text-rose-600">
                          <UserX size={10} />
                          <span>Blocked</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider leading-none border bg-emerald-50 border-emerald-100 text-emerald-600">
                          <UserCheck size={10} />
                          <span>Active</span>
                        </span>
                      )}
                    </td>
                    <td className="py-4.5 px-6 text-slate-400 font-semibold">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={12} className="text-slate-400" />
                        <span>{new Date(user.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                      </div>
                    </td>
                    <td className="py-4.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenEdit(user)}
                          className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 hover:bg-indigo-50 hover:border-indigo-200 text-slate-500 hover:text-indigo-650 flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-90"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => setDeletingUser(user)}
                          className="w-8 h-8 rounded-lg bg-red-50/50 border border-red-100 hover:bg-red-500 hover:border-red-500 text-red-500 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-90"
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
          <div className="bg-slate-50 border-t border-slate-100 px-6 py-4.5 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Showing page <strong className="text-slate-800">{page}</strong> of <strong className="text-slate-800">{lastPage}</strong>
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                className="w-8.5 h-8.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center cursor-pointer text-slate-650 transition-all active:scale-95"
              >
                <ChevronLeft size={15} />
              </button>
              <button
                disabled={page === lastPage}
                onClick={() => setPage(prev => Math.min(prev + 1, lastPage))}
                className="w-8.5 h-8.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center cursor-pointer text-slate-650 transition-all active:scale-95"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit User Dialog Modal */}
      <AnimatePresence>
        {editingUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
              onClick={() => !saving && setEditingUser(null)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="relative w-full max-w-md bg-white border border-slate-250 rounded-3xl shadow-2xl overflow-hidden z-[110]"
            >
              <form onSubmit={handleSaveEdit} className="flex flex-col">
                <div className="bg-slate-55 border-b border-slate-100 p-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-650">
                      <Edit2 size={15} />
                    </span>
                    <div>
                      <h3 className="text-sm font-black text-slate-900">Edit User Details</h3>
                      <p className="text-xs text-slate-450 mt-0.5 font-medium">Update credential profile parameters</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    disabled={saving}
                    className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-250 text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  {/* Name field */}
                  <div>
                    <label className="block mb-2 text-xs font-bold text-slate-450 uppercase tracking-wider">Full Name</label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all"
                    />
                  </div>

                  {/* System role */}
                  <div>
                    <label className="block mb-2 text-xs font-bold text-slate-450 uppercase tracking-wider">System Role</label>
                    <select
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all font-sans"
                    >
                      <option value="superadmin">Super Admin (Cross-Tenant Controller)</option>
                      <option value="admin">Workspace Admin (Tenant Administrator)</option>
                      <option value="agent">Support Agent (Standard User)</option>
                      <option value="user">Basic User (No elevated privileges)</option>
                    </select>
                  </div>

                  {/* Status state */}
                  <div>
                    <label className="block mb-2 text-xs font-bold text-slate-450 uppercase tracking-wider">Account Status</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all font-sans"
                    >
                      <option value="active">Active (Access Allowed)</option>
                      <option value="blocked">Blocked (Access Revoked / Suspended)</option>
                    </select>
                  </div>

                  {/* Password Reset Section */}
                  <div className="border-t border-slate-100 pt-4.5 space-y-2">
                    <label className="block text-xs font-extrabold text-[#6D4AFF] uppercase tracking-wider flex items-center gap-1.5 select-none">
                      <KeyRound size={13} />
                      <span>Security Credentials Reset</span>
                    </label>
                    <p className="text-[10px] text-slate-400 font-medium">Leave this parameter blank if you do not want to alter their account passcode.</p>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
                      <input
                        type="password"
                        placeholder="Enter secure new passphrase (min. 6 chars)"
                        value={editPassword}
                        onChange={(e) => setEditPassword(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex items-center justify-between">
                  <div>
                    {saveStatus === 'success' && (
                      <p className="text-xs font-bold text-emerald-600 flex items-center gap-1 animate-pulse">
                        <CheckCircle size={14} /> Profile Committed
                      </p>
                    )}
                    {saveStatus === 'error' && (
                      <p className="text-xs font-bold text-red-500 flex items-center gap-1">
                        <AlertCircle size={14} /> Save Aborted
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingUser(null)}
                      disabled={saving}
                      className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-100 text-xs font-bold text-slate-650 rounded-xl transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving || saveStatus === 'success'}
                      className="px-4 py-2 bg-indigo-650 hover:bg-indigo-750 text-xs font-bold text-white rounded-xl transition-all flex items-center gap-1.5 shadow-sm hover:shadow-indigo-600/10 active:scale-95 cursor-pointer"
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

      {/* Delete User Confirmation Dialog */}
      <AnimatePresence>
        {deletingUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
              onClick={() => !deleting && setDeletingUser(null)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="relative w-full max-w-sm bg-white border border-slate-250 rounded-3xl shadow-2xl overflow-hidden z-[110]"
            >
              <div className="p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-rose-50 border border-rose-100 text-rose-500 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                  <ShieldAlert size={22} className="animate-bounce" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-sm font-black text-slate-900">Remove Account Access?</h3>
                  <p className="text-xs text-slate-450 font-medium leading-relaxed">
                    This administrative operation is irreversible. The account <strong className="text-slate-800">"{deletingUser.name}"</strong> will have all credential permissions terminated immediately.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex gap-2 justify-center">
                <button
                  type="button"
                  onClick={() => setDeletingUser(null)}
                  disabled={deleting}
                  className="flex-1 py-2.5 border border-slate-200 bg-white hover:bg-slate-100 text-xs font-bold text-slate-650 rounded-xl transition-all cursor-pointer"
                >
                  Keep Account
                </button>
                <button
                  type="button"
                  onClick={handleDeleteUser}
                  disabled={deleting}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md hover:shadow-rose-600/10 active:scale-95 cursor-pointer"
                >
                  {deleting && <Loader2 size={13} className="animate-spin text-white" />}
                  <span>Revoke User</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
