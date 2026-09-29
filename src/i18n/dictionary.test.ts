import { describe, expect, it } from 'vitest';
import { dictionary } from './dictionary';
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

describe('dictionary', () => {
  it('contains portuguese and english dictionaries', () => {
    expect(dictionary.portuguese).toBeDefined();
    expect(dictionary.english).toBeDefined();
  });

  it('has bidirectional structural parity and no empty translations', () => {
    expect(validateDictionaryParity(dictionary.portuguese, dictionary.english)).toEqual([]);
  });

  it('keeps equivalent function signatures', () => {
    expect(dictionary.portuguese.carousel.goToSlide.length).toBe(
      dictionary.english.carousel.goToSlide.length,
    );
    expect(dictionary.portuguese.carousel.slidePosition.length).toBe(
      dictionary.english.carousel.slidePosition.length,
    );
  });

  it('keeps compatible array structures', () => {
    expect(dictionary.portuguese.skills.groups.frontend.items).toHaveLength(
      dictionary.english.skills.groups.frontend.items.length,
    );
  });

  it('counts the same amount of translated text entries', () => {
    expect(countStrings(dictionary.portuguese)).toBe(countStrings(dictionary.english));
  });
});
