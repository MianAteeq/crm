import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Loader2, CheckCircle2, AlertTriangle, Phone } from 'lucide-react';
import { facebookSDK } from '../../lib/facebook-sdk';
import { WhatsAppIcon } from './WhatsAppStatusCard';

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

      // Meta sends waba_id + phone_number_id via a window postMessage event
      // (type: 'WA_EMBEDDED_SIGNUP') when sessionInfoVersion is 3.
      // We capture it here alongside the OAuth code from fb.login.
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
            reject(new Error('Facebook SDK not loaded properly.'));
            return;
          }

          fb.login(
            (response: any) => {
              if (response.authResponse?.code) {
                resolve({
                  code:            response.authResponse.code,
                  // Merge from authResponse (older Meta versions) or from sessionInfo postMessage
                  waba_id:         response.authResponse.waba_id         || sessionInfo.waba_id         || '',
                  phone_number_id: response.authResponse.phone_number_id || sessionInfo.phone_number_id || '',
                });
              } else {
                reject(new Error('User cancelled login or did not fully authorize.'));
              }
            },
            {
              config_id: fbConfigId,
              response_type: 'code',
              override_default_response_type: true,
              extras: {
                sessionInfoVersion: '3',
                version: 'v4'
              }
            }
          );
        });

        setProgress(80);
        setState('processing');

        // Simulate processing
        await new Promise(resolve => setTimeout(resolve, 800));

        setProgress(100);
        setState('success');

        // Wait a bit to show success state
        await new Promise(resolve => setTimeout(resolve, 1500));

        onSuccess(result);
        onClose();

      } finally {
        window.removeEventListener('message', messageHandler);
      }

    } catch (error: any) {
      console.error('[EmbeddedSignup] Error:', error);
      setState('error');
      const message = error.message || 'Failed to connect WhatsApp Business Account';
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
          title: 'Initializing Connection',
          description: 'Setting up Meta authentication...',
          showProgress: true
        };
      case 'authenticating':
        return {
          icon: Phone,
          iconClass: 'text-[#25D366] animate-pulse',
          title: 'Authenticate with Meta',
          description: 'Please complete the authentication in the popup window',
          showProgress: true
        };
      case 'processing':
        return {
          icon: Loader2,
          iconClass: 'text-[#25D366] animate-spin',
          title: 'Processing Connection',
          description: 'Connecting your WhatsApp Business Account...',
          showProgress: true
        };
      case 'success':
        return {
          icon: CheckCircle2,
          iconClass: 'text-[#25D366]',
          title: 'Successfully Connected!',
          description: 'Your WhatsApp Business Account is now connected',
          showProgress: false
        };
      case 'error':
        return {
          icon: AlertTriangle,
          iconClass: 'text-red-500',
          title: 'Connection Failed',
          description: errorMessage || 'Failed to connect WhatsApp Business Account',
          showProgress: false
        };
      default:
        return {
          icon: Phone,
          iconClass: 'text-[#64748B]',
          title: 'Connect WhatsApp',
          description: 'Initializing...',
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
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#FFFFFF] rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-[#E2E8F0]"
            >
              {/* Header */}
              <div className="relative p-5 sm:p-6 border-b border-[#E2E8F0]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#F0FDF4] border border-[#25D366]/20 rounded-xl flex items-center justify-center text-[#25D366] shrink-0 shadow-xs">
                      <WhatsAppIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#12263A]">
                        WhatsApp Business
                      </h3>
                      <p className="text-xs text-[#64748B]">
                        Meta Cloud API
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
                        {progress}% Complete
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
                        Cancel
                      </button>
                      <button
                        onClick={handleRetry}
                        className="flex-1 h-10 px-4 rounded-xl font-semibold text-xs sm:text-sm text-white bg-[#25D366] hover:bg-[#20bd5a] shadow-sm transition-colors"
                      >
                        Try Again
                      </button>
                    </motion.div>
                  )}

                  {/* Info Message */}
                  {state === 'authenticating' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="mt-6 p-3.5 bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl text-left"
                    >
                      <p className="text-xs text-[#1D4ED8] leading-relaxed">
                        <span className="font-semibold">Note:</span> If the popup window doesn't appear, please check if popups are blocked in your browser.
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
