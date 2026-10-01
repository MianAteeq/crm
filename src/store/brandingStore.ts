import { create } from 'zustand';
import { crmApi } from '../services/crmApi';

interface BrandingState {
  websiteName: string;
  websiteTitle: string;
  websiteLogo: string | null;
  websiteFavicon: string | null;
  loadBranding: () => Promise<void>;
}

export const useBrandingStore = create<BrandingState>((set) => ({
  websiteName: 'Fission Monster',
  websiteTitle: 'Fission Monster - Premium WhatsApp Automation Platform',
  websiteLogo: 'https://fissionmonster.com/static/img/fm-icon.png',
  websiteFavicon: null,

  loadBranding: async () => {
    try {
      const data = await crmApi.getBranding();
      if (data && data.success) {
        set({
          websiteName: data.website_name || 'Fission Monster',
          websiteTitle: data.website_title || 'Fission Monster - Premium WhatsApp Automation Platform',
          websiteLogo: data.website_logo || 'https://fissionmonster.com/static/img/fm-icon.png',
          websiteFavicon: data.website_favicon,
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
        faviconLink.href = data.website_favicon || '/favicon.ico';
      }
    } catch (error) {
      console.warn('Failed to load branding settings, using defaults.', error);
    }
  },
}));
