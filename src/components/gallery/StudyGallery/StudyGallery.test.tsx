import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AuthProvider } from '@/components/auth';
import { LanguageProvider } from '@/components/language';
import { ThemeProvider } from '@/components/theme';
import { StudyGallery } from './StudyGallery';

describe('StudyGallery', () => {
  it('renders an empty state when Firebase is not configured', async () => {
    localStorage.setItem('sergio-portfolio-language', 'portugues');

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
