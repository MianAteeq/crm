import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { crmApi } from '../../services/crmApi';
import { 
  Plus, 
  Search, 
  GitFork, 
  MoreVertical, 
  Copy, 
  Trash2, 
  User, 
  Sparkles, 
  X,
  Edit2
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

  // CRUD Modal States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  
  // Form States
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('inactive');

  const fetchWorkflows = async () => {
    try {
      const data = await crmApi.getWorkflows();
      if (data && Array.isArray(data)) {
        setWorkflows(data);
      }
    } catch (err) {
      console.error('Failed to load workflows:', err);
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
    return w.name.toLowerCase().includes(search.toLowerCase()) || 
           w.description.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Workflow Automation</h1>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-1 uppercase tracking-wider">Configure event triggers and visual canvas actions</p>
        </div>
        
        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center justify-center gap-2 px-4.5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer w-full sm:w-auto"
        >
          <Plus size={15} strokeWidth={2.5} /> Create Workflow
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-4 border border-slate-200/80 dark:border-slate-750/70 rounded-2xl shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-405" />
          <input 
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search workflows..."
            className="w-full h-10 pl-10 pr-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all placeholder:text-slate-450"
          />
        </div>
      </div>

      {/* Grid of Workflow Cards */}
      {isLoading ? (
        <div className="text-center py-16 text-xs font-bold text-slate-450">Loading workflows...</div>
      ) : filteredWorkflows.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-750/70 rounded-2xl p-16 text-center shadow-sm max-w-lg mx-auto">
          <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl flex items-center justify-center text-indigo-650 mx-auto mb-4">
            <GitFork size={24} />
          </div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Create Your First Automation</h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5 leading-relaxed font-semibold">
            Build automated WhatsApp workflows without writing code.
          </p>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="mt-6 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            Create Workflow
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredWorkflows.map((w) => (
            <motion.div
              layout
              key={w.id}
              className={cn(
                "bg-white dark:bg-slate-800 border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative group",
                w.status === 'active' ? 'border-slate-200/80 dark:border-slate-700/80' : 'border-slate-100 dark:border-slate-800 opacity-80'
              )}
            >
              <div>
                <div className="flex items-center justify-between gap-4 mb-3">
                  <span className="px-2.5 py-1 bg-slate-50 dark:bg-slate-900/60 text-slate-650 dark:text-slate-350 border border-slate-200/60 dark:border-slate-750 rounded-lg text-[9px] font-black uppercase tracking-wider">
                    {w.trigger || 'Manual Trigger'}
                  </span>
                  
                  <div className="flex items-center gap-1.5">
                    {/* Status Toggle Switch */}
                    <button
                      onClick={() => toggleStatus(w)}
                      className={cn(
                        "w-9 h-5 rounded-full p-0.5 transition-colors relative cursor-pointer",
                        w.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                      )}
                    >
                      <div className={cn(
                        "w-4 h-4 rounded-full bg-white transition-transform shadow-sm",
                        w.status === 'active' ? 'translate-x-4' : 'translate-x-0'
                      )} />
                    </button>

                    {/* Action Dropdown Menu */}
                    <div className="relative">
                      <button
                        onClick={() => setActiveMenuId(activeMenuId === w.id ? null : w.id)}
                        className="p-1 rounded-lg hover:bg-slate-150/70 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-650 transition-all cursor-pointer"
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
                              className="absolute right-0 mt-1 w-44 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-30 py-1.5 overflow-hidden"
                            >
                              <button
                                onClick={() => navigate(`/automation/workflows/builder/${w.id}`)}
                                className="w-full px-3.5 py-2 text-xs font-bold text-slate-750 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 text-left flex items-center gap-2"
                              >
                                <GitFork size={13} /> Edit Builder
                              </button>
                              <button
                                onClick={() => handleEditOpen(w)}
                                className="w-full px-3.5 py-2 text-xs font-bold text-slate-750 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 text-left flex items-center gap-2"
                              >
                                <Edit2 size={13} /> Edit Info
                              </button>
                              <div className="h-px bg-slate-100 dark:bg-slate-700 my-1" />
                              <button
                                onClick={() => deleteWorkflow(w.id)}
                                className="w-full px-3.5 py-2 text-xs font-bold text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20 text-left flex items-center gap-2"
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

                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-650 transition-colors leading-tight">
                  {w.name}
                </h3>
                
                <p className="text-xs text-slate-400 dark:text-slate-450 mt-1 font-semibold leading-relaxed line-clamp-2">
                  {w.description}
                </p>

                <div className="mt-4 p-2.5 bg-slate-50 dark:bg-slate-900/40 border border-slate-150/70 dark:border-slate-800 rounded-xl flex items-center gap-2">
                  <Sparkles size={13} className="text-indigo-600 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[8.5px] font-bold text-slate-400 dark:text-slate-505 uppercase tracking-widest block leading-none">Last Run</span>
                    <span className="text-[10px] font-extrabold text-slate-800 dark:text-slate-200 truncate block mt-0.5">{w.lastRun}</span>
                  </div>
                </div>
              </div>

              {/* Stats Footer */}
              <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-750 flex items-center justify-between text-[10px] font-bold text-slate-400">
                <div className="flex gap-4">
                  <div className="leading-tight">
                    <span className="block text-[8px] font-bold uppercase tracking-widest text-slate-400">Runs</span>
                    <span className="text-slate-700 dark:text-slate-200 font-extrabold mt-0.5 block">{w.totalExecutions}</span>
                  </div>
                  <div className="leading-tight">
                    <span className="block text-[8px] font-bold uppercase tracking-widest text-slate-400">By</span>
                    <span className="text-slate-700 dark:text-slate-250 mt-0.5 block flex items-center gap-0.5">
                      <User size={9} /> {w.createdBy}
                    </span>
                  </div>
                </div>
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
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-800 border border-slate-250 dark:border-slate-700 rounded-3xl shadow-xl overflow-hidden z-[110] p-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-150 pb-3">
                <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Create Workflow</span>
                <button onClick={() => setIsCreateOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-450 uppercase tracking-widest block">Workflow Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter name..."
                    className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-450 uppercase tracking-widest block">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter description..."
                    className="w-full h-20 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-450 uppercase tracking-widest block">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full h-10 px-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
                  >
                    <option value="inactive">Inactive</option>
                    <option value="active">Active</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button onClick={() => setIsCreateOpen(false)} className="w-1/2 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold">Cancel</button>
                <button onClick={handleCreate} className="w-1/2 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold">Create</button>
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
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-800 border border-slate-250 dark:border-slate-700 rounded-3xl shadow-xl overflow-hidden z-[110] p-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-150 pb-3">
                <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Edit Workflow Info</span>
                <button onClick={() => setIsEditOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-450 uppercase tracking-widest block">Workflow Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-450 uppercase tracking-widest block">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full h-20 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-450 uppercase tracking-widest block">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full h-10 px-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
                  >
                    <option value="inactive">Inactive</option>
                    <option value="active">Active</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button onClick={() => setIsEditOpen(false)} className="w-1/2 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold">Cancel</button>
                <button onClick={handleUpdate} className="w-1/2 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold">Save Changes</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
