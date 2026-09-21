import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LanguageProvider } from '@/components/language';
import { ThemeProvider } from '@/components/theme';
import {
  createDocumentation,
  deleteDocumentation,
  getAllDocumentations,
  updateDocumentation,
} from '@/services/firebase/studyDocumentationService';
import { StudyDocumentationsAdminPage } from './StudyDocumentationsAdminPage';

const authState = {
  user: null as null | {
    email: string;
    emailVerified: boolean;
    getIdToken: (forceRefresh?: boolean) => Promise<string>;
  },
  loading: false,
  isAuthenticated: false,
};

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('@/components/auth', () => ({
  useAuth: () => ({
    ...authState,
    authError: null,
    signInWithGoogle: vi.fn(),
    signOut: vi.fn(),
  }),
}));

vi.mock('@/services/firebase/studyDocumentationService', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('@/services/firebase/studyDocumentationService')>();

  return {
    ...actual,
    getAllDocumentations: vi.fn(),
    createDocumentation: vi.fn(),
    updateDocumentation: vi.fn(),
    deleteDocumentation: vi.fn(),
  };
});

const documentationItems = [
  {
    id: 'doc-1',
    title: 'documentação Firebase',
    tags: ['Firebase'],
    updatedAt: 1789873200000,
    author: 'Sérgio Costa' as const,
    content: '# Firebase\n\nConteudo.',
  },
];

function renderAdmin() {
  return render(
    <ThemeProvider>
      <LanguageProvider>
        <StudyDocumentationsAdminPage />
      </LanguageProvider>
    </ThemeProvider>,
  );
}

describe('StudyDocumentationsAdminPage', () => {
  beforeEach(() => {
    localStorage.setItem('Sérgio-portfolio-language', 'portugues');
    authState.user = null;
    authState.loading = false;
    authState.isAuthenticated = false;
    vi.mocked(getAllDocumentations).mockResolvedValue(documentationItems);
    vi.mocked(createDocumentation).mockResolvedValue('created-doc');
    vi.mocked(updateDocumentation).mockResolvedValue(undefined);
    vi.mocked(deleteDocumentation).mockResolvedValue(undefined);
  });

  it('shows Google login when the user is not authenticated', () => {
    renderAdmin();

    expect(screen.getByRole('heading', { name: 'Acesso administrativo' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Entrar com Google' })).toBeInTheDocument();
  });

  it('blocks authenticated users with a different email', () => {
    authState.user = {
      email: 'other@example.com',
      emailVerified: true,
      getIdToken: vi.fn(async () => 'token'),
    };
    authState.isAuthenticated = true;

    renderAdmin();

    expect(screen.getByRole('heading', { name: 'Acesso negado' })).toBeInTheDocument();
  });

  it('fills the form when editing an existing documentation', async () => {
    const user = userEvent.setup();
    authState.user = {
      email: 'sergioevandocosta@gmail.com',
      emailVerified: true,
      getIdToken: vi.fn(async () => 'token'),
    };
    authState.isAuthenticated = true;

    renderAdmin();

    await user.click(await screen.findByRole('button', { name: 'Editar' }));

    expect(screen.getByLabelText('Titulo')).toHaveValue('documentação Firebase');
    expect(screen.getByLabelText('Conteudo Markdown')).toHaveValue(
      '# Firebase\n\nConteudo.',
    );
  });

  it('creates a new documentation with a Firebase ID token', async () => {
    const user = userEvent.setup();
    const getIdToken = vi.fn(async () => 'firebase-token');
    authState.user = {
      email: 'sergioevandocosta@gmail.com',
      emailVerified: true,
      getIdToken,
    };
    authState.isAuthenticated = true;

    renderAdmin();

    await user.type(await screen.findByLabelText('Titulo'), 'Nova documentação');
    await user.type(screen.getByLabelText('Nova tag'), 'React');
    await user.click(screen.getByRole('button', { name: 'Adicionar tag' }));
    await user.type(screen.getByLabelText('Conteudo Markdown'), '# React\n\nConteudo.');
    await user.click(screen.getByRole('button', { name: 'Salvar documentação' }));

    expect(getIdToken).toHaveBeenCalledWith(true);
    expect(createDocumentation).toHaveBeenCalledWith(
      {
        title: 'Nova documentação',
        tags: ['React'],
        content: '# React\n\nConteudo.',
      },
      'firebase-token',
    );
  });

  it('confirms deletion before deleting a documentation', async () => {
    const user = userEvent.setup();
    authState.user = {
      email: 'sergioevandocosta@gmail.com',
      emailVerified: true,
      getIdToken: vi.fn(async () => 'token'),
    };
    authState.isAuthenticated = true;

    renderAdmin();

    await user.click(await screen.findByRole('button', { name: 'Excluir' }));
    expect(screen.getByText(/Excluir definitivamente/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Confirmar exclusao' }));

    expect(deleteDocumentation).toHaveBeenCalledWith('doc-1', 'token');
  });
});
