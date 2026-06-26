import { useEffect, useState, FormEvent } from 'react';
import {
  Coins,
  ShieldCheck,
  CheckCircle2,
  Users,
  MessageSquare,
  Send,
  Zap,
  Info,
  Loader2,
  Sparkles,
  Check,
  Cpu,
  Plus,
  Edit2,
  Trash2,
  X,
  AlertCircle,
  KeyRound,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { crmApi } from '../../services/crmApi';

interface PlanLimit {
  id: number;
  key: string;
  name: string;
  price: string;
  limits: {
    contacts: string;
    messages: string;
    campaigns: string;
    ai_replies: string;
  };
}

export default function AdminPlans() {
  const [plans, setPlans] = useState<PlanLimit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create/Edit modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PlanLimit | null>(null);
  const [planKey, setPlanKey] = useState('');
  const [planName, setPlanName] = useState('');
  const [planPrice, setPlanPrice] = useState('');
  const [limitContacts, setLimitContacts] = useState('');
  const [limitMessages, setLimitMessages] = useState('');
  const [limitCampaigns, setLimitCampaigns] = useState('');
  const [limitAiReplies, setLimitAiReplies] = useState('');
  
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'success' | 'error' | null>(null);

  // Delete modal state
  const [deletingPlan, setDeletingPlan] = useState<PlanLimit | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const loadPlans = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await crmApi.getAdminPlans();
      if (res.success) {
        setPlans(res.plans);
      } else {
        setError('Failed to fetch pricing plans configuration.');
      }
    } catch (err) {
      console.error(err);
      setError('API connection timed out.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const handleOpenCreate = () => {
    setEditingPlan(null);
    setPlanKey('');
    setPlanName('');
    setPlanPrice('');
    setLimitContacts('1,000');
    setLimitMessages('10,500/month');
    setLimitCampaigns('Unlimited');
    setLimitAiReplies('Enabled (Limit 100)');
    setSaveError(null);
    setSaveStatus(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (plan: PlanLimit) => {
    setEditingPlan(plan);
    setPlanKey(plan.key);
    setPlanName(plan.name);
    setPlanPrice(plan.price);
    setLimitContacts(plan.limits.contacts);
    setLimitMessages(plan.limits.messages);
    setLimitCampaigns(plan.limits.campaigns);
    setLimitAiReplies(plan.limits.ai_replies);
    setSaveError(null);
    setSaveStatus(null);
    setIsModalOpen(true);
  };

  const handleSavePlan = async (e: FormEvent) => {
    e.preventDefault();
    if (!planKey.trim() || !planName.trim() || !planPrice.trim()) return;

    setSaving(true);
    setSaveError(null);
    setSaveStatus(null);

    const payload = {
      key: planKey.trim().toLowerCase(),
      name: planName.trim(),
      price: planPrice.trim(),
      limits: {
        contacts: limitContacts.trim(),
        messages: limitMessages.trim(),
        campaigns: limitCampaigns.trim(),
        ai_replies: limitAiReplies.trim()
      }
    };

    try {
      if (editingPlan) {
        const res = await crmApi.updateAdminPlan(editingPlan.id, payload);
        if (res.success) {
          setSaveStatus('success');
          setPlans(prev => prev.map(item => item.id === editingPlan.id ? res.plan : item));
          setTimeout(() => setIsModalOpen(false), 1000);
        } else {
          throw new Error(res.message || 'Failed to update plan');
        }
      } else {
        const res = await crmApi.createAdminPlan(payload);
        if (res.success) {
          setSaveStatus('success');
          setPlans(prev => [...prev, res.plan]);
          setTimeout(() => setIsModalOpen(false), 1000);
        } else {
          throw new Error(res.message || 'Failed to create plan');
        }
      }
    } catch (err: any) {
      console.error(err);
      setSaveStatus('error');
      setSaveError(err.message || 'Request validation rejected.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePlan = async () => {
    if (!deletingPlan) return;
    setDeleting(true);
    setDeleteError(null);

    try {
      const res = await crmApi.deleteAdminPlan(deletingPlan.id);
      if (res.success) {
        setPlans(prev => prev.filter(item => item.id !== deletingPlan.id));
        setDeletingPlan(null);
      } else {
        throw new Error(res.message || 'Failed to delete plan');
      }
    } catch (err: any) {
      console.error(err);
      setDeleteError(err.message || 'Delete operation rejected.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 size={32} className="animate-spin text-indigo-650" />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Querying SaaS Tier Configs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-100 text-rose-700 p-6 rounded-3xl max-w-xl mx-auto mt-10 shadow-sm flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
          <ShieldCheck size={20} className="text-rose-600" />
        </div>
        <div>
          <h4 className="font-extrabold text-sm text-slate-900 uppercase tracking-wide">Administrative Access Issue</h4>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header section with modern dark glow design and create button */}
      <div className="relative overflow-hidden bg-slate-900 text-white p-8 rounded-3xl border border-slate-800 shadow-xl">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-10 -mb-16 w-48 h-48 bg-emerald-500/5 rounded-full blur-2xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2.5 text-xs text-emerald-400 font-bold tracking-widest uppercase mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Subscription Control Engine</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">SaaS Plans & Resource Limits</h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
              Orchestrate the global resource ceilings, monthly volumes, and feature sets allowed for each tier deck. These configurations enforce API boundaries dynamically.
            </p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white rounded-xl transition-all shadow-md active:scale-95 cursor-pointer shrink-0"
          >
            <Plus size={15} />
            <span>Create New Plan</span>
          </button>
        </div>
      </div>

      {/* Info Warning banner */}
      <div className="bg-amber-500/5 border border-amber-500/10 p-5 rounded-2xl flex gap-4 text-amber-800 shadow-sm">
        <div className="w-10 h-10 rounded-xl bg-amber-550/10 text-amber-600 flex items-center justify-center shrink-0 border border-amber-550/10">
          <Info size={18} />
        </div>
        <div className="space-y-1">
          <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Database Sync Active</h4>
          <p className="text-xs text-slate-450 leading-relaxed max-w-4xl">
            SaaS rates, contact volumes, and AI copilot thresholds are retrieved dynamically from your database. Tenant workspaces validate their limits against these rules.
          </p>
        </div>
      </div>

      {/* Plans Card Deck */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, index) => {
          const isPro = plan.key === 'pro';
          const isEnterprise = plan.key === 'enterprise';
          
          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              whileHover={{ y: -5 }}
              className={`bg-white border rounded-3xl p-6 flex flex-col justify-between shadow-sm relative overflow-hidden transition-all duration-300 ${
                isPro 
                  ? 'border-indigo-500/80 ring-2 ring-indigo-500/10 shadow-lg shadow-indigo-500/5' 
                  : isEnterprise
                    ? 'border-emerald-500/30'
                    : 'border-slate-200/80'
              }`}
            >
              <div className="space-y-6">
                {/* Tier Card Header */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`w-10 h-10 rounded-2xl flex items-center justify-center border shadow-inner ${
                      isPro 
                        ? 'bg-indigo-50 border-indigo-100 text-indigo-650' 
                        : isEnterprise 
                          ? 'bg-emerald-50 border-emerald-100 text-emerald-600' 
                          : 'bg-slate-50 border-slate-100 text-slate-700'
                    }`}>
                      <Coins size={18} />
                    </span>
                    
                    {/* Action buttons */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(plan)}
                        className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-200 hover:bg-indigo-50 hover:border-indigo-100 text-slate-500 hover:text-indigo-650 flex items-center justify-center transition-all cursor-pointer shadow-sm"
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        onClick={() => { setDeletingPlan(plan); setDeleteError(null); }}
                        className="w-7 h-7 rounded-lg bg-red-50/50 border border-red-100 hover:bg-red-500 hover:border-red-500 text-red-500 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-sm"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">{plan.name}</h3>
                      {isPro && (
                        <span className="bg-indigo-650 text-white text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full flex items-center gap-0.5 select-none shrink-0">
                          <Sparkles size={8} />
                          <span>Popular</span>
                        </span>
                      )}
                    </div>
                    <div className="flex items-baseline gap-1 mt-1.5">
                      <span className="text-2xl font-black text-slate-900">
                        {plan.price.toLowerCase().includes('/month') ? plan.price.replace(/\/month/i, '') : plan.price}
                      </span>
                      {!plan.price.toLowerCase().includes('pricing') && !plan.price.toLowerCase().includes('custom') && (
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">/ Month</span>
                      )}
                    </div>
                    <p className="text-[9px] text-slate-400 font-mono mt-1 uppercase">Key ID: {plan.key}</p>
                  </div>
                </div>

                <div className="w-full h-px bg-slate-100" />

                {/* Resource Limits List */}
                <div className="space-y-4">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest select-none">Resource Caps</p>
                  
                  {/* Contacts Limit */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Users size={14} className="text-slate-400" />
                        <span>Audience Contacts</span>
                      </div>
                      <span className="text-slate-900">{plan.limits.contacts}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${isPro ? 'bg-indigo-500' : isEnterprise ? 'bg-emerald-500' : 'bg-slate-400'}`} 
                        style={{ width: plan.limits.contacts.toLowerCase().includes('unlimited') ? '100%' : '50%' }} 
                      />
                    </div>
                  </div>

                  {/* Messages Limit */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <div className="flex items-center gap-2 text-slate-500">
                        <MessageSquare size={14} className="text-slate-400" />
                        <span>Monthly Broadcasts</span>
                      </div>
                      <span className="text-slate-900">{plan.limits.messages}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${isPro ? 'bg-indigo-500' : isEnterprise ? 'bg-emerald-500' : 'bg-slate-400'}`} 
                        style={{ width: plan.limits.messages.toLowerCase().includes('unlimited') ? '100%' : '40%' }} 
                      />
                    </div>
                  </div>

                  {/* Campaigns Limit */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Send size={14} className="text-slate-400" />
                        <span>Automation Journeys</span>
                      </div>
                      <span className="text-slate-900">{plan.limits.campaigns}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${isPro ? 'bg-indigo-500' : isEnterprise ? 'bg-emerald-500' : 'bg-slate-400'}`} 
                        style={{ width: plan.limits.campaigns.toLowerCase().includes('unlimited') || plan.limits.campaigns.toLowerCase().includes('enabled') ? '100%' : '0%' }} 
                      />
                    </div>
                  </div>

                  {/* AI Copilot Limit */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Zap size={14} className="text-slate-400" />
                        <span>AI Assistant Replies</span>
                      </div>
                      <span className="text-slate-900">{plan.limits.ai_replies}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${isPro ? 'bg-indigo-500' : isEnterprise ? 'bg-emerald-500' : 'bg-slate-400'}`} 
                        style={{ width: plan.limits.ai_replies.toLowerCase().includes('unlimited') || plan.limits.ai_replies.toLowerCase().includes('enabled') ? '100%' : '0%' }} 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Checklist details */}
              <div className="mt-8 pt-6 border-t border-slate-100 space-y-3">
                <div className="flex items-center gap-2.5 text-[11px] font-bold text-slate-600">
                  <span className="w-5 h-5 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                    <Check size={12} />
                  </span>
                  <span>Official Meta Cloud API Integrations</span>
                </div>
                <div className="flex items-center gap-2.5 text-[11px] font-bold text-slate-600">
                  <span className="w-5 h-5 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                    <Check size={12} />
                  </span>
                  <span>Unified Omnichannel Live Chat Inbox</span>
                </div>
                {isEnterprise && (
                  <div className="flex items-center gap-2.5 text-[11px] font-bold text-indigo-650 animate-pulse">
                    <span className="w-5 h-5 rounded-lg bg-indigo-50 text-indigo-650 flex items-center justify-center shrink-0 border border-indigo-100">
                      <Cpu size={12} />
                    </span>
                    <span>Custom Dedicated Instance support</span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Create/Edit Modal Dialog */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
              onClick={() => !saving && setIsModalOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="relative w-full max-w-md bg-white border border-slate-250 rounded-3xl shadow-2xl overflow-hidden z-[110]"
            >
              <form onSubmit={handleSavePlan} className="flex flex-col">
                <div className="bg-slate-55 border-b border-slate-100 p-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-650 animate-pulse">
                      <FileText size={15} />
                    </span>
                    <div>
                      <h3 className="text-sm font-black text-slate-900">{editingPlan ? 'Modify Plan configuration' : 'Create Subscription Plan'}</h3>
                      <p className="text-xs text-slate-450 mt-0.5 font-medium">Define parameters and limits deck</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    disabled={saving}
                    className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-250 text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </div>

                <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Plan Key */}
                    <div>
                      <label className="block mb-2 text-xs font-bold text-slate-450 uppercase tracking-wider">Unique Key / Slug</label>
                      <input
                        type="text"
                        required
                        disabled={!!editingPlan}
                        placeholder="e.g. standard"
                        value={planKey}
                        onChange={(e) => setPlanKey(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all disabled:opacity-50"
                      />
                    </div>

                    {/* Plan Name */}
                    <div>
                      <label className="block mb-2 text-xs font-bold text-slate-450 uppercase tracking-wider">Display Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Standard Tier"
                        value={planName}
                        onChange={(e) => setPlanName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all"
                      />
                    </div>
                  </div>

                  {/* Pricing */}
                  <div>
                    <label className="block mb-2 text-xs font-bold text-slate-450 uppercase tracking-wider">Monthly Price Tag</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. $29/month or Custom Pricing"
                      value={planPrice}
                      onChange={(e) => setPlanPrice(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all"
                    />
                  </div>

                  <div className="border-t border-slate-100 pt-4.5 space-y-4">
                    <p className="text-[10px] font-black text-indigo-650 uppercase tracking-widest select-none">Resource Ceilings</p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {/* Contacts */}
                      <div>
                        <label className="block mb-2 text-[10px] font-bold text-slate-450 uppercase tracking-wider">Audience Contacts</label>
                        <input
                          type="text"
                          required
                          value={limitContacts}
                          onChange={(e) => setLimitContacts(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all font-mono"
                        />
                      </div>

                      {/* Messages */}
                      <div>
                        <label className="block mb-2 text-[10px] font-bold text-slate-450 uppercase tracking-wider">Monthly Broadcasts</label>
                        <input
                          type="text"
                          required
                          value={limitMessages}
                          onChange={(e) => setLimitMessages(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Campaigns */}
                      <div>
                        <label className="block mb-2 text-[10px] font-bold text-slate-450 uppercase tracking-wider">Campaign Automation</label>
                        <input
                          type="text"
                          required
                          value={limitCampaigns}
                          onChange={(e) => setLimitCampaigns(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all font-mono"
                        />
                      </div>

                      {/* AI Replies */}
                      <div>
                        <label className="block mb-2 text-[10px] font-bold text-slate-450 uppercase tracking-wider">AI Copilot Replies</label>
                        <input
                          type="text"
                          required
                          value={limitAiReplies}
                          onChange={(e) => setLimitAiReplies(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex items-center justify-between">
                  <div>
                    {saveError && (
                      <p className="text-[10px] font-bold text-rose-500 flex items-center gap-1">
                        <AlertCircle size={12} /> {saveError}
                      </p>
                    )}
                    {saveStatus === 'success' && (
                      <p className="text-xs font-bold text-emerald-600 flex items-center gap-1 animate-pulse">
                        <CheckCircle2 size={14} /> Plan Committed
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      disabled={saving}
                      className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-100 text-xs font-bold text-slate-650 rounded-xl transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving || saveStatus === 'success'}
                      className="px-4 py-2 bg-indigo-650 hover:bg-indigo-750 text-xs font-bold text-white rounded-xl transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                    >
                      {saving && <Loader2 size={13} className="animate-spin text-white" />}
                      <span>{editingPlan ? 'Save Changes' : 'Create Plan'}</span>
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Plan Confirmation Dialog */}
      <AnimatePresence>
        {deletingPlan && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
              onClick={() => !deleting && setDeletingPlan(null)}
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
                  <Coins size={22} className="animate-bounce" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-sm font-black text-slate-900">Remove Pricing Plan?</h3>
                  <p className="text-xs text-slate-450 font-medium leading-relaxed">
                    This administrative operation will terminate the subscription tier definition <strong className="text-slate-800">"{deletingPlan.name}"</strong>.
                  </p>
                </div>
                {deleteError && (
                  <div className="p-3 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl text-[10px] font-semibold leading-relaxed">
                    {deleteError}
                  </div>
                )}
              </div>

              <div className="bg-slate-55 border-t border-slate-100 px-6 py-4 flex gap-2 justify-center">
                <button
                  type="button"
                  onClick={() => setDeletingPlan(null)}
                  disabled={deleting}
                  className="flex-1 py-2.5 border border-slate-200 bg-white hover:bg-slate-100 text-xs font-bold text-slate-650 rounded-xl transition-all cursor-pointer"
                >
                  Keep Plan
                </button>
                <button
                  type="button"
                  onClick={handleDeletePlan}
                  disabled={deleting}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
                >
                  {deleting && <Loader2 size={13} className="animate-spin text-white" />}
                  <span>Confirm Delete</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
