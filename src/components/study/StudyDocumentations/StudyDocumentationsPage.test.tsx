import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LanguageProvider } from '@/components/language';
import { LANGUAGE_STORAGE_KEY } from '@/i18n/config';
import { getAllDocumentations } from '@/services/firebase/studyDocumentationService';
import { StudyDocumentationsPage } from './StudyDocumentationsDatabasePage';

const useAuthMock = vi.fn();

vi.mock('@/components/auth', () => ({
  useAuth: () => useAuthMock(),
}));

vi.mock('@/services/firebase/studyDocumentationService', () => ({
  getAllDocumentations: vi.fn(),
}));

const documentationItems = [
  {
    id: 'llm-doc',
    title: 'Otimizacao de tokens em LLMs',
    tags: ['IA & LLMs', 'Eficiência'],
    updatedAt: 1789873200000,
    author: 'Sérgio Costa' as const,
    content: '# Introducao\n\nConteudo sobre tokens em LLMs.',
  },
  {
    id: 'architecture-doc',
    title: 'Clean Architecture na pratica',
    tags: ['Arquitetura'],
    updatedAt: 1789873100000,
    author: 'Sérgio Costa' as const,
    content: '# Clean Architecture\n\n- Dependencias apontam para dentro.',
  },
];

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
    vi.mocked(getAllDocumentations).mockResolvedValue(documentationItems);
  });

  it('renders documentation data loaded from the service', async () => {
    renderPage();

    expect(
      screen.getByRole('heading', { name: /documentações de Estudo/i }),
    ).toBeInTheDocument();
    expect(await screen.findAllByText('Otimizacao de tokens em LLMs')).toHaveLength(2);
    expect(
      screen.getByLabelText('Leitor da documentação selecionada'),
    ).toBeInTheDocument();
  });

  it('filters by tag and searches documentation cards', async () => {
    const user = userEvent.setup();
    renderPage();

    await screen.findByText('Clean Architecture na pratica');
    await user.click(screen.getAllByRole('button', { name: /Arquitetura/i })[0]);

    expect(screen.getAllByText('Clean Architecture na pratica').length).toBeGreaterThan(
      0,
    );
    expect(screen.queryByText('Otimizacao de tokens em LLMs')).not.toBeInTheDocument();

    await user.clear(screen.getByLabelText('Buscar documentações'));
    await user.type(screen.getByLabelText('Buscar documentações'), 'clean');

    expect(screen.getAllByText('Clean Architecture na pratica').length).toBeGreaterThan(
      0,
    );
  });

  it('selects another documentation and updates the reader', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(
      await screen.findByRole('button', { name: /Clean Architecture na pratica/i }),
    );

    expect(screen.getAllByText('Clean Architecture na pratica').length).toBeGreaterThan(
      1,
    );
    expect(screen.getByText('Dependencias apontam para dentro.')).toBeInTheDocument();
  });

  it('shows a retry action when loading fails', async () => {
    vi.mocked(getAllDocumentations).mockRejectedValueOnce(new Error('network'));
    renderPage();

    expect(await screen.findByText('Nao foi possivel carregar as documentações.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tentar novamente' })).toBeInTheDocument();
  });

  it('renders translated English interface text', async () => {
    renderPage('ingles');

    expect(
      await screen.findByRole('heading', { name: /Study Documentations/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Search documentations')).toBeInTheDocument();
  });

  it('shows admin actions only for the authorized administrator', async () => {
    useAuthMock.mockReturnValue({
      user: {
        email: 'sergioevandocosta@gmail.com',
        emailVerified: true,
      },
      isAdmin: true,
    });

    renderPage();

    expect(
      await screen.findByRole('link', { name: 'Nova documentação' }),
    ).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.getByRole('link', { name: 'Editar' })).toBeInTheDocument(),
    );
  });
});
