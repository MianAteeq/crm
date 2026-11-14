import assert from 'node:assert/strict';
import test from 'node:test';

import { normalizeMessageContent } from '../src/utils/messageContent';

test('extracts text from a database message record nested in message', () => {
  const value = {
    message: {
      tenant_id: 1,
      conversation_id: 2,
      message_id: 'wamid.1',
      direction: 'outgoing',
      message: 'Hello from WhatsApp',
      type: 'text',
      status: 'sent',
      payload: {},
      id: 10,
    },
  };

  assert.equal(normalizeMessageContent(value), 'Hello from WhatsApp');
});

test('extracts Meta text body and safely handles unknown objects', () => {
  assert.equal(normalizeMessageContent({ text: { body: 'Incoming message' } }), 'Incoming message');
  assert.equal(normalizeMessageContent({ id: 1 }, 'New message'), 'New message');
});

test('does not loop on circular payloads', () => {
  const value: Record<string, unknown> = {};
  value.message = value;

  assert.equal(normalizeMessageContent(value, 'New message'), 'New message');
});
