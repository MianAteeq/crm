import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Upload, 
  FileSpreadsheet, 
  AlertCircle, 
  Loader2
} from 'lucide-react';
import { crmApi } from '../../services/crmApi';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: () => void;
}

export default function ImportModal({ isOpen, onClose, onImport }: ImportModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsProcessing(true);

    try {
      await crmApi.importContacts(file);
      onImport();
      onClose();
      setError(null);
    } catch (err: any) {
      console.error('Import failed:', err);
      setError(err.message || 'Failed to import contacts. Please ensure the CSV format is correct.');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderUpload = () => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
       <div className={`p-12 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-6 transition-all relative overflow-hidden ${
          isProcessing ? 'border-slate-100 bg-slate-50 opacity-80 cursor-wait' : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/50 hover:border-slate-400 cursor-pointer'
       }`}>
          {!isProcessing && (
            <input 
              type="file" 
              accept=".csv" 
              className="absolute inset-0 opacity-0 cursor-pointer" 
              onChange={handleFileUpload} 
            />
          )}
          <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center transition-all shadow-sm">
             {isProcessing ? <Loader2 size={28} className="animate-spin text-slate-900" /> : <Upload size={28} className="text-slate-400" />}
          </div>
          <div className="text-center">
             <h4 className="text-sm font-bold text-slate-900 tracking-tight">
               {isProcessing ? 'Processing Database...' : 'Drop your CSV database here'}
             </h4>
             <p className="text-xs text-slate-500 mt-2 font-medium">
               {isProcessing ? 'Importing records to your database. This might take a moment.' : 'Accepts .CSV files (max 50MB)'}
             </p>
          </div>
       </div>

       {error && (
         <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600">
            <AlertCircle size={18} />
            <p className="text-xs font-bold">{error}</p>
         </div>
       )}

       {!isProcessing && (
         <div className="grid grid-cols-1 gap-4">
            <div className="p-4 bg-white border border-slate-200 rounded-xl flex items-center gap-4 group shadow-sm opacity-60">
               <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500">
                  <FileSpreadsheet size={20} />
               </div>
               <div>
                  <p className="text-xs font-bold text-slate-900 tracking-tight uppercase">CSV Format Example</p>
                  <p className="text-[10px] text-slate-400 font-bold mt-0.5">name, phone, email, company, job_title, address, website, notes, tags</p>
               </div>
            </div>
         </div>
       )}
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
            onClick={!isProcessing ? onClose : undefined}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1001]"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl bg-white border border-slate-200 z-[1002] rounded-2xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.3)] overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
               <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 tracking-tight">Import Database</h2>
                    <p className="text-xs text-slate-500 mt-1 font-medium italic">Handling large datasets (1000+ records) automatically</p>
                  </div>
                  {!isProcessing && (
                    <button onClick={onClose} className="p-2.5 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all">
                       <X size={20} />
                    </button>
                  )}
               </div>
            </div>

            <div className="p-8">
               {renderUpload()}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
