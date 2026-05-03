import { WhatsAppConfig, ApiLog } from '../types';

const MOCK_DELAY = 1000;

export const whatsappApi = {
  async sendMessage(config: WhatsAppConfig, payload: any): Promise<{ success: boolean; log: ApiLog }> {
    await new Promise(r => setTimeout(r, MOCK_DELAY));
    
    // Validate config
    if (!config.accessToken || !config.phoneNumberId) {
      throw new Error('Missing API credentials');
    }

    const log: ApiLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
      method: 'POST',
      endpoint: `/${config.phoneNumberId}/messages`,
      status: 200,
      request: payload,
      response: {
        messaging_product: "whatsapp",
        contacts: [{ input: payload.to, wa_id: payload.to }],
        messages: [{ id: `wamid.HBgL${Math.random().toString(36).substring(7)}` }]
      }
    };

    return { success: true, log };
  },

  async validateCredentials(config: Partial<WhatsAppConfig>): Promise<boolean> {
    await new Promise(r => setTimeout(r, MOCK_DELAY));
    if (config.accessToken?.startsWith('EA') && config.phoneNumberId?.length > 10) {
      return true;
    }
    throw new Error('Invalid Meta Access Token or Phone ID');
  },

  async subscribeWebhook(webhookUrl: string, verifyToken: string): Promise<boolean> {
    await new Promise(r => setTimeout(r, MOCK_DELAY));
    return true;
  }
};
