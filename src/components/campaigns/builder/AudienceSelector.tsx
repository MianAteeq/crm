import React from 'react';
import { Users, Filter, MousePointer2, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { segments as mockSegments } from '../../../data/contactsMock';

interface AudienceSelectorProps {
  value: { type: 'all' | 'segment' | 'manual'; segmentId?: string };
  onChange: (value: { type: 'all' | 'segment' | 'manual'; segmentId?: string }) => void;
}

export default function AudienceSelector({ value, onChange }: AudienceSelectorProps) {
  const options = [
    { id: 'all', label: 'All Contacts', description: 'Target every contact in your database', icon: Users, count: 5840 },
    { id: 'segment', label: 'Specific Segment', description: 'Filter by predefined dynamic segments', icon: Filter, count: null },
    { id: 'manual', label: 'Manual Selection', description: 'Pick individual contacts one by one', icon: MousePointer2, count: 0 },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {options.map((opt) => (
          <motion.button
            key={opt.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChange({ type: opt.id as any })}
            className={`p-8 rounded-2xl border text-left transition-all relative overflow-hidden shadow-sm ${
              value.type === opt.id 
                ? 'bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-900/10' 
                : 'bg-white border-slate-200 text-slate-900 hover:border-slate-400'
            }`}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all ${
              value.type === opt.id ? 'bg-white/10 text-white' : 'bg-slate-50 border border-slate-100 text-slate-400'
            }`}>
              <opt.icon size={28} />
            </div>
            <h3 className={`text-lg font-bold tracking-tight mb-2 ${value.type === opt.id ? 'text-white' : 'text-slate-900'}`}>{opt.label}</h3>
            <p className={`text-[11px] font-medium leading-relaxed ${value.type === opt.id ? 'text-slate-400' : 'text-slate-500'}`}>{opt.description}</p>
            
            {value.type === opt.id && (
              <div className="absolute top-6 right-6 text-white">
                <CheckCircle2 size={24} />
              </div>
            )}
          </motion.button>
        ))}
      </div>

      {value.type === 'segment' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 bg-white border border-slate-200 rounded-2xl space-y-6 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select Target Segment</h4>
            <span className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">
              {mockSegments.length} Available
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {mockSegments.map(segment => (
              <button
                key={segment.id}
                onClick={() => onChange({ ...value, segmentId: segment.id })}
                className={`p-4 rounded-xl border text-left transition-all ${
                  value.segmentId === segment.id 
                    ? 'bg-slate-900 border-slate-900 text-white' 
                    : 'bg-slate-50 border-slate-200 text-slate-400 hover:border-slate-400 hover:text-slate-900'
                }`}
              >
                <p className="text-[9px] font-bold uppercase tracking-widest leading-tight">{segment.name}</p>
                <p className={`text-[10px] font-bold mt-1 ${value.segmentId === segment.id ? 'text-slate-400' : 'text-slate-500'}`}>
                  {segment.count} Leads
                </p>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      <div className="p-10 bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-900 shadow-sm">
            <Users size={32} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Audience Preview</p>
            <h3 className="text-3xl font-bold text-slate-900 tracking-tight mt-1">
              {value.type === 'segment' && value.segmentId 
                ? mockSegments.find(s => s.id === value.segmentId)?.count.toLocaleString()
                : value.type === 'all' ? '5,840' : '0'}
              <span className="text-sm text-slate-400 ml-2 uppercase font-bold tracking-widest leading-none">Contacts Selected</span>
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
