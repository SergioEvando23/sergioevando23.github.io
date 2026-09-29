'use client';

import { useEffect, useRef, useState } from 'react';
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';
import RestartAltOutlinedIcon from '@mui/icons-material/RestartAltOutlined';
import { useLanguage } from '@/components/language';
import { Button } from '@/components/ui/Button';
import { languageConfig } from '@/i18n/config';
import { useChat } from '@/hooks/useChat';
import { ChatHeader } from './ChatHeader';
import { ChatInput } from './ChatInput';
import { ChatMessages } from './ChatMessages';
import { ChatSuggestions } from './ChatSuggestions';

export function ChatBot() {
  const [open, setOpen] = useState(false);
  const { language, translations } = useLanguage();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const { messages, status, error, sendMessage, retry } = useChat({
    language: language === 'portuguese' ? languageConfig.portuguese.htmlLang : 'en-US',
  });
  const isSending = status === 'sending';

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const timeout = window.setTimeout(() => inputRef.current?.focus(), 50);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => {
      window.clearTimeout(timeout);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView?.({ behavior: 'smooth', block: 'end' });
  }, [messages, status]);

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 sm:inset-x-auto sm:right-6">
      {!open ? (
        <Button
          aria-label={translations.chatbot.open}
          className="ml-auto flex shadow-[var(--shadow-glow)]"
          leftIcon={<QuestionAnswerOutlinedIcon aria-hidden="true" fontSize="small" />}
          onClick={() => setOpen(true)}
          size="large"
        >
          {translations.chatbot.floatingButton}
        </Button>
      ) : (
        <section
          aria-labelledby="SÃƒÆ’Ã‚Â©rgio-ai-title"
          className="fixed inset-0 flex flex-col overflow-hidden border-border bg-overlay shadow-[var(--shadow-glow)] backdrop-blur-xl sm:inset-auto sm:bottom-6 sm:right-6 sm:h-[min(720px,calc(100vh-48px))] sm:w-[min(420px,calc(100vw-48px))] sm:rounded-[var(--radius-xl)] sm:border"
          role="dialog"
        >
          <span className="sr-only" id="SÃƒÆ’Ã‚Â©rgio-ai-title">
            {translations.chatbot.title}
          </span>
          <ChatHeader
            closeLabel={translations.chatbot.close}
            onClose={() => {
              setOpen(false);
              closeButtonRef.current?.focus();
            }}
            subtitle={translations.chatbot.subtitle}
            title={translations.chatbot.title}
          />

          <ChatMessages
            analyzingLabel={translations.chatbot.analyzing}
            assistantMessageLabel={translations.chatbot.assistantMessageLabel}
            initialMessage={translations.chatbot.initialMessage}
            messages={messages}
            messagesLabel={translations.chatbot.messagesLabel}
            scrollRef={scrollRef}
            status={status}
            userMessageLabel={translations.chatbot.userMessageLabel}
          />

          {messages.length === 0 ? (
            <ChatSuggestions
              ariaLabel={translations.chatbot.suggestionsLabel}
              disabled={isSending}
              labels={translations.chatbot.suggestions}
              onSelect={sendMessage}
              questions={translations.chatbot.suggestionQuestions}
            />
          ) : null}

          {error ? (
            <div
              aria-live="assertive"
              className="border-t border-border px-4 py-3 text-sm text-error"
            >
              <p>{translations.chatbot.error}</p>
              <Button
                className="mt-3"
                disabled={isSending}
                leftIcon={<RestartAltOutlinedIcon aria-hidden="true" fontSize="small" />}
                onClick={retry}
                size="small"
                variant="secondary"
              >
                {translations.chatbot.retry}
              </Button>
            </div>
          ) : null}

          <ChatInput
            disabled={isSending}
            inputRef={inputRef}
            label={translations.chatbot.inputLabel}
            onSend={sendMessage}
            placeholder={translations.chatbot.inputPlaceholder}
            sendLabel={translations.chatbot.send}
          />
        </section>
      )}
    </div>
  );
}
