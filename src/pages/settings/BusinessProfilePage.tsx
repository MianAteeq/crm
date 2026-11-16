import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';
import { Building2, CheckCircle2, Clock3, Coins, ImagePlus, Loader2, MapPin, Save, ShieldCheck, X } from 'lucide-react';

import { toast } from '../../components/ui/Toast';
import { useAuthStore } from '../../store/authStore';
import { businessProfileApi, BusinessProfile } from '../../services/businessProfileApi';

const currencies = ['SAR', 'USD', 'AED', 'EUR', 'GBP', 'PKR', 'INR', 'QAR', 'KWD', 'BHD', 'OMR'];

const emptyProfile: BusinessProfile = {
  name: '',
  legal_name: '',
  logo_url: null,
  address_line_1: '',
  address_line_2: '',
  city: '',
  region: '',
  postal_code: '',
  country_code: 'SA',
  currency_code: 'SAR',
  timezone: 'Asia/Riyadh',
  customer_timezone_policy: 'customer_when_available',
  timezone_precedence: '',
  currency_policy: '',
};

export default function BusinessProfilePage() {
  const updateUserProfile = useAuthStore((state) => state.updateProfile);
  const [profile, setProfile] = useState<BusinessProfile>(emptyProfile);
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [removeLogo, setRemoveLogo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const timezones = useMemo(() => {
    const supported = (Intl as any).supportedValuesOf?.('timeZone') as string[] | undefined;
    return supported || ['UTC', 'Asia/Riyadh', 'Asia/Karachi', 'Asia/Dubai', 'Europe/London', 'America/New_York'];
  }, []);

  useEffect(() => {
    businessProfileApi.get()
      .then((data) => {
        setProfile({ ...emptyProfile, ...data });
        setLogoPreview(data.logo_url);
      })
      .catch((error) => toast.error('Could not load business profile', error.message))
      .finally(() => setLoading(false));
  }, []);

  const updateField = (field: keyof BusinessProfile, value: string) => {
    setProfile((current) => ({ ...current, [field]: value }));
  };

  const handleLogo = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setLogo(file);
    setRemoveLogo(false);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);

    try {
      const body = new FormData();
      const editableFields: (keyof BusinessProfile)[] = [
        'name', 'legal_name', 'address_line_1', 'address_line_2', 'city', 'region',
        'postal_code', 'country_code', 'currency_code', 'timezone', 'customer_timezone_policy',
      ];
      editableFields.forEach((field) => body.append(field, String(profile[field] ?? '')));
      if (logo) body.append('logo', logo);
      if (removeLogo) body.append('remove_logo', '1');

      const result = await businessProfileApi.update(body);
      setProfile(result.data);
      setLogo(null);
      setRemoveLogo(false);
      setLogoPreview(result.data.logo_url);
      updateUserProfile({ businessName: result.data.name });

      if (result.currency_change_notice) {
        toast.info('Currency updated safely', result.currency_change_notice);
      }
    } catch (error: any) {
      toast.error('Could not save business profile', error.response?.data?.message || error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="w-7 h-7 animate-spin text-emerald-600" /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-emerald-50/70 p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"><Building2 className="w-6 h-6" /></div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Workspace settings</p>
            <h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-slate-950">Business profile</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">One identity, address, currency and timezone for campaigns, pages, billing and automation.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        <aside className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Business logo</p>
            <div className="mt-4 aspect-square rounded-3xl border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center overflow-hidden">
              {logoPreview ? <img src={logoPreview} alt="Business logo" className="w-full h-full object-contain p-5" /> : <Building2 className="w-16 h-16 text-slate-300" />}
            </div>
            <label className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white cursor-pointer hover:bg-slate-800">
              <ImagePlus className="w-4 h-4" /> Choose logo
              <input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" className="hidden" onChange={handleLogo} />
            </label>
            {logoPreview && (
              <button type="button" onClick={() => { setLogo(null); setLogoPreview(null); setRemoveLogo(true); }} className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50">
                <X className="w-4 h-4" /> Remove logo
              </button>
            )}
            <p className="mt-3 text-[11px] leading-relaxed text-slate-400">PNG, JPG, WebP or SVG. Maximum 2 MB.</p>
          </div>

          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-900">
            <div className="flex items-center gap-2 font-bold text-sm"><ShieldCheck className="w-4 h-4" /> Shared safely</div>
            <p className="mt-2 text-xs leading-relaxed text-emerald-800/80">Changes are workspace-scoped and audited. Existing financial values are never rewritten after a currency change.</p>
          </div>
        </aside>

        <div className="space-y-6">
          <section className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5"><Building2 className="w-5 h-5 text-emerald-600" /><h2 className="font-extrabold text-slate-950">Identity</h2></div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Workspace name" value={profile.name} onChange={(v) => updateField('name', v)} required />
              <Field label="Legal business name" value={profile.legal_name} onChange={(v) => updateField('legal_name', v)} required />
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5"><MapPin className="w-5 h-5 text-emerald-600" /><h2 className="font-extrabold text-slate-950">Registered address</h2></div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2"><Field label="Address line 1" value={profile.address_line_1} onChange={(v) => updateField('address_line_1', v)} required /></div>
              <div className="sm:col-span-2"><Field label="Address line 2" value={profile.address_line_2 || ''} onChange={(v) => updateField('address_line_2', v)} /></div>
              <Field label="City" value={profile.city} onChange={(v) => updateField('city', v)} required />
              <Field label="State / region" value={profile.region || ''} onChange={(v) => updateField('region', v)} />
              <Field label="Postal code" value={profile.postal_code || ''} onChange={(v) => updateField('postal_code', v)} />
              <Field label="Country code" value={profile.country_code} onChange={(v) => updateField('country_code', v.toUpperCase().slice(0, 2))} required hint="ISO code, for example SA" />
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-3"><Coins className="w-5 h-5 text-emerald-600" /><h2 className="font-extrabold text-slate-950">Currency</h2></div>
                <select value={profile.currency_code} onChange={(e) => updateField('currency_code', e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm font-semibold outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10">
                  {currencies.map((currency) => <option key={currency}>{currency}</option>)}
                </select>
                <p className="mt-2 text-[11px] text-slate-500">Applies to new financial values. Historical amounts keep their original currency.</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-3"><Clock3 className="w-5 h-5 text-emerald-600" /><h2 className="font-extrabold text-slate-950">Workspace timezone</h2></div>
                <select value={profile.timezone} onChange={(e) => updateField('timezone', e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm font-semibold outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10">
                  {timezones.map((timezone) => <option key={timezone}>{timezone}</option>)}
                </select>
                <label className="mt-4 flex items-start gap-3 rounded-2xl bg-slate-50 p-3.5 border border-slate-100 cursor-pointer">
                  <input type="checkbox" checked={profile.customer_timezone_policy === 'customer_when_available'} onChange={(e) => updateField('customer_timezone_policy', e.target.checked ? 'customer_when_available' : 'business_only')} className="mt-0.5 accent-emerald-600" />
                  <span><span className="block text-xs font-bold text-slate-800">Use customer timezone when available</span><span className="mt-1 block text-[11px] text-slate-500">Otherwise automation uses the workspace timezone.</span></span>
                </label>
              </div>
            </div>
          </section>

          <div className="sticky bottom-4 flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-xl backdrop-blur">
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Shared profile for this workspace</div>
            <button type="submit" disabled={saving} className="ml-auto flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-xs font-extrabold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 disabled:opacity-60">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save business profile
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, required, hint }: { label: string; value: string; onChange: (value: string) => void; required?: boolean; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold text-slate-700">{label}{required && <span className="text-rose-500"> *</span>}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} required={required} className="w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10" />
      {hint && <span className="mt-1 block text-[10px] text-slate-400">{hint}</span>}
    </label>
  );
}
