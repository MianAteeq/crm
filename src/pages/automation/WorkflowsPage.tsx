import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { crmApi } from '../../services/crmApi';
import { 
  Plus, 
  Search, 
  GitFork, 
  MoreVertical, 
  Trash2, 
  Sparkles, 
  X,
  Edit2,
  AlertCircle,
  RefreshCw,
  Loader2,
  PlayCircle,
  PauseCircle,
  Copy,
  Folder,
  FolderPlus,
  FolderEdit,
  History,
  CheckCircle2,
  ArrowUpDown,
  Filter,
  CheckSquare,
  Square,
  MessageSquare,
  Send,
  Zap,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from '../../components/ui/Toast';
import { useI18n } from '../../i18n';

interface FolderItem {
  id: number;
  name: string;
  workflows_count?: number;
}

interface WorkflowItem {
  id: number;
  name: string;
  folder_id: number | null;
  folder?: { id: number; name: string } | null;
  description: string;
  internal_notes?: string;
  status: 'active' | 'draft' | 'paused' | 'error' | 'inactive';
  trigger: string;
  whatsapp_sender_number?: string;
  activeEnrollments: number;
  completionRate: number;
  replyRate: number;
  failureCount: number;
  lastRun: string;
  updatedAt: string;
  createdBy: string;
  version: string;
  lock_version?: number;
  totalExecutions: number;
}

export default function WorkflowsPage() {
  const navigate = useNavigate();
  const { isRtl } = useI18n();

  // Data States
  const [workflows, setWorkflows] = useState<WorkflowItem[]>([]);
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Filter States
  const [search, setSearch] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState<number | 'all' | 'unorganized'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'draft' | 'paused' | 'error'>('all');
  const [triggerFilter, setTriggerFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'updatedAt' | 'name' | 'totalExecutions' | 'completionRate'>('updatedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Selection & Bulk Actions
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isBulkMoveOpen, setIsBulkMoveOpen] = useState(false);
  const [bulkTargetFolderId, setBulkTargetFolderId] = useState<number | null>(null);
  const [isBulkDeleteConfirm, setIsBulkDeleteConfirm] = useState(false);
  const [isPerformingBulk, setIsPerformingBulk] = useState(false);

  // Active Dropdown Menu
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);

  // Folder Modal States
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [folderModalMode, setFolderModalMode] = useState<'create' | 'rename'>('create');
  const [targetFolder, setTargetFolder] = useState<FolderItem | null>(null);
  const [folderNameInput, setFolderNameInput] = useState('');
  const [isFolderSaving, setIsFolderSaving] = useState(false);

  // Create Workflow Modal
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newWorkflowName, setNewWorkflowName] = useState('');
  const [newWorkflowDescription, setNewWorkflowDescription] = useState('');
  const [newWorkflowFolderId, setNewWorkflowFolderId] = useState<number | null>(null);
  const [isCreatingWorkflow, setIsCreatingWorkflow] = useState(false);

  // Single Action Modal
  const [singleActionWorkflow, setSingleActionWorkflow] = useState<WorkflowItem | null>(null);
  const [isMoveSingleOpen, setIsMoveSingleOpen] = useState(false);
  const [singleTargetFolderId, setSingleTargetFolderId] = useState<number | null>(null);
  const [isDeleteSingleConfirm, setIsDeleteSingleConfirm] = useState(false);
  const [isTestingWorkflow, setIsTestingWorkflow] = useState(false);

  // Fetch Workflows & Folders
  const fetchData = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const [workflowsRes, foldersRes] = await Promise.all([
        crmApi.getWorkflows(),
        crmApi.getAutomationFolders(),
      ]);

      const workflowList = Array.isArray(workflowsRes) ? workflowsRes : (workflowsRes?.data || []);
      const folderList = Array.isArray(foldersRes) ? foldersRes : (foldersRes?.data || []);

      setWorkflows(workflowList);
      setFolders(folderList);
    } catch (err) {
      console.error('Failed to load workflows or folders:', err);
      setHasError(true);
      toast.error(isRtl ? 'خطأ' : 'Error', isRtl ? 'فشل استرجاع مسارات العمل.' : 'Failed to retrieve workflows.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtered and Sorted Workflows
  const filteredWorkflows = useMemo(() => {
    return workflows
      .filter((w) => {
        // Search Filter
        const term = search.toLowerCase().trim();
        const matchesSearch = !term || 
          w.name.toLowerCase().includes(term) || 
          (w.description && w.description.toLowerCase().includes(term));

        // Folder Filter
        let matchesFolder = true;
        if (selectedFolderId === 'unorganized') {
          matchesFolder = !w.folder_id;
        } else if (selectedFolderId !== 'all') {
          matchesFolder = w.folder_id === selectedFolderId;
        }

        // Status Filter
        let matchesStatus = true;
        if (statusFilter !== 'all') {
          const wStatus = w.status === 'inactive' ? 'draft' : w.status;
          matchesStatus = wStatus === statusFilter;
        }

        // Trigger Filter
        let matchesTrigger = true;
        if (triggerFilter !== 'all') {
          matchesTrigger = w.trigger.toLowerCase().includes(triggerFilter.toLowerCase());
        }

        return matchesSearch && matchesFolder && matchesStatus && matchesTrigger;
      })
      .sort((a, b) => {
        let valA: any = a[sortBy];
        let valB: any = b[sortBy];

        if (sortBy === 'name') {
          valA = (a.name || '').toLowerCase();
          valB = (b.name || '').toLowerCase();
        }

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [workflows, search, selectedFolderId, statusFilter, triggerFilter, sortBy, sortOrder]);

  // Unique Triggers for dropdown
  const uniqueTriggers = useMemo(() => {
    const set = new Set<string>();
    workflows.forEach(w => {
      if (w.trigger) set.add(w.trigger);
    });
    return Array.from(set);
  }, [workflows]);

  // Folder count calculation
  const folderCounts = useMemo(() => {
    const counts: Record<number | string, number> = { all: workflows.length, unorganized: 0 };
    workflows.forEach((w) => {
      if (!w.folder_id) {
        counts.unorganized += 1;
      } else {
        counts[w.folder_id] = (counts[w.folder_id] || 0) + 1;
      }
    });
    return counts;
  }, [workflows]);

  // Select All / Deselect All
  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredWorkflows.length && filteredWorkflows.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredWorkflows.map(w => w.id));
    }
  };

  const handleToggleSelectOne = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Workflow Quick Actions
  const handlePauseResume = async (w: WorkflowItem) => {
    const isPaused = w.status === 'paused' || w.status === 'draft' || w.status === 'inactive';
    try {
      if (isPaused) {
        await crmApi.resumeWorkflow(w.id);
        toast.success(isRtl ? 'تم التفعيل' : 'Resumed', isRtl ? 'تم تفعيل مسار العمل بنجاح.' : 'Workflow resumed successfully.');
      } else {
        await crmApi.pauseWorkflow(w.id);
        toast.success(isRtl ? 'تم الإيقاف' : 'Paused', isRtl ? 'تم إيقاف مسار العمل مؤقتاً.' : 'Workflow paused successfully.');
      }
      setActiveMenuId(null);
      fetchData();
    } catch (err: any) {
      toast.error(isRtl ? 'فشل' : 'Failed', err?.message || 'Could not update workflow state.');
    }
  };

  const handleDuplicate = async (w: WorkflowItem) => {
    try {
      await crmApi.duplicateWorkflow(w.id);
      toast.success(isRtl ? 'تم النسخ' : 'Duplicated', isRtl ? 'تم تكرار مسار العمل بنجاح.' : 'Workflow duplicated as a draft.');
      setActiveMenuId(null);
      fetchData();
    } catch (err: any) {
      toast.error(isRtl ? 'فشل' : 'Failed', err?.message || 'Could not duplicate workflow.');
    }
  };

  const handleTestWorkflow = async (w: WorkflowItem) => {
    setIsTestingWorkflow(true);
    try {
      const res = await crmApi.testWorkflow(w.id, { trigger_type: 'test_simulation' });
      toast.success(
        isRtl ? 'تم الاختبار بنجاح' : 'Test Complete',
        res?.message || (isRtl ? 'تم تشغيل بيئة اختبار معزولة بنجاح.' : 'Isolated dry run finished without errors.')
      );
      setActiveMenuId(null);
    } catch (err: any) {
      toast.error(isRtl ? 'خطأ في الاختبار' : 'Test Error', err?.message || 'Dry run failed.');
    } finally {
      setIsTestingWorkflow(false);
    }
  };

  const handleDeleteSingle = async () => {
    if (!singleActionWorkflow) return;
    try {
      await crmApi.deleteWorkflow(singleActionWorkflow.id);
      toast.success(isRtl ? 'تم الحذف' : 'Deleted', isRtl ? 'تم حذف مسار العمل.' : 'Workflow deleted.');
      setIsDeleteSingleConfirm(false);
      setSingleActionWorkflow(null);
      setSelectedIds(prev => prev.filter(id => id !== singleActionWorkflow.id));
      fetchData();
    } catch (err: any) {
      toast.error(isRtl ? 'فشل الحذف' : 'Delete Failed', err?.message || 'Could not delete workflow.');
    }
  };

  const handleMoveSingle = async () => {
    if (!singleActionWorkflow) return;
    try {
      await crmApi.moveWorkflowToFolder(singleActionWorkflow.id, singleTargetFolderId);
      toast.success(isRtl ? 'تم النقل' : 'Moved', isRtl ? 'تم نقل مسار العمل إلى المجلد.' : 'Workflow moved to folder.');
      setIsMoveSingleOpen(false);
      setSingleActionWorkflow(null);
      fetchData();
    } catch (err: any) {
      toast.error(isRtl ? 'فشل النقل' : 'Move Failed', err?.message || 'Could not move workflow.');
    }
  };

  // Bulk Handlers
  const handleBulkPause = async () => {
    if (selectedIds.length === 0) return;
    setIsPerformingBulk(true);
    try {
      await crmApi.bulkPauseWorkflows(selectedIds);
      toast.success(isRtl ? 'تم الإيقاف' : 'Paused', isRtl ? `تم إيقاف ${selectedIds.length} مسارات عمل.` : `Paused ${selectedIds.length} workflows.`);
      setSelectedIds([]);
      fetchData();
    } catch (err: any) {
      toast.error(isRtl ? 'فشل' : 'Failed', err?.message || 'Bulk pause failed.');
    } finally {
      setIsPerformingBulk(false);
    }
  };

  const handleBulkMove = async () => {
    if (selectedIds.length === 0) return;
    setIsPerformingBulk(true);
    try {
      await crmApi.bulkMoveWorkflows(selectedIds, bulkTargetFolderId);
      toast.success(isRtl ? 'تم النقل' : 'Moved', isRtl ? `تم نقل ${selectedIds.length} مسارات عمل.` : `Moved ${selectedIds.length} workflows.`);
      setIsBulkMoveOpen(false);
      setSelectedIds([]);
      fetchData();
    } catch (err: any) {
      toast.error(isRtl ? 'فشل' : 'Failed', err?.message || 'Bulk move failed.');
    } finally {
      setIsPerformingBulk(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    setIsPerformingBulk(true);
    try {
      await crmApi.bulkDeleteWorkflows(selectedIds);
      toast.success(isRtl ? 'تم الحذف' : 'Deleted', isRtl ? `تم حذف ${selectedIds.length} مسارات عمل.` : `Deleted ${selectedIds.length} workflows.`);
      setIsBulkDeleteConfirm(false);
      setSelectedIds([]);
      fetchData();
    } catch (err: any) {
      toast.error(isRtl ? 'فشل' : 'Failed', err?.message || 'Bulk delete failed.');
    } finally {
      setIsPerformingBulk(false);
    }
  };

  // Folder Handlers
  const handleSaveFolder = async () => {
    if (!folderNameInput.trim()) return;
    setIsFolderSaving(true);
    try {
      await crmApi.createAutomationFolder({ name: folderNameInput.trim() });
      toast.success(isRtl ? 'تم الحفظ' : 'Saved', isRtl ? 'تم إنشاء المجلد بنجاح.' : 'Folder created successfully.');
      setIsFolderModalOpen(false);
      setFolderNameInput('');
      fetchData();
    } catch (err: any) {
      toast.error(isRtl ? 'خطأ' : 'Error', err?.message || 'Could not save folder.');
    } finally {
      setIsFolderSaving(false);
    }
  };

  // Create New Workflow
  const handleCreateWorkflow = async () => {
    if (!newWorkflowName.trim()) return;
    setIsCreatingWorkflow(true);
    try {
      const res = await crmApi.createWorkflow({
        name: newWorkflowName.trim(),
        description: newWorkflowDescription.trim(),
        folder_id: newWorkflowFolderId,
        status: 'draft',
      });
      toast.success(isRtl ? 'تم الإنشاء' : 'Created', isRtl ? 'تم إنشاء المسار كمسودة، جاري فتح أداة البناء...' : 'Workflow draft created. Opening builder...');
      setIsCreateOpen(false);
      navigate(`/automation/workflows/builder/${res.id}`);
    } catch (err: any) {
      toast.error(isRtl ? 'خطأ' : 'Error', err?.message || 'Could not create workflow.');
      setIsCreatingWorkflow(false);
    }
  };

  return (
    <div className={cn("space-y-6 bg-white font-sans", isRtl && "text-right")} dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[#12263A]">
              {isRtl ? 'مسارات عمل واتساب' : 'WhatsApp Workflows'}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#F0FDF4] text-[#166534] border border-[#22C55E]/30">
              {workflows.length} {isRtl ? 'مسار' : 'Total'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1 font-medium">
            {isRtl 
              ? 'إنشاء وإدارة ومراقبة مسارات العمل المؤتمتة عبر واتساب ومزامنتها مع العملاء.' 
              : 'Create, monitor, and organize production-grade WhatsApp customer engagement automations.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => navigate('/automation/templates')}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-white hover:bg-slate-50 text-xs font-bold text-[#12263A] transition-all cursor-pointer shadow-sm"
          >
            <Sparkles size={14} className="text-amber-500" />
            {isRtl ? 'استخدام قالب' : 'Use Template'}
          </button>
          
          <button
            onClick={() => {
              setNewWorkflowName('');
              setNewWorkflowDescription('');
              setNewWorkflowFolderId(typeof selectedFolderId === 'number' ? selectedFolderId : null);
              setIsCreateOpen(true);
            }}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#166534] hover:bg-[#15803d] text-white text-xs font-bold transition-all cursor-pointer shadow-sm hover:shadow"
          >
            <Plus size={15} />
            {isRtl ? 'مسار عمل جديد' : 'New Workflow'}
          </button>
        </div>
      </div>

      {/* Main Workspace Layout (Folder Sidebar + Workflows Table) */}
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6 items-start">
        
        {/* Left Folder Hierarchy Panel */}
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-3.5 space-y-3">
          <div className="flex items-center justify-between px-2 pt-1">
            <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
              {isRtl ? 'المجلدات' : 'Folders'}
            </span>
            <button
              onClick={() => {
                setFolderModalMode('create');
                setFolderNameInput('');
                setIsFolderModalOpen(true);
              }}
              className="p-1 rounded-lg text-[#166534] hover:bg-[#F0FDF4] transition-colors"
              title={isRtl ? 'مجلد جديد' : 'New Folder'}
            >
              <FolderPlus size={15} />
            </button>
          </div>

          <div className="space-y-1">
            <button
              onClick={() => setSelectedFolderId('all')}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all text-left",
                selectedFolderId === 'all' 
                  ? "bg-white text-[#166534] shadow-sm border border-[#E2E8F0]" 
                  : "text-[#64748B] hover:text-[#12263A] hover:bg-slate-200/50"
              )}
            >
              <div className="flex items-center gap-2">
                <GitFork size={14} />
                <span>{isRtl ? 'كافة المسارات' : 'All Workflows'}</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-bold">
                {folderCounts.all || 0}
              </span>
            </button>

            <button
              onClick={() => setSelectedFolderId('unorganized')}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all text-left",
                selectedFolderId === 'unorganized' 
                  ? "bg-white text-[#166534] shadow-sm border border-[#E2E8F0]" 
                  : "text-[#64748B] hover:text-[#12263A] hover:bg-slate-200/50"
              )}
            >
              <div className="flex items-center gap-2">
                <Folder size={14} className="text-slate-400" />
                <span>{isRtl ? 'بدون مجلد' : 'Unorganized'}</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-bold">
                {folderCounts.unorganized || 0}
              </span>
            </button>

            {folders.map(folder => (
              <button
                key={folder.id}
                onClick={() => setSelectedFolderId(folder.id)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all text-left group",
                  selectedFolderId === folder.id 
                    ? "bg-white text-[#166534] shadow-sm border border-[#E2E8F0]" 
                    : "text-[#64748B] hover:text-[#12263A] hover:bg-slate-200/50"
                )}
              >
                <div className="flex items-center gap-2 truncate">
                  <Folder size={14} className={selectedFolderId === folder.id ? "text-[#166534]" : "text-amber-500"} />
                  <span className="truncate">{folder.name}</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-bold shrink-0">
                  {folderCounts[folder.id] || 0}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Workflow Content Area */}
        <div className="space-y-4">
          
          {/* Top Filter and Search Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={isRtl ? 'بحث باسم المسار أو الوصف...' : 'Search workflows by name or description...'}
                className="w-full pl-9 pr-4 py-2 bg-white border border-[#E2E8F0] rounded-xl text-xs font-medium focus:outline-none focus:border-[#166534] focus:ring-1 focus:ring-[#166534]"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Status Pills */}
            <div className="flex items-center gap-1 bg-[#F8FAFC] border border-[#E2E8F0] p-1 rounded-xl overflow-x-auto text-xs">
              {(['all', 'active', 'draft', 'paused', 'error'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={cn(
                    "px-2.5 py-1 rounded-lg font-bold capitalize transition-all whitespace-nowrap",
                    statusFilter === st 
                      ? "bg-white text-[#166534] shadow-sm border border-[#E2E8F0]" 
                      : "text-slate-500 hover:text-[#12263A]"
                  )}
                >
                  {st === 'all' ? (isRtl ? 'الكل' : 'All') : st}
                </button>
              ))}
            </div>

            {/* Trigger Filter Dropdown */}
            <select
              value={triggerFilter}
              onChange={(e) => setTriggerFilter(e.target.value)}
              className="px-3 py-2 bg-white border border-[#E2E8F0] rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-[#166534]"
            >
              <option value="all">{isRtl ? 'كافة المشغلات' : 'All Triggers'}</option>
              {uniqueTriggers.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-1.5">
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-white border border-[#E2E8F0] rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-[#166534]"
              >
                <option value="updatedAt">{isRtl ? 'آخر تحديث' : 'Last Updated'}</option>
                <option value="name">{isRtl ? 'الاسم' : 'Name'}</option>
                <option value="totalExecutions">{isRtl ? 'التشغيل الكلي' : 'Executions'}</option>
                <option value="completionRate">{isRtl ? 'نسبة الإكمال' : 'Completion Rate'}</option>
              </select>

              <button
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                className="p-2 border border-[#E2E8F0] bg-white rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
                title="Toggle sort direction"
              >
                <ArrowUpDown size={14} />
              </button>
            </div>
          </div>

          {/* Bulk Action Banner when multiple items selected */}
          {selectedIds.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between p-3 bg-[#F0FDF4] border border-[#22C55E]/40 rounded-xl"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#166534]" />
                <span className="text-xs font-bold text-[#166534]">
                  {selectedIds.length} {isRtl ? 'مسارات محددة' : 'workflows selected'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  disabled={isPerformingBulk}
                  onClick={handleBulkPause}
                  className="flex items-center gap-1 px-3 py-1.5 bg-white border border-[#E2E8F0] hover:bg-slate-50 text-xs font-bold text-slate-700 rounded-lg shadow-sm"
                >
                  <PauseCircle size={14} className="text-amber-500" />
                  {isRtl ? 'إيقاف مؤقت' : 'Pause'}
                </button>

                <button
                  disabled={isPerformingBulk}
                  onClick={() => setIsBulkMoveOpen(true)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-white border border-[#E2E8F0] hover:bg-slate-50 text-xs font-bold text-slate-700 rounded-lg shadow-sm"
                >
                  <Folder size={14} className="text-[#166534]" />
                  {isRtl ? 'نقل لمجلد' : 'Move to Folder'}
                </button>

                <button
                  disabled={isPerformingBulk}
                  onClick={() => setIsBulkDeleteConfirm(true)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-white border border-red-200 hover:bg-red-50 text-xs font-bold text-red-600 rounded-lg shadow-sm"
                >
                  <Trash2 size={14} />
                  {isRtl ? 'حذف' : 'Delete'}
                </button>

                <button
                  onClick={() => setSelectedIds([])}
                  className="p-1.5 text-slate-400 hover:text-slate-600"
                  title="Clear selection"
                >
                  <X size={14} />
                </button>
              </div>
            </motion.div>
          )}

          {/* Workflows Table */}
          <div className="border border-[#E2E8F0] rounded-2xl overflow-hidden bg-white shadow-sm">
            {isLoading ? (
              <div className="p-16 flex flex-col items-center justify-center gap-3 text-slate-500">
                <Loader2 size={24} className="animate-spin text-[#166534]" />
                <span className="text-xs font-bold">{isRtl ? 'جاري تحميل مسارات العمل...' : 'Loading WhatsApp workflows...'}</span>
              </div>
            ) : hasError ? (
              <div className="p-12 text-center space-y-3">
                <AlertCircle size={28} className="text-red-500 mx-auto" />
                <p className="text-xs font-bold text-slate-700">{isRtl ? 'تعذر جلب مسارات العمل من الخادم.' : 'Unable to load workflows.'}</p>
                <button
                  onClick={fetchData}
                  className="px-4 py-2 bg-[#166534] text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
                >
                  <RefreshCw size={14} /> {isRtl ? 'إعادة المحاولة' : 'Retry'}
                </button>
              </div>
            ) : filteredWorkflows.length === 0 ? (
              <div className="p-16 text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <GitFork size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#12263A]">{isRtl ? 'لا توجد مسارات مطابقة' : 'No workflows found'}</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    {search || statusFilter !== 'all' || triggerFilter !== 'all' 
                      ? (isRtl ? 'جرب ضبط معايير البحث أو التصفية.' : 'Try adjusting your search criteria or active filters.') 
                      : (isRtl ? 'ابدأ بإنشاء مسار واتساب مخصص أو استخدم أحد القوالب الجاهزة.' : 'Start by building a tailored WhatsApp flow or launch one from our template library.')}
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 pt-2">
                  <button
                    onClick={() => navigate('/automation/templates')}
                    className="px-4 py-2 border border-[#E2E8F0] rounded-xl text-xs font-bold text-[#12263A] hover:bg-slate-50"
                  >
                    {isRtl ? 'استعراض القوالب' : 'Browse Templates'}
                  </button>
                  <button
                    onClick={() => {
                      setNewWorkflowName('');
                      setNewWorkflowDescription('');
                      setIsCreateOpen(true);
                    }}
                    className="px-4 py-2 bg-[#166534] text-white rounded-xl text-xs font-bold"
                  >
                    {isRtl ? 'إنشاء مسار جديد' : 'New Workflow'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3 w-8 text-center">
                        <button
                          onClick={handleToggleSelectAll}
                          className="text-slate-400 hover:text-slate-700"
                        >
                          {selectedIds.length === filteredWorkflows.length && filteredWorkflows.length > 0 ? (
                            <CheckSquare size={15} className="text-[#166534]" />
                          ) : (
                            <Square size={15} />
                          )}
                        </button>
                      </th>
                      <th className="p-3">{isRtl ? 'اسم المسار' : 'Workflow Name'}</th>
                      <th className="p-3">{isRtl ? 'المجلد' : 'Folder'}</th>
                      <th className="p-3">{isRtl ? 'الحالة' : 'Status'}</th>
                      <th className="p-3">{isRtl ? 'المشغّل' : 'Trigger'}</th>
                      <th className="p-3">{isRtl ? 'رقم المرسل' : 'WhatsApp Sender'}</th>
                      <th className="p-3 text-center">{isRtl ? 'النشط' : 'Active'}</th>
                      <th className="p-3 text-center">{isRtl ? 'نسبة الإكمال' : 'Completion'}</th>
                      <th className="p-3 text-center">{isRtl ? 'الردود' : 'Reply %'}</th>
                      <th className="p-3 text-center">{isRtl ? 'الأخطاء' : 'Failures'}</th>
                      <th className="p-3">{isRtl ? 'آخر تشغيل' : 'Last Run'}</th>
                      <th className="p-3 w-12 text-center">{isRtl ? 'إجراءات' : 'Actions'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0]">
                    {filteredWorkflows.map((w) => {
                      const isSelected = selectedIds.includes(w.id);
                      const isPaused = w.status === 'paused' || w.status === 'draft' || w.status === 'inactive';

                      return (
                        <tr 
                          key={w.id} 
                          className={cn(
                            "hover:bg-[#F8FAFC] transition-colors",
                            isSelected && "bg-[#F0FDF4]/50"
                          )}
                        >
                          {/* Multi-select check */}
                          <td className="p-3 text-center">
                            <button
                              onClick={() => handleToggleSelectOne(w.id)}
                              className="text-slate-400 hover:text-slate-700"
                            >
                              {isSelected ? (
                                <CheckSquare size={15} className="text-[#166534]" />
                              ) : (
                                <Square size={15} />
                              )}
                            </button>
                          </td>

                          {/* Workflow Name & Version */}
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => navigate(`/automation/workflows/builder/${w.id}`)}
                                className="font-bold text-[#12263A] hover:text-[#166534] transition-colors text-left"
                              >
                                {w.name}
                              </button>
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-600">
                                v{w.version || '1.0'}
                              </span>
                            </div>
                            {w.description && (
                              <p className="text-[11px] text-slate-500 truncate max-w-xs mt-0.5">
                                {w.description}
                              </p>
                            )}
                          </td>

                          {/* Folder */}
                          <td className="p-3 text-slate-600">
                            {w.folder ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-semibold">
                                <Folder size={11} className="text-amber-500" />
                                {w.folder.name}
                              </span>
                            ) : (
                              <span className="text-slate-400 text-[11px]">—</span>
                            )}
                          </td>

                          {/* Status */}
                          <td className="p-3">
                            <span className={cn(
                              "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                              w.status === 'active' && "bg-[#F0FDF4] text-[#166534] border border-[#22C55E]/30",
                              w.status === 'paused' && "bg-amber-50 text-amber-700 border border-amber-200",
                              (w.status === 'draft' || w.status === 'inactive') && "bg-slate-100 text-slate-600 border border-slate-200",
                              w.status === 'error' && "bg-red-50 text-red-700 border border-red-200"
                            )}>
                              <span className={cn(
                                "w-1.5 h-1.5 rounded-full",
                                w.status === 'active' && "bg-[#166534] animate-pulse",
                                w.status === 'paused' && "bg-amber-500",
                                (w.status === 'draft' || w.status === 'inactive') && "bg-slate-400",
                                w.status === 'error' && "bg-red-500"
                              )} />
                              {w.status === 'inactive' ? 'Draft' : w.status}
                            </span>
                          </td>

                          {/* Trigger */}
                          <td className="p-3">
                            <span className="inline-flex items-center gap-1.5 text-slate-700 font-semibold text-[11px]">
                              <Zap size={12} className="text-amber-500" />
                              <span className="truncate max-w-[140px]">{w.trigger}</span>
                            </span>
                          </td>

                          {/* WhatsApp Sender */}
                          <td className="p-3 text-slate-600 font-mono text-[11px]">
                            {w.whatsapp_sender_number || 'Default Number'}
                          </td>

                          {/* Active Enrollments */}
                          <td className="p-3 text-center font-bold text-slate-700">
                            {w.activeEnrollments || 0}
                          </td>

                          {/* Completion Rate */}
                          <td className="p-3 text-center">
                            <span className="font-bold text-slate-700">{w.completionRate || 0}%</span>
                          </td>

                          {/* Reply Rate */}
                          <td className="p-3 text-center font-bold text-[#166534]">
                            {w.replyRate || 0}%
                          </td>

                          {/* Failure Count */}
                          <td className="p-3 text-center">
                            {w.failureCount > 0 ? (
                              <span className="px-1.5 py-0.5 rounded bg-red-50 text-red-700 font-bold border border-red-200">
                                {w.failureCount}
                              </span>
                            ) : (
                              <span className="text-slate-400">0</span>
                            )}
                          </td>

                          {/* Last Execution */}
                          <td className="p-3 text-slate-500 text-[11px]">
                            {w.lastRun || 'Never'}
                          </td>

                          {/* Row Actions Dropdown */}
                          <td className="p-3 text-center relative">
                            <button
                              onClick={() => setActiveMenuId(activeMenuId === w.id ? null : w.id)}
                              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                            >
                              <MoreVertical size={15} />
                            </button>

                            {activeMenuId === w.id && (
                              <div 
                                className="absolute right-3 top-8 w-48 bg-white border border-[#E2E8F0] rounded-xl shadow-xl py-1.5 z-40 text-left"
                                onMouseLeave={() => setActiveMenuId(null)}
                              >
                                <button
                                  onClick={() => navigate(`/automation/workflows/builder/${w.id}`)}
                                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-[#12263A] hover:bg-slate-50 font-bold"
                                >
                                  <Edit2 size={13} className="text-[#166534]" />
                                  {isRtl ? 'فتح في المحرر' : 'Edit in Builder'}
                                </button>

                                <button
                                  onClick={() => handleTestWorkflow(w)}
                                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-[#12263A] hover:bg-slate-50 font-bold"
                                >
                                  <PlayCircle size={13} className="text-amber-500" />
                                  {isRtl ? 'اختبار المسار' : 'Test Run'}
                                </button>

                                <button
                                  onClick={() => handlePauseResume(w)}
                                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-[#12263A] hover:bg-slate-50 font-bold"
                                >
                                  {isPaused ? (
                                    <>
                                      <PlayCircle size={13} className="text-[#166534]" />
                                      {isRtl ? 'تفعيل المسار' : 'Resume Workflow'}
                                    </>
                                  ) : (
                                    <>
                                      <PauseCircle size={13} className="text-amber-500" />
                                      {isRtl ? 'إيقاف مؤقت' : 'Pause Workflow'}
                                    </>
                                  )}
                                </button>

                                <button
                                  onClick={() => handleDuplicate(w)}
                                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-[#12263A] hover:bg-slate-50 font-bold"
                                >
                                  <Copy size={13} className="text-slate-500" />
                                  {isRtl ? 'تكرار المسار' : 'Duplicate'}
                                </button>

                                <button
                                  onClick={() => {
                                    setSingleActionWorkflow(w);
                                    setSingleTargetFolderId(w.folder_id);
                                    setIsMoveSingleOpen(true);
                                    setActiveMenuId(null);
                                  }}
                                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-[#12263A] hover:bg-slate-50 font-bold"
                                >
                                  <Folder size={13} className="text-[#166534]" />
                                  {isRtl ? 'نقل إلى مجلد' : 'Move to Folder'}
                                </button>

                                <button
                                  onClick={() => navigate(`/automation/executions?workflow_id=${w.id}`)}
                                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-[#12263A] hover:bg-slate-50 font-bold"
                                >
                                  <History size={13} className="text-slate-500" />
                                  {isRtl ? 'سجلات التنفيذ' : 'View Executions'}
                                </button>

                                <div className="border-t border-slate-100 my-1" />

                                <button
                                  onClick={() => {
                                    setSingleActionWorkflow(w);
                                    setIsDeleteSingleConfirm(true);
                                    setActiveMenuId(null);
                                  }}
                                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 font-bold"
                                >
                                  <Trash2 size={13} />
                                  {isRtl ? 'حذف المسار' : 'Delete'}
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL: Create New Workflow */}
      <AnimatePresence>
        {isCreateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#F0FDF4] text-[#166534] flex items-center justify-center">
                    <Plus size={16} />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-[#12263A]">
                      {isRtl ? 'إنشاء مسار واتساب جديد' : 'Create New WhatsApp Workflow'}
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      {isRtl ? 'ابدأ بمسودة فارغة وسيتم توجيهك إلى أداة البناء.' : 'Initialize a blank workflow draft.'}
                    </p>
                  </div>
                </div>
                <button onClick={() => setIsCreateOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isRtl ? 'اسم مسار العمل *' : 'Workflow Name *'}
                  </label>
                  <input
                    type="text"
                    value={newWorkflowName}
                    onChange={(e) => setNewWorkflowName(e.target.value)}
                    placeholder={isRtl ? 'مثال: الترحيب بالعملاء الجدد' : 'e.g. VIP Inbound Lead Onboarding'}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166534]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isRtl ? 'المجلد (اختياري)' : 'Folder (Optional)'}
                  </label>
                  <select
                    value={newWorkflowFolderId || ''}
                    onChange={(e) => setNewWorkflowFolderId(e.target.value ? Number(e.target.value) : null)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166534] bg-white"
                  >
                    <option value="">{isRtl ? 'بدون مجلد (غير منظم)' : 'No Folder (Unorganized)'}</option>
                    {folders.map(f => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isRtl ? 'الوصف الداخلي' : 'Internal Description'}
                  </label>
                  <textarea
                    rows={3}
                    value={newWorkflowDescription}
                    onChange={(e) => setNewWorkflowDescription(e.target.value)}
                    placeholder={isRtl ? 'تفاصيل حول هدف هذا المسار...' : 'Notes on target audience and purpose...'}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166534]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  {isRtl ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  disabled={!newWorkflowName.trim() || isCreatingWorkflow}
                  onClick={handleCreateWorkflow}
                  className="px-4 py-2 bg-[#166534] hover:bg-[#15803d] text-white rounded-xl text-xs font-bold disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isCreatingWorkflow && <Loader2 size={13} className="animate-spin" />}
                  {isRtl ? 'إنشاء وفتح المحرر' : 'Create & Open Builder'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: Create/Rename Folder */}
      <AnimatePresence>
        {isFolderModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-white rounded-2xl p-5 shadow-2xl border border-slate-200 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#12263A]">
                  {folderModalMode === 'create' ? (isRtl ? 'إنشاء مجلد مسارات جديد' : 'New Workflow Folder') : (isRtl ? 'إعادة تسمية المجلد' : 'Rename Folder')}
                </h3>
                <button onClick={() => setIsFolderModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={16} />
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {isRtl ? 'اسم المجلد' : 'Folder Name'}
                </label>
                <input
                  type="text"
                  value={folderNameInput}
                  onChange={(e) => setFolderNameInput(e.target.value)}
                  placeholder={isRtl ? 'مثال: حملات الترحيب' : 'e.g. Sales Sequences'}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#166534]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsFolderModalOpen(false)}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  {isRtl ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  disabled={!folderNameInput.trim() || isFolderSaving}
                  onClick={handleSaveFolder}
                  className="px-4 py-1.5 bg-[#166534] text-white rounded-lg text-xs font-bold disabled:opacity-50"
                >
                  {isFolderSaving ? (isRtl ? 'جاري الحفظ...' : 'Saving...') : (isRtl ? 'حفظ المجلد' : 'Save Folder')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: Single Move to Folder */}
      <AnimatePresence>
        {isMoveSingleOpen && singleActionWorkflow && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
            <div className="w-full max-w-sm bg-white rounded-2xl p-5 shadow-2xl border border-slate-200 space-y-4">
              <h3 className="text-sm font-bold text-[#12263A]">
                {isRtl ? 'نقل المسار إلى مجلد' : 'Move Workflow to Folder'}
              </h3>
              <p className="text-xs text-slate-500">
                {singleActionWorkflow.name}
              </p>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {isRtl ? 'اختر المجلد الوجهة' : 'Select Destination Folder'}
                </label>
                <select
                  value={singleTargetFolderId || ''}
                  onChange={(e) => setSingleTargetFolderId(e.target.value ? Number(e.target.value) : null)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:border-[#166534]"
                >
                  <option value="">{isRtl ? 'بدون مجلد (غير منظم)' : 'No Folder (Unorganized)'}</option>
                  {folders.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsMoveSingleOpen(false)}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  {isRtl ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  onClick={handleMoveSingle}
                  className="px-4 py-1.5 bg-[#166534] text-white rounded-lg text-xs font-bold"
                >
                  {isRtl ? 'تأكيد النقل' : 'Move'}
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: Bulk Move to Folder */}
      <AnimatePresence>
        {isBulkMoveOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
            <div className="w-full max-w-sm bg-white rounded-2xl p-5 shadow-2xl border border-slate-200 space-y-4">
              <h3 className="text-sm font-bold text-[#12263A]">
                {isRtl ? 'نقل المسارات المحددة' : 'Move Selected Workflows'}
              </h3>
              <p className="text-xs text-slate-500">
                {isRtl ? `سيتم نقل ${selectedIds.length} مسارات عمل.` : `Moving ${selectedIds.length} workflows.`}
              </p>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {isRtl ? 'المجلد الوجهة' : 'Target Folder'}
                </label>
                <select
                  value={bulkTargetFolderId || ''}
                  onChange={(e) => setBulkTargetFolderId(e.target.value ? Number(e.target.value) : null)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:border-[#166534]"
                >
                  <option value="">{isRtl ? 'بدون مجلد (إلغاء التصنيف)' : 'No Folder (Unorganized)'}</option>
                  {folders.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsBulkMoveOpen(false)}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  {isRtl ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  disabled={isPerformingBulk}
                  onClick={handleBulkMove}
                  className="px-4 py-1.5 bg-[#166534] text-white rounded-lg text-xs font-bold disabled:opacity-50"
                >
                  {isPerformingBulk ? (isRtl ? 'جاري النقل...' : 'Moving...') : (isRtl ? 'تأكيد النقل' : 'Move')}
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* CONFIRM MODAL: Single Delete */}
      <AnimatePresence>
        {isDeleteSingleConfirm && singleActionWorkflow && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
            <div className="w-full max-w-sm bg-white rounded-2xl p-5 shadow-2xl border border-red-200 space-y-4">
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle size={20} />
                <h3 className="text-sm font-bold">{isRtl ? 'تأكيد حذف المسار' : 'Confirm Workflow Deletion'}</h3>
              </div>
              <p className="text-xs text-slate-600">
                {isRtl ? `هل أنت متأكد من حذف "${singleActionWorkflow.name}"؟ سيتم إيقاف كافة جهات الاتصال المسجلة حالياً.` : `Are you sure you want to delete "${singleActionWorkflow.name}"? Active enrollments will be halted.`}
              </p>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsDeleteSingleConfirm(false)}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  {isRtl ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  onClick={handleDeleteSingle}
                  className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold"
                >
                  {isRtl ? 'تأكيد الحذف' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* CONFIRM MODAL: Bulk Delete */}
      <AnimatePresence>
        {isBulkDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
            <div className="w-full max-w-sm bg-white rounded-2xl p-5 shadow-2xl border border-red-200 space-y-4">
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle size={20} />
                <h3 className="text-sm font-bold">{isRtl ? 'حذف مسارات متعددة' : 'Bulk Delete Workflows'}</h3>
              </div>
              <p className="text-xs text-slate-600">
                {isRtl ? `سيتم حذف ${selectedIds.length} مسارات عمل نهائياً. لا يمكن التراجع عن هذا الإجراء.` : `Permanently delete ${selectedIds.length} selected workflows? This action cannot be undone.`}
              </p>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsBulkDeleteConfirm(false)}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  {isRtl ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  disabled={isPerformingBulk}
                  onClick={handleBulkDelete}
                  className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold disabled:opacity-50"
                >
                  {isPerformingBulk ? (isRtl ? 'جاري الحذف...' : 'Deleting...') : (isRtl ? 'حذف نهائي' : 'Delete All')}
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
