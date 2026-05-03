import React, { useState } from 'react';
import { Tag, Trash2, Download, X, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BulkActionBarProps {
  selectedCount: number;
  onClear: () => void;
  onDelete: () => void;
  onAddTag: (tag: string) => void;
  availableTags: string[];
}

export default function BulkActionBar({ selectedCount, onClear, onDelete, onAddTag, availableTags }: BulkActionBarProps) {
  const [showTags, setShowTags] = useState(false);

  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 pointer-events-none w-full max-w-2xl px-6"
        >
          <div className="bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl p-2 flex items-center justify-between gap-6 pointer-events-auto backdrop-blur-2xl ring-4 ring-black/20">
            <div className="flex items-center gap-4 pl-4 border-r border-white/10 pr-4">
               <button 
                onClick={onClear}
                className="w-6 h-6 rounded-lg bg-brand flex items-center justify-center text-white"
               >
                 <X size={14} />
               </button>
               <span className="text-[10px] font-black uppercase tracking-widest text-white">
                 {selectedCount} Selected
               </span>
            </div>

            <div className="flex items-center gap-2 py-1 pr-2">
               <div className="relative">
                  <button 
                    onClick={() => setShowTags(!showTags)}
                    className={`flex items-center gap-2 px-3 py-2 text-[9px] font-black uppercase tracking-widest transition-all rounded-xl ${
                      showTags ? 'bg-brand text-white' : 'text-text-muted hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Tag size={14} />
                    <span>Apply Tag</span>
                    <ChevronUp size={10} className={`transition-transform ${showTags ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {showTags && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: -4 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="absolute bottom-full right-0 mb-4 w-48 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl p-2 overflow-hidden"
                      >
                         <p className="px-3 py-2 text-[8px] font-black text-text-muted uppercase tracking-widest border-b border-white/5 mb-1">Select Tag</p>
                         <div className="max-h-48 overflow-y-auto custom-scrollbar">
                            {availableTags.map(tag => (
                               <button 
                                key={tag}
                                onClick={() => { onAddTag(tag); setShowTags(false); }}
                                className="w-full text-left px-3 py-2 text-[10px] font-bold text-text-muted hover:bg-brand/10 hover:text-brand rounded-lg transition-all"
                               >
                                  # {tag}
                               </button>
                            ))}
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
               </div>

               <button 
                onClick={onDelete}
                className="flex items-center gap-2 px-3 py-2 text-[9px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
               >
                 <Trash2 size={14} />
                 <span>Delete</span>
               </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
