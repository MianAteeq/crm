import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, RefreshCw, Search } from 'lucide-react';
import { emailCampaignApi } from '../../services/emailCampaignApi';
import type { EmailTemplate } from '../../types/emailCampaign';

interface Props {
  selectedId: number | null;
  selectedName: string;
  onSelect: (template: EmailTemplate) => void;
}

export default function SavedEmailTemplatePicker({
  selectedId,
  selectedName,
  onSelect,
}: Props) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refresh, setRefresh] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    const timer = window.setTimeout(async () => {
      try {
        const response = await emailCampaignApi.getTemplates(
          { search: search.trim() || undefined, page },
          controller.signal,
        );
        if (!controller.signal.aborted) {
          setTemplates(response.data);
          setMeta(response.meta);
        }
      } catch (err: any) {
        if (!controller.signal.aborted)
          setError(
            err.response?.data?.message ||
              'Could not load saved templates. Try refreshing.',
          );
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 250);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [search, page, refresh]);
  return (
    <section
      className="space-y-3 rounded-2xl border border-green-200 bg-green-50/40 p-4"
      aria-label="Saved email templates"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
          <FileText size={16} className="text-green-800" /> Choose a saved
          template
        </h3>
        <Link
          to="/email-templates"
          className="text-xs font-semibold text-green-800 hover:underline"
        >
          Manage templates
        </Link>
      </div>
      <p className="text-xs text-slate-500">
        Load its subject, message, header, social links, and address. Choosing a
        template replaces the current message; edits apply to this campaign.
      </p>
      <div className="grid items-center gap-3 sm:grid-cols-[1fr_1.5fr_auto]">
        <label className="relative block">
          <Search size={14} className="absolute left-3 top-3 text-slate-400" />
          <input
            aria-label="Search saved templates"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search saved templates…"
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-xs"
          />
        </label>
        <select
          aria-label="Saved email template"
          disabled={loading || !!error}
          value={selectedId ?? ''}
          onChange={(event) => {
            const template = templates.find(
              (item) => item.id === Number(event.target.value),
            );
            if (template) onSelect(template);
          }}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs disabled:opacity-60"
        >
          <option value="" disabled>
            {loading ? 'Loading templates…' : 'Select a saved template'}
          </option>
          {selectedId && !templates.some((item) => item.id === selectedId) && (
            <option value={selectedId}>{selectedName} (selected)</option>
          )}
          {templates.map((template) => (
            <option key={template.id} value={template.id}>
              {template.name} · {template.category}
            </option>
          ))}
        </select>
        <button
          type="button"
          aria-label="Refresh saved templates"
          disabled={loading}
          onClick={() => setRefresh((value) => value + 1)}
          className="rounded-xl border border-slate-200 bg-white p-2.5 text-green-800 disabled:opacity-50"
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>
      {error ? (
        <p role="alert" className="text-xs text-rose-700">
          {error}
        </p>
      ) : !loading && templates.length === 0 ? (
        <p className="text-xs text-slate-500">
          {search
            ? 'No templates match this search.'
            : 'No saved templates yet. Create one in Email Templates, or choose a style below.'}
        </p>
      ) : null}
      {!error && meta.last_page > 1 && (
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>
            Page {meta.current_page} of {meta.last_page} · {meta.total}{' '}
            templates
          </span>
          <div className="flex gap-3">
            <button
              type="button"
              disabled={loading || page <= 1}
              onClick={() => setPage((value) => value - 1)}
              className="font-semibold text-green-800 disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={loading || page >= meta.last_page}
              onClick={() => setPage((value) => value + 1)}
              className="font-semibold text-green-800 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
