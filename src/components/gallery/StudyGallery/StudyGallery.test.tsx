import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AuthProvider } from '@/components/auth';
import { LanguageProvider } from '@/components/language';
import { ThemeProvider } from '@/components/theme';
import { StudyGallery } from './StudyGallery';
import { listPublicStudyProjectsFromRest } from '@/services/firebase/firebaseStudyRestService';

vi.mock('@/services/firebase/firebaseStudyRestService', () => ({
  listPublicStudyProjectsFromRest: vi.fn(async () => []),
}));

describe('StudyGallery', () => {
  it('renders an empty state when the REST gallery has no published studies', async () => {
    localStorage.setItem('Sérgio-portfolio-language', 'portugues');

    render(
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <StudyGallery />
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>,
    );

    expect(await screen.findByText('Nenhum estudo publicado ainda.')).toBeInTheDocument();
  });

  it('shows Run project only for a generic runnable project and opens its playground', async () => {
    vi.mocked(listPublicStudyProjectsFromRest).mockResolvedValueOnce([
      {
        id: 'project-a', repository: 'example/repository', title: 'Project A', description: 'Description',
        focus: 'Learning', technologies: ['TypeScript'], category: 'frontend', kind: 'study',
        startedAt: '', completedAt: '', date: '2026-01-01', githubUrl: 'https://github.com/example/repository',
        portfolioEligible: true, demoUrl: 'https://example.com/app', preview: { enabled: true, type: 'iframe' },
        galleryImages: [], createdAt: null, updatedAt: null, createdBy: 'admin',
      },
    ]);
    localStorage.setItem('Sérgio-portfolio-language', 'portugues');

    render(<ThemeProvider><LanguageProvider><AuthProvider><StudyGallery /></AuthProvider></LanguageProvider></ThemeProvider>);

    const run = await screen.findByRole('button', { name: 'Executar projeto' });
    run.click();
    expect(await screen.findByTitle('Project A')).toHaveAttribute('src', 'https://example.com/app');
  });
});
