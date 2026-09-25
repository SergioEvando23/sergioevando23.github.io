import { describe, expect, it } from 'vitest';
import type { StudyPayload } from '@/services/firebase/studyRestTypes';
import {
  emptyStudyPayload,
  hasStudyErrors,
  slugifyStudyId,
  validateStudyPayload,
} from './studyValidation';

function validStudy(): StudyPayload {
  return {
    ...emptyStudyPayload(),
    id: 'shopping-cart',
    repository: 'shopping-cart',
    title: 'Shopping Cart',
    description: 'A study project',
    focus: 'Frontend',
    technologies: ['TypeScript'],
    date: '2026-01-01',
    githubUrl: 'https://github.com/example/shopping-cart',
  };
}

describe('studyValidation', () => {
  it('creates the form defaults and normalizes study ids', () => {
    expect(emptyStudyPayload()).toMatchObject({
      portfolioEligible: true,
      preview: { enabled: false, type: 'iframe' },
      technologies: [],
    });
    expect(slugifyStudyId(' Carrinho de Compras! ')).toBe('carrinho-de-compras');
  });

  it('accepts a complete valid payload', () => {
    expect(validateStudyPayload(validStudy())).toEqual({});
    expect(hasStudyErrors({})).toBe(false);
  });

  it('reports required, slug, GitHub, demo URL and technology errors', () => {
    const errors = validateStudyPayload({
      ...validStudy(),
      id: 'Shopping Cart',
      repository: '',
      title: '',
      description: '',
      focus: '',
      category: '' as StudyPayload['category'],
      kind: '' as StudyPayload['kind'],
      date: '',
      githubUrl: 'https://example.com/project',
      demoUrl: 'http://example.com',
      technologies: [],
    });

    expect(errors).toMatchObject({
      repository: 'Campo obrigatorio.',
      title: 'Campo obrigatorio.',
      id: 'Use um slug seguro, como shopping-cart.',
      githubUrl: 'Informe uma URL valida do GitHub.',
      demoUrl: 'Informe uma URL HTTPS valida para executar o projeto.',
      technologies: 'Adicione pelo menos uma tecnologia.',
    });
    expect(hasStudyErrors(errors)).toBe(true);
  });
});
