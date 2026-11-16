import { useEffect, useMemo, useState } from 'react';
import { CalendarClock, CheckSquare, Columns3, List, Plus, RotateCcw, Search, UserRound } from 'lucide-react';
import { salesWorkspaceApi as api } from '../../../services/salesWorkspaceApi';
import { Drawer, EmptyState, Pagination, StatusBadge, TableSkeleton, Timeline } from '../../../components/crm/CrmUi';
import SalesRecordModal from './SalesRecordModal';

export default function PipelineWorkspace({boot,money,refreshOverview}:{boot:any;money:(v:any)=>string;refreshOverview:()=>void}){
 const savedViews=(boot.list_views||[]).filter((x:any)=>x.entity_type==='opportunities');
 const defaultSaved=savedViews.find((x:any)=>x.is_default);
 const [pipelineId,setPipelineId]=useState(boot.pipelines[0]?.id);
 const [search,setSearch]=useState(defaultSaved?.filters?.search||'');
 const [owner,setOwner]=useState('');
 const [status,setStatus]=useState(defaultSaved?.filters?.status||'');
 const [view,setView]=useState<'board'|'table'>(defaultSaved?'table':'board');
 const [savedViewId,setSavedViewId]=useState(defaultSaved?.id||'');
 const [columns,setColumns]=useState<string[]>(defaultSaved?.columns||['name','stage','customer','owner','value','expected_close_at','next_activity_at']);
 const [sort,setSort]=useState(defaultSaved?.sorts?.[0]?.field||'updated_at');
 const [direction,setDirection]=useState(defaultSaved?.sorts?.[0]?.direction||'desc');
 const [page,setPage]=useState(1);
 const [meta,setMeta]=useState({current_page:1,last_page:1,total:0});
 const [records,setRecords]=useState<any[]>([]);
 const [loading,setLoading]=useState(true);
 const [editing,setEditing]=useState<any>(null);
 const [detail,setDetail]=useState<any>(null);
 const [detailTab,setDetailTab]=useState('overview');
 const [error,setError]=useState('');
 const pipeline=boot.pipelines.find((p:any)=>p.id===Number(pipelineId));
 const controlClass='h-10 min-w-0 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100';

 const load=async()=>{
  setLoading(true);
  try{
   const result=await api.opportunities({pipeline_id:pipelineId,owner_id:owner||undefined,status:status||undefined,search:search||undefined,sort,direction,page,per_page:view==='board'?200:50});
   setRecords(result.data||[]);
   setMeta({current_page:result.current_page,last_page:result.last_page,total:result.total});
  }catch(e:any){setError(e.response?.data?.message||'Opportunities could not be loaded.')}finally{setLoading(false)}
 };
 useEffect(()=>{const timer=setTimeout(load,search?250:0);return()=>clearTimeout(timer)},[pipelineId,owner,status,search,sort,direction,page,view]);

 const applyView=(id:string)=>{
  setSavedViewId(id);const saved=savedViews.find((x:any)=>x.id===Number(id));
  if(!saved){setColumns(['name','stage','customer','owner','value','expected_close_at','next_activity_at']);setSort('updated_at');setDirection('desc');setSearch('');setStatus('');setOwner('');setPage(1);return}
  setColumns(saved.columns||[]);setSort(saved.sorts?.[0]?.field||'updated_at');setDirection(saved.sorts?.[0]?.direction||'desc');setSearch(saved.filters?.search||'');setStatus(saved.filters?.status||'');setView('table');setPage(1);
 };
 const clearFilters=()=>{setSearch('');setOwner('');setStatus('');setSavedViewId('');setPage(1)};
 const grouped=useMemo(()=>Object.fromEntries((pipeline?.stages||[]).map((s:any)=>[s.id,records.filter(r=>r.stage_id===s.id)])),[pipeline,records]);
 const visibleValue=records.reduce((sum:number,item:any)=>sum+Number(item.value||0),0);
 const weightedValue=records.reduce((sum:number,item:any)=>sum+(Number(item.value||0)*Number(item.stage?.probability||0)/100),0);
 const hasFilters=Boolean(search||owner||status||savedViewId);
 const openDetail=async(id:number)=>{setDetailTab('overview');setDetail(await api.opportunity(id))};
 const move=async(id:number,stageId:number)=>{setError('');const previous=records;setRecords(items=>items.map(x=>x.id===id?{...x,stage_id:stageId}:x));try{await api.moveOpportunity(id,stageId);await Promise.all([load(),refreshOverview()])}catch(e:any){setRecords(previous);setError(e.response?.data?.message||'The opportunity could not be moved.')}};

 if(loading&&records.length===0)return <TableSkeleton rows={8}/>;
 return <div className="space-y-4">
  <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
   <div className="flex flex-col gap-4 border-b border-slate-100 p-4 xl:flex-row xl:items-center xl:justify-between">
    <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center">
     <label className="min-w-0 sm:w-64"><span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">Pipeline</span><select aria-label="Pipeline" value={pipelineId} onChange={e=>{setPipelineId(Number(e.target.value));setPage(1)}} className={`${controlClass} w-full font-semibold text-slate-900`}>{boot.pipelines.map((p:any)=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
     <div className="grid grid-cols-3 gap-4 border-t border-slate-100 pt-3 sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0">
      <Summary label="Opportunities" value={meta.total}/><Summary label="Visible value" value={money(visibleValue)}/><Summary label="Weighted" value={money(weightedValue)}/>
     </div>
    </div>
    <div className="flex flex-wrap items-center gap-2">
     <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1" aria-label="Opportunity view">
      <button onClick={()=>{setView('board');setPage(1)}} className={`flex h-8 items-center gap-2 rounded-lg px-3 text-xs font-bold ${view==='board'?'bg-white text-slate-900 shadow-sm':'text-slate-500 hover:text-slate-800'}`}><Columns3 size={15}/>Board</button>
      <button onClick={()=>{setView('table');setPage(1)}} className={`flex h-8 items-center gap-2 rounded-lg px-3 text-xs font-bold ${view==='table'?'bg-white text-slate-900 shadow-sm':'text-slate-500 hover:text-slate-800'}`}><List size={15}/>Table</button>
     </div>
     <button onClick={()=>setEditing({})} className="flex h-10 items-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-bold text-white shadow-sm hover:bg-emerald-700"><Plus size={16}/>New opportunity</button>
    </div>
   </div>
   <div className="flex flex-col gap-3 bg-slate-50/60 p-3 lg:flex-row lg:items-center">
    <label className="relative min-w-0 flex-1 lg:max-w-md"><Search className="absolute left-3 top-2.5 text-slate-400" size={17}/><span className="sr-only">Search opportunities</span><input value={search} onChange={e=>{setSearch(e.target.value);setPage(1)}} placeholder="Search opportunities, contacts, or companies" className={`${controlClass} w-full bg-white pl-9`}/></label>
    <div className="grid min-w-0 flex-1 grid-cols-1 gap-2 sm:grid-cols-3">
     <select aria-label="Owner filter" value={owner} onChange={e=>{setOwner(e.target.value);setPage(1)}} className={controlClass}><option value="">All owners</option>{boot.users.map((u:any)=><option key={u.id} value={u.id}>{u.name}</option>)}</select>
     <select aria-label="Status filter" value={status} onChange={e=>{setStatus(e.target.value);setPage(1)}} className={controlClass}><option value="">All statuses</option><option value="open">Open</option><option value="won">Won</option><option value="lost">Lost</option></select>
     {savedViews.length>0?<select aria-label="Saved view" value={savedViewId} onChange={e=>applyView(e.target.value)} className={controlClass}><option value="">Standard view</option>{savedViews.map((x:any)=><option value={x.id} key={x.id}>{x.name}</option>)}</select>:<div className="hidden sm:block"/>}
    </div>
    {hasFilters&&<button onClick={clearFilters} className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl px-3 text-sm font-semibold text-slate-500 hover:bg-white hover:text-slate-900"><RotateCcw size={15}/>Clear</button>}
   </div>
  </section>

  {error&&<div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}
  <div className={loading?'pointer-events-none opacity-60 transition-opacity':'transition-opacity'}>
   {view==='board'?<div className="-mx-1 overflow-x-auto px-1 pb-3"><div className="flex min-w-max gap-4">{pipeline?.stages.map((stage:any)=><StageColumn key={stage.id} stage={stage} records={grouped[stage.id]||[]} money={money} move={move} openDetail={openDetail}/>)}</div></div>:<OpportunityTable records={records} money={money} openDetail={openDetail} columns={columns}/>} 
  </div>
  <Pagination page={meta.current_page} last={meta.last_page} total={meta.total} onPage={setPage}/>
  {editing&&<SalesRecordModal type="opportunity" record={editing.id?editing:undefined} boot={boot} onClose={()=>setEditing(null)} onSaved={async()=>{setEditing(null);await load();await refreshOverview()}}/>}
  <OpportunityDrawer data={detail} tab={detailTab} setTab={setDetailTab} close={()=>setDetail(null)} edit={()=>{setEditing(detail.opportunity);setDetail(null)}} markStage={(stage:any)=>{setEditing({...detail.opportunity,stage_id:stage.id});setDetail(null)}} boot={boot}/>
 </div>
}
function Summary({label,value}:{label:string;value:any}){return <div className="min-w-20"><div className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{label}</div><div className="mt-0.5 truncate text-sm font-bold text-slate-900">{value}</div></div>}

function StageColumn({stage,records,money,move,openDetail}:{stage:any;records:any[];money:(v:any)=>string;move:(id:number,stageId:number)=>void;openDetail:(id:number)=>void}){
 const stageValue=records.reduce((sum:number,item:any)=>sum+Number(item.value||0),0);
 return <section onDragOver={e=>e.preventDefault()} onDrop={e=>{const id=Number(e.dataTransfer.getData('opportunity'));if(id)move(id,stage.id)}} className="w-[286px] shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/80 shadow-sm xl:w-[304px]">
  <header className="border-b border-slate-200 bg-white px-4 py-3"><div className="flex items-center justify-between gap-3"><div className="flex min-w-0 items-center gap-2"><span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{background:stage.color}}/><h3 className="truncate text-sm font-bold text-slate-900">{stage.name}</h3><span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">{records.length}</span></div><span className="shrink-0 text-[10px] font-bold text-slate-400">{stage.probability}%</span></div><div className="mt-1.5 text-xs font-semibold text-slate-500">{money(stageValue)}</div></header>
  <div className="min-h-[390px] space-y-2.5 p-3">{records.map((op:any)=><OpportunityCard key={op.id} op={op} money={money} openDetail={openDetail}/>)}{records.length===0&&<div className="grid min-h-28 place-items-center rounded-xl border border-dashed border-slate-300 bg-white/60 px-5 text-center text-xs text-slate-400">Drag an opportunity here</div>}</div>
 </section>
}

function OpportunityCard({op,money,openDetail}:{op:any;money:(v:any)=>string;openDetail:(id:number)=>void}){
 const nextTask=op.tasks?.[0];const overdue=Boolean(nextTask?.due_at&&new Date(nextTask.due_at)<new Date());
 return <button draggable onDragStart={e=>{e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('opportunity',String(op.id))}} onClick={()=>openDetail(op.id)} className="group w-full cursor-grab rounded-xl border border-slate-200 bg-white p-3.5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md active:cursor-grabbing"><div className="flex items-start justify-between gap-3"><h4 className="line-clamp-2 text-sm font-bold leading-5 text-slate-900 group-hover:text-emerald-800">{op.name}</h4><span className="shrink-0 text-sm font-bold text-slate-900">{money(op.value)}</span></div><div className="mt-2 truncate text-xs font-medium text-slate-500">{op.contact?.name||op.company?.business_name||'No customer linked'}</div><div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-100 pt-2.5 text-[10px] text-slate-400"><span className="flex min-w-0 items-center gap-1"><UserRound size={12}/><span className="truncate">{op.owner?.name||'Unassigned'}</span></span><span className="flex items-center justify-end gap-1"><CalendarClock size={12}/>{op.expected_close_at||'No close date'}</span></div>{nextTask&&<div className={`mt-2 flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[11px] font-medium ${overdue?'bg-red-50 text-red-700':'bg-blue-50 text-blue-700'}`}><CheckSquare size={12} className="shrink-0"/><span className="truncate">{nextTask.title}</span></div>}</button>
}

function OpportunityTable({records,money,openDetail,columns}:{records:any[];money:(v:any)=>string;openDetail:(id:number)=>void;columns:string[]}){if(!records.length)return <EmptyState title="No opportunities found" description="Adjust the filters or create the first opportunity in this pipeline."/>;const supported=columns.filter(x=>['name','stage','customer','owner','value','expected_close_at','next_activity_at','status'].includes(x));const visible=supported.length?supported:['name','stage','customer','owner','value'];const label:Record<string,string>={name:'Opportunity',stage:'Stage',customer:'Customer',owner:'Owner',value:'Value',expected_close_at:'Close date',next_activity_at:'Next activity',status:'Status'};const cell=(key:string,op:any)=>({name:<div><div className="font-bold text-slate-900">{op.name}</div><div className="mt-0.5 text-xs text-slate-400">#{op.id}</div></div>,stage:<span className="inline-flex items-center gap-1.5 font-semibold"><i className="h-2 w-2 rounded-full" style={{background:op.stage?.color}}/>{op.stage?.name}</span>,customer:op.contact?.name||op.company?.business_name||'—',owner:op.owner?.name||'Unassigned',value:<b className="text-slate-900">{money(op.value)}</b>,expected_close_at:op.expected_close_at||'—',next_activity_at:op.next_activity_at?new Date(op.next_activity_at).toLocaleString():'Not scheduled',status:<StatusBadge value={op.status}/>}[key]);return <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm"><table className="min-w-[900px] w-full text-left text-sm"><thead className="border-b border-slate-200 bg-slate-50/80 text-[10px] font-bold uppercase tracking-wider text-slate-500"><tr>{visible.map(x=><th key={x} className="whitespace-nowrap px-4 py-3">{label[x]}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{records.map(op=><tr key={op.id} onClick={()=>openDetail(op.id)} className="cursor-pointer text-slate-600 transition-colors hover:bg-emerald-50/40">{visible.map(x=><td key={x} className={`whitespace-nowrap px-4 py-3.5 ${x==='next_activity_at'&&op.next_activity_at&&new Date(op.next_activity_at)<new Date()?'font-bold text-red-600':''}`}>{cell(x,op)}</td>)}</tr>)}</tbody></table></div>}
function OpportunityDrawer({data,tab,setTab,close,edit,markStage,boot}:{data:any;tab:string;setTab:(v:string)=>void;close:()=>void;edit:()=>void;markStage:(stage:any)=>void;boot:any}){const [values,setValues]=useState<any>({});useEffect(()=>{if(data)setValues(Object.fromEntries(Object.entries(data.custom_values||{}).map(([id,r]:any)=>[id,r.value?.value??''])))},[data]);if(!data)return null;const op=data.opportunity;const stages=boot.pipelines.find((p:any)=>p.id===op.pipeline_id)?.stages||[];const won=stages.find((s:any)=>s.is_won);const lost=stages.find((s:any)=>s.is_lost);const tabs=['overview','tasks','appointments','activity','custom','audit'];return <Drawer open onClose={close} title={op.name} subtitle={`${op.pipeline?.name} · ${op.stage?.name}`} footer={<div className="flex flex-wrap justify-end gap-2">{op.status==='open'&&lost&&<button onClick={()=>markStage(lost)} className="rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-bold text-red-700">Mark lost</button>}{op.status==='open'&&won&&<button onClick={()=>markStage(won)} className="rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-sm font-bold text-emerald-700">Mark won</button>}<button onClick={close} className="rounded-xl border bg-white px-4 py-2.5 text-sm font-semibold">Close</button><button onClick={edit} className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white">Edit opportunity</button></div>}><div className="mb-5 flex gap-1 overflow-x-auto border-b">{tabs.map(x=><button key={x} onClick={()=>setTab(x)} className={`shrink-0 border-b-2 px-3 py-2 text-xs font-bold capitalize ${tab===x?'border-emerald-600 text-emerald-700':'border-transparent text-slate-500'}`}>{x}</button>)}</div>{tab==='overview'&&<div className="space-y-5"><div className="grid grid-cols-2 gap-3">{[['Value',`${op.currency_code} ${Number(op.value).toLocaleString()}`],['Probability',`${op.stage?.probability||0}%`],['Status',op.status],['Owner',op.owner?.name||'Unassigned'],['Expected close',op.expected_close_at||'Not set'],['Next activity',op.next_activity_at?new Date(op.next_activity_at).toLocaleString():'Not set'],['Contact',op.contact?.name||'Not linked'],['Company',op.company?.business_name||'Not linked']].map(([l,v])=><div key={l} className="rounded-xl border bg-slate-50 p-3"><div className="text-[11px] font-bold uppercase text-slate-400">{l}</div><div className="mt-1 text-sm font-semibold">{v}</div></div>)}</div><div><h3 className="text-sm font-bold">Description</h3><p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">{op.description||'No description added.'}</p></div><div><h3 className="text-sm font-bold">Notes</h3><p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">{op.notes||'No notes added.'}</p></div>{op.loss_reason&&<div className="rounded-xl border border-red-200 bg-red-50 p-3"><h3 className="text-sm font-bold text-red-800">Loss reason</h3><p className="mt-1 text-sm text-red-700">{op.loss_reason}</p></div>}</div>}{tab==='tasks'&&(op.tasks.length?<div className="space-y-2">{op.tasks.map((t:any)=><div key={t.id} className="rounded-xl border p-3"><div className="flex justify-between"><b className="text-sm">{t.title}</b><StatusBadge value={t.status}/></div><div className="mt-1 text-xs text-slate-500">{t.owner?.name||'Unassigned'} · {t.due_at?new Date(t.due_at).toLocaleString():'No due date'}</div></div>)}</div>:<EmptyState title="No linked tasks" description="Create a task and link it to this opportunity."/>)}{tab==='appointments'&&(op.appointments.length?<div className="space-y-2">{op.appointments.map((a:any)=><div key={a.id} className="rounded-xl border p-3"><b className="text-sm">{a.title}</b><div className="mt-1 text-xs text-slate-500">{new Date(a.starts_at).toLocaleString()} · {a.owner?.name||'Unassigned'}</div></div>)}</div>:<EmptyState title="No linked appointments" description="Scheduled meetings will appear here."/>)}{tab==='activity'&&<Timeline items={op.activities}/>} {tab==='audit'&&<Timeline items={data.audit}/>} {tab==='custom'&&<div className="space-y-3">{data.custom_fields.length?data.custom_fields.map((f:any)=><label key={f.id} className="block space-y-1.5"><span className="text-xs font-bold">{f.name}</span><input value={values[f.id]??''} onChange={e=>setValues({...values,[f.id]:e.target.value})} className="w-full rounded-xl border p-3 text-sm"/></label>):<EmptyState title="No custom fields" description="Add opportunity fields in CRM Configuration."/>}{data.custom_fields.length>0&&<button onClick={()=>api.saveCustomFieldValues('opportunity',op.id,values)} className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white">Save custom fields</button>}</div>}</Drawer>}
