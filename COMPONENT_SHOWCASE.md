# Component Showcase & Demo

Visual guide to all WhatsApp Cloud API components with usage examples.

## 🎨 Visual Components

### 1. WhatsAppStatusCard

**Location**: `src/components/whatsapp/WhatsAppStatusCard.tsx`

**Visual Design**:
```
┌─────────────────────────────────────────────┐
│ 🟢 WhatsApp Business    │ ✓ Connected      │
│ Cloud API Integration   │                  │
├─────────────────────────────────────────────┤
│                                             │
│ ┌──────────────┐  ┌──────────────┐        │
│ │ 🏢 Business  │  │ 📞 Phone     │        │
│ │ throbtech    │  │ +1234567890  │        │
│ └──────────────┘  └──────────────┘        │
│                                             │
│ ● Webhook Active    ● Number Verified      │
│ Last synced: Jan 1, 2024                   │
│                                             │
│ [         Disconnect         ]             │
└─────────────────────────────────────────────┘
```

**States**:
- ✅ Connected (Green badge)
- ❌ Disconnected (Gray badge)
- ⚠️ Error (Red badge)
- ⏳ Expired (Red badge)
- 🔄 Loading (Blue spinner)

**Props**:
```typescript
interface Props {
  connectionData: WhatsAppConnectionData | null;
  isLoading?: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}
```

**Usage Example**:
```typescript
<WhatsAppStatusCard
  connectionData={{
    wabaId: '123456789',
    phoneNumberId: '987654321',
    businessName: 'My Business',
    phoneNumber: '+1234567890',
    status: 'connected',
    webhookConfigured: true,
    numberVerified: true,
    lastSynced: new Date().toISOString()
  }}
  onConnect={() => setShowModal(true)}
  onDisconnect={handleDisconnect}
/>
```

---

### 2. EmbeddedSignupModal

**Location**: `src/components/whatsapp/EmbeddedSignupModal.tsx`

**Visual Flow**:
```
Step 1: Initializing
┌────────────────────────┐
│   WhatsApp Business    │
│                        │
│      [Loading]         │
│  Initializing...       │
│  ████░░░░░░  20%      │
└────────────────────────┘

Step 2: Authenticating
┌────────────────────────┐
│   WhatsApp Business    │
│                        │
│   [WhatsApp Icon]      │
│  Authenticate with Meta│
│  █████░░░░░  40%      │
│                        │
│ 💡 If popup doesn't    │
│   appear, check blocker│
└────────────────────────┘

Step 3: Processing
┌────────────────────────┐
│   WhatsApp Business    │
│                        │
│      [Spinner]         │
│  Processing Connection │
│  ████████░░  80%      │
└────────────────────────┘

Step 4: Success
┌────────────────────────┐
│   WhatsApp Business    │
│                        │
│    [✓ Checkmark]       │
│ Successfully Connected!│
│  ██████████ 100%      │
└────────────────────────┘
```

**States**:
- 🔄 **Initializing** - SDK setup (20%)
- 🔐 **Authenticating** - User login (40%)
- ⚙️ **Processing** - Exchange code (80%)
- ✅ **Success** - Complete (100%)
- ❌ **Error** - Failed (with retry)

**Props**:
```typescript
interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: {
    code: string;
    waba_id: string;
    phone_number_id: string;
  }) => void;
  onError: (error: string) => void;
  fbAppId: string;
  fbConfigId: string;
}
```

---

### 3. WhatsAppDashboardWidgets

**Location**: `src/components/whatsapp/dashboard/WhatsAppDashboardWidgets.tsx`

**Visual Layout**:
```
┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐
│ 💬        │ │ 📤        │ │ 📥        │ │ ⚡        │
│ 156       │ │ 342       │ │ 289       │ │ 23        │
│ Total     │ │ Sent      │ │ Received  │ │ Active    │
│ Convs     │ │ Today     │ │ Today     │ │ Chats     │
│ ↗ +5.2%  │ │ ↗ +5.2%  │ │           │ │           │
│ ▓▓▓▓▓░░   │ │           │ │           │ │           │
└───────────┘ └───────────┘ └───────────┘ └───────────┘
```

**Widget Types**:
1. **Total Conversations** (Blue) - with progress bar
2. **Messages Sent Today** (Green) - with trend
3. **Messages Received Today** (Purple)
4. **Active Chats** (Amber)

**Features**:
- Animated numbers
- Trend indicators (↗ up, ↘ down, — neutral)
- Hover effects
- Gradient accent bars
- Responsive grid

**Props**:
```typescript
interface Props {
  stats: {
    totalConversations: number;
    messagesSentToday: number;
    messagesReceivedToday: number;
    activeChats: number;
    conversationsTrend?: 'up' | 'down' | 'neutral';
    messagesTrend?: 'up' | 'down' | 'neutral';
  } | null;
  isLoading?: boolean;
}
```

---

### 4. ConversationListEnhanced

**Location**: `src/components/inbox/ConversationListEnhanced.tsx`

**Visual Design**:
```
┌─────────────────────────────┐
│ Messages            [Filter]│
│ ┌─────────────────────────┐ │
│ │ 🔍 Search...            │ │
│ └─────────────────────────┘ │
│ [All] [Unread] [Active]    │
├─────────────────────────────┤
│ 📌 Sarah Johnson     2m ago│
│    ✓ Thanks for your help! │
│    ● Agent: Mike            │
│────────────────────────────│
│ 🟢 John Doe          5m ago│
│    I have a question  [2]  │
│────────────────────────────│
│ Mike Chen           1h ago │
│    ✓ Order confirmed       │
└─────────────────────────────┘
```

**Features**:
- Search by name or phone
- Filter pills (All, Unread, Active)
- Pin conversations (📌)
- Online indicators (🟢)
- Unread badges ([2])
- Assigned agents (● Agent: Name)
- Context menu (⋮)
- Smart sorting

**Props**:
```typescript
interface Props {
  conversations: Conversation[];
  selectedId?: string;
  onSelect: (conversation: Conversation) => void;
  onPin?: (id: string) => void;
  onArchive?: (id: string) => void;
  isLoading?: boolean;
}
```

---

### 5. ContactDetailsPanel

**Location**: `src/components/inbox/ContactDetailsPanel.tsx`

**Visual Design**:
```
┌─────────────────────────┐
│ Contact Details      [×]│
│                         │
│       ┌───┐            │
│       │ JD │            │
│       └───┘            │
│     John Doe           │
│    [● Active]          │
├─────────────────────────┤
│ 📞 +1234567890         │
│ ✉️  john@example.com   │
│ 🏢 Tech Corp           │
│    Product Manager      │
│ 📅 Added: Jan 1, 2024  │
├─────────────────────────┤
│ Tags              [+]  │
│ [VIP] [Customer]       │
├─────────────────────────┤
│ Assigned Agent         │
│ [Select Agent ▼]       │
├─────────────────────────┤
│ Notes             [✏️] │
│ ┌───────────────────┐  │
│ │ Important client  │  │
│ │ Follow up weekly  │  │
│ └───────────────────┘  │
└─────────────────────────┘
```

**Sections**:
1. **Header** - Avatar, name, status
2. **Contact Info** - Phone, email, company, added date
3. **Tags** - Add/remove tags
4. **Agent** - Assign to team member
5. **Notes** - Editable notes section

**Props**:
```typescript
interface Props {
  contact: Contact | null;
  onClose: () => void;
  onUpdateContact?: (id: string, data: Partial<Contact>) => void;
  onAssignAgent?: (contactId: string, agentId: string) => void;
  availableAgents?: { id: string; name: string }[];
}
```

---

### 6. Toast Notifications

**Location**: `src/components/ui/Toast.tsx`

**Visual Variants**:
```
Success:
┌──────────────────────────┐
│ ✓ Success!      [×]     │
│   Operation completed    │
└──────────────────────────┘
(Green)

Error:
┌──────────────────────────┐
│ ✕ Error!        [×]     │
│   Something went wrong   │
└──────────────────────────┘
(Red)

Warning:
┌──────────────────────────┐
│ ⚠ Warning!      [×]     │
│   Please check this      │
└──────────────────────────┘
(Amber)

Info:
┌──────────────────────────┐
│ ℹ Info          [×]     │
│   Did you know?          │
└──────────────────────────┘
(Blue)
```

**Usage**:
```typescript
import { toast } from '@/components/ui/Toast';

// Show toast
toast.success('Connected!', 'WhatsApp account is ready');
toast.error('Failed', 'Connection error occurred');
toast.warning('Token Expiring', 'Renew your token soon');
toast.info('New Feature', 'Check it out!');

// Custom duration
toast.success('Done!', 'Saved successfully', 3000);
```

---

## 📱 Page Layouts

### WhatsAppConnectPage

```
┌──────────────────────────────────────┐
│ WhatsApp Cloud API  [● Connected]   │
│ Connect your WhatsApp Business...    │
├──────────────────────────────────────┤
│ ┌────┐ ┌────┐ ┌────┐ ┌────┐        │
│ │156 │ │342 │ │289 │ │ 23 │        │
│ └────┘ └────┘ └────┘ └────┘        │
├──────────────────────────────────────┤
│ ┌────────────────────────────────┐  │
│ │ 🟢 WhatsApp Business           │  │
│ │                                 │  │
│ │ ┌─────────┐  ┌──────────┐     │  │
│ │ │Business │  │Phone     │     │  │
│ │ └─────────┘  └──────────┘     │  │
│ │                                 │  │
│ │ [      Disconnect      ]       │  │
│ └────────────────────────────────┘  │
├──────────────────────────────────────┤
│ Why Connect WhatsApp?                │
│ ┌────┐ ┌────┐ ┌────┐               │
│ │⚡  │ │🛡️  │ │💬  │               │
│ └────┘ └────┘ └────┘               │
├──────────────────────────────────────┤
│ Quick Setup Guide                    │
│ 1. Click "Connect WhatsApp"          │
│ 2. Authenticate with Meta            │
│ 3. Select phone number               │
│ 4. Start messaging!                  │
└──────────────────────────────────────┘
```

### InboxPageEnhanced (3-Column)

```
┌──────┬────────────────────┬────────┐
│ List │     Chat Window    │Contact │
│      │                    │Details │
├──────┼────────────────────┼────────┤
│🔍    │ Sarah Johnson   ⓘ  │  👤   │
│      │ ────────────────── │        │
│📌    │ Hi there! How...   │ 📞    │
│Sarah │                    │        │
│      │ Thanks for help!   │ ✉️    │
│🟢    │                    │        │
│John  │ ────────────────── │ 🏢    │
│      │                    │        │
│Mike  │ [Type message...]  │ 📅    │
│      │ [📎] [😊] [Send]  │        │
│Emma  │                    │ Tags  │
│      │                    │        │
│...   │                    │ Notes │
└──────┴────────────────────┴────────┘
```

---

## 🎨 Design Tokens

### Colors
```typescript
// Primary (WhatsApp)
--whatsapp-green: #25D366
--whatsapp-teal: #128C7E

// Status
--success: emerald-500
--error: red-500
--warning: amber-500
--info: blue-500

// Neutral (Light Mode)
--bg-primary: white
--bg-secondary: slate-50
--text-primary: slate-900
--text-secondary: slate-600
--border: slate-200

// Neutral (Dark Mode)
--bg-primary: slate-800
--bg-secondary: slate-900
--text-primary: white
--text-secondary: slate-400
--border: slate-700
```

### Spacing Scale
```
xs: 4px
sm: 8px
md: 12px
lg: 16px
xl: 24px
2xl: 32px
3xl: 48px
```

### Border Radius
```
sm: 8px   (buttons, inputs)
md: 12px  (cards)
lg: 16px  (modals)
xl: 24px  (avatars)
```

### Shadows
```
sm: 0 1px 2px rgba(0,0,0,0.05)
md: 0 4px 6px rgba(0,0,0,0.1)
lg: 0 10px 15px rgba(0,0,0,0.1)
xl: 0 20px 25px rgba(0,0,0,0.15)
```

---

## 🎭 Interactive States

### Hover Effects
- **Cards**: Lift with shadow increase
- **Buttons**: Color darken + scale 1.02
- **List Items**: Background color change

### Loading States
- **Skeleton**: Pulsing gray rectangles
- **Spinner**: Rotating icon
- **Progress**: Animated bar

### Empty States
- **Icon**: Large centered icon
- **Title**: Bold heading
- **Description**: Helpful text
- **Action**: CTA button

### Error States
- **Banner**: Red background with icon
- **Inline**: Red text with icon
- **Toast**: Auto-dismissing notification

---

## 📐 Responsive Breakpoints

```typescript
// Mobile
@media (max-width: 767px) {
  - Single column
  - Stack everything
  - Full-width modals
  - Collapsed sidebars
}

// Tablet
@media (min-width: 768px) and (max-width: 1023px) {
  - 2-column layouts
  - Sidebar overlays
  - Medium-sized modals
}

// Desktop
@media (min-width: 1024px) {
  - 3-column layouts
  - Fixed sidebars
  - Large modals
  - Hover states enabled
}
```

---

## ✨ Animation Patterns

### Entry Animations
```typescript
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.3 }}
```

### Exit Animations
```typescript
exit={{ opacity: 0, scale: 0.95 }}
transition={{ duration: 0.2 }}
```

### Hover Animations
```typescript
whileHover={{ y: -4, scale: 1.02 }}
whileTap={{ scale: 0.98 }}
```

### Loading Animations
```typescript
animate={{ rotate: 360 }}
transition={{ repeat: Infinity, duration: 1 }}
```

---

## 🎯 Accessibility

### Keyboard Navigation
- Tab through interactive elements
- Enter to activate buttons
- Escape to close modals
- Arrow keys in lists

### Screen Reader Support
- Semantic HTML (nav, main, section)
- ARIA labels on icons
- Alt text on images
- Role attributes

### Color Contrast
- WCAG AA compliant
- 4.5:1 for normal text
- 3:1 for large text
- Focus indicators visible

---

This showcase demonstrates the production-quality design system powering your WhatsApp CRM! 🚀
