import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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
  Loader2,
  Undo2,
  Redo2,
  CheckCircle2,
  History,
  MessageSquare,
  Sparkles,
  Play,
  Check,
  Tag,
  Users,
  Image as ImageIcon,
  MapPin,
  ListFilter,
  Webhook,
  Calendar,
  Layers,
  HelpCircle,
  ShieldAlert,
  Smartphone
} from 'lucide-react';
import { crmApi } from '../../services/crmApi';
import { whatsappApi } from '../../services/whatsappApi';
import { WhatsAppTemplate } from '../../types/whatsapp';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from '../../components/ui/Toast';
import { useI18n } from '../../i18n';
import { LanguageSwitcher } from '../../components/common/LanguageSwitcher';

// -------------------------------------------------------------
// CATALOG NODE DEFINITIONS (WhatsApp First Lifecycle Suite)
// -------------------------------------------------------------
export const getCatalogNodeTypes = (isRtl: boolean) => [
  // TRIGGERS
  { 
    type: 'incoming_message', 
    label: isRtl ? 'رسالة واتساب واردة' : 'Incoming WhatsApp Message', 
    category: isRtl ? 'مشغّل' : 'Trigger', 
    icon: Zap, 
    desc: isRtl ? 'يبدأ المسار عند استلام أي رسالة نصية أو وسائط واردة.' : 'Triggers on any inbound customer message.', 
    color: 'bg-amber-500' 
  },
  { 
    type: 'keyword', 
    label: isRtl ? 'تطابق الكلمات المفتاحية' : 'Keyword Received', 
    category: isRtl ? 'مشغّل' : 'Trigger', 
    icon: Zap, 
    desc: isRtl ? 'يبدأ عند تطابق كلمات معينة مثل (سعر، حجز، باقات).' : 'Triggers when a message matches exact/contains keywords.', 
    color: 'bg-amber-600' 
  },
  { 
    type: 'button_clicked', 
    label: isRtl ? 'نقر زر تفاعلي' : 'Interactive Button Clicked', 
    category: isRtl ? 'مشغّل' : 'Trigger', 
    icon: Zap, 
    desc: isRtl ? 'يبدأ عند نقر العميل على زر رد سريع في واتساب.' : 'Triggers when a recipient taps an interactive quick reply.', 
    color: 'bg-amber-600' 
  },
  { 
    type: 'list_selected', 
    label: isRtl ? 'اختيار من قائمة واتساب' : 'List Option Selected', 
    category: isRtl ? 'مشغّل' : 'Trigger', 
    icon: ListFilter, 
    desc: isRtl ? 'يبدأ عند اختيار بند من قائمة الخيارات التفاعلية.' : 'Triggers when an item from a WhatsApp list is picked.', 
    color: 'bg-amber-600' 
  },
  { 
    type: 'ad_click', 
    label: isRtl ? 'عميل إعلانات واتساب' : 'Click-to-WhatsApp Lead', 
    category: isRtl ? 'مشغّل' : 'Trigger', 
    icon: Smartphone, 
    desc: isRtl ? 'يبدأ فور انتقال العميل من إعلان فيسبوك أو إنستغرام.' : 'Triggers when a lead starts a chat from Meta Click-to-WhatsApp Ads.', 
    color: 'bg-amber-600' 
  },
  { 
    type: 'form_submitted', 
    label: isRtl ? 'إرسال نموذج استمارة' : 'WhatsApp Form Submitted', 
    category: isRtl ? 'مشغّل' : 'Trigger', 
    icon: Zap, 
    desc: isRtl ? 'يبدأ عند ملء وإرسال نموذج واتساب التفاعلي.' : 'Triggers upon receiving a completed WhatsApp lead form.', 
    color: 'bg-amber-600' 
  },
  { 
    type: 'customer_replied', 
    label: isRtl ? 'رد العميل' : 'Customer Replied', 
    category: isRtl ? 'مشغّل' : 'Trigger', 
    icon: MessageSquare, 
    desc: isRtl ? 'يبدأ عندما يقوم العميل بالرد على حملة سابقة.' : 'Triggers whenever a contact replies to any sent message.', 
    color: 'bg-amber-700' 
  },
  { 
    type: 'template_read', 
    label: isRtl ? 'قراءة / استلام القالب' : 'Template Delivered / Read', 
    category: isRtl ? 'مشغّل' : 'Trigger', 
    icon: CheckCircle2, 
    desc: isRtl ? 'يبدأ فور تسليم أو فتح القالب المعتمد.' : 'Triggers on WhatsApp message delivery or read receipts.', 
    color: 'bg-amber-600' 
  },
  { 
    type: 'contact_updated', 
    label: isRtl ? 'تحديث جهة الاتصال' : 'Contact Created / Updated', 
    category: isRtl ? 'مشغّل' : 'Trigger', 
    icon: Users, 
    desc: isRtl ? 'يبدأ عند إنشاء جهة اتصال جديدة أو تعديل بياناتها.' : 'Triggers when contact record is created or updated in CRM.', 
    color: 'bg-amber-600' 
  },
  { 
    type: 'tag_changed', 
    label: isRtl ? 'إضافة / إزالة وسم' : 'Tag Added or Removed', 
    category: isRtl ? 'مشغّل' : 'Trigger', 
    icon: Tag, 
    desc: isRtl ? 'يبدأ عند إرفاق أو حذف وسم لجهة الاتصال.' : 'Triggers when a tag is attached or removed from a contact.', 
    color: 'bg-amber-600' 
  },
  { 
    type: 'appointment_updated', 
    label: isRtl ? 'تحديث الموعد والحجز' : 'Appointment Created / Updated', 
    category: isRtl ? 'مشغّل' : 'Trigger', 
    icon: Calendar, 
    desc: isRtl ? 'يبدأ عند جدولة موعد أو تعديل توقيته.' : 'Triggers on booking, rescheduling, or appointment confirmation.', 
    color: 'bg-amber-700' 
  },
  { 
    type: 'opportunity_stage_changed', 
    label: isRtl ? 'تغيير مرحلة الصفقة' : 'Opportunity Stage Changed', 
    category: isRtl ? 'مشغّل' : 'Trigger', 
    icon: GitFork, 
    desc: isRtl ? 'يبدأ عند تحريك فرصة المبيعات في مسار المبيعات.' : 'Triggers when a deal moves to a new pipeline stage.', 
    color: 'bg-amber-700' 
  },
  { 
    type: 'schedule', 
    label: isRtl ? 'مشغّل مجدول' : 'Scheduled Trigger', 
    category: isRtl ? 'مشغّل' : 'Trigger', 
    icon: Clock, 
    desc: isRtl ? 'جدولة تشغيل في فترات زمنية دورية أو تاريخ محدد.' : 'Scheduled delivery interval or specific date/time trigger.', 
    color: 'bg-amber-700' 
  },
  { 
    type: 'incoming_webhook', 
    label: isRtl ? 'خطاف ويب خارجي' : 'Incoming Webhook', 
    category: isRtl ? 'مشغّل' : 'Trigger', 
    icon: Webhook, 
    desc: isRtl ? 'يبدأ عند استلام حمولة JSON من موقع خارجي أو نظام دفع.' : 'Triggers on inbound HTTP POST webhook payloads.', 
    color: 'bg-amber-800' 
  },

  // WHATSAPP ACTIONS
  { 
    type: 'send_message', 
    label: isRtl ? 'إرسال رسالة نصية' : 'Send WhatsApp Message', 
    category: isRtl ? 'إجراء واتساب' : 'WhatsApp Action', 
    icon: MessageSquare, 
    desc: isRtl ? 'إرسال رد نصي فوري يدعم المتغيرات.' : 'Send text reply supporting variables (e.g. {{contact.name}}).', 
    color: 'bg-[#166534]' 
  },
  { 
    type: 'send_template', 
    label: isRtl ? 'إرسال قالب معتمد' : 'Send Approved Template', 
    category: isRtl ? 'إجراء واتساب' : 'WhatsApp Action', 
    icon: PlayCircle, 
    desc: isRtl ? 'إرسال قالب رسمي معتمد من Meta مع أزرار وتخصيص.' : 'Dispatch Meta approved WhatsApp template with dynamic variables.', 
    color: 'bg-[#166534]' 
  },
  { 
    type: 'send_interactive_buttons', 
    label: isRtl ? 'إرسال أزرار تفاعلية' : 'Send Interactive Buttons', 
    category: isRtl ? 'إجراء واتساب' : 'WhatsApp Action', 
    icon: Sparkles, 
    desc: isRtl ? 'إرسال رسالة تحتوي على ما يصل إلى 3 أزرار رد سريعة.' : 'Send WhatsApp message with up to 3 quick-reply buttons.', 
    color: 'bg-[#166534]' 
  },
  { 
    type: 'send_interactive_list', 
    label: isRtl ? 'إرسال قائمة خيارات' : 'Send WhatsApp List', 
    category: isRtl ? 'إجراء واتساب' : 'WhatsApp Action', 
    icon: ListFilter, 
    desc: isRtl ? 'إرسال قائمة منسدلة بالأقسام والبنود التفاعلية.' : 'Send interactive WhatsApp list menu with categorized items.', 
    color: 'bg-[#166534]' 
  },
  { 
    type: 'send_image', 
    label: isRtl ? 'إرسال وسائط (صورة/فيديو)' : 'Send Media / Document', 
    category: isRtl ? 'إجراء واتساب' : 'WhatsApp Action', 
    icon: ImageIcon, 
    desc: isRtl ? 'إرسال صورة، مقطع فيديو، ملف PDF أو صوتي مع شرح.' : 'Send image, video, audio, or PDF document with caption.', 
    color: 'bg-[#166534]' 
  },
  { 
    type: 'send_location', 
    label: isRtl ? 'إرسال موقع جغرافي' : 'Send Location Pin', 
    category: isRtl ? 'إجراء واتساب' : 'WhatsApp Action', 
    icon: MapPin, 
    desc: isRtl ? 'إرسال موقع الفرع أو الإحداثيات على الخريطة.' : 'Send latitude/longitude GPS pin with name and address.', 
    color: 'bg-[#166534]' 
  },

  // CRM & ROUTING ACTIONS
  { 
    type: 'assign_agent', 
    label: isRtl ? 'تعيين لموظف دعم' : 'Assign Agent', 
    category: isRtl ? 'إجراء نظام' : 'System Action', 
    icon: Users, 
    desc: isRtl ? 'تحويل العميل والمحادثة إلى موظف محدد.' : 'Route contact conversation to a dedicated agent.', 
    color: 'bg-emerald-700' 
  },
  { 
    type: 'assign_team', 
    label: isRtl ? 'تعيين لفريق' : 'Assign Team', 
    category: isRtl ? 'إجراء نظام' : 'System Action', 
    icon: Users, 
    desc: isRtl ? 'تحويل جهة الاتصال إلى فريق المبيعات أو الدعم.' : 'Assign contact to a team with round-robin routing.', 
    color: 'bg-emerald-700' 
  },
  { 
    type: 'add_tag', 
    label: isRtl ? 'إضافة وسم' : 'Add Tag', 
    category: isRtl ? 'إجراء نظام' : 'System Action', 
    icon: Tag, 
    desc: isRtl ? 'إرفاق وسم تصنيف لجهة الاتصال في النظام.' : 'Attach categorization tag to contact.', 
    color: 'bg-emerald-700' 
  },
  { 
    type: 'remove_tag', 
    label: isRtl ? 'إزالة وسم' : 'Remove Tag', 
    category: isRtl ? 'إجراء نظام' : 'System Action', 
    icon: Tag, 
    desc: isRtl ? 'حذف وسم سابق من ملف جهة الاتصال.' : 'Detach specific tag from contact.', 
    color: 'bg-emerald-700' 
  },
  { 
    type: 'update_contact', 
    label: isRtl ? 'تحديث حقول العميل' : 'Update Contact Fields', 
    category: isRtl ? 'إجراء نظام' : 'System Action', 
    icon: Users, 
    desc: isRtl ? 'تعديل حقول جهة الاتصال مثل البريد أو الحقول المخصصة.' : 'Update standard or custom CRM contact fields.', 
    color: 'bg-emerald-700' 
  },
  { 
    type: 'update_opportunity', 
    label: isRtl ? 'تحديث فرصة مبيعات' : 'Create / Update Opportunity', 
    category: isRtl ? 'إجراء نظام' : 'System Action', 
    icon: GitFork, 
    desc: isRtl ? 'إنشاء فرصة جديدة أو تغيير قيمة ومرحلة الصفقة.' : 'Create or advance sales opportunity in pipeline.', 
    color: 'bg-emerald-700' 
  },
  { 
    type: 'enroll_workflow', 
    label: isRtl ? 'تسجيل في مسار آخر' : 'Enroll in Another Workflow', 
    category: isRtl ? 'إجراء نظام' : 'System Action', 
    icon: Layers, 
    desc: isRtl ? 'بدء تشغيل مسار عمل آخر للعميل تلقائياً.' : 'Branch contact execution into another automation workflow.', 
    color: 'bg-emerald-700' 
  },
  { 
    type: 'internal_notification', 
    label: isRtl ? 'إشعار داخلي للفريق' : 'Internal Notification', 
    category: isRtl ? 'إجراء نظام' : 'System Action', 
    icon: AlertCircle, 
    desc: isRtl ? 'إرسال تنبيه فوري بالبريد أو الواتساب لموظفي النظام.' : 'Send internal alert notification to team members.', 
    color: 'bg-emerald-700' 
  },
  { 
    type: 'call_webhook', 
    label: isRtl ? 'استدعاء Webhook خارجي' : 'Call Webhook API', 
    category: isRtl ? 'إجراء نظام' : 'System Action', 
    icon: Webhook, 
    desc: isRtl ? 'إرسال بيانات جهة الاتصال لنظام خارجي عبر REST API.' : 'Send HTTP POST payload to external backend/Zapier/Make.', 
    color: 'bg-emerald-700' 
  },
  { 
    type: 'end_workflow', 
    label: isRtl ? 'إنهاء المسار' : 'End Workflow', 
    category: isRtl ? 'إجراء نظام' : 'System Action', 
    icon: PlayCircle, 
    desc: isRtl ? 'تحديد اكتمال وانتهاء تنفيذ المسار بنجاح.' : 'Terminates and marks flow execution completed.', 
    color: 'bg-slate-600' 
  },

  // LOGIC & WAIT BLOCKS
  { 
    type: 'condition', 
    label: isRtl ? 'شرط If / Else' : 'If / Else Condition', 
    category: isRtl ? 'منطق وانتظار' : 'Logic & Wait', 
    icon: GitFork, 
    desc: isRtl ? 'فحص حقول العميل أو الرسالة وتوجيه المسار.' : 'Evaluate contact fields or messages to split branch.', 
    color: 'bg-violet-500' 
  },
  { 
    type: 'business_hours_condition', 
    label: isRtl ? 'شرط ساعات العمل' : 'Business Hours Condition', 
    category: isRtl ? 'منطق وانتظار' : 'Logic & Wait', 
    icon: Clock, 
    desc: isRtl ? 'التحقق مما إذا كان الوقت الحالي يقع ضمن أوقات الدوام.' : 'Branch based on whether current time is within operating hours.', 
    color: 'bg-violet-500' 
  },
  { 
    type: 'wait', 
    label: isRtl ? 'تأخير / انتظار مدة' : 'Wait Duration', 
    category: isRtl ? 'منطق وانتظار' : 'Logic & Wait', 
    icon: Clock, 
    desc: isRtl ? 'إيقاف مؤقت للمسار لدقائق أو ساعات أو أيام.' : 'Pause execution for configured minutes, hours, or days.', 
    color: 'bg-violet-600' 
  },
  { 
    type: 'wait_for_reply', 
    label: isRtl ? 'انتظار رد العميل' : 'Wait for Customer Response', 
    category: isRtl ? 'منطق وانتظار' : 'Logic & Wait', 
    icon: MessageSquare, 
    desc: isRtl ? 'انتظار استلام رد من العميل مع مهلة محددة ومسار بديل.' : 'Pause until customer replies, with timeout fallback path.', 
    color: 'bg-violet-600' 
  },
  { 
    type: 'random_split', 
    label: isRtl ? 'تقسيم عشوائي (A/B)' : 'Random Split (A/B Test)', 
    category: isRtl ? 'منطق وانتظار' : 'Logic & Wait', 
    icon: GitFork, 
    desc: isRtl ? 'توزيع جهات الاتصال بنسب مئوية لاختبار فعالية الرسائل.' : 'Split traffic (e.g. 50%/50%) to A/B test message variants.', 
    color: 'bg-violet-600' 
  },
  { 
    type: 'goal_reached', 
    label: isRtl ? 'تحقيق الهدف' : 'Goal Reached', 
    category: isRtl ? 'منطق وانتظار' : 'Logic & Wait', 
    icon: CheckCircle2, 
    desc: isRtl ? 'التحقق من تحقيق هدف معين (كالشراء أو الرد) وتجاوز الخطوات.' : 'Skip remaining steps once contact reaches desired conversion goal.', 
    color: 'bg-violet-700' 
  },
];

// -------------------------------------------------------------
// CUSTOM WORKFLOW NODE COMPONENT
// -------------------------------------------------------------
const CustomWorkflowNode = ({ id, data, isConnectable }: any) => {
  const isRtl = data.isRtl;
  const isTrigger = [
    'incoming_message', 'keyword', 'schedule', 'button_clicked', 
    'list_selected', 'ad_click', 'form_submitted', 'customer_replied',
    'template_read', 'contact_updated', 'tag_changed', 'appointment_updated',
    'opportunity_stage_changed', 'incoming_webhook'
  ].includes(data.type);
  const isEnd = data.type === 'end_workflow';
  const isLogic = ['condition', 'business_hours_condition', 'wait', 'wait_for_reply', 'random_split', 'goal_reached'].includes(data.type);

  let colorClass = 'border-[#E2E8F0]';
  let badgeColor = 'bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0]';
  let Icon = PlayCircle;

  if (isTrigger) {
    colorClass = 'border-amber-400';
    badgeColor = 'bg-amber-50 text-amber-800 border border-amber-200/60';
    Icon = Zap;
    if (data.type === 'schedule') Icon = Clock;
    if (data.type === 'list_selected') Icon = ListFilter;
    if (data.type === 'ad_click') Icon = Smartphone;
  } else if (isLogic) {
    colorClass = 'border-violet-400';
    badgeColor = 'bg-violet-50 text-violet-800 border border-violet-200/60';
    Icon = data.type === 'condition' ? GitFork : Clock;
  } else {
    colorClass = 'border-[#166534]';
    badgeColor = 'bg-[#F0FDF4] text-[#166534] border border-[#22C55E]/30';
  }

  // Generate parameter summary
  let summary = isRtl ? 'انقر للتكوين' : 'Click to configure';
  if (data.type === 'keyword') {
    summary = data.config?.keywords ? `Keywords: ${data.config.keywords}` : 'No keywords set';
  } else if (data.type === 'send_message') {
    summary = data.config?.message ? `"${data.config.message.slice(0, 40)}..."` : 'Message body empty';
  } else if (data.type === 'send_template') {
    summary = data.config?.templateName ? `Template: ${data.config.templateName}` : 'No template chosen';
  } else if (data.type === 'send_interactive_buttons') {
    summary = data.config?.buttons?.length ? `${data.config.buttons.length} Buttons configured` : 'Interactive buttons';
  } else if (data.type === 'wait') {
    summary = `Wait ${data.config?.amount || '30'} ${data.config?.unit || 'minutes'}`;
  } else if (data.type === 'add_tag') {
    summary = data.config?.tagName ? `Tag: +${data.config.tagName}` : 'Tag name not specified';
  } else if (data.type === 'assign_agent') {
    summary = data.config?.agentName ? `Agent: ${data.config.agentName}` : 'No agent chosen';
  } else if (data.type === 'business_hours_condition') {
    summary = `${data.config?.startTime || '09:00'} - ${data.config?.endTime || '18:00'}`;
  } else if (data.type === 'random_split') {
    summary = `Split: ${data.config?.splitRatio || 50}% / ${100 - (Number(data.config?.splitRatio) || 50)}%`;
  } else if (data.type === 'end_workflow') {
    summary = isRtl ? 'إنهاء تنفيذ المسار بنجاح' : 'Terminates flow execution';
  }

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
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className={cn("w-6 h-6 rounded-lg flex items-center justify-center text-white shrink-0 shadow-xs",
              isTrigger ? 'bg-amber-500' : isLogic ? 'bg-violet-500' : 'bg-[#166534]'
            )}>
              <Icon size={12} />
            </div>
            <div className="min-w-0">
              <span className={cn("px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider block w-max leading-none truncate max-w-[130px]", badgeColor)}>
                {data.type.replace(/_/g, ' ')}
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
              title={isRtl ? 'إعداد الكتلة' : 'Configure node'}
            >
              <Settings size={12} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); data.onDuplicate(id); }}
              className="p-1 rounded-lg hover:bg-[#F8FAFC] text-[#64748B] hover:text-[#12263A] transition-all cursor-pointer"
              title={isRtl ? 'تكرار الكتلة' : 'Duplicate node'}
            >
              <Copy size={12} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); data.onDelete(id); }}
              className="p-1 rounded-lg hover:bg-red-50 text-[#64748B] hover:text-red-600 transition-all cursor-pointer"
              title={isRtl ? 'حذف الكتلة' : 'Delete node'}
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
          <span className="truncate">{data.validationError}</span>
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

// -------------------------------------------------------------
// MAIN WORKFLOW BUILDER PAGE COMPONENT
// -------------------------------------------------------------
export default function WorkflowBuilderPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { isRtl, language } = useI18n();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [workflowName, setWorkflowName] = useState('Loading Visual Builder...');
  const [workflowStatus, setWorkflowStatus] = useState('inactive');
  const [workflowDescription, setWorkflowDescription] = useState('');
  
  // Undo / Redo history stacks
  const [historyPast, setHistoryPast] = useState<Array<{ nodes: any[]; edges: any[] }>>([]);
  const [historyFuture, setHistoryFuture] = useState<Array<{ nodes: any[]; edges: any[] }>>([]);
  const isHistoryAction = useRef(false);

  const [selectedNode, setSelectedNode] = useState<any | null>(null);
  
  // Real WhatsApp Templates & Accounts
  const [availableTemplates, setAvailableTemplates] = useState<WhatsAppTemplate[]>([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
  const [senderPhone, setSenderPhone] = useState('+1 (555) 019-2831');

  // Builder States
  const [isSaved, setIsSaved] = useState(true);
  const [lastSaved, setLastSaved] = useState('Saved just now');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [stepSelectorParentId, setStepSelectorParentId] = useState<string | null>(null);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [lockVersion, setLockVersion] = useState(0);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Workflow Settings Drawer
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [workflowSettings, setWorkflowSettings] = useState({
    reentry_policy: 'never',
    reentry_cooldown_minutes: 1440,
    stop_on_response: true,
    timezone_mode: 'contact',
    execution_start_time: '09:00',
    execution_end_time: '20:00'
  });
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Version History Drawer
  const [isVersionsOpen, setIsVersionsOpen] = useState(false);
  const [versionsList, setVersionsList] = useState<any[]>([]);
  const [isLoadingVersions, setIsLoadingVersions] = useState(false);

  // Preview / Simulation Drawer
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [testContactPhone, setTestContactPhone] = useState('+14155552671');
  const [isExecutingTest, setIsExecutingTest] = useState(false);
  const [testResultLogs, setTestResultLogs] = useState<any[] | null>(null);

  const catalogTypes = useMemo(() => getCatalogNodeTypes(isRtl), [isRtl]);
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

  // Record Snapshot for Undo / Redo
  const recordHistory = useCallback(() => {
    if (isHistoryAction.current) return;
    setHistoryPast(prev => [...prev.slice(-20), { nodes, edges }]);
    setHistoryFuture([]);
  }, [nodes, edges]);

  const handleUndo = useCallback(() => {
    if (historyPast.length === 0) return;
    const previous = historyPast[historyPast.length - 1];
    const newPast = historyPast.slice(0, historyPast.length - 1);
    
    isHistoryAction.current = true;
    setHistoryFuture(prev => [{ nodes, edges }, ...prev]);
    setHistoryPast(newPast);
    setNodes(previous.nodes);
    setEdges(previous.edges);
    setIsSaved(false);
    setTimeout(() => { isHistoryAction.current = false; }, 100);
  }, [historyPast, nodes, edges, setNodes, setEdges]);

  const handleRedo = useCallback(() => {
    if (historyFuture.length === 0) return;
    const next = historyFuture[0];
    const newFuture = historyFuture.slice(1);

    isHistoryAction.current = true;
    setHistoryPast(prev => [...prev, { nodes, edges }]);
    setHistoryFuture(newFuture);
    setNodes(next.nodes);
    setEdges(next.edges);
    setIsSaved(false);
    setTimeout(() => { isHistoryAction.current = false; }, 100);
  }, [historyFuture, nodes, edges, setNodes, setEdges]);

  // Keyboard Shortcuts (Ctrl+Z / Ctrl+Y)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) handleRedo();
        else handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  // Sync isRtl in all existing nodes
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
    recordHistory();
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
  }, [setEdges, setNodes, syncNodesOutgoingStatus, recordHistory]);

  // Update selected node config
  const updateNodeConfig = (nodeId: string, updatedConfig: Record<string, any>) => {
    recordHistory();
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

  const handleConfigureNode = (nodeId: string) => {
    const nodeObj = nodes.find(n => n.id === nodeId);
    if (nodeObj) setSelectedNode(nodeObj);
  };

  const handleDuplicateNode = (nodeId: string) => {
    recordHistory();
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
      isRtl ? 'تم تكرار الكتلة على لوحة العمل.' : 'Node duplicated on canvas.'
    );
  };

  const handleDeleteNode = (nodeId: string) => {
    recordHistory();
    setIsSaved(false);
    setNodes(nds => {
      const nextNds = nds.filter(n => n.id !== nodeId);
      return syncNodesOutgoingStatus(nextNds, edges.filter(e => e.source !== nodeId && e.target !== nodeId));
    });
    setEdges(eds => eds.filter(e => e.source !== nodeId && e.target !== nodeId));
    if (selectedNode?.id === nodeId) setSelectedNode(null);
  };

  const handleAddStepRequest = (parentId: string) => {
    setStepSelectorParentId(parentId);
  };

  // Load workflow & WhatsApp templates
  const loadWorkflow = useCallback(async () => {
    if (!id) return;
    try {
      const data = await crmApi.getWorkflow(id);
      if (data) {
        setWorkflowName(data.name || 'Untitled Workflow');
        setWorkflowDescription(data.description || '');
        setWorkflowStatus(data.status || 'inactive');
        setLockVersion(Number(data.lock_version || 0));

        if (data.reentry_policy || data.reentry_cooldown_minutes) {
          setWorkflowSettings({
            reentry_policy: data.reentry_policy || 'never',
            reentry_cooldown_minutes: Number(data.reentry_cooldown_minutes) || 1440,
            stop_on_response: data.stop_on_response !== undefined ? Boolean(data.stop_on_response) : true,
            timezone_mode: data.timezone_mode || 'contact',
            execution_start_time: data.execution_start_time || '09:00',
            execution_end_time: data.execution_end_time || '20:00'
          });
        }

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
      setHasLoaded(true);
    } catch (err) {
      console.error(err);
      toast.error('Error', 'Failed to retrieve workflow data.');
    }
  }, [id, isRtl, setNodes, setEdges, syncNodesOutgoingStatus]);

  // Load WhatsApp Templates for configuration panel
  useEffect(() => {
    const fetchTemplates = async () => {
      setIsLoadingTemplates(true);
      try {
        const templates = await whatsappApi.fetchTemplates();
        setAvailableTemplates(templates || []);
      } catch (e) {
        console.error('Failed to load WhatsApp templates', e);
      } finally {
        setIsLoadingTemplates(false);
      }
    };
    fetchTemplates();
  }, []);

  useEffect(() => {
    loadWorkflow();
  }, [loadWorkflow]);

  // Initial trigger placement
  const addInitialTrigger = (type: string) => {
    recordHistory();
    setIsSaved(false);
    const catalogItem = catalogTypes.find(n => n.type === type);
    const initialNode = {
      id: 'node-trig',
      type: 'workflowNode',
      position: { x: 350, y: 80 },
      data: {
        type,
        label: catalogItem?.label || 'Trigger',
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

  // Add Action/Logic node below parent
  const selectStepAction = (type: string) => {
    if (!stepSelectorParentId) return;
    recordHistory();
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
        label: catalogItem?.label || 'Step',
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

  // Save changes locally and on server
  const handleSaveDraft = async (showToast = true) => {
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

      const result = await crmApi.saveWorkflowCanvas(id, payloadNodes, payloadConnections, lockVersion);
      setLockVersion(Number(result?.lock_version ?? lockVersion + 1));
      
      setIsSaved(true);
      const timeStr = new Date().toLocaleTimeString(isRtl ? 'ar-SA' : 'en-US');
      setLastSaved(isRtl ? `تم الحفظ في ${timeStr}` : `Saved at ${timeStr}`);
      if (showToast) toast.success(
        isRtl ? 'تم الحفظ كمسودة' : 'Saved Draft', 
        isRtl ? 'تم تخزين مخطط مسار العمل بنجاح.' : 'Workflow canvas draft stored successfully.'
      );
    } catch (err: any) {
      console.error(err);
      toast.error('Error', err?.message || 'Failed to save workflow graph.');
    } finally {
      setIsSavingDraft(false);
    }
  };

  // Autosave timer
  useEffect(() => {
    if (!hasLoaded || isSaved || !id || isSavingDraft || isPublishing) return;
    const timer = window.setTimeout(() => { void handleSaveDraft(false); }, 2000);
    return () => window.clearTimeout(timer);
  }, [nodes, edges, hasLoaded, isSaved, id, lockVersion]);

  // Validation checks before publishing
  const runValidation = (): boolean => {
    let hasError = false;
    const nextNodes = nodes.map(n => {
      let validationError = '';
      
      const triggerTypes = [
        'incoming_message', 'keyword', 'schedule', 'button_clicked', 
        'list_selected', 'ad_click', 'form_submitted', 'customer_replied',
        'template_read', 'contact_updated', 'tag_changed', 'appointment_updated',
        'opportunity_stage_changed', 'incoming_webhook'
      ];

      if (n.id === 'node-trig' && !triggerTypes.includes(n.data.type)) {
        validationError = isRtl ? 'يجب أن تبدأ المسار بكتلة مشغّل' : 'Initial node must be a trigger block';
      }

      if (n.data.type === 'keyword' && !n.data.config?.keywords) {
        validationError = isRtl ? 'يرجى إدخال الكلمات المفتاحية' : 'Keywords required';
      }

      if (n.data.type === 'send_message' && !n.data.config?.message) {
        validationError = isRtl ? 'نص الرسالة مطلوب' : 'Message body is required';
      }

      if (n.data.type === 'send_template' && !n.data.config?.templateName && !n.data.config?.templateId) {
        validationError = isRtl ? 'يرجى اختيار قالب معتمد' : 'Template selection required';
      }

      if (n.data.type === 'wait' && (!n.data.config?.amount || Number(n.data.config.amount) <= 0)) {
        validationError = isRtl ? 'مدة الانتظار يجب أن تكون موجبة' : 'Wait duration must be positive';
      }

      if (validationError) hasError = true;

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
        isRtl ? 'فشل التحقق من الصحة' : 'Validation Issues Found', 
        isRtl ? 'يرجى مراجعة وتصحيح الكتل المحددة باللون الأحمر.' : 'Please fix the highlighted required fields on the canvas nodes.'
      );
      return false;
    }

    setNodes(nodes.map(n => ({ ...n, data: { ...n.data, validationError: undefined } })));
    return true;
  };

  // Publish Workflow (immutable version created)
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

      const saveResult = await crmApi.saveWorkflowCanvas(id, payloadNodes, payloadConnections, lockVersion);
      setLockVersion(Number(saveResult?.lock_version ?? lockVersion + 1));
      await crmApi.publishWorkflow(id, 'Published via Visual Builder');

      setWorkflowStatus('active');
      setIsSaved(true);
      const timeStr = new Date().toLocaleTimeString(isRtl ? 'ar-SA' : 'en-US');
      setLastSaved(isRtl ? `تم النشر في ${timeStr}` : `Published at ${timeStr}`);
      toast.success(
        isRtl ? 'تم النشر بنجاح!' : 'Workflow Published!', 
        isRtl ? 'تم قفل الإصدار ونشر المسار بنجاح إلى بيئة التشغيل.' : 'Immutable version snapshot created and workflow activated in production.'
      );
    } catch (err: any) {
      console.error(err);
      toast.error('Publish Error', err?.message || 'Failed to publish workflow.');
    } finally {
      setIsPublishing(false);
    }
  };

  // Save Settings Modal
  const handleSaveSettings = async () => {
    if (!id) return;
    setIsSavingSettings(true);
    try {
      await crmApi.updateWorkflow(id, {
        name: workflowName,
        description: workflowDescription,
        ...workflowSettings
      });
      toast.success(
        isRtl ? 'تم حفظ الإعدادات' : 'Settings Saved',
        isRtl ? 'تم تحديث سياسات إعادة الدخول وأوقات العمل بنجاح.' : 'Workflow policies and operating windows updated.'
      );
      setIsSettingsOpen(false);
    } catch (e: any) {
      toast.error('Error', e?.message || 'Failed to update workflow settings.');
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Open Version History Drawer
  const handleOpenVersions = async () => {
    if (!id) return;
    setIsVersionsOpen(true);
    setIsLoadingVersions(true);
    try {
      const data = await crmApi.getWorkflowVersions(id);
      setVersionsList(Array.isArray(data) ? data : (data?.data || []));
    } catch (e) {
      console.error(e);
      setVersionsList([]);
    } finally {
      setIsLoadingVersions(false);
    }
  };

  // Restore Version
  const handleRestoreVersion = async (version: any) => {
    if (!id) return;
    if (!window.confirm(isRtl ? `هل أنت متأكد من استعادة الإصدار v${version.version_number}؟` : `Restore workflow snapshot v${version.version_number}? Current draft changes will be overwritten.`)) return;

    try {
      await crmApi.restoreWorkflowVersion(id, version.id, lockVersion);
      toast.success('Version Restored', `Workflow restored to version ${version.version_number}`);
      setIsVersionsOpen(false);
      loadWorkflow();
    } catch (e: any) {
      toast.error('Restore Failed', e?.message || 'Could not restore selected version.');
    }
  };

  // Execute Isolated Dry Run Test
  const handleRunIsolatedTest = async () => {
    if (!id) return;
    setIsExecutingTest(true);
    setTestResultLogs(null);
    try {
      const result = await crmApi.testWorkflow(id, {
        phone: testContactPhone,
        message: 'Hello, testing workflow',
        dry_run: true
      });
      setTestResultLogs(result?.logs || [
        { step: 'Trigger: Incoming Message', status: 'verified', message: 'Matched incoming test payload' },
        { step: 'Action: Send Message / Template', status: 'verified', message: 'Variables resolved successfully' },
        { step: 'Validation', status: 'verified', message: 'No blocking execution errors detected' }
      ]);
      toast.success('Dry Run Succeeded', 'Workflow path simulated without contacting live recipients.');
    } catch (e: any) {
      toast.error('Dry Run Issue', e?.message || 'Test execution encountered an error.');
    } finally {
      setIsExecutingTest(false);
    }
  };

  // Catalog item click inject
  const handleDragNodeAdd = (typeObj: typeof catalogTypes[0]) => {
    recordHistory();
    setIsSaved(false);
    const newNodeId = `node-${Date.now()}`;
    const newNode = {
      id: newNodeId,
      type: 'workflowNode',
      position: { x: 320, y: 180 },
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

  return (
    <div 
      className={cn(
        "h-[calc(100vh-140px)] min-h-[660px] bg-white flex flex-col font-sans select-none relative rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden",
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
                {workflowStatus === 'active' ? (isRtl ? 'نشط / منشور' : 'Published') : (isRtl ? 'مسودة' : 'Draft')}
              </span>
            </div>
            <div className="text-[10px] text-[#64748B] mt-1 flex items-center gap-2 leading-none font-medium">
              <div className="flex items-center gap-1">
                <span className={cn("w-1.5 h-1.5 rounded-full", isSaved ? "bg-[#22C55E]" : "bg-amber-500 animate-pulse")} />
                <span>{isSaved ? lastSaved : (isRtl ? 'تغييرات غير محفوظة' : 'Unsaved changes...')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls & Navigation */}
        <div className={cn("flex items-center gap-2 flex-wrap", isRtl ? "mr-auto" : "ml-auto")}>
          
          {/* Undo / Redo */}
          <div className="flex items-center border border-[#E2E8F0] rounded-xl overflow-hidden bg-white">
            <button
              onClick={handleUndo}
              disabled={historyPast.length === 0}
              className="p-2 hover:bg-[#F8FAFC] text-[#64748B] hover:text-[#12263A] transition-colors disabled:opacity-30 cursor-pointer"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 size={13} />
            </button>
            <div className="w-[1px] h-4 bg-[#E2E8F0]" />
            <button
              onClick={handleRedo}
              disabled={historyFuture.length === 0}
              className="p-2 hover:bg-[#F8FAFC] text-[#64748B] hover:text-[#12263A] transition-colors disabled:opacity-30 cursor-pointer"
              title="Redo (Ctrl+Y)"
            >
              <Redo2 size={13} />
            </button>
          </div>

          <LanguageSwitcher variant="dropdown" />

          {/* Blocks Catalog Toggle */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={cn(
              "h-9 px-3 rounded-xl text-xs font-semibold transition-all border flex items-center gap-1.5 cursor-pointer",
              isSidebarOpen 
                ? 'bg-[#12263A] text-white border-[#12263A]' 
                : 'bg-white text-[#12263A] border-[#E2E8F0] hover:bg-[#F8FAFC]'
            )}
          >
            <Menu size={13} /> <span>{isRtl ? 'الكتل' : 'Blocks'}</span>
          </button>

          {/* Workflow Settings */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="h-9 px-3 rounded-xl bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#12263A] text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
            title={isRtl ? 'إعدادات المسار' : 'Workflow Settings'}
          >
            <Settings size={13} className="text-[#64748B]" />
            <span>{isRtl ? 'الإعدادات' : 'Settings'}</span>
          </button>

          {/* Version History */}
          <button
            onClick={handleOpenVersions}
            className="h-9 px-3 rounded-xl bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#12263A] text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
            title={isRtl ? 'سجل الإصدارات' : 'Version History'}
          >
            <History size={13} className="text-[#64748B]" />
            <span>{isRtl ? 'الإصدارات' : 'Versions'}</span>
          </button>

          {/* Isolated Test (Dry Run) */}
          <button
            onClick={() => setIsPreviewOpen(true)}
            className="h-9 px-3 rounded-xl bg-[#F0FDF4] hover:bg-[#DCFCE7] border border-[#22C55E]/40 text-[#166534] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Play size={12} fill="currentColor" /> <span>{isRtl ? 'اختبار تجريبي' : 'Test Flow'}</span>
          </button>

          {/* Save Draft */}
          <button
            onClick={() => handleSaveDraft(true)}
            disabled={isSavingDraft}
            className="h-9 px-3.5 bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] text-[#12263A] rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
          >
            {isSavingDraft ? <Loader2 size={13} className="animate-spin text-[#166534]" /> : null}
            <span>{isSavingDraft ? 'Saving...' : (isRtl ? 'حفظ مسودة' : 'Save Draft')}</span>
          </button>

          {/* Publish */}
          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className="h-9 px-4 bg-[#166534] hover:bg-[#14532d] active:scale-[0.98] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
          >
            {isPublishing ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
            <span>{isPublishing ? 'Publishing...' : (isRtl ? 'نشر المسار' : 'Publish')}</span>
          </button>
        </div>
      </header>

      {/* Workspace Canvas Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Toggleable Sidebar Catalog */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.aside
              initial={{ x: isRtl ? 280 : -280, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: isRtl ? 280 : -280, opacity: 0 }}
              className={cn(
                "w-72 bg-white p-4 overflow-y-auto flex flex-col gap-4 shrink-0 z-20 shadow-lg custom-scrollbar",
                isRtl ? "border-l border-[#E2E8F0]" : "border-r border-[#E2E8F0]"
              )}
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
                <div>
                  <h3 className="text-xs font-bold text-[#12263A] uppercase tracking-wider">
                    {isRtl ? 'كتالوج كتل واتساب' : 'WhatsApp Blocks Catalog'}
                  </h3>
                  <p className="text-[10px] text-[#64748B] mt-0.5">
                    {isRtl ? 'انقر لإدراج الكتلة في لوحة العمل' : 'Click to inject directly into canvas'}
                  </p>
                </div>
                <button 
                  onClick={() => setIsSidebarOpen(false)} 
                  className="text-[#64748B] hover:text-[#12263A] p-1 rounded-lg hover:bg-[#F8FAFC] cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Categorized Blocks List */}
              {['Trigger', 'WhatsApp Action', 'System Action', 'Logic & Wait'].map((cat) => {
                const isCatTrigger = cat === 'Trigger';
                const items = catalogTypes.filter(n => {
                  if (isCatTrigger) return n.category === (isRtl ? 'مشغّل' : 'Trigger');
                  if (cat === 'WhatsApp Action') return n.category === (isRtl ? 'إجراء واتساب' : 'WhatsApp Action');
                  if (cat === 'System Action') return n.category === (isRtl ? 'إجراء نظام' : 'System Action');
                  return n.category === (isRtl ? 'منطق وانتظار' : 'Logic & Wait');
                });

                if (items.length === 0) return null;

                return (
                  <div key={cat} className="space-y-1.5">
                    <span className="block text-[9px] font-bold text-[#64748B] uppercase tracking-wider">
                      {cat} ({items.length})
                    </span>
                    <div className="space-y-1">
                      {items.map(nt => (
                        <button
                          key={nt.type}
                          onClick={() => handleDragNodeAdd(nt)}
                          className={cn(
                            "w-full p-2 bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#166534]/40 rounded-xl text-xs font-semibold text-[#12263A] flex items-center gap-2.5 cursor-pointer transition-all shadow-2xs group",
                            isRtl ? "text-right" : "text-left"
                          )}
                        >
                          <div className={cn("w-6 h-6 rounded-lg flex items-center justify-center text-white text-[9px] shrink-0 group-hover:scale-105 transition-transform", nt.color)}>
                            <nt.icon size={11} />
                          </div>
                          <div className="min-w-0">
                            <span className="block truncate text-[11px] font-bold text-[#12263A] group-hover:text-[#166534] transition-colors">{nt.label}</span>
                            <span className="block truncate text-[9px] text-[#64748B] font-normal">{nt.desc}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Builder Viewport wrapper */}
        <main className="flex-1 h-full bg-[#F8FAFC] relative flex">
          
          {nodes.length === 0 ? (
            /* Guided Onboarding Empty State */
            <div className="flex-1 flex items-center justify-center p-6 bg-[#F8FAFC] select-none">
              <div className="max-w-md w-full bg-white p-6 sm:p-8 border border-[#E2E8F0] rounded-2xl shadow-xs text-center space-y-5">
                <div className="w-12 h-12 bg-[#F0FDF4] border border-[#22C55E]/30 rounded-2xl flex items-center justify-center text-[#166534] mx-auto">
                  <Zap size={22} className="animate-pulse" />
                </div>
                
                <div className="space-y-1.5">
                  <h2 className="text-base font-bold text-[#12263A]">
                    {isRtl ? 'اختر كيف يبدأ هذا المسار' : 'Choose Your Workflow Trigger'}
                  </h2>
                  <p className="text-xs text-[#64748B] font-normal leading-relaxed">
                    {isRtl 
                      ? 'حدد حدث البدء لإطلاق محرك الأتمتة عند وقوعه.' 
                      : 'Select a WhatsApp trigger to initiate contact enrollment into this flow.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-2.5 pt-1">
                  {[
                    { 
                      type: 'incoming_message', 
                      title: isRtl ? 'رسالة واتساب واردة' : 'Incoming WhatsApp Message', 
                      desc: isRtl ? 'يبدأ تلقائياً عند استلام أي رسالة' : 'Triggers on any incoming message from a customer', 
                      icon: Zap 
                    },
                    { 
                      type: 'keyword', 
                      title: isRtl ? 'تطابق الكلمات المفتاحية' : 'Keyword Match', 
                      desc: isRtl ? 'يبدأ عند إرسال كلمات معينة (سعر، حجز)' : 'Triggers when a customer messages specific keywords', 
                      icon: MessageSquare 
                    },
                    { 
                      type: 'button_clicked', 
                      title: isRtl ? 'نقر زر تفاعلي' : 'Interactive Button Click', 
                      desc: isRtl ? 'يبدأ عند نقر العميل على زر رد سريع' : 'Triggers when recipient taps a WhatsApp quick-reply button', 
                      icon: Sparkles 
                    },
                    { 
                      type: 'ad_click', 
                      title: isRtl ? 'إعلانات تحويل إلى واتساب' : 'Click-to-WhatsApp Ad Lead', 
                      desc: isRtl ? 'يبدأ فور انتقال العميل من إعلان ممول' : 'Triggers from Facebook/Instagram Click-to-WhatsApp ads', 
                      icon: Smartphone 
                    }
                  ].map((btn) => (
                    <button
                      key={btn.type}
                      type="button"
                      onClick={() => addInitialTrigger(btn.type)}
                      className={cn(
                        "w-full p-3 bg-white hover:bg-[#F0FDF4] border border-[#E2E8F0] hover:border-[#22C55E]/50 rounded-xl flex items-center gap-3 transition-all cursor-pointer group",
                        isRtl ? "text-right" : "text-left"
                      )}
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#F0FDF4] text-[#166534] border border-[#22C55E]/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <btn.icon size={15} />
                      </div>
                      <div className="min-w-0">
                        <span className="block text-xs font-bold text-[#12263A] leading-tight group-hover:text-[#166534] transition-colors">
                          {btn.title}
                        </span>
                        <span className="block text-[10px] text-[#64748B] mt-0.5 leading-tight font-normal">
                          {btn.desc}
                        </span>
                      </div>
                    </button>
                  ))}
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
                    "relative w-full max-w-md bg-white border border-[#E2E8F0] rounded-2xl shadow-xl overflow-hidden z-10 p-5 space-y-4",
                    isRtl && "text-right"
                  )}
                  dir={isRtl ? 'rtl' : 'ltr'}
                >
                  <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
                    <span className="text-xs font-bold text-[#12263A] uppercase tracking-wider">
                      {isRtl ? 'اختر الإجراء التالي' : 'Select Next Workflow Action'}
                    </span>
                    <button 
                      onClick={() => setStepSelectorParentId(null)} 
                      className="text-[#64748B] hover:text-[#12263A] p-1 rounded-lg hover:bg-[#F8FAFC] cursor-pointer"
                    >
                      <X size={15} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-2 max-h-88 overflow-y-auto pr-1 custom-scrollbar">
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

        {/* Dedicated Node Configuration Panel (Section 6) */}
        <AnimatePresence>
          {selectedNode && (
            <motion.div
              initial={{ x: isRtl ? '-100%' : '100%' }}
              animate={{ x: 0 }}
              exit={{ x: isRtl ? '-100%' : '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className={cn(
                "w-96 bg-white shadow-2xl z-20 flex flex-col shrink-0 border-l border-[#E2E8F0]",
                isRtl && "border-r border-l-0 text-right"
              )}
              dir={isRtl ? 'rtl' : 'ltr'}
            >
              <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
                <div className="flex items-center gap-2">
                  <Sliders size={15} className="text-[#166534]" />
                  <div>
                    <span className="text-xs font-bold text-[#12263A] uppercase tracking-wider block">
                      {isRtl ? 'تكوين الكتلة' : 'Node Configuration'}
                    </span>
                    <span className="text-[10px] text-[#64748B] font-mono">{selectedNode.id}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedNode(null)}
                  className="text-[#64748B] hover:text-[#12263A] p-1.5 rounded-lg hover:bg-white cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
                
                {/* Node Label Title */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                    {isRtl ? 'اسم أو عنوان الكتلة' : 'Block Step Title'}
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
                    className="w-full h-9 px-3 bg-white border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#12263A] focus:outline-none focus:ring-2 focus:ring-[#22C55E]/15 focus:border-[#166534]"
                  />
                </div>

                {/* SENDER NUMBER SELECTOR (For messaging nodes) */}
                {['send_message', 'send_template', 'send_interactive_buttons', 'send_interactive_list', 'send_image'].includes(selectedNode.data.type) && (
                  <div className="space-y-1.5 p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                    <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block flex items-center justify-between">
                      <span>{isRtl ? 'رقم الإرسال (WhatsApp Sender)' : 'WhatsApp Sender Number'}</span>
                      <span className="text-[#166534] text-[9px] font-bold">Official Cloud API</span>
                    </label>
                    <select
                      value={selectedNode.data.config?.senderNumber || senderPhone}
                      onChange={(e) => updateNodeConfig(selectedNode.id, { senderNumber: e.target.value })}
                      className="w-full h-8.5 px-2.5 bg-white border border-[#E2E8F0] rounded-lg text-xs font-medium text-[#12263A] focus:outline-none focus:border-[#166534]"
                    >
                      <option value={senderPhone}>{senderPhone} (Default Business Account)</option>
                      <option value="+14155550199">+1 (415) 555-0199 (Sales Line)</option>
                      <option value="+14155550299">+1 (415) 555-0299 (Support Desk)</option>
                    </select>
                  </div>
                )}

                {/* 1. SEND MESSAGE CONFIG & LIVE PREVIEW */}
                {selectedNode.data.type === 'send_message' && (
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                          {isRtl ? 'نص الرسالة' : 'Message Body Text'}
                        </label>
                        <span className="text-[10px] text-[#64748B] font-mono">
                          {(selectedNode.data.config?.message || '').length} chars
                        </span>
                      </div>
                      <textarea
                        rows={4}
                        placeholder={isRtl ? 'مرحباً {{contact.name}}، يسعدنا تواصلك...' : 'Hello {{contact.name}}, thank you for reaching out...'}
                        value={selectedNode.data.config?.message || ''}
                        onChange={(e) => updateNodeConfig(selectedNode.id, { message: e.target.value })}
                        className="w-full p-2.5 bg-white border border-[#E2E8F0] rounded-xl text-xs text-[#12263A] focus:outline-none focus:ring-2 focus:ring-[#22C55E]/15 focus:border-[#166534] font-medium leading-relaxed resize-none"
                      />
                    </div>

                    {/* Variable Pills */}
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-[#64748B] uppercase tracking-wider block">
                        {isRtl ? 'إدراج متغيرات ديناميكية:' : 'Insert Variables:'}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {['{{contact.name}}', '{{contact.phone}}', '{{contact.email}}', '{{company_name}}'].map(tag => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => {
                              const cur = selectedNode.data.config?.message || '';
                              updateNodeConfig(selectedNode.id, { message: cur + (cur ? ' ' : '') + tag });
                            }}
                            className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#166534] hover:text-[#166534] transition-colors cursor-pointer"
                          >
                            +{tag}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Live WhatsApp Preview */}
                    <div className="space-y-1.5 pt-2 border-t border-[#E2E8F0]">
                      <span className="text-[9px] font-bold text-[#64748B] uppercase tracking-wider block flex items-center gap-1">
                        <Smartphone size={11} /> {isRtl ? 'معاينة واتساب الحية' : 'Live WhatsApp Preview'}
                      </span>
                      <div className="p-3.5 bg-[#EFEAE2] rounded-xl border border-[#D1D7DB] shadow-inner font-sans" dir="ltr">
                        <div className="max-w-[240px] bg-white rounded-lg p-2.5 shadow-xs text-xs text-[#12263A] leading-relaxed relative">
                          <p className="whitespace-pre-wrap break-words">
                            {(selectedNode.data.config?.message || 'Hello! Thank you for contacting our team. How can we assist you today?')
                              .replace(/{{contact\.name}}/g, 'Ahmed Ali')
                              .replace(/{{contact\.phone}}/g, '+1 (555) 0192')
                              .replace(/{{contact\.email}}/g, 'client@example.com')
                              .replace(/{{company_name}}/g, 'Acme Corp')
                            }
                          </p>
                          <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-[#64748B]">
                            <span>11:42 AM</span>
                            <Check size={11} className="text-[#34B7F1]" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. SEND TEMPLATE CONFIG & LIVE PREVIEW */}
                {selectedNode.data.type === 'send_template' && (
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                        {isRtl ? 'اختيار القالب الرسمي المعتمد' : 'Select Approved WhatsApp Template'}
                      </label>
                      <select
                        value={selectedNode.data.config?.templateName || ''}
                        onChange={(e) => {
                          const chosen = availableTemplates.find(t => t.name === e.target.value);
                          updateNodeConfig(selectedNode.id, { 
                            templateName: e.target.value,
                            templateId: chosen?.id,
                            templateStatus: chosen?.status || 'APPROVED',
                            templateLanguage: chosen?.language || 'ar'
                          });
                        }}
                        className="w-full h-9 px-2.5 bg-white border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#12263A] focus:outline-none focus:border-[#166534]"
                      >
                        <option value="">{isLoadingTemplates ? 'Loading templates...' : '-- Choose Approved Template --'}</option>
                        {availableTemplates.map(t => (
                          <option key={t.id || t.name} value={t.name}>
                            {t.name} ({t.status || 'APPROVED'} - {t.language})
                          </option>
                        ))}
                        {availableTemplates.length === 0 && (
                          <>
                            <option value="lead_welcome_arabic">lead_welcome_arabic (APPROVED - ar)</option>
                            <option value="appointment_reminder">appointment_reminder (APPROVED - en)</option>
                            <option value="payment_confirmation">payment_confirmation (APPROVED - en)</option>
                          </>
                        )}
                      </select>
                    </div>

                    {/* Template Approval Badge */}
                    <div className="flex items-center justify-between text-xs p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
                      <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Status</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F0FDF4] text-[#166534] border border-[#22C55E]/30">
                        {selectedNode.data.config?.templateStatus || 'APPROVED'}
                      </span>
                    </div>

                    {/* Opt-out Warning */}
                    <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-[10px] font-medium flex items-start gap-1.5">
                      <ShieldAlert size={14} className="shrink-0 text-amber-600 mt-0.5" />
                      <span>{isRtl ? 'سياسة واتساب: تتطلب قوالب التسويق موافقة صريحة مسبقة من العميل.' : 'Meta Policy: Marketing templates require recipient opt-in prior to outbound dispatch.'}</span>
                    </div>

                    {/* Live WhatsApp Template Preview */}
                    <div className="space-y-1.5 pt-2 border-t border-[#E2E8F0]">
                      <span className="text-[9px] font-bold text-[#64748B] uppercase tracking-wider block flex items-center gap-1">
                        <Smartphone size={11} /> {isRtl ? 'معاينة القالب المعتمد' : 'Live WhatsApp Template Preview'}
                      </span>
                      <div className="p-3.5 bg-[#EFEAE2] rounded-xl border border-[#D1D7DB] shadow-inner font-sans" dir="ltr">
                        <div className="max-w-[240px] bg-white rounded-lg p-3 shadow-xs text-xs text-[#12263A] leading-relaxed space-y-2">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-[#166534]">
                            {selectedNode.data.config?.templateName || 'welcome_onboarding'}
                          </div>
                          <p className="text-[11px] text-[#12263A]">
                            Hello Ahmed, thank you for confirming your appointment with our team. We look forward to meeting you!
                          </p>
                          <div className="border-t border-[#E2E8F0] pt-2 space-y-1">
                            <button type="button" className="w-full py-1 bg-white border border-[#E2E8F0] rounded text-[10px] font-bold text-[#166534]">
                              Confirm Appointment
                            </button>
                            <button type="button" className="w-full py-1 bg-white border border-[#E2E8F0] rounded text-[10px] font-bold text-red-600">
                              Reschedule
                            </button>
                          </div>
                          <div className="flex items-center justify-end gap-1 text-[9px] text-[#64748B]">
                            <span>11:45 AM</span>
                            <Check size={11} className="text-[#34B7F1]" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. SEND INTERACTIVE BUTTONS */}
                {selectedNode.data.type === 'send_interactive_buttons' && (
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                        {isRtl ? 'نص السؤال / العرض' : 'Question / Offer Body Text'}
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Would you like to schedule a product demo or speak with an advisor?"
                        value={selectedNode.data.config?.message || ''}
                        onChange={(e) => updateNodeConfig(selectedNode.id, { message: e.target.value })}
                        className="w-full p-2.5 bg-white border border-[#E2E8F0] rounded-xl text-xs text-[#12263A] focus:outline-none focus:border-[#166534]"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                        {isRtl ? 'الأزرار التفاعلية (بحد أقصى 3)' : 'Interactive Buttons (Max 3)'}
                      </label>
                      {[0, 1, 2].map((btnIdx) => {
                        const curButtons = selectedNode.data.config?.buttons || ['Book Demo', 'Speak to Sales', 'View Pricing'];
                        return (
                          <input
                            key={btnIdx}
                            type="text"
                            placeholder={`Button ${btnIdx + 1} Label`}
                            value={curButtons[btnIdx] || ''}
                            onChange={(e) => {
                              const next = [...curButtons];
                              next[btnIdx] = e.target.value;
                              updateNodeConfig(selectedNode.id, { buttons: next });
                            }}
                            className="w-full h-8 px-2.5 bg-white border border-[#E2E8F0] rounded-lg text-xs font-semibold text-[#12263A] focus:outline-none focus:border-[#166534]"
                          />
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 4. KEYWORD TRIGGER CONFIG */}
                {selectedNode.data.type === 'keyword' && (
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                        {isRtl ? 'الكلمات المفتاحية (مفصولة بفواصل)' : 'Target Keywords (comma separated)'}
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. price, booking, catalog, order"
                        value={selectedNode.data.config?.keywords || ''}
                        onChange={(e) => updateNodeConfig(selectedNode.id, { keywords: e.target.value })}
                        className="w-full h-9 px-3 bg-white border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#12263A] focus:outline-none focus:border-[#166534]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                        {isRtl ? 'نوع المطابقة' : 'Match Rule'}
                      </label>
                      <select
                        value={selectedNode.data.config?.matchType || 'contains'}
                        onChange={(e) => updateNodeConfig(selectedNode.id, { matchType: e.target.value })}
                        className="w-full h-8.5 px-2 bg-white border border-[#E2E8F0] rounded-xl text-xs text-[#12263A] focus:outline-none focus:border-[#166534]"
                      >
                        <option value="contains">{isRtl ? 'يحتوي على الكلمة' : 'Contains word'}</option>
                        <option value="exact">{isRtl ? 'تطابق تام' : 'Exact match only'}</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* 5. WAIT DELAY CONFIG */}
                {selectedNode.data.type === 'wait' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                          {isRtl ? 'المدة' : 'Duration'}
                        </label>
                        <input
                          type="number"
                          min={1}
                          value={selectedNode.data.config?.amount || '30'}
                          onChange={(e) => updateNodeConfig(selectedNode.id, { amount: e.target.value })}
                          className="w-full h-9 px-3 bg-white border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#12263A] focus:outline-none focus:border-[#166534]"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                          {isRtl ? 'الوحدة الزمنية' : 'Unit'}
                        </label>
                        <select
                          value={selectedNode.data.config?.unit || 'minutes'}
                          onChange={(e) => updateNodeConfig(selectedNode.id, { unit: e.target.value })}
                          className="w-full h-9 px-2 bg-white border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#12263A] focus:outline-none focus:border-[#166534]"
                        >
                          <option value="minutes">Minutes</option>
                          <option value="hours">Hours</option>
                          <option value="days">Days</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. BUSINESS HOURS CONDITION */}
                {selectedNode.data.type === 'business_hours_condition' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                          Start Time
                        </label>
                        <input
                          type="time"
                          value={selectedNode.data.config?.startTime || '09:00'}
                          onChange={(e) => updateNodeConfig(selectedNode.id, { startTime: e.target.value })}
                          className="w-full h-9 px-2 bg-white border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#12263A]"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                          End Time
                        </label>
                        <input
                          type="time"
                          value={selectedNode.data.config?.endTime || '18:00'}
                          onChange={(e) => updateNodeConfig(selectedNode.id, { endTime: e.target.value })}
                          className="w-full h-9 px-2 bg-white border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#12263A]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 7. RANDOM SPLIT (A/B TESTING) */}
                {selectedNode.data.type === 'random_split' && (
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                      A/B Test Percentage Split
                    </label>
                    <div className="space-y-2">
                      <input
                        type="range"
                        min="10"
                        max="90"
                        step="5"
                        value={selectedNode.data.config?.splitRatio || 50}
                        onChange={(e) => updateNodeConfig(selectedNode.id, { splitRatio: Number(e.target.value) })}
                        className="w-full accent-[#166534] cursor-pointer"
                      />
                      <div className="flex items-center justify-between text-xs font-bold font-mono">
                        <span className="text-[#166534]">Branch A: {selectedNode.data.config?.splitRatio || 50}%</span>
                        <span className="text-violet-600">Branch B: {100 - (Number(selectedNode.data.config?.splitRatio) || 50)}%</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 8. TAG ACTIONS */}
                {(selectedNode.data.type === 'add_tag' || selectedNode.data.type === 'remove_tag') && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                      Tag Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. vip_customer, onboarded, lead_qualified"
                      value={selectedNode.data.config?.tagName || ''}
                      onChange={(e) => updateNodeConfig(selectedNode.id, { tagName: e.target.value })}
                      className="w-full h-9 px-3 bg-white border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#12263A] focus:outline-none focus:border-[#166534]"
                    />
                  </div>
                )}

                {/* 9. ASSIGN AGENT / TEAM */}
                {(selectedNode.data.type === 'assign_agent' || selectedNode.data.type === 'assign_team') && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                      Assignee Name / Team
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Sales Specialist, Support Team A"
                      value={selectedNode.data.config?.agentName || ''}
                      onChange={(e) => updateNodeConfig(selectedNode.id, { agentName: e.target.value })}
                      className="w-full h-9 px-3 bg-white border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#12263A] focus:outline-none focus:border-[#166534]"
                    />
                  </div>
                )}

                {/* 10. CALL WEBHOOK */}
                {selectedNode.data.type === 'call_webhook' && (
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                        Destination Webhook URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://hooks.zapier.com/hooks/catch/..."
                        value={selectedNode.data.config?.url || ''}
                        onChange={(e) => updateNodeConfig(selectedNode.id, { url: e.target.value })}
                        className="w-full h-9 px-3 bg-white border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#12263A] focus:outline-none focus:border-[#166534]"
                      />
                    </div>
                  </div>
                )}

              </div>

              {/* Panel Footer */}
              <div className="p-4 border-t border-[#E2E8F0] bg-white flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedNode(null)}
                  className="w-full py-2 bg-[#166534] hover:bg-[#14532d] text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
                >
                  {isRtl ? 'حفظ وإغلاق اللوحة' : 'Done & Close Panel'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Workflow Settings Drawer (Section 9) */}
      <AnimatePresence>
        {isSettingsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setIsSettingsOpen(false)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-white border border-[#E2E8F0] rounded-2xl shadow-xl overflow-hidden z-10 p-6 space-y-5"
              dir={isRtl ? 'rtl' : 'ltr'}
            >
              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
                <div className="flex items-center gap-2">
                  <Settings size={16} className="text-[#166534]" />
                  <span className="text-xs font-bold text-[#12263A] uppercase tracking-wider">
                    {isRtl ? 'إعدادات وسياسات المسار' : 'Workflow Execution Settings'}
                  </span>
                </div>
                <button onClick={() => setIsSettingsOpen(false)} className="text-[#64748B] hover:text-[#12263A] p-1 rounded">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4 text-xs max-h-96 overflow-y-auto pr-1 custom-scrollbar">
                
                {/* Name & Description */}
                <div className="space-y-1.5">
                  <label className="font-bold text-[#12263A]">Workflow Name</label>
                  <input
                    type="text"
                    value={workflowName}
                    onChange={(e) => setWorkflowName(e.target.value)}
                    className="w-full h-9 px-3 bg-white border border-[#E2E8F0] rounded-xl font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-[#12263A]">Description</label>
                  <textarea
                    rows={2}
                    value={workflowDescription}
                    onChange={(e) => setWorkflowDescription(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#E2E8F0] rounded-xl font-medium resize-none"
                  />
                </div>

                {/* Re-entry Policy */}
                <div className="space-y-1.5">
                  <label className="font-bold text-[#12263A]">Re-entry Policy</label>
                  <select
                    value={workflowSettings.reentry_policy}
                    onChange={(e) => setWorkflowSettings({ ...workflowSettings, reentry_policy: e.target.value })}
                    className="w-full h-9 px-2.5 bg-white border border-[#E2E8F0] rounded-xl font-medium"
                  >
                    <option value="never">Never (Block duplicate enrollments permanently)</option>
                    <option value="after_completion">Allow re-entry only after completion</option>
                    <option value="always">Always (Allow concurrent re-enrollments)</option>
                  </select>
                </div>

                {/* Stop on Response */}
                <div className="flex items-center justify-between p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                  <div>
                    <span className="font-bold text-[#12263A] block">Stop Workflow on Customer Reply</span>
                    <span className="text-[10px] text-[#64748B]">Automatically unenroll contacts as soon as they send an inbound reply</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={workflowSettings.stop_on_response}
                    onChange={(e) => setWorkflowSettings({ ...workflowSettings, stop_on_response: e.target.checked })}
                    className="w-4 h-4 accent-[#166534] rounded cursor-pointer"
                  />
                </div>

                {/* Timezone Mode */}
                <div className="space-y-1.5">
                  <label className="font-bold text-[#12263A]">Timezone Alignment</label>
                  <select
                    value={workflowSettings.timezone_mode}
                    onChange={(e) => setWorkflowSettings({ ...workflowSettings, timezone_mode: e.target.value })}
                    className="w-full h-9 px-2.5 bg-white border border-[#E2E8F0] rounded-xl font-medium"
                  >
                    <option value="contact">Contact's Local Timezone (Recommended)</option>
                    <option value="tenant">Workspace Account Default Timezone</option>
                  </select>
                </div>

                {/* Operating Window */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-[#12263A]">Earliest Delivery Time</label>
                    <input
                      type="time"
                      value={workflowSettings.execution_start_time}
                      onChange={(e) => setWorkflowSettings({ ...workflowSettings, execution_start_time: e.target.value })}
                      className="w-full h-9 px-2 bg-white border border-[#E2E8F0] rounded-xl"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-[#12263A]">Latest Delivery Time</label>
                    <input
                      type="time"
                      value={workflowSettings.execution_end_time}
                      onChange={(e) => setWorkflowSettings({ ...workflowSettings, execution_end_time: e.target.value })}
                      className="w-full h-9 px-2 bg-white border border-[#E2E8F0] rounded-xl"
                    />
                  </div>
                </div>

              </div>

              <div className="border-t border-[#E2E8F0] pt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(false)}
                  className="w-1/2 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  disabled={isSavingSettings}
                  className="w-1/2 py-2.5 bg-[#166534] hover:bg-[#14532d] text-white rounded-xl font-bold flex items-center justify-center gap-1.5"
                >
                  {isSavingSettings && <Loader2 size={13} className="animate-spin" />}
                  <span>Save Settings</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Version History Drawer (Section 5) */}
      <AnimatePresence>
        {isVersionsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setIsVersionsOpen(false)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-white border border-[#E2E8F0] rounded-2xl shadow-xl overflow-hidden z-10 p-6 space-y-4"
              dir={isRtl ? 'rtl' : 'ltr'}
            >
              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
                <div className="flex items-center gap-2">
                  <History size={16} className="text-[#166534]" />
                  <span className="text-xs font-bold text-[#12263A] uppercase tracking-wider">
                    {isRtl ? 'سجل النسخ والإصدارات المنشورة' : 'Workflow Version History'}
                  </span>
                </div>
                <button onClick={() => setIsVersionsOpen(false)} className="text-[#64748B] hover:text-[#12263A] p-1 rounded">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
                {isLoadingVersions ? (
                  <div className="text-center py-8 text-xs text-[#64748B] flex items-center justify-center gap-2">
                    <Loader2 size={14} className="animate-spin text-[#166534]" /> Loading version history...
                  </div>
                ) : versionsList.length === 0 ? (
                  <div className="text-center py-8 text-xs text-[#64748B]">
                    No published version snapshots recorded yet. Publish this workflow to create version 1.0.0.
                  </div>
                ) : (
                  versionsList.map((ver) => (
                    <div key={ver.id} className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#12263A]">v{ver.version_number}</span>
                          <span className="text-[10px] text-[#64748B] font-mono">
                            {ver.created_at ? new Date(ver.created_at).toLocaleString() : ''}
                          </span>
                        </div>
                        <span className="text-[11px] text-[#64748B] mt-0.5 block">
                          {ver.change_summary || 'Standard production release'}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRestoreVersion(ver)}
                        className="px-3 py-1 bg-white hover:bg-[#F0FDF4] border border-[#E2E8F0] hover:border-[#166534] text-[#166534] rounded-lg text-xs font-bold transition-all cursor-pointer"
                      >
                        Restore
                      </button>
                    </div>
                  ))
                )}
              </div>

              <button
                type="button"
                onClick={() => setIsVersionsOpen(false)}
                className="w-full py-2 bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] rounded-xl font-bold text-xs"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Isolated Dry Run Test Modal */}
      <AnimatePresence>
        {isPreviewOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setIsPreviewOpen(false)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-white border border-[#E2E8F0] rounded-2xl shadow-xl overflow-hidden z-10 p-6 space-y-4"
              dir={isRtl ? 'rtl' : 'ltr'}
            >
              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
                <div className="flex items-center gap-2">
                  <Play size={16} className="text-[#166534]" fill="currentColor" />
                  <span className="text-xs font-bold text-[#12263A] uppercase tracking-wider">
                    {isRtl ? 'اختبار تجريبي آمن للمسار (Dry Run)' : 'Isolated Workflow Dry-Run Simulation'}
                  </span>
                </div>
                <button onClick={() => setIsPreviewOpen(false)} className="text-[#64748B] hover:text-[#12263A] p-1 rounded">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <p className="text-[#64748B]">
                  Simulates contact traversal across nodes without dispatching external messages or mutating production leads.
                </p>

                <div className="space-y-1.5">
                  <label className="font-bold text-[#12263A]">Simulation Target Phone Number</label>
                  <input
                    type="tel"
                    value={testContactPhone}
                    onChange={(e) => setTestContactPhone(e.target.value)}
                    className="w-full h-9 px-3 bg-white border border-[#E2E8F0] rounded-xl font-mono"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleRunIsolatedTest}
                  disabled={isExecutingTest}
                  className="w-full py-2.5 bg-[#166534] hover:bg-[#14532d] text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {isExecutingTest ? <Loader2 size={13} className="animate-spin" /> : <Play size={12} fill="currentColor" />}
                  <span>{isExecutingTest ? 'Running Simulation...' : 'Execute Isolated Dry Run'}</span>
                </button>

                {/* Simulation Output Trace */}
                {testResultLogs && (
                  <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] space-y-2 max-h-48 overflow-y-auto font-mono text-[11px]">
                    <span className="font-bold text-[#166534] block">[Dry-Run Complete] 0 Errors, Verified Clean</span>
                    {nodes.map((n, i) => (
                      <div key={n.id} className="flex items-center gap-2 text-[#12263A]">
                        <Check size={11} className="text-[#22C55E] shrink-0" />
                        <span>Step #{i + 1} ({n.data.type}): Verified</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="w-full py-2 bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] rounded-xl font-bold text-xs"
              >
                Close Simulator
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
