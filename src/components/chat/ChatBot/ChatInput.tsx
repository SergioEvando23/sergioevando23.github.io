import { FormEvent, KeyboardEvent, RefObject, useState } from 'react';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import { Button } from '@/components/ui/Button';
import { CHAT_MESSAGE_MAX_LENGTH } from '@/services/chat';

interface ChatInputProps {
  label: string;
  placeholder: string;
  sendLabel: string;
  disabled: boolean;
  inputRef: RefObject<HTMLTextAreaElement | null>;
  onSend: (message: string) => void;
}

export function ChatInput({
  label,
  placeholder,
  sendLabel,
  disabled,
  inputRef,
  onSend,
}: ChatInputProps) {
  const [message, setMessage] = useState('');

  const submit = () => {
    const trimmed = message.trim();

    if (!trimmed) {
      return;
    }

    onSend(trimmed);
    setMessage('');
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submit();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <form className="border-t border-border p-4" onSubmit={onSubmit}>
      <label className="sr-only" htmlFor="sergio-ai-message">
        {label}
      </label>
      <div className="flex items-end gap-2">
        <textarea
          className="min-h-12 max-h-32 flex-1 resize-none rounded-[var(--radius-lg)] border border-border bg-surface-secondary px-4 py-3 text-sm leading-5 text-text placeholder:text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25 disabled:cursor-not-allowed disabled:opacity-60 dark:placeholder:text-primary"
          disabled={disabled}
          id="sergio-ai-message"
          maxLength={CHAT_MESSAGE_MAX_LENGTH}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          ref={inputRef}
          rows={1}
          value={message}
        />
        <Button
          aria-label={sendLabel}
          className="h-12 min-w-12 px-4"
          disabled={disabled || !message.trim()}
          rightIcon={<SendOutlinedIcon aria-hidden="true" fontSize="small" />}
          type="submit"
        >
          <span className="sr-only">{sendLabel}</span>
        </Button>
      </div>
    </form>
  );
}
