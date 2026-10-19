import { describe, expect, it } from 'vitest';
import { ChatServiceError } from '@/services/chat';
import { ChatOrchestrator } from './ChatOrchestrator';
import type { ChatProvider, ProviderResponse } from '../types';

const input = { message: 'React', sessionId: 'session', language: 'pt-BR' };
function provider(name: ChatProvider['name'], send: () => Promise<ProviderResponse>, available = true): ChatProvider {
  return { name, isAvailable: async () => available, sendMessage: send };
}

describe('ChatOrchestrator', () => {
  it('keeps n8n as the primary provider', async () => {
    const n8n = provider('n8n', async () => ({ success: true, message: 'online', sessionId: 'session', provider: 'n8n' }));
    const result = await new ChatOrchestrator(n8n, provider('local-ai', async () => { throw new Error('unused'); }), provider('knowledge-search', async () => { throw new Error('unused'); })).sendMessage(input);
    expect(result.provider).toBe('n8n');
  });

  it('uses basic search when local AI is unavailable after a network failure', async () => {
    const result = await new ChatOrchestrator(
      provider('n8n', async () => { throw new ChatServiceError('chat-timeout'); }),
      provider('local-ai', async () => { throw new Error('unused'); }, false),
      provider('knowledge-search', async () => ({ success: true, message: 'local facts', sessionId: 'session', provider: 'knowledge-search' })),
    ).sendMessage(input);
    expect(result.provider).toBe('knowledge-search');
  });

  it('does not hide n8n authorization errors as availability failures', async () => {
    const orchestrator = new ChatOrchestrator(
      provider('n8n', async () => { throw new ChatServiceError('unauthorized', 401); }),
      provider('local-ai', async () => ({ success: true, message: 'local', sessionId: 'session', provider: 'local-ai' })),
      provider('knowledge-search', async () => ({ success: true, message: 'search', sessionId: 'session', provider: 'knowledge-search' })),
    );
    await expect(orchestrator.sendMessage(input)).rejects.toMatchObject({ message: 'unauthorized' });
  });

  it('opens the circuit after repeated n8n failures', async () => {
    let calls = 0;
    const n8n = provider('n8n', async () => { calls += 1; throw new ChatServiceError('chat-timeout'); });
    const fallback = provider('knowledge-search', async () => ({ success: true, message: 'search', sessionId: 'session', provider: 'knowledge-search' }));
    const orchestrator = new ChatOrchestrator(n8n, provider('local-ai', async () => { throw new Error('no'); }, false), fallback, 2, 60_000);
    await orchestrator.sendMessage(input); await orchestrator.sendMessage(input); await orchestrator.sendMessage(input);
    expect(calls).toBe(2);
  });
});
