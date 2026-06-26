declare global {
  interface Window {
    fbAsyncInit: () => void;
    FB: {
      init: (params: {
        appId: string;
        cookie?: boolean;
        xfbml?: boolean;
        version: string;
      }) => void;
      login: (
        callback: (response: FacebookLoginResponse) => void,
        options?: { config_id?: string; response_type?: string; override_default_response_type?: boolean; extras?: any }
      ) => void;
      getLoginStatus: (callback: (response: FacebookLoginResponse) => void) => void;
    };
  }
}

export interface FacebookLoginResponse {
  status: 'connected' | 'not_authorized' | 'unknown';
  authResponse?: {
    accessToken: string;
    expiresIn: number;
    signedRequest: string;
    userID: string;
    code?: string;
  };
}

export interface FacebookEmbeddedSignupConfig {
  appId: string;
  configId: string;
  version?: string;
}

class FacebookSDK {
  private initialized = false;
  private initPromise: Promise<void> | null = null;

  async init(config: FacebookEmbeddedSignupConfig): Promise<void> {
    if (this.initialized) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = new Promise((resolve) => {
      window.fbAsyncInit = () => {
        window.FB.init({
          appId: config.appId,
          cookie: true,
          xfbml: true,
          version: config.version || 'v21.0',
        });
        this.initialized = true;
        console.log('[Facebook SDK] Initialized successfully');
        resolve();
      };

      // If SDK script is already loaded, trigger init
      if (window.FB) {
        window.fbAsyncInit();
      }
    });

    return this.initPromise;
  }

  async launchWhatsAppSignup(configId: string): Promise<{
    code: string;
    waba_id: string;
    phone_number_id: string;
  }> {
    if (!this.initialized) {
      throw new Error('Facebook SDK not initialized. Call init() first.');
    }

    return new Promise((resolve, reject) => {
      window.FB.login(
        (response) => {
          console.log('[Facebook SDK] Login response:', response);

          if (response.authResponse) {
            const code = response.authResponse.code;

            // Extract WABA and Phone Number IDs from the response extras
            const extras = (response.authResponse as any).extras || {};
            const setup = extras.setup || {};

            const wabaId = setup.waba_id || setup.business_id || '';
            const phoneNumberId = setup.phone_number_id || setup.phone || '';

            if (!code) {
              reject(new Error('No authorization code received from Meta'));
              return;
            }

            resolve({
              code,
              waba_id: wabaId,
              phone_number_id: phoneNumberId,
            });
          } else {
            reject(new Error('WhatsApp signup was cancelled or failed'));
          }
        },
        {
          config_id: configId,
          response_type: 'code',
          override_default_response_type: true,
          extras: {
            setup: {},
            feature: 'whatsapp_embedded_signup',
          },
        }
      );
    });
  }

  isInitialized(): boolean {
    return this.initialized;
  }
}

export const facebookSDK = new FacebookSDK();
