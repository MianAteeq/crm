# WhatsApp Cloud API Integration Guide

This guide explains how to set up and use the WhatsApp Cloud API integration in this CRM platform.

## 🚀 Features

- **Embedded Signup Flow**: Connect WhatsApp Business accounts using Meta's official embedded signup
- **Real-time Messaging**: Send and receive messages with WebSocket support
- **Modern SaaS UI**: Production-ready interface similar to Wati, Interakt, Respond.io
- **Dashboard Widgets**: Real-time conversation and message statistics
- **3-Column Inbox Layout**: Conversations list, chat window, and contact details panel
- **Contact Management**: Assign agents, add tags, and manage notes
- **Dark Mode Support**: Full dark mode implementation across all components

## 📋 Prerequisites

Before you begin, ensure you have:

1. **Meta Business Account**: [Create one here](https://business.facebook.com/)
2. **Facebook App**: Create an app with WhatsApp integration enabled
3. **WhatsApp Business Account**: Connected to your Meta Business account
4. **Verified Phone Number**: A phone number verified with WhatsApp Business

## 🔧 Setup Instructions

### Step 1: Create Facebook App

1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Click "My Apps" → "Create App"
3. Select "Business" as the app type
4. Fill in app details and create the app
5. Add "WhatsApp" product to your app

### Step 2: Configure Embedded Signup

1. In your Facebook App dashboard, go to WhatsApp → Getting Started
2. Navigate to "Embedded Signup" section
3. Create a new configuration for embedded signup
4. Note down your:
   - `App ID`
   - `Configuration ID`

### Step 3: Configure Environment Variables

Create a `.env.local` file (or update `.env`) with:

```env
# WhatsApp Cloud API Configuration
VITE_FB_APP_ID=your_facebook_app_id
VITE_FB_CONFIG_ID=your_embedded_signup_config_id

# Existing config
VITE_CRM_API_URL=https://your-backend-api.com
VITE_REVERB_APP_KEY=your_reverb_key
VITE_REVERB_HOST=your-backend.com
VITE_REVERB_PORT=443
VITE_REVERB_SCHEME=https
```

### Step 4: Backend Endpoint Setup

Your Laravel backend needs to handle the WhatsApp connection endpoint:

```php
// routes/api.php
Route::post('/whatsapp/connect', [WhatsAppController::class, 'connect']);
Route::get('/whatsapp/dashboard-stats', [WhatsAppController::class, 'dashboardStats']);
```

**Example Controller Implementation:**

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class WhatsAppController extends Controller
{
    public function connect(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string',
            'waba_id' => 'required|string',
            'phone_number_id' => 'required|string',
        ]);

        // Exchange authorization code for access token
        $response = Http::get('https://graph.facebook.com/v21.0/oauth/access_token', [
            'client_id' => config('services.facebook.app_id'),
            'client_secret' => config('services.facebook.app_secret'),
            'code' => $validated['code'],
        ]);

        if (!$response->successful()) {
            return response()->json([
                'message' => 'Failed to exchange authorization code'
            ], 400);
        }

        $accessToken = $response->json()['access_token'];

        // Get business account and phone number details
        $businessInfo = Http::withToken($accessToken)
            ->get("https://graph.facebook.com/v21.0/{$validated['waba_id']}")
            ->json();

        $phoneInfo = Http::withToken($accessToken)
            ->get("https://graph.facebook.com/v21.0/{$validated['phone_number_id']}")
            ->json();

        // Store in database
        auth()->user()->update([
            'whatsapp_access_token' => encrypt($accessToken),
            'whatsapp_waba_id' => $validated['waba_id'],
            'whatsapp_phone_number_id' => $validated['phone_number_id'],
            'whatsapp_business_name' => $businessInfo['name'] ?? null,
            'whatsapp_phone_number' => $phoneInfo['display_phone_number'] ?? null,
            'whatsapp_status' => 'connected',
        ]);

        return response()->json([
            'message' => 'WhatsApp Business Account connected successfully',
            'data' => [
                'business_name' => $businessInfo['name'] ?? null,
                'phone_number' => $phoneInfo['display_phone_number'] ?? null,
            ]
        ]);
    }

    public function dashboardStats()
    {
        // Implement your stats logic
        return response()->json([
            'total_conversations' => 156,
            'messages_sent_today' => 342,
            'messages_received_today' => 289,
            'active_chats' => 23,
        ]);
    }
}
```

### Step 5: Configure Webhooks

1. In your Facebook App, go to WhatsApp → Configuration
2. Set webhook URL: `https://your-backend.com/api/whatsapp/webhook`
3. Subscribe to these fields:
   - `messages`
   - `message_status`
   - `message_echoes`

**Webhook Handler Example:**

```php
Route::post('/whatsapp/webhook', [WhatsAppWebhookController::class, 'handle']);
Route::get('/whatsapp/webhook', [WhatsAppWebhookController::class, 'verify']);
```

## 🎨 UI Components

### Pages

1. **WhatsAppConnectPage** (`/whatsapp/connect`)
   - Connection status card
   - Dashboard widgets
   - Features showcase
   - Setup guide

2. **InboxPageEnhanced** (`/inbox-enhanced`)
   - 3-column layout
   - Conversations list with search and filters
   - Chat window with message composer
   - Contact details panel

### Key Components

- `WhatsAppStatusCard` - Shows connection status and details
- `EmbeddedSignupModal` - Handles Meta authentication flow
- `WhatsAppDashboardWidgets` - Displays stats (conversations, messages)
- `ConversationListEnhanced` - Left sidebar with conversations
- `ChatWindow` - Center panel for messaging
- `ContactDetailsPanel` - Right sidebar with contact info

## 🔐 Security Best Practices

1. **Never expose access tokens** - Always store on backend encrypted
2. **Use HTTPS** - All webhooks must use SSL
3. **Validate webhook signatures** - Verify requests are from Meta
4. **Rate limiting** - Implement rate limits on your endpoints
5. **Token rotation** - Refresh tokens before expiry

## 🎨 Customization

### Branding

Update colors in components:
- Primary: `#25D366` (WhatsApp Green)
- Secondary: `#128C7E` (WhatsApp Teal)

### Dark Mode

All components support dark mode out of the box. Toggle is handled via Tailwind's `dark:` prefix.

## 📱 Mobile Responsiveness

All components are fully responsive:
- Mobile: Single column, collapsible sidebars
- Tablet: 2-column layout
- Desktop: Full 3-column layout

## 🐛 Troubleshooting

### Popup Blocked Error
**Issue**: Embedded signup popup doesn't open
**Solution**: Check browser popup blocker settings

### Token Expired
**Issue**: "Token Expired" status
**Solution**: Reconnect WhatsApp account through the UI

### Webhook Not Receiving Messages
**Issue**: Messages not appearing in real-time
**Solution**: Verify webhook URL is accessible and subscriptions are active

### Connection Failed
**Issue**: "Connection Failed" error during signup
**Solution**: Check Facebook App credentials and ensure WhatsApp product is added

## 📊 Analytics

Track these metrics in your dashboard:
- Total conversations
- Messages sent/received (daily)
- Active chats
- Response time
- Agent performance

## 🔄 Updates

To update to the latest WhatsApp API version:
1. Update version in `facebook-sdk.ts` (currently `v21.0`)
2. Review [Meta API Changelog](https://developers.facebook.com/docs/whatsapp/changelog)
3. Test thoroughly in development

## 📚 Resources

- [WhatsApp Business Platform Docs](https://developers.facebook.com/docs/whatsapp)
- [Embedded Signup Guide](https://developers.facebook.com/docs/whatsapp/embedded-signup)
- [Cloud API Reference](https://developers.facebook.com/docs/whatsapp/cloud-api)
- [Webhook Reference](https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks)

## 🆘 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Meta's developer documentation
3. Open an issue in the repository

## 📄 License

This integration follows Meta's Platform Terms of Service and WhatsApp Business Platform Terms.
