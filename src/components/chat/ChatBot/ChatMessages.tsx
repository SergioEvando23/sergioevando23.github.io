import type { RefObject } from 'react';
import type { ChatMessage, ChatStatus } from '@/types/chat';
import { cn } from '@/lib/cn';

interface ChatMessagesProps {
  messages: ChatMessage[];
  status: ChatStatus;
  initialMessage: string;
  analyzingLabel: string;
  messagesLabel: string;
  userMessageLabel: string;
  assistantMessageLabel: string;
  scrollRef: RefObject<HTMLDivElement | null>;
}

export function ChatMessages({
  messages,
  status,
  initialMessage,
  analyzingLabel,
  messagesLabel,
  userMessageLabel,
  assistantMessageLabel,
  scrollRef,
}: ChatMessagesProps) {
  return (
    <div
      aria-label={messagesLabel}
      className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4"
      role="log"
    >
      <article
        aria-label={assistantMessageLabel}
        className="mr-8 rounded-[var(--radius-lg)] border border-border bg-surface-secondary px-4 py-3 text-sm leading-6 text-text shadow-[var(--shadow-card)]"
      >
        {initialMessage}
      </article>

      {messages.map((message) => (
        <article
          aria-label={
            message.role === 'user' ? userMessageLabel : assistantMessageLabel
          }
          className={cn(
            'max-w-[86%] whitespace-pre-wrap break-words rounded-[var(--radius-lg)] px-4 py-3 text-sm leading-6 shadow-[var(--shadow-card)]',
            message.role === 'user'
              ? 'ml-auto bg-primary text-primary-foreground'
              : 'mr-auto border border-border bg-surface-secondary text-text',
          )}
          key={message.id}
        >
          {message.content}
        </article>
      ))}

      {status === 'sending' ? (
        <div
          aria-live="polite"
          className="mr-auto inline-flex items-center gap-2 rounded-[var(--radius-full)] border border-border bg-surface-secondary px-4 py-2 text-sm text-text-muted"
        >
          <span className="h-2 w-2 animate-pulse rounded-[var(--radius-full)] bg-primary" />
          {analyzingLabel}
        </div>
      ) : null}

      <div ref={scrollRef} />
    </div>
  );
}
