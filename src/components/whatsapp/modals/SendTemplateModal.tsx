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
  Users,
  Sparkles,
  ShieldCheck,
  CheckCheck
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

export default function SendTemplateModal({
  template,
  onClose,
  onSuccess,
  initialPhone,
  recipientName: initialRecipientName,
}: SendTemplateModalProps) {
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
      setError(isRtl ? 'رقم الهاتف مطلوب للإرسال' : 'Recipient phone number is required');
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
          parameters: headerVariables.map((v) => ({ type: 'text', text: v })),
        });
      }

      if (bodyVariables.length > 0) {
        components.push({
          type: 'body',
          parameters: bodyVariables.map((v) => ({ type: 'text', text: v })),
        });
      }

      await whatsappApi.sendTemplate(template.id, phone, components, parameters);
      setSuccess(true);
      if (onSuccess) onSuccess();
      setTimeout(onClose, 1800);
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
      text: template.header.text ? replaceVariables(template.header.text, headerVariables) : template.header.text,
    },
    body: {
      ...template.body,
      text: replaceVariables(template.body.text, bodyVariables),
    },
  };

  const hasVariables = (headerVariables.length > 0 || bodyVariables.length > 0);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150",
        isRtl && "text-right"
      )}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col lg:flex-row relative border border-slate-200/90"
      >
        {/* Left Side: Configuration Form */}
        <div
          className={cn(
            "flex flex-col w-full lg:w-[430px] bg-white p-5 sm:p-6 shrink-0 overflow-y-auto max-h-[85vh] lg:max-h-[90vh]",
            isRtl ? "border-l border-slate-200/80" : "border-r border-slate-200/80"
          )}
        >
          {/* Header */}
          <div className="border-b border-slate-100 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#166534]/10 border border-[#166534]/20 flex items-center justify-center text-[#166534] shrink-0">
                <Send size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900 tracking-tight truncate">
                    {isRtl ? 'إرسال قالب واتساب' : 'Send WhatsApp Template'}
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="font-mono text-[11px] font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded truncate max-w-[170px]">
                    {template.name}
                  </span>
                  <span className="text-[10px] font-semibold text-[#166534] bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-full uppercase">
                    {template.category}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Controls */}
          <div className="space-y-4 flex-1">
            {/* Recipient Phone */}
            {!initialPhone && (
              <div className="space-y-1.5 relative">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Phone size={13} className="text-[#166534]" />
                    {isRtl ? 'رقم هاتف المستلم' : 'Recipient Phone Number'}
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowContactPicker(!showContactPicker)}
                    className={cn(
                      "text-[11px] font-semibold flex items-center gap-1 px-2.5 py-1 rounded-lg border transition-colors cursor-pointer",
                      showContactPicker
                        ? "bg-[#166534] text-white border-[#166534]"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    )}
                  >
                    <Users size={12} />
                    {isRtl ? 'اختيار من جهات الاتصال' : 'CRM Contacts'}
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
                    placeholder="+1 555 123 4567"
                    className={cn(
                      "w-full h-10 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#166534] focus:ring-1 focus:ring-[#166534] transition-all",
                      isRtl ? "pr-9 pl-3 text-right" : "pl-9 pr-3 text-left font-mono"
                    )}
                  />
                  <Phone
                    className={cn("absolute top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none", isRtl ? "right-3" : "left-3")}
                    size={14}
                  />
                </div>

                {/* Selected Contact Pill */}
                {recipientName && (
                  <div className="flex items-center justify-between gap-2 px-3 py-1.5 bg-emerald-50/80 border border-emerald-200/80 rounded-xl text-xs animate-in fade-in">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-5 h-5 rounded-full bg-[#166534] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        {recipientName.charAt(0).toUpperCase()}
                      </div>
                      <p className="font-semibold text-emerald-950 truncate text-[11px]">
                        {recipientName} <span className="font-mono text-emerald-700 font-normal">({phone})</span>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setPhone('');
                        setRecipientName('');
                      }}
                      className="text-emerald-700 hover:text-emerald-900 p-0.5 rounded cursor-pointer"
                      title="Clear contact"
                    >
                      <X size={13} />
                    </button>
                  </div>
                )}

                {/* Contact Picker Dropdown */}
                <AnimatePresence>
                  {showContactPicker && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden flex flex-col max-h-[260px]"
                    >
                      <div className="p-2 border-b border-slate-100 bg-slate-50/70">
                        <div className="relative">
                          <Search
                            size={13}
                            className={cn("absolute top-1/2 -translate-y-1/2 text-slate-400", isRtl ? "right-2.5" : "left-2.5")}
                          />
                          <input
                            type="text"
                            value={contactSearch}
                            onChange={(e) => setContactSearch(e.target.value)}
                            placeholder={isRtl ? "البحث بالاسم أو الهاتف..." : "Filter contacts by name or phone..."}
                            className={cn(
                              "w-full h-8 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:border-[#166534] focus:ring-1 focus:ring-[#166534]",
                              isRtl ? "pr-7 pl-2 text-right" : "pl-7 pr-2 text-left"
                            )}
                            autoFocus
                          />
                        </div>
                      </div>
                      <div className="flex-1 overflow-y-auto p-1 custom-scrollbar">
                        {isLoadingContacts ? (
                          <div className="flex flex-col items-center justify-center p-5 gap-1.5">
                            <Loader2 size={16} className="animate-spin text-[#166534]" />
                            <span className="text-[10px] font-semibold text-slate-400">
                              {isRtl ? 'جارٍ تحميل جهات الاتصال...' : 'Loading contacts...'}
                            </span>
                          </div>
                        ) : contacts.length === 0 ? (
                          <div className="p-5 text-center text-xs text-slate-400 italic">
                            {isRtl ? 'لم يتم العثور على جهات اتصال' : 'No matching contacts found'}
                          </div>
                        ) : (
                          contacts.map((contact) => (
                            <button
                              key={contact.id}
                              type="button"
                              onClick={() => selectContact(contact)}
                              className={cn(
                                "w-full p-2 flex items-center gap-2.5 hover:bg-slate-50 rounded-lg transition-colors group cursor-pointer",
                                isRtl ? "text-right" : "text-left"
                              )}
                            >
                              <div className="w-7 h-7 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center text-slate-600 text-xs font-bold shrink-0">
                                {contact.name?.charAt(0).toUpperCase() || 'C'}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold text-slate-900 truncate">{contact.name}</p>
                                <p className="text-[10px] text-slate-400 font-mono">{contact.phone}</p>
                              </div>
                              {isRtl ? (
                                <ChevronLeft size={13} className="text-slate-300 group-hover:text-slate-600" />
                              ) : (
                                <ChevronRight size={13} className="text-slate-300 group-hover:text-slate-600" />
                              )}
                            </button>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* If initialPhone was supplied */}
            {initialPhone && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-3">
                <div className="w-8 h-8 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold shrink-0 text-xs">
                  {recipientName?.charAt(0).toUpperCase() || 'R'}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">{recipientName || (isRtl ? 'جهة الاتصال' : 'Recipient')}</p>
                  <p className="text-[11px] text-slate-500 font-mono">{initialPhone}</p>
                </div>
              </div>
            )}

            {/* Template Variables Inputs */}
            {hasVariables ? (
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Sparkles size={13} className="text-amber-500" />
                    {isRtl ? 'تعبئة متغيرات القالب' : 'Template Dynamic Variables'}
                  </label>
                  <span className="text-[10px] text-slate-400 font-medium">Live sync</span>
                </div>

                {/* Header Variables */}
                {headerVariables.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      {isRtl ? 'متغيرات رأس الرسالة' : 'Header Parameters'}
                    </p>
                    {headerVariables.map((val, idx) => (
                      <div key={`h-var-${idx}`} className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-mono font-bold text-[#166534] bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-100">
                            {'{{'}{idx + 1}{'}}'}
                          </span>
                          <span className="text-slate-400 font-medium text-[10px] truncate">
                            {template.header.variables?.[idx] || 'Header Variable'}
                          </span>
                        </div>
                        <input
                          type="text"
                          value={val}
                          onChange={(e) => {
                            const newVars = [...headerVariables];
                            newVars[idx] = e.target.value;
                            setHeaderVariables(newVars);
                          }}
                          placeholder={isRtl ? `أدخل قيمة ${idx + 1}` : `Enter value for parameter ${idx + 1}`}
                          className="w-full h-8 px-2.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:border-[#166534] focus:ring-1 focus:ring-[#166534]"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Body Variables */}
                {bodyVariables.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      {isRtl ? 'متغيرات نص الرسالة' : 'Body Parameters'}
                    </p>
                    {bodyVariables.map((val, idx) => (
                      <div key={`b-var-${idx}`} className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-mono font-bold text-[#166534] bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-100">
                            {'{{'}{idx + 1}{'}}'}
                          </span>
                          <span className="text-slate-400 font-medium text-[10px] truncate">
                            {template.body.variables[idx] || `Param ${idx + 1}`}
                          </span>
                        </div>
                        <input
                          type="text"
                          value={val}
                          onChange={(e) => {
                            const newVars = [...bodyVariables];
                            newVars[idx] = e.target.value;
                            setBodyVariables(newVars);
                          }}
                          placeholder={isRtl ? `أدخل قيمة ${idx + 1}` : `Enter value for parameter ${idx + 1}`}
                          className="w-full h-8 px-2.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:border-[#166534] focus:ring-1 focus:ring-[#166534]"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* Informational Template Specs when template has 0 variables (eliminates empty void!) */
              <div className="bg-slate-50 rounded-xl border border-slate-200/80 p-3.5 space-y-2.5">
                <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Info size={13} className="text-[#166534]" />
                  {isRtl ? 'تفاصيل القالب' : 'Template Verification Specs'}
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-white rounded-lg border border-slate-200/60">
                    <span className="text-[10px] text-slate-400 block font-medium">Header Type</span>
                    <span className="font-bold text-slate-800 text-[11px]">{template.header.type}</span>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200/60">
                    <span className="text-[10px] text-slate-400 block font-medium">Interactive CTA</span>
                    <span className="font-bold text-slate-800 text-[11px]">
                      {template.buttons.length > 0 ? `${template.buttons.length} Button(s)` : 'None'}
                    </span>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200/60">
                    <span className="text-[10px] text-slate-400 block font-medium">Language</span>
                    <span className="font-mono font-bold text-slate-800 text-[11px]">{template.language}</span>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200/60">
                    <span className="text-[10px] text-slate-400 block font-medium">Status</span>
                    <span className="font-bold text-emerald-700 text-[11px] flex items-center gap-1">
                      <ShieldCheck size={12} />
                      Approved
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2">
                <AlertCircle size={15} className="text-rose-600 shrink-0 mt-0.5" />
                <p className="text-xs font-semibold text-rose-900 leading-tight">{error}</p>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              {isRtl ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="button"
              onClick={handleSend}
              disabled={isLoading || success}
              className={cn(
                "px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50",
                success
                  ? "bg-emerald-600 text-white"
                  : "bg-[#166534] hover:bg-[#14532d] text-white"
              )}
            >
              {isLoading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>{isRtl ? 'جارٍ الإرسال...' : 'Sending...'}</span>
                </>
              ) : success ? (
                <>
                  <CheckCircle size={14} />
                  <span>{isRtl ? 'تم الإرسال!' : 'Sent Successfully!'}</span>
                </>
              ) : (
                <>
                  <Send size={13} />
                  <span>{isRtl ? 'إرسال الآن' : 'Send Now'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Side: Live Device Preview Canvas */}
        <div className="flex-1 flex flex-col bg-slate-100/70 overflow-hidden relative border-t lg:border-t-0">
          {/* Header Bar */}
          <div className="px-5 py-3.5 flex items-center justify-between shrink-0 border-b border-slate-200/80 bg-white/70 backdrop-blur-xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800">
                {isRtl ? 'المعاينة الحية للرسالة' : 'Live WhatsApp Preview'}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                • {isRtl ? 'تحديث تلقائي' : 'Real-time recipient view'}
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center bg-white border border-slate-200/90 text-slate-400 hover:text-slate-800 rounded-lg shadow-2xs transition-colors cursor-pointer"
              title="Close modal"
            >
              <X size={15} />
            </button>
          </div>

          {/* Interactive Phone Frame Area */}
          <div className="flex-1 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <WhatsAppPreview
              template={previewTemplate}
              recipientName={recipientName}
              phone={phone}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
