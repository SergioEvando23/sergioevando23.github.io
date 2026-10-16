'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { ChatOrchestrator, KnowledgeSearchProvider, LocalAIChatProvider, N8nChatProvider } from '@/features/portfolio-assistant';
import type { LocalAIState, ProviderName } from '@/features/portfolio-assistant/types';
import type { ChatMessage, ChatResponse, ChatStatus } from '@/types/chat';

const CHAT_SESSION_STORAGE_KEY = 'Sérgio-ai-session-id';

interface UseChatOptions {
  language: string;
}

interface UseChatResult {
  messages: ChatMessage[];
  status: ChatStatus;
  error: string | null;
  sessionId: string;
  lastResponse: ChatResponse | null;
  provider: ProviderName | null;
  localAIState: LocalAIState;
  localAIProgress: number;
  activateLocalAI: () => Promise<void>;
  cancelLocalAI: () => Promise<void>;
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

function createSessionId() {
  if (typeof window === 'undefined') {
    return createId('Sérgio-ai');
  }

  const stored = window.sessionStorage.getItem(CHAT_SESSION_STORAGE_KEY);

  if (stored) {
    return stored;
  }

  const sessionId = createId('Sérgio-ai');
  window.sessionStorage.setItem(CHAT_SESSION_STORAGE_KEY, sessionId);
  return sessionId;
}

export function useChat({ language }: UseChatOptions): UseChatResult {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<ChatStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [lastResponse, setLastResponse] = useState<ChatResponse | null>(null);
  const [provider, setProvider] = useState<ProviderName | null>(null);
  const [localAIState, setLocalAIState] = useState<LocalAIState>('idle');
  const [localAIProgress, setLocalAIProgress] = useState(0);
  const [sessionId, setSessionId] = useState(createSessionId);
  const lastUserMessageRef = useRef<string | null>(null);
  const [assistant] = useState(() => {
    const local = new LocalAIChatProvider();
    local.setStateListener((next, progress) => { setLocalAIState(next); setLocalAIProgress(progress); });
    return { local, orchestrator: new ChatOrchestrator(new N8nChatProvider(), local, new KnowledgeSearchProvider()) };
  });

  const requestAssistantResponse = useCallback(
    async (message: string) => {
      setStatus('sending');
      setError(null);

      try {
        const response = await assistant.orchestrator.sendMessage({
          message,
          sessionId,
          language,
        });

        const assistantMessage: ChatMessage = {
          id: createId('assistant'),
          role: 'assistant',
          content: response.message,
          createdAt: new Date(),
        };

        setLastResponse(response);
        setProvider(response.provider ?? null);
        setMessages((current) => [...current, assistantMessage]);
        setStatus('success');
      } catch (caughtError) {
        setError(caughtError instanceof Error ? caughtError.message : 'chat-error');
        setStatus('error');
      }
    },
    [assistant, language, sessionId],
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
    setProvider(null);
    const nextSessionId = createId('Sérgio-ai');
    window.sessionStorage.setItem(CHAT_SESSION_STORAGE_KEY, nextSessionId);
    setSessionId(nextSessionId);
    lastUserMessageRef.current = null;
  }, []);

  const activateLocalAI = useCallback(async () => { await assistant.local.activate(); }, [assistant]);
  const cancelLocalAI = useCallback(async () => { await assistant.local.cancel(); }, [assistant]);

  return useMemo(
    () => ({
      messages,
      status,
      error,
      sessionId,
      lastResponse,
      provider,
      localAIState,
      localAIProgress,
      activateLocalAI,
      cancelLocalAI,
      sendMessage,
      retry,
      reset,
    }),
    [activateLocalAI, cancelLocalAI, error, lastResponse, localAIProgress, localAIState, messages, provider, reset, retry, sendMessage, sessionId, status],
  );
}
