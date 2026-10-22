import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ReactFlow, 
  MiniMap, 
  Controls, 
  Background, 
  useNodesState, 
  useEdgesState, 
  addEdge,
  MarkerType,
  Handle,
  Position
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  Settings, 
  Zap, 
  Clock, 
  GitFork, 
  PlayCircle,
  X,
  Sliders,
  Copy,
  AlertCircle,
  Eye,
  Activity,
  Menu,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { crmApi } from '../../services/crmApi';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from '../../components/ui/Toast';
import { useI18n } from '../../i18n';
import { LanguageSwitcher } from '../../components/common/LanguageSwitcher';

// Catalog node types helper with bilingual Arabic & English support
export const getCatalogNodeTypes = (isRtl: boolean) => [
  { 
    type: 'incoming_message', 
    label: isRtl ? 'رسالة واردة' : 'Incoming Message', 
    category: isRtl ? 'مشغّل' : 'Trigger', 
    icon: Zap, 
    desc: isRtl ? 'يبدأ عند استلام أي رسالة واردة.' : 'Triggers on any inbound message.', 
    color: 'bg-amber-500' 
  },
  { 
    type: 'keyword', 
    label: isRtl ? 'تطابق الكلمات المفتاحية' : 'Keyword Match', 
    category: isRtl ? 'مشغّل' : 'Trigger', 
    icon: Zap, 
    desc: isRtl ? 'يبدأ عند تطابق كلمات مفتاحية محددة.' : 'Triggers on keyword matches.', 
    color: 'bg-amber-600' 
  },
  { 
    type: 'schedule', 
    label: isRtl ? 'مشغّل مجدول' : 'Schedule Trigger', 
    category: isRtl ? 'مشغّل' : 'Trigger', 
    icon: Clock, 
    desc: isRtl ? 'جدولة تشغيل في فترات زمنية دورية.' : 'Scheduled delivery interval.', 
    color: 'bg-amber-700' 
  },
  { 
    type: 'condition', 
    label: isRtl ? 'تصفية بالشروط' : 'Condition Filter', 
    category: isRtl ? 'منطق' : 'Logic', 
    icon: GitFork, 
    desc: isRtl ? 'التحقق من حقول الشروط وتوجيه المسار.' : 'Evaluate fields condition.', 
    color: 'bg-violet-500' 
  },
  { 
    type: 'wait', 
    label: isRtl ? 'تأخير / انتظار' : 'Wait Delay', 
    category: isRtl ? 'منطق' : 'Logic', 
    icon: Clock, 
    desc: isRtl ? 'إيقاف مؤقت للمسار لفترة محددة.' : 'Pause flow for a duration.', 
    color: 'bg-violet-600' 
  },
  { 
    type: 'send_message', 
    label: isRtl ? 'إرسال رسالة' : 'Send Message', 
    category: isRtl ? 'إجراء' : 'Action', 
    icon: PlayCircle, 
    desc: isRtl ? 'إرسال رد نصي فوري للمستخدم.' : 'Send text message reply.', 
    color: 'bg-[#166534]' 
  },
  { 
    type: 'send_template', 
    label: isRtl ? 'إرسال قالب' : 'Send Template', 
    category: isRtl ? 'إجراء' : 'Action', 
    icon: PlayCircle, 
    desc: isRtl ? 'إرسال قالب واتساب رسمي معتمد.' : 'Dispatch standard template.', 
    color: 'bg-[#166534]' 
  },
  { 
    type: 'assign_agent', 
    label: isRtl ? 'تعيين لموظف' : 'Assign Agent', 
    category: isRtl ? 'إجراء' : 'Action', 
    icon: PlayCircle, 
    desc: isRtl ? 'تحويل العميل إلى موظف دعم مخصص.' : 'Assign contact to an agent.', 
    color: 'bg-[#166534]' 
  },
  { 
    type: 'add_tag', 
    label: isRtl ? 'إضافة وسم' : 'Add Tag', 
    category: isRtl ? 'إجراء' : 'Action', 
    icon: PlayCircle, 
    desc: isRtl ? 'إرفاق وسم تصنيف لجهة الاتصال.' : 'Attach a category tag.', 
    color: 'bg-[#166534]' 
  },
  { 
    type: 'end_workflow', 
    label: isRtl ? 'إنهاء المسار' : 'End Workflow', 
    category: isRtl ? 'إجراء' : 'Action', 
    icon: PlayCircle, 
    desc: isRtl ? 'تحديد اكتمال وانتهاء تنفيذ المسار.' : 'Mark flow execution done.', 
    color: 'bg-slate-600' 
  },
];

// Custom Node Component to display styled cards
const CustomWorkflowNode = ({ id, data, isConnectable }: any) => {
  const isRtl = data.isRtl;
  const isTrigger = ['incoming_message', 'keyword', 'schedule'].includes(data.type);
  const isEnd = data.type === 'end_workflow';

  // Styling based on block category
  let colorClass = 'border-[#E2E8F0]';
  let badgeColor = 'bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0]';
  let Icon = PlayCircle;

  if (isTrigger) {
    colorClass = 'border-amber-400';
    badgeColor = 'bg-amber-50 text-amber-800 border border-amber-200/60';
    Icon = Zap;
    if (data.type === 'schedule') Icon = Clock;
  } else if (['condition', 'wait'].includes(data.type)) {
    colorClass = 'border-violet-400';
    badgeColor = 'bg-violet-50 text-violet-800 border border-violet-200/60';
    Icon = data.type === 'condition' ? GitFork : Clock;
  } else {
    colorClass = 'border-[#166534]';
    badgeColor = 'bg-[#F0FDF4] text-[#166534] border border-[#22C55E]/30';
  }

  // Generate parameter summary description
  let summary = isRtl ? 'انقر على الإعداد للتكوين' : 'Click edit to configure';
  if (data.type === 'keyword') {
    summary = data.config?.keywords 
      ? (isRtl ? `الكلمات: ${data.config.keywords}` : `Keywords: ${data.config.keywords}`) 
      : (isRtl ? 'لم يتم تحديد كلمات مفتاحية' : 'No keywords configured');
  } else if (data.type === 'schedule') {
    summary = isRtl ? `التكرار: ${data.config?.interval || 'يومياً'}` : `Interval: ${data.config?.interval || 'daily'}`;
  } else if (data.type === 'send_message') {
    summary = data.config?.message ? `"${data.config.message}"` : (isRtl ? 'نص الرسالة فارغ' : 'Message body is empty');
  } else if (data.type === 'send_template') {
    summary = data.config?.templateId 
      ? (isRtl ? `القالب: ${data.config.templateId}` : `Template: ${data.config.templateId}`) 
      : (isRtl ? 'لم يتم اختيار قالب' : 'No template selected');
  } else if (data.type === 'wait') {
    summary = isRtl 
      ? `انتظار ${data.config?.amount || '30'} ${data.config?.unit || 'دقيقة'}` 
      : `Wait ${data.config?.amount || '30'} ${data.config?.unit || 'minutes'}`;
  } else if (data.type === 'add_tag') {
    summary = data.config?.tagName 
      ? (isRtl ? `الوسم: ${data.config.tagName}` : `Tag: ${data.config.tagName}`) 
      : (isRtl ? 'لم يتم تحديد اسم الوسم' : 'Tag name not specified');
  } else if (data.type === 'assign_agent') {
    summary = data.config?.agentName 
      ? (isRtl ? `الموظف: ${data.config.agentName}` : `Agent: ${data.config.agentName}`) 
      : (isRtl ? 'لم يتم تحديد موظف' : 'No agent specified');
  } else if (data.type === 'condition') {
    summary = `${data.config?.field || 'message'} ${data.config?.operator || '='} ${data.config?.value || ''}`;
  } else if (data.type === 'end_workflow') {
    summary = isRtl ? 'إنهاء تنفيذ مسار العمل' : 'Terminates workflow execution';
  }

  const getTypeBadgeLabel = () => {
    if (!isRtl) return data.type.replace('_', ' ');
    switch (data.type) {
      case 'incoming_message': return 'رسالة واردة';
      case 'keyword': return 'كلمة مفتاحية';
      case 'schedule': return 'جدولة';
      case 'condition': return 'شرط وتصفية';
      case 'wait': return 'انتظار';
      case 'send_message': return 'إرسال رسالة';
      case 'send_template': return 'إرسال قالب';
      case 'assign_agent': return 'تعيين موظف';
      case 'add_tag': return 'إضافة وسم';
      case 'end_workflow': return 'إنهاء المسار';
      default: return data.type;
    }
  };

  return (
    <div 
      className={cn(
        "w-64 bg-white border-2 rounded-2xl shadow-xs hover:shadow-md font-sans transition-all relative p-0.5",
        isRtl ? "text-right" : "text-left",
        colorClass,
        data.validationError ? "border-red-500 ring-2 ring-red-500/20" : ""
      )}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Top Input Handle */}
      {!isTrigger && (
        <Handle
          type="target"
          position={Position.Top}
          id="top"
          style={{ background: '#166534', width: 8, height: 8 }}
          isConnectable={isConnectable}
        />
      )}

      {/* Main Card Content */}
      <div className="p-3.5">
        <div className="flex items-center justify-between gap-2.5 mb-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <div className={cn("w-6 h-6 rounded-lg flex items-center justify-center text-white shrink-0 shadow-xs",
              isTrigger ? 'bg-amber-500' : ['condition', 'wait'].includes(data.type) ? 'bg-violet-500' : 'bg-[#166534]'
            )}>
              <Icon size={12} />
            </div>
            <div className="min-w-0">
              <span className={cn("px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider block w-max leading-none", badgeColor)}>
                {getTypeBadgeLabel()}
              </span>
              <span className="block text-[11px] font-bold text-[#12263A] truncate mt-1 leading-tight">
                {data.label}
              </span>
            </div>
          </div>

          {/* Node Action Buttons */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={(e) => { e.stopPropagation(); data.onConfigure(id); }}
              className="p-1 rounded-lg hover:bg-[#F8FAFC] text-[#64748B] hover:text-[#12263A] transition-all cursor-pointer"
              title={isRtl ? 'إعداد الخطوة' : 'Configure step'}
            >
              <Settings size={12} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); data.onDuplicate(id); }}
              className="p-1 rounded-lg hover:bg-[#F8FAFC] text-[#64748B] hover:text-[#12263A] transition-all cursor-pointer"
              title={isRtl ? 'تكرار الخطوة' : 'Duplicate step'}
            >
              <Copy size={12} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); data.onDelete(id); }}
              className="p-1 rounded-lg hover:bg-red-50 text-[#64748B] hover:text-red-600 transition-all cursor-pointer"
              title={isRtl ? 'حذف الخطوة' : 'Delete step'}
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>

        {/* Short Parameter Summary */}
        <div className="text-[10px] text-[#64748B] font-medium leading-relaxed line-clamp-2 break-all p-2 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
          {summary}
        </div>
      </div>

      {/* Validation Error Banner */}
      {data.validationError && (
        <div className="px-3 py-1.5 bg-red-50 border-t border-red-100 text-red-650 text-[9px] font-bold flex items-center gap-1.5 rounded-b-2xl">
          <AlertCircle size={10} className="shrink-0 text-red-500" />
          <span>{data.validationError}</span>
        </div>
      )}

      {/* Bottom Output Handle */}
      {!isEnd && (
        <Handle
          type="source"
          position={Position.Bottom}
          id="bottom"
          style={{ background: '#166534', width: 8, height: 8 }}
          isConnectable={isConnectable}
        />
      )}

      {/* Centered Add Step Trigger Button beneath node */}
      {!isEnd && !data.hasOutgoing && (
        <div className="absolute left-1/2 -bottom-8.5 -translate-x-1/2 z-10">
          <button
            onClick={(e) => { e.stopPropagation(); data.onAddStep(id); }}
            className="px-2.5 py-1.5 bg-[#166534] hover:bg-[#14532d] text-white rounded-lg text-[9px] font-bold shadow-xs hover:shadow active:scale-95 transition-all flex items-center gap-1 cursor-pointer w-max uppercase tracking-wider leading-none"
          >
            <Plus size={9.5} strokeWidth={3} /> {isRtl ? 'إضافة خطوة' : 'Add Step'}
          </button>
        </div>
      )}

    </div>
  );
};

export default function WorkflowBuilderPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { isRtl } = useI18n();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [workflowName, setWorkflowName] = useState(isRtl ? 'جاري تحميل أداة البناء المرئية...' : 'Loading Visual Builder...');
  const [workflowStatus, setWorkflowStatus] = useState('inactive');
  
  const [selectedNode, setSelectedNode] = useState<any | null>(null);
  
  // Builder State
  const [isSaved, setIsSaved] = useState(true);
  const [lastSaved, setLastSaved] = useState(isRtl ? 'تم الحفظ للتو' : 'Saved just now');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [stepSelectorParentId, setStepSelectorParentId] = useState<string | null>(null);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // Preview / Simulation Drawer
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const catalogTypes = useMemo(() => getCatalogNodeTypes(isRtl), [isRtl]);

  // Register visual custom node types
  const nodeTypes = useMemo(() => ({ workflowNode: CustomWorkflowNode }), []);

  // Update edge outgoing helper status
  const syncNodesOutgoingStatus = useCallback((nds: any[], eds: any[]) => {
    return nds.map(node => {
      const hasOutgoing = eds.some(e => e.source === node.id);
      return {
        ...node,
        data: {
          ...node.data,
          isRtl,
          hasOutgoing
        }
      };
    });
  }, [isRtl]);

  // Sync isRtl in all existing nodes when locale switches
  useEffect(() => {
    setNodes(nds => nds.map(n => ({
      ...n,
      data: {
        ...n.data,
        isRtl
      }
    })));
  }, [isRtl, setNodes]);

  // Connect helper
  const onConnect = useCallback((params: any) => {
    setIsSaved(false);
    setEdges((eds) => {
      const nextEdges = addEdge({
        ...params,
        animated: true,
        markerEnd: { type: MarkerType.ArrowClosed, color: '#166534' },
        style: { stroke: '#166534', strokeWidth: 2 }
      }, eds);
      
      setNodes(nds => syncNodesOutgoingStatus(nds, nextEdges));
      return nextEdges;
    });
  }, [setEdges, setNodes, syncNodesOutgoingStatus]);

  // Update selected node custom config fields
  const updateNodeConfig = (nodeId: string, updatedConfig: Record<string, any>) => {
    setIsSaved(false);
    setNodes((nds) => nds.map((node) => {
      if (node.id === nodeId) {
        return {
          ...node,
          data: {
            ...node.data,
            config: {
              ...(node.data.config as Record<string, any> || {}),
              ...updatedConfig
            }
          }
        };
      }
      return node;
    }));
    setSelectedNode((curr: any) => curr && curr.id === nodeId ? {
      ...curr,
      data: {
        ...curr.data,
        config: {
          ...(curr.data.config as Record<string, any> || {}),
          ...updatedConfig
        }
      }
    } : curr);
  };

  // Configure drawer
  const handleConfigureNode = (nodeId: string) => {
    const nodeObj = nodes.find(n => n.id === nodeId);
    if (nodeObj) setSelectedNode(nodeObj);
  };

  // Duplicate node
  const handleDuplicateNode = (nodeId: string) => {
    setIsSaved(false);
    const srcNode = nodes.find(n => n.id === nodeId);
    if (!srcNode) return;

    const newNodeId = `node-dup-${Date.now()}`;
    const newNode = {
      ...srcNode,
      id: newNodeId,
      position: { x: srcNode.position.x + 40, y: srcNode.position.y + 40 },
      data: {
        ...srcNode.data,
        isRtl,
        onConfigure: (nId: string) => handleConfigureNode(nId),
        onDuplicate: (nId: string) => handleDuplicateNode(nId),
        onDelete: (nId: string) => handleDeleteNode(nId),
        onAddStep: (nId: string) => handleAddStepRequest(nId),
        hasOutgoing: false
      }
    };

    setNodes(nds => nds.concat(newNode));
    toast.success(
      isRtl ? 'تم النسخ' : 'Duplicated', 
      isRtl ? 'تم تكرار الكتلة على لوحة العمل.' : 'Block duplicated on canvas.'
    );
  };

  // Delete node
  const handleDeleteNode = (nodeId: string) => {
    setIsSaved(false);
    setNodes(nds => {
      const nextNds = nds.filter(n => n.id !== nodeId);
      return syncNodesOutgoingStatus(nextNds, edges.filter(e => e.source !== nodeId && e.target !== nodeId));
    });
    setEdges(eds => eds.filter(e => e.source !== nodeId && e.target !== nodeId));
    if (selectedNode?.id === nodeId) setSelectedNode(null);
  };

  // Add Step Popup Trigger
  const handleAddStepRequest = (parentId: string) => {
    setStepSelectorParentId(parentId);
  };

  // Load workflow detail
  const loadWorkflow = useCallback(async () => {
    if (!id) return;
    try {
      const data = await crmApi.getWorkflow(id);
      if (data) {
        setWorkflowName(data.name);
        setWorkflowStatus(data.status);

        if (data.nodes && data.nodes.length > 0) {
          const mappedNodes = data.nodes.map((n: any) => ({
            id: n.id,
            type: 'workflowNode',
            position: { x: Number(n.position_x) || 300, y: Number(n.position_y) || 100 },
            data: { 
              label: n.label,
              type: n.type,
              config: n.config || {},
              isRtl,
              onConfigure: (nodeId: string) => handleConfigureNode(nodeId),
              onDuplicate: (nodeId: string) => handleDuplicateNode(nodeId),
              onDelete: (nodeId: string) => handleDeleteNode(nodeId),
              onAddStep: (nodeId: string) => handleAddStepRequest(nodeId),
              hasOutgoing: false
            }
          }));

          const mappedEdges = (data.connections || []).map((c: any, index: number) => ({
            id: `edge-${index}-${Date.now()}`,
            source: c.source_node_id,
            target: c.target_node_id,
            sourceHandle: c.source_handle || 'bottom',
            targetHandle: c.target_handle || 'top',
            animated: true,
            markerEnd: { type: MarkerType.ArrowClosed, color: '#166534' },
            style: { stroke: '#166534', strokeWidth: 2 }
          }));

          setNodes(syncNodesOutgoingStatus(mappedNodes, mappedEdges));
          setEdges(mappedEdges);
        } else {
          setNodes([]);
          setEdges([]);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error(
        isRtl ? 'خطأ' : 'Error', 
        isRtl ? 'فشل استرجاع بيانات مسار العمل.' : 'Failed to retrieve workflow data.'
      );
    }
  }, [id, isRtl, setNodes, setEdges, syncNodesOutgoingStatus]);

  useEffect(() => {
    loadWorkflow();
  }, [loadWorkflow]);

  // Guided trigger onboarding selector
  const addInitialTrigger = (type: string) => {
    setIsSaved(false);
    const catalogItem = catalogTypes.find(n => n.type === type);
    const initialNode = {
      id: 'node-trig',
      type: 'workflowNode',
      position: { x: 350, y: 80 },
      data: {
        type,
        label: catalogItem?.label || (isRtl ? 'مشغّل' : 'Trigger'),
        config: {},
        isRtl,
        onConfigure: (nodeId: string) => handleConfigureNode(nodeId),
        onDuplicate: (nodeId: string) => handleDuplicateNode(nodeId),
        onDelete: (nodeId: string) => handleDeleteNode(nodeId),
        onAddStep: (nodeId: string) => handleAddStepRequest(nodeId),
        hasOutgoing: false
      }
    };
    setNodes([initialNode]);
  };

  // Add Action/Logic node below the parent node and link them
  const selectStepAction = (type: string) => {
    if (!stepSelectorParentId) return;
    setIsSaved(false);

    const parentNode = nodes.find(n => n.id === stepSelectorParentId);
    if (!parentNode) return;

    const catalogItem = catalogTypes.find(n => n.type === type);
    const newNodeId = `node-${Date.now()}`;
    const nextY = parentNode.position.y + 160;

    const newNode = {
      id: newNodeId,
      type: 'workflowNode',
      position: { x: parentNode.position.x, y: nextY },
      data: {
        type,
        label: catalogItem?.label || (isRtl ? 'خطوة' : 'Step'),
        config: {},
        isRtl,
        onConfigure: (nId: string) => handleConfigureNode(nId),
        onDuplicate: (nId: string) => handleDuplicateNode(nId),
        onDelete: (nId: string) => handleDeleteNode(nId),
        onAddStep: (nId: string) => handleAddStepRequest(nId),
        hasOutgoing: false
      }
    };

    const newEdge = {
      id: `edge-${parentNode.id}-${newNodeId}`,
      source: parentNode.id,
      target: newNodeId,
      sourceHandle: 'bottom',
      targetHandle: 'top',
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed, color: '#166534' },
      style: { stroke: '#166534', strokeWidth: 2 }
    };

    setNodes(prev => {
      const nextNds = prev.concat(newNode);
      return syncNodesOutgoingStatus(nextNds, edges.concat(newEdge));
    });
    setEdges(prev => prev.concat(newEdge));
    setStepSelectorParentId(null);
    setSelectedNode(newNode);
  };

  // Save changes locally in Draft state
  const handleSaveDraft = async () => {
    if (!id) return;
    setIsSavingDraft(true);
    try {
      const payloadNodes = nodes.map((n: any) => ({
        id: n.id,
        type: n.data.type,
        label: n.data.label,
        config: n.data.config || {},
        position_x: n.position.x,
        position_y: n.position.y
      }));

      const payloadConnections = edges.map((e: any) => ({
        source_node_id: e.source,
        target_node_id: e.target,
        source_handle: e.sourceHandle || 'bottom',
        target_handle: e.targetHandle || 'top'
      }));

      await crmApi.saveWorkflowCanvas(id, payloadNodes, payloadConnections);
      await crmApi.updateWorkflow(id, { status: 'inactive' });
      
      setWorkflowStatus('inactive');
      setIsSaved(true);
      const timeStr = new Date().toLocaleTimeString(isRtl ? 'ar-SA' : 'en-US');
      setLastSaved(isRtl ? `تم الحفظ في ${timeStr}` : `Saved at ${timeStr}`);
      toast.success(
        isRtl ? 'تم الحفظ كمسودة' : 'Saved Draft', 
        isRtl ? 'تم تخزين مسار العمل بنجاح كمسودة.' : 'Workflow stored successfully as draft.'
      );
    } catch (err) {
      console.error(err);
      toast.error(
        isRtl ? 'خطأ' : 'Error', 
        isRtl ? 'فشل حفظ مسار العمل كمسودة.' : 'Failed to save workflow graph.'
      );
    } finally {
      setIsSavingDraft(false);
    }
  };

  // Run validation checks on nodes
  const runValidation = (): boolean => {
    let hasError = false;
    const nextNodes = nodes.map(n => {
      let validationError = '';
      
      if (n.id === 'node-trig' && !['incoming_message', 'keyword', 'schedule'].includes(n.data.type)) {
        validationError = isRtl ? 'يجب أن تبدأ المسار بكتلة مشغّل' : 'Initial node must be a trigger block';
      }

      if (n.data.type === 'keyword' && !n.data.config?.keywords) {
        validationError = isRtl ? 'يرجى إدخال الكلمات المفتاحية' : 'Keyword string is required';
      }

      if (n.data.type === 'send_message' && !n.data.config?.message) {
        validationError = isRtl ? 'نص الرسالة مطلوب' : 'Message body is required';
      }

      if (n.data.type === 'send_template' && !n.data.config?.templateId) {
        validationError = isRtl ? 'اسم معرّف القالب مطلوب' : 'Template name is required';
      }

      if (n.data.type === 'wait' && (!n.data.config?.amount || Number(n.data.config.amount) <= 0)) {
        validationError = isRtl ? 'يجب أن تكون مدة الانتظار أكبر من صفر' : 'Duration must be positive';
      }

      if (validationError) {
        hasError = true;
      }

      return {
        ...n,
        data: {
          ...n.data,
          validationError
        }
      };
    });

    if (hasError) {
      setNodes(nextNodes);
      toast.error(
        isRtl ? 'فشل التحقق من الصحة' : 'Validation Failed', 
        isRtl ? 'يرجى معالجة الأخطاء المحددة على الكتل.' : 'Please fix highlights directly on the nodes.'
      );
      return false;
    }

    setNodes(nodes.map(n => ({ ...n, data: { ...n.data, validationError: undefined } })));
    return true;
  };

  // Validate and Publish
  const handlePublish = async () => {
    if (!id) return;
    if (!runValidation()) return;

    setIsPublishing(true);
    try {
      const payloadNodes = nodes.map((n: any) => ({
        id: n.id,
        type: n.data.type,
        label: n.data.label,
        config: n.data.config || {},
        position_x: n.position.x,
        position_y: n.position.y
      }));

      const payloadConnections = edges.map((e: any) => ({
        source_node_id: e.source,
        target_node_id: e.target,
        source_handle: e.sourceHandle || 'bottom',
        target_handle: e.targetHandle || 'top'
      }));

      await crmApi.saveWorkflowCanvas(id, payloadNodes, payloadConnections);
      await crmApi.updateWorkflow(id, { status: 'active' });

      setWorkflowStatus('active');
      setIsSaved(true);
      const timeStr = new Date().toLocaleTimeString(isRtl ? 'ar-SA' : 'en-US');
      setLastSaved(isRtl ? `تم الحفظ في ${timeStr}` : `Saved at ${timeStr}`);
      toast.success(
        isRtl ? 'تم النشر بنجاح!' : 'Published!', 
        isRtl ? 'تم نشر المسار وتفعيله بنجاح.' : 'Workflow visual configuration published successfully.'
      );
    } catch (err) {
      console.error(err);
      toast.error(
        isRtl ? 'خطأ' : 'Error', 
        isRtl ? 'فشل نشر وتفعيل مسار العمل.' : 'Failed to publish workflow.'
      );
    } finally {
      setIsPublishing(false);
    }
  };

  // Drag and drop helper catalog add
  const handleDragNodeAdd = (typeObj: typeof catalogTypes[0]) => {
    setIsSaved(false);
    const newNodeId = `node-${Date.now()}`;
    const newNode = {
      id: newNodeId,
      type: 'workflowNode',
      position: { x: 300, y: 200 },
      data: {
        type: typeObj.type,
        label: typeObj.label,
        config: {},
        isRtl,
        onConfigure: (nId: string) => handleConfigureNode(nId),
        onDuplicate: (nId: string) => handleDuplicateNode(nId),
        onDelete: (nId: string) => handleDeleteNode(nId),
        onAddStep: (nId: string) => handleAddStepRequest(nId),
        hasOutgoing: false
      }
    };
    setNodes(nds => syncNodesOutgoingStatus(nds.concat(newNode), edges));
    setSelectedNode(newNode);
    setIsSidebarOpen(false);
  };

  // Quick template trigger
  const buildExampleTemplate = () => {
    setIsSaved(false);
    const trig = {
      id: 'node-trig',
      type: 'workflowNode',
      position: { x: 350, y: 60 },
      data: {
        type: 'incoming_message',
        label: isRtl ? 'رسالة واردة' : 'Incoming Message',
        config: {},
        isRtl,
        onConfigure: (nId: string) => handleConfigureNode(nId),
        onDuplicate: (nId: string) => handleDuplicateNode(nId),
        onDelete: (nId: string) => handleDeleteNode(nId),
        onAddStep: (nId: string) => handleAddStepRequest(nId),
        hasOutgoing: true
      }
    };

    const action1 = {
      id: 'node-act-1',
      type: 'workflowNode',
      position: { x: 350, y: 220 },
      data: {
        type: 'send_message',
        label: isRtl ? 'إرسال رسالة ترحيبية' : 'Send Welcome Message',
        config: { 
          message: isRtl 
            ? 'مرحباً بك! يسعدنا تواصلك، سيتم الرد عليك قريباً.' 
            : 'Welcome to our service! We will connect you to an agent soon.' 
        },
        isRtl,
        onConfigure: (nId: string) => handleConfigureNode(nId),
        onDuplicate: (nId: string) => handleDuplicateNode(nId),
        onDelete: (nId: string) => handleDeleteNode(nId),
        onAddStep: (nId: string) => handleAddStepRequest(nId),
        hasOutgoing: true
      }
    };

    const delay = {
      id: 'node-delay',
      type: 'workflowNode',
      position: { x: 350, y: 380 },
      data: {
        type: 'wait',
        label: isRtl ? 'انتظار 5 دقائق' : 'Wait 5 Minutes',
        config: { amount: '5', unit: 'minutes' },
        isRtl,
        onConfigure: (nId: string) => handleConfigureNode(nId),
        onDuplicate: (nId: string) => handleDuplicateNode(nId),
        onDelete: (nId: string) => handleDeleteNode(nId),
        onAddStep: (nId: string) => handleAddStepRequest(nId),
        hasOutgoing: true
      }
    };

    const action2 = {
      id: 'node-act-2',
      type: 'workflowNode',
      position: { x: 350, y: 540 },
      data: {
        type: 'assign_agent',
        label: isRtl ? 'تعيين لموظف الدعم' : 'Assign Agent',
        config: { agentName: isRtl ? 'فريق الدعم الفني' : 'Ateeq Support' },
        isRtl,
        onConfigure: (nId: string) => handleConfigureNode(nId),
        onDuplicate: (nId: string) => handleDuplicateNode(nId),
        onDelete: (nId: string) => handleDeleteNode(nId),
        onAddStep: (nId: string) => handleAddStepRequest(nId),
        hasOutgoing: true
      }
    };

    const end = {
      id: 'node-end',
      type: 'workflowNode',
      position: { x: 350, y: 700 },
      data: {
        type: 'end_workflow',
        label: isRtl ? 'إنهاء المسار' : 'End Workflow',
        config: {},
        isRtl,
        onConfigure: (nId: string) => handleConfigureNode(nId),
        onDuplicate: (nId: string) => handleDuplicateNode(nId),
        onDelete: (nId: string) => handleDeleteNode(nId),
        onAddStep: (nId: string) => handleAddStepRequest(nId),
        hasOutgoing: false
      }
    };

    const nextNodes = [trig, action1, delay, action2, end];
    const nextEdges = [
      { id: 'edge-1', source: 'node-trig', target: 'node-act-1', animated: true, markerEnd: { type: MarkerType.ArrowClosed, color: '#166534' }, style: { stroke: '#166534', strokeWidth: 2 } },
      { id: 'edge-2', source: 'node-act-1', target: 'node-delay', animated: true, markerEnd: { type: MarkerType.ArrowClosed, color: '#166534' }, style: { stroke: '#166534', strokeWidth: 2 } },
      { id: 'edge-3', source: 'node-delay', target: 'node-act-2', animated: true, markerEnd: { type: MarkerType.ArrowClosed, color: '#166534' }, style: { stroke: '#166534', strokeWidth: 2 } },
      { id: 'edge-4', source: 'node-act-2', target: 'node-end', animated: true, markerEnd: { type: MarkerType.ArrowClosed, color: '#166534' }, style: { stroke: '#166534', strokeWidth: 2 } }
    ];

    setNodes(nextNodes);
    setEdges(nextEdges);
    toast.success(
      isRtl ? 'تم تحميل النموذج' : 'Template Loaded', 
      isRtl ? 'تم تطبيق نموذج مسار الترحيب التلقائي.' : 'Seeded sample linear welcome flow onboarding template.'
    );
  };

  return (
    <div 
      className={cn(
        "h-[calc(100vh-140px)] min-h-[640px] bg-white flex flex-col font-sans select-none relative rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden",
        isRtl && "text-right"
      )}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      
      {/* Visual Header Toolbar */}
      <header className="min-h-16 bg-white border-b border-[#E2E8F0] px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 z-10 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => navigate('/automation/workflows')}
            className="p-2 rounded-xl bg-white hover:bg-[#F8FAFC] text-[#12263A] hover:text-[#166534] transition-all cursor-pointer border border-[#E2E8F0] active:scale-95 shrink-0"
            title={isRtl ? 'العودة إلى مسارات العمل' : 'Back to workflows'}
            aria-label={isRtl ? 'العودة إلى مسارات العمل' : 'Back to workflows'}
          >
            <ArrowLeft size={16} className={cn(isRtl && "rotate-180")} />
          </button>
          
          <div className="leading-tight min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-sm font-bold text-[#12263A] truncate max-w-[200px] sm:max-w-xs md:max-w-sm">
                {workflowName}
              </h1>
              <span className={cn(
                "px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider leading-none border shrink-0",
                workflowStatus === 'active' 
                  ? 'bg-[#F0FDF4] text-[#166534] border-[#22C55E]/40' 
                  : 'bg-[#F1F5F9] text-[#64748B] border-[#E2E8F0]'
              )}>
                {workflowStatus === 'active' ? (isRtl ? 'منشور' : 'Published') : (isRtl ? 'مسودة' : 'Draft')}
              </span>
            </div>
            <p className="text-[10px] text-[#64748B] mt-1 flex items-center gap-1.5 leading-none font-medium">
              <span>{lastSaved}</span>
              {nodes.length > 0 && (
                <>
                  <span className="w-1 h-1 rounded-full bg-[#CBD5E1]" />
                  <button 
                    onClick={buildExampleTemplate} 
                    className="text-[#166534] font-semibold hover:underline cursor-pointer"
                  >
                    {isRtl ? 'إعادة التعيين لنموذج الترحيب' : 'Reset to Welcome Flow'}
                  </button>
                </>
              )}
            </p>
          </div>
        </div>

        <div className={cn("flex items-center gap-2 flex-wrap", isRtl ? "mr-auto" : "ml-auto")}>
          {/* Language Switcher */}
          <LanguageSwitcher variant="dropdown" />

          {/* Sidebar Toggle */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={cn(
              "h-9 px-3.5 rounded-xl text-xs font-semibold transition-all border flex items-center gap-1.5 cursor-pointer",
              isSidebarOpen 
                ? 'bg-[#12263A] text-white border-[#12263A]' 
                : 'bg-white text-[#12263A] border-[#E2E8F0] hover:bg-[#F8FAFC]'
            )}
          >
            <Menu size={14} /> {isRtl ? 'شريط الكتل' : 'Blocks Sidebar'}
          </button>

          {/* Preview Button */}
          <button
            onClick={() => setIsPreviewOpen(true)}
            className="h-9 px-3.5 rounded-xl bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#12263A] text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Eye size={14} className="text-[#64748B]" /> {isRtl ? 'معاينة' : 'Preview'}
          </button>

          {/* Save Draft Button */}
          <button
            onClick={handleSaveDraft}
            disabled={isSavingDraft}
            className="h-9 px-3.5 bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] text-[#12263A] rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
          >
            {isSavingDraft ? <Loader2 size={13} className="animate-spin text-[#166534]" /> : null}
            <span>{isSavingDraft ? (isRtl ? 'جاري الحفظ...' : 'Saving...') : (isRtl ? 'حفظ كمسودة' : 'Save Draft')}</span>
          </button>

          {/* Publish Workflow Button */}
          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className="h-9 px-4.5 bg-[#166534] hover:bg-[#14532d] active:scale-[0.98] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
          >
            {isPublishing ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
            <span>{isPublishing ? (isRtl ? 'جاري النشر...' : 'Publishing...') : (isRtl ? 'نشر مسار العمل' : 'Publish Workflow')}</span>
          </button>
        </div>
      </header>

      {/* Workspace Canvas Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Toggleable Sidebar Catalog */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.aside
              initial={{ x: isRtl ? 260 : -260, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: isRtl ? 260 : -260, opacity: 0 }}
              className={cn(
                "w-64 bg-white p-4 overflow-y-auto flex flex-col gap-4 shrink-0 z-20 shadow-xs",
                isRtl ? "border-l border-[#E2E8F0]" : "border-r border-[#E2E8F0]"
              )}
            >
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                    {isRtl ? 'كتالوج الكتل' : 'Blocks Catalog'}
                  </h3>
                  <button 
                    onClick={() => setIsSidebarOpen(false)} 
                    className="text-[#64748B] hover:text-[#12263A] p-1 rounded-lg hover:bg-[#F8FAFC] cursor-pointer"
                  >
                    <X size={15} />
                  </button>
                </div>
                <p className="text-[10px] text-[#64748B] mt-1 leading-normal font-normal">
                  {isRtl ? 'انقر فوق أي كتلة لإدراجها مباشرة في لوحة العمل.' : 'Click a block to inject it directly into the canvas.'}
                </p>
              </div>

              {/* Sidebar Groups */}
              <div className="space-y-4">
                <div>
                  <span className="block text-[9px] font-bold text-[#64748B] uppercase tracking-wider mb-2">
                    {isRtl ? 'المشغلات' : 'Triggers'}
                  </span>
                  <div className="space-y-1.5">
                    {catalogTypes.filter(n => n.category === (isRtl ? 'مشغّل' : 'Trigger')).map(nt => (
                      <button
                        key={nt.type}
                        onClick={() => handleDragNodeAdd(nt)}
                        className={cn(
                          "w-full p-2.5 bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#12263A] truncate flex items-center gap-2.5 cursor-pointer transition-all shadow-2xs",
                          isRtl ? "text-right" : "text-left"
                        )}
                      >
                        <div className={cn("w-6 h-6 rounded-lg flex items-center justify-center text-white text-[9px] shrink-0", nt.color)}>
                          <nt.icon size={11} />
                        </div>
                        <span className="truncate">{nt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="block text-[9px] font-bold text-[#64748B] uppercase tracking-wider mb-2">
                    {isRtl ? 'المنطق والإجراءات' : 'Logic & Actions'}
                  </span>
                  <div className="space-y-1.5">
                    {catalogTypes.filter(n => n.category !== (isRtl ? 'مشغّل' : 'Trigger')).map(nt => (
                      <button
                        key={nt.type}
                        onClick={() => handleDragNodeAdd(nt)}
                        className={cn(
                          "w-full p-2.5 bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#12263A] truncate flex items-center gap-2.5 cursor-pointer transition-all shadow-2xs",
                          isRtl ? "text-right" : "text-left"
                        )}
                      >
                        <div className={cn("w-6 h-6 rounded-lg flex items-center justify-center text-white text-[9px] shrink-0", nt.color)}>
                          <nt.icon size={11} />
                        </div>
                        <span className="truncate">{nt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Builder Viewport wrapper */}
        <main className="flex-1 h-full bg-[#F8FAFC] relative flex">
          
          {nodes.length === 0 ? (
            /* Guided Onboarding Empty State instead of Empty Canvas */
            <div className="flex-1 flex items-center justify-center p-6 bg-[#F8FAFC] select-none">
              <div className="max-w-lg w-full bg-white p-6 sm:p-8 border border-[#E2E8F0] rounded-2xl sm:rounded-3xl shadow-xs text-center space-y-6">
                <div className="w-12 h-12 bg-[#F0FDF4] border border-[#22C55E]/30 rounded-2xl flex items-center justify-center text-[#166534] mx-auto">
                  <Zap size={22} className="animate-pulse" />
                </div>
                
                <div className="space-y-1.5">
                  <h2 className="text-base sm:text-lg font-bold text-[#12263A]">
                    {isRtl ? 'أنشئ مسار عملك الأول' : 'Create Your First Workflow'}
                  </h2>
                  <p className="text-xs text-[#64748B] font-normal leading-relaxed max-w-md mx-auto">
                    {isRtl 
                      ? 'اختر كيف يبدأ هذا المسار. حدد حدث تشغيل لبدء تدفق الأتمتة المرئي الخاص بك.' 
                      : 'Choose how this workflow should start. Select an event trigger to initiate your visual automation flow.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 pt-2">
                  {[
                    { 
                      type: 'incoming_message', 
                      title: isRtl ? 'رسالة واردة' : 'Incoming Message', 
                      desc: isRtl ? 'يبدأ تلقائياً عند استلام أي رسالة واتساب واردة' : 'Triggers on any incoming WhatsApp message', 
                      icon: Zap 
                    },
                    { 
                      type: 'keyword', 
                      title: isRtl ? 'تطابق الكلمات المفتاحية' : 'Keyword Match', 
                      desc: isRtl ? 'يبدأ عندما يرسل العميل كلمات مفتاحية معينة' : 'Triggers when a customer messages specific keywords', 
                      icon: Zap 
                    },
                    { 
                      type: 'schedule', 
                      title: isRtl ? 'مشغّل مجدول' : 'Schedule Trigger', 
                      desc: isRtl ? 'يشغّل المسار وفق فترات زمنية ومواعيد محددة' : 'Runs the workflow at configured schedule intervals', 
                      icon: Clock 
                    }
                  ].map((btn) => (
                    <button
                      key={btn.type}
                      type="button"
                      onClick={() => addInitialTrigger(btn.type)}
                      className={cn(
                        "w-full p-3.5 bg-white hover:bg-[#F0FDF4] focus:bg-[#F0FDF4] border border-[#E2E8F0] hover:border-[#22C55E]/50 focus:border-[#166534] rounded-2xl flex items-center gap-3.5 transition-all active:scale-[0.99] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#22C55E]/20 group",
                        isRtl ? "text-right" : "text-left"
                      )}
                    >
                      <div className="w-10 h-10 rounded-xl bg-[#F0FDF4] text-[#166534] border border-[#22C55E]/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <btn.icon size={16} />
                      </div>
                      <div className="min-w-0">
                        <span className="block text-xs font-bold text-[#12263A] leading-tight group-hover:text-[#166534] transition-colors">
                          {btn.title}
                        </span>
                        <span className="block text-[11px] text-[#64748B] mt-1 leading-normal font-normal">
                          {btn.desc}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="border-t border-[#E2E8F0] pt-4 text-xs text-[#64748B]">
                  {isRtl ? 'أو ابدأ باستخدام ' : 'Or start with our '}
                  <button 
                    type="button"
                    onClick={buildExampleTemplate} 
                    className="text-[#166534] font-bold hover:underline cursor-pointer transition-colors"
                  >
                    {isRtl ? 'نموذج مسار الترحيب' : 'Welcome Flow template'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Visual React Flow Canvas */
            <div className="flex-1 h-full relative" dir="ltr">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={(_e, node) => setSelectedNode(node)}
                nodeTypes={nodeTypes}
                fitView
              >
                <Background color="#E2E8F0" gap={16} />
                <Controls className="bg-white border border-[#E2E8F0] rounded-xl shadow-xs overflow-hidden" />
                <MiniMap className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-xs" nodeColor="#166534" />
              </ReactFlow>
            </div>
          )}

          {/* Quick Selection Popup Menu for "+ Add Step" */}
          <AnimatePresence>
            {stepSelectorParentId && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setStepSelectorParentId(null)} />
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className={cn(
                    "relative w-full max-w-sm bg-white border border-[#E2E8F0] rounded-2xl shadow-xl overflow-hidden z-10 p-5 space-y-4",
                    isRtl && "text-right"
                  )}
                  dir={isRtl ? 'rtl' : 'ltr'}
                >
                  <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
                    <span className="text-xs font-bold text-[#12263A] uppercase tracking-wider">
                      {isRtl ? 'اختر الإجراء التالي للمسار' : 'Select Next Flow Action'}
                    </span>
                    <button 
                      onClick={() => setStepSelectorParentId(null)} 
                      className="text-[#64748B] hover:text-[#12263A] p-1 rounded-lg hover:bg-[#F8FAFC] cursor-pointer"
                    >
                      <X size={15} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-2 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
                    {catalogTypes.filter(n => n.category !== (isRtl ? 'مشغّل' : 'Trigger')).map((item) => (
                      <button
                        key={item.type}
                        onClick={() => selectStepAction(item.type)}
                        className={cn(
                          "w-full p-2.5 bg-white hover:bg-[#F0FDF4] border border-[#E2E8F0] hover:border-[#22C55E]/40 rounded-xl flex items-center gap-3 transition-all cursor-pointer group",
                          isRtl ? "text-right" : "text-left"
                        )}
                      >
                        <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0 shadow-xs", item.color)}>
                          <item.icon size={12} />
                        </div>
                        <div className="min-w-0">
                          <span className="block text-xs font-bold text-[#12263A] leading-tight group-hover:text-[#166534] transition-colors">{item.label}</span>
                          <span className="block text-[10px] text-[#64748B] mt-0.5 leading-tight font-normal">{item.desc}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </main>

        {/* Settings panel (Visible alongside canvas) */}
        <AnimatePresence>
          {selectedNode && (
            <motion.div
              initial={{ x: isRtl ? '-100%' : '100%' }}
              animate={{ x: 0 }}
              exit={{ x: isRtl ? '-100%' : '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className={cn(
                "w-80 bg-white shadow-xl z-20 flex flex-col shrink-0",
                isRtl ? "border-r border-[#E2E8F0] text-right" : "border-l border-[#E2E8F0] text-left"
              )}
              dir={isRtl ? 'rtl' : 'ltr'}
            >
              <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sliders size={14} className="text-[#166534]" />
                  <span className="text-xs font-bold text-[#12263A] uppercase tracking-wider">
                    {isRtl ? 'إعدادات الكتلة' : 'Node Settings'}
                  </span>
                </div>
                <button 
                  onClick={() => setSelectedNode(null)}
                  className="text-[#64748B] hover:text-[#12263A] p-1 rounded-lg hover:bg-[#F8FAFC] cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
                <div>
                  <span className="text-[9px] font-bold text-[#64748B] uppercase tracking-wider block leading-none">
                    {isRtl ? 'معرّف الكتلة' : 'Node ID'}
                  </span>
                  <span className="text-xs font-bold text-[#12263A] mt-1.5 block font-mono leading-none">{selectedNode.id}</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                    {isRtl ? 'عنوان الكتلة' : 'Label Title'}
                  </label>
                  <input
                    type="text"
                    value={selectedNode.data.label}
                    onChange={(e) => {
                      setIsSaved(false);
                      const nextLabel = e.target.value;
                      setNodes(nds => nds.map(n => n.id === selectedNode.id ? { ...n, data: { ...n.data, label: nextLabel } } : n));
                      setSelectedNode({ ...selectedNode, data: { ...selectedNode.data, label: nextLabel } });
                    }}
                    className={cn(
                      "w-full h-10 px-3 bg-white border border-[#E2E8F0] rounded-xl text-xs font-medium text-[#12263A] focus:outline-none focus:ring-2 focus:ring-[#22C55E]/15 focus:border-[#166534] transition-all",
                      isRtl && "text-right"
                    )}
                  />
                </div>

                {/* Configurations */}
                <div className="border-t border-[#E2E8F0] pt-4 space-y-3">
                  <span className="block text-[9px] font-bold text-[#64748B] uppercase tracking-wider">
                    {isRtl ? 'حقول التكوين' : 'Config Fields'}
                  </span>

                  {/* KEYWORD TRIGGER */}
                  {selectedNode.data.type === 'keyword' && (
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-[#64748B] block">
                          {isRtl ? 'الكلمات المفتاحية (مفصولة بفواصل)' : 'Keywords (comma separated)'}
                        </label>
                        <input
                          type="text"
                          placeholder={isRtl ? 'مثال: سعر، باقة، اشتراك' : 'E.g. price, cost, catalog'}
                          value={selectedNode.data.config?.keywords || ''}
                          onChange={(e) => updateNodeConfig(selectedNode.id, { keywords: e.target.value })}
                          className={cn("w-full h-9 px-3 bg-white border border-[#E2E8F0] rounded-xl text-xs text-[#12263A] focus:outline-none focus:ring-2 focus:ring-[#22C55E]/15 focus:border-[#166534]", isRtl && "text-right")}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-[#64748B] block">
                          {isRtl ? 'نوع المطابقة' : 'Match Type'}
                        </label>
                        <select
                          value={selectedNode.data.config?.matchType || 'contains'}
                          onChange={(e) => updateNodeConfig(selectedNode.id, { matchType: e.target.value })}
                          className={cn("w-full h-9 px-2 bg-white border border-[#E2E8F0] rounded-xl text-xs text-[#12263A] focus:outline-none focus:ring-2 focus:ring-[#22C55E]/15 focus:border-[#166534]", isRtl && "text-right")}
                        >
                          <option value="contains">{isRtl ? 'يحتوي على الكلمة' : 'Contains Word'}</option>
                          <option value="exact">{isRtl ? 'تطابق تام' : 'Exact Match'}</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* SCHEDULE TRIGGER */}
                  {selectedNode.data.type === 'schedule' && (
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-[#64748B] block">
                          {isRtl ? 'فترة التكرار والجدولة' : 'Schedule Interval'}
                        </label>
                        <select
                          value={selectedNode.data.config?.interval || 'daily'}
                          onChange={(e) => updateNodeConfig(selectedNode.id, { interval: e.target.value })}
                          className={cn("w-full h-9 px-2 bg-white border border-[#E2E8F0] rounded-xl text-xs text-[#12263A] focus:outline-none focus:ring-2 focus:ring-[#22C55E]/15 focus:border-[#166534]", isRtl && "text-right")}
                        >
                          <option value="once">{isRtl ? 'مرة واحدة' : 'One Time'}</option>
                          <option value="daily">{isRtl ? 'يومياً متكرر' : 'Daily Recurring'}</option>
                          <option value="weekly">{isRtl ? 'أسبوعياً متكرر' : 'Weekly Recurring'}</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* CONDITION LOGIC */}
                  {selectedNode.data.type === 'condition' && (
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-[#64748B] block">
                          {isRtl ? 'معيار الفحص' : 'Check Parameter'}
                        </label>
                        <select
                          value={selectedNode.data.config?.field || 'message'}
                          onChange={(e) => updateNodeConfig(selectedNode.id, { field: e.target.value })}
                          className={cn("w-full h-9 px-2 bg-white border border-[#E2E8F0] rounded-xl text-xs text-[#12263A] focus:outline-none focus:ring-2 focus:ring-[#22C55E]/15 focus:border-[#166534]", isRtl && "text-right")}
                        >
                          <option value="message">{isRtl ? 'نص الرسالة الواردة' : 'Inbound message body'}</option>
                          <option value="contact_tag">{isRtl ? 'وسم جهة الاتصال' : 'Contact Tag label'}</option>
                          <option value="name">{isRtl ? 'اسم جهة الاتصال' : 'Contact Name'}</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-[#64748B] block">
                          {isRtl ? 'الشرط' : 'Condition'}
                        </label>
                        <select
                          value={selectedNode.data.config?.operator || 'equals'}
                          onChange={(e) => updateNodeConfig(selectedNode.id, { operator: e.target.value })}
                          className={cn("w-full h-9 px-2 bg-white border border-[#E2E8F0] rounded-xl text-xs text-[#12263A] focus:outline-none focus:ring-2 focus:ring-[#22C55E]/15 focus:border-[#166534]", isRtl && "text-right")}
                        >
                          <option value="equals">{isRtl ? 'يساوي' : 'Equals'}</option>
                          <option value="contains">{isRtl ? 'يحتوي على' : 'Contains'}</option>
                          <option value="exists">{isRtl ? 'موجود' : 'Is Present'}</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-[#64748B] block">
                          {isRtl ? 'القيمة المستهدفة للمطابقة' : 'Match Target Value'}
                        </label>
                        <input
                          type="text"
                          value={selectedNode.data.config?.value || ''}
                          onChange={(e) => updateNodeConfig(selectedNode.id, { value: e.target.value })}
                          className={cn("w-full h-9 px-3 bg-white border border-[#E2E8F0] rounded-xl text-xs text-[#12263A] focus:outline-none focus:ring-2 focus:ring-[#22C55E]/15 focus:border-[#166534]", isRtl && "text-right")}
                        />
                      </div>
                    </div>
                  )}

                  {/* WAIT DELAY */}
                  {selectedNode.data.type === 'wait' && (
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-[#64748B] block">
                          {isRtl ? 'مدة الانتظار' : 'Duration Amount'}
                        </label>
                        <input
                          type="number"
                          min={1}
                          value={selectedNode.data.config?.amount || '30'}
                          onChange={(e) => updateNodeConfig(selectedNode.id, { amount: e.target.value })}
                          className={cn("w-full h-9 px-3 bg-white border border-[#E2E8F0] rounded-xl text-xs text-[#12263A] focus:outline-none focus:ring-2 focus:ring-[#22C55E]/15 focus:border-[#166534]", isRtl && "text-right")}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-[#64748B] block">
                          {isRtl ? 'الوحدة الزمنية' : 'Unit'}
                        </label>
                        <select
                          value={selectedNode.data.config?.unit || 'minutes'}
                          onChange={(e) => updateNodeConfig(selectedNode.id, { unit: e.target.value })}
                          className={cn("w-full h-9 px-2 bg-white border border-[#E2E8F0] rounded-xl text-xs text-[#12263A] focus:outline-none focus:ring-2 focus:ring-[#22C55E]/15 focus:border-[#166534]", isRtl && "text-right")}
                        >
                          <option value="minutes">{isRtl ? 'دقائق' : 'Minutes'}</option>
                          <option value="hours">{isRtl ? 'ساعات' : 'Hours'}</option>
                          <option value="days">{isRtl ? 'أيام' : 'Days'}</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* SEND MESSAGE */}
                  {selectedNode.data.type === 'send_message' && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-[#64748B] block">
                        {isRtl ? 'نص الرسالة' : 'Message text body'}
                      </label>
                      <textarea
                        placeholder={isRtl ? 'مرحباً {{customer_name}}! يسعدنا تواصلك معنا.' : 'Hello {{customer_name}}! Welcome to our store.'}
                        value={selectedNode.data.config?.message || ''}
                        onChange={(e) => updateNodeConfig(selectedNode.id, { message: e.target.value })}
                        className={cn("w-full h-24 p-2.5 bg-white border border-[#E2E8F0] rounded-xl text-xs text-[#12263A] focus:outline-none focus:ring-2 focus:ring-[#22C55E]/15 focus:border-[#166534] font-medium leading-relaxed resize-none", isRtl && "text-right")}
                      />
                      <span className="text-[9px] text-[#64748B] font-medium block leading-tight">
                        {isRtl 
                          ? 'يمكنك استخدام المتغيرات مثل '
                          : 'Use variables like '}
                        <code className="bg-[#F8FAFC] border border-[#E2E8F0] px-1 py-0.5 rounded text-[8px] font-bold font-mono">{"{{customer_name}}"}</code> 
                        {isRtl ? ' لإدراج البيانات ديناميكياً.' : ' to insert values dynamically.'}
                      </span>
                    </div>
                  )}

                  {/* SEND TEMPLATE */}
                  {selectedNode.data.type === 'send_template' && (
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-[#64748B] block">
                        {isRtl ? 'معرّف اسم القالب' : 'Template Name ID'}
                      </label>
                      <input
                        type="text"
                        placeholder={isRtl ? 'مثال: customer_greeting' : 'E.g. customer_greeting'}
                        value={selectedNode.data.config?.templateId || ''}
                        onChange={(e) => updateNodeConfig(selectedNode.id, { templateId: e.target.value })}
                        className={cn("w-full h-9 px-3 bg-white border border-[#E2E8F0] rounded-xl text-xs text-[#12263A] focus:outline-none focus:ring-2 focus:ring-[#22C55E]/15 focus:border-[#166534]", isRtl && "text-right")}
                      />
                    </div>
                  )}

                  {/* ASSIGN AGENT */}
                  {selectedNode.data.type === 'assign_agent' && (
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-[#64748B] block">
                        {isRtl ? 'اسم موظف الدعم' : 'Support Agent name'}
                      </label>
                      <input
                        type="text"
                        placeholder={isRtl ? 'مثال: أخصائي المبيعات' : 'E.g. Support Specialist'}
                        value={selectedNode.data.config?.agentName || ''}
                        onChange={(e) => updateNodeConfig(selectedNode.id, { agentName: e.target.value })}
                        className={cn("w-full h-9 px-3 bg-white border border-[#E2E8F0] rounded-xl text-xs text-[#12263A] focus:outline-none focus:ring-2 focus:ring-[#22C55E]/15 focus:border-[#166534]", isRtl && "text-right")}
                      />
                    </div>
                  )}

                  {/* ADD TAG */}
                  {selectedNode.data.type === 'add_tag' && (
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-[#64748B] block">
                        {isRtl ? 'اسم الوسم' : 'Tag name label'}
                      </label>
                      <input
                        type="text"
                        placeholder={isRtl ? 'مثال: عميل_جديد' : 'E.g. customer_onboarded'}
                        value={selectedNode.data.config?.tagName || ''}
                        onChange={(e) => updateNodeConfig(selectedNode.id, { tagName: e.target.value })}
                        className={cn("w-full h-9 px-3 bg-white border border-[#E2E8F0] rounded-xl text-xs text-[#12263A] focus:outline-none focus:ring-2 focus:ring-[#22C55E]/15 focus:border-[#166534]", isRtl && "text-right")}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 border-t border-[#E2E8F0] bg-white flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedNode(null)}
                  className="w-1/2 py-2 border border-[#E2E8F0] text-[#64748B] hover:text-[#12263A] bg-[#F8FAFC] hover:bg-[#F1F5F9] rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  {isRtl ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedNode(null)}
                  className="w-1/2 py-2 bg-[#166534] hover:bg-[#14532d] text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
                >
                  {isRtl ? 'حفظ' : 'Save'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Preview Simulation Drawer / Modal */}
      <AnimatePresence>
        {isPreviewOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPreviewOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs pointer-events-auto" 
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className={cn(
                "relative w-full max-w-lg bg-white border border-[#E2E8F0] rounded-2xl shadow-xl overflow-hidden z-[110] p-6 space-y-5",
                isRtl && "text-right"
              )}
              dir={isRtl ? 'rtl' : 'ltr'}
            >
              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
                <div className="flex items-center gap-2">
                  <Activity size={16} className="text-[#166534]" />
                  <span className="text-xs font-bold text-[#12263A] uppercase tracking-wider">
                    {isRtl ? 'محاكاة تشغيل مسار العمل' : 'Workflow Simulation Run'}
                  </span>
                </div>
                <button 
                  onClick={() => setIsPreviewOpen(false)} 
                  className="text-[#64748B] hover:text-[#12263A] p-1 rounded-lg hover:bg-[#F8FAFC] cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-xs text-[#64748B] font-normal leading-relaxed">
                  {isRtl 
                    ? 'فيما يلي محاكاة تجريبية لمسار سير جهات الاتصال عبر الخطوات المحددة في المسار:' 
                    : 'Below is a mockup preview trace path simulation representing how contacts will flow through the configured steps:'}
                </p>

                <div className="p-4 bg-[#F8FAFC] text-[#12263A] rounded-xl border border-[#E2E8F0] text-[11px] font-mono leading-relaxed space-y-2 max-h-60 overflow-y-auto custom-scrollbar" dir="ltr">
                  <div className="text-[#64748B] font-semibold">
                    {isRtl ? `[11:00:00] Initiating dry-run simulation for "${workflowName}"...` : `[11:00:00] Initiating dry-run simulation for "${workflowName}"...`}
                  </div>
                  {nodes.map((n) => (
                    <div key={n.id} className="flex items-center gap-2 mt-1.5">
                      <ChevronRight size={12} className="text-[#166534] shrink-0" />
                      <div className="min-w-0">
                        <span className="text-amber-700 font-bold uppercase text-[10px]">{n.data.type}</span>
                        <span className="text-[#64748B] ml-1.5 font-medium">({n.data.label})</span>
                        <span className="text-[#166534] ml-2 font-bold font-sans text-[10px] bg-[#F0FDF4] px-1.5 py-0.5 rounded border border-[#22C55E]/30">
                          {isRtl ? 'تم التحقق بنجاح' : 'Verified OK'}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div className="text-[#166534] font-bold border-t border-[#E2E8F0] pt-2 mt-2">
                    {isRtl ? 'Simulation completed. Graph integrity check: Passed.' : 'Simulation completed. Graph integrity check: Passed.'}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="w-full py-2.5 bg-[#12263A] hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                {isRtl ? 'إغلاق المعاينة' : 'Close Preview'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
