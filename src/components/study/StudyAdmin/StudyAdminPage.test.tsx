import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LanguageProvider } from '@/components/language';
import { ThemeProvider } from '@/components/theme';
import { StudyAdminPage } from './StudyAdminPage';

const authState = {
  user: null as null | {
    email: string;
    emailVerified: boolean;
    getIdToken: () => Promise<string>;
  },
  loading: false,
  isAuthenticated: false,
};

vi.mock('@/components/auth', () => ({
  useAuth: () => ({
    ...authState,
    authError: null,
    signInWithGoogle: vi.fn(),
    signOut: vi.fn(),
  }),
}));

vi.mock('@/services/firebase/firebaseStudyRestService', () => ({
  listStudies: vi.fn(async () => [
    {
      id: 'shopping-cart',
      repository: 'project-trybe-shopping-cart',
      title: 'Shopping Cart',
      description: 'Cart description',
      focus: 'Frontend',
      technologies: ['JavaScript'],
      category: 'frontend',
      kind: 'course-project',
      startedAt: '2022-01-14',
      completedAt: '2022-01-14',
      date: '2022-01-14',
      githubUrl: 'https://github.com/SérgioEvando23/project-trybe-shopping-cart',
      portfolioEligible: true,
      coverImage: '/images/studies/shopping-cart/cover.webp',
      images: ['/images/studies/shopping-cart/cover.webp'],
      galleryImages: [],
      createdAt: null,
      updatedAt: null,
      createdBy: 'admin',
    },
  ]),
  getStudy: vi.fn(),
  createStudy: vi.fn(),
  updateStudy: vi.fn(),
  deleteStudy: vi.fn(),
}));

function renderAdmin() {
  return render(
    <ThemeProvider>
      <LanguageProvider>
        <StudyAdminPage />
      </LanguageProvider>
    </ThemeProvider>,
  );
}

describe('StudyAdminPage', () => {
  beforeEach(() => {
    localStorage.setItem('Sérgio-portfolio-language', 'portugues');
    authState.user = null;
    authState.loading = false;
    authState.isAuthenticated = false;
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

  it('fills the form when editing an existing study', async () => {
    const user = userEvent.setup();
    authState.user = {
      email: 'sergioevandocosta@gmail.com',
      emailVerified: true,
      getIdToken: vi.fn(async () => 'token'),
    };
    authState.isAuthenticated = true;

    renderAdmin();

    await user.click(await screen.findByRole('button', { name: 'Editar estudo' }));

    expect(screen.getByLabelText('Titulo')).toHaveValue('Shopping Cart');
    expect(screen.getByLabelText('ID')).toHaveValue('shopping-cart');
  });
});
