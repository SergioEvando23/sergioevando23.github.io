import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LanguageProvider } from '@/components/language';
import { LANGUAGE_STORAGE_KEY } from '@/i18n/config';
import { ChatBot } from './ChatBot';

const { sendChatMessageMock } = vi.hoisted(() => ({
  sendChatMessageMock: vi.fn(),
}));

vi.mock('@/services/chat', () => ({
  CHAT_MESSAGE_MAX_LENGTH: 800,
  sendChatMessage: sendChatMessageMock,
}));

function renderChat(language: 'portugues' | 'ingles' = 'portugues') {
  localStorage.setItem(LANGUAGE_STORAGE_KEY, language);

  return render(
    <LanguageProvider>
      <ChatBot />
    </LanguageProvider>,
  );
}

describe('ChatBot', () => {
  beforeEach(() => {
    localStorage.clear();
    sendChatMessageMock.mockReset();
    sendChatMessageMock.mockResolvedValue({ answer: 'Sergio possui experiencia.' });
  });

  it('opens and closes the chat interface', async () => {
    const user = userEvent.setup();
    renderChat();

    await user.click(screen.getByRole('button', { name: 'Abrir Sergio AI' }));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Assistente profissional de Sergio Costa')).toBeInTheDocument();

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('does not allow empty messages', async () => {
    const user = userEvent.setup();
    renderChat();

    await user.click(screen.getByRole('button', { name: 'Abrir Sergio AI' }));

    expect(screen.getByRole('button', { name: 'Enviar mensagem' })).toBeDisabled();
  });

  it('sends a typed message and renders the assistant response', async () => {
    const user = userEvent.setup();
    renderChat();

    await user.click(screen.getByRole('button', { name: 'Abrir Sergio AI' }));
    await user.type(
      screen.getByLabelText('Mensagem para Sergio AI'),
      'Qual experiencia com React?',
    );
    await user.keyboard('{Enter}');

    expect(screen.getByText('Qual experiencia com React?')).toBeInTheDocument();
    expect(await screen.findByText('Sergio possui experiencia.')).toBeInTheDocument();
    expect(sendChatMessageMock).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Qual experiencia com React?',
        language: 'pt-BR',
        source: 'portfolio',
      }),
    );
  });

  it('sends a suggestion as a normal question', async () => {
    const user = userEvent.setup();
    renderChat();

    await user.click(screen.getByRole('button', { name: 'Abrir Sergio AI' }));
    await user.click(screen.getByRole('button', { name: 'Experiencia com React' }));

    expect(sendChatMessageMock).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Qual e a experiencia de Sergio com React?',
      }),
    );
  });

  it('shows loading and retries without duplicating the user message', async () => {
    const user = userEvent.setup();
    sendChatMessageMock
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce({ answer: 'Resposta apos retry.' });

    renderChat();

    await user.click(screen.getByRole('button', { name: 'Abrir Sergio AI' }));
    await user.type(screen.getByLabelText('Mensagem para Sergio AI'), 'E testes?');
    await user.keyboard('{Enter}');

    expect(await screen.findByText(/Nao consegui consultar minha base/)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Tentar novamente' }));

    expect(await screen.findByText('Resposta apos retry.')).toBeInTheDocument();
    expect(screen.getAllByText('E testes?')).toHaveLength(1);
  });

  it('uses English labels and language payload', async () => {
    const user = userEvent.setup();
    renderChat('ingles');

    await user.click(await screen.findByRole('button', { name: 'Open Sergio AI' }));
    await user.type(screen.getByLabelText('Message for Sergio AI'), 'React experience');
    await user.keyboard('{Enter}');

    await waitFor(() =>
      expect(sendChatMessageMock).toHaveBeenCalledWith(
        expect.objectContaining({
          language: 'en',
          message: 'React experience',
        }),
      ),
    );
  });
});
