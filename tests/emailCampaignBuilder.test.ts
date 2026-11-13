import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { campaignAudienceFilters } from '../src/utils/emailAudience';
import { campaignEmailTemplate } from '../src/utils/campaignEmailTemplate';
import {
  assembleFullEmailHtml,
  PROFESSIONAL_FRAMES,
} from '../src/utils/emailTemplateFrames';
import {
  emailBrandSettings,
  extractEmailBody,
} from '../src/utils/emailBranding';
import type { EmailTemplate } from '../src/types/emailCampaign';

describe('Campaign audience payload', () => {
  it('drops every hidden filter when switching back to all CRM contacts', () => {
    assert.deepEqual(
      campaignAudienceFilters({
        audience_type: 'all',
        category_id: 12,
        email_history: 'never_sent',
        source: 'CRM',
        location: 'Lahore',
        industry: 'Dental',
        lead_quality_grades: ['A'],
        min_lead_score: 80,
        website_available: true,
      }),
      { audience_type: 'all' },
    );
  });
  it('keeps all selected filters together for estimation and campaign creation', () => {
    assert.deepEqual(
      campaignAudienceFilters({
        audience_type: 'filtered',
        category_id: 12,
        email_history: 'never_sent',
        source: 'CRM',
        location: ' Lahore ',
        industry: ' Dental ',
        lead_quality_grades: ['A', 'B'],
        min_lead_score: 70,
        website_available: true,
      }),
      {
        audience_type: 'filtered',
        category_id: 12,
        email_history: 'never_sent',
        source: 'CRM',
        location: 'Lahore',
        industry: 'Dental',
        lead_quality_grades: ['A', 'B'],
        min_lead_score: 70,
        website_available: true,
      },
    );
  });
  it('reset filters includes ungraded contacts and any history or score', () => {
    assert.deepEqual(
      campaignAudienceFilters({
        audience_type: 'filtered',
        email_history: 'all',
        source: ' ',
        industry: '',
        lead_quality_grades: [],
        min_lead_score: 0,
        website_available: false,
      }),
      { audience_type: 'filtered' },
    );
  });
  it('does not turn an empty explicit contact selection into an all audience', () => {
    assert.deepEqual(
      campaignAudienceFilters({ audience_type: 'selected', contact_ids: [] }),
      { audience_type: 'selected', contact_ids: [] },
    );
  });
});

describe('Saved campaign templates', () => {
  const frame = PROFESSIONAL_FRAMES.find(
    (item) => item.id === 'corporate-letter',
  )!;
  const brand = emailBrandSettings({
    company_name: 'Saved Company',
    address: 'Saved office address',
    socials: {
      linkedin: 'https://linkedin.com/company/saved',
      facebook: '',
      instagram: '',
      x: '',
    },
  });
  const template: EmailTemplate = {
    id: 42,
    name: 'Saved newsletter',
    category: 'Newsletter',
    subject: 'Saved subject',
    html_body: assembleFullEmailHtml(
      frame,
      '<p>Original message</p>',
      '{{from_name}}',
      brand,
    ),
    editor_data: {
      frame_id: frame.id,
      body_html: '<p>Original message</p>',
      brand,
    },
  };
  it('loads structured body and branding even after the template is renamed', () => {
    const loaded = campaignEmailTemplate(template);
    assert.equal(loaded.frameId, 'corporate-letter');
    assert.equal(loaded.bodyHtml, '<p>Original message</p>');
    assert.equal(loaded.brand.address, 'Saved office address');
    assert.equal(
      loaded.brand.socials.linkedin,
      'https://linkedin.com/company/saved',
    );
    assert.equal(loaded.customHtml, false);
    const changed = assembleFullEmailHtml(
      frame,
      '<p>Campaign-only edits</p>',
      'Sender',
      loaded.brand,
    );
    assert.equal(extractEmailBody(changed), '<p>Campaign-only edits</p>');
    assert.equal(template.editor_data?.body_html, '<p>Original message</p>');
  });
  it('detects saved frame markers without editor metadata and avoids nested wrappers', () => {
    const loaded = campaignEmailTemplate({ ...template, editor_data: null });
    assert.equal(loaded.frameId, frame.id);
    assert.equal(loaded.bodyHtml, '<p>Original message</p>');
  });
  it('preserves imported HTML with its own header, CSS, and footer', () => {
    const html =
      '<!doctype html><html><head><style>.message{color:red}</style></head><body><header>Custom header</header><p class="message">Original</p><footer>Custom footer</footer></body></html>';
    const loaded = campaignEmailTemplate({
      ...template,
      name: 'Custom import',
      html_body: html,
      editor_data: null,
    });
    assert.equal(loaded.customHtml, true);
    assert.equal(loaded.bodyHtml, html);
    assert.equal(loaded.frameId, null);
  });
});
