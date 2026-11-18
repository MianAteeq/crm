import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, CheckCircle2, Copy, Eye, Folder, Link2, Plus, RefreshCw, Sparkles, X } from 'lucide-react';
import { crmApi } from '../../services/crmApi';

type Panel = 'templates' | 'folders' | 'links' | 'bots';
const panels = [
  { key: 'templates' as Panel, label: 'Lifecycle Templates', icon: Sparkles },
  { key: 'folders' as Panel, label: 'Folders', icon: Folder },
  { key: 'links' as Panel, label: 'Tracked Links', icon: Link2 },
  { key: 'bots' as Panel, label: 'Bot Filtering', icon: Bot },
];

export default function AutomationControlCenterPage() {
  const navigate = useNavigate();
  const [active, setActive] = useState<Panel>('templates');
  const [items, setItems] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [fieldMapping, setFieldMapping] = useState('{"email":"email","phone":"phone"}');
  const [stageMapping, setStageMapping] = useState('{"new":"new"}');

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const result = active === 'templates' ? await crmApi.getAutomationTemplates()
        : active === 'folders' ? await crmApi.getAutomationFolders()
        : active === 'links' ? await crmApi.getTrackedLinks()
        : await crmApi.getAutomationBotRules();
      setItems(Array.isArray(result) ? result : result?.data || []);
    } catch (e: any) { setError(e?.message || 'Unable to load automation controls.'); }
    finally { setLoading(false); }
  }, [active]);

  useEffect(() => { void load(); }, [load]);

  const createResource = async () => {
    if (!name.trim()) { setError('Enter a name first.'); return; }
    setSaving(true); setError(''); setSuccess('');
    try {
      if (active === 'folders') await crmApi.createAutomationFolder({ name });
      if (active === 'links') await crmApi.createTrackedLink({ name, destination_url: value, repeat_click_policy: 'every', trigger_workflows: true });
      if (active === 'bots') await crmApi.createAutomationBotRule({ name, signal_type: 'user_agent', pattern: value, classification: 'bot', enabled: true });
      setSuccess(`${name} was created.`); setName(''); setValue(''); await load();
    } catch (e: any) { setError(e?.message || 'Unable to create this resource.'); }
    finally { setSaving(false); }
  };

  const createTemplateWorkflow = async () => {
    if (!selected) return;
    setSaving(true); setError('');
    try {
      const result = await crmApi.createWorkflowFromTemplate(selected.key, {
        name: name || selected.name,
        field_mapping: JSON.parse(fieldMapping),
        stage_mapping: JSON.parse(stageMapping),
      });
      setSelected(null); navigate(result.builder_url || `/automation/workflows/builder/${result.workflow_id}`);
    } catch (e: any) { setError(e instanceof SyntaxError ? 'Mappings must be valid JSON objects.' : (e?.message || 'Unable to create workflow.')); }
    finally { setSaving(false); }
  };

  const openTemplate = (item: any) => { setSelected(item); setName(item.name); setError(''); };

  return <div className="space-y-5">
    <div className="flex items-center justify-between border-b border-slate-200 pb-4"><div><h1 className="text-2xl font-bold text-[#12263A]">WhatsApp Automation Controls</h1><p className="mt-1 text-sm text-slate-500">Create and manage reusable WhatsApp workflow resources.</p></div><button onClick={() => void load()} className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50" title="Refresh"><RefreshCw size={16} className={loading ? 'animate-spin' : ''}/></button></div>
    <div className="flex flex-wrap gap-2">{panels.map(panel => <button key={panel.key} onClick={() => { setActive(panel.key); setSuccess(''); setError(''); }} className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold ${active === panel.key ? 'border-[#166534] bg-[#166534] text-white' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}><panel.icon size={14}/>{panel.label}</button>)}</div>

    {active !== 'templates' && <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-[1fr_1fr_auto]"><input value={name} onChange={e => setName(e.target.value)} placeholder={active === 'folders' ? 'WhatsApp workflow folder name' : active === 'links' ? 'WhatsApp trigger link name' : 'Bot rule name'} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"/>{(active === 'links' || active === 'bots') ? <input value={value} onChange={e => setValue(e.target.value)} placeholder={active === 'links' ? 'https://destination.example' : '/bot|crawler/i'} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"/> : <div/>}<button disabled={saving} onClick={() => void createResource()} className="flex items-center justify-center gap-2 rounded-xl bg-[#166534] px-4 py-2 text-xs font-bold text-white disabled:opacity-50"><Plus size={14}/>{saving ? 'Creating…' : 'Create'}</button></div>}

    {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
    {success && <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700"><CheckCircle2 size={16}/>{success}</div>}
    {!loading && !error && items.length === 0 && <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center text-sm text-slate-500">No records yet. Use the form above to create one.</div>}

    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{items.map((item, index) => <div key={item.id || item.key || index} className="flex min-h-40 flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><h3 className="font-bold text-[#12263A]">{item.name || item.key}</h3><p className="mt-1 text-xs text-slate-500">{item.description || item.category || item.status || item.classification || 'Configured automation resource'}</p>{item.raw_clicks !== undefined && <p className="mt-3 text-xs font-semibold text-[#166534]">Raw {item.raw_clicks} · Human {item.human_clicks}</p>}{item.required_mappings && <p className="mt-3 text-[11px] text-amber-700">Configure account fields and stages before publishing.</p>}<div className="mt-auto flex gap-2 pt-4">{active === 'templates' && <><button onClick={() => openTemplate(item)} className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold"><Eye size={13}/>Preview</button><button onClick={() => openTemplate(item)} className="rounded-lg bg-[#166534] px-3 py-1.5 text-xs font-bold text-white">Use template</button></>}{active === 'folders' && <button onClick={() => navigate(`/automation/workflows?folder_id=${item.id}`)} className="rounded-lg bg-[#166534] px-3 py-1.5 text-xs font-bold text-white">View workflows</button>}{active === 'sequences' && <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold capitalize text-slate-600">{item.status}</span>}{active === 'links' && <button onClick={() => void navigator.clipboard.writeText(`${window.location.origin}/api/t/${item.public_token}`)} className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold"><Copy size={13}/>Copy tracking URL</button>}{active === 'bots' && <span className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${item.enabled ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{item.enabled ? 'Enabled' : 'Disabled'}</span>}</div></div>)}</div>

    {selected && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4" onMouseDown={() => setSelected(null)}><div onMouseDown={e => e.stopPropagation()} className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl"><div className="flex items-start justify-between"><div><h2 className="text-xl font-bold text-[#12263A]">{selected.name}</h2><p className="mt-1 text-sm text-slate-500">Preview and configure this draft workflow.</p></div><button onClick={() => setSelected(null)} className="rounded-lg p-2 hover:bg-slate-100"><X size={18}/></button></div><div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4"><p className="text-xs font-bold uppercase text-slate-500">Generated flow</p><div className="mt-3 flex flex-wrap items-center gap-2 text-sm font-semibold">{(selected.preview?.steps || []).map((step: string, i: number) => <span key={step} className="contents"><span className="rounded-lg border border-slate-200 bg-white px-3 py-2">{step}</span>{i < selected.preview.steps.length - 1 && <span className="text-slate-400">→</span>}</span>)}</div></div><div className="mt-5 grid gap-4"><label className="text-xs font-bold text-slate-700">Workflow name<input value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-normal"/></label><div className="grid gap-4 md:grid-cols-2"><label className="text-xs font-bold text-slate-700">Contact field mapping<textarea value={fieldMapping} onChange={e => setFieldMapping(e.target.value)} rows={4} className="mt-1 block w-full rounded-xl border border-slate-200 p-3 font-mono text-xs"/></label><label className="text-xs font-bold text-slate-700">Pipeline stage mapping<textarea value={stageMapping} onChange={e => setStageMapping(e.target.value)} rows={4} className="mt-1 block w-full rounded-xl border border-slate-200 p-3 font-mono text-xs"/></label></div></div><p className="mt-3 text-xs text-amber-700">This creates a draft only. Review and test it in the workflow builder before publishing.</p><div className="mt-5 flex justify-end gap-2"><button onClick={() => setSelected(null)} className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold">Cancel</button><button disabled={saving} onClick={() => void createTemplateWorkflow()} className="rounded-xl bg-[#166534] px-4 py-2 text-xs font-bold text-white disabled:opacity-50">{saving ? 'Creating draft…' : 'Create draft workflow'}</button></div></div></div>}
  </div>;
}
