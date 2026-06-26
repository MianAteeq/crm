import { CheckCircle2, XCircle, AlertCircle, Clock, Phone, Building2, RefreshCw, Unplug } from 'lucide-react';
import { motion } from 'motion/react';
import { WhatsAppConnectionData } from '../../types';
import { cn } from '../../lib/utils';

interface WhatsAppStatusCardProps {
  connectionData: WhatsAppConnectionData | null;
  isLoading?: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

export function WhatsAppStatusCard({
  connectionData,
  isLoading = false,
  onConnect,
  onDisconnect
}: WhatsAppStatusCardProps) {
  const isConnected = connectionData?.status === 'connected';
  const hasError = connectionData?.status === 'error' || connectionData?.status === 'expired';
  const isPending = connectionData?.status === 'pending';

  const getStatusConfig = () => {
    if (isLoading) {
      return {
        icon: RefreshCw,
        text: 'Checking connection...',
        color: 'text-blue-500 dark:text-blue-400',
        bgColor: 'bg-blue-500/10 dark:bg-blue-500/20',
        borderColor: 'border-blue-500/20 dark:border-blue-500/30',
      };
    }

    if (isConnected) {
      return {
        icon: CheckCircle2,
        text: 'Connected',
        color: 'text-emerald-500 dark:text-emerald-400',
        bgColor: 'bg-emerald-500/10 dark:bg-emerald-500/20',
        borderColor: 'border-emerald-500/20 dark:border-emerald-500/30',
      };
    }

    if (hasError) {
      return {
        icon: XCircle,
        text: connectionData?.status === 'expired' ? 'Token Expired' : 'Connection Error',
        color: 'text-red-500 dark:text-red-400',
        bgColor: 'bg-red-500/10 dark:bg-red-500/20',
        borderColor: 'border-red-500/20 dark:border-red-500/30',
      };
    }

    if (isPending) {
      return {
        icon: Clock,
        text: 'Setup Pending',
        color: 'text-amber-500 dark:text-amber-400',
        bgColor: 'bg-amber-500/10 dark:bg-amber-500/20',
        borderColor: 'border-amber-500/20 dark:border-amber-500/30',
      };
    }

    return {
      icon: AlertCircle,
      text: 'Not Connected',
      color: 'text-slate-500 dark:text-slate-400',
      bgColor: 'bg-slate-500/10 dark:bg-slate-500/20',
      borderColor: 'border-slate-500/20 dark:border-slate-500/30',
    };
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-[#6D4AFF] to-[#8B5CF6] rounded-xl flex items-center justify-center shadow-lg shadow-[#6D4AFF]/20">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  WhatsApp Business
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Cloud API Integration
                </p>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-full border',
              statusConfig.bgColor,
              statusConfig.borderColor
            )}
          >
            <StatusIcon className={cn('w-4 h-4', statusConfig.color, isLoading && 'animate-spin')} />
            <span className={cn('text-sm font-medium', statusConfig.color)}>
              {statusConfig.text}
            </span>
          </motion.div>
        </div>

        {/* Connection Details */}
        {isConnected && connectionData && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-4 mb-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Business Name */}
              <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center border border-slate-200 dark:border-slate-700">
                  <Building2 className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                    Business Name
                  </p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                    {connectionData.businessName}
                  </p>
                </div>
              </div>

              {/* Phone Number */}
              <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center border border-slate-200 dark:border-slate-700">
                  <Phone className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                    Phone Number
                  </p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white font-mono">
                    {connectionData.phoneNumber}
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <div className={cn(
                  'w-2 h-2 rounded-full',
                  connectionData.webhookConfigured
                    ? 'bg-emerald-500 animate-pulse'
                    : 'bg-amber-500'
                )}>
                </div>
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  Webhook {connectionData.webhookConfigured ? 'Active' : 'Not Configured'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className={cn(
                  'w-2 h-2 rounded-full',
                  connectionData.numberVerified
                    ? 'bg-emerald-500'
                    : 'bg-amber-500'
                )}>
                </div>
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  Number {connectionData.numberVerified ? 'Verified' : 'Not Verified'}
                </span>
              </div>
              {connectionData.lastSynced && (
                <div className="flex items-center gap-2 ml-auto">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Last synced: {new Date(connectionData.lastSynced).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Error Message */}
        {hasError && connectionData?.errorMessage && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
          >
            <p className="text-sm text-red-700 dark:text-red-300">
              <span className="font-medium">Error:</span> {connectionData.errorMessage}
            </p>
          </motion.div>
        )}

        {/* Not Connected State */}
        {!isConnected && !connectionData && (
          <div className="mb-6 text-center py-6">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Phone className="w-8 h-8 text-slate-400 dark:text-slate-500" />
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Connect your WhatsApp Business Account to start sending messages
            </p>
          </div>
        )}

        {/* Action Button */}
        <div className="flex gap-3">
          {isConnected ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onDisconnect}
              disabled={isLoading}
              className="btn-premium flex-1 bg-rose-600 text-white hover:bg-rose-500 hover:shadow-xl hover:shadow-rose-600/10 font-bold"
            >
              <Unplug className="w-5 h-5" />
              Disconnect
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onConnect}
              disabled={isLoading}
              className="btn-premium-gradient flex-1"
            >
              <Phone className="w-5 h-5" />
              {hasError ? 'Reconnect WhatsApp' : 'Connect WhatsApp'}
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
