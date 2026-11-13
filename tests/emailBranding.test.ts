import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  PROFESSIONAL_FRAMES,
  assembleFullEmailHtml,
} from '../src/utils/emailTemplateFrames';
import {
  DEFAULT_EMAIL_BRAND,
  emailBrandSettings,
  corporateEmailHeader,
  corporateEmailFooter,
  extractEmailBody,
  safeEmailUrl,
  emailPlainText,
} from '../src/utils/emailBranding';

const frame = PROFESSIONAL_FRAMES.find(
  (frame) => frame.id === 'corporate-letter',
)!;

describe('Reusable corporate email layout', () => {
  it('renders the reference letterhead, black navigation, and lime social footer', () => {
    const html = assembleFullEmailHtml(
      frame,
      '<p>Message content</p>',
      'Sender',
    );
    assert.ok(html.includes('Andlyl'));
    assert.ok(html.includes('background-color:#000000'));
    assert.ok(html.includes('#ccff00'));
    assert.ok(html.includes('19904 Hillside Ave'));
    assert.ok(html.includes('{{unsubscribe_url}}'));
    assert.ok(!html.includes('<svg'));
  });

  it('preserves nested tables and CTA buttons when extracting the message', () => {
    const body =
      '<p>First paragraph</p><table><tr><td>One</td><td><a href="https://example.test">Button</a></td></tr></table><p>Last paragraph</p>';
    const html = assembleFullEmailHtml(frame, body, 'Sender');
    assert.equal(extractEmailBody(html), body);
    assert.equal(
      (
        assembleFullEmailHtml(frame, extractEmailBody(html), 'Sender').match(
          /data-email-frame=/g,
        ) || []
      ).length,
      1,
    );
  });

  it('changes header, navigation, socials, and address independently of message content', () => {
    const brand = emailBrandSettings({
      company_name: 'Example Team',
      company_full_name: 'Example Ltd',
      email: 'help@example.test',
      phone: '+1 555 0100',
      logo_url: 'https://example.test/logo.png',
      website_url: 'https://example.test',
      address: '42 Example Street\nExample City',
      navigation: [{ label: 'About', url: 'https://example.test/about' }],
      socials: {
        linkedin: 'https://linkedin.com/company/example',
        facebook: '',
        instagram: '',
        x: '',
      },
    });
    const html = assembleFullEmailHtml(
      frame,
      '<p>Body remains the same</p>',
      'Sender',
      brand,
    );
    assert.ok(html.includes('Example Team'));
    assert.ok(html.includes('https://example.test/logo.png'));
    assert.ok(html.includes('https://example.test/about'));
    assert.ok(html.includes('42 Example Street<br />Example City'));
    assert.ok(html.includes('https://linkedin.com/company/example'));
    assert.ok(!html.includes('https://www.facebook.com'));
    assert.equal(extractEmailBody(html), '<p>Body remains the same</p>');
  });

  it('does not mutate another template when changing brand settings', () => {
    const first = emailBrandSettings();
    const second = emailBrandSettings();
    first.navigation[0].label = 'Changed';
    first.socials.linkedin = '';
    assert.equal(second.navigation[0].label, 'Company');
    assert.equal(DEFAULT_EMAIL_BRAND.navigation[0].label, 'Company');
    assert.notEqual(second.socials.linkedin, '');
  });

  it('escapes brand text and rejects executable or embedded-data URLs', () => {
    const brand = emailBrandSettings({
      company_name: '<img src=x onerror=alert(1)>',
      website_url: 'javascript:alert(1)',
      logo_url: 'data:image/svg+xml,test',
    });
    const html = corporateEmailHeader(brand) + corporateEmailFooter(brand);
    assert.ok(html.includes('&lt;img'));
    assert.ok(!html.includes('<img src=x'));
    assert.ok(!html.includes('href="javascript:'));
    assert.ok(!html.includes('src="data:'));
    assert.equal(safeEmailUrl('javascript:alert(1)'), '');
  });

  it('handles optional fields cleared and returned as null by the API', () => {
    const brand = emailBrandSettings(
      JSON.parse(
        '{"phone":null,"logo_url":null,"email":null,"address":null,"socials":{"facebook":null}}',
      ),
    );
    assert.equal(brand.phone, '');
    assert.equal(brand.email, '');
    assert.equal(brand.socials.facebook, '');
    assert.doesNotThrow(
      () => corporateEmailHeader(brand) + corporateEmailFooter(brand),
    );
  });

  it('updates the plain-text alternative with the current content', () => {
    const updated = assembleFullEmailHtml(
      frame,
      '<p>Updated message</p><p>Second paragraph</p>',
      'Sender',
    );
    const text = emailPlainText(updated);
    assert.ok(text.includes('Updated message\nSecond paragraph'));
    assert.ok(!text.includes('<p>'));
  });
});
