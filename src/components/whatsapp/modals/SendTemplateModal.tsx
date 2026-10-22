import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  User, 
  Phone, 
  AlertCircle, 
  Loader2, 
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Info,
  Search,
  MessageSquare,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../../lib/utils';
import { WhatsAppTemplate } from '../../../types/whatsapp';
import { Contact } from '../../../types';
import { whatsappApi } from '../../../services/whatsappApi';
import { crmApi } from '../../../services/crmApi';
import WhatsAppPreview from '../preview/WhatsAppPreview';
import { useI18n } from '../../../i18n';

interface SendTemplateModalProps {
  template: WhatsAppTemplate;
  onClose: () => void;
  onSuccess?: () => void;
  initialPhone?: string;
  recipientName?: string;
}

export default function SendTemplateModal({ template, onClose, onSuccess, initialPhone, recipientName: initialRecipientName }: SendTemplateModalProps) {
  const { isRtl } = useI18n();
  const [phone, setPhone] = useState(initialPhone || '');
  const [recipientName, setRecipientName] = useState(initialRecipientName || '');
  const [headerVariables, setHeaderVariables] = useState<string[]>([]);
  const [bodyVariables, setBodyVariables] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Contact Picker State
  const [showContactPicker, setShowContactPicker] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoadingContacts, setIsLoadingContacts] = useState(false);
  const [contactSearch, setContactSearch] = useState('');
  const contactPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize variables based on template
    if (template.header.variables) {
      setHeaderVariables(new Array(template.header.variables.length).fill(''));
    }
    if (template.body.variables) {
      setBodyVariables(new Array(template.body.variables.length).fill(''));
    }
  }, [template]);

  useEffect(() => {
    if (showContactPicker && contacts.length === 0) {
      fetchContacts();
    }
  }, [showContactPicker]);

  const fetchContacts = async (search: string = '') => {
    setIsLoadingContacts(true);
    try {
      const data = await crmApi.getContacts({ search });
      setContacts(data);
    } catch (err) {
      console.error('Failed to fetch contacts:', err);
    } finally {
      setIsLoadingContacts(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (showContactPicker) {
        fetchContacts(contactSearch);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [contactSearch]);

  const handleSend = async () => {
    if (!phone) {
      setError(isRtl ? 'رقم الهاتف مطلوب للإرسال' : 'Phone number is required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const components: any[] = [];
      const parameters: string[] = [...headerVariables, ...bodyVariables];

      if (headerVariables.length > 0) {
        components.push({
          type: 'header',
          parameters: headerVariables.map(v => ({ type: 'text', text: v }))
        });
      }

      if (bodyVariables.length > 0) {
        components.push({
          type: 'body',
          parameters: bodyVariables.map(v => ({ type: 'text', text: v }))
        });
      }

      await whatsappApi.sendTemplate(template.id, phone, components, parameters);
      setSuccess(true);
      if (onSuccess) onSuccess();
      setTimeout(onClose, 2000);
    } catch (err: any) {
      setError(err.message || (isRtl ? 'فشل إرسال القالب' : 'Failed to send template'));
    } finally {
      setIsLoading(false);
    }
  };

  const selectContact = (contact: Contact) => {
    setPhone(contact.phone);
    setRecipientName(contact.name);
    setShowContactPicker(false);
  };

  function replaceVariables(text: string, values: string[]) {
    let result = text;
    values.forEach((val, idx) => {
      const placeholder = `{{${idx + 1}}}`;
      result = result.replace(placeholder, val || placeholder);
    });
    return result;
  }

  // Create a preview version of the template with filled variables
  const previewTemplate: WhatsAppTemplate = {
    ...template,
    header: {
      ...template.header,
      text: template.header.text ? replaceVariables(template.header.text, headerVariables) : template.header.text
    },
    body: {
      ...template.body,
      text: replaceVariables(template.body.text, bodyVariables)
    }
  };

  return (
    <div className={cn("fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm", isRtl && "text-right")} dir={isRtl ? 'rtl' : 'ltr'}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl h-full max-h-[800px] overflow-hidden flex flex-col lg:flex-row relative border border-slate-100"
      >
        {/* Left Side: Configuration */}
        <div className={cn(
          "flex flex-col w-full lg:w-[450px] bg-white p-7 sm:p-9 shrink-0",
          isRtl ? "border-l border-slate-100" : "border-r border-slate-100"
        )}>
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
               <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-emerald-600/20 shrink-0">
                  <Send size={18} />
               </div>
               <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none">
                    {isRtl ? 'إرسال قالب رسالة' : 'Send Template'}
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
                    {isRtl ? 'إرسال فوري ومباشر' : 'Manual Trigger'}
                  </p>
               </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-6 pr-1 custom-scrollbar">
            {/* Recipient */}
            {!initialPhone && (
              <div className="space-y-3 relative">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-black text-slate-600 uppercase tracking-wider flex items-center gap-2">
                    <Phone size={13} className="text-slate-900" />
                    {isRtl ? 'رقم هاتف المستلم' : 'Recipient Phone'}
                  </label>
                  <button 
                    onClick={() => setShowContactPicker(!showContactPicker)}
                    className={cn(
                      "text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all",
                      showContactPicker ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    )}
                  >
                    <Users size={12} />
                    {isRtl ? 'اختيار جهة اتصال' : 'Select Contact'}
                  </button>
                </div>
                
                <div className="relative">
                  <input 
                    type="text"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (recipientName) setRecipientName('');
                    }}
                    placeholder="+966 50 123 4567"
                    className={cn(
                      "w-full h-12 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-100 transition-all placeholder:text-slate-300",
                      isRtl ? "pr-11 pl-4 text-right" : "pl-11 pr-4 text-left"
                    )}
                  />
                  <Phone className={cn("absolute top-1/2 -translate-y-1/2 text-slate-400", isRtl ? "right-3.5" : "left-3.5")} size={16} />
                </div>

                {recipientName && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-xl">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <p className="text-[10px] font-black text-emerald-900 uppercase">
                      {isRtl ? `جهة الاتصال: ${recipientName}` : `Selected: ${recipientName}`}
                    </p>
                    <button 
                      onClick={() => {
                        setPhone('');
                        setRecipientName('');
                      }}
                      className={cn("text-emerald-600 hover:text-emerald-900", isRtl ? "mr-auto" : "ml-auto")}
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}

                {/* Contact Picker Dropdown */}
                <AnimatePresence>
                  {showContactPicker && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[280px]"
                    >
                      <div className="p-3 border-b border-slate-100 bg-slate-50">
                        <div className="relative">
                          <Search size={14} className={cn("absolute top-1/2 -translate-y-1/2 text-slate-400", isRtl ? "right-3" : "left-3")} />
                          <input 
                            type="text"
                            value={contactSearch}
                            onChange={(e) => setContactSearch(e.target.value)}
                            placeholder={isRtl ? "البحث بالاسم أو الهاتف..." : "Search contacts..."}
                            className={cn(
                              "w-full h-9 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-none",
                              isRtl ? "pr-8 pl-3 text-right" : "pl-8 pr-3 text-left"
                            )}
                            autoFocus
                          />
                        </div>
                      </div>
                      <div className="flex-1 overflow-y-auto p-1.5 custom-scrollbar">
                        {isLoadingContacts ? (
                          <div className="flex flex-col items-center justify-center p-6 gap-2">
                            <Loader2 size={18} className="animate-spin text-slate-300" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase">
                              {isRtl ? 'جارٍ البحث...' : 'Searching...'}
                            </span>
                          </div>
                        ) : contacts.length === 0 ? (
                          <div className="p-6 text-center">
                            <p className="text-xs font-bold text-slate-400">
                              {isRtl ? 'لم يتم العثور على جهات اتصال' : 'No contacts found'}
                            </p>
                          </div>
                        ) : (
                          contacts.map((contact) => (
                            <button
                              key={contact.id}
                              onClick={() => selectContact(contact)}
                              className={cn("w-full p-2.5 flex items-center gap-3 hover:bg-slate-50 rounded-xl transition-all group", isRtl ? "text-right" : "text-left")}
                            >
                              <div className="w-8 h-8 bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center text-slate-500 group-hover:text-slate-900 shrink-0">
                                <User size={15} />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-black text-slate-900 truncate">{contact.name}</p>
                                <p className="text-[10px] font-bold text-slate-400 font-mono">{contact.phone}</p>
                              </div>
                              {isRtl ? <ChevronLeft size={14} className="text-slate-300" /> : <ChevronRight size={14} className="text-slate-300" />}
                            </button>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {initialPhone && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">
                  {isRtl ? 'الإرسال إلى' : 'Sending To'}
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 shrink-0">
                    <User size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{recipientName || (isRtl ? 'جهة الاتصال' : 'Contact')}</p>
                    <p className="text-xs font-medium text-slate-500 font-mono">{initialPhone}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Template Variables */}
            {(headerVariables.length > 0 || bodyVariables.length > 0) && (
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <label className="text-[11px] font-black text-slate-600 uppercase tracking-wider flex items-center gap-2">
                  <Info size={13} className="text-slate-900" />
                  {isRtl ? 'تعبئة متغيرات الرسالة' : 'Fill Variables'}
                </label>

                {/* Header Variables */}
                {headerVariables.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      {isRtl ? 'متغيرات رأس الرسالة' : 'Header Variables'}
                    </p>
                    {headerVariables.map((val, idx) => (
                      <div key={`h-var-${idx}`} className="group">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-black bg-slate-900 text-white px-2 py-0.5 rounded-md">{'{{'}{idx + 1}{'}}'}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">{template.header.variables?.[idx] || 'Param'}</span>
                        </div>
                        <input 
                          type="text"
                          value={val}
                          onChange={(e) => {
                            const newVars = [...headerVariables];
                            newVars[idx] = e.target.value;
                            setHeaderVariables(newVars);
                          }}
                          placeholder={isRtl ? `أدخل قيمة المتغير ${idx + 1}` : `Enter value for ${template.header.variables?.[idx] || 'header'}`}
                          className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100 transition-all shadow-sm"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Body Variables */}
                {bodyVariables.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      {isRtl ? 'متغيرات نص الرسالة' : 'Body Variables'}
                    </p>
                    {bodyVariables.map((val, idx) => (
                      <div key={`b-var-${idx}`} className="group">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-black bg-slate-900 text-white px-2 py-0.5 rounded-md">{'{{'}{idx + 1}{'}}'}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">{template.body.variables[idx] || 'Param'}</span>
                        </div>
                        <input 
                          type="text"
                          value={val}
                          onChange={(e) => {
                            const newVars = [...bodyVariables];
                            newVars[idx] = e.target.value;
                            setBodyVariables(newVars);
                          }}
                          placeholder={isRtl ? `أدخل قيمة المتغير ${idx + 1}` : `Enter value for ${template.body.variables[idx] || 'body'}`}
                          className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100 transition-all shadow-sm"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {error && (
              <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-2.5">
                <AlertCircle size={16} className="text-rose-500 shrink-0 mt-0.5" />
                <p className="text-xs font-bold text-rose-900 leading-tight">{error}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-auto pt-6 flex gap-2.5 shrink-0">
            <button 
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 py-3.5 bg-slate-100 text-slate-600 hover:text-slate-900 rounded-xl font-black text-xs uppercase tracking-wider transition-all active:scale-95"
            >
              {isRtl ? 'إلغاء' : 'Cancel'}
            </button>
            <button 
              onClick={handleSend}
              disabled={isLoading || success}
              className={cn(
                "flex-[2] flex items-center justify-center gap-2 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all active:scale-95",
                success 
                  ? "bg-emerald-600 text-white" 
                  : "bg-slate-900 text-white shadow-md hover:bg-slate-800"
              )}
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : success ? (
                <>
                  <CheckCircle size={16} />
                  {isRtl ? 'تم الإرسال!' : 'Sent!'}
                </>
              ) : (
                <>
                  <Send size={15} />
                  {isRtl ? 'إرسال الآن' : 'Send Now'}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Side: Preview */}
        <div className="flex-1 flex flex-col h-full bg-slate-50/70 overflow-hidden relative">
          <div className="px-6 py-4 flex items-center justify-between shrink-0 z-20 border-b border-slate-100 bg-white/50 backdrop-blur-sm">
            <div className="flex items-center gap-3">
               <span className="text-[10px] font-black text-slate-800 uppercase tracking-wider">
                 {isRtl ? 'المعاينة الحية للرسالة' : 'Live Preview'}
               </span>
            </div>
            <button 
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center bg-white shadow-sm border border-slate-200 text-slate-400 hover:text-slate-900 rounded-xl transition-all active:scale-90"
            >
              <X size={18} />
            </button>
          </div>
          
          <div className="flex-1 flex items-center justify-center overflow-y-auto p-6 relative z-10">
            <div className="scale-[0.85] lg:scale-[0.95] xl:scale-100 transition-all duration-300">
               <WhatsAppPreview template={previewTemplate} />
            </div>
          </div>

          <div className="p-4 shrink-0 lg:hidden bg-white border-t border-slate-100">
             <button 
               onClick={handleSend}
               disabled={isLoading || success}
               className="w-full py-4 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-wider shadow active:scale-95"
             >
               {isLoading ? (isRtl ? 'جارٍ الإرسال...' : 'Sending...') : success ? (isRtl ? 'تم الإرسال!' : 'Sent!') : (isRtl ? 'إرسال الآن' : 'Send Now')}
             </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
