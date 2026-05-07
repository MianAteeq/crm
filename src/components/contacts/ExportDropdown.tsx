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
        className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl py-2.5 px-4 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm"
      >
        <Download size={14} />
        <span>Export</span>
        <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden"
          >
            <div className="p-2 space-y-1">
               <button 
                onClick={() => { onExport('csv'); setIsOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all"
               >
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                     <FileText size={16} />
                  </div>
                  <span>Export as CSV</span>
               </button>
               <button 
                onClick={() => { onExport('excel'); setIsOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all"
               >
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500">
                     <FileSpreadsheet size={16} />
                  </div>
                  <span>Export as Excel</span>
               </button>
            </div>
            <div className="p-3 bg-slate-50 border-t border-slate-100">
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center">Includes custom fields</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
