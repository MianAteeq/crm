import React from 'react';
import { X, Palette, Check, Type, Maximize2 } from 'lucide-react';
import { PageTheme } from '../../types/pageBuilder';

interface ThemePaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: PageTheme;
  onSaveTheme: (theme: PageTheme) => void;
}

export const THEME_PALETTES = [
  {
    id: 'emerald',
    name: 'Emerald SaaS',
    primary: '#166534',
    secondary: '#12263A',
    bg: '#FFFFFF',
    text: '#0F172A',
    font: 'Inter, sans-serif',
    previewBadge: 'Popular',
  },
  {
    id: 'obsidian',
    name: 'Obsidian Dark',
    primary: '#10B981',
    secondary: '#38BDF8',
    bg: '#0F172A',
    text: '#F8FAFC',
    font: 'Inter, sans-serif',
    previewBadge: 'High Tech',
  },
  {
    id: 'navy',
    name: 'Corporate Navy',
    primary: '#1E3A8A',
    secondary: '#0284C7',
    bg: '#FFFFFF',
    text: '#1E293B',
    font: 'Plus Jakarta Sans, sans-serif',
    previewBadge: 'Enterprise',
  },
  {
    id: 'warm',
    name: 'Warm Sunset',
    primary: '#EA580C',
    secondary: '#D97706',
    bg: '#FFFBEB',
    text: '#1C1917',
    font: 'Outfit, sans-serif',
    previewBadge: 'Bold',
  },
  {
    id: 'minimal',
    name: 'Clean Minimalist',
    primary: '#18181B',
    secondary: '#52525B',
    bg: '#FFFFFF',
    text: '#27272A',
    font: 'Inter, sans-serif',
    previewBadge: 'Clean',
  },
];

export const ThemePaletteModal: React.FC<ThemePaletteModalProps> = ({
  isOpen,
  onClose,
  theme,
  onSaveTheme,
}) => {
  if (!isOpen) return null;

  const handleSelectPalette = (p: (typeof THEME_PALETTES)[0]) => {
    onSaveTheme({
      ...theme,
      primary_color: p.primary,
      secondary_color: p.secondary,
      background_color: p.bg,
      text_color: p.text,
      font_family: p.font,
      palette_id: p.id,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#166534] flex items-center justify-center">
              <Palette size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Global Design System & Palettes</h3>
              <p className="text-[11px] text-slate-400">Instantly harmonize colors, fonts, and container radius.</p>
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

        {/* Curated Palettes */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-700 block">Curated Color Palettes</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {THEME_PALETTES.map((p) => {
              const isSelected = theme.palette_id === p.id || theme.primary_color === p.primary;

              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectPalette(p)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative ${
                    isSelected
                      ? 'border-[#166534] bg-emerald-50/40 ring-1 ring-[#166534]'
                      : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">{p.name}</span>
                    <span className="text-[10px] text-slate-400 px-1.5 py-0.2 bg-slate-100 rounded">
                      {p.previewBadge}
                    </span>
                  </div>

                  {/* Swatches */}
                  <div className="flex items-center gap-1.5 mt-2">
                    <div className="w-5 h-5 rounded-md border border-black/10 shadow-2xs" style={{ backgroundColor: p.primary }} />
                    <div className="w-5 h-5 rounded-md border border-black/10 shadow-2xs" style={{ backgroundColor: p.secondary }} />
                    <div className="w-5 h-5 rounded-md border border-black/10 shadow-2xs" style={{ backgroundColor: p.bg }} />
                    <div className="w-5 h-5 rounded-md border border-black/10 shadow-2xs" style={{ backgroundColor: p.text }} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Typography */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 block">Typography Font Family</label>
          <select
            value={theme.font_family}
            onChange={(e) => onSaveTheme({ ...theme, font_family: e.target.value })}
            className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#166534]"
          >
            <option value="Inter, sans-serif">Inter (Modern SaaS & Clean)</option>
            <option value="Plus Jakarta Sans, sans-serif">Plus Jakarta Sans (Friendly & Tech)</option>
            <option value="Outfit, sans-serif">Outfit (Bold & Expressive)</option>
            <option value="Georgia, serif">Georgia (Editorial & Luxury)</option>
            <option value="system-ui, sans-serif">System Default</option>
          </select>
        </div>

        {/* Corner Radius */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 block">Global Component Radius</label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: '0px', label: 'Sharp' },
              { id: '8px', label: 'Modern' },
              { id: '14px', label: 'Curved' },
              { id: '24px', label: 'Pill' },
            ].map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => onSaveTheme({ ...theme, border_radius: r.id })}
                className={`py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                  theme.border_radius === r.id
                    ? 'bg-[#166534] text-white border-[#166534] shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-[#166534] hover:bg-[#14532d] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

