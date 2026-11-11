import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { AuthService } from '../services/authService';

declare global {
  interface Window {
    Pusher: typeof Pusher;
    Echo: any;
  }
}

window.Pusher = Pusher;

let echoInstance: any = null;

export const getEcho = (): any => {
  if (echoInstance) return echoInstance;

  const token = AuthService.getToken();

  const isLocalDev =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  const host = isLocalDev ? '127.0.0.1' : (import.meta.env.VITE_REVERB_HOST || 'crm.throbtech.com');
  const key = import.meta.env.VITE_REVERB_APP_KEY || 'crmkey';
  const port = isLocalDev ? 8080 : parseInt(String(import.meta.env.VITE_REVERB_PORT || '443'), 10);
  const scheme = isLocalDev ? 'http' : (import.meta.env.VITE_REVERB_SCHEME || 'https');
  const isTls = scheme === 'https';

  try {
    echoInstance = new Echo({
      broadcaster: 'reverb',
      key: key,
      wsHost: host,
      wsPort: port,
      wssPort: port,
      forceTLS: isTls,
      enabledTransports: ['ws', 'wss'],
      authEndpoint: '/api/broadcasting/auth',
      auth: {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
      },
    });
  } catch (err) {
    console.warn('[Echo] Failed to initialize Echo client:', err);
    return null;
  }

  return echoInstance;
};

export const refreshEcho = () => {
  if (echoInstance) {
    try {
      echoInstance.disconnect();
    } catch (e) { }
    echoInstance = null;
  }
  return getEcho();
};
