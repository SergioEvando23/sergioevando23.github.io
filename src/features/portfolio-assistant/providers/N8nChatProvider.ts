import { ChatServiceError, sendChatMessage } from '@/services/chat';
import type { ChatInput, ChatProvider, ProviderResponse } from '../types';

export class N8nChatProvider implements ChatProvider {
  readonly name = 'n8n' as const;
  constructor(private readonly timeoutMs = 8000) {}
  async isAvailable() { return Boolean(process.env.NEXT_PUBLIC_N8N_CHAT_WEBHOOK_URL?.trim()); }
  async sendMessage(input: ChatInput): Promise<ProviderResponse> {
    const timeout = new Promise<never>((_, reject) => window.setTimeout(() => reject(new ChatServiceError('chat-timeout')), this.timeoutMs));
    const response = await Promise.race([sendChatMessage(input), timeout]);
    return { ...response, provider: this.name };
  }
}
