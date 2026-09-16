import { describe, expect, it } from 'vitest';
import { dicionario } from './dicionario';
import { validateDictionaryParity } from './validate';

function countStrings(value: unknown): number {
  if (typeof value === 'string') {
    return 1;
  }

  if (typeof value === 'function') {
    return 1;
  }

  if (Array.isArray(value)) {
    return value.reduce((total, item) => total + countStrings(item), 0);
  }

  if (value && typeof value === 'object') {
    return Object.values(value).reduce((total, item) => total + countStrings(item), 0);
  }

  return 0;
}

describe('dicionario', () => {
  it('contains portuguese and english dictionaries', () => {
    expect(dicionario.portugues).toBeDefined();
    expect(dicionario.ingles).toBeDefined();
  });

  it('has bidirectional structural parity and no empty translations', () => {
    expect(validateDictionaryParity(dicionario.portugues, dicionario.ingles)).toEqual([]);
  });

  it('keeps equivalent function signatures', () => {
    expect(dicionario.portugues.carousel.goToSlide.length).toBe(
      dicionario.ingles.carousel.goToSlide.length,
    );
    expect(dicionario.portugues.carousel.slidePosition.length).toBe(
      dicionario.ingles.carousel.slidePosition.length,
    );
  });

  it('keeps compatible array structures', () => {
    expect(dicionario.portugues.skills.groups.frontend.items).toHaveLength(
      dicionario.ingles.skills.groups.frontend.items.length,
    );
  });

  it('counts the same amount of translated text entries', () => {
    expect(countStrings(dicionario.portugues)).toBe(countStrings(dicionario.ingles));
  });
});
