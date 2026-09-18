'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { sendChatMessage } from '@/services/chat';
import type { ChatMessage, ChatResponse, ChatStatus } from '@/types/chat';

interface UseChatOptions {
  language: string;
}

interface UseChatResult {
  messages: ChatMessage[];
  status: ChatStatus;
  error: string | null;
  sessionId: string;
  lastResponse: ChatResponse | null;
  sendMessage: (content: string) => Promise<void>;
  retry: () => Promise<void>;
  reset: () => void;
}

function createId(prefix: string) {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function useChat({ language }: UseChatOptions): UseChatResult {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<ChatStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [lastResponse, setLastResponse] = useState<ChatResponse | null>(null);
  const [sessionId, setSessionId] = useState(() => createId('sergio-ai'));
  const lastUserMessageRef = useRef<string | null>(null);

  const requestAssistantResponse = useCallback(
    async (message: string) => {
      setStatus('sending');
      setError(null);

      try {
        const response = await sendChatMessage({
          message,
          sessionId,
          language,
          source: 'portfolio',
        });

        const assistantMessage: ChatMessage = {
          id: createId('assistant'),
          role: 'assistant',
          content: response.answer,
          createdAt: new Date(),
        };

        setLastResponse(response);
        setMessages((current) => [...current, assistantMessage]);
        setStatus('success');
      } catch (caughtError) {
        setError(caughtError instanceof Error ? caughtError.message : 'chat-error');
        setStatus('error');
      }
    },
    [language, sessionId],
  );

  const sendMessage = useCallback(
    async (content: string) => {
      const message = content.trim();

      if (!message || status === 'sending') {
        return;
      }

      const userMessage: ChatMessage = {
        id: createId('user'),
        role: 'user',
        content: message,
        createdAt: new Date(),
      };

      setMessages((current) => [...current, userMessage]);
      lastUserMessageRef.current = message;
      await requestAssistantResponse(message);
    },
    [requestAssistantResponse, status],
  );

  const retry = useCallback(async () => {
    const lastUserMessage = lastUserMessageRef.current;

    if (!lastUserMessage) {
      return;
    }

    await requestAssistantResponse(lastUserMessage);
  }, [requestAssistantResponse]);

  const reset = useCallback(() => {
    setMessages([]);
    setStatus('idle');
    setError(null);
    setLastResponse(null);
    setSessionId(createId('sergio-ai'));
    lastUserMessageRef.current = null;
  }, []);

  return useMemo(
    () => ({
      messages,
      status,
      error,
      sessionId,
      lastResponse,
      sendMessage,
      retry,
      reset,
    }),
    [error, lastResponse, messages, reset, retry, sendMessage, sessionId, status],
  );
}
