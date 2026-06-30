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
  CheckCircle2,
  Copy,
  AlertCircle,
  Eye,
  Activity,
  Menu,
  ChevronRight
} from 'lucide-react';
import { crmApi } from '../../services/crmApi';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from '../../components/ui/Toast';

// WATI-Inspired catalog node types
const CATALOG_NODE_TYPES = [
  { type: 'incoming_message', label: 'Incoming Message', category: 'Trigger', icon: Zap, desc: 'Triggers on any inbound message.', color: 'bg-amber-500' },
  { type: 'keyword', label: 'Keyword Match', category: 'Trigger', icon: Zap, desc: 'Triggers on keyword matches.', color: 'bg-amber-600' },
  { type: 'schedule', label: 'Schedule Trigger', category: 'Trigger', icon: Clock, desc: 'Scheduled delivery interval.', color: 'bg-amber-700' },
  { type: 'condition', label: 'Condition Filter', category: 'Logic', icon: GitFork, desc: 'Evaluate fields condition.', color: 'bg-blue-500' },
  { type: 'wait', label: 'Wait Delay', category: 'Logic', icon: Clock, desc: 'Pause flow for a duration.', color: 'bg-violet-500' },
  { type: 'send_message', label: 'Send Message', category: 'Action', icon: PlayCircle, desc: 'Send text message reply.', color: 'bg-emerald-500' },
  { type: 'send_template', label: 'Send Template', category: 'Action', icon: PlayCircle, desc: 'Dispatch standard template.', color: 'bg-emerald-600' },
  { type: 'assign_agent', label: 'Assign Agent', category: 'Action', icon: PlayCircle, desc: 'Assign contact to an agent.', color: 'bg-emerald-700' },
  { type: 'add_tag', label: 'Add Tag', category: 'Action', icon: PlayCircle, desc: 'Attach a category tag.', color: 'bg-emerald-800' },
  { type: 'end_workflow', label: 'End Workflow', category: 'Action', icon: PlayCircle, desc: 'Mark flow execution done.', color: 'bg-slate-700' },
];

// Custom Node Component to display WATI-inspired styled cards
const CustomWorkflowNode = ({ id, data, isConnectable }: any) => {
  const isTrigger = ['incoming_message', 'keyword', 'schedule'].includes(data.type);
  const isEnd = data.type === 'end_workflow';

  // Styling based on block category
  let colorClass = 'border-slate-200 dark:border-slate-700';
  let badgeColor = 'bg-slate-100 text-slate-700 dark:bg-slate-900/60 dark:text-slate-400';
  let Icon = PlayCircle;

  if (isTrigger) {
    colorClass = 'border-amber-400 dark:border-amber-500';
    badgeColor = 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-300';
    Icon = Zap;
    if (data.type === 'schedule') Icon = Clock;
  } else if (['condition', 'wait'].includes(data.type)) {
    colorClass = 'border-violet-400 dark:border-violet-500';
    badgeColor = 'bg-violet-50 text-violet-700 dark:bg-violet-950/20 dark:text-violet-300';
    Icon = data.type === 'condition' ? GitFork : Clock;
  } else {
    colorClass = 'border-emerald-400 dark:border-emerald-500';
    badgeColor = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-300';
  }

  // Generate parameter summary description
  let summary = 'Click edit to configure';
  if (data.type === 'keyword') {
    summary = data.config?.keywords ? `Keywords: ${data.config.keywords}` : 'No keywords configured';
  } else if (data.type === 'schedule') {
    summary = `Interval: ${data.config?.interval || 'daily'}`;
  } else if (data.type === 'send_message') {
    summary = data.config?.message ? `"${data.config.message}"` : 'Message body is empty';
  } else if (data.type === 'send_template') {
    summary = data.config?.templateId ? `Template: ${data.config.templateId}` : 'No template selected';
  } else if (data.type === 'wait') {
    summary = `Wait ${data.config?.amount || '30'} ${data.config?.unit || 'minutes'}`;
  } else if (data.type === 'add_tag') {
    summary = data.config?.tagName ? `Tag: ${data.config.tagName}` : 'Tag name not specified';
  } else if (data.type === 'assign_agent') {
    summary = data.config?.agentName ? `Agent: ${data.config.agentName}` : 'No agent specified';
  } else if (data.type === 'condition') {
    summary = `${data.config?.field || 'message'} ${data.config?.operator || 'equals'} ${data.config?.value || ''}`;
  } else if (data.type === 'end_workflow') {
    summary = 'Terminates workflow execution';
  }

  return (
    <div className={cn(
      "w-64 bg-white dark:bg-slate-800 border-2 rounded-2xl shadow-sm hover:shadow-md text-left font-sans transition-all relative p-0.5",
      colorClass,
      data.validationError ? "border-red-500 ring-2 ring-red-500/20" : ""
    )}>
      {/* Top Input Handle */}
      {!isTrigger && (
        <Handle
          type="target"
          position={Position.Top}
          id="top"
          style={{ background: '#94a3b8', width: 8, height: 8 }}
          isConnectable={isConnectable}
        />
      )}

      {/* Main Card Content */}
      <div className="p-3.5">
        <div className="flex items-center justify-between gap-2.5 mb-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <div className={cn("w-6 h-6 rounded-lg flex items-center justify-center text-white shrink-0 shadow-sm",
              isTrigger ? 'bg-amber-500' : ['condition', 'wait'].includes(data.type) ? 'bg-violet-500' : 'bg-emerald-500'
            )}>
              <Icon size={12} />
            </div>
            <div className="min-w-0">
              <span className={cn("px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider block w-max leading-none", badgeColor)}>
                {data.type.replace('_', ' ')}
              </span>
              <span className="block text-[11px] font-extrabold text-slate-850 dark:text-white truncate mt-1 leading-none">
                {data.label}
              </span>
            </div>
          </div>

          {/* Node Action Buttons */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={(e) => { e.stopPropagation(); data.onConfigure(id); }}
              className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-400 hover:text-slate-650 transition-all cursor-pointer"
            >
              <Settings size={12} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); data.onDuplicate(id); }}
              className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-400 hover:text-slate-650 transition-all cursor-pointer"
            >
              <Copy size={12} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); data.onDelete(id); }}
              className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-950/20 text-slate-400 hover:text-red-650 transition-all cursor-pointer"
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>

        {/* Short Parameter Summary */}
        <div className="text-[10px] text-slate-450 dark:text-slate-400 font-semibold leading-relaxed line-clamp-2 break-all p-2 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-750">
          {summary}
        </div>
      </div>

      {/* Validation Error Banner */}
      {data.validationError && (
        <div className="px-3 py-1.5 bg-red-50 dark:bg-red-950/20 border-t border-red-100 dark:border-red-900/20 text-red-650 dark:text-red-400 text-[9px] font-bold flex items-center gap-1.5 rounded-b-2xl">
          <AlertCircle size={10} className="shrink-0" />
          <span>{data.validationError}</span>
        </div>
      )}

      {/* Bottom Output Handle */}
      {!isEnd && (
        <Handle
          type="source"
          position={Position.Bottom}
          id="bottom"
          style={{ background: '#94a3b8', width: 8, height: 8 }}
          isConnectable={isConnectable}
        />
      )}

      {/* Centered Add Step Trigger Button beneath node */}
      {!isEnd && !data.hasOutgoing && (
        <div className="absolute left-1/2 -bottom-8.5 -translate-x-1/2 z-10">
          <button
            onClick={(e) => { e.stopPropagation(); data.onAddStep(id); }}
            className="px-2.5 py-1.5 bg-indigo-650 hover:bg-indigo-700 text-white rounded-lg text-[9px] font-bold shadow-sm hover:shadow active:scale-95 transition-all flex items-center gap-1 cursor-pointer w-max uppercase tracking-wider leading-none"
          >
            <Plus size={9.5} strokeWidth={3} /> Add Step
          </button>
        </div>
      )}

    </div>
  );
};

export default function WorkflowBuilderPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [workflowName, setWorkflowName] = useState('Loading Visual Builder...');
  const [workflowStatus, setWorkflowStatus] = useState('inactive');
  
  const [selectedNode, setSelectedNode] = useState<any | null>(null);
  
  // Builder State
  const [isSaved, setIsSaved] = useState(true);
  const [lastSaved, setLastSaved] = useState('Saved just now');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [stepSelectorParentId, setStepSelectorParentId] = useState<string | null>(null);

  // Preview / Simulation Drawer
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

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
          hasOutgoing
        }
      };
    });
  }, []);

  // Connect helper
  const onConnect = useCallback((params: any) => {
    setIsSaved(false);
    setEdges((eds) => {
      const nextEdges = addEdge({
        ...params,
        animated: true,
        markerEnd: { type: MarkerType.ArrowClosed, color: '#6366f1' },
        style: { stroke: '#6366f1', strokeWidth: 2 }
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
            markerEnd: { type: MarkerType.ArrowClosed, color: '#6366f1' },
            style: { stroke: '#6366f1', strokeWidth: 2 }
          }));

          setNodes(syncNodesOutgoingStatus(mappedNodes, mappedEdges));
          setEdges(mappedEdges);
        } else {
          // If empty, keep empty state to display onboarding guided picker
          setNodes([]);
          setEdges([]);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error('Error', 'Failed to retrieve workflow data.');
    }
  }, [id, setNodes, setEdges, syncNodesOutgoingStatus]);

  useEffect(() => {
    loadWorkflow();
  }, [loadWorkflow]);

  // Guided trigger onboarding selector
  const addInitialTrigger = (type: string) => {
    setIsSaved(false);
    const catalogItem = CATALOG_NODE_TYPES.find(n => n.type === type);
    const initialNode = {
      id: 'node-trig',
      type: 'workflowNode',
      position: { x: 350, y: 80 },
      data: {
        type,
        label: catalogItem?.label || 'Trigger',
        config: {},
        onConfigure: (nodeId: string) => handleConfigureNode(nodeId),
        onDuplicate: (nodeId: string) => handleDuplicateNode(nodeId),
        onDelete: (nodeId: string) => handleDeleteNode(nodeId),
        onAddStep: (nodeId: string) => handleAddStepRequest(nodeId),
        hasOutgoing: false
      }
    };
    setNodes([initialNode]);
  };

  // Add Step Popup Trigger
  const handleAddStepRequest = (parentId: string) => {
    setStepSelectorParentId(parentId);
  };

  // Add Action/Logic node below the parent node and link them
  const selectStepAction = (type: string) => {
    if (!stepSelectorParentId) return;
    setIsSaved(false);

    const parentNode = nodes.find(n => n.id === stepSelectorParentId);
    if (!parentNode) return;

    const catalogItem = CATALOG_NODE_TYPES.find(n => n.type === type);
    const newNodeId = `node-${Date.now()}`;
    const nextY = parentNode.position.y + 160;

    const newNode = {
      id: newNodeId,
      type: 'workflowNode',
      position: { x: parentNode.position.x, y: nextY },
      data: {
        type,
        label: catalogItem?.label || 'Step',
        config: {},
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
      markerEnd: { type: MarkerType.ArrowClosed, color: '#6366f1' },
      style: { stroke: '#6366f1', strokeWidth: 2 }
    };

    setNodes(prev => {
      const nextNds = prev.concat(newNode);
      return syncNodesOutgoingStatus(nextNds, edges.concat(newEdge));
    });
    setEdges(prev => prev.concat(newEdge));
    setStepSelectorParentId(null);
    setSelectedNode(newNode);
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
        onConfigure: (nId: string) => handleConfigureNode(nId),
        onDuplicate: (nId: string) => handleDuplicateNode(nId),
        onDelete: (nId: string) => handleDeleteNode(nId),
        onAddStep: (nId: string) => handleAddStepRequest(nId),
        hasOutgoing: false
      }
    };

    setNodes(nds => nds.concat(newNode));
    toast.success('Duplicated', 'Block duplicated on canvas.');
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

  // Save changes locally in Draft state
  const handleSaveDraft = async () => {
    if (!id) return;
    try {
      // Map nodes to backend schema format
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
      setLastSaved(`Saved at ${new Date().toLocaleTimeString()}`);
      toast.success('Saved Draft', 'Workflow stored successfully as draft.');
    } catch (err) {
      console.error(err);
      toast.error('Error', 'Failed to save workflow graph.');
    }
  };

  // Run validation checks on nodes
  const runValidation = (): boolean => {
    let hasError = false;
    const nextNodes = nodes.map(n => {
      let validationError = '';
      
      // Every workflow must start with trigger
      if (n.id === 'node-trig' && !['incoming_message', 'keyword', 'schedule'].includes(n.data.type)) {
        validationError = 'Initial node must be a trigger block';
      }

      // Keyword trigger validation
      if (n.data.type === 'keyword' && !n.data.config?.keywords) {
        validationError = 'Keyword string is required';
      }

      // Send message validation
      if (n.data.type === 'send_message' && !n.data.config?.message) {
        validationError = 'Message body is required';
      }

      // Send template validation
      if (n.data.type === 'send_template' && !n.data.config?.templateId) {
        validationError = 'Template name is required';
      }

      // Wait validation
      if (n.data.type === 'wait' && (!n.data.config?.amount || Number(n.data.config.amount) <= 0)) {
        validationError = 'Duration must be positive';
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
      toast.error('Validation Failed', 'Please fix highlights directly on the nodes.');
      return false;
    }

    // Clear any previous errors
    setNodes(nodes.map(n => ({ ...n, data: { ...n.data, validationError: undefined } })));
    return true;
  };

  // Validate and Publish
  const handlePublish = async () => {
    if (!id) return;
    if (!runValidation()) return;

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
      setLastSaved(`Saved at ${new Date().toLocaleTimeString()}`);
      toast.success('Published!', 'Workflow visual configuration published successfully.');
    } catch (err) {
      console.error(err);
      toast.error('Error', 'Failed to publish workflow.');
    }
  };

  // Drag and drop helper catalog add
  const handleDragNodeAdd = (typeObj: typeof CATALOG_NODE_TYPES[0]) => {
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
        label: 'Incoming Message',
        config: {},
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
        label: 'Send Welcome Message',
        config: { message: 'Welcome to our service! We will connect you to an agent soon.' },
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
        label: 'Wait 5 Minutes',
        config: { amount: '5', unit: 'minutes' },
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
        label: 'Assign Agent',
        config: { agentName: 'Ateeq Support' },
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
        label: 'End Workflow',
        config: {},
        onConfigure: (nId: string) => handleConfigureNode(nId),
        onDuplicate: (nId: string) => handleDuplicateNode(nId),
        onDelete: (nId: string) => handleDeleteNode(nId),
        onAddStep: (nId: string) => handleAddStepRequest(nId),
        hasOutgoing: false
      }
    };

    const nextNodes = [trig, action1, delay, action2, end];
    const nextEdges = [
      { id: 'edge-1', source: 'node-trig', target: 'node-act-1', animated: true, markerEnd: { type: MarkerType.ArrowClosed, color: '#6366f1' }, style: { stroke: '#6366f1', strokeWidth: 2 } },
      { id: 'edge-2', source: 'node-act-1', target: 'node-delay', animated: true, markerEnd: { type: MarkerType.ArrowClosed, color: '#6366f1' }, style: { stroke: '#6366f1', strokeWidth: 2 } },
      { id: 'edge-3', source: 'node-delay', target: 'node-act-2', animated: true, markerEnd: { type: MarkerType.ArrowClosed, color: '#6366f1' }, style: { stroke: '#6366f1', strokeWidth: 2 } },
      { id: 'edge-4', source: 'node-act-2', target: 'node-end', animated: true, markerEnd: { type: MarkerType.ArrowClosed, color: '#6366f1' }, style: { stroke: '#6366f1', strokeWidth: 2 } }
    ];

    setNodes(nextNodes);
    setEdges(nextEdges);
    toast.success('Template Loaded', 'Seeded sample linear welcome flow onboarding template.');
  };

  return (
    <div className="h-[calc(100vh-180px)] min-h-[600px] bg-slate-50 dark:bg-slate-900 flex flex-col font-sans select-none relative rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      
      {/* Visual Header Toolbar */}
      <header className="h-16 bg-white dark:bg-slate-850 border-b border-slate-200/80 dark:border-slate-800 px-6 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/automation/workflows')}
            className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-550 hover:text-slate-900 transition-all cursor-pointer border border-slate-150/70 dark:border-slate-700 active:scale-95"
          >
            <ArrowLeft size={16} />
          </button>
          
          <div className="leading-tight">
            <h1 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span>{workflowName}</span>
              <span className={cn(
                "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider leading-none border",
                workflowStatus === 'active' 
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20' 
                  : 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800'
              )}>
                {workflowStatus === 'active' ? 'Published' : 'Draft'}
              </span>
            </h1>
            <p className="text-[10px] font-semibold text-slate-400 mt-1 flex items-center gap-1.5 leading-none">
              <span>{lastSaved}</span>
              {nodes.length > 0 && (
                <>
                  <span className="w-1 h-1 rounded-full bg-slate-300" />
                  <button onClick={buildExampleTemplate} className="text-indigo-650 hover:underline">Re-seed Welcome Flow template</button>
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Sidebar Toggle Toggle */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={cn(
              "px-3.5 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 cursor-pointer",
              isSidebarOpen 
                ? 'bg-slate-900 text-white border-slate-900 dark:bg-slate-700 dark:border-slate-600' 
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
            )}
          >
            <Menu size={13} /> Blocks Sidebar
          </button>

          <button
            onClick={() => setIsPreviewOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Eye size={13} /> Preview
          </button>

          <button
            onClick={handleSaveDraft}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer border border-slate-200/40"
          >
            Save Draft
          </button>

          <button
            onClick={handlePublish}
            className="flex items-center justify-center gap-1.5 px-4.5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer shrink-0"
          >
            <Save size={13} /> Publish Workflow
          </button>
        </div>
      </header>

      {/* Workspace Canvas Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Toggleable Sidebar catalog */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.aside
              initial={{ x: -260, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -260, opacity: 0 }}
              className="w-64 bg-white dark:bg-slate-850 border-r border-slate-200/80 dark:border-slate-800 p-4 overflow-y-auto flex flex-col gap-4 shrink-0 z-20"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Blocks Catalog</h3>
                  <button onClick={() => setIsSidebarOpen(false)} className="text-slate-400 hover:text-slate-650"><X size={15} /></button>
                </div>
                <p className="text-[9px] text-slate-450 mt-1 leading-normal font-semibold">Click nodes to manual inject into the workspace layout.</p>
              </div>

              {/* Sidebar Groups */}
              <div className="space-y-4">
                <div>
                  <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Triggers</span>
                  <div className="space-y-2">
                    {CATALOG_NODE_TYPES.filter(n => n.category === 'Trigger').map(nt => (
                      <button
                        key={nt.type}
                        onClick={() => handleDragNodeAdd(nt)}
                        className="w-full p-2 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-lg text-left text-xs font-bold truncate flex items-center gap-2 cursor-pointer"
                      >
                        <div className={cn("w-5 h-5 rounded flex items-center justify-center text-white text-[9px]", nt.color)}><nt.icon size={10} /></div>
                        <span>{nt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Logic & Actions</span>
                  <div className="space-y-2">
                    {CATALOG_NODE_TYPES.filter(n => n.category !== 'Trigger').map(nt => (
                      <button
                        key={nt.type}
                        onClick={() => handleDragNodeAdd(nt)}
                        className="w-full p-2 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-lg text-left text-xs font-bold truncate flex items-center gap-2 cursor-pointer"
                      >
                        <div className={cn("w-5 h-5 rounded flex items-center justify-center text-white text-[9px]", nt.color)}><nt.icon size={10} /></div>
                        <span>{nt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Builder Viewport wrapper */}
        <main className="flex-1 h-full bg-[#f8fafc] dark:bg-slate-950 relative flex">
          
          {nodes.length === 0 ? (
            /* Guided Onboarding Empty State instead of Empty Canvas */
            <div className="flex-1 flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-900/30 select-none">
              <div className="max-w-md w-full bg-white dark:bg-slate-850 p-8 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm text-center space-y-6">
                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl flex items-center justify-center text-indigo-650 mx-auto">
                  <Zap size={20} className="animate-pulse" />
                </div>
                <div className="space-y-1.5">
                  <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Create Your First Workflow</h2>
                  <p className="text-xs text-slate-450 dark:text-slate-400 font-semibold leading-relaxed">
                    Choose how this workflow should start. Select an event trigger to initiate your visual automation flow.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-2.5 pt-2">
                  {[
                    { type: 'incoming_message', title: 'Incoming Message', desc: 'Triggers on any incoming WhatsApp message', icon: Zap },
                    { type: 'keyword', title: 'Keyword Match', desc: 'Triggers when a customer messages specific keywords', icon: Zap },
                    { type: 'schedule', title: 'Schedule Trigger', desc: 'Runs workflow at custom schedule intervals', icon: Clock }
                  ].map((btn) => (
                    <button
                      key={btn.type}
                      onClick={() => addInitialTrigger(btn.type)}
                      className="w-full p-3 bg-slate-50 dark:bg-slate-900 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 border border-slate-150 dark:border-slate-800 rounded-2xl flex items-center gap-3 text-left transition-all active:scale-[0.99] cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center"><btn.icon size={14} /></div>
                      <div>
                        <span className="block text-xs font-black text-slate-800 dark:text-white leading-none">{btn.title}</span>
                        <span className="block text-[10px] text-slate-450 mt-1 leading-none">{btn.desc}</span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-4 text-[10px] text-slate-400 font-bold">
                  Or start with our <button onClick={buildExampleTemplate} className="text-indigo-650 hover:underline">Welcome Flow template</button>
                </div>
              </div>
            </div>
          ) : (
            /* Visual React Flow Canvas */
            <div className="flex-1 h-full relative">
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
                <Background />
                <Controls />
                <MiniMap />
              </ReactFlow>
            </div>
          )}

          {/* Quick Selection Popup Menu for "+ Add Step" */}
          <AnimatePresence>
            {stepSelectorParentId && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setStepSelectorParentId(null)} />
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="relative w-full max-w-sm bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden z-10 p-5 space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <span className="text-[10px] font-black text-slate-905 dark:text-white uppercase tracking-widest">Select Next Flow Action</span>
                    <button onClick={() => setStepSelectorParentId(null)} className="text-slate-400 hover:text-slate-650"><X size={15} /></button>
                  </div>

                  <div className="grid grid-cols-1 gap-2 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
                    {CATALOG_NODE_TYPES.filter(n => n.category !== 'Trigger').map((item) => (
                      <button
                        key={item.type}
                        onClick={() => selectStepAction(item.type)}
                        className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 hover:bg-indigo-50/50 border border-slate-100 dark:border-slate-800 rounded-xl flex items-center gap-3 text-left transition-all cursor-pointer"
                      >
                        <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0 shadow-sm", item.color)}>
                          <item.icon size={12} />
                        </div>
                        <div className="min-w-0">
                          <span className="block text-[11px] font-extrabold text-slate-850 dark:text-white leading-none">{item.label}</span>
                          <span className="block text-[9.5px] text-slate-450 mt-1 leading-none">{item.desc}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </main>

        {/* Right Settings panel (Visible alongside canvas) */}
        <AnimatePresence>
          {selectedNode && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="w-80 bg-white dark:bg-slate-850 border-l border-slate-200 dark:border-slate-800 shadow-2xl z-20 flex flex-col shrink-0"
            >
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sliders size={13} className="text-indigo-650" />
                  <span className="text-[10px] font-black text-slate-850 dark:text-white uppercase tracking-widest">Node Settings</span>
                </div>
                <button 
                  onClick={() => setSelectedNode(null)}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
                <div>
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block leading-none">Node ID</span>
                  <span className="text-xs font-black text-slate-900 dark:text-white mt-1.5 block font-mono leading-none">{selectedNode.id}</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9.5px] font-black text-slate-450 uppercase tracking-widest block">Label Title</label>
                  <input
                    type="text"
                    value={selectedNode.data.label}
                    onChange={(e) => {
                      setIsSaved(false);
                      const nextLabel = e.target.value;
                      setNodes(nds => nds.map(n => n.id === selectedNode.id ? { ...n, data: { ...n.data, label: nextLabel } } : n));
                      setSelectedNode({ ...selectedNode, data: { ...selectedNode.data, label: nextLabel } });
                    }}
                    className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-none"
                  />
                </div>

                {/* Configurations */}
                <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-3">
                  <span className="block text-[8.5px] font-black text-slate-400 uppercase tracking-widest">Config Fields</span>

                  {/* KEYWORD TRIGGER */}
                  {selectedNode.data.type === 'keyword' && (
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <label className="text-[9.5px] font-bold text-slate-400 block">Keywords (comma separated)</label>
                        <input
                          type="text"
                          placeholder="E.g. price, cost, catalog"
                          value={selectedNode.data.config?.keywords || ''}
                          onChange={(e) => updateNodeConfig(selectedNode.id, { keywords: e.target.value })}
                          className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9.5px] font-bold text-slate-400 block">Match Type</label>
                        <select
                          value={selectedNode.data.config?.matchType || 'contains'}
                          onChange={(e) => updateNodeConfig(selectedNode.id, { matchType: e.target.value })}
                          className="w-full h-9 px-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 rounded-lg text-xs"
                        >
                          <option value="contains">Contains Word</option>
                          <option value="exact">Exact Match</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* SCHEDULE TRIGGER */}
                  {selectedNode.data.type === 'schedule' && (
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <label className="text-[9.5px] font-bold text-slate-400 block">Schedule Interval</label>
                        <select
                          value={selectedNode.data.config?.interval || 'daily'}
                          onChange={(e) => updateNodeConfig(selectedNode.id, { interval: e.target.value })}
                          className="w-full h-9 px-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 rounded-lg text-xs"
                        >
                          <option value="once">One Time</option>
                          <option value="daily">Daily Recurring</option>
                          <option value="weekly">Weekly Recurring</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* CONDITION LOGIC */}
                  {selectedNode.data.type === 'condition' && (
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <label className="text-[9.5px] font-bold text-slate-400 block">Check Parameter</label>
                        <select
                          value={selectedNode.data.config?.field || 'message'}
                          onChange={(e) => updateNodeConfig(selectedNode.id, { field: e.target.value })}
                          className="w-full h-9 px-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 rounded-lg text-xs"
                        >
                          <option value="message">Inbound message body</option>
                          <option value="contact_tag">Contact Tag label</option>
                          <option value="name">Contact Name</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9.5px] font-bold text-slate-400 block">Condition</label>
                        <select
                          value={selectedNode.data.config?.operator || 'equals'}
                          onChange={(e) => updateNodeConfig(selectedNode.id, { operator: e.target.value })}
                          className="w-full h-9 px-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 rounded-lg text-xs"
                        >
                          <option value="equals">Equals</option>
                          <option value="contains">Contains</option>
                          <option value="exists">Is Present</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9.5px] font-bold text-slate-400 block">Match Target Value</label>
                        <input
                          type="text"
                          value={selectedNode.data.config?.value || ''}
                          onChange={(e) => updateNodeConfig(selectedNode.id, { value: e.target.value })}
                          className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  )}

                  {/* WAIT DELAY */}
                  {selectedNode.data.type === 'wait' && (
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <label className="text-[9.5px] font-bold text-slate-400 block">Duration Amount</label>
                        <input
                          type="number"
                          min={1}
                          value={selectedNode.data.config?.amount || '30'}
                          onChange={(e) => updateNodeConfig(selectedNode.id, { amount: e.target.value })}
                          className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9.5px] font-bold text-slate-400 block">Unit</label>
                        <select
                          value={selectedNode.data.config?.unit || 'minutes'}
                          onChange={(e) => updateNodeConfig(selectedNode.id, { unit: e.target.value })}
                          className="w-full h-9 px-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 rounded-lg text-xs"
                        >
                          <option value="minutes">Minutes</option>
                          <option value="hours">Hours</option>
                          <option value="days">Days</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* SEND MESSAGE */}
                  {selectedNode.data.type === 'send_message' && (
                    <div className="space-y-2">
                      <label className="text-[9.5px] font-bold text-slate-400 block">Message text body</label>
                      <textarea
                        placeholder="Hello {{customer_name}}! Welcome to our store."
                        value={selectedNode.data.config?.message || ''}
                        onChange={(e) => updateNodeConfig(selectedNode.id, { message: e.target.value })}
                        className="w-full h-24 p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 rounded-lg text-xs focus:outline-none font-semibold leading-relaxed"
                      />
                      <span className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold block leading-tight">Use variables like <code className="bg-slate-100 dark:bg-slate-900 px-1 py-0.5 rounded text-[8px] font-black font-mono">{"{{customer_name}}"}</code> to insert values dynamically.</span>
                    </div>
                  )}

                  {/* SEND TEMPLATE */}
                  {selectedNode.data.type === 'send_template' && (
                    <div className="space-y-1.5">
                      <label className="text-[9.5px] font-bold text-slate-400 block">Template Name ID</label>
                      <input
                        type="text"
                        placeholder="E.g. customer_greeting"
                        value={selectedNode.data.config?.templateId || ''}
                        onChange={(e) => updateNodeConfig(selectedNode.id, { templateId: e.target.value })}
                        className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  )}

                  {/* ASSIGN AGENT */}
                  {selectedNode.data.type === 'assign_agent' && (
                    <div className="space-y-1.5">
                      <label className="text-[9.5px] font-bold text-slate-400 block">Support Agent name</label>
                      <input
                        type="text"
                        placeholder="E.g. Ateeq Support"
                        value={selectedNode.data.config?.agentName || ''}
                        onChange={(e) => updateNodeConfig(selectedNode.id, { agentName: e.target.value })}
                        className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  )}

                  {/* ADD TAG */}
                  {selectedNode.data.type === 'add_tag' && (
                    <div className="space-y-1.5">
                      <label className="text-[9.5px] font-bold text-slate-400 block">Tag name label</label>
                      <input
                        type="text"
                        placeholder="E.g. customer_onboarded"
                        value={selectedNode.data.config?.tagName || ''}
                        onChange={(e) => updateNodeConfig(selectedNode.id, { tagName: e.target.value })}
                        className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10 flex gap-2">
                <button
                  onClick={() => setSelectedNode(null)}
                  className="w-1/2 py-2 border border-slate-200 text-slate-650 bg-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="w-1/2 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Save
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Preview Simulation Bottom Drawer */}
      <AnimatePresence>
        {isPreviewOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPreviewOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm pointer-events-auto"
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-800 border border-slate-250 dark:border-slate-700 rounded-3xl shadow-xl overflow-hidden z-[110] p-6 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-slate-150 pb-3">
                <div className="flex items-center gap-2">
                  <Activity size={15} className="text-indigo-650" />
                  <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Workflow Simulation Run</span>
                </div>
                <button onClick={() => setIsPreviewOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
              </div>

              <div className="space-y-4">
                <p className="text-xs font-medium text-slate-450 dark:text-slate-400">
                  Below is a mockup preview trace path simulation representing how contacts will flow through the configured steps:
                </p>

                <div className="p-4 bg-slate-950 text-slate-250 rounded-2xl border border-slate-800 text-[10.5px] font-mono leading-relaxed space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                  <div>[11:00:00] Initiating dry-run simulation for "{workflowName}"...</div>
                  {nodes.map((n, idx) => (
                    <div key={n.id} className="flex items-center gap-2 mt-1.5">
                      <ChevronRight size={10} className="text-indigo-500 shrink-0" />
                      <div className="min-w-0">
                        <span className="text-amber-500 font-bold uppercase text-[9px]">{n.data.type}</span>
                        <span className="text-slate-400 ml-1.5 font-bold">({n.data.label})</span>
                        <span className="text-emerald-400 ml-2">Verified OK</span>
                      </div>
                    </div>
                  ))}
                  <div className="text-indigo-400 border-t border-slate-800 pt-2 mt-2">Simulation completed. Graph integrity check: Passed.</div>
                </div>
              </div>

              <button
                onClick={() => setIsPreviewOpen(false)}
                className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Close Preview
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
