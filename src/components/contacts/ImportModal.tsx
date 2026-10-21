import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Upload, 
  FileSpreadsheet, 
  AlertCircle, 
  Loader2,
  ChevronRight
} from 'lucide-react';
import { crmApi } from '../../services/crmApi';
import { useI18n } from '../../i18n';
import { cn } from '../../lib/utils';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: () => void;
}

export default function ImportModal({ isOpen, onClose, onImport }: ImportModalProps) {
  const { isRtl } = useI18n();
  const [file, setFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [mappings, setMappings] = useState<Record<string, string>>({
    name: '',
    phone: '',
    email: '',
    company: '',
    job_title: '',
    address: '',
    website: '',
    notes: '',
    tags: ''
  });
  const [step, setStep] = useState<'upload' | 'mapping'>('upload');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const SYSTEM_FIELDS = [
    { key: 'name', label: isRtl ? 'الاسم' : 'Name', required: true, desc: isRtl ? 'اسم جهة الاتصال' : 'Contact display name' },
    { key: 'phone', label: isRtl ? 'رقم الهاتف' : 'Phone Number', required: true, desc: isRtl ? 'رقم واتساب متضمناً رمز الدولة' : 'WhatsApp phone number with country code' },
    { key: 'email', label: isRtl ? 'البريد الإلكتروني' : 'Email Address', required: false, desc: isRtl ? 'معرّف البريد الإلكتروني' : 'Email identifier' },
    { key: 'company', label: isRtl ? 'الشركة' : 'Company', required: false, desc: isRtl ? 'اسم المنشأة أو الشركة التابعة' : 'Associated business name' },
    { key: 'job_title', label: isRtl ? 'المسمى الوظيفي' : 'Job Title', required: false, desc: isRtl ? 'الوظيفة أو التخصص المهني' : 'Professional designation' },
    { key: 'address', label: isRtl ? 'العنوان' : 'Physical Address', required: false, desc: isRtl ? 'الموقع الفعلي للعميل' : 'Customer physical location' },
    { key: 'website', label: isRtl ? 'الموقع الإلكتروني' : 'Website / URL', required: false, desc: isRtl ? 'موقع الشركة أو الرابط' : 'Company or personal site' },
    { key: 'notes', label: isRtl ? 'الملاحظات' : 'Notes', required: false, desc: isRtl ? 'ملاحظات وبيانات وصفية إضافية' : 'Custom metadata notes' },
    { key: 'tags', label: isRtl ? 'الوسوم' : 'Tags', required: false, desc: isRtl ? 'وسوم مفصولة بفواصل (مثل: عميل مهم، عرض العيد)' : 'Comma-separated labels (e.g. VIP,Eid Promo)' }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setError(null);
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const firstLine = text.split('\n')[0] || '';
        
        // Handle CSV split with quotes support
        const parsedHeaders: string[] = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < firstLine.length; i++) {
          const char = firstLine[i];
          if (char === '"' || char === "'") {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            parsedHeaders.push(current.trim().replace(/^["']|["']$/g, ''));
            current = '';
          } else {
            current += char;
          }
        }
        if (current) {
          parsedHeaders.push(current.trim().replace(/^["']|["']$/g, ''));
        }

        if (parsedHeaders.length === 0 || (parsedHeaders.length === 1 && parsedHeaders[0] === '')) {
          throw new Error(isRtl ? 'تعذر العثور على رؤوس أعمدة في ملف CSV. يرجى التأكد من احتواء الصف الأول على أسماء الأعمدة.' : "We couldn't find any headers in this CSV file. Please make sure the first row contains column headers.");
        }

        setHeaders(parsedHeaders);
        
        // Auto-detect mappings
        const autoMappings: Record<string, string> = {
          name: '',
          phone: '',
          email: '',
          company: '',
          job_title: '',
          address: '',
          website: '',
          notes: '',
          tags: ''
        };

        const searchMatches: Record<string, string[]> = {
          name: ['name', 'full name', 'fullname', 'first name', 'contact', 'customer name', 'title name', 'الاسم', 'اسم'],
          phone: ['phone', 'mobile', 'number', 'phone number', 'cell', 'whatsapp', 'wa number', 'هاتف', 'جوال', 'واتساب'],
          email: ['email', 'mail', 'e-mail', 'email address', 'بريد', 'إيميل'],
          company: ['company', 'organization', 'firm', 'business', 'org', 'شركة', 'منشأة', 'مؤسسة'],
          job_title: ['job_title', 'title', 'role', 'job title', 'designation', 'position', 'وظيفة', 'مسمى'],
          address: ['address', 'location', 'street', 'city', 'عنوان', 'موقع', 'مدينة'],
          website: ['website', 'site', 'url', 'web', 'موقع', 'رابط'],
          notes: ['notes', 'description', 'memo', 'note', 'details', 'comment', 'ملاحظات', 'تفاصيل'],
          tags: ['tags', 'tag', 'groups', 'group', 'label', 'labels', 'وسوم', 'تصنيف']
        };

        Object.keys(autoMappings).forEach(systemField => {
          const matches = searchMatches[systemField];
          const foundHeader = parsedHeaders.find(h => {
            const hLower = h.toLowerCase().trim();
            return matches.some(match => hLower === match || hLower.includes(match));
          });
          if (foundHeader) {
            autoMappings[systemField] = foundHeader;
          }
        });

        setMappings(autoMappings);
        setStep('mapping');
      } catch (err: any) {
        setError(err.message || (isRtl ? 'فشل في قراءة رؤوس أعمدة CSV. يرجى التأكد من صحة الملف.' : 'Failed to read CSV headers. Please ensure it is a valid CSV.'));
      }
    };

    reader.onerror = () => {
      setError(isRtl ? 'فشل في قراءة الملف.' : 'Failed to read file.');
    };

    reader.readAsText(selectedFile.slice(0, 50000)); // Read first 50KB
  };

  const handleImportSubmit = async () => {
    if (!file) return;

    if (!mappings.name) {
      setError(isRtl ? 'حقل الاسم مطلوب.' : 'Name mapping is required.');
      return;
    }
    if (!mappings.phone) {
      setError(isRtl ? 'حقل الهاتف مطلوب.' : 'Phone mapping is required.');
      return;
    }

    setError(null);
    setIsProcessing(true);

    try {
      const activeMappings: Record<string, string> = {};
      Object.entries(mappings).forEach(([key, val]) => {
        if (val) {
          activeMappings[key] = val as string;
        }
      });

      await crmApi.importContacts(file, activeMappings);
      onImport();
      onClose();
      resetState();
    } catch (err: any) {
      console.error('Import failed:', err);
      setError(err.message || (isRtl ? 'فشل استيراد جهات الاتصال. يرجى التحقق من إعدادات مطابقة الأعمدة.' : 'Failed to import contacts. Please check your mapping configuration.'));
    } finally {
      setIsProcessing(false);
    }
  };

  const resetState = () => {
    setFile(null);
    setHeaders([]);
    setMappings({
      name: '',
      phone: '',
      email: '',
      company: '',
      job_title: '',
      address: '',
      website: '',
      notes: '',
      tags: ''
    });
    setStep('upload');
    setError(null);
  };

  const handleModalClose = () => {
    if (!isProcessing) {
      onClose();
      resetState();
    }
  };

  const downloadSampleCSV = () => {
    const csvContent = "name,phone,email,company,job_title,address,website,notes,tags\n" +
      "Ali Ahmad,+966501234567,ali@example.com,Tech Solutions,Manager,Riyadh Saudi Arabia,https://example.com,Key customer,\"VIP,New Customer\"\n" +
      "Fatima Zahra,+966551234567,fatima@example.com,Creative Studio,Designer,Jeddah Saudi Arabia,https://studio.com,Prefers WhatsApp outreach,\"Eid Promo\"";
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'contacts_import_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
              onChange={handleFileChange} 
            />
          )}
          <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center transition-all shadow-sm">
             <Upload size={28} className="text-slate-400" />
          </div>
          <div className="text-center">
             <h4 className="text-sm font-bold text-slate-900 tracking-tight">
               {isRtl ? 'اسحب وأفلت ملف CSV هنا' : 'Drop your CSV database here'}
             </h4>
             <p className="text-xs text-slate-500 mt-2 font-medium">
               {isRtl ? 'يقبل ملفات CSV (الحد الأقصى 50 ميجابايت)' : 'Accepts .CSV files (max 50MB)'}
             </p>
          </div>
       </div>

       {error && (
         <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-650">
            <AlertCircle size={18} />
            <p className="text-xs font-bold">{error}</p>
         </div>
       )}

       {!isProcessing && (
         <div className="grid grid-cols-1 gap-4">
            <div className="p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between group shadow-sm">
               <div className="flex items-center gap-4 opacity-70">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500">
                     <FileSpreadsheet size={20} />
                  </div>
                  <div>
                     <p className="text-xs font-bold text-slate-900 tracking-tight uppercase">
                       {isRtl ? 'نموذج جدول CSV' : 'CSV Format Example'}
                     </p>
                     <p className="text-[10px] text-slate-400 font-bold mt-0.5" dir="ltr">
                       name, phone, email, company, job_title, address, website, notes, tags
                     </p>
                  </div>
               </div>
               <button 
                  onClick={downloadSampleCSV}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all select-none shadow-sm cursor-pointer"
               >
                  {isRtl ? 'تنزيل النموذج' : 'Download Template'}
               </button>
            </div>
         </div>
       )}
    </motion.div>
  );

  const renderMapping = () => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="text-slate-600 text-xs font-semibold leading-relaxed bg-slate-50 border border-slate-100 p-4 rounded-xl">
        {isRtl 
          ? 'قم بمطابقة أعمدة ملف CSV مع بيانات جهة الاتصال المقابلة لإتمام الاستيراد بنجاح.'
          : 'Map your CSV file columns to the contact attributes. Align them accordingly to import the database correctly.'}
      </div>
      
      <div className="max-h-[380px] overflow-y-auto pr-1 space-y-4 custom-scrollbar">
        {SYSTEM_FIELDS.map((field) => (
          <div key={field.key} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-xl transition-all">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-800 tracking-tight">{field.label}</span>
                {field.required && (
                  <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider bg-red-50 border border-red-100 px-1.5 py-0.5 rounded-full">
                    {isRtl ? 'مطلوب' : 'Required'}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-400 font-medium block mt-0.5">{field.desc}</span>
            </div>
            
            <div className="w-full sm:w-[220px]">
              <select
                value={mappings[field.key]}
                onChange={(e) => setMappings(prev => ({ ...prev, [field.key]: e.target.value }))}
                className="w-full text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl px-3 py-2 focus:border-slate-400 focus:outline-none transition-all cursor-pointer"
              >
                <option value="">{isRtl ? '-- اختر عمود CSV --' : '-- Choose CSV Column --'}</option>
                {headers.map(h => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-650">
           <AlertCircle size={18} />
           <p className="text-xs font-bold">{error}</p>
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-slate-150">
        <button
          onClick={() => setStep('upload')}
          disabled={isProcessing}
          className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-650 rounded-xl text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
        >
          {isRtl ? 'العودة للتحميل' : 'Back to Upload'}
        </button>
        <button
          onClick={handleImportSubmit}
          disabled={isProcessing}
          className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 shadow-sm cursor-pointer"
        >
          {isProcessing ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>{isRtl ? `جارٍ استيراد ${file?.name}...` : `Importing ${file?.name}...`}</span>
            </>
          ) : (
            <span>{isRtl ? 'بدء الاستيراد' : 'Start Import'}</span>
          )}
        </button>
      </div>
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
            onClick={handleModalClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1001]"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={cn(
              "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl bg-white border border-slate-200 z-[1002] rounded-2xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.3)] overflow-hidden",
              isRtl && "font-arabic text-right"
            )}
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
               <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                      {isRtl ? 'استيراد قاعدة البيانات' : 'Import Database'}
                    </h2>
                    <p className="text-xs text-slate-500 mt-1 font-medium italic">
                      {step === 'upload' 
                        ? (isRtl ? 'تحميل ملف قاعدة بيانات بتنسيق CSV' : 'Upload a CSV format database file')
                        : (isRtl ? `تهيئة أعمدة الملف ${file?.name}` : `Configure columns for ${file?.name}`)}
                    </p>
                  </div>
                  {!isProcessing && (
                    <button onClick={handleModalClose} className="p-2.5 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all">
                       <X size={20} />
                    </button>
                  )}
               </div>
            </div>

            <div className="p-8">
               {step === 'upload' ? renderUpload() : renderMapping()}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
