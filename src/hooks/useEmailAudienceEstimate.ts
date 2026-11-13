import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { AudienceEstimate, AudienceFilter } from '../types/emailCampaign';
import { emailCampaignApi } from '../services/emailCampaignApi';

export function useEmailAudienceEstimate(filters: AudienceFilter) {
  const key = JSON.stringify(filters);
  const stableFilters = useMemo(() => JSON.parse(key) as AudienceFilter, [key]);
  const [result, setResult] = useState<{
    key: string;
    data: AudienceEstimate;
  } | null>(null);
  const [isEstimating, setIsEstimating] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refresh, setRefresh] = useState(0);
  const requestNumber = useRef(0);
  useEffect(() => {
    const controller = new AbortController();
    const request = ++requestNumber.current;
    setIsEstimating(true);
    setError(null);
    const timer = window.setTimeout(async () => {
      try {
        const response = await emailCampaignApi.estimateAudience(
          stableFilters,
          controller.signal,
        );
        if (!controller.signal.aborted && request === requestNumber.current)
          setResult({ key, data: response.data });
      } catch (err: any) {
        if (!controller.signal.aborted && request === requestNumber.current) {
          setResult(null);
          setError(
            err.response?.data?.message ||
              'Could not count this audience. Check the filters and try again.',
          );
        }
      } finally {
        if (!controller.signal.aborted && request === requestNumber.current)
          setIsEstimating(false);
      }
    }, 350);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [key, stableFilters, refresh]);
  const refreshEstimate = useCallback(
    () => setRefresh((value) => value + 1),
    [],
  );
  return {
    estimate: result?.key === key ? result.data : null,
    isEstimating,
    error,
    refreshEstimate,
  };
}
