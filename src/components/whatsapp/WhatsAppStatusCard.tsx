import { CheckCircle2, XCircle, AlertCircle, Clock, Phone, Building2, RefreshCw, Unplug } from 'lucide-react';
import { motion } from 'motion/react';
import { WhatsAppConnectionData } from '../../types';
import { cn } from '../../lib/utils';

export function WhatsAppIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.59 20.15 12.04 20.15C10.61 20.15 9.21 19.78 7.98 19.05L7.69 18.88L4.57 19.7L5.4 16.66L5.21 16.36C4.41 15.08 3.99 13.51 3.99 11.91C3.99 7.37 7.68 3.67 12.05 3.67ZM8.83 7.35C8.63 7.35 8.31 7.42 8.04 7.72C7.78 8.01 7.02 8.73 7.02 10.18C7.02 11.64 8.08 13.04 8.23 13.24C8.38 13.43 10.3 16.41 13.25 17.68C13.95 17.98 14.5 18.17 14.93 18.3C15.63 18.52 16.27 18.49 16.78 18.42C17.34 18.33 18.51 17.71 18.75 17.03C19 16.36 19 15.78 18.93 15.66C18.85 15.54 18.66 15.47 18.36 15.33C18.06 15.18 16.62 14.47 16.35 14.37C16.08 14.27 15.89 14.22 15.69 14.52C15.49 14.81 14.93 15.47 14.76 15.66C14.59 15.86 14.42 15.88 14.12 15.73C13.82 15.59 12.87 15.28 11.74 14.27C10.86 13.48 10.27 12.51 10.1 12.22C9.93 11.92 10.08 11.76 10.23 11.62C10.37 11.48 10.53 11.27 10.68 11.1C10.83 10.93 10.88 10.81 10.98 10.61C11.08 10.42 11.03 10.24 10.96 10.1C10.88 9.95 10.3 8.52 10.06 7.93C9.82 7.37 9.58 7.44 9.4 7.44C9.23 7.43 9.03 7.35 8.83 7.35Z" />
    </svg>
  );
}

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
        color: 'text-[#1D4ED8]',
        bgColor: 'bg-[#EFF6FF]',
        borderColor: 'border-[#BFDBFE]',
      };
    }

    if (isConnected) {
      return {
        icon: CheckCircle2,
        text: 'Connected',
        color: 'text-[#166534]',
        bgColor: 'bg-[#F0FDF4]',
        borderColor: 'border-[#25D366]/30',
      };
    }

    if (hasError) {
      return {
        icon: XCircle,
        text: connectionData?.status === 'expired' ? 'Token Expired' : 'Connection Error',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
      };
    }

    if (isPending) {
      return {
        icon: Clock,
        text: 'Setup Pending',
        color: 'text-amber-600',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
      };
    }

    return {
      icon: AlertCircle,
      text: 'Not Connected',
      color: 'text-[#64748B]',
      bgColor: 'bg-[#F8FAFC]',
      borderColor: 'border-[#E2E8F0]',
    };
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
    >
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 bg-[#F0FDF4] border border-[#25D366]/20 rounded-xl flex items-center justify-center text-[#25D366] shrink-0 shadow-xs">
              <WhatsAppIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#12263A]">
                WhatsApp Business
              </h3>
              <p className="text-xs sm:text-sm text-[#64748B]">
                Cloud API Integration
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={cn(
              'inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border self-start sm:self-center',
              statusConfig.bgColor,
              statusConfig.borderColor
            )}
          >
            <StatusIcon className={cn('w-4 h-4', statusConfig.color, isLoading && 'animate-spin')} />
            <span className={cn('text-xs sm:text-sm font-semibold', statusConfig.color)}>
              {statusConfig.text}
            </span>
          </motion.div>
        </div>

        {/* Connection Details (Connected State) */}
        {isConnected && connectionData && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-6 mb-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Business Name */}
              <div className="flex items-start gap-3.5 p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                <div className="w-10 h-10 bg-[#FFFFFF] rounded-lg flex items-center justify-center border border-[#E2E8F0] text-[#166534] shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">
                    Business Name
                  </p>
                  <p className="text-sm font-bold text-[#12263A] truncate">
                    {connectionData.businessName}
                  </p>
                </div>
              </div>

              {/* Phone Number */}
              <div className="flex items-start gap-3.5 p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                <div className="w-10 h-10 bg-[#FFFFFF] rounded-lg flex items-center justify-center border border-[#E2E8F0] text-[#25D366] shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">
                    Phone Number
                  </p>
                  <p className="text-sm font-bold text-[#12263A] font-mono">
                    {connectionData.phoneNumber}
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <div className={cn(
                  'w-2.5 h-2.5 rounded-full',
                  connectionData.webhookConfigured
                    ? 'bg-[#25D366] animate-pulse'
                    : 'bg-amber-500'
                )}>
                </div>
                <span className="text-xs font-medium text-[#64748B]">
                  Webhook {connectionData.webhookConfigured ? 'Active' : 'Not Configured'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className={cn(
                  'w-2.5 h-2.5 rounded-full',
                  connectionData.numberVerified
                    ? 'bg-[#25D366]'
                    : 'bg-amber-500'
                )}>
                </div>
                <span className="text-xs font-medium text-[#64748B]">
                  Number {connectionData.numberVerified ? 'Verified' : 'Not Verified'}
                </span>
              </div>
              {connectionData.lastSynced && (
                <div className="flex items-center gap-1.5 ml-auto">
                  <Clock className="w-3.5 h-3.5 text-[#64748B]" />
                  <span className="text-xs text-[#64748B]">
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
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl"
          >
            <p className="text-sm text-red-700">
              <span className="font-semibold">Error:</span> {connectionData.errorMessage}
            </p>
          </motion.div>
        )}

        {/* Not Connected State */}
        {!isConnected && !connectionData && (
          <div className="mb-8 text-center py-4 sm:py-6">
            <div className="w-20 h-20 bg-[#F0FDF4] border border-[#25D366]/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#25D366] shadow-xs">
              <WhatsAppIcon className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-bold text-[#12263A] mb-2">
              Connect your WhatsApp Business Account
            </h4>
            <p className="text-sm text-[#64748B] max-w-md mx-auto leading-relaxed">
              Authenticate via Meta Cloud API to start sending and receiving official WhatsApp messages and campaigns with your customers.
            </p>
          </div>
        )}

        {/* Action Button */}
        <div>
          {isConnected ? (
            <button
              onClick={onDisconnect}
              disabled={isLoading}
              className="w-full h-12 px-6 rounded-xl font-semibold text-sm text-rose-600 hover:text-rose-700 bg-white hover:bg-rose-50 border border-rose-200 hover:border-rose-300 active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-rose-500/10 transition-all duration-200 shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Unplug className="w-4 h-4" />
              Disconnect WhatsApp Account
            </button>
          ) : (
            <button
              onClick={onConnect}
              disabled={isLoading}
              className="w-full h-12 px-6 rounded-xl font-semibold text-sm text-white bg-[#25D366] hover:bg-[#20bd5a] active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-[#25D366]/25 transition-all duration-200 shadow-sm hover:shadow flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <WhatsAppIcon className="w-5 h-5" />
              )}
              <span>{hasError ? 'Reconnect WhatsApp' : 'Connect WhatsApp'}</span>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
