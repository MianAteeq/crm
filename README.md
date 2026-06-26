<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# throbtech - Modern WhatsApp CRM Platform

A production-ready WhatsApp Business CRM built with React, TypeScript, and TailwindCSS. Features real-time messaging, campaign management, and WhatsApp Cloud API integration.

## ✨ Features

- 🔌 **WhatsApp Cloud API Integration** - Connect via Meta's Embedded Signup
- 💬 **Real-time Messaging** - Live chat with WebSocket support (Laravel Reverb)
- 📊 **Dashboard Analytics** - Conversations, messages, and engagement metrics
- 👥 **Contact Management** - Advanced filtering, tagging, and bulk operations
- 📱 **Campaign Builder** - Create and schedule WhatsApp campaigns
- 🎨 **Modern SaaS UI** - Production-quality design similar to Wati/Interakt
- 🌙 **Dark Mode** - Full dark mode support across all components
- 📱 **Responsive** - Mobile-first design, works on all devices

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Facebook App with WhatsApp integration
- Laravel backend (for API and real-time features)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your credentials:
   ```env
   VITE_CRM_API_URL=https://your-backend.com
   VITE_FB_APP_ID=your_facebook_app_id
   VITE_FB_CONFIG_ID=your_embedded_signup_config_id
   VITE_REVERB_APP_KEY=your_reverb_key
   VITE_REVERB_HOST=your-backend.com
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   - Main App: http://localhost:3000
   - WhatsApp Connect: http://localhost:3000/whatsapp/connect
   - Enhanced Inbox: http://localhost:3000/inbox-enhanced

## 📚 Documentation

- **[WhatsApp Setup Guide](./WHATSAPP_SETUP.md)** - Complete WhatsApp Cloud API integration guide
- **[Feature Documentation](./WHATSAPP_FEATURES.md)** - Detailed feature list and component docs
- **[Quick Start Guide](./QUICK_START.md)** - Get started in 5 minutes
- **[Realtime Setup](./DOCS_REALTIME.md)** - Configure Laravel Reverb for real-time messaging

## 🏗️ Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── whatsapp/     # WhatsApp-specific components
│   ├── inbox/        # Messaging components
│   ├── campaigns/    # Campaign management
│   └── ui/           # Base UI components
├── pages/            # Page components
├── services/         # API services
├── hooks/            # Custom React hooks
├── store/            # State management (Zustand)
├── lib/              # Utilities and helpers
└── types/            # TypeScript definitions
```

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript 5.8
- **Styling**: TailwindCSS 4.1
- **State**: Zustand, TanStack Query
- **Real-time**: Laravel Echo, Pusher JS
- **Animations**: Motion (Framer Motion)
- **Forms**: React Hook Form, Zod
- **Build**: Vite 6.2

## 📦 Build for Production

```bash
npm run build
npm start
```

## 🎨 Key Pages

### 1. WhatsApp Connect (`/whatsapp/connect`)
- Connection status dashboard
- Meta embedded signup flow
- Statistics widgets
- Setup instructions

### 2. Enhanced Inbox (`/inbox-enhanced`)
- 3-column layout (conversations, chat, contact details)
- Real-time messaging
- Contact management
- Agent assignment

### 3. Dashboard (`/dashboard`)
- Campaign performance
- Contact statistics
- Recent activity

### 4. Campaigns (`/campaigns`)
- Campaign builder
- Audience targeting
- Schedule management

## 🔐 Security

- Bearer token authentication
- HTTPS required for all API calls
- Environment variables for sensitive data
- CORS handled via Express proxy
- XSS protection via React

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues or questions:
- Check the [documentation](./WHATSAPP_SETUP.md)
- Review [troubleshooting guide](./QUICK_START.md#troubleshooting)
- Open an issue on GitHub

---

Built with ❤️ by throbtech
