import React, { useState } from 'react';
import { Tag, Trash2, Download, X, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Tag as TagType } from '../../types';
import { useI18n } from '../../i18n';
import { cn } from '../../lib/utils';

interface BulkActionBarProps {
  selectedCount: number;
  onClear: () => void;
  onDelete: () => void;
  onAddTag: (tagId: string) => void;
  availableTags: TagType[];
}

export default function BulkActionBar({ selectedCount, onClear, onDelete, onAddTag, availableTags }: BulkActionBarProps) {
  const { isRtl } = useI18n();
  const [showTags, setShowTags] = useState(false);

  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none w-full max-w-xl px-6"
        >
          <div className="bg-[#12263A] border border-[#166534]/40 rounded-xl shadow-2xl p-2 flex items-center justify-between gap-6 pointer-events-auto shadow-[#12263A]/40">
            <div className={cn("flex items-center gap-4", isRtl ? "pr-4 border-l border-stone-800 pl-6" : "pl-4 border-r border-stone-800 pr-6")}>
               <button 
                onClick={onClear}
                className="w-6 h-6 rounded-lg bg-stone-800 flex items-center justify-center text-white hover:bg-[#166534] transition-colors cursor-pointer"
                title={isRtl ? 'إلغاء التحديد' : 'Clear selection'}
               >
                 <X size={14} />
               </button>
               <span className="text-xs font-bold text-white whitespace-nowrap flex items-center gap-1.5">
                 <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
                 {isRtl ? `تم تحديد ${selectedCount}` : `${selectedCount} Selected`}
               </span>
            </div>

            <div className={cn("flex items-center gap-2", isRtl ? "pl-2" : "pr-2")}>
               <div className="relative">
                  <button 
                    onClick={() => setShowTags(!showTags)}
                    className={`flex items-center gap-2 px-4 py-2 text-xs font-bold transition-all rounded-lg cursor-pointer ${
                      showTags ? 'bg-white text-[#12263A]' : 'text-stone-300 hover:text-white hover:bg-[#166534]'
                    }`}
                  >
                    <Tag size={16} />
                    <span>{isRtl ? 'تطبيق وسم' : 'Apply Tag'}</span>
                    <ChevronUp size={14} className={`transition-transform duration-200 ${showTags ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {showTags && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: -4 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className={cn(
                          "absolute bottom-full mb-3 w-56 bg-white border border-stone-200 rounded-xl shadow-2xl p-2",
                          isRtl ? "left-0" : "right-0"
                        )}
                      >
                         <p className={cn("px-3 py-2 text-[10px] font-bold text-stone-400 uppercase tracking-widest border-b border-stone-100 mb-1", isRtl ? "text-right" : "text-left")}>
                           {isRtl ? 'اختر وسمًا لتطبيقه' : 'Select Tag to Apply'}
                         </p>
                         <div className="max-h-48 overflow-y-auto custom-scrollbar p-1">
                            {(availableTags || []).map(tag => (
                               <button 
                                key={tag.id}
                                onClick={() => { onAddTag(tag.id); setShowTags(false); }}
                                className={cn("w-full px-3 py-2.5 text-xs font-bold text-[#57534E] hover:bg-[#F0FDF4] hover:text-[#166534] rounded-lg transition-all cursor-pointer", isRtl ? "text-right" : "text-left")}
                               >
                                  {tag.name}
                               </button>
                            ))}
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
               </div>

               <button 
                onClick={onDelete}
                className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-red-400 hover:bg-red-500/20 rounded-lg transition-all cursor-pointer"
               >
                 <Trash2 size={16} />
                 <span>{isRtl ? 'حذف' : 'Delete'}</span>
               </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
