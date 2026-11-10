import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
  RotateCcw,
  ExternalLink,
  Facebook,
  Instagram,
  User,
  Mail,
  Phone,
  FileText,
  Layers,
} from 'lucide-react';
import { MetaLeadSubmission } from '../../types/metaLeadAds';
import { metaLeadAdsApi } from '../../services/metaLeadAdsApi';
import { toast } from '../ui/Toast';

interface LeadDetailsModalProps {
  submission: MetaLeadSubmission;
  onClose: () => void;
  onRetried: (updated: MetaLeadSubmission) => void;
}

export function LeadDetailsModal({ submission, onClose, onRetried }: LeadDetailsModalProps) {
  const [retrying, setRetrying] = useState(false);

  const handleRetry = async () => {
    setRetrying(true);
    try {
      const res = await metaLeadAdsApi.retrySubmission(submission.id);
      if (res.success && res.data) {
        toast.success('Lead submission re-processed successfully!');
        onRetried(res.data);
      }
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Retry failed.');
    } finally {
      setRetrying(false);
    }
  };

  const rawFields: Array<{ name: string; values: string[] }> =
    submission.raw_payload?.field_data || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${
              submission.platform === 'instagram' ? 'bg-pink-50 text-pink-600' : 'bg-blue-50 text-blue-600'
            }`}>
              {submission.platform === 'instagram' ? <Instagram size={18} /> : <Facebook size={18} />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">Lead Submission #{submission.leadgen_id}</h3>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                    submission.sync_status === 'synced'
                      ? 'bg-emerald-50 text-[#166534] border-emerald-200'
                      : submission.sync_status === 'duplicate'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : submission.sync_status === 'failed'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {submission.sync_status}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Form: <strong>{submission.form?.name || submission.form_id}</strong> • Received {new Date(submission.created_at).toLocaleString()}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 custom-scrollbar">
          {/* Linked CRM Contact Card */}
          {submission.contact ? (
            <div className="p-4 bg-emerald-50/60 border border-emerald-200/80 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#166534] flex items-center gap-1.5">
                  <CheckCircle2 size={14} />
                  Connected CRM Contact
                </span>
                <a
                  href={`/contacts?search=${encodeURIComponent(submission.contact.email || submission.contact.name)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-[#166534] hover:underline flex items-center gap-1"
                >
                  Open Contact <ExternalLink size={12} />
                </a>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <User size={13} className="text-emerald-700 shrink-0" />
                  <span className="font-semibold truncate">{submission.contact.name}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Mail size={13} className="text-emerald-700 shrink-0" />
                  <span className="truncate">{submission.contact.email || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Phone size={13} className="text-emerald-700 shrink-0" />
                  <span className="truncate">{submission.contact.phone || 'N/A'}</span>
                </div>
              </div>
            </div>
          ) : submission.sync_status === 'failed' ? (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl">
              <div className="flex items-start gap-2.5">
                <AlertCircle size={18} className="text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-rose-900">Sync Failed</h4>
                  <p className="text-xs text-rose-700 mt-0.5">{submission.error_message || 'Unknown processing error.'}</p>
                </div>
              </div>
            </div>
          ) : null}

          {/* Ad & Campaign Metadata */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Campaign</p>
              <p className="font-semibold text-slate-800 truncate" title={submission.campaign_name || 'N/A'}>
                {submission.campaign_name || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Ad Name</p>
              <p className="font-semibold text-slate-800 truncate" title={submission.ad_name || 'N/A'}>
                {submission.ad_name || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Platform</p>
              <p className="font-semibold text-slate-800 capitalize">{submission.platform}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Synced At</p>
              <p className="font-semibold text-slate-800">
                {submission.synced_at ? new Date(submission.synced_at).toLocaleTimeString() : 'Pending'}
              </p>
            </div>
          </div>

          {/* Form Answers Table */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <FileText size={14} className="text-slate-400" />
              Submitted Form Answers
            </h4>

            {rawFields.length === 0 ? (
              <p className="text-xs text-slate-400 py-3 text-center">No field data found in lead payload.</p>
            ) : (
              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                <div className="bg-slate-50/80 px-4 py-2 grid grid-cols-12 gap-3 text-[11px] font-bold text-slate-500 uppercase">
                  <div className="col-span-5">Field Name</div>
                  <div className="col-span-7">User Answer</div>
                </div>
                {rawFields.map((f, idx) => (
                  <div key={idx} className="px-4 py-2.5 grid grid-cols-12 gap-3 text-xs items-center hover:bg-slate-50/50">
                    <div className="col-span-5 font-bold text-slate-700 font-mono text-[11px] truncate" title={f.name}>
                      {f.name}
                    </div>
                    <div className="col-span-7 text-slate-800 font-medium">
                      {f.values?.join(', ') || <span className="text-slate-300">empty</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Close
          </button>
          {submission.sync_status === 'failed' && (
            <button
              type="button"
              disabled={retrying}
              onClick={handleRetry}
              className="px-4 py-2 bg-[#166534] hover:bg-[#14532d] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RotateCcw size={13} className={retrying ? 'animate-spin' : ''} />
              {retrying ? 'Retrying...' : 'Retry Lead Sync'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

