import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  AtSign,
  BellRing,
  Bot,
  Building2,
  CalendarDays,
  Check,
  CheckCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FileText,
  Flag,
  Inbox,
  ListTodo,
  Loader2,
  MailOpen,
  MessageCircle,
  PanelRight,
  Search,
  Send,
  Settings2,
  Star,
  UserCheck,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import { useUnifiedInbox } from '../../hooks/inbox/useUnifiedInbox';
import {
  InboxConversation,
  InboxMessage,
  InboxView,
  unifiedInboxApi,
} from '../../services/unifiedInboxApi';

const control = 'h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100';

export default function InboxPage() {
  const inbox = useUnifiedInbox();
  const [contextOpen, setContextOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="-m-6 flex h-[calc(100vh-92px)] min-h-[640px] overflow-hidden bg-slate-100">
      <InboxNavigation
        {...inbox}
        openSettings={() => setSettingsOpen(true)}
      />
      <ConversationList {...inbox} />
      <ConversationWorkspace
        {...inbox}
        showContext={() => setContextOpen(true)}
      />
      <CustomerContext
        detail={inbox.detail}
        boot={inbox.boot}
        selected={inbox.selected}
        open={contextOpen}
        close={() => setContextOpen(false)}
        refresh={inbox.refresh}
        mutateState={inbox.mutateState}
      />
      {settingsOpen && (
        <InboxSettingsModal
          boot={inbox.boot}
          close={() => setSettingsOpen(false)}
          reload={async () => {
            await inbox.loadBoot();
            await inbox.refresh();
          }}
        />
      )}
    </div>
  );
}

function InboxNavigation({
  boot,
  counts,
  view,
  setView,
  status,
  setStatus,
  openSettings,
}: any) {
  const views: { id: InboxView; label: string; icon: any }[] = [
    { id: 'team', label: 'Team inbox', icon: Users },
    { id: 'mine', label: 'My inbox', icon: UserCheck },
    { id: 'unread', label: 'Unread', icon: MailOpen },
    { id: 'starred', label: 'Starred', icon: Star },
    { id: 'following', label: 'Following', icon: UserPlus },
    { id: 'recent', label: 'Recent', icon: Clock3 },
    { id: 'others', label: 'Other assignees', icon: AtSign },
    { id: 'unassigned', label: 'Unassigned', icon: Inbox },
    { id: 'sla_overdue', label: 'SLA overdue', icon: BellRing },
  ];
  const whatsAppSlaActive = boot?.sla_policies?.some(
    (policy: any) => policy.channel === 'whatsapp' && policy.is_active,
  );

  return (
    <aside className="hidden w-[226px] shrink-0 flex-col border-r border-slate-200 bg-white lg:flex">
      <div className="border-b border-slate-200 px-4 py-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-[.18em] text-emerald-600">
              Conversations
            </div>
            <h1 className="mt-1 text-xl font-extrabold tracking-tight text-slate-950">
              WhatsApp inbox
            </h1>
          </div>
          <button
            onClick={openSettings}
            aria-label="WhatsApp inbox settings"
            title="Inbox settings"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
          >
            <Settings2 size={17} />
          </button>
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs font-medium text-slate-500">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </span>
          Live WhatsApp conversations
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {views.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setView(id)}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-bold transition ${
              view === id
                ? 'bg-slate-950 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
            }`}
          >
            <Icon size={16} />
            <span className="min-w-0 flex-1 truncate">{label}</span>
            <span
              className={`grid min-w-5 place-items-center rounded-full px-1.5 py-0.5 text-[9px] ${
                view === id ? 'bg-white/15 text-white' : 'bg-slate-100 text-slate-500'
              }`}
            >
              {counts[id] ?? 0}
            </span>
          </button>
        ))}
      </nav>

      <div className="space-y-3 border-t border-slate-200 p-3">
        <label className="block">
          <span className="mb-1.5 block text-[9px] font-extrabold uppercase tracking-wider text-slate-400">
            Conversation status
          </span>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className={`${control} w-full`}
          >
            <option value="">All statuses</option>
            <option value="open">Open</option>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
          </select>
        </label>
        <div
          className={`flex items-center gap-2 rounded-xl border p-3 text-[10px] font-bold ${
            whatsAppSlaActive
              ? 'border-emerald-100 bg-emerald-50 text-emerald-700'
              : 'border-amber-100 bg-amber-50 text-amber-700'
          }`}
        >
          <Clock3 size={14} />
          {whatsAppSlaActive ? 'WhatsApp SLA monitoring active' : 'SLA monitoring is disabled'}
        </div>
      </div>
    </aside>
  );
}

function ConversationList({
  items,
  selected,
  setSelected,
  search,
  setSearch,
  loading,
  error,
  meta,
  page,
  setPage,
  view,
  setView,
  counts,
}: any) {
  return (
    <section
      className={`${selected ? 'hidden md:flex' : 'flex'} w-full shrink-0 flex-col border-r border-slate-200 bg-white md:w-[350px] xl:w-[380px]`}
    >
      <header className="space-y-3 border-b border-slate-200 px-4 py-4">
        <div className="flex items-center justify-between gap-3 lg:hidden">
          <div>
            <h2 className="text-base font-extrabold text-slate-950">WhatsApp inbox</h2>
            <p className="text-[10px] text-slate-400">Live customer conversations</p>
          </div>
          <select
            value={view}
            onChange={(event) => setView(event.target.value)}
            className={control}
          >
            <option value="team">Team</option>
            <option value="mine">Mine ({counts.mine || 0})</option>
            <option value="unread">Unread ({counts.unread || 0})</option>
            <option value="starred">Starred</option>
            <option value="unassigned">Unassigned</option>
            <option value="sla_overdue">SLA overdue</option>
          </select>
        </div>

        <label className="relative block">
          <Search className="absolute left-3.5 top-3 text-slate-400" size={16} />
          <span className="sr-only">Search WhatsApp conversations</span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name, number, or message"
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
          />
        </label>

        <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
          <span>{meta.total || 0} WhatsApp conversations</span>
          {(meta.last_page || 1) > 1 && (
            <span>Page {meta.current_page || 1} of {meta.last_page || 1}</span>
          )}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        {error && (
          <div className="m-3 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">
            {error}
          </div>
        )}
        {loading ? (
          <ConversationSkeleton />
        ) : items.length ? (
          items.map((item: InboxConversation) => (
            <ConversationRow
              key={item.source_id}
              item={item}
              active={selected?.id === item.source_id}
              select={() => setSelected({ channel: 'whatsapp', id: item.source_id })}
            />
          ))
        ) : (
          <div className="grid h-full place-items-center p-8 text-center">
            <div>
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
                <MessageCircle />
              </div>
              <h3 className="mt-4 text-sm font-extrabold text-slate-800">No WhatsApp conversations</h3>
              <p className="mt-1 max-w-56 text-xs leading-relaxed text-slate-500">
                Try another inbox view, status, or search term.
              </p>
            </div>
          </div>
        )}
      </div>

      {(meta.last_page || 1) > 1 && (
        <footer className="flex items-center justify-between border-t border-slate-200 p-2.5">
          <button
            disabled={page <= 1}
            onClick={() => setPage((current: number) => current - 1)}
            className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-slate-600 disabled:opacity-30"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-[10px] font-bold text-slate-400">{items.length} shown</span>
          <button
            disabled={page >= (meta.last_page || 1)}
            onClick={() => setPage((current: number) => current + 1)}
            className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-slate-600 disabled:opacity-30"
          >
            <ChevronRight size={16} />
          </button>
        </footer>
      )}
    </section>
  );
}

function ConversationRow({
  item,
  active,
  select,
}: {
  item: InboxConversation;
  active: boolean;
  select: () => void;
}) {
  return (
    <button
      onClick={select}
      className={`group w-full border-b border-slate-100 px-4 py-4 text-left transition ${
        active
          ? 'bg-emerald-50 shadow-[inset_3px_0_0_#059669]'
          : 'hover:bg-slate-50'
      }`}
    >
      <div className="flex gap-3">
        <Avatar item={item} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className={`truncate text-sm ${item.is_unread ? 'font-extrabold text-slate-950' : 'font-bold text-slate-800'}`}>
                  {item.display_name}
                </span>
                {item.identity_status === 'unresolved' && (
                  <span className="rounded-md bg-amber-100 px-1.5 py-0.5 text-[8px] font-extrabold uppercase text-amber-700">
                    Unlinked
                  </span>
                )}
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-[10px] font-semibold text-slate-400">
                <WhatsAppIcon />
                <span>{item.external_id || 'WhatsApp'}</span>
                {item.assigned_to_name && (
                  <>
                    <span>·</span>
                    <span className="truncate">{item.assigned_to_name}</span>
                  </>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="whitespace-nowrap text-[9px] font-bold text-slate-400">
                {relativeTime(item.last_message_at)}
              </div>
              <div className="mt-1.5 flex justify-end gap-1.5">
                {item.is_starred && <Star size={12} className="fill-amber-400 text-amber-400" />}
                {item.is_following && <UserPlus size={12} className="text-blue-500" />}
              </div>
            </div>
          </div>

          <div className="mt-2 flex items-end gap-2">
            <p className={`line-clamp-2 flex-1 text-xs leading-relaxed ${item.is_unread ? 'font-semibold text-slate-700' : 'text-slate-500'}`}>
              {item.last_message || 'No message preview'}
            </p>
            {item.is_unread && (
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-emerald-600 px-1 text-[9px] font-extrabold text-white">
                {item.unread_count || 1}
              </span>
            )}
          </div>

          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            <StatePill value={item.status} />
            {item.priority !== 'normal' && <StatePill value={item.priority} />}
            <SlaPill status={item.sla_status} due={item.sla_due_at} />
          </div>
        </div>
      </div>
    </button>
  );
}

function ConversationWorkspace({
  selected,
  setSelected,
  detail,
  detailLoading,
  boot,
  mutateState,
  send,
  addNote,
  showContext,
}: any) {
  if (!selected) {
    return (
      <main className="hidden min-w-0 flex-1 items-center justify-center bg-slate-50 p-10 text-center md:flex">
        <div>
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl border border-emerald-100 bg-white text-emerald-600 shadow-sm">
            <MessageCircle size={34} />
          </div>
          <h2 className="mt-5 text-xl font-extrabold tracking-tight text-slate-900">
            Select a WhatsApp conversation
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
            Review the customer history, assign ownership, reply, and create follow-up work from one place.
          </p>
        </div>
      </main>
    );
  }

  if (detailLoading || !detail) {
    return (
      <main className="flex min-w-0 flex-1 flex-col bg-white">
        <div className="h-[73px] animate-pulse border-b bg-slate-50" />
        <div className="flex-1 space-y-4 p-6">
          <div className="h-16 w-2/3 animate-pulse rounded-2xl bg-slate-100" />
          <div className="ml-auto h-20 w-1/2 animate-pulse rounded-2xl bg-emerald-50" />
          <div className="h-20 w-3/5 animate-pulse rounded-2xl bg-slate-100" />
        </div>
      </main>
    );
  }

  const conversation: InboxConversation = detail.conversation;

  return (
    <main className="flex min-w-0 flex-1 flex-col bg-[#f7f9fb]">
      <header className="flex min-h-[73px] items-center gap-3 border-b border-slate-200 bg-white px-4 py-3">
        <button
          onClick={() => setSelected(null)}
          className="grid h-10 w-10 place-items-center rounded-xl text-slate-500 hover:bg-slate-100 md:hidden"
        >
          <ChevronLeft size={19} />
        </button>
        <Avatar item={conversation} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="truncate text-base font-extrabold text-slate-950">
              {conversation.display_name}
            </h2>
            <WhatsAppIcon />
            {conversation.identity_status === 'unresolved' && (
              <span className="hidden rounded-md bg-amber-100 px-1.5 py-0.5 text-[8px] font-extrabold uppercase text-amber-700 sm:inline">
                Contact not linked
              </span>
            )}
          </div>
          <div className="mt-0.5 flex items-center gap-2 text-[10px] font-medium text-slate-400">
            <span>{conversation.external_id}</span>
            <SlaPill status={conversation.sla_status} due={conversation.sla_due_at} />
          </div>
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <select
            aria-label="Assignee"
            value={conversation.assigned_to_user_id || ''}
            onChange={(event) => mutateState({
              assigned_to_user_id: event.target.value ? Number(event.target.value) : null,
            })}
            className={`${control} max-w-44`}
          >
            <option value="">Unassigned</option>
            {boot?.users?.map((user: any) => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </select>
          <select
            aria-label="Conversation status"
            value={conversation.status}
            onChange={(event) => mutateState({ status: event.target.value })}
            className={control}
          >
            <option value="open">Open</option>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        {/* Chat Auto-Reply Option Toggle */}
        {conversation.channel === 'whatsapp' && (
          <button
            type="button"
            onClick={() => mutateState({ is_auto_reply_active: conversation.is_auto_reply_active === false ? true : false })}
            aria-label="Toggle Auto-Reply"
            title={conversation.is_auto_reply_active !== false ? 'Auto-Reply is ACTIVE for this conversation. Click to pause.' : 'Auto-Reply is PAUSED for this conversation. Click to enable.'}
            className={`hidden sm:inline-flex items-center gap-1.5 h-10 px-3 rounded-xl text-xs font-bold transition-all border shadow-xs cursor-pointer active:scale-95 ${
              conversation.is_auto_reply_active !== false
                ? 'bg-[#F0FDF4] border-[#22C55E]/40 text-[#166534] hover:bg-[#DCFCE7]'
                : 'bg-slate-100 border-slate-300 text-slate-500 hover:text-slate-800 hover:bg-slate-200'
            }`}
          >
            <Bot size={15} className={conversation.is_auto_reply_active !== false ? 'text-[#166534]' : 'text-slate-400'} />
            <span>Auto-Reply:</span>
            <span className={conversation.is_auto_reply_active !== false ? 'text-[#166534]' : 'text-slate-600'}>
              {conversation.is_auto_reply_active !== false ? 'ON' : 'OFF'}
            </span>
          </button>
        )}

        <button
          onClick={() => mutateState({ is_starred: !conversation.is_starred })}
          aria-label={conversation.is_starred ? 'Remove star' : 'Star conversation'}
          title={conversation.is_starred ? 'Remove star' : 'Star conversation'}
          className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border transition ${
            conversation.is_starred
              ? 'border-amber-200 bg-amber-50 text-amber-500'
              : 'border-slate-200 bg-white text-slate-400 hover:text-slate-700'
          }`}
        >
          <Star size={17} className={conversation.is_starred ? 'fill-current' : ''} />
        </button>
        <button
          onClick={showContext}
          aria-label="Open customer details"
          title="Customer details"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
        >
          <PanelRight size={17} />
        </button>
      </header>

      <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-4 py-2 lg:hidden">
        <select
          aria-label="Assignee"
          value={conversation.assigned_to_user_id || ''}
          onChange={(event) => mutateState({
            assigned_to_user_id: event.target.value ? Number(event.target.value) : null,
          })}
          className={`${control} min-w-0 flex-1`}
        >
          <option value="">Unassigned</option>
          {boot?.users?.map((user: any) => (
            <option key={user.id} value={user.id}>{user.name}</option>
          ))}
        </select>
        <select
          aria-label="Conversation status"
          value={conversation.status}
          onChange={(event) => mutateState({ status: event.target.value })}
          className={control}
        >
          <option value="open">Open</option>
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
        </select>
        {conversation.channel === 'whatsapp' && (
          <button
            type="button"
            onClick={() => mutateState({ is_auto_reply_active: conversation.is_auto_reply_active === false ? true : false })}
            className={`inline-flex items-center gap-1 h-10 px-2.5 rounded-xl text-xs font-bold border shrink-0 ${
              conversation.is_auto_reply_active !== false
                ? 'bg-[#F0FDF4] border-[#22C55E]/40 text-[#166534]'
                : 'bg-slate-100 border-slate-300 text-slate-500'
            }`}
          >
            <Bot size={13} />
            <span>{conversation.is_auto_reply_active !== false ? 'Bot: ON' : 'Bot: OFF'}</span>
          </button>
        )}
      </div>

      <MessageTimeline messages={detail.messages || []} notes={detail.notes || []} />
      <Composer conversation={conversation} onSend={send} onNote={addNote} />
    </main>
  );
}

function MessageTimeline({ messages, notes }: { messages: InboxMessage[]; notes: any[] }) {
  const container = useRef<HTMLDivElement>(null);
  const [nearBottom, setNearBottom] = useState(true);
  const [newBelow, setNewBelow] = useState(false);
  const timeline = useMemo(
    () => [
      ...messages.map((message) => ({ ...message, kind: 'message' })),
      ...notes.map((note) => ({ ...note, timestamp: note.created_at, kind: 'note' })),
    ].sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()),
    [messages, notes],
  );

  useEffect(() => {
    if (nearBottom) {
      requestAnimationFrame(() => container.current?.scrollTo({
        top: container.current.scrollHeight,
        behavior: 'smooth',
      }));
      setNewBelow(false);
    } else {
      setNewBelow(true);
    }
  }, [timeline.length]);

  return (
    <div
      ref={container}
      onScroll={(event) => {
        const element = event.currentTarget;
        setNearBottom(element.scrollHeight - element.scrollTop - element.clientHeight < 120);
      }}
      className="relative flex-1 overflow-y-auto px-4 py-6"
    >
      <div className="mx-auto max-w-3xl space-y-3">
        {timeline.length ? timeline.map((item: any) => (
          item.kind === 'note' ? (
            <div
              key={`note-${item.id}`}
              className="mx-auto max-w-xl rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900"
            >
              <div className="mb-1 flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-wider text-amber-600">
                <FileText size={11} />
                Internal note · {item.user?.name || 'Team member'} · {formatTime(item.timestamp)}
              </div>
              <div className="whitespace-pre-wrap leading-relaxed">{item.content}</div>
            </div>
          ) : (
            <MessageRow key={`message-${item.id}`} message={item} />
          )
        )) : (
          <div className="grid min-h-64 place-items-center text-center">
            <div>
              <MessageCircle className="mx-auto text-slate-300" />
              <p className="mt-2 text-xs font-semibold text-slate-400">No message history yet</p>
            </div>
          </div>
        )}
      </div>
      {newBelow && (
        <button
          onClick={() => {
            container.current?.scrollTo({ top: container.current.scrollHeight, behavior: 'smooth' });
            setNearBottom(true);
            setNewBelow(false);
          }}
          className="sticky bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-slate-950 px-4 py-2 text-[10px] font-bold text-white shadow-lg"
        >
          New messages below
        </button>
      )}
    </div>
  );
}

function MessageRow({ message }: { message: InboxMessage }) {
  const outbound = message.direction === 'outbound';
  return (
    <div className={`flex ${outbound ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[82%] rounded-2xl px-4 py-3 shadow-sm md:max-w-[72%] ${
          outbound
            ? 'rounded-br-md bg-emerald-600 text-white'
            : 'rounded-bl-md border border-slate-200 bg-white text-slate-800'
        }`}
      >
        {message.attachment && (
          <a
            href={message.attachment.url}
            target="_blank"
            rel="noreferrer"
            className={`mb-2 block rounded-xl p-2 text-xs font-semibold ${outbound ? 'bg-white/15' : 'bg-slate-50'}`}
          >
            <FileText size={14} className="mb-1" />
            {message.attachment.file_name || message.type}
          </a>
        )}
        <div className="whitespace-pre-wrap break-words text-sm leading-relaxed">
          {message.body || (!message.attachment ? 'Unsupported message content' : '')}
        </div>
        <div className={`mt-1.5 flex items-center justify-end gap-1 text-[9px] ${outbound ? 'text-emerald-100' : 'text-slate-400'}`}>
          <span>{formatTime(message.timestamp)}</span>
          {outbound && <DeliveryIcon status={message.status} />}
        </div>
      </div>
    </div>
  );
}

function Composer({
  conversation,
  onSend,
  onNote,
}: {
  conversation: InboxConversation;
  onSend: (message: string) => Promise<void>;
  onNote: (message: string) => Promise<void>;
}) {
  const [mode, setMode] = useState<'reply' | 'note'>('reply');
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [snippets, setSnippets] = useState<any[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    unifiedInboxApi.snippets()
      .then((result) => setSnippets(result.data || []))
      .catch(() => setSnippets([]));
  }, [conversation.source_id]);

  const submit = async () => {
    if (!draft.trim() || sending) return;
    setSending(true);
    setError('');
    try {
      if (mode === 'reply') await onSend(draft.trim());
      else await onNote(draft.trim());
      setDraft('');
      setWarnings([]);
    } catch (exception: any) {
      setError(exception.response?.data?.message || 'Message could not be sent.');
    } finally {
      setSending(false);
    }
  };

  const chooseSnippet = async (id: string) => {
    if (!id) return;
    try {
      const rendered = await unifiedInboxApi.renderSnippet('whatsapp', conversation.source_id, Number(id));
      setDraft(rendered.body);
      setWarnings(rendered.warnings || []);
    } catch (exception: any) {
      setError(exception.response?.data?.message || 'Snippet could not be inserted.');
    }
  };

  const replyDisabled = mode === 'reply' && conversation.can_send_freeform === false;

  return (
    <footer className="border-t border-slate-200 bg-white px-4 py-3">
      <div className="mx-auto max-w-3xl">
        <div className="mb-2.5 flex items-center justify-between gap-3">
          <div className="flex rounded-xl bg-slate-100 p-1">
            <button
              onClick={() => setMode('reply')}
              className={`rounded-lg px-3 py-1.5 text-[10px] font-extrabold ${mode === 'reply' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500'}`}
            >
              Reply
            </button>
            <button
              onClick={() => setMode('note')}
              className={`rounded-lg px-3 py-1.5 text-[10px] font-extrabold ${mode === 'note' ? 'bg-amber-100 text-amber-800 shadow-sm' : 'text-slate-500'}`}
            >
              Internal note
            </button>
          </div>
          {mode === 'reply' && (
            <div className="relative min-w-0 max-w-64 flex-1 sm:flex-none">
              <select
                aria-label="Insert reply snippet"
                defaultValue=""
                onChange={(event) => {
                  chooseSnippet(event.target.value);
                  event.currentTarget.value = '';
                }}
                className={`${control} w-full appearance-none pr-8`}
              >
                <option value="">Insert saved reply</option>
                {snippets.map((snippet) => (
                  <option key={snippet.id} value={snippet.id}>
                    {snippet.category ? `${snippet.category} / ` : ''}{snippet.title}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-3 text-slate-400" size={14} />
            </div>
          )}
        </div>

        {replyDisabled && (
          <div className="mb-2.5 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
            <AlertCircle size={15} className="mt-0.5 shrink-0" />
            <span>{conversation.send_restriction}</span>
          </div>
        )}
        {warnings.length > 0 && (
          <div className="mb-2 rounded-xl bg-amber-50 p-2.5 text-[10px] font-semibold text-amber-700">
            {warnings.join(' · ')}
          </div>
        )}
        {error && (
          <div className="mb-2 rounded-xl bg-red-50 p-2.5 text-xs font-semibold text-red-700">
            {error}
          </div>
        )}

        <div className={`flex items-end gap-2 rounded-2xl border p-2.5 transition focus-within:ring-2 ${
          mode === 'note'
            ? 'border-amber-200 bg-amber-50/50 focus-within:ring-amber-100'
            : 'border-slate-200 bg-white focus-within:border-emerald-400 focus-within:ring-emerald-100'
        }`}>
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                submit();
              }
            }}
            disabled={replyDisabled}
            rows={2}
            placeholder={mode === 'reply' ? 'Write a WhatsApp reply…' : 'Write a private note for your team…'}
            className="max-h-32 min-h-12 flex-1 resize-none bg-transparent px-2 py-1 text-sm text-slate-800 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <button
            onClick={submit}
            disabled={!draft.trim() || sending || replyDisabled}
            aria-label={mode === 'reply' ? 'Send reply' : 'Add internal note'}
            className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl text-white transition disabled:cursor-not-allowed disabled:opacity-40 ${mode === 'note' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}
          >
            {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </div>
        <div className="mt-1.5 text-right text-[9px] font-medium text-slate-400">
          Enter to send · Shift + Enter for a new line
        </div>
      </div>
    </footer>
  );
}

function CustomerContext({ detail, boot, selected, open, close, refresh, mutateState }: any) {
  const context = detail?.context;
  const conversation = detail?.conversation;
  const [taskOpen, setTaskOpen] = useState(false);
  const [task, setTask] = useState({
    title: 'Follow up with customer',
    priority: 'normal',
    owner_id: '',
    due_at: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const createTask = async () => {
    if (!selected || !task.title.trim()) return;
    setSaving(true);
    setError('');
    try {
      await unifiedInboxApi.createTask('whatsapp', selected.id, {
        ...task,
        owner_id: task.owner_id || null,
        due_at: task.due_at || null,
      });
      setTaskOpen(false);
      await refresh();
    } catch (exception: any) {
      setError(exception.response?.data?.message || 'Follow-up task could not be created.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close customer details"
          onClick={close}
          className="fixed inset-0 z-40 cursor-default bg-slate-950/20 backdrop-blur-[1px]"
        />
      )}
      <aside className={`${open ? 'fixed inset-y-0 right-0 z-50 flex w-[min(94vw,400px)] shadow-2xl' : 'hidden'} shrink-0 flex-col border-l border-slate-200 bg-white`}>
      <header className="flex min-h-[73px] items-center justify-between border-b border-slate-200 px-5">
        <div>
          <h3 className="text-sm font-extrabold text-slate-950">Customer details</h3>
          <p className="mt-0.5 text-[10px] text-slate-400">CRM context for this conversation</p>
        </div>
        <button
          onClick={close}
          aria-label="Close customer details"
          className="grid h-9 w-9 place-items-center rounded-xl hover:bg-slate-100"
        >
          <X size={17} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-4">
        {!conversation ? null : !context ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-center">
            <AlertCircle className="mx-auto text-amber-500" />
            <h4 className="mt-3 text-sm font-extrabold text-amber-900">Contact not linked</h4>
            <p className="mt-1 text-xs leading-relaxed text-amber-700">
              Link this WhatsApp number to a CRM contact to see opportunities, tasks, appointments, and activity.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Auto-Reply Status & Option */}
            {conversation?.channel === 'whatsapp' && (
              <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${conversation.is_auto_reply_active !== false ? 'bg-[#F0FDF4] text-[#166534]' : 'bg-slate-100 text-slate-500'}`}>
                      <Bot size={15} />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block leading-tight">Chat Auto-Reply</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {conversation.is_auto_reply_active !== false ? 'Bot active' : 'Bot paused'}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => mutateState?.({ is_auto_reply_active: conversation.is_auto_reply_active === false ? true : false })}
                    className={`px-3 py-1 rounded-xl text-xs font-bold border transition cursor-pointer active:scale-95 ${
                      conversation.is_auto_reply_active !== false 
                        ? 'bg-[#F0FDF4] text-[#166534] border-[#22C55E]/40 hover:bg-[#DCFCE7]' 
                        : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {conversation.is_auto_reply_active !== false ? 'Active (ON)' : 'Paused (OFF)'}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 leading-normal">
                  {conversation.is_auto_reply_active !== false 
                    ? 'Automated responses and bot workflows are active for this contact.' 
                    : 'Auto-reply is paused. Incoming messages will only be handled manually by your team.'}
                </p>
              </div>
            )}

            <ContextCard title="Contact" icon={UserCheck}>
              <div className="text-base font-extrabold text-slate-950">{context.contact.name}</div>
              <div className="mt-2 space-y-1.5 text-xs text-slate-500">
                <div>{context.contact.email || 'No email address'}</div>
                <div>{context.contact.phone || 'No phone number'}</div>
                {context.contact.job_title && <div>{context.contact.job_title}</div>}
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                {context.contact.tags?.map((tag: any) => (
                  <span
                    key={tag.id}
                    className="rounded-full px-2 py-1 text-[9px] font-extrabold"
                    style={{ backgroundColor: `${tag.color || '#64748b'}18`, color: tag.color || '#64748b' }}
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
              <Link
                to={`/contacts/edit/${context.contact.id}`}
                className="mt-4 inline-flex items-center text-xs font-extrabold text-emerald-700 hover:text-emerald-800"
              >
                Open contact record →
              </Link>
            </ContextCard>

            {context.contact.business && (
              <ContextCard title="Company" icon={Building2}>
                <div className="text-sm font-extrabold text-slate-900">
                  {context.contact.business.business_name}
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  {context.contact.business.industry || 'Industry not set'}
                  {context.contact.business.owner?.name && ` · ${context.contact.business.owner.name}`}
                </div>
              </ContextCard>
            )}

            <ContextCard
              title="Open opportunities"
              icon={Flag}
              count={context.contact.opportunities?.length || 0}
            >
              {context.contact.opportunities?.length ? context.contact.opportunities.map((opportunity: any) => (
                <div key={opportunity.id} className="border-t border-slate-100 py-2.5 first:border-0">
                  <div className="text-xs font-bold text-slate-800">{opportunity.name}</div>
                  <div className="mt-0.5 text-[10px] text-slate-400">
                    {opportunity.stage?.name} · {opportunity.currency_code} {Number(opportunity.value || 0).toLocaleString()}
                  </div>
                </div>
              )) : <EmptyLine text="No open opportunities" />}
            </ContextCard>

            <ContextCard
              title="Tasks"
              icon={ListTodo}
              count={context.contact.tasks?.length || 0}
              action={(
                <button
                  onClick={() => setTaskOpen(!taskOpen)}
                  className="text-[10px] font-extrabold text-emerald-700"
                >
                  + Follow-up
                </button>
              )}
            >
              {taskOpen && (
                <div className="mb-3 space-y-2 rounded-xl bg-slate-50 p-3">
                  <input
                    value={task.title}
                    onChange={(event) => setTask({ ...task, title: event.target.value })}
                    className={`${control} w-full`}
                    placeholder="Task title"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={task.owner_id}
                      onChange={(event) => setTask({ ...task, owner_id: event.target.value })}
                      className={control}
                    >
                      <option value="">Unassigned</option>
                      {boot?.users?.map((user: any) => (
                        <option key={user.id} value={user.id}>{user.name}</option>
                      ))}
                    </select>
                    <select
                      value={task.priority}
                      onChange={(event) => setTask({ ...task, priority: event.target.value })}
                      className={control}
                    >
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                  <input
                    type="datetime-local"
                    value={task.due_at}
                    onChange={(event) => setTask({ ...task, due_at: event.target.value })}
                    className={`${control} w-full`}
                  />
                  {error && <p className="text-[10px] font-semibold text-red-600">{error}</p>}
                  <button
                    onClick={createTask}
                    disabled={saving || !task.title.trim()}
                    className="w-full rounded-xl bg-emerald-600 py-2.5 text-[10px] font-extrabold text-white disabled:opacity-40"
                  >
                    {saving ? 'Creating…' : 'Create follow-up task'}
                  </button>
                </div>
              )}
              {context.contact.tasks?.length ? context.contact.tasks.map((item: any) => (
                <div key={item.id} className="border-t border-slate-100 py-2.5 first:border-0">
                  <div className="text-xs font-semibold text-slate-800">{item.title}</div>
                  <div className="mt-0.5 text-[10px] text-slate-400">
                    {item.owner?.name || 'Unassigned'}
                    {item.due_at && ` · ${new Date(item.due_at).toLocaleDateString()}`}
                  </div>
                </div>
              )) : <EmptyLine text="No open tasks" />}
            </ContextCard>

            <ContextCard
              title="Appointments"
              icon={CalendarDays}
              count={context.contact.appointments?.length || 0}
            >
              {context.contact.appointments?.length ? context.contact.appointments.map((appointment: any) => (
                <div key={appointment.id} className="border-t border-slate-100 py-2.5 first:border-0">
                  <div className="text-xs font-semibold text-slate-800">{appointment.title}</div>
                  <div className="mt-0.5 text-[10px] text-slate-400">
                    {new Date(appointment.starts_at).toLocaleString()}
                  </div>
                </div>
              )) : <EmptyLine text="No upcoming appointments" />}
            </ContextCard>

            <ContextCard title="Recent activity" icon={Clock3}>
              {context.activities?.length ? context.activities.slice(0, 5).map((activity: any) => (
                <div key={activity.id} className="border-t border-slate-100 py-2.5 first:border-0">
                  <div className="text-xs font-semibold text-slate-700">{activity.title}</div>
                  <div className="mt-0.5 text-[9px] text-slate-400">
                    {relativeTime(activity.occurred_at)} · {activity.user?.name || 'System'}
                  </div>
                </div>
              )) : <EmptyLine text="No recent CRM activity" />}
            </ContextCard>
          </div>
        )}
      </div>
      </aside>
    </>
  );
}

function InboxSettingsModal({
  boot,
  close,
  reload,
}: {
  boot: any;
  close: () => void;
  reload: () => Promise<void>;
}) {
  const [tab, setTab] = useState<'snippets' | 'sla' | 'autoreply' | 'report'>('snippets');
  const [snippets, setSnippets] = useState<any[]>([]);
  const [snippet, setSnippet] = useState({
    title: '',
    category: 'General',
    body: '',
    visibility: 'shared',
  });
  const existingPolicy = boot?.sla_policies?.find((item: any) => item.channel === 'whatsapp');
  const [policy, setPolicy] = useState<any>(existingPolicy || {
    channel: 'whatsapp',
    response_minutes: 60,
    warning_minutes: 15,
    is_active: false,
    ai_reply_stops_clock: false,
    workflow_reply_stops_clock: false,
  });
  const [report, setReport] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const [snippetResult, reportResult] = await Promise.all([
      unifiedInboxApi.snippets(),
      unifiedInboxApi.slaReport('whatsapp').catch(() => null),
    ]);
    setSnippets(snippetResult.data || []);
    setReport(reportResult);
  };

  useEffect(() => {
    load();
  }, []);

  const saveSnippet = async () => {
    setSaving(true);
    try {
      await unifiedInboxApi.saveSnippet(snippet);
      setSnippet({ title: '', category: 'General', body: '', visibility: 'shared' });
      await load();
    } finally {
      setSaving(false);
    }
  };

  const savePolicy = async () => {
    setSaving(true);
    try {
      const result = await unifiedInboxApi.saveSlaPolicy({ ...policy, channel: 'whatsapp' });
      setPolicy(result.policy);
      await reload();
      await load();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/55 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-extrabold text-slate-950">WhatsApp inbox settings</h2>
            <p className="mt-1 text-xs text-slate-500">Saved replies and response-time monitoring</p>
          </div>
          <button
            onClick={close}
            className="grid h-10 w-10 place-items-center rounded-xl hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </header>

        <div className="flex border-b border-slate-200 px-5">
          {(['snippets', 'sla', 'autoreply', 'report'] as const).map((item) => (
            <button
              key={item}
              onClick={() => setTab(item)}
              className={`border-b-2 px-4 py-3.5 text-xs font-extrabold capitalize ${
                tab === item
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {item === 'sla' ? 'SLA policy' : item === 'autoreply' ? 'Auto-Reply' : item}
            </button>
          ))}
        </div>

        <div className="max-h-[68vh] overflow-y-auto p-6">
          {tab === 'snippets' && (
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <h3 className="text-sm font-extrabold text-slate-900">Create saved reply</h3>
                <input
                  value={snippet.title}
                  onChange={(event) => setSnippet({ ...snippet, title: event.target.value })}
                  placeholder="Reply title"
                  className={`${control} w-full`}
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    value={snippet.category}
                    onChange={(event) => setSnippet({ ...snippet, category: event.target.value })}
                    placeholder="Category"
                    className={control}
                  />
                  <select
                    value={snippet.visibility}
                    onChange={(event) => setSnippet({ ...snippet, visibility: event.target.value })}
                    className={control}
                  >
                    <option value="shared">Shared</option>
                    <option value="private">Private</option>
                  </select>
                </div>
                <textarea
                  rows={8}
                  value={snippet.body}
                  onChange={(event) => setSnippet({ ...snippet, body: event.target.value })}
                  placeholder="Reply text. Variables: {{contact.first_name}}, {{contact.company}}, {{agent.name}}"
                  className="w-full rounded-2xl border border-slate-200 p-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
                <div className="rounded-xl bg-slate-50 p-3 text-[10px] leading-relaxed text-slate-500">
                  Saved replies insert text into the composer. WhatsApp messaging-window and template rules still apply.
                </div>
                <button
                  disabled={saving || !snippet.title || !snippet.body}
                  onClick={saveSnippet}
                  className="w-full rounded-xl bg-emerald-600 py-3 text-xs font-extrabold text-white disabled:opacity-40"
                >
                  Save reply
                </button>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-extrabold text-slate-900">Available replies</h3>
                <div className="space-y-2">
                  {snippets.map((item) => (
                    <div key={item.id} className="rounded-2xl border border-slate-200 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-xs font-extrabold text-slate-900">{item.title}</div>
                          <div className="mt-0.5 text-[9px] uppercase text-slate-400">
                            {item.category || 'General'} · {item.visibility}
                          </div>
                        </div>
                        <button
                          onClick={async () => {
                            await unifiedInboxApi.deleteSnippet(item.id);
                            await load();
                          }}
                          className="text-[10px] font-extrabold text-red-600"
                        >
                          Delete
                        </button>
                      </div>
                      <p className="mt-2 line-clamp-3 whitespace-pre-wrap text-xs leading-relaxed text-slate-500">
                        {item.body}
                      </p>
                    </div>
                  ))}
                  {!snippets.length && <EmptyLine text="No saved replies" />}
                </div>
              </div>
            </div>
          )}

          {tab === 'sla' && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-xs leading-relaxed text-blue-800">
                The timer starts when a WhatsApp customer sends an unanswered message. A human reply stops the timer. Reassignment does not reset it.
              </div>
              <div className="rounded-2xl border border-slate-200 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <WhatsAppIcon size={16} />
                    <span className="text-sm font-extrabold text-slate-900">WhatsApp response SLA</span>
                  </div>
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-600">
                    <input
                      type="checkbox"
                      checked={!!policy.is_active}
                      onChange={(event) => setPolicy({ ...policy, is_active: event.target.checked })}
                    />
                    Active
                  </label>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="text-[10px] font-extrabold text-slate-500">
                    Response target (minutes)
                    <input
                      type="number"
                      min="1"
                      value={policy.response_minutes}
                      onChange={(event) => setPolicy({ ...policy, response_minutes: Number(event.target.value) })}
                      className={`${control} mt-1.5 w-full`}
                    />
                  </label>
                  <label className="text-[10px] font-extrabold text-slate-500">
                    Warning before due (minutes)
                    <input
                      type="number"
                      min="0"
                      value={policy.warning_minutes}
                      onChange={(event) => setPolicy({ ...policy, warning_minutes: Number(event.target.value) })}
                      className={`${control} mt-1.5 w-full`}
                    />
                  </label>
                </div>
                <button
                  disabled={saving}
                  onClick={savePolicy}
                  className="mt-4 rounded-xl bg-slate-950 px-5 py-2.5 text-[10px] font-extrabold text-white disabled:opacity-40"
                >
                  Save WhatsApp policy
                </button>
              </div>
            </div>
          )}

          {tab === 'report' && (
            <div>
              <div className="mb-3 flex items-center gap-2 text-xs font-bold text-slate-500">
                <WhatsAppIcon /> WhatsApp SLA performance
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {['running', 'warning', 'overdue', 'met'].map((key) => (
                  <div key={key} className="rounded-2xl border border-slate-200 p-4">
                    <div className="text-[9px] font-extrabold uppercase text-slate-400">{key}</div>
                    <div className="mt-1 text-2xl font-extrabold text-slate-950">
                      {report?.counts?.[key] || 0}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-2xl border border-slate-200 p-5">
                <div className="text-xs font-bold text-slate-500">Average human response</div>
                <div className="mt-1 text-xl font-extrabold text-slate-950">
                  {report?.average_response_minutes != null
                    ? `${report.average_response_minutes} minutes`
                    : 'No completed SLA samples'}
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-500">
                  Calculated from WhatsApp message timestamps and qualifying human replies.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Avatar({ item }: { item: InboxConversation }) {
  if (item.avatar_url) {
    return <img src={item.avatar_url} alt="" className="h-11 w-11 shrink-0 rounded-2xl object-cover" />;
  }
  return (
    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-slate-100 text-sm font-extrabold text-slate-600">
      {(item.display_name || '?').charAt(0).toUpperCase()}
    </div>
  );
}

function WhatsAppIcon({ size = 13 }: { size?: number }) {
  return <MessageCircle size={size} className="shrink-0 text-emerald-600" />;
}

function StatePill({ value }: { value: string }) {
  const tone = value === 'urgent' || value === 'overdue'
    ? 'bg-red-50 text-red-700'
    : value === 'high' || value === 'pending'
      ? 'bg-amber-50 text-amber-700'
      : value === 'resolved'
        ? 'bg-slate-100 text-slate-500'
        : 'bg-emerald-50 text-emerald-700';
  return (
    <span className={`rounded-full px-2 py-1 text-[8px] font-extrabold uppercase ${tone}`}>
      {value}
    </span>
  );
}

function SlaPill({ status, due }: { status?: string | null; due?: string | null }) {
  if (!status || status === 'inactive' || status === 'met') return null;
  const tone = status === 'overdue'
    ? 'bg-red-100 text-red-700'
    : status === 'warning'
      ? 'bg-amber-100 text-amber-700'
      : status === 'paused'
        ? 'bg-slate-100 text-slate-500'
        : 'bg-blue-50 text-blue-700';
  return (
    <span className={`rounded-full px-2 py-1 text-[8px] font-extrabold uppercase ${tone}`}>
      {status}{due && status !== 'paused' ? ` · ${countdown(due)}` : ''}
    </span>
  );
}

function DeliveryIcon({ status }: { status?: string }) {
  if (status === 'read' || status === 'delivered') return <CheckCheck size={12} />;
  if (status === 'failed') return <AlertCircle size={12} />;
  return <Check size={12} />;
}

function ContextCard({
  title,
  icon: Icon,
  count,
  action,
  children,
}: {
  title: string;
  icon: any;
  count?: number;
  action?: any;
  children: any;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-wide text-slate-500">
        <Icon size={14} className="text-emerald-600" />
        <span className="flex-1">{title}</span>
        {count !== undefined && (
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] text-slate-500">{count}</span>
        )}
        {action}
      </div>
      {children}
    </section>
  );
}

function EmptyLine({ text }: { text: string }) {
  return <div className="py-4 text-center text-[10px] font-semibold text-slate-400">{text}</div>;
}

function ConversationSkeleton() {
  return (
    <div className="space-y-px">
      {Array.from({ length: 7 }, (_, index) => (
        <div key={index} className="flex gap-3 border-b border-slate-100 p-4">
          <div className="h-11 w-11 animate-pulse rounded-2xl bg-slate-100" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-2/5 animate-pulse rounded bg-slate-100" />
            <div className="h-3 w-4/5 animate-pulse rounded bg-slate-100" />
            <div className="h-3 w-3/5 animate-pulse rounded bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

function relativeTime(value?: string) {
  if (!value) return 'No activity';
  const delta = Date.now() - new Date(value).getTime();
  const minutes = Math.floor(delta / 60000);
  if (minutes < 1) return 'Now';
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

function formatTime(value: string) {
  return new Date(value).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function countdown(value: string) {
  const minutes = Math.ceil((new Date(value).getTime() - Date.now()) / 60000);
  if (minutes <= 0) return 'due';
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ${minutes % 60}m`;
}
