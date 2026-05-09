import { useState, useEffect } from 'react';
import { crmApi } from '../services/crmApi';
import { WhatsAppConfig, ApiLog, WhatsAppSettings } from '../types';

export function useWhatsAppApi() {
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<ApiLog[]>([]);
  const [config, setConfig] = useState<WhatsAppConfig>({
    status: 'disconnected',
    phoneNumberId: '',
    businessAccountId: '',
    accessToken: '',
    webhookUrl: 'https://crm.throbtech.com/api/whatsapp/webhook',
    verifyToken: 'CRM_VERIFY_TOKEN_XYZ',
    lastSync: ''
  });

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const data = await crmApi.getWhatsAppSettings();
      if (data) {
        setConfig({
          status: data.status,
          phoneNumberId: data.phone_number_id,
          businessAccountId: data.business_account_id,
          accessToken: data.access_token,
          webhookUrl: 'https://crm.throbtech.com/api/whatsapp/webhook',
          verifyToken: 'CRM_VERIFY_TOKEN_XYZ',
          lastSync: data.last_synced || '',
          businessName: data.business_name,
          phoneNumber: data.phone_number,
          webhookStatus: data.webhook_status
        });
      }
    } catch (error) {
      console.error('Failed to fetch WhatsApp settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const saveConfig = async (updates: Partial<WhatsAppConfig>) => {
    setIsLoading(true);
    try {
      const settingsToSave: WhatsAppSettings = {
        access_token: updates.accessToken || config.accessToken,
        phone_number_id: updates.phoneNumberId || config.phoneNumberId,
        business_account_id: updates.businessAccountId || config.businessAccountId,
        status: (updates.status as any) || config.status
      };

      await crmApi.saveWhatsAppSettings(settingsToSave);
      await fetchSettings();
    } catch (error) {
       console.error('Failed to save settings:', error);
       throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const connect = async () => {
    return saveConfig({ status: 'connected' });
  };

  const disconnect = async () => {
    setIsLoading(true);
    try {
      await crmApi.disconnectWhatsApp();
      await fetchSettings();
    } catch (error) {
       console.error('Failed to disconnect:', error);
       throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const sendTest = async (phone: string) => {
    setIsLoading(true);
    try {
      const res = await crmApi.testWhatsAppConnection(phone);
      return !!res.success;
    } catch (error) {
      console.error('Test message failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    config,
    logs,
    isLoading,
    saveConfig,
    connect,
    disconnect,
    sendTest,
    refresh: fetchSettings
  };
}
