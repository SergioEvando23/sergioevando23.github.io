export type ChatRole = 'user' | 'assistant';
export type ChatStatus = 'idle' | 'sending' | 'success' | 'error';

export interface ChatSource {
  id?: string;
  title?: string;
  url?: string;
}

export interface ChatAction {
  label: string;
  href: string;
}

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: Date;
}

export interface ChatRequest {
  message: string;
  sessionId: string;
  language: string;
  source: 'portfolio';
}

export interface ChatResponse {
  answer: string;
  sources?: ChatSource[];
  suggestions?: string[];
  actions?: ChatAction[];
}
