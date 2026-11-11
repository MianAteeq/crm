import React, { useState, useEffect } from 'react';
import {
  Facebook,
  Instagram,
  Plus,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Trash2,
  ExternalLink,
  Loader2,
  Lock,
  Key,
  Users,
  Info,
  CheckSquare,
  Square,
  Layers,
  X,
} from 'lucide-react';
import { socialPlannerApi } from '../../services/socialPlannerApi';
import { SocialAccount } from '../../types/socialPlanner';
import { toast } from '../../components/ui/Toast';

export default function SocialAccountsPage() {
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [checkingHealthId, setCheckingHealthId] = useState<number | null>(null);
  const [retryingWebhookId, setRetryingWebhookId] = useState<number | null>(null);
  const [disconnectModalAccount, setDisconnectModalAccount] = useState<SocialAccount | null>(null);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  // Page Selection Modal State
  const [pendingToken, setPendingToken] = useState<string | null>(null);
  const [pendingPages, setPendingPages] = useState<any[]>([]);
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
  const [loadingPending, setLoadingPending] = useState(false);
  const [selectedPageIds, setSelectedPageIds] = useState<string[]>([]);
  const [isConfirmingPages, setIsConfirmingPages] = useState(false);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const res = await socialPlannerApi.getAccounts();
      if (res.success && res.data) {
        setAccounts(res.data);
      }
    } catch (err) {
      console.error('Failed to load accounts:', err);
      toast.error('Failed to load connected social accounts');
    } finally {
      setLoading(false);
    }
  };

  const loadPendingPages = async (token: string) => {
    setLoadingPending(true);
    try {
      const res = await socialPlannerApi.getPendingPages(token);
      if (res.success && res.data?.pages) {
        setPendingPages(res.data.pages);
        // Pre-select all pages by default
        const allIds = res.data.pages.map((p: any) => p.id);
        setSelectedPageIds(allIds);
      }
    } catch (err: any) {
      console.error('Failed to load pending pages:', err);
      toast.error(err.response?.data?.message || 'Failed to load discovered Facebook Pages.');
      setIsSelectModalOpen(false);
      window.history.replaceState({}, document.title, window.location.pathname);
    } finally {
      setLoadingPending(false);
    }
  };

  useEffect(() => {
    fetchAccounts();

    // Check for success or error query param from OAuth redirect
    const params = new URLSearchParams(window.location.search);
    if (params.get('select_pages') === '1' && params.get('token')) {
      const token = params.get('token')!;
      setPendingToken(token);
      setIsSelectModalOpen(true);
      loadPendingPages(token);
    } else if (params.get('oauth') === 'success' || params.has('connected')) {
      const count = params.get('connected');
      toast.success(count ? `Successfully connected ${count} social account(s)!` : 'Successfully connected Meta account & accounts!');
      fetchAccounts();
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (params.get('oauth') === 'error' || params.has('error')) {
      toast.error(params.get('message') || params.get('error') || 'Failed to complete Meta authorization.');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const togglePageSelection = (pageId: string) => {
    setSelectedPageIds((prev) =>
      prev.includes(pageId) ? prev.filter((id) => id !== pageId) : [...prev, pageId]
    );
  };

  const handleSelectAllPages = () => {
    if (selectedPageIds.length === pendingPages.length) {
      setSelectedPageIds([]);
    } else {
      setSelectedPageIds(pendingPages.map((p) => p.id));
    }
  };

  const handleConfirmPageSelection = async () => {
    if (!pendingToken || selectedPageIds.length === 0) {
      toast.error('Please select at least one page to connect.');
      return;
    }
    setIsConfirmingPages(true);
    try {
      const res = await socialPlannerApi.confirmPageSelection(pendingToken, selectedPageIds);
      if (res.success) {
        toast.success(res.message || `Connected ${selectedPageIds.length} page(s) successfully!`);
        setIsSelectModalOpen(false);
        setPendingToken(null);
        setPendingPages([]);
        setSelectedPageIds([]);

        const params = new URLSearchParams(window.location.search);
        const returnTo = params.get('return_to');
        if (returnTo && returnTo !== '/social-planner/accounts') {
          window.location.href = returnTo + '?oauth=success&connected=' + selectedPageIds.length;
          return;
        }

        window.history.replaceState({}, document.title, window.location.pathname);
        fetchAccounts();
      }
    } catch (err: any) {
      console.error('Failed to connect selected pages:', err);
      toast.error(err.response?.data?.message || 'Failed to connect selected pages.');
    } finally {
      setIsConfirmingPages(false);
    }
  };

  const handleCancelPageSelection = () => {
    setIsSelectModalOpen(false);
    setPendingToken(null);
    setPendingPages([]);
    setSelectedPageIds([]);
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  const handleConnectMeta = async () => {
    setConnecting(true);
    try {
      const res = await socialPlannerApi.getConnectUrl(undefined, window.location.origin);
      if (res.success && res.data?.auth_url) {
        // Redirect to Meta OAuth dialog
        window.location.href = res.data.auth_url;
      } else {
        toast.error('Could not initiate Meta OAuth flow.');
      }
    } catch (err: any) {
      console.error('Meta Connect Error:', err);
      toast.error(err.response?.data?.message || 'Meta OAuth initiation failed.');
    } finally {
      setConnecting(false);
    }
  };

  const handleCheckHealth = async (account: SocialAccount) => {
    setCheckingHealthId(account.id);
    try {
      const res = await socialPlannerApi.checkAccountHealth(account.id);
      if (res.success) {
        toast.success(
          `Token valid! Expires: ${res.data?.token_expires_at || 'Never (Permanent Page Token)'}`
        );
        fetchAccounts();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Token health check failed.');
    } finally {
      setCheckingHealthId(null);
    }
  };

  const handleRetryWebhook = async (acc: SocialAccount) => {
    setRetryingWebhookId(acc.id);
    try {
      const res = await socialPlannerApi.retryWebhook(acc.id);
      if (res.success) {
        toast.success(`Webhook active for "${acc.name}"`, res.message || 'Page subscribed to Facebook webhooks.');
      } else {
        toast.error('Subscription issue', res.message || 'Could not subscribe page to webhooks.');
      }
      await fetchAccounts();
    } catch (err: any) {
      console.error('Failed to retry webhook subscription:', err);
      toast.error('Subscription retry failed', err.response?.data?.message || err.message);
    } finally {
      setRetryingWebhookId(null);
    }
  };

  const getWebhookStatusBadge = (status?: string) => {
    switch (status) {
      case 'webhook_active':
        return {
          label: 'Webhook Active',
          className: 'text-emerald-700 bg-emerald-50 border-emerald-200',
          dot: 'bg-emerald-500',
        };
      case 'webhook_failed':
        return {
          label: 'Webhook Failed',
          className: 'text-rose-700 bg-rose-50 border-rose-200',
          dot: 'bg-rose-500',
        };
      case 'disconnected':
        return {
          label: 'Disconnected',
          className: 'text-slate-600 bg-slate-100 border-slate-200',
          dot: 'bg-slate-400',
        };
      case 'webhook_pending':
      case 'connected':
      default:
        return {
          label: 'Webhook Pending',
          className: 'text-amber-700 bg-amber-50 border-amber-200',
          dot: 'bg-amber-500',
        };
    }
  };

  const handleDisconnect = async () => {
    if (!disconnectModalAccount) return;
    setIsDisconnecting(true);
    try {
      await socialPlannerApi.disconnectAccount(disconnectModalAccount.id);
      toast.success(`Disconnected ${disconnectModalAccount.name}`);
      setDisconnectModalAccount(null);
      fetchAccounts();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to disconnect account');
    } finally {
      setIsDisconnecting(false);
    }
  };

  const facebookAccounts = accounts.filter((a) => a.platform === 'facebook');
  const instagramAccounts = accounts.filter((a) => a.platform === 'instagram');

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold mb-1.5">
            <Lock size={12} />
            <span>Encrypted Token Vault (AES-256)</span>
          </div>
          <h1 className="text-xl font-bold text-slate-800">Connected Social Accounts</h1>
          <p className="text-xs text-slate-500 max-w-xl">
            Authorize and manage your Facebook Pages and Instagram Professional accounts. Tokens are securely encrypted and never shared.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleConnectMeta}
            disabled={connecting}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-[#1877F2] hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95 disabled:opacity-60"
          >
            {connecting ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Facebook size={15} />
            )}
            Connect Facebook
          </button>

          <button
            type="button"
            onClick={handleConnectMeta}
            disabled={connecting}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:opacity-95 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95 disabled:opacity-60"
          >
            {connecting ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Instagram size={15} />
            )}
            Connect Instagram
          </button>
        </div>
      </div>

      {/* Security & Token Info Banner */}
      <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-start gap-3 text-xs text-emerald-900">
        <ShieldCheck size={18} className="text-emerald-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">Meta Graph API & Data Protection</p>
          <p className="text-[11px] text-emerald-800 leading-relaxed">
            All Facebook and Instagram access tokens are encrypted with AES-256-CBC at rest in your database. Tokens are never transmitted to the browser or frontend. Long-lived page tokens do not expire under normal conditions.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200">
          <Loader2 size={32} className="animate-spin text-[#166534] mb-2" />
          <p className="text-xs font-semibold text-slate-500">Loading connected accounts...</p>
        </div>
      ) : accounts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#1877F2] flex items-center justify-center mx-auto mb-4">
            <Facebook size={32} />
          </div>
          <h2 className="text-base font-bold text-slate-800">No Social Accounts Connected Yet</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-5">
            Click the button below to authorize Facebook and import your Facebook Pages along with connected Instagram Professional accounts.
          </p>
          <button
            type="button"
            onClick={handleConnectMeta}
            disabled={connecting}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1877F2] hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
          >
            {connecting ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
            Connect Meta Account
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Section 1: Facebook Pages */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#1877F2] flex items-center justify-center">
                  <Facebook size={16} />
                </div>
                <h2 className="text-sm font-bold text-slate-800">
                  Facebook Pages ({facebookAccounts.length})
                </h2>
              </div>
            </div>

            {facebookAccounts.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No Facebook Pages connected.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {facebookAccounts.map((acc) => (
                  <div
                    key={acc.id}
                    className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col justify-between space-y-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {acc.profile_picture_url ? (
                          <img
                            src={acc.profile_picture_url}
                            alt={acc.name}
                            className="w-11 h-11 rounded-full object-cover border border-slate-200 shrink-0"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-full bg-[#1877F2] text-white flex items-center justify-center text-sm font-bold shrink-0">
                            {acc.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-800 truncate">{acc.name}</p>
                          <p className="text-[11px] text-slate-400 truncate">
                            {acc.category || 'Facebook Page'}
                          </p>
                          <div className="flex items-center gap-1.5 flex-wrap mt-1">
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                              <CheckCircle2 size={10} /> Connected
                            </span>
                            {(() => {
                              const badge = getWebhookStatusBadge(acc.webhook_status);
                              return (
                                <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded border ${badge.className}`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                                  {badge.label}
                                </span>
                              );
                            })()}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Subscription error banner if any */}
                    {acc.webhook_subscription_error && (
                      <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-[11px] text-rose-800 flex items-start gap-1.5">
                        <AlertTriangle size={13} className="text-rose-600 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{acc.webhook_subscription_error}</span>
                      </div>
                    )}

                    <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span>Followers: {acc.followers_count.toLocaleString()}</span>
                        <span className="text-slate-400 font-mono">ID: {acc.account_id}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>Last Webhook: {acc.last_webhook_received_at ? new Date(acc.last_webhook_received_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' }) : 'Never'}</span>
                        <span>Synced: {acc.last_synced_at ? new Date(acc.last_synced_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Pending'}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 gap-1 flex-wrap">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleCheckHealth(acc)}
                          disabled={checkingHealthId === acc.id}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-[#166534] transition-colors cursor-pointer"
                        >
                          <RefreshCw
                            size={12}
                            className={checkingHealthId === acc.id ? 'animate-spin' : ''}
                          />
                          Check Token
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRetryWebhook(acc)}
                          disabled={retryingWebhookId === acc.id}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                          title="Retry Webhook Subscription"
                        >
                          <RefreshCw
                            size={12}
                            className={retryingWebhookId === acc.id ? 'animate-spin text-blue-600' : ''}
                          />
                          Retry Webhook
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => setDisconnectModalAccount(acc)}
                        className="text-[11px] font-bold text-rose-600 hover:text-rose-700 transition-colors cursor-pointer"
                      >
                        Disconnect
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Instagram Professional Accounts */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-rose-50 text-[#E4405F] flex items-center justify-center">
                  <Instagram size={16} />
                </div>
                <h2 className="text-sm font-bold text-slate-800">
                  Instagram Professional Accounts ({instagramAccounts.length})
                </h2>
              </div>
            </div>

            {instagramAccounts.length === 0 ? (
              <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-xs">
                    <Instagram size={20} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800">Connect Instagram Professional Account</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5 max-w-xl">
                      Connect your Instagram Business or Creator account to publish posts, reels, and manage comments. Instagram accounts must be linked to your Facebook Page in Meta Accounts Center.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleConnectMeta}
                  disabled={connecting}
                  className="inline-flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:opacity-95 text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer active:scale-95 disabled:opacity-60"
                >
                  {connecting ? <Loader2 size={14} className="animate-spin" /> : <Instagram size={14} />}
                  Connect Instagram
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {instagramAccounts.map((acc) => (
                  <div
                    key={acc.id}
                    className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col justify-between space-y-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {acc.profile_picture_url ? (
                          <img
                            src={acc.profile_picture_url}
                            alt={acc.name}
                            className="w-11 h-11 rounded-full object-cover border border-slate-200 shrink-0"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center text-sm font-bold shrink-0">
                            {acc.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-800 truncate">{acc.name}</p>
                          <p className="text-[11px] text-slate-400 truncate">
                            @{acc.username || 'instagram_account'}
                          </p>
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded mt-1">
                            <CheckCircle2 size={10} /> Professional IG
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span>Followers: {acc.followers_count.toLocaleString()}</span>
                      <span className="text-slate-400">IG ID: {acc.account_id}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => handleCheckHealth(acc)}
                        disabled={checkingHealthId === acc.id}
                        className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-600 hover:text-[#166534] transition-colors"
                      >
                        <RefreshCw
                          size={12}
                          className={checkingHealthId === acc.id ? 'animate-spin' : ''}
                        />
                        Check Health
                      </button>

                      <button
                        type="button"
                        onClick={() => setDisconnectModalAccount(acc)}
                        className="text-[11px] font-bold text-rose-600 hover:text-rose-700 transition-colors"
                      >
                        Disconnect
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Disconnect Confirmation Modal */}
      {disconnectModalAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 border border-slate-200 shadow-xl space-y-3">
            <h3 className="text-sm font-bold text-slate-800">Disconnect Account?</h3>
            <p className="text-xs text-slate-500">
              Are you sure you want to disconnect <strong>{disconnectModalAccount.name}</strong>?
              Scheduled posts for this account will be suspended.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDisconnectModalAccount(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDisconnecting}
                onClick={handleDisconnect}
                className="px-3.5 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg"
              >
                {isDisconnecting ? 'Disconnecting...' : 'Yes, Disconnect'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page Selection Modal (When User Manages Multiple Pages) */}
      {isSelectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-start justify-between bg-gradient-to-r from-emerald-50/50 to-blue-50/40">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1877F2] to-[#E1306C] flex items-center justify-center text-white shrink-0 shadow-sm">
                  <Layers size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Select Facebook Pages & Instagram Accounts</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Choose which Facebook Pages and linked Instagram accounts you want to connect to this CRM.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCancelPageSelection}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 overflow-y-auto flex-1 space-y-3">
              {loadingPending ? (
                <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2">
                  <Loader2 size={24} className="animate-spin text-[#166534]" />
                  <p className="text-xs font-medium">Discovering your Facebook Pages & Instagram accounts...</p>
                </div>
              ) : pendingPages.length === 0 ? (
                <div className="py-8 text-center text-slate-500 space-y-2">
                  <AlertTriangle size={28} className="mx-auto text-amber-500" />
                  <p className="text-xs font-semibold">No Facebook Pages found in this session.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between pb-1 text-xs">
                    <span className="text-slate-500 font-medium">
                      Found {pendingPages.length} Facebook Page{pendingPages.length > 1 ? 's' : ''}
                    </span>
                    <button
                      type="button"
                      onClick={handleSelectAllPages}
                      className="text-xs font-bold text-[#166534] hover:text-[#14532d]"
                    >
                      {selectedPageIds.length === pendingPages.length ? 'Deselect All' : 'Select All'}
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {pendingPages.map((page) => {
                      const isSelected = selectedPageIds.includes(page.id);
                      return (
                        <div
                          key={page.id}
                          onClick={() => togglePageSelection(page.id)}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer select-none ${
                            isSelected
                              ? 'border-[#166534] bg-emerald-50/30 shadow-xs'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="pt-0.5">
                              {isSelected ? (
                                <CheckSquare size={18} className="text-[#166534]" />
                              ) : (
                                <Square size={18} className="text-slate-300" />
                              )}
                            </div>

                            {/* Page Avatar */}
                            <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200 flex items-center justify-center">
                              {page.picture ? (
                                <img src={page.picture} alt={page.name} className="w-full h-full object-cover" />
                              ) : (
                                <Facebook size={20} className="text-[#1877F2]" />
                              )}
                            </div>

                            {/* Page Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-xs font-bold text-slate-800 truncate">{page.name}</p>
                                {page.already_connected && (
                                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-slate-100 text-slate-500">
                                    Connected
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-400 capitalize">{page.category || 'Facebook Page'}</p>

                              {/* Linked Instagram Badge if present */}
                              {page.instagram && (
                                <div className="mt-2 p-2 rounded-lg bg-pink-50/70 border border-pink-100 flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shrink-0">
                                    <Instagram size={13} />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p className="text-[11px] font-bold text-slate-700 truncate">
                                      @{page.instagram.username || page.instagram.name}
                                    </p>
                                    <p className="text-[10px] text-slate-500">
                                      Linked Instagram ({page.instagram.followers.toLocaleString()} followers)
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                {selectedPageIds.length} of {pendingPages.length} selected
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCancelPageSelection}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isConfirmingPages || selectedPageIds.length === 0}
                  onClick={handleConfirmPageSelection}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#166534] hover:bg-[#14532d] disabled:opacity-50 rounded-xl transition-all shadow-xs"
                >
                  {isConfirmingPages ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    `Connect Selected (${selectedPageIds.length})`
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

