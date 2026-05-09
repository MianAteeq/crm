# Laravel Reverb + React Realtime Implementation

This document outlines the real-time messaging architecture using Laravel Echo, Pusher JS, and Laravel Reverb.

## 🏗️ Architecture

1. **Service (`src/lib/echo.ts`)**: Initializes the Laravel Echo singleton with Reverb configuration.
2. **Hook (`src/hooks/useRealtime.ts`)**: A reusable React hook for subscribing to channels and listening for events.
3. **Integration**: The `useInbox` hook leverages `useRealtime` to update the UI instantly when new messages arrive.

## 🚀 Configuration

Environment variables used (configured in `.env`):
- `VITE_REVERB_APP_KEY`: Your Reverb application key.
- `VITE_REVERB_HOST`: The domain of your Reverb server.
- `VITE_REVERB_PORT`: Port (usually 443 for SSL).
- `VITE_REVERB_SCHEME`: `https` for SSL.

## 🛠️ Backend Implementation (Example)

### Broadcast Event
```php
namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MessageSent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $message;

    public function __construct($message)
    {
        $this->message = $message;
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('chat.' . $this->message->conversation_id),
        ];
    }
}
```

### Channel Definition (`routes/channels.php`)
```php
Broadcast::channel('chat.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id; // Replace with your logic
});
```

## 🔍 Debugging Guide

### 1. WebSocket Connection Failed
- **Symptoms**: Browser console shows connection errors; `isConnected` remains false.
- **Check**:
  - Is Reverb running on the server? (`php artisan reverb:start`)
  - Are ports 443 (SSL) or 8080 open in CloudPanel/Firewall?
  - Verify `VITE_REVERB_HOST` matches your SSL certificate domain.

### 2. Authentication Failed (403/401)
- **Symptoms**: Console shows "Broadcasting auth failed".
- **Check**:
  - Does the user possess a valid `Bearer` token?
  - Is the `authEndpoint` (`/api/proxy/broadcasting/auth`) reachable?
  - Check `routes/channels.php` for correct authorization logic.

### 3. Channel Subscription Failed
- **Symptoms**: Connected but no events received.
- **Check**:
  - Ensure the channel name matches exactly (e.g., `private-chat.1` in Echo vs `new PrivateChannel('chat.1')` in PHP).
  - Use **Pusher Debug Console** or Reverb logs to see if events are actually being fired.

### 4. Nginx/SSL Issues
- **Symptoms**: WebSocket closes immediately with code 1006.
- **Check**:
  - Ensure Nginx is configured for WebSocket upgrades:
    ```nginx
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "Upgrade";
    ```
  - Double check SSL paths in CloudPanel.

### 5. Deployment Best Practices
- Use a process manager like **Supervisor** to keep Reverb running.
- Use **Redis** as the broadcast driver for high load.
- Ensure `BROADCAST_DRIVER=reverb` in your Laravel `.env`.
