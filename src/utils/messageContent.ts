export function normalizeMessageContent(value: unknown, fallback = ''): string {
  let current = value;
  const visited = new Set<object>();

  for (let depth = 0; depth < 6; depth += 1) {
    if (current === null || current === undefined) return fallback;
    if (typeof current === 'string') return current;
    if (typeof current === 'number' || typeof current === 'boolean') return String(current);

    if (Array.isArray(current)) {
      const parts = current
        .map((item) => normalizeMessageContent(item))
        .filter(Boolean);
      return parts.length > 0 ? parts.join('\n') : fallback;
    }

    if (typeof current !== 'object') return fallback;
    if (visited.has(current)) return fallback;
    visited.add(current);

    const record = current as Record<string, unknown>;
    const next =
      record.body ??
      record.message ??
      record.content ??
      record.text ??
      record.caption ??
      record.payload;

    if (next === undefined || next === current) return fallback;
    current = next;
  }

  return fallback;
}
