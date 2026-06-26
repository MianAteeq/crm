import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Phone, Zap, Shield, MessageSquare, CheckCircle2, ArrowRight, Settings } from 'lucide-react';
import { WhatsAppStatusCard } from '../../components/whatsapp/WhatsAppStatusCard';
import { EmbeddedSignupModal } from '../../components/whatsapp/EmbeddedSignupModal';
import { WhatsAppDashboardWidgets } from '../../components/whatsapp/dashboard/WhatsAppDashboardWidgets';
import { WhatsAppConnectionData, WhatsAppDashboardStats } from '../../types';
import { crmApi } from '../../services/crmApi';

// Mock data for demo - replace with your actual config
const FB_APP_ID = "1333790982005297";
const FB_CONFIG_ID = "1590706469334907";

export default function WhatsAppConnectPage() {
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
          businessName: settings.business_name || 'Business Account',
          phoneNumber: settings.phone_number || 'Not Set',
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
    if (!confirm('Are you sure you want to disconnect your WhatsApp Business Account?')) {
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
      // crmApi.connectWhatsAppCloudAPI includes the Authorization header automatically
      const response = await crmApi.connectWhatsAppCloudAPI({
        code: data.code,
        waba_id: data.waba_id,
        phone_number_id: data.phone_number_id,
      });

      if (!response) throw new Error('Failed to complete WhatsApp connection');

      // Reload connection data
      await loadWhatsAppConnection();
      await loadDashboardStats();

      setError(null);
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
      title: 'Instant Setup',
      description: 'Connect your WhatsApp Business in under 2 minutes'
    },
    {
      icon: Shield,
      title: 'Secure & Compliant',
      description: 'Enterprise-grade security with Meta\'s official API'
    },
    {
      icon: MessageSquare,
      title: 'Multi-Agent Support',
      description: 'Collaborate with your team on customer conversations'
    }
  ];

  const steps = [
    'Click "Connect WhatsApp" button',
    'Authenticate with your Meta Business account',
    'Select your WhatsApp Business phone number',
    'Start sending and receiving messages!'
  ];

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto p-6 lg:p-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-2">
              WhatsApp Cloud API
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Connect your WhatsApp Business Account and start engaging with customers
            </p>
          </div>

          {connectionData?.status === 'connected' && (
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                Account Connected
              </span>
            </div>
          )}
        </motion.div>

        {/* Error Banner */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
          >
            <p className="text-sm text-red-700 dark:text-red-300">
              <span className="font-medium">Error:</span> {error}
            </p>
          </motion.div>
        )}

        {/* Dashboard Stats */}
        {connectionData?.status === 'connected' && dashboardStats && (
          <WhatsAppDashboardWidgets stats={dashboardStats} isLoading={false} />
        )}

        {/* Connection Card */}
        <WhatsAppStatusCard
          connectionData={connectionData}
          isLoading={isLoading}
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
        />

        {/* Features & Setup Guide - Only show when not connected */}
        {!connectionData && (
          <>
            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
                Why Connect WhatsApp?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="w-12 h-12 bg-[#6D4AFF]/10 dark:bg-[#6D4AFF]/20 rounded-xl flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-[#6D4AFF]" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {feature.description}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Setup Steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 lg:p-8"
            >
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
                Quick Setup Guide
              </h2>
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-8 h-8 bg-[#6D4AFF] text-white rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-slate-700 dark:text-slate-300">{step}</p>
                    </div>
                    {index < steps.length - 1 && (
                      <ArrowRight className="w-5 h-5 text-slate-400 flex-shrink-0 mt-1" />
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <span className="font-medium">💡 Requirements:</span> You need a Meta Business account and a verified WhatsApp Business phone number to connect.
                </p>
              </div>

              <div className="mt-4 p-4 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Settings className="w-5 h-5 text-slate-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Alternative: Manual Credentials Setup</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Prefer connecting manually using a permanent System User Access Token?
                    </p>
                  </div>
                </div>
                <Link
                  to="/settings/whatsapp"
                  className="btn-premium-secondary shrink-0 text-center"
                >
                  Configure Manually
                </Link>
              </div>
            </motion.div>
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
