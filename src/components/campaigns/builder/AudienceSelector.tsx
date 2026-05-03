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
            className={`p-8 rounded-[2.5rem] border text-left transition-all relative overflow-hidden ${
              value.type === opt.id 
                ? 'bg-brand/5 border-brand shadow-[0_0_40px_rgba(var(--brand-rgb),0.1)]' 
                : 'bg-bg-surface3 border-border hover:border-brand/30'
            }`}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
              value.type === opt.id ? 'bg-brand text-white' : 'bg-bg-surface border border-border text-text-muted'
            }`}>
              <opt.icon size={28} />
            </div>
            <h3 className="text-lg font-black text-white uppercase tracking-tight mb-2">{opt.label}</h3>
            <p className="text-[11px] text-text-muted font-medium leading-relaxed">{opt.description}</p>
            
            {value.type === opt.id && (
              <div className="absolute top-6 right-6 text-brand">
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
          className="p-8 bg-bg-surface border border-border rounded-[2.5rem] space-y-6"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Select Target Segment</h4>
            <span className="text-[10px] font-black text-brand uppercase tracking-widest">
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
                    ? 'bg-brand border-brand text-white' 
                    : 'bg-bg-surface3 border-border text-text-muted hover:border-brand/30 hover:text-white'
                }`}
              >
                <p className="text-[9px] font-black uppercase tracking-widest leading-tight">{segment.name}</p>
                <p className={`text-[10px] font-bold mt-1 ${value.segmentId === segment.id ? 'text-white/70' : 'text-text-muted'}`}>
                  {segment.count} Leads
                </p>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      <div className="p-10 bg-brand/5 border border-brand/20 rounded-[2.5rem] flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
            <Users size={32} />
          </div>
          <div>
            <p className="text-[10px] font-black text-brand uppercase tracking-widest">Audience Preview</p>
            <h3 className="text-3xl font-black text-white tracking-tighter mt-1">
              {value.type === 'segment' && value.segmentId 
                ? mockSegments.find(s => s.id === value.segmentId)?.count.toLocaleString()
                : value.type === 'all' ? '5,840' : '0'}
              <span className="text-sm text-text-muted ml-2 uppercase tracking-widest">Contacts Selected</span>
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
