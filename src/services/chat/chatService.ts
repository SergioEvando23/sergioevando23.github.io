import type { ChatRequest, ChatResponse } from '@/types/chat';

export const CHAT_MESSAGE_MAX_LENGTH = 4000;

export class ChatServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ChatServiceError';
  }
}

function getWebhookUrl() {
  return process.env.NEXT_PUBLIC_N8N_CHAT_WEBHOOK_URL?.trim() ?? '';
}

function isChatResponse(value: unknown): value is ChatResponse {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<ChatResponse>;
  return (
    typeof candidate.success === 'boolean' &&
    typeof candidate.message === 'string' &&
    typeof candidate.sessionId === 'string'
  );
}

export async function sendChatMessage(request: ChatRequest): Promise<ChatResponse> {
  const webhookUrl = getWebhookUrl();
  const message = request.message.trim();

  if (!webhookUrl) {
    throw new ChatServiceError('chat-webhook-not-configured');
  }

  if (!message) {
    throw new ChatServiceError('chat-message-empty');
  }

  if (message.length > CHAT_MESSAGE_MAX_LENGTH) {
    throw new ChatServiceError('chat-message-too-large');
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      ...request,
      message,
    }),
  });

  const payload: unknown = await response.json();

  if (!isChatResponse(payload)) {
    throw new ChatServiceError('chat-invalid-response');
  }

  if (!response.ok || !payload.success) {
    throw new ChatServiceError(payload.message || `chat-request-failed-${response.status}`);
  }

  return payload;
}
