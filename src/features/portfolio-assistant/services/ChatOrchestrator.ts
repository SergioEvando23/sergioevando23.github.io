import { ChatServiceError } from '@/services/chat';
import type { ChatInput, ChatProvider, ProviderResponse } from '../types';

const FALLBACK_STATUS = new Set([undefined, 500, 501, 502, 503, 504]);

export class ChatOrchestrator {
  private consecutiveFailures = 0;
  private openUntil = 0;
  constructor(private readonly n8n: ChatProvider, private readonly local: ChatProvider, private readonly search: ChatProvider, private readonly failureLimit = 2, private readonly coolDownMs = 30_000) {}
  async sendMessage(input: ChatInput): Promise<ProviderResponse> {
    const n8nUsable = Date.now() >= this.openUntil && await this.n8n.isAvailable();
    if (n8nUsable) {
      try {
        const response = await this.n8n.sendMessage(input);
        this.consecutiveFailures = 0;
        return response;
      } catch (error) {
        if (error instanceof ChatServiceError && !FALLBACK_STATUS.has(error.status) && error.message !== 'chat-timeout') throw error;
        this.consecutiveFailures += 1;
        if (this.consecutiveFailures >= this.failureLimit) this.openUntil = Date.now() + this.coolDownMs;
      }
    }
    if (await this.local.isAvailable()) {
      try { return await this.local.sendMessage(input); } catch { /* deterministic fallback below */ }
    }
    return this.search.sendMessage(input);
  }
}
