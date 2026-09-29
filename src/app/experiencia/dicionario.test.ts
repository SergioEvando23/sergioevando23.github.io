import { describe, expect, it } from 'vitest';
import { validateDictionaryParity } from '@/i18n/validate';
import { experienceDictionary } from './dicionario';

describe('experienceDictionary', () => {
  it('keeps Portuguese and English content structurally equivalent', () => {
    expect(
      validateDictionaryParity(
        experienceDictionary.portugues,
        experienceDictionary.ingles,
      ),
    ).toEqual([]);
  });
});
