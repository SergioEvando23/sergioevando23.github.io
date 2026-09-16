import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AuthProvider } from '@/components/auth';
import { LanguageProvider } from '@/components/language';
import { ThemeProvider } from '@/components/theme';
import { ProjectForm } from './ProjectForm';

vi.mock('@/hooks/useCreateStudyProject', () => ({
  useCreateStudyProject: () => ({
    create: vi.fn(),
    loading: false,
    progress: null,
  }),
}));

function renderForm() {
  localStorage.setItem('sergio-portfolio-language', 'portugues');

  return render(
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <ProjectForm />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>,
  );
}

function imageFile(name: string) {
  return new File(['image'], name, { type: 'image/png' });
}

describe('ProjectForm', () => {
  it('validates required fields and image requirement', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.click(screen.getByRole('button', { name: 'Publicar projeto' }));

    expect(screen.getAllByText('Campo obrigatorio.').length).toBeGreaterThan(0);
    expect(screen.getByText('Adicione pelo menos uma imagem.')).toBeInTheDocument();
  });

  it('accepts up to three images and rejects the fourth', async () => {
    const user = userEvent.setup();
    renderForm();

    const input = document.querySelector<HTMLInputElement>('#study-project-images');
    expect(input).toBeTruthy();

    await user.upload(input as HTMLInputElement, [
      imageFile('one.png'),
      imageFile('two.png'),
      imageFile('three.png'),
      imageFile('four.png'),
    ]);

    expect(
      screen.getByText('Cada projeto aceita no maximo tres imagens.'),
    ).toBeInTheDocument();
    expect(screen.getByText('Capa')).toBeInTheDocument();
  });
});
