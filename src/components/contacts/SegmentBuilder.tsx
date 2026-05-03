import React, { useState } from 'react';
import { Target, Plus, X, Trash2, Save, Filter, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Rule {
  id: string;
  field: string;
  operator: string;
  value: string;
}

interface SegmentBuilderProps {
  onClose: () => void;
  onSave: (segment: any) => void;
}

export default function SegmentBuilder({ onClose, onSave }: SegmentBuilderProps) {
  const [name, setName] = useState('');
  const [rules, setRules] = useState<Rule[]>([
    { id: '1', field: 'tags', operator: 'contains', value: '' }
  ]);

  const addRule = () => {
    setRules([...rules, { id: Math.random().toString(), field: 'tags', operator: 'contains', value: '' }]);
  };

  const removeRule = (id: string) => {
    setRules(rules.filter(r => r.id !== id));
  };

  const updateRule = (id: string, updates: Partial<Rule>) => {
    setRules(rules.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[105] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-bg-surface border border-border w-full max-w-2xl rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-8 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
                 <Target size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-white uppercase tracking-tight">Create Segment</h2>
                <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Build dynamic audience filters</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2.5 rounded-xl bg-bg-surface3 border border-border text-text-muted hover:text-white transition-all">
               <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
            {/* Segment Name */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-widest pl-1">Segment Name</label>
              <input 
                type="text"
                placeholder="e.g. VIP Pakistan Customers"
                className="w-full bg-bg-surface3 border border-border rounded-2xl p-4 text-xs font-bold text-white focus:outline-none focus:border-brand/40 transition-all"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Rules Engine */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pl-1">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Matching Rules</label>
                <div className="px-2 py-1 bg-brand/10 text-brand rounded-lg text-[9px] font-black tracking-widest uppercase">AND logic</div>
              </div>

              <div className="space-y-3">
                {rules.map((rule, idx) => (
                   <motion.div 
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={rule.id} 
                    className="p-4 bg-bg-surface3 border border-border rounded-2xl flex items-center gap-3 relative group"
                   >
                     <div className="flex-shrink-0 w-8 h-8 rounded-full border border-border bg-bg-surface flex items-center justify-center text-[10px] font-black text-text-muted">
                        {idx + 1}
                     </div>
                     
                     <div className="flex flex-1 gap-2">
                        <select 
                          value={rule.field}
                          onChange={(e) => updateRule(rule.id, { field: e.target.value })}
                          className="flex-1 bg-bg-surface border border-border rounded-xl p-2 text-[10px] font-bold text-white focus:outline-none"
                        >
                           <option value="tags">Tags</option>
                           <option value="status">Status</option>
                           <option value="last_activity">Last Activity</option>
                           <option value="total_campaigns">Campaign Count</option>
                        </select>

                        <select 
                          value={rule.operator}
                          onChange={(e) => updateRule(rule.id, { operator: e.target.value })}
                          className="flex-1 bg-bg-surface border border-border rounded-xl p-2 text-[10px] font-bold text-white focus:outline-none"
                        >
                           <option value="contains">Contains</option>
                           <option value="not_contains">Does not contain</option>
                           <option value="is">Is exactly</option>
                           <option value="greater_than">Is greater than</option>
                        </select>

                        <input 
                          type="text"
                          value={rule.value}
                          onChange={(e) => updateRule(rule.id, { value: e.target.value })}
                          placeholder="Value"
                          className="flex-1 bg-bg-surface border border-border rounded-xl p-2 text-[10px] font-bold text-white focus:outline-none focus:border-brand/40 shadow-inner"
                        />
                     </div>

                     <button 
                        onClick={() => removeRule(rule.id)}
                        className="p-2 text-rose-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500/10 rounded-lg"
                     >
                        <Trash2 size={14} />
                     </button>
                   </motion.div>
                ))}
              </div>

              <button 
                onClick={addRule}
                className="w-full py-4 border-2 border-dashed border-border rounded-2xl text-[10px] font-black uppercase tracking-widest text-text-muted hover:border-brand hover:text-brand transition-all flex items-center justify-center gap-2"
              >
                <Plus size={16} /> Add Condition
              </button>
            </div>

            {/* Audience Preview */}
            <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-3xl space-y-3">
               <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Potential Audience</h4>
                  <span className="text-xs font-black text-emerald-500">~1,240 Contacts</span>
               </div>
               <div className="flex -space-x-2">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full bg-bg-surface3 border-2 border-bg-surface flex items-center justify-center text-[10px] font-black text-brand">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 border-2 border-bg-surface flex items-center justify-center text-[8px] font-black text-emerald-500">
                    +1.2k
                  </div>
               </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-8 border-t border-border bg-bg-surface2/20 flex justify-end gap-4 rounded-b-[2.5rem]">
            <button onClick={onClose} className="px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-white transition-all">
              Cancel
            </button>
            <button 
              onClick={() => onSave({ name, rules })}
              className="px-8 py-4 bg-brand text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 shadow-lg shadow-brand/20 transition-all flex items-center gap-2"
            >
              <Save size={16} /> Create Segment
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
