import { useEffect, useState, useRef } from 'react';
import { getEcho } from '../lib/echo';

interface RealtimeOptions {
  channel: string;
  event: string;
  isPrivate?: boolean;
  onEvent: (data: any) => void;
  enabled?: boolean;
}

export function useRealtime({ channel, event, isPrivate = false, onEvent, enabled = true }: RealtimeOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const echoRef = useRef(getEcho());

  // Use a ref for the callback to prevent effect re-runs when only the callback changes
  const callbackRef = useRef(onEvent);
  useEffect(() => {
    callbackRef.current = onEvent;
  }, [onEvent]);

  useEffect(() => {
    if (!enabled) return;

    const echo = echoRef.current;
    
    // Determine the correct event name for listening
    // User requested .event pattern for custom broadcastAs events
    const eventToListen = event.startsWith('.') ? event : `.${event}`;

    console.log(`[Realtime] 📡 Subscribing to ${isPrivate ? 'private-' : ''}${channel}`);
    console.log(`[Realtime] 👂 Listening for "${eventToListen}"`);

    const channelInstance = isPrivate 
      ? echo.private(channel) 
      : echo.channel(channel);

    // Listen for the event
    channelInstance.listen(eventToListen, (data: any) => {
      console.log(`[Realtime] 📥 Received event "${eventToListen}" on "${channel}":`, data);
      callbackRef.current(data);
    });

    // Connection lifecycle monitoring
    const connection = echo.connector.pusher.connection;
    
    const onStateChange = (states: any) => {
      console.log(`[Realtime] 🔌 Connection state: ${states.current}`);
      setIsConnected(states.current === 'connected');
      if (states.current === 'connected') setError(null);
    };

    const onError = (err: any) => {
      console.error('[Realtime] ❌ Connection error:', err);
      setError(err?.error?.message || err?.message || 'WebSocket connection error');
    };

    connection.bind('state_change', onStateChange);
    connection.bind('error', onError);
    
    // Initial state
    setIsConnected(connection.state === 'connected');

    // Subscription monitoring
    channelInstance.on('pusher:subscription_succeeded', () => {
      console.log(`[Realtime] ✅ Subscription succeeded for ${channel}`);
      setError(null);
    });

    channelInstance.error((err: any) => {
      console.error(`[Realtime] 🚫 Subscription error on ${channel}:`, err);
      setError(`Subscription failed: ${err?.status || 'Unauthorized'}`);
    });

    return () => {
      console.log(`[Realtime] 🧹 Cleaning up subscription to ${channel}`);
      channelInstance.stopListening(eventToListen);
      echo.leave(channel);
      connection.unbind('state_change', onStateChange);
      connection.unbind('error', onError);
    };
  }, [channel, event, isPrivate, enabled]);

  return { isConnected, error };
}
