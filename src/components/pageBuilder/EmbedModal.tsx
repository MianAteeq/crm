import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, Code2, Globe } from 'lucide-react';
import { toast } from '../ui/Toast';

interface EmbedModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  slug: string;
  type: 'page' | 'form';
}

export const EmbedModal: React.FC<EmbedModalProps> = ({
  isOpen,
  onClose,
  title,
  slug,
  type,
}) => {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedIframe, setCopiedIframe] = useState(false);

  if (!isOpen) return null;

  const publicPath = type === 'page' ? `/p/${slug}` : `/f/${slug}`;
  const fullUrl = `${window.location.origin}${publicPath}`;
  const iframeCode = `<iframe src="${fullUrl}" width="100%" height="${
    type === 'page' ? '800' : '650'
  }" frameborder="0" style="border:none;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);" allowfullscreen></iframe>`;

  const copyToClipboard = async (text: string, isIframe = false) => {
    try {
      await navigator.clipboard.writeText(text);
      if (isIframe) {
        setCopiedIframe(true);
        setTimeout(() => setCopiedIframe(false), 2000);
      } else {
        setCopiedUrl(true);
        setTimeout(() => setCopiedUrl(false), 2000);
      }
      toast.success('Copied to clipboard!');
    } catch (_) {
      toast.error('Failed to copy to clipboard');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#166534] flex items-center justify-center">
              <Code2 size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Share & Embed {type === 'page' ? 'Page' : 'Form'}</h3>
              <p className="text-xs text-slate-500 truncate max-w-xs">{title}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Direct Public Link */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Globe size={13} className="text-[#166534]" />
                <span>Direct Shareable URL</span>
              </span>
              <a
                href={publicPath}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-[#166534] hover:underline flex items-center gap-1 font-semibold"
              >
                <span>Open in new tab</span>
                <ExternalLink size={11} />
              </a>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={fullUrl}
                className="flex-1 px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none select-all"
              />
              <button
                type="button"
                onClick={() => copyToClipboard(fullUrl, false)}
                className="px-3 py-2 bg-[#166534] hover:bg-[#14532d] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 shrink-0"
              >
                {copiedUrl ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedUrl ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Iframe Embed Code */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Code2 size={13} className="text-[#166534]" />
              <span>HTML Iframe Embed Code</span>
            </label>
            <div className="relative">
              <textarea
                readOnly
                rows={3}
                value={iframeCode}
                className="w-full p-3 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none resize-none select-all"
              />
              <button
                type="button"
                onClick={() => copyToClipboard(iframeCode, true)}
                className="absolute top-2 right-2 px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-[11px] font-bold shadow-2xs transition-all flex items-center gap-1"
              >
                {copiedIframe ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                <span>{copiedIframe ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Paste this snippet into any website (WordPress, Webflow, custom HTML) to embed your {type}.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

