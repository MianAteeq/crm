import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Globe } from 'lucide-react';
import SendingDomainsTab from './SendingDomainsTab';

export default function EmailSettingsPage() {
  const navigate = useNavigate();

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6 pb-20">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/20">
            <Globe size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Email Sending Domains</h1>
            <p className="text-sm text-slate-500">
              Verify and manage authorized email sending domains for your account
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/email-campaigns')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 border border-slate-200 px-3.5 py-2 rounded-xl bg-white shadow-sm hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft size={14} />
          Campaigns
        </button>
      </div>

      {/* Sending Domains Interface */}
      <SendingDomainsTab />
    </div>
  );
}
