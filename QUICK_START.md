# WhatsApp Cloud API - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment
```bash
# Copy example env file
cp .env.example .env.local

# Add your credentials
VITE_FB_APP_ID=your_facebook_app_id
VITE_FB_CONFIG_ID=your_embedded_signup_config_id
```

### Step 3: Start Development Server
```bash
npm run dev
```

### Step 4: Access WhatsApp Pages

Navigate to:
- **Connection Page**: http://localhost:3000/whatsapp/connect
- **Enhanced Inbox**: http://localhost:3000/inbox-enhanced

## 📱 Pages Overview

### 1. WhatsApp Connect Page (`/whatsapp/connect`)
**Purpose**: Connect and manage WhatsApp Business Account

**Features**:
- Connection status card
- Meta embedded signup flow
- Dashboard statistics
- Setup instructions

**Usage**:
```typescript
// Automatically handles connection flow
// Just click "Connect WhatsApp" button
```

### 2. Enhanced Inbox (`/inbox-enhanced`)
**Purpose**: Manage conversations with 3-column layout

**Features**:
- Conversations list (left)
- Chat window (center)
- Contact details (right)

**Usage**:
```typescript
// Select conversation from list
// View/send messages in center
// Manage contact in right panel
```

## 🎨 Using Components

### WhatsAppStatusCard
```typescript
import { WhatsAppStatusCard } from '@/components/whatsapp/WhatsAppStatusCard';

<WhatsAppStatusCard
  connectionData={connectionData}
  isLoading={loading}
  onConnect={handleConnect}
  onDisconnect={handleDisconnect}
/>
```

### EmbeddedSignupModal
```typescript
import { EmbeddedSignupModal } from '@/components/whatsapp/EmbeddedSignupModal';

<EmbeddedSignupModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  onSuccess={(data) => {
    // Handle successful connection
    console.log('WABA ID:', data.waba_id);
    console.log('Phone Number ID:', data.phone_number_id);
  }}
  onError={(error) => {
    // Handle error
    console.error(error);
  }}
  fbAppId={FB_APP_ID}
  fbConfigId={FB_CONFIG_ID}
/>
```

### Dashboard Widgets
```typescript
import { WhatsAppDashboardWidgets } from '@/components/whatsapp/dashboard/WhatsAppDashboardWidgets';

<WhatsAppDashboardWidgets
  stats={{
    totalConversations: 156,
    messagesSentToday: 342,
    messagesReceivedToday: 289,
    activeChats: 23,
    conversationsTrend: 'up',
    messagesTrend: 'up'
  }}
  isLoading={false}
/>
```

### Toast Notifications
```typescript
import { toast } from '@/components/ui/Toast';

// Show notifications
toast.success('Success!', 'Operation completed');
toast.error('Error!', 'Something went wrong');
toast.warning('Warning!', 'Please check this');
toast.info('Info', 'Did you know?');
```

## 🔌 API Integration

### Connect WhatsApp
```typescript
import { crmApi } from '@/services/crmApi';

const connectWhatsApp = async (code: string, wabaId: string, phoneNumberId: string) => {
  try {
    const result = await crmApi.connectWhatsAppCloudAPI({
      code,
      waba_id: wabaId,
      phone_number_id: phoneNumberId
    });
    
    toast.success('Connected!', 'WhatsApp Business Account connected');
  } catch (error) {
    toast.error('Failed', error.message);
  }
};
```

### Get Connection Status
```typescript
const checkStatus = async () => {
  const status = await crmApi.getWhatsAppConnectionStatus();
  
  if (status.connected) {
    console.log('Business Name:', status.data.business_name);
    console.log('Phone Number:', status.data.phone_number);
  }
};
```

### Get Dashboard Stats
```typescript
const loadStats = async () => {
  const stats = await crmApi.getWhatsAppDashboardStats();
  
  setDashboardStats({
    totalConversations: stats.total_conversations,
    messagesSentToday: stats.messages_sent_today,
    messagesReceivedToday: stats.messages_received_today,
    activeChats: stats.active_chats
  });
};
```

## 🎭 Common Workflows

### Complete Connection Flow
```typescript
const [showModal, setShowModal] = useState(false);

// 1. User clicks connect
const handleConnect = () => {
  setShowModal(true);
};

// 2. Handle successful signup
const handleSignupSuccess = async (data) => {
  try {
    // Send to backend
    await crmApi.connectWhatsAppCloudAPI(data);
    
    // Reload status
    await loadConnectionStatus();
    
    // Show success
    toast.success('Connected!', 'Your WhatsApp account is ready');
  } catch (error) {
    toast.error('Failed', error.message);
  }
};

// 3. Handle errors
const handleSignupError = (error) => {
  toast.error('Connection Failed', error);
};
```

### Manage Conversations
```typescript
const [conversations, setConversations] = useState([]);
const [selected, setSelected] = useState(null);

// Pin conversation
const handlePin = (id) => {
  setConversations(prev =>
    prev.map(conv =>
      conv.id === id ? { ...conv, isPinned: !conv.isPinned } : conv
    )
  );
};

// Archive conversation
const handleArchive = (id) => {
  setConversations(prev => prev.filter(conv => conv.id !== id));
  toast.info('Archived', 'Conversation moved to archive');
};

// Update contact
const handleUpdateContact = async (contactId, data) => {
  await crmApi.updateContact(contactId, data);
  toast.success('Updated', 'Contact information saved');
};
```

## 🎨 Customization

### Change Brand Colors
```typescript
// Update in components
const PRIMARY_COLOR = '#25D366'; // WhatsApp Green
const SECONDARY_COLOR = '#128C7E'; // WhatsApp Teal

// Or use Tailwind config
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        whatsapp: {
          primary: '#25D366',
          secondary: '#128C7E',
        }
      }
    }
  }
}
```

### Add Custom Stats Widget
```typescript
// Extend WhatsAppDashboardWidgets
const customWidget = {
  id: 'custom',
  label: 'Custom Metric',
  value: 123,
  icon: YourIcon,
  gradient: 'from-pink-500 to-pink-600',
  lightBg: 'bg-pink-50 dark:bg-pink-900/20',
  darkBorder: 'border-pink-200 dark:border-pink-800',
  iconColor: 'text-pink-600 dark:text-pink-400'
};
```

## 🐛 Troubleshooting

### Modal Not Opening
```typescript
// Check popup blocker
// Add user gesture before opening
<button onClick={handleConnect}>
  Connect WhatsApp
</button>
```

### Connection Failed
```typescript
// Verify environment variables
console.log('App ID:', import.meta.env.VITE_FB_APP_ID);
console.log('Config ID:', import.meta.env.VITE_FB_CONFIG_ID);

// Check if undefined
if (!FB_APP_ID || !FB_CONFIG_ID) {
  console.error('Missing Facebook credentials');
}
```

### Dark Mode Issues
```typescript
// Ensure dark mode is configured
// Add to root HTML element
<html className="dark">
```

## 📚 Next Steps

1. ✅ Complete backend implementation (see [WHATSAPP_SETUP.md](WHATSAPP_SETUP.md))
2. ✅ Configure Facebook App and Embedded Signup
3. ✅ Set up webhooks for real-time messages
4. ✅ Test the complete flow end-to-end
5. ✅ Deploy to production

## 🔗 Useful Links

- [Full Setup Guide](./WHATSAPP_SETUP.md)
- [Feature Documentation](./WHATSAPP_FEATURES.md)
- [Meta WhatsApp Docs](https://developers.facebook.com/docs/whatsapp)
- [Embedded Signup Guide](https://developers.facebook.com/docs/whatsapp/embedded-signup)

## 💡 Pro Tips

1. **Test in Development First**: Use Meta's test phone numbers
2. **Monitor Console**: Check for SDK initialization logs
3. **Use Toast Notifications**: Provide user feedback for all actions
4. **Handle Errors Gracefully**: Show meaningful error messages
5. **Mobile Test**: Verify on actual mobile devices

## 🎉 You're Ready!

Your WhatsApp Cloud API integration is complete and production-ready. Start connecting accounts and managing conversations! 🚀
