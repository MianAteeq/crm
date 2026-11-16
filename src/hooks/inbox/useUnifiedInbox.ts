import { useCallback, useEffect, useRef, useState } from 'react';
import { AuthService } from '../../services/authService';
import {
  InboxChannel,
  InboxConversation,
  InboxView,
  unifiedInboxApi,
} from '../../services/unifiedInboxApi';
import { useRealtime } from '../useRealtime';

// Social channels remain implemented on the backend, but the customer-facing
// inbox stays WhatsApp-only until the Meta approval and rollout are complete.
const ACTIVE_CHANNEL: InboxChannel = 'whatsapp';

export function useUnifiedInbox() {
  const [boot, setBoot] = useState<any>(null);
  const [items, setItems] = useState<InboxConversation[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [view, setView] = useState<InboxView>('team');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<any>({});
  const [selected, setSelected] = useState<{ channel: InboxChannel; id: number } | null>(null);
  const [detail, setDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState('');
  const listRequest = useRef(0);
  const detailRequest = useRef(0);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [view, debouncedSearch, status]);

  const loadBoot = useCallback(async () => {
    try {
      setBoot(await unifiedInboxApi.bootstrap());
    } catch (e: any) {
      setError(e.response?.data?.message || 'Inbox configuration could not be loaded.');
    }
  }, []);

  const loadList = useCallback(async (silent = false) => {
    const requestId = ++listRequest.current;
    if (!silent) setLoading(true);
    setError('');

    try {
      const result = await unifiedInboxApi.conversations({
        view,
        search: debouncedSearch || undefined,
        channel: ACTIVE_CHANNEL,
        status: status || undefined,
        page,
        per_page: 30,
      });

      if (requestId !== listRequest.current) return;
      setItems((result.data || []).filter(
        (item: InboxConversation) => item.channel === ACTIVE_CHANNEL,
      ));
      setCounts(result.counts || {});
      setMeta(result.meta || {});
    } catch (e: any) {
      if (requestId === listRequest.current) {
        setError(e.response?.data?.message || 'WhatsApp conversations could not be loaded.');
      }
    } finally {
      if (requestId === listRequest.current && !silent) setLoading(false);
    }
  }, [view, debouncedSearch, status, page]);

  const loadDetail = useCallback(async (target = selected, silent = false) => {
    if (!target || target.channel !== ACTIVE_CHANNEL) return;
    const requestId = ++detailRequest.current;
    if (!silent) setDetailLoading(true);

    try {
      const result = await unifiedInboxApi.detail(target.channel, target.id);
      if (requestId === detailRequest.current) setDetail(result);
    } catch (e: any) {
      if (requestId === detailRequest.current) {
        setError(e.response?.data?.message || 'Conversation could not be loaded.');
      }
    } finally {
      if (requestId === detailRequest.current && !silent) setDetailLoading(false);
    }
  }, [selected]);

  useEffect(() => {
    loadBoot();
  }, [loadBoot]);

  useEffect(() => {
    loadList();
  }, [loadList]);

  useEffect(() => {
    if (selected) loadDetail(selected);
    else setDetail(null);
  }, [selected?.channel, selected?.id]);

  const refresh = useCallback(async () => {
    await Promise.all([
      loadList(true),
      selected ? loadDetail(selected, true) : Promise.resolve(),
    ]);
  }, [loadList, loadDetail, selected]);

  useEffect(() => {
    const timer = setInterval(() => refresh(), 30000);
    return () => clearInterval(timer);
  }, [refresh]);

  const tenantId = AuthService.getTenantId() || '1';
  useRealtime({
    channel: `tenant.${tenantId}`,
    event: '.message.received',
    enabled: true,
    isPrivate: false,
    onEvent: () => refresh(),
  });

  const mutateState = async (data: any) => {
    if (!selected) return;
    const current = selected;
    setItems((previous) => previous.map((item) =>
      item.channel === current.channel && item.source_id === current.id
        ? { ...item, ...data }
        : item,
    ));
    setDetail((previous: any) => previous
      ? { ...previous, conversation: { ...previous.conversation, ...data } }
      : previous,
    );

    try {
      await unifiedInboxApi.updateState(current.channel, current.id, data);
      await refresh();
    } catch {
      await refresh();
    }
  };

  const send = async (message: string) => {
    if (!selected) return;
    await unifiedInboxApi.sendText(ACTIVE_CHANNEL, selected.id, message);
    await refresh();
  };

  const addNote = async (content: string) => {
    if (!selected) return;
    await unifiedInboxApi.addNote(ACTIVE_CHANNEL, selected.id, content);
    await loadDetail(selected, true);
  };

  return {
    boot,
    items,
    counts,
    view,
    setView,
    search,
    setSearch,
    status,
    setStatus,
    page,
    setPage,
    meta,
    selected,
    setSelected,
    detail,
    loading,
    detailLoading,
    error,
    loadBoot,
    refresh,
    mutateState,
    send,
    addNote,
  };
}
