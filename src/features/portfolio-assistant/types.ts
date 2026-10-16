import type { ChatRequest, ChatResponse } from '@/types/chat';

export type KnowledgeVisibility = 'public' | 'restricted' | 'private';
export type ProviderName = 'n8n' | 'local-ai' | 'knowledge-search';

export interface KnowledgeRecord {
  id: string;
  category: string;
  visibility: KnowledgeVisibility;
  title: string;
  content: string;
  keywords: string[];
  source?: string;
  updatedAt?: string;
}

export type ChatInput = ChatRequest;
export type ProviderResponse = ChatResponse & { provider: ProviderName };

export interface ChatProvider {
  readonly name: ProviderName;
  isAvailable(): Promise<boolean>;
  sendMessage(input: ChatInput): Promise<ProviderResponse>;
}

export type LocalAIState = 'idle' | 'consent-required' | 'downloading' | 'ready' | 'unsupported' | 'error';
