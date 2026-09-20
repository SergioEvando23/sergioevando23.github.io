import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LanguageProvider } from '@/components/language';
import { LANGUAGE_STORAGE_KEY } from '@/i18n/config';
import { StudyDocumentationsPage } from './StudyDocumentationsPage';

const useAuthMock = vi.fn();

vi.mock('@/components/auth', () => ({
  useAuth: () => useAuthMock(),
}));

function renderPage(language: 'portugues' | 'ingles' = 'portugues') {
  localStorage.setItem(LANGUAGE_STORAGE_KEY, language);

  return render(
    <LanguageProvider>
      <StudyDocumentationsPage />
    </LanguageProvider>,
  );
}

describe('StudyDocumentationsPage', () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthMock.mockReturnValue({
      user: null,
      isAdmin: false,
    });
  });

  it('renders the study documentation route content', () => {
    renderPage();

    expect(
      screen.getByRole('heading', { name: /Documentacoes de Estudo/i }),
    ).toBeInTheDocument();
    expect(screen.getAllByText('Otimizacao de tokens em LLMs')).toHaveLength(2);
    expect(
      screen.getByLabelText('Leitor da documentacao selecionada'),
    ).toBeInTheDocument();
  });

  it('filters by category and searches documentation cards', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getAllByRole('button', { name: /Arquitetura/i })[0]);

    expect(screen.getAllByText('Clean Architecture na pratica').length).toBeGreaterThan(0);
    expect(screen.queryByText('RAG: da teoria ao uso real')).not.toBeInTheDocument();

    await user.clear(screen.getByLabelText('Buscar documentacoes'));
    await user.type(screen.getByLabelText('Buscar documentacoes'), 'clean');

    expect(screen.getAllByText('Clean Architecture na pratica').length).toBeGreaterThan(0);
  });

  it('selects another documentation and updates the reader', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole('button', { name: /TypeScript alem do basico/i }));

    expect(screen.getAllByText('TypeScript alem do basico').length).toBeGreaterThan(1);
    expect(screen.getByText('Unions discriminadas.')).toBeInTheDocument();
  });

  it('renders translated English content', async () => {
    renderPage('ingles');

    expect(
      await screen.findByRole('heading', { name: /Study Documentations/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Search documentations')).toBeInTheDocument();
    expect(screen.getAllByText('Token optimization in LLMs').length).toBeGreaterThan(0);
  });

  it('shows admin actions only for the authorized administrator', () => {
    useAuthMock.mockReturnValue({
      user: {
        email: 'sergioevandocosta@gmail.com',
        emailVerified: true,
      },
      isAdmin: true,
    });

    renderPage();

    expect(screen.getByRole('button', { name: 'Nova documentacao' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Editar' })).toBeInTheDocument();
  });
});
