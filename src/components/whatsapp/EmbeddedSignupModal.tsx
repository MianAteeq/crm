import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Loader2, CheckCircle2, AlertTriangle, Phone } from 'lucide-react';
import { facebookSDK } from '../../lib/facebook-sdk';
import { WhatsAppIcon } from './WhatsAppStatusCard';
import { useI18n } from '../../i18n';
import { cn } from '../../lib/utils';

interface EmbeddedSignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: { code: string; waba_id: string; phone_number_id: string }) => void;
  onError: (error: string) => void;
  fbAppId: string;
  fbConfigId: string;
}

type SignupState = 'idle' | 'initializing' | 'authenticating' | 'processing' | 'success' | 'error';

export function EmbeddedSignupModal({
  isOpen,
  onClose,
  onSuccess,
  onError,
  fbAppId,
  fbConfigId
}: EmbeddedSignupModalProps) {
  const { isRtl } = useI18n();
  const [state, setState] = useState<SignupState>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isOpen) {
      initializeAndLaunch();
    } else {
      // Reset state when modal closes
      setState('idle');
      setErrorMessage('');
      setProgress(0);
    }
  }, [isOpen]);

  const initializeAndLaunch = async () => {
    try {
      setState('initializing');
      setProgress(20);

      // Initialize Facebook SDK
      await facebookSDK.init({
        appId: fbAppId,
        configId: fbConfigId,
        version: 'v21.0'
      });

      setProgress(40);
      setState('authenticating');

      // Small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));

      let sessionInfo: { waba_id: string; phone_number_id: string } = { waba_id: '', phone_number_id: '' };

      const messageHandler = (event: MessageEvent) => {
        if (event.origin !== 'https://www.facebook.com' && event.origin !== 'https://web.facebook.com') return;
        try {
          const payload = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
          if (payload?.type === 'WA_EMBEDDED_SIGNUP') {
            sessionInfo = {
              waba_id:         payload.data?.waba_id         || payload.waba_id         || '',
              phone_number_id: payload.data?.phone_number_id || payload.phone_number_id || '',
            };
            console.log('[EmbeddedSignup] sessionInfo received:', sessionInfo);
          }
        } catch {
          // ignore non-JSON messages
        }
      };

      window.addEventListener('message', messageHandler);

      try {
        // Launch WhatsApp Embedded Signup
        const result = await new Promise<any>((resolve, reject) => {
          const fb = (window as any).FB;
          if (!fb) {
            reject(new Error(isRtl ? 'تعذر تحميل حزمة Facebook SDK بشكل صحيح.' : 'Facebook SDK not loaded properly.'));
            return;
          }

          fb.login(
            (response: any) => {
              if (response.authResponse?.code) {
                resolve({
                  code:            response.authResponse.code,
                  waba_id:         response.authResponse.waba_id         || sessionInfo.waba_id         || '',
                  phone_number_id: response.authResponse.phone_number_id || sessionInfo.phone_number_id || '',
                });
              } else {
                const userCancelled = !response.authResponse;
                const err: any = new Error(
                  userCancelled
                    ? (isRtl ? 'تم إلغاء تسجيل الدخول أو إغلاق النافذة المنبثقة من قبل المستخدم.' : 'WhatsApp onboarding was cancelled by user.')
                    : (isRtl ? 'فشل تسجيل الدخول عبر فيسبوك.' : 'Facebook login failed.')
                );
                err.userCancelled = userCancelled;
                reject(err);
              }
            },
            {
              config_id: fbConfigId,
              response_type: 'code',
              override_default_response_type: true,
              extras: {
                setup: {},
                featureType: '',
                sessionInfoVersion: '3',
              }
            }
          );
        });

        setProgress(70);
        setState('processing');

        // Let user see processing state briefly
        await new Promise(resolve => setTimeout(resolve, 800));

        setProgress(100);
        setState('success');

        // Call success callback
        await new Promise(resolve => setTimeout(resolve, 600));
        onSuccess(result);

      } finally {
        window.removeEventListener('message', messageHandler);
      }

    } catch (error: any) {
      console.error('[EmbeddedSignup] Error:', error);
      setState('error');
      const message = error.message || (isRtl ? 'فشل الاتصال بحساب واتساب للأعمال' : 'Failed to connect WhatsApp Business Account');
      setErrorMessage(message);
      onError(message);
    }
  };

  const handleRetry = () => {
    setErrorMessage('');
    initializeAndLaunch();
  };

  const getStateConfig = () => {
    switch (state) {
      case 'initializing':
        return {
          icon: Loader2,
          iconClass: 'text-[#1D4ED8] animate-spin',
          title: isRtl ? 'تهيئة الاتصال' : 'Initializing Connection',
          description: isRtl ? 'جارٍ إعداد مصادقة Meta الرسمية...' : 'Setting up Meta authentication...',
          showProgress: true
        };
      case 'authenticating':
        return {
          icon: Phone,
          iconClass: 'text-[#25D366] animate-pulse',
          title: isRtl ? 'المصادقة عبر Meta' : 'Authenticate with Meta',
          description: isRtl ? 'يرجى إكمال تسجيل الدخول وتحديد رقم واتساب في النافذة المنبثقة' : 'Please complete the authentication in the popup window',
          showProgress: true
        };
      case 'processing':
        return {
          icon: Loader2,
          iconClass: 'text-[#25D366] animate-spin',
          title: isRtl ? 'معالجة وتفعيل الاتصال' : 'Processing Connection',
          description: isRtl ? 'جارٍ حفظ بيانات الاعتماد وربط حساب واتساب للأعمال...' : 'Connecting your WhatsApp Business Account...',
          showProgress: true
        };
      case 'success':
        return {
          icon: CheckCircle2,
          iconClass: 'text-[#25D366]',
          title: isRtl ? 'تم الربط بنجاح!' : 'Successfully Connected!',
          description: isRtl ? 'حساب واتساب للأعمال الخاص بك متصل الآن وجاهز للاستخدام' : 'Your WhatsApp Business Account is now connected',
          showProgress: false
        };
      case 'error':
        return {
          icon: AlertTriangle,
          iconClass: 'text-red-500',
          title: isRtl ? 'فشل إتمام الاتصال' : 'Connection Failed',
          description: errorMessage || (isRtl ? 'فشل ربط حساب واتساب للأعمال' : 'Failed to connect WhatsApp Business Account'),
          showProgress: false
        };
      default:
        return {
          icon: Phone,
          iconClass: 'text-[#64748B]',
          title: isRtl ? 'ربط واتساب' : 'Connect WhatsApp',
          description: isRtl ? 'جارٍ التهيئة...' : 'Initializing...',
          showProgress: false
        };
    }
  };

  const stateConfig = getStateConfig();
  const StateIcon = stateConfig.icon;
  const canClose = state === 'error' || state === 'idle';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={canClose ? onClose : undefined}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-sans"
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              onClick={(e) => e.stopPropagation()}
              className={cn("bg-[#FFFFFF] rounded-2xl shadow-xl max-w-md w-full border border-[#E2E8F0] overflow-hidden", isRtl && "text-right")}
            >
              {/* Header */}
              <div className="p-6 border-b border-[#E2E8F0]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#F0FDF4] border border-[#25D366]/20 rounded-xl flex items-center justify-center text-[#25D366] shrink-0">
                      <WhatsAppIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#12263A]">
                        {isRtl ? 'ربط حساب واتساب' : 'Connect WhatsApp'}
                      </h3>
                      <p className="text-xs text-[#64748B]">
                        {isRtl ? 'تسجيل Meta السحابي المدمج' : 'Meta Embedded Signup'}
                      </p>
                    </div>
                  </div>
                  {canClose && (
                    <button
                      onClick={onClose}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-[#64748B] hover:text-[#12263A] hover:bg-[#F1F5F9] transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Body */}
              <div className="p-6 sm:p-8">
                <div className="text-center">
                  {/* Icon */}
                  <motion.div
                    key={state}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-5 bg-[#F0FDF4] border border-[#25D366]/20 rounded-2xl flex items-center justify-center shadow-xs"
                  >
                    <StateIcon className={`w-8 h-8 sm:w-10 sm:h-10 ${stateConfig.iconClass}`} />
                  </motion.div>

                  {/* Title & Description */}
                  <motion.div
                    key={`${state}-text`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <h4 className="text-lg sm:text-xl font-bold text-[#12263A] mb-1.5">
                      {stateConfig.title}
                    </h4>
                    <p className="text-sm text-[#64748B] leading-relaxed max-w-sm mx-auto">
                      {stateConfig.description}
                    </p>
                  </motion.div>

                  {/* Progress Bar */}
                  {stateConfig.showProgress && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="mt-6"
                    >
                      <div className="w-full h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.5, ease: 'easeOut' }}
                          className="h-full bg-[#25D366] rounded-full"
                        />
                      </div>
                      <p className="text-xs font-semibold text-[#64748B] mt-2">
                        {isRtl ? `اكتمل ${progress}%` : `${progress}% Complete`}
                      </p>
                    </motion.div>
                  )}

                  {/* Error Actions */}
                  {state === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="flex gap-3 mt-6"
                    >
                      <button
                        onClick={onClose}
                        className="flex-1 h-10 px-4 rounded-xl font-semibold text-xs sm:text-sm text-[#12263A] hover:text-[#166534] bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#CBD5E1] shadow-xs transition-colors"
                      >
                        {isRtl ? 'إلغاء' : 'Cancel'}
                      </button>
                      <button
                        onClick={handleRetry}
                        className="flex-1 h-10 px-4 rounded-xl font-semibold text-xs sm:text-sm text-white bg-[#25D366] hover:bg-[#20bd5a] shadow-sm transition-colors"
                      >
                        {isRtl ? 'إعادة المحاولة' : 'Try Again'}
                      </button>
                    </motion.div>
                  )}

                  {/* Info Message */}
                  {state === 'authenticating' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className={cn("mt-6 p-3.5 bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl", isRtl ? "text-right" : "text-left")}
                    >
                      <p className="text-xs text-[#1D4ED8] leading-relaxed">
                        <span className="font-semibold">{isRtl ? 'ملاحظة:' : 'Note:'}</span>{' '}
                        {isRtl 
                          ? 'إذا لم تظهر نافذة Facebook المنبثقة، يرجى التأكد من السماح بالنوافذ المنبثقة (Popups) في إعدادات متصفحك.' 
                          : "If the popup window doesn't appear, please check if popups are blocked in your browser."}
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
