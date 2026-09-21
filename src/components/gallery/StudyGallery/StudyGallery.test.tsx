import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AuthProvider } from '@/components/auth';
import { LanguageProvider } from '@/components/language';
import { ThemeProvider } from '@/components/theme';
import { StudyGallery } from './StudyGallery';

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
});
