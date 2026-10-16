import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { crmApi } from '../../services/crmApi';
import { 
  Plus, 
  Search, 
  GitFork, 
  MoreVertical, 
  Trash2, 
  User, 
  Sparkles, 
  X,
  Edit2,
  AlertCircle,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from '../../components/ui/Toast';

interface Workflow {
  id: number;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  trigger: string;
  lastRun: string;
  nextRun: string;
  totalExecutions: number;
  successRate: number;
  createdBy: string;
}

export default function WorkflowsPage() {
  const navigate = useNavigate();
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [search, setSearch] = useState('');
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // CRUD Modal States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  
  // Form States
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('inactive');

  const fetchWorkflows = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const data = await crmApi.getWorkflows();
      if (data && Array.isArray(data)) {
        setWorkflows(data);
      } else {
        setWorkflows([]);
      }
    } catch (err) {
      console.error('Failed to load workflows:', err);
      setHasError(true);
      toast.error('Error', 'Failed to retrieve workflows.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const handleCreate = async () => {
    if (!name.trim()) return;
    try {
      const result = await crmApi.createWorkflow({ name, description, status });
      if (result) {
        toast.success('Created!', 'Workflow created successfully.');
        setIsCreateOpen(false);
        setName('');
        setDescription('');
        setStatus('inactive');
        fetchWorkflows();
      }
    } catch (err) {
      console.error(err);
      toast.error('Error', 'Failed to create workflow.');
    }
  };

  const handleEditOpen = (w: Workflow) => {
    setSelectedWorkflow(w);
    setName(w.name);
    setDescription(w.description);
    setStatus(w.status);
    setIsEditOpen(true);
    setActiveMenuId(null);
  };

  const handleUpdate = async () => {
    if (!selectedWorkflow || !name.trim()) return;
    try {
      const result = await crmApi.updateWorkflow(selectedWorkflow.id, { name, description, status });
      if (result) {
        toast.success('Updated!', 'Workflow updated successfully.');
        setIsEditOpen(false);
        setSelectedWorkflow(null);
        setName('');
        setDescription('');
        setStatus('inactive');
        fetchWorkflows();
      }
    } catch (err) {
      console.error(err);
      toast.error('Error', 'Failed to update workflow.');
    }
  };

  const toggleStatus = async (w: Workflow) => {
    const nextStatus = w.status === 'active' ? 'inactive' : 'active';
    // Optimistic UI update
    setWorkflows(prev => prev.map(item => item.id === w.id ? { ...item, status: nextStatus } : item));
    
    try {
      await crmApi.updateWorkflow(w.id, { status: nextStatus });
      toast.success('Status Changed', `Workflow is now ${nextStatus}.`);
    } catch (err) {
      console.error('Failed to toggle status:', err);
      toast.error('Error', 'Failed to update workflow status.');
      fetchWorkflows(); // roll back on failure
    }
  };

  const deleteWorkflow = async (id: number) => {
    if (!confirm('Are you sure you want to delete this workflow?')) return;
    
    // Optimistic UI update
    setWorkflows(prev => prev.filter(w => w.id !== id));
    setActiveMenuId(null);
    
    try {
      await crmApi.deleteWorkflow(id);
      toast.success('Deleted', 'Workflow deleted.');
    } catch (err) {
      console.error('Failed to delete workflow:', err);
      toast.error('Error', 'Failed to delete workflow.');
      fetchWorkflows();
    }
  };

  // Filtered workflows list
  const filteredWorkflows = workflows.filter(w => {
    const query = search.toLowerCase();
    return (w.name || '').toLowerCase().includes(query) || 
           (w.description || '').toLowerCase().includes(query);
  });

  return (
    <div className="space-y-6 bg-white min-h-full">
      
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#12263A] tracking-tight">Workflow Automation</h1>
          <p className="text-[11px] text-[#12263A] font-bold mt-1 uppercase tracking-wider">
            CONFIGURE EVENT TRIGGERS AND VISUAL CANVAS ACTIONS
          </p>
        </div>
        
        <button
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#166534] hover:bg-[#14532d] active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs transition-all cursor-pointer w-full sm:w-auto"
        >
          <Plus size={15} strokeWidth={2.5} /> Create Workflow
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 border border-[#E2E8F0] rounded-2xl shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#12263A]" />
          <input 
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search workflows..."
            className="w-full h-10 pl-10 pr-4 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl text-xs font-medium text-[#12263A] focus:outline-none focus:ring-2 focus:ring-[#22C55E]/15 focus:border-[#166534] transition-all placeholder:text-[#64748B]"
          />
        </div>
        {!isLoading && !hasError && workflows.length > 0 && (
          <div className="text-[11px] font-semibold text-[#64748B]">
            Showing <span className="font-bold text-[#12263A]">{filteredWorkflows.length}</span> of <span className="font-bold text-[#12263A]">{workflows.length}</span> {workflows.length === 1 ? 'workflow' : 'workflows'}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-16 text-center shadow-xs">
          <Loader2 size={28} className="animate-spin text-[#166534] mx-auto mb-3" />
          <p className="text-xs font-bold text-[#12263A] uppercase tracking-wider">Loading Workflows...</p>
          <p className="text-[11px] text-[#64748B] mt-1">Retrieving automation pipelines from server</p>
        </div>
      ) : hasError ? (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-12 text-center shadow-xs max-w-lg mx-auto">
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-200">
            <AlertCircle size={22} />
          </div>
          <h3 className="text-base font-bold text-[#12263A]">Failed to Load Workflows</h3>
          <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
            Unable to connect to the automation service. Please check your connection and retry.
          </p>
          <button
            onClick={fetchWorkflows}
            className="mt-6 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#166534] hover:bg-[#14532d] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-xs transition-all cursor-pointer"
          >
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      ) : workflows.length === 0 ? (
        /* Empty State Card */
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-12 sm:p-16 text-center shadow-xs max-w-lg mx-auto">
          <div className="w-14 h-14 bg-[#F0FDF4] border border-[#22C55E]/30 rounded-2xl flex items-center justify-center text-[#166534] mx-auto mb-4">
            <GitFork size={24} />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-[#12263A]">Create Your First Automation</h3>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1.5 leading-relaxed font-normal max-w-sm mx-auto">
            Build automated WhatsApp workflows without writing code.
          </p>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="mt-6 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#166534] hover:bg-[#14532d] active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Plus size={15} strokeWidth={2.5} /> CREATE WORKFLOW
          </button>
        </div>
      ) : filteredWorkflows.length === 0 ? (
        /* No Search Match State */
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-12 text-center shadow-xs max-w-lg mx-auto">
          <div className="w-12 h-12 bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Search size={20} />
          </div>
          <h3 className="text-base font-bold text-[#12263A]">No Workflows Found</h3>
          <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
            No workflows matched &ldquo;{search}&rdquo;. Try another search term or clear the filter.
          </p>
          <button
            onClick={() => setSearch('')}
            className="mt-5 inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] text-[#12263A] rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            Clear Search
          </button>
        </div>
      ) : (
        /* Grid of Workflow Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredWorkflows.map((w) => (
            <motion.div
              layout
              key={w.id}
              className={cn(
                "bg-white border rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative group",
                w.status === 'active' ? 'border-[#E2E8F0] hover:border-[#166534]/50' : 'border-[#E2E8F0] opacity-80'
              )}
            >
              <div>
                <div className="flex items-center justify-between gap-4 mb-3">
                  <span className="px-2.5 py-1 bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0] rounded-lg text-[9px] font-bold uppercase tracking-wider">
                    {w.trigger || 'Manual Trigger'}
                  </span>
                  
                  <div className="flex items-center gap-1.5">
                    {/* Status Toggle Switch */}
                    <button
                      onClick={() => toggleStatus(w)}
                      title={w.status === 'active' ? 'Active - click to deactivate' : 'Inactive - click to activate'}
                      className={cn(
                        "w-9 h-5 rounded-full p-0.5 transition-colors relative cursor-pointer",
                        w.status === 'active' ? 'bg-[#166534]' : 'bg-[#CBD5E1]'
                      )}
                    >
                      <div className={cn(
                        "w-4 h-4 rounded-full bg-white transition-transform shadow-xs",
                        w.status === 'active' ? 'translate-x-4' : 'translate-x-0'
                      )} />
                    </button>

                    {/* Action Dropdown Menu */}
                    <div className="relative">
                      <button
                        onClick={() => setActiveMenuId(activeMenuId === w.id ? null : w.id)}
                        className="p-1.5 rounded-lg hover:bg-[#F8FAFC] text-[#64748B] hover:text-[#12263A] border border-transparent hover:border-[#E2E8F0] transition-all cursor-pointer"
                        aria-label="Workflow options"
                      >
                        <MoreVertical size={16} />
                      </button>

                      <AnimatePresence>
                        {activeMenuId === w.id && (
                          <>
                            <div className="fixed inset-0 z-20" onClick={() => setActiveMenuId(null)} />
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: 5 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: 5 }}
                              className="absolute right-0 mt-1 w-44 bg-white border border-[#E2E8F0] rounded-xl shadow-lg z-30 py-1.5 overflow-hidden"
                            >
                              <button
                                onClick={() => navigate(`/automation/workflows/builder/${w.id}`)}
                                className="w-full px-3.5 py-2 text-xs font-semibold text-[#12263A] hover:bg-[#F8FAFC] text-left flex items-center gap-2 cursor-pointer transition-colors"
                              >
                                <GitFork size={13} className="text-[#166534]" /> Edit Builder
                              </button>
                              <button
                                onClick={() => handleEditOpen(w)}
                                className="w-full px-3.5 py-2 text-xs font-semibold text-[#12263A] hover:bg-[#F8FAFC] text-left flex items-center gap-2 cursor-pointer transition-colors"
                              >
                                <Edit2 size={13} className="text-[#64748B]" /> Edit Info
                              </button>
                              <div className="h-px bg-[#E2E8F0] my-1" />
                              <button
                                onClick={() => deleteWorkflow(w.id)}
                                className="w-full px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 text-left flex items-center gap-2 cursor-pointer transition-colors"
                              >
                                <Trash2 size={13} /> Delete Workflow
                              </button>
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-[#12263A] group-hover:text-[#166534] transition-colors leading-tight">
                  {w.name}
                </h3>
                
                <p className="text-xs text-[#64748B] mt-1 font-normal leading-relaxed line-clamp-2">
                  {w.description || 'No description provided.'}
                </p>

                <div className="mt-4 p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-[#F0FDF4] border border-[#22C55E]/30 flex items-center justify-center shrink-0">
                    <Sparkles size={12} className="text-[#166534]" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9px] font-bold text-[#64748B] uppercase tracking-widest block leading-none">Last Run</span>
                    <span className="text-[11px] font-bold text-[#12263A] truncate block mt-0.5">{w.lastRun || 'Never'}</span>
                  </div>
                </div>
              </div>

              {/* Stats Footer */}
              <div className="mt-5 pt-3.5 border-t border-[#E2E8F0] flex items-center justify-between text-[10px] text-[#64748B]">
                <div className="flex gap-4">
                  <div className="leading-tight">
                    <span className="block text-[8.5px] font-bold uppercase tracking-wider text-[#64748B]">Runs</span>
                    <span className="text-[#12263A] font-bold mt-0.5 block">{w.totalExecutions ?? 0}</span>
                  </div>
                  <div className="leading-tight">
                    <span className="block text-[8.5px] font-bold uppercase tracking-wider text-[#64748B]">Created By</span>
                    <span className="text-[#12263A] font-bold mt-0.5 block flex items-center gap-1">
                      <User size={10} className="text-[#64748B]" /> {w.createdBy || 'System'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/automation/workflows/builder/${w.id}`)}
                  className="text-xs font-bold text-[#166534] hover:text-[#14532d] flex items-center gap-1 cursor-pointer transition-colors"
                >
                  Open Builder &rarr;
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* CREATE MODAL */}
      <AnimatePresence>
        {isCreateOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreateOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="relative w-full max-w-md bg-white border border-[#E2E8F0] rounded-2xl shadow-xl overflow-hidden z-[110] p-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
                <span className="text-xs font-black text-[#12263A] uppercase tracking-widest">Create Workflow</span>
                <button 
                  onClick={() => setIsCreateOpen(false)} 
                  className="text-[#64748B] hover:text-[#12263A] p-1 rounded-lg hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest block">Workflow Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Welcome Message Automation"
                    className="w-full h-10 px-3.5 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl text-xs font-medium text-[#12263A] placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#22C55E]/15 focus:border-[#166534] transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest block">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what this automation does..."
                    className="w-full h-20 p-3 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl text-xs font-medium text-[#12263A] placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#22C55E]/15 focus:border-[#166534] transition-all resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest block">Initial Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full h-10 px-3 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl text-xs font-medium text-[#12263A] focus:outline-none focus:ring-2 focus:ring-[#22C55E]/15 focus:border-[#166534] transition-all cursor-pointer"
                  >
                    <option value="inactive">Inactive</option>
                    <option value="active">Active</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button 
                  type="button"
                  onClick={() => setIsCreateOpen(false)} 
                  className="w-1/2 py-2.5 bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] text-[#64748B] hover:text-[#12263A] rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  onClick={handleCreate} 
                  disabled={!name.trim()}
                  className="w-1/2 py-2.5 bg-[#166534] hover:bg-[#14532d] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs"
                >
                  Create
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT MODAL */}
      <AnimatePresence>
        {isEditOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="relative w-full max-w-md bg-white border border-[#E2E8F0] rounded-2xl shadow-xl overflow-hidden z-[110] p-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
                <span className="text-xs font-black text-[#12263A] uppercase tracking-widest">Edit Workflow Info</span>
                <button 
                  onClick={() => setIsEditOpen(false)} 
                  className="text-[#64748B] hover:text-[#12263A] p-1 rounded-lg hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest block">Workflow Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-10 px-3.5 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl text-xs font-medium text-[#12263A] focus:outline-none focus:ring-2 focus:ring-[#22C55E]/15 focus:border-[#166534] transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest block">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full h-20 p-3 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl text-xs font-medium text-[#12263A] focus:outline-none focus:ring-2 focus:ring-[#22C55E]/15 focus:border-[#166534] transition-all resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest block">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full h-10 px-3 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl text-xs font-medium text-[#12263A] focus:outline-none focus:ring-2 focus:ring-[#22C55E]/15 focus:border-[#166534] transition-all cursor-pointer"
                  >
                    <option value="inactive">Inactive</option>
                    <option value="active">Active</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button 
                  type="button"
                  onClick={() => setIsEditOpen(false)} 
                  className="w-1/2 py-2.5 bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] text-[#64748B] hover:text-[#12263A] rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  onClick={handleUpdate} 
                  disabled={!name.trim()}
                  className="w-1/2 py-2.5 bg-[#166534] hover:bg-[#14532d] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
