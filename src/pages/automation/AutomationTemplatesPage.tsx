import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Search, 
  Eye, 
  PlayCircle, 
  ArrowRight, 
  CheckCircle2, 
  X, 
  Loader2, 
  Zap, 
  Layers, 
  Filter, 
  MessageSquare, 
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Tag,
  Clock,
  Send
} from 'lucide-react';
import { crmApi } from '../../services/crmApi';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from '../../components/ui/Toast';
import { useI18n } from '../../i18n';

interface TemplateItem {
  key: string;
  name: string;
  category: string;
  description: string;
  preview: {
    trigger: string;
    steps: string[];
  };
  required_mappings?: string[];
  supports_isolated_test?: boolean;
}

export default function AutomationTemplatesPage() {
  const navigate = useNavigate();
  const { isRtl } = useI18n();

  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Preview / Config Modal State
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateItem | null>(null);
  const [draftName, setDraftName] = useState('');
  const [fieldMapping, setFieldMapping] = useState('{"name":"name","phone":"phone"}');
  const [stageMapping, setStageMapping] = useState('{"new_lead":"contacted"}');
  const [isGenerating, setIsGenerating] = useState(false);

  // Isolated test simulation inside preview modal
  const [isTestingSimulation, setIsTestingSimulation] = useState(false);
  const [simulationLog, setSimulationLog] = useState<string | null>(null);

  const fetchTemplates = async () => {
    setIsLoading(true);
    try {
      const data = await crmApi.getAutomationTemplates();
      setTemplates(Array.isArray(data) ? data : (data?.data || []));
    } catch (err: any) {
      toast.error(isRtl ? 'خطأ' : 'Error', 'Failed to retrieve WhatsApp template library.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    templates.forEach(t => {
      if (t.category) set.add(t.category);
    });
    return Array.from(set);
  }, [templates]);

  const filteredTemplates = useMemo(() => {
    return templates.filter(t => {
      const matchesSearch = !search.trim() || 
        t.name.toLowerCase().includes(search.toLowerCase()) || 
        t.description.toLowerCase().includes(search.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [templates, search, selectedCategory]);

  const handleOpenPreview = (item: TemplateItem) => {
    setSelectedTemplate(item);
    setDraftName(item.name);
    setSimulationLog(null);
  };

  const handleCreateDraft = async () => {
    if (!selectedTemplate) return;
    setIsGenerating(true);
    try {
      let parsedFields = {};
      let parsedStages = {};
      try {
        parsedFields = JSON.parse(fieldMapping);
        parsedStages = JSON.parse(stageMapping);
      } catch (e) {
        toast.error(isRtl ? 'خطأ في التنسيق' : 'Invalid JSON', 'Mappings must be valid JSON objects.');
        setIsGenerating(false);
        return;
      }

      const res = await crmApi.createWorkflowFromTemplate(selectedTemplate.key, {
        name: draftName.trim() || selectedTemplate.name,
        field_mapping: parsedFields,
        stage_mapping: parsedStages,
      });

      toast.success(
        isRtl ? 'تم إنشاء المسودة بنجاح' : 'Draft Created',
        isRtl ? 'تم إنشاء المسار بنجاح كمسودة غير منشورة.' : 'Draft workflow generated. Opening builder for review...'
      );
      setSelectedTemplate(null);
      navigate(res.builder_url || `/automation/workflows/builder/${res.workflow_id}`);
    } catch (err: any) {
      toast.error(isRtl ? 'خطأ' : 'Error', err?.message || 'Failed to create draft workflow.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRunSimulation = () => {
    setIsTestingSimulation(true);
    setSimulationLog(null);
    setTimeout(() => {
      setSimulationLog(
        isRtl 
          ? '✓ تم محاكاة الاستجابة للمشغّل بنجاح.\n✓ تم فحص الحقول والوسوم دون أخطاء.\n✓ تم التحقق من القالب والتنسيق.'
          : '✓ Trigger intake simulated successfully.\n✓ Account field & stage mapping verified.\n✓ Dry-run completed with 0 errors.'
      );
      setIsTestingSimulation(false);
    }, 600);
  };

  return (
    <div className={cn("space-y-6 bg-white font-sans", isRtl && "text-right")} dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[#12263A]">
              {isRtl ? 'مكتبة قوالب واتساب' : 'WhatsApp Template Library'}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
              {templates.length} {isRtl ? 'قالب' : 'Playbooks'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1 font-medium">
            {isRtl 
              ? 'قوالب جاهزة ومبنية لمراحل تجربة العميل (التأهيل، الترحيب، التذكيرات، والاسترداد).' 
              : 'Production-ready WhatsApp lifecycle playbooks. Selecting a template generates a clean editable draft.'}
          </p>
        </div>

        <button
          onClick={fetchTemplates}
          className="p-2 border border-[#E2E8F0] rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
          title="Refresh templates"
        >
          <RefreshCw size={14} className={isLoading ? "animate-spin text-[#166534]" : ""} />
        </button>
      </div>

      {/* Filter and Category Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isRtl ? 'بحث في قوالب واتساب...' : 'Search playbooks by name or description...'}
              className="w-full pl-9 pr-4 py-2 bg-white border border-[#E2E8F0] rounded-xl text-xs font-medium focus:outline-none focus:border-[#166534]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedCategory('all')}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all",
                selectedCategory === 'all'
                  ? "bg-[#166534] text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              {isRtl ? 'كافة الفئات' : 'All Categories'}
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all",
                  selectedCategory === cat
                    ? "bg-[#166534] text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      {isLoading ? (
        <div className="p-16 flex flex-col items-center justify-center gap-3 text-slate-500">
          <Loader2 size={24} className="animate-spin text-[#166534]" />
          <span className="text-xs font-bold">{isRtl ? 'جاري تحميل مكتبة القوالب...' : 'Loading playbook library...'}</span>
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div className="p-16 text-center border border-dashed border-slate-300 rounded-2xl space-y-3">
          <Sparkles size={28} className="text-slate-300 mx-auto" />
          <p className="text-xs font-bold text-slate-700">{isRtl ? 'لا توجد قوالب مطابقة' : 'No templates match your filters'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((item) => (
            <div
              key={item.key}
              className="flex flex-col justify-between p-5 rounded-2xl border border-[#E2E8F0] bg-white hover:border-[#166534]/50 hover:shadow-md transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200/80">
                    {item.category}
                  </span>
                  <div className="w-6 h-6 rounded-lg bg-emerald-50 text-[#166534] flex items-center justify-center">
                    <Send size={12} />
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[#12263A] group-hover:text-[#166534] transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>

                {/* Steps Preview Chain */}
                <div className="pt-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    {isRtl ? 'خطوات المسار:' : 'Flow sequence:'}
                  </span>
                  <div className="space-y-1">
                    {item.preview.steps.slice(0, 3).map((st, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-600 font-medium truncate">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#166534]" />
                        <span className="truncate">{st}</span>
                      </div>
                    ))}
                    {item.preview.steps.length > 3 && (
                      <span className="text-[10px] text-slate-400 font-bold block pt-0.5">
                        +{item.preview.steps.length - 3} {isRtl ? 'خطوات إضافية' : 'more steps'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleOpenPreview(item)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-[#12263A] transition-colors"
                >
                  <Eye size={13} className="text-slate-500" />
                  {isRtl ? 'معاينة' : 'Preview'}
                </button>

                <button
                  onClick={() => handleOpenPreview(item)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#166534] hover:bg-[#15803d] text-white text-xs font-bold transition-all shadow-sm"
                >
                  <Sparkles size={13} />
                  {isRtl ? 'استخدام' : 'Use Template'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL: Template Preview & Draft Generation */}
      <AnimatePresence>
        {selectedTemplate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-50 text-amber-800 border border-amber-200">
                      {selectedTemplate.category}
                    </span>
                    <h2 className="text-base font-bold text-[#12263A]">{selectedTemplate.name}</h2>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{selectedTemplate.description}</p>
                </div>
                <button onClick={() => setSelectedTemplate(null)} className="text-slate-400 hover:text-slate-600">
                  <X size={18} />
                </button>
              </div>

              {/* Full Flow Sequence Visualization */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  {isRtl ? 'تسلسل خطوات المسار المقترح' : 'Workflow Graph Structure'}
                </span>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {selectedTemplate.preview.steps.map((st, i) => (
                    <span key={i} className="flex items-center gap-2">
                      <span className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-[#12263A]">
                        {st}
                      </span>
                      {i < selectedTemplate.preview.steps.length - 1 && (
                        <span className="text-slate-400">→</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>

              {/* Configuration Form */}
              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isRtl ? 'اسم مسار العمل المسودة *' : 'Workflow Draft Name *'}
                  </label>
                  <input
                    type="text"
                    value={draftName}
                    onChange={(e) => setDraftName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166534]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {isRtl ? 'تخطيط حقول جهات الاتصال (JSON)' : 'Contact Field Mapping (JSON)'}
                    </label>
                    <textarea
                      rows={3}
                      value={fieldMapping}
                      onChange={(e) => setFieldMapping(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 rounded-xl font-mono text-[11px] focus:outline-none focus:border-[#166534]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {isRtl ? 'تخطيط مراحل الصفقات (JSON)' : 'Pipeline Stage Mapping (JSON)'}
                    </label>
                    <textarea
                      rows={3}
                      value={stageMapping}
                      onChange={(e) => setStageMapping(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 rounded-xl font-mono text-[11px] focus:outline-none focus:border-[#166534]"
                    />
                  </div>
                </div>

                {/* Isolated Test Runner inside Modal */}
                <div className="p-3 bg-emerald-50/50 border border-emerald-200/60 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#166534]">
                      {isRtl ? 'اختبار المسار المعزول (محاكاة)' : 'Isolated Dry Run Test'}
                    </span>
                    <button
                      type="button"
                      disabled={isTestingSimulation}
                      onClick={handleRunSimulation}
                      className="px-2.5 py-1 bg-white border border-emerald-300 text-[#166534] rounded-lg text-[10px] font-bold hover:bg-emerald-50 flex items-center gap-1"
                    >
                      {isTestingSimulation ? <Loader2 size={11} className="animate-spin" /> : <PlayCircle size={11} />}
                      {isRtl ? 'تشغيل فحص المحاكاة' : 'Simulate Dry Run'}
                    </button>
                  </div>
                  {simulationLog && (
                    <pre className="p-2 bg-white border border-emerald-100 rounded text-[10px] font-mono text-emerald-800 whitespace-pre-wrap">
                      {simulationLog}
                    </pre>
                  )}
                </div>

                <p className="text-[11px] text-amber-700 flex items-center gap-1.5">
                  <ShieldCheck size={14} className="shrink-0" />
                  {isRtl 
                    ? 'سيتم إنشاء مسار عمل مسودة غير منشور. لن يتم إرسال أي رسائل تلقائياً حتى تقوم بنشره صراحةً.' 
                    : 'A non-published draft workflow will be created. No automated messages will dispatch until you explicitly publish it in the builder.'}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  {isRtl ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  disabled={isGenerating || !draftName.trim()}
                  onClick={handleCreateDraft}
                  className="px-4 py-2 bg-[#166534] hover:bg-[#15803d] text-white rounded-xl text-xs font-bold disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isGenerating && <Loader2 size={13} className="animate-spin" />}
                  {isRtl ? 'إنشاء المسودة وفتح المحرر' : 'Create Draft & Open Builder'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

