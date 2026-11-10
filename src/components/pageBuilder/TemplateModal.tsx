import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Layers,
  Check,
  Search,
  ArrowRight,
  RefreshCw,
  Eye,
  Layout,
} from 'lucide-react';
import { pageBuilderApi } from '../../services/pageBuilderApi';
import { BuilderTemplate, PageSection, PageTheme } from '../../types/pageBuilder';
import { toast } from '../ui/Toast';

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTemplate: (template: { sections: PageSection[]; theme: PageTheme; title: string }) => void;
}

export const TemplateModal: React.FC<TemplateModalProps> = ({ isOpen, onClose, onApplyTemplate }) => {
  const [templates, setTemplates] = useState<BuilderTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewTemplate, setPreviewTemplate] = useState<BuilderTemplate | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const res = await pageBuilderApi.getTemplates({ type: 'page' });
        if (res.success && res.data) {
          setTemplates(res.data);
          if (res.data.length > 0) {
            setPreviewTemplate(res.data[0]);
          }
        }
      } catch (err) {
        console.error('Failed to load templates:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, [isOpen]);

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'All Templates' },
    { id: 'saas', label: 'SaaS & Tech' },
    { id: 'agency', label: 'Agency & B2B' },
    { id: 'general', label: 'Webinar & Events' },
  ];

  const filteredTemplates = templates.filter((t) => {
    const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
    const matchesQuery =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  const handleApply = (template: BuilderTemplate) => {
    if (!template.content || !template.content.sections) {
      toast.error('This template is not yet available with pre-built sections.');
      return;
    }

    onApplyTemplate({
      title: template.name,
      sections: template.content.sections,
      theme: template.content.theme,
    });
    toast.success(`"${template.name}" applied successfully!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-4xl w-full border border-slate-200 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#166534] flex items-center justify-center">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">1-Click Turnkey Page Templates</h3>
              <p className="text-[11px] text-slate-400">
                Choose a pre-designed, high-converting layout tailored to your business model.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Filter bar */}
        <div className="px-6 py-3 bg-slate-50/80 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#166534] text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#166534]"
            />
          </div>
        </div>

        {/* Body Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-3 gap-5">
          {loading ? (
            <div className="col-span-3 py-16 flex flex-col items-center justify-center gap-2 text-slate-500">
              <RefreshCw size={24} className="animate-spin text-[#166534]" />
              <span className="text-xs">Loading template catalog...</span>
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div className="col-span-3 py-16 text-center text-slate-400 text-xs">
              No templates match your search filter.
            </div>
          ) : (
            filteredTemplates.map((template) => {
              const sectionCount = template.content?.sections?.length || 0;

              return (
                <div
                  key={template.id}
                  className="group bg-white rounded-2xl border border-slate-200 hover:border-[#166534] shadow-xs hover:shadow-md transition-all flex flex-col overflow-hidden"
                >
                  {/* Thumbnail */}
                  <div className="relative h-44 bg-slate-100 overflow-hidden">
                    <img
                      src={template.thumbnail_url || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80'}
                      alt={template.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-black/60 text-white backdrop-blur-xs">
                        {template.category}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{template.name}</h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                        {template.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="flex items-center gap-1 font-medium">
                        <Layers size={13} className="text-[#166534]" />
                        <span>{sectionCount > 0 ? `${sectionCount} Sections` : 'Ready to use'}</span>
                      </span>

                      <button
                        type="button"
                        onClick={() => handleApply(template)}
                        className="px-3 py-1.5 rounded-lg bg-[#166534] hover:bg-[#14532d] text-white text-xs font-bold transition-all shadow-2xs inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>Use Template</span>
                        <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Note: Applying a template will populate the editor canvas with pre-built section blocks.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-100 text-xs font-semibold cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

