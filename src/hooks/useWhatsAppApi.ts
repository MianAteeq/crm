import { useState, useCallback } from 'react';
import { WhatsAppConfig, ApiLog } from '../types';
import { whatsappApi } from '../services/whatsappApi';

const DEFAULT_CONFIG: WhatsAppConfig = {
  status: 'disconnected',
  phoneNumberId: '',
  businessAccountId: '',
  accessToken: '',
  webhookUrl: 'https://api.zappify.io/webhooks/whatsapp',
  verifyToken: 'zap_live_' + Math.random().toString(36).substring(7),
  lastSync: ''
};

export function useWhatsAppApi() {
  const [config, setConfig] = useState<WhatsAppConfig>(() => {
    const saved = localStorage.getItem('whatsapp_config');
    return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
  });
  
  const [logs, setLogs] = useState<ApiLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const saveConfig = useCallback((newConfig: Partial<WhatsAppConfig>) => {
    const updated = { ...config, ...newConfig };
    setConfig(updated);
    localStorage.setItem('whatsapp_config', JSON.stringify(updated));
  }, [config]);

  const connect = useCallback(async () => {
    setIsLoading(true);
    try {
      await whatsappApi.validateCredentials(config);
      saveConfig({ status: 'connected', lastSync: new Date().toISOString() });
      return true;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [config, saveConfig]);

  const disconnect = useCallback(() => {
    saveConfig({ status: 'disconnected' });
  }, [saveConfig]);

  const sendTest = useCallback(async (phone: string) => {
    setIsLoading(true);
    try {
      const payload = {
        messaging_product: "whatsapp",
        to: phone,
        type: "text",
        text: { body: "throbtech Connectivity Test: Connection Successful! 🚀" }
      };
      const { log } = await whatsappApi.sendMessage(config, payload);
      setLogs(prev => [log, ...prev]);
      return true;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [config]);

  return {
    config,
    logs,
    isLoading,
    saveConfig,
    connect,
    disconnect,
    sendTest
  };
}
