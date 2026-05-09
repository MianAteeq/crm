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
  console.log('[Echo] Initializing with token:', token ? `${token.substring(0, 10)}...` : 'MISSING');
  
  const host = import.meta.env.VITE_REVERB_HOST || 'crm.throbtech.com';
  const key = import.meta.env.VITE_REVERB_APP_KEY || 'crmkey';
  const port = import.meta.env.VITE_REVERB_PORT || '443';
  const scheme = import.meta.env.VITE_REVERB_SCHEME || 'https';

  // Use 'reverb' broadcaster
  echoInstance = new Echo({
    broadcaster: 'reverb',
    key: key,
    wsHost: host,
    wsPort: parseInt(String(port), 10),
    wssPort: parseInt(String(port), 10),
    forceTLS: scheme === 'https',
    enabledTransports: ['ws', 'wss'],
    // Private Channel Auth
    authEndpoint: '/api/proxy/broadcasting/auth',
    auth: {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
    },
  });

  return echoInstance;
};

export const refreshEcho = () => {
  if (echoInstance) {
    console.log('[Echo] Disconnecting existing instance');
    echoInstance.disconnect();
    echoInstance = null;
  }
  return getEcho();
};
