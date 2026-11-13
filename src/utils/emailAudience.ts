import type { AudienceFilter } from '../types/emailCampaign';

// The same payload is used for the count, draft, and campaign launch.
export function campaignAudienceFilters(
  filters: AudienceFilter,
): AudienceFilter {
  if (filters.audience_type === 'all') return { audience_type: 'all' };
  return Object.fromEntries(
    Object.entries(filters)
      .map(([key, value]) => [
        key,
        typeof value === 'string' ? value.trim() : value,
      ])
      .filter(([key, value]) => {
        if (value == null || value === '' || value === false) return false;
        if (Array.isArray(value) && value.length === 0 && key !== 'contact_ids')
          return false;
        if (key === 'email_history' && value === 'all') return false;
        if (key === 'min_lead_score' && Number(value) <= 0) return false;
        return true;
      }),
  ) as AudienceFilter;
}
