import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { LanguageProvider } from '@/components/language';
import type { StudyProject } from '@/types/firebase/studyProject';
import { ProjectPlayground } from './ProjectPlayground';

const project = (overrides: Partial<StudyProject> = {}): StudyProject => ({
  id: 'project-a', repository: 'example/repository', title: 'Project A', description: 'Description',
  focus: 'Learning', technologies: ['TypeScript'], category: 'frontend', kind: 'study',
  startedAt: '', completedAt: '', date: '2026-01-01', githubUrl: 'https://github.com/example/repository',
  portfolioEligible: true, demoUrl: 'https://example.com/app', preview: { enabled: true, type: 'iframe' },
  galleryImages: [], createdAt: null, updatedAt: null, createdBy: 'admin', ...overrides,
});

function renderPlayground(value = project(), onClose = vi.fn()) {
  render(<LanguageProvider><ProjectPlayground onClose={onClose} project={value} /></LanguageProvider>);
  return onClose;
}

describe('ProjectPlayground', () => {
  it('uses the selected project URL and unmounts the iframe when closed', () => {
    const onClose = renderPlayground();
    expect(screen.getByTitle('Project A')).toHaveAttribute('src', 'https://example.com/app');
    fireEvent.click(screen.getByRole('button', { name: 'Fechar' }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('closes with Escape and opens the project externally', () => {
    const onClose = renderPlayground(project({ demoUrl: 'https://example.com/new' }));
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledOnce();
    expect(screen.getByRole('link', { name: 'Abrir em nova aba' })).toHaveAttribute('href', 'https://example.com/new');
  });

  it('does not create an iframe for an invalid URL', () => {
    renderPlayground(project({ demoUrl: 'javascript:alert(1)' }));
    expect(screen.queryByTitle('Project A')).not.toBeInTheDocument();
    expect(screen.getByText('Nao foi possivel carregar este projeto dentro do Playground.')).toBeInTheDocument();
  });
});
