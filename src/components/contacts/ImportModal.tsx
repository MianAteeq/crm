import React, { useState } from 'react';
import { X, Upload, CheckCircle2, ChevronRight, FileSpreadsheet, AlertCircle, Database, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: any[]) => void;
}

type Step = 'upload' | 'map' | 'preview';

export default function ImportModal({ isOpen, onClose, onImport }: ImportModalProps) {
  const [step, setStep] = useState<Step>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setIsUploading(true);
      setTimeout(() => {
        setIsUploading(false);
        setStep('map');
      }, 1500);
    }
  };

  const columns = ['Name', 'Phone', 'Email', 'Tags', 'Notes', 'Company', 'Job Title', 'Address', 'Birthday', 'Website'];
  const [mapping, setMapping] = useState<Record<string, string>>({
    'Full Name': 'Name',
    'WhatsApp Number': 'Phone',
    'Customer Email': 'Email',
    'Category': 'Tags',
    'Description': 'Notes',
    'Organization': 'Company',
    'Designation': 'Job Title',
    'Home Address': 'Address',
    'DOB': 'Birthday',
    'Web Link': 'Website'
  });

  const previewData = [
    { name: 'John Doe', phone: '+92 300 0000000', email: 'john@example.com', tags: 'VIP', company: 'Tech Inc', jobTitle: 'Dev' },
    { name: 'Jane Smith', phone: '+92 301 1111111', email: 'jane@example.com', tags: 'New', company: 'Fashion Co', jobTitle: 'Designer' },
    { name: 'Mark Wilson', phone: '0302 2222222', email: '', tags: '', company: '', jobTitle: '' },
  ];

  const renderUpload = () => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
       <div className="p-12 border-2 border-dashed border-border rounded-[2.5rem] bg-bg-surface2/30 flex flex-col items-center justify-center gap-6 group hover:bg-bg-surface2/50 hover:border-brand/40 transition-all cursor-pointer relative overflow-hidden">
          <input 
            type="file" 
            accept=".csv,.xlsx" 
            className="absolute inset-0 opacity-0 cursor-pointer" 
            onChange={handleFileUpload} 
          />
          <div className="w-20 h-20 rounded-3xl bg-bg-surface3 border border-border flex items-center justify-center text-text-muted group-hover:text-brand group-hover:scale-110 transition-all">
             <Upload size={32} />
          </div>
          <div className="text-center">
             <h4 className="text-sm font-black text-white uppercase tracking-widest">Drop your database here</h4>
             <p className="text-[10px] text-text-muted mt-2 font-bold">Accepts .CSV and .XLSX files (max 50MB)</p>
          </div>
       </div>

       <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-bg-surface3 border border-border rounded-2xl flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-bg-surface flex items-center justify-center text-emerald-500">
                <FileSpreadsheet size={20} />
             </div>
             <div>
                <p className="text-[10px] font-black text-white uppercase tracking-widest">Download Template</p>
                <p className="text-[9px] text-text-muted font-bold mt-0.5">Start with our sample format</p>
             </div>
          </div>
          <div className="p-4 bg-bg-surface3 border border-border rounded-2xl flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-bg-surface flex items-center justify-center text-amber-500">
                <AlertCircle size={20} />
             </div>
             <div>
                <p className="text-[10px] font-black text-white uppercase tracking-widest">Import Guidelines</p>
                <p className="text-[9px] text-text-muted font-bold mt-0.5">Avoid formatting issues</p>
             </div>
          </div>
       </div>
    </motion.div>
  );

  const renderMap = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
       <div className="flex items-center gap-3 p-4 bg-brand/5 border border-brand/20 rounded-2xl">
          <CheckCircle2 size={18} className="text-brand" />
          <div>
            <p className="text-[10px] font-black text-white uppercase tracking-widest">File Analyzed Successfully</p>
            <p className="text-[9px] text-brand font-bold">Matches found for 4/5 required fields</p>
          </div>
       </div>

       <div className="space-y-3">
          <div className="grid grid-cols-2 px-2 text-[9px] font-black text-text-muted uppercase tracking-widest">
             <span>Database Column</span>
             <span>throbtech Field</span>
          </div>
          <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
             {Object.entries(mapping).map(([csvCol, systemCol]) => (
               <div key={csvCol} className="flex items-center gap-4 bg-bg-surface3 border border-border rounded-xl p-3 group hover:border-brand/30 transition-all">
                  <div className="flex-1">
                     <p className="text-xs font-bold text-white">{csvCol}</p>
                     <p className="text-[9px] text-text-muted uppercase tracking-widest">Type: String</p>
                  </div>
                  <ArrowRight size={14} className="text-text-muted" />
                  <div className="flex-1 relative">
                     <select 
                       value={systemCol}
                       onChange={(e) => setMapping({ ...mapping, [csvCol]: e.target.value })}
                       className="w-full bg-bg-surface border border-border rounded-lg px-3 py-2 text-[10px] font-black uppercase tracking-widest text-brand focus:outline-none appearance-none"
                     >
                       {columns.map(c => <option key={c} value={c}>{c}</option>)}
                     </select>
                  </div>
               </div>
             ))}
          </div>
       </div>

       <button 
         onClick={() => setStep('preview')}
         className="w-full py-4 bg-brand text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:brightness-110 shadow-lg shadow-brand/20 transition-all"
       >
         Next: Preview Data <ChevronRight size={14} />
       </button>
    </motion.div>
  );

  const renderPreview = () => (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
       <div className="bg-bg-surface3 border border-border rounded-2xl overflow-hidden backdrop-blur-xl">
          <div className="p-4 border-b border-border bg-bg-surface flex items-center justify-between">
             <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Import Preview (Top 3)</p>
             <span className="px-2 py-1 bg-brand/10 text-brand rounded-lg text-[9px] font-black uppercase tracking-widest border border-brand/20">Validating...</span>
          </div>
          <table className="w-full text-left">
             <thead className="bg-bg-surface2/50 border-b border-border">
                <tr>
                   <th className="p-3 text-[9px] font-black text-text-muted uppercase tracking-widest">Name</th>
                   <th className="p-3 text-[9px] font-black text-text-muted uppercase tracking-widest">Phone</th>
                   <th className="p-3 text-[9px] font-black text-text-muted uppercase tracking-widest text-center">Status</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-border">
                {previewData.map((row, i) => (
                  <tr key={i} className="hover:bg-white/[0.02]">
                     <td className="p-3 text-[10px] font-bold text-white">{row.name}</td>
                     <td className="p-3 text-[10px] font-medium text-text-muted font-mono">{row.phone}</td>
                     <td className="p-3">
                        <div className="flex justify-center">
                           {row.phone.startsWith('+') ? (
                             <CheckCircle2 size={14} className="text-emerald-500" />
                           ) : (
                             <AlertCircle size={14} className="text-amber-500" />
                           )}
                        </div>
                     </td>
                  </tr>
                ))}
             </tbody>
          </table>
       </div>

       <div className="p-4 bg-bg-surface3 border border-border rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
             <h5 className="text-[10px] font-black text-white uppercase tracking-widest">Options</h5>
          </div>
          <label className="flex items-center gap-3 cursor-pointer group">
             <input type="checkbox" className="w-4 h-4 rounded border-border bg-bg-surface accent-brand" />
             <span className="text-[10px] font-bold text-text-muted group-hover:text-white transition-colors">Skip duplicate phone numbers</span>
          </label>
       </div>

       <button 
         onClick={() => {
           onImport(previewData);
           onClose();
           setStep('upload');
         }}
         className="w-full py-4 bg-brand text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:brightness-110 shadow-lg shadow-brand/20 transition-all"
       >
         Complete Import Pipeline <Database size={14} />
       </button>
    </motion.div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[1001]"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl bg-bg-surface border border-border z-[1002] rounded-[3rem] shadow-2xl overflow-hidden"
          >
            <div className="p-8 border-b border-border bg-bg-surface2/30">
               <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-black text-white uppercase tracking-tight">Import Directory</h2>
                    <div className="flex items-center gap-2 mt-2">
                       {['upload', 'map', 'preview'].map((s, i) => (
                         <React.Fragment key={s}>
                            <div className={`text-[9px] font-black uppercase tracking-widest transition-colors ${step === s ? 'text-brand' : 'text-text-muted'}`}>
                               {s}
                            </div>
                            {i < 2 && <div className="w-4 h-[1px] bg-border" />}
                         </React.Fragment>
                       ))}
                    </div>
                  </div>
                  <button onClick={onClose} className="p-3 rounded-2xl bg-bg-surface3 border border-border text-text-muted hover:text-white transition-all">
                     <X size={20} />
                  </button>
               </div>
            </div>

            <div className="p-8">
               {step === 'upload' && renderUpload()}
               {step === 'map' && renderMap()}
               {step === 'preview' && renderPreview()}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
