import React, { useState, useRef, useEffect } from 'react';
import { Download, FileText, FileSpreadsheet, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ExportDropdownProps {
  onExport: (format: 'csv' | 'excel') => void;
}

export default function ExportDropdown({ onExport }: ExportDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-bg-surface/50 border border-border rounded-2xl py-3 px-5 text-[10px] font-black uppercase tracking-widest hover:bg-bg-surface transition-all"
      >
        <Download size={14} className="text-brand" />
        <span>Export</span>
        <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-48 bg-bg-surface border border-border rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl"
          >
            <div className="p-2 space-y-1">
               <button 
                onClick={() => { onExport('csv'); setIsOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-white hover:bg-white/[0.05] rounded-xl transition-all"
               >
                  <FileText size={16} className="text-blue-500" />
                  <span>Export as CSV</span>
               </button>
               <button 
                onClick={() => { onExport('excel'); setIsOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-white hover:bg-white/[0.05] rounded-xl transition-all"
               >
                  <FileSpreadsheet size={16} className="text-emerald-500" />
                  <span>Export as Excel</span>
               </button>
            </div>
            <div className="p-3 bg-bg-surface2/50 border-t border-border">
               <p className="text-[8px] text-text-muted font-bold uppercase tracking-widest text-center italic">Includes custom fields & tags</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
