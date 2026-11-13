import { Building2, Link2, MapPin, PanelTop } from 'lucide-react';
import type { EmailBrandSettings } from '../../utils/emailBranding';

interface Props {
  value: EmailBrandSettings;
  onChange: (value: EmailBrandSettings) => void;
}

const inputClass =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-normal text-slate-800 outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100';

export default function EmailBrandEditor({ value, onChange }: Props) {
  const field = (
    key: keyof Omit<EmailBrandSettings, 'navigation' | 'socials'>,
    label: string,
    type = 'text',
    placeholder = '',
  ) => (
    <label className="block space-y-1.5 text-xs font-semibold text-slate-600">
      <span>{label}</span>
      <input
        type={type}
        value={value[key]}
        placeholder={placeholder}
        maxLength={type === 'url' ? 2048 : 1000}
        onChange={(e) => onChange({ ...value, [key]: e.target.value })}
        className={inputClass}
      />
    </label>
  );

  return (
    <section
      aria-label="Template brand settings"
      className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/60"
    >
      <div className="border-b border-slate-200 px-4 py-3">
        <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900">
          <Building2 size={16} className="text-green-800" /> Header, social
          links & address
        </h4>
        <p className="mt-1 text-xs text-slate-500">
          Saved with this template and reused in every campaign. The message
          stays independently editable below.
        </p>
      </div>
      <details open className="group border-b border-slate-200 p-4">
        <summary className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-slate-800">
          <PanelTop size={15} /> Header & contact details
        </summary>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {field('company_name', 'Brand name')}
          {field('company_full_name', 'Company / legal name')}
          {field(
            'logo_url',
            'Logo image URL (optional)',
            'url',
            'https://your-company.com/logo.png',
          )}
          {field(
            'website_url',
            'Website URL',
            'url',
            'https://your-company.com',
          )}
          {field('contact_label', 'Contact heading')}
          {field('phone', 'Phone number', 'tel')}
          {field('email', 'Contact email', 'email')}
          {field('department', 'Signature / department')}
        </div>
        <p className="mt-3 text-xs text-slate-400">
          Use a publicly accessible PNG or JPG logo URL. Leave the logo empty to
          use the brand name.
        </p>
      </details>
      <details className="border-b border-slate-200 p-4">
        <summary className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-slate-800">
          <Link2 size={15} /> Navigation & social links
        </summary>
        <p className="mt-3 text-xs text-slate-500">
          Leave a URL empty to hide that link.
        </p>
        <div className="mt-3 space-y-3">
          {value.navigation.map((link, index) => (
            <div
              key={index}
              className="grid grid-cols-1 gap-2 sm:grid-cols-[140px_1fr]"
            >
              <input
                aria-label={`Navigation link ${index + 1} label`}
                value={link.label}
                maxLength={40}
                className={inputClass}
                onChange={(e) =>
                  onChange({
                    ...value,
                    navigation: value.navigation.map((item, i) =>
                      i === index ? { ...item, label: e.target.value } : item,
                    ),
                  })
                }
              />
              <input
                aria-label={`Navigation link ${index + 1} URL`}
                type="url"
                value={link.url}
                maxLength={2048}
                placeholder="https://"
                className={inputClass}
                onChange={(e) =>
                  onChange({
                    ...value,
                    navigation: value.navigation.map((item, i) =>
                      i === index ? { ...item, url: e.target.value } : item,
                    ),
                  })
                }
              />
            </div>
          ))}
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {(['linkedin', 'facebook', 'instagram', 'x'] as const).map((key) => (
            <label
              key={key}
              className="block space-y-1.5 text-xs font-semibold text-slate-600"
            >
              <span>
                {key === 'x'
                  ? 'X / Twitter'
                  : key[0].toUpperCase() + key.slice(1)}
              </span>
              <input
                type="url"
                value={value.socials[key]}
                maxLength={2048}
                placeholder="https://"
                className={inputClass}
                onChange={(e) =>
                  onChange({
                    ...value,
                    socials: { ...value.socials, [key]: e.target.value },
                  })
                }
              />
            </label>
          ))}
        </div>
      </details>
      <details open className="p-4">
        <summary className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-slate-800">
          <MapPin size={15} /> Footer address
        </summary>
        <label className="mt-3 block space-y-1.5 text-xs font-semibold text-slate-600">
          <span>Business postal address</span>
          <textarea
            value={value.address}
            onChange={(e) => onChange({ ...value, address: e.target.value })}
            maxLength={1000}
            rows={2}
            className={inputClass}
          />
        </label>
      </details>
    </section>
  );
}
