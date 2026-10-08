import React, { useState, useEffect } from 'react';
import { 
  Globe, ShieldCheck, CheckCircle2, AlertTriangle, XCircle, 
  RefreshCw, Plus, Trash2, Copy, Check, ExternalLink, Info, 
  HelpCircle, Shield, ArrowRight, Lock, Clock
} from 'lucide-react';
import { emailCampaignApi } from '../../services/emailCampaignApi';
import { EmailSendingDomain, EmailSendingDomainSummary, DnsRecordItem } from '../../types/emailCampaign';
import { toast } from '../../components/ui/Toast';

export default function SendingDomainsTab() {
  const [domains, setDomains] = useState<EmailSendingDomain[]>([]);
  const [summary, setSummary] = useState<EmailSendingDomainSummary>({
    total: 0,
    verified_count: 0,
    pending_count: 0,
    can_send: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Add Domain Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newDomain, setNewDomain] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // DNS Records Modal
  const [activeDnsDomain, setActiveDnsDomain] = useState<EmailSendingDomain | null>(null);
  const [isDnsModalOpen, setIsDnsModalOpen] = useState(false);
  const [verifyingDomainId, setVerifyingDomainId] = useState<number | null>(null);

  // Copied state tracker
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const fetchDomains = async (quiet = false) => {
    if (!quiet) setIsLoading(true);
    try {
      const res = await emailCampaignApi.getSendingDomains();
      if (res.data) {
        setDomains(res.data);
      }
      if (res.summary) {
        setSummary(res.summary);
      }
    } catch (err: any) {
      toast.error('Failed to load sending domains');
    } finally {
      if (!quiet) setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDomains();
  }, []);

  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newDomain.trim().toLowerCase();
    if (!clean) {
      toast.error('Please enter a domain name');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await emailCampaignApi.addSendingDomain(clean);
      toast.success(res.message || 'Sending domain added successfully!');
      setNewDomain('');
      setIsAddModalOpen(false);
      await fetchDomains(true);

      // Immediately open DNS modal for the newly added domain so user sees what records to configure
      if (res.data) {
        setActiveDnsDomain(res.data);
        setIsDnsModalOpen(true);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to add sending domain');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyDomain = async (domain: EmailSendingDomain) => {
    setVerifyingDomainId(domain.id);
    try {
      const res = await emailCampaignApi.verifySendingDomain(domain.id);
      if (res.dns_verified) {
        toast.success(`Domain ${domain.domain} is fully verified!`);
      } else {
        toast.info(res.message || 'Verification checked. Records still pending.');
      }
      
      // Update local active modal data if open
      if (activeDnsDomain && activeDnsDomain.id === domain.id && res.data) {
        setActiveDnsDomain(res.data);
      }
      
      await fetchDomains(true);
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Verification check failed');
    } finally {
      setVerifyingDomainId(null);
    }
  };

  const handleDeleteDomain = async (domain: EmailSendingDomain) => {
    if (!window.confirm(`Are you sure you want to delete sending domain "${domain.domain}"? Campaigns using this domain will no longer be able to send.`)) {
      return;
    }

    try {
      await emailCampaignApi.deleteSendingDomain(domain.id);
      toast.success(`Domain ${domain.domain} deleted.`);
      if (activeDnsDomain?.id === domain.id) {
        setIsDnsModalOpen(false);
        setActiveDnsDomain(null);
      }
      await fetchDomains(true);
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to delete domain');
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5 w-fit">
            <CheckCircle2 size={13} className="text-emerald-600" />
            Verified
          </span>
        );
      case 'rejected':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1.5 w-fit">
            <XCircle size={13} className="text-rose-600" />
            Rejected
          </span>
        );
      case 'failed':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200 flex items-center gap-1.5 w-fit">
            <AlertTriangle size={13} className="text-red-600" />
            Failed
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1.5 w-fit">
            <Clock size={13} className="text-amber-600" />
            Pending Verification
          </span>
        );
    }
  };

  const getPill = (label: string, status: string) => {
    const isPass = status === 'pass' || status === 'verified';
    const isFail = status === 'fail' || status === 'failed';
    return (
      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
        isPass 
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
          : isFail 
          ? 'bg-rose-50 text-rose-700 border-rose-200' 
          : 'bg-slate-100 text-slate-600 border-slate-200'
      }`}>
        {label}: {isPass ? 'Pass' : isFail ? 'Failed' : 'Pending'}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* 5-STEP SETUP FLOW BANNER (Requirement 15) */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-slate-900 text-white p-6 rounded-3xl shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 bg-indigo-500/20 px-2.5 py-1 rounded-full border border-indigo-500/30">
              Deliverability & Compliance
            </span>
            <h2 className="text-lg font-bold text-white mt-1.5 tracking-tight flex items-center gap-2">
              <ShieldCheck className="text-emerald-400" size={20} />
              Sending Domain Verification Setup
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              To send marketing and cold emails with high deliverability, every organization must verify ownership of their domain via SPF, DKIM, and DMARC DNS records.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 whitespace-nowrap"
          >
            <Plus size={16} />
            Add Sending Domain
          </button>
        </div>

        {/* 5 Steps Tracker */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 border-t border-slate-800 text-[11px]">
          {[
            { step: '1', title: 'Add Domain', desc: 'Enter root or subdomain' },
            { step: '2', title: 'Add DNS Records', desc: 'SPF, DKIM, DMARC' },
            { step: '3', title: 'Verify Domain', desc: 'Confirmed & Validated' },
            { step: '4', title: 'Create Campaign', desc: 'Select verified sender' },
            { step: '5', title: 'Send Emails', desc: 'High inbox delivery' },
          ].map((s, idx) => (
            <div key={s.step} className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-0.5">
              <div className="flex items-center gap-1.5 text-indigo-300 font-bold text-[10px]">
                <span className="w-4 h-4 rounded-full bg-indigo-500/30 flex items-center justify-center text-[9px] text-white">
                  {s.step}
                </span>
                STEP {s.step}
              </div>
              <p className="font-bold text-white text-xs">{s.title}</p>
              <p className="text-[10px] text-slate-400 truncate">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* SUMMARY STATS & SENDING PERMISSION STATUS */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Sending Permission</span>
          <div className="flex items-center gap-2 mt-1">
            {summary.can_send ? (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 size={13} className="text-emerald-600" />
                Authorized to Send
              </span>
            ) : (
              <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200 flex items-center gap-1">
                <Lock size={13} className="text-rose-600" />
                Sending Blocked
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {summary.can_send 
              ? 'At least 1 domain is verified and active.' 
              : 'You must verify a domain before sending.'}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Domains</span>
          <p className="text-2xl font-bold text-slate-900">{summary.total}</p>
          <p className="text-[11px] text-slate-400">Registered on this workspace</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Verified Domains</span>
          <p className="text-2xl font-bold text-emerald-600">{summary.verified_count}</p>
          <p className="text-[11px] text-slate-400">Ready for campaign dispatch</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">Pending DNS</span>
          <p className="text-2xl font-bold text-amber-600">{summary.pending_count}</p>
          <p className="text-[11px] text-slate-400">Awaiting DNS propagation</p>
        </div>
      </div>

      {/* DOMAIN LIST SECTION */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-bold text-slate-900 tracking-tight">Your Sending Domains</h3>
            <span className="text-xs font-bold text-slate-400">({domains.length})</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setIsRefreshing(true);
                fetchDomains(true);
              }}
              disabled={isRefreshing}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-50 transition-all"
              title="Refresh domain list"
            >
              <RefreshCw size={16} className={isRefreshing ? 'animate-spin text-indigo-600' : ''} />
            </button>

            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all flex items-center gap-1.5"
            >
              <Plus size={14} />
              Add Domain
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="p-16 text-center text-xs text-slate-400 flex flex-col items-center gap-3">
            <RefreshCw size={24} className="animate-spin text-indigo-600" />
            <span>Loading domain records...</span>
          </div>
        ) : domains.length === 0 ? (
          /* EMPTY STATE (Requirement 15) */
          <div className="p-16 text-center space-y-4 max-w-md mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-inner">
              <Globe size={28} />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">No Sending Domains Verified</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Before you can send emails from the portal, you must verify at least one sending domain. This ensures high inbox placement and prevents domain spoofing.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 inline-flex items-center gap-2"
            >
              <Plus size={16} />
              Add Sending Domain
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {domains.map((dom) => (
              <div key={dom.id} className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-base font-bold text-slate-900 font-mono tracking-tight flex items-center gap-2">
                      <Globe size={18} className="text-indigo-600 shrink-0" />
                      {dom.domain}
                    </span>
                    {getStatusBadge(dom.status)}
                    {dom.mailtrap_domain_id && (
                      <span className="text-[10px] text-slate-400 font-mono">
                        ID: {dom.mailtrap_domain_id}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-0.5">
                    {getPill('SPF', dom.spf_status)}
                    {getPill('DKIM', dom.dkim_status)}
                    {getPill('DMARC', dom.dmarc_status)}

                    <span className="text-[11px] text-slate-400 ml-2">
                      Last checked: {dom.last_checked_at ? new Date(dom.last_checked_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'Never'}
                    </span>
                  </div>

                  {dom.verification_error && (
                    <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] flex items-start gap-2 max-w-2xl">
                      <Info size={14} className="text-amber-600 shrink-0 mt-0.5" />
                      <span>{dom.verification_error}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveDnsDomain(dom);
                      setIsDnsModalOpen(true);
                    }}
                    className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-1.5 shadow-xs"
                  >
                    <Info size={14} className="text-indigo-600" />
                    View DNS Records
                  </button>

                  <button
                    type="button"
                    onClick={() => handleVerifyDomain(dom)}
                    disabled={verifyingDomainId === dom.id}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm shadow-indigo-600/20 disabled:opacity-50"
                  >
                    <RefreshCw size={13} className={verifyingDomainId === dom.id ? 'animate-spin' : ''} />
                    {verifyingDomainId === dom.id ? 'Checking...' : 'Verify Domain'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteDomain(dom)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                    title="Delete domain"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ADD DOMAIN MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Plus size={18} />
                </div>
                <h3 className="text-base font-bold text-slate-900">Add Sending Domain</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAddDomain} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Domain Name *
                </label>
                <input
                  type="text"
                  required
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  placeholder="e.g. example.com or mail.example.com"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono"
                />
                <p className="text-[11px] text-slate-400 mt-1.5">
                  Enter your root domain (e.g. <code>company.com</code>) or dedicated sending subdomain (e.g. <code>mail.company.com</code>).
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-800 text-[11px]">
                  <HelpCircle size={13} className="text-indigo-600" />
                  What happens next?
                </div>
                <p className="text-[11px] text-slate-500">
                  Custom SPF, DKIM, and DMARC DNS records will be generated. You will be prompted to add them to your DNS provider (e.g. Cloudflare, Namecheap, GoDaddy).
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/20 disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting ? <RefreshCw size={14} className="animate-spin" /> : null}
                  {isSubmitting ? 'Registering domain...' : 'Add Domain'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DNS RECORDS MODAL / SCREEN (Requirement 4) */}
      {isDnsModalOpen && activeDnsDomain && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full p-6 space-y-5 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">
                      DNS Records: <span className="font-mono text-indigo-600">{activeDnsDomain.domain}</span>
                    </h3>
                    {getStatusBadge(activeDnsDomain.status)}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Add these DNS records at your domain provider, then click Verify Domain.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsDnsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-2 text-xl font-bold"
              >
                &times;
              </button>
            </div>

            {/* Provider Agnostic Instructions */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 shrink-0 space-y-1">
              <p className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                <Info size={14} className="text-indigo-600" />
                DNS Instructions for Any Provider (Cloudflare, GoDaddy, Namecheap, Route 53, etc.)
              </p>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Log into your DNS provider's dashboard and add the records listed below. If your DNS provider automatically appends your root domain, you may only need to enter the subdomain portion of the host name.
              </p>
            </div>

            {/* Records Table */}
            <div className="overflow-y-auto flex-1 border border-slate-200 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider sticky top-0">
                  <tr>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Host / Name</th>
                    <th className="py-3 px-4">Value / Points To</th>
                    <th className="py-3 px-4">Purpose</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(!activeDnsDomain.dns_records || activeDnsDomain.dns_records.length === 0) ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400 italic">
                        No specific DNS records returned yet. Click "Verify Domain" to query status.
                      </td>
                    </tr>
                  ) : (
                    activeDnsDomain.dns_records.map((rec, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="py-3.5 px-4 font-mono font-bold text-indigo-700 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded bg-indigo-50 border border-indigo-200">
                            {rec.record_type}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-800 max-w-[220px]">
                          <div className="flex items-center justify-between gap-2">
                            <span className="truncate select-all" title={rec.name}>{rec.name}</span>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(rec.name, `name-${idx}`)}
                              className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 shrink-0"
                              title="Copy Host"
                            >
                              {copiedKey === `name-${idx}` ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                            </button>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-800 max-w-[280px]">
                          <div className="flex items-center justify-between gap-2">
                            <span className="truncate select-all" title={rec.value}>{rec.value}</span>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(rec.value, `val-${idx}`)}
                              className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 shrink-0"
                              title="Copy Value"
                            >
                              {copiedKey === `val-${idx}` ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                            </button>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-slate-600 text-[11px] whitespace-nowrap">
                          {rec.purpose || 'Verification'}
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {rec.status === 'verified' || rec.status === 'pass' ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 w-fit">
                              <CheckCircle2 size={11} /> Pass
                            </span>
                          ) : rec.status === 'failed' || rec.status === 'fail' ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1 w-fit">
                              <XCircle size={11} /> Fail
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1 w-fit">
                              <Clock size={11} /> Pending
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer with Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 shrink-0">
              <span className="text-[11px] text-slate-400">
                DNS propagation can take anywhere from a few minutes up to 48 hours.
              </span>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsDnsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={() => handleVerifyDomain(activeDnsDomain)}
                  disabled={verifyingDomainId === activeDnsDomain.id}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center gap-2 disabled:opacity-50"
                >
                  <RefreshCw size={14} className={verifyingDomainId === activeDnsDomain.id ? 'animate-spin' : ''} />
                  {verifyingDomainId === activeDnsDomain.id ? 'Verifying domain records...' : 'Verify Domain'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
