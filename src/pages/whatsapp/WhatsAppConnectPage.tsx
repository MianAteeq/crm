import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Zap, Shield, MessageSquare, CheckCircle2, ArrowRight, ArrowLeft, Settings, Info, AlertCircle } from 'lucide-react';
import { WhatsAppStatusCard } from '../../components/whatsapp/WhatsAppStatusCard';
import { FormSkeleton } from '../../components/ui/Skeleton';
import { EmbeddedSignupModal } from '../../components/whatsapp/EmbeddedSignupModal';
import { WhatsAppDashboardWidgets } from '../../components/whatsapp/dashboard/WhatsAppDashboardWidgets';
import { WhatsAppConnectionData, WhatsAppDashboardStats } from '../../types';
import { crmApi } from '../../services/crmApi';
import { useI18n } from '../../i18n';
import { LanguageSwitcher } from '../../components/common/LanguageSwitcher';
import { cn } from '../../lib/utils';

// Mock data for demo - replace with your actual config
const FB_APP_ID = "1570952461271028";
const FB_CONFIG_ID = "1397654585410667";

export default function WhatsAppConnectPage() {
  const navigate = useNavigate();
  const { isRtl } = useI18n();
  const [connectionData, setConnectionData] = useState<WhatsAppConnectionData | null>(null);
  const [dashboardStats, setDashboardStats] = useState<WhatsAppDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadWhatsAppConnection();
    loadDashboardStats();
  }, []);

  const loadWhatsAppConnection = async () => {
    try {
      setIsLoading(true);
      const settings = await crmApi.getWhatsAppSettings();

      if (settings.status === 'connected') {
        setConnectionData({
          wabaId: settings.business_account_id,
          phoneNumberId: settings.phone_number_id,
          businessName: settings.business_name || (isRtl ? 'حساب النشاط التجاري' : 'Business Account'),
          phoneNumber: settings.phone_number || (isRtl ? 'غير محدد' : 'Not Set'),
          status: 'connected',
          lastSynced: settings.last_synced || new Date().toISOString(),
          webhookConfigured: settings.webhook_status === 'active',
          numberVerified: !!settings.is_registered
        });
      }
    } catch (error: any) {
      console.error('Failed to load WhatsApp connection:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const loadDashboardStats = async () => {
    try {
      const res = await crmApi.getWhatsAppDashboardStats();
      if (res) {
        setDashboardStats({
          totalConversations: res.total_conversations || 0,
          messagesSentToday: res.messages_sent_today || 0,
          messagesReceivedToday: res.messages_received_today || 0,
          activeChats: res.active_chats || 0,
          conversationsTrend: 'neutral',
          messagesTrend: 'neutral',
          messagingLimitTier: (res as any).messaging_limit_tier || 'TIER_250'
        });
      }
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
    }
  };

  const handleConnect = () => {
    setShowSignupModal(true);
  };

  const handleDisconnect = async () => {
    if (!confirm(isRtl ? 'هل أنت متأكد من رغبتك في إلغاء ربط حساب واتساب للأعمال؟' : 'Are you sure you want to disconnect your WhatsApp Business Account?')) {
      return;
    }

    try {
      await crmApi.disconnectWhatsApp();
      setConnectionData(null);
      setDashboardStats(null);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleSignupSuccess = async (data: { code: string; waba_id: string; phone_number_id: string }) => {
    try {
      const response = await crmApi.connectWhatsAppCloudAPI({
        code: data.code,
        waba_id: data.waba_id,
        phone_number_id: data.phone_number_id,
      });

      if (!response) throw new Error(isRtl ? 'فشل إكمال عملية ربط حساب واتساب' : 'Failed to complete WhatsApp connection');

      setError(null);
      // Redirect to /settings/whatsapp to finalize registration and WABA subscription
      navigate('/settings/whatsapp?connected=true');
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleSignupError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const features = [
    {
      icon: Zap,
      title: isRtl ? 'إعداد فوري وسريع' : 'Instant Setup',
      description: isRtl ? 'اربط حسابك التجاري خلال أقل من دقيقتين عبر حوار Meta الرسمي المعتمد.' : 'Connect your WhatsApp Business in under 2 minutes'
    },
    {
      icon: Shield,
      title: isRtl ? 'أمان وامتثال متقدم' : 'Secure & Compliant',
      description: isRtl ? 'أعلى معايير الحماية والأمان بالاعتماد على واجهة Meta Cloud API الرسمية.' : "Enterprise-grade security with Meta's official API"
    },
    {
      icon: MessageSquare,
      title: isRtl ? 'دعم الفريق والوكلاء' : 'Multi-Agent Support',
      description: isRtl ? 'تعاون جماعي بين أفراد الفريق في إدارة المحادثات والردود الآلية للعملاء.' : 'Collaborate with your team on customer conversations'
    }
  ];

  const steps = [
    {
      title: isRtl ? 'انقر فوق زر "ربط حساب واتساب"' : 'Click "Connect WhatsApp" button.',
      description: isRtl ? 'افتح حوار التسجيل المدمج الرسمي من Meta مباشرة من لوحة التحكم.' : 'Initiate the official Meta embedded onboarding dialog directly from your dashboard.'
    },
    {
      title: isRtl ? 'المصادقة عبر حساب Meta Business' : 'Authenticate with your Meta Business account.',
      description: isRtl ? 'سجّل الدخول بحساب Facebook واختر أو أنشئ ملف أعمالك التجاري المعتمد.' : 'Log in with Facebook and choose or create your verified Meta Business portfolio.'
    },
    {
      title: isRtl ? 'حدد رقم هاتف واتساب للأعمال' : 'Select your WhatsApp Business phone number.',
      description: isRtl ? 'اربط رقم هاتفك المسجل أو سجّل رقماً مخصصاً جديداً لنشاطك التجاري.' : 'Link your registered phone number or register a fresh dedicated business number.'
    },
    {
      title: isRtl ? 'ابدأ إرسال واستقبال الرسائل' : 'Start sending and receiving messages.',
      description: isRtl ? 'يتم تكوين وتفعيل بيانات الاعتماد السحابية وWebhooks تلقائياً وبشكل فوري.' : 'Your Cloud API credentials and webhooks are automatically configured and active.'
    }
  ];

  return (
    <div className={cn("min-h-full bg-[#FFFFFF] font-sans", isRtl && "text-right")} dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#E2E8F0]"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-0.5 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded-full border border-emerald-200">
                Meta Cloud API
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#12263A] mb-1.5">
              {isRtl ? 'واجهة WhatsApp Cloud API الرسمية' : 'WhatsApp Cloud API'}
            </h1>
            <p className="text-sm sm:text-base text-[#64748B]">
              {isRtl ? 'اربط حساب واتساب التجاري الخاص بك وابدأ بالتواصل مع عملائك وإطلاق الحملات.' : 'Connect your WhatsApp Business Account and start engaging with customers.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher variant="dropdown" />
            {connectionData?.status === 'connected' && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#F0FDF4] border border-[#25D366]/30 rounded-full shrink-0">
                <CheckCircle2 className="w-4 h-4 text-[#25D366]" />
                <span className="text-xs sm:text-sm font-semibold text-[#166534]">
                  {isRtl ? 'الحساب متصل بنجاح' : 'Account Connected'}
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {isLoading ? (
          <FormSkeleton />
        ) : (
          <>
            {/* Error Banner */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 sm:p-5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <p className="text-sm text-red-700 leading-relaxed">
                  <span className="font-semibold">{isRtl ? 'تنبيه الخطأ:' : 'Error:'}</span> {error}
                </p>
              </motion.div>
            )}

            {/* Dashboard Stats (when connected) */}
            {connectionData?.status === 'connected' && dashboardStats && (
              <WhatsAppDashboardWidgets stats={dashboardStats} isLoading={false} />
            )}

            {/* WhatsApp Connection Card */}
            <WhatsAppStatusCard
              connectionData={connectionData}
              isLoading={isLoading}
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
            />

            {/* Features & Setup Guide - Only show when not connected */}
            {!connectionData && (
              <div className="space-y-8">
                {/* Why Connect WhatsApp Section */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <div className="mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-[#12263A] tracking-tight">
                      {isRtl ? 'لماذا ربط حساب واتساب التجاري؟' : 'Why Connect WhatsApp?'}
                    </h2>
                    <p className="text-sm text-[#64748B] mt-1">
                      {isRtl ? 'ميزات سحابية متقدمة وقنوات مراسلة موثوقة مصممة خصيصاً للمؤسسات والشركات.' : 'Powerful Cloud API features tailored for enterprise communication.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => {
                      const Icon = feature.icon;
                      return (
                        <motion.div
                          key={feature.title}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 + index * 0.08 }}
                          className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                        >
                          <div>
                            <div className="w-12 h-12 bg-[#F0FDF4] border border-[#25D366]/20 rounded-xl flex items-center justify-center text-[#166534] mb-4 shadow-xs">
                              <Icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-[#12263A] mb-2">
                              {feature.title}
                            </h3>
                            <p className="text-sm text-[#64748B] leading-relaxed">
                              {feature.description}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.section>

                {/* Quick Setup Guide */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-sm p-6 lg:p-8"
                >
                  <div className="mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-[#12263A] tracking-tight">
                      {isRtl ? 'دليل الإعداد السريع' : 'Quick Setup Guide'}
                    </h2>
                    <p className="text-sm text-[#64748B] mt-1">
                      {isRtl ? 'اتبع هذه الخطوات الـ 4 البسيطة لربط حساب واتساب للأعمال بنجاح.' : 'Follow these 4 simple steps to connect your WhatsApp Business account.'}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {steps.map((step, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: isRtl ? 16 : -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.35 + index * 0.07 }}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:bg-[#F1F5F9]/60 transition-colors"
                      >
                        <div className="flex items-start sm:items-center gap-3.5">
                          <div className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                            {index + 1}
                          </div>
                          <div>
                            <p className="text-sm sm:text-base font-semibold text-[#12263A]">
                              {step.title}
                            </p>
                            <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
                              {step.description}
                            </p>
                          </div>
                        </div>
                        {index < steps.length - 1 && (
                          <div className={cn("hidden sm:flex items-center text-[#64748B]/50 shrink-0", isRtl ? "pl-2" : "pr-2")}>
                            {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  {/* Requirements Information Panel */}
                  <div className="mt-8 p-4 sm:p-5 bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl flex items-start gap-3.5">
                    <Info className="w-5 h-5 text-[#1D4ED8] shrink-0 mt-0.5" />
                    <div className="text-sm text-[#1D4ED8] leading-relaxed">
                      <span className="font-bold">{isRtl ? 'المتطلبات:' : 'Requirements:'}</span>{' '}
                      {isRtl 
                        ? 'تحتاج إلى حساب أعمال في Meta Business Portfolio ورقم هاتف مخصص للأعمال غير مربوط بتطبيق واتساب الشخصي للبدء.' 
                        : 'You need a Meta Business account and a verified WhatsApp Business phone number to connect.'}
                    </div>
                  </div>

                  {/* Manual Credentials Configuration */}
                  <div className="mt-4 p-4 sm:p-5 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center text-[#64748B] shrink-0">
                        <Settings className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm sm:text-base font-bold text-[#12263A]">
                          {isRtl ? 'خيار بديل: الإعداد اليدوي لبيانات الاعتماد' : 'Alternative: Manual Credentials Setup'}
                        </p>
                        <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
                          {isRtl 
                            ? 'هل تفضل ربط الحساب يدوياً باستخدام رمز وصول مستخدم النظام (System User Token) ومعرف WABA؟' 
                            : 'Prefer connecting manually using a permanent System User Access Token?'}
                        </p>
                      </div>
                    </div>
                    <Link
                      to="/settings/whatsapp"
                      className="inline-flex items-center justify-center h-10 px-5 rounded-xl font-semibold text-xs sm:text-sm text-[#12263A] hover:text-[#166534] bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#CBD5E1] shadow-xs active:scale-[0.98] transition-all duration-200 shrink-0 text-center"
                    >
                      {isRtl ? 'الإعداد اليدوي' : 'Configure Manually'}
                    </Link>
                  </div>
                </motion.section>
              </div>
            )}
          </>
        )}
      </div>

      {/* Embedded Signup Modal */}
      <EmbeddedSignupModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        onSuccess={handleSignupSuccess}
        onError={handleSignupError}
        fbAppId={FB_APP_ID}
        fbConfigId={FB_CONFIG_ID}
      />
    </div>
  );
}
