import React, { useState } from 'react';
import {
  X,
  Globe,
  Code2,
  Image as ImageIcon,
  CheckCircle2,
  FileText,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { PageSeoSettings } from '../../types/pageBuilder';

interface SeoTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  seo: PageSeoSettings;
  slug: string;
  onSave: (updatedSeo: PageSeoSettings, updatedSlug: string) => void;
}

export const SeoTrackingModal: React.FC<SeoTrackingModalProps> = ({
  isOpen,
  onClose,
  seo,
  slug,
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState<'seo' | 'scripts'>('seo');
  const [localSlug, setLocalSlug] = useState(slug);
  const [localSeo, setLocalSeo] = useState<PageSeoSettings>({ ...seo });

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(localSeo, localSlug);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#166534] flex items-center justify-center">
              <Globe size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">SEO & Tracking Scripts</h3>
              <p className="text-[11px] text-slate-400">Configure search indexing, social graph previews, and tracking tags.</p>
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

        {/* Tab switcher */}
        <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200/80 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('seo')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'seo'
                ? 'bg-white text-[#166534] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText size={13} />
            <span>Search & Social Metadata</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('scripts')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'scripts'
                ? 'bg-white text-[#166534] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code2 size={13} />
            <span>Head & Body Tracking Scripts</span>
          </button>
        </div>

        {/* Tab 1: SEO & Social */}
        {activeTab === 'seo' && (
          <div className="p-6 overflow-y-auto space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Custom URL Slug</label>
              <div className="flex items-center gap-1 font-mono bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs">
                <span className="text-slate-400">/p/</span>
                <input
                  type="text"
                  value={localSlug}
                  onChange={(e) => setLocalSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))}
                  className="flex-1 bg-transparent focus:outline-none text-slate-800 font-semibold"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Unique URL path used to access this page on the web.</p>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Browser Tab & Meta Title</label>
              <input
                type="text"
                placeholder="e.g. Modern Customer Acquisition System | Company"
                value={localSeo.meta_title || ''}
                onChange={(e) => setLocalSeo({ ...localSeo, meta_title: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#166534]"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Meta Description</label>
              <textarea
                rows={3}
                placeholder="Brief summary for Google search snippets and social media previews..."
                value={localSeo.meta_description || ''}
                onChange={(e) => setLocalSeo({ ...localSeo, meta_description: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#166534]"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Social Preview Image (OG:Image URL)</label>
              <input
                type="text"
                placeholder="https://yourdomain.com/og-preview.jpg"
                value={localSeo.og_image || ''}
                onChange={(e) => setLocalSeo({ ...localSeo, og_image: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#166534]"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Image shown when this page link is shared on Facebook, WhatsApp, Twitter/X, and LinkedIn.
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Custom Head & Body Scripts */}
        {activeTab === 'scripts' && (
          <div className="p-6 overflow-y-auto space-y-4 text-xs">
            <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-[#166534] space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <CheckCircle2 size={14} />
                <span>Marketing & Conversion Tracking Ready</span>
              </p>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Add your Meta Pixel, Google Tag Manager, or Google Analytics scripts here. They will be executed automatically when public visitors view this page.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-700">Custom &lt;head&gt; Code Injection</label>
                <span className="text-[10px] text-slate-400">Loads inside document &lt;head&gt;</span>
              </div>
              <textarea
                rows={5}
                placeholder={`<!-- Example: Meta Pixel / Google Analytics -->\n<script>\n  !function(f,b,e,v,n,t,s)...(window, document,'script');\n  fbq('init', 'YOUR_PIXEL_ID');\n  fbq('track', 'PageView');\n</script>`}
                value={localSeo.custom_head_code || ''}
                onChange={(e) => setLocalSeo({ ...localSeo, custom_head_code: e.target.value })}
                className="w-full font-mono text-[11px] p-3 bg-slate-900 text-emerald-400 border border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#166534] leading-relaxed"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-700">Custom &lt;body&gt; Code Injection</label>
                <span className="text-[10px] text-slate-400">Loads right before &lt;/body&gt;</span>
              </div>
              <textarea
                rows={4}
                placeholder={`<!-- Example: Live chat widgets or conversion triggers -->\n<script>\n  console.log('Page loaded');\n</script>`}
                value={localSeo.custom_body_code || ''}
                onChange={(e) => setLocalSeo({ ...localSeo, custom_body_code: e.target.value })}
                className="w-full font-mono text-[11px] p-3 bg-slate-900 text-emerald-400 border border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#166534] leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-100 text-xs font-semibold cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 bg-[#166534] hover:bg-[#14532d] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            Apply Settings
          </button>
        </div>
      </div>
    </div>
  );
};

