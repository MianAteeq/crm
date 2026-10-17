import { create } from 'zustand';
import { crmApi } from '../services/crmApi';
import defaultLogo from '../assets/logo-2.png';
import defaultFavicon from '../assets/fav-icon.png';

export interface IntegrationLogoItem {
  id: string | number;
  name: string;
  type?: 'notion' | 'tc' | 'linear' | 'hubspot' | 'vercel' | 'stripe' | string;
  logo_url?: string;
  url?: string;
  active?: boolean;
}

export const DEFAULT_INTEGRATION_LOGOS: IntegrationLogoItem[] = [
  { id: '1', name: 'NOTION', type: 'notion', active: true },
  { id: '2', name: 'TechCrunch', type: 'tc', active: true },
  { id: '3', name: 'LINEAR', type: 'linear', active: true },
  { id: '4', name: 'HUBSPOT', type: 'hubspot', active: true },
  { id: '5', name: 'VERCEL', type: 'vercel', active: true },
  { id: '6', name: 'NOTION', type: 'notion', active: true },
];

export const DEFAULT_INTEGRATION_TITLE = 'INTEGRATES SEAMLESSLY WITH YOUR EXISTING STACK & TOOLS';

interface BrandingState {
  websiteName: string;
  websiteTitle: string;
  websiteLogo: string;
  websiteFavicon: string | null;
  integrationTitle: string;
  integrationLogos: IntegrationLogoItem[];
  loadBranding: () => Promise<void>;
  setIntegrationTitle: (title: string) => void;
  setIntegrationLogos: (logos: IntegrationLogoItem[]) => void;
}

export const useBrandingStore = create<BrandingState>((set) => ({
  websiteName: 'ThrobTech',
  websiteTitle: 'ThrobTech - Conversational CRM & Marketing Platform',
  websiteLogo: defaultLogo,
  websiteFavicon: defaultFavicon,
  integrationTitle: DEFAULT_INTEGRATION_TITLE,
  integrationLogos: DEFAULT_INTEGRATION_LOGOS,

  setIntegrationTitle: (title: string) => set({ integrationTitle: title }),
  setIntegrationLogos: (logos: IntegrationLogoItem[]) => set({ integrationLogos: logos }),

  loadBranding: async () => {
    try {
      const data = await crmApi.getBranding();
      if (data && data.success) {
        let parsedLogos = data.integration_logos;
        if (typeof parsedLogos === 'string') {
          try {
            parsedLogos = JSON.parse(parsedLogos);
          } catch (e) {
            console.error('Failed to parse integration_logos JSON', e);
          }
        }

        set({
          websiteName: data.website_name || 'ThrobTech',
          websiteTitle: data.website_title || 'ThrobTech - Conversational CRM & Marketing Platform',
          websiteLogo: data.website_logo || defaultLogo,
          websiteFavicon: data.website_favicon || defaultFavicon,
          integrationTitle: data.integration_title || DEFAULT_INTEGRATION_TITLE,
          integrationLogos: (Array.isArray(parsedLogos) && parsedLogos.length > 0) ? parsedLogos : DEFAULT_INTEGRATION_LOGOS,
        });

        // Update Document Title
        if (data.website_title) {
          document.title = data.website_title;
        }

        // Update Favicon Link
        let faviconLink = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
        if (!faviconLink) {
          faviconLink = document.createElement('link');
          faviconLink.rel = 'icon';
          document.getElementsByTagName('head')[0].appendChild(faviconLink);
        }
        faviconLink.type = 'image/png';
        faviconLink.href = data.website_favicon || defaultFavicon;
      }
    } catch (error) {
      console.warn('Failed to load branding settings, using defaults.', error);
    }
  },
}));

