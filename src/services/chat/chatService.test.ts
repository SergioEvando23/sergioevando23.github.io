import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  CHAT_MESSAGE_MAX_LENGTH,
  ChatServiceError,
  sendChatMessage,
} from './chatService';

describe('chatService', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_N8N_CHAT_WEBHOOK_URL', 'https://n8n.example/webhook');
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          message: 'Resposta do agente.',
          sessionId: 'session-1',
        }),
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('sends the expected payload to n8n', async () => {
    await sendChatMessage({
      message: ' Qual experiencia Sergio possui com React? ',
      sessionId: 'session-1',
      language: 'pt-BR',
    });

    expect(fetch).toHaveBeenCalledWith(
      'https://n8n.example/webhook',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          message: 'Qual experiencia Sergio possui com React?',
          sessionId: 'session-1',
          language: 'pt-BR',
        }),
      }),
    );
  });

  it('rejects missing webhook configuration', async () => {
    vi.stubEnv('NEXT_PUBLIC_N8N_CHAT_WEBHOOK_URL', '');

    await expect(
      sendChatMessage({
        message: 'React',
        sessionId: 'session-1',
        language: 'pt-BR',
      }),
    ).rejects.toBeInstanceOf(ChatServiceError);
  });

  it('rejects empty or oversized messages before calling fetch', async () => {
    await expect(
      sendChatMessage({
        message: '   ',
        sessionId: 'session-1',
        language: 'pt-BR',
      }),
    ).rejects.toBeInstanceOf(ChatServiceError);

    await expect(
      sendChatMessage({
        message: 'a'.repeat(CHAT_MESSAGE_MAX_LENGTH + 1),
        sessionId: 'session-1',
        language: 'pt-BR',
      }),
    ).rejects.toBeInstanceOf(ChatServiceError);

    expect(fetch).not.toHaveBeenCalled();
  });

  it('rejects invalid responses', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ sources: [] }),
    } as Response);

    await expect(
      sendChatMessage({
        message: 'React',
        sessionId: 'session-1',
        language: 'pt-BR',
      }),
    ).rejects.toBeInstanceOf(ChatServiceError);
  });

  it('rejects validation errors returned by n8n', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        success: false,
        message: 'Mensagem vazia ou ausente.',
        sessionId: 'session-1',
      }),
    } as Response);

    await expect(
      sendChatMessage({
        message: 'React',
        sessionId: 'session-1',
        language: 'pt-BR',
      }),
    ).rejects.toBeInstanceOf(ChatServiceError);
  });
});
