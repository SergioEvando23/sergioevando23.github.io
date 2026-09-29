import { describe, expect, it } from 'vitest';
import { validateDictionaryParity } from '@/i18n/validate';
import { formationDictionary } from './dicionario';

describe('formationDictionary', () => {
  it('keeps Portuguese and English content structurally equivalent', () => {
    expect(
      validateDictionaryParity(
        formationDictionary.portugues,
        formationDictionary.ingles,
      ),
    ).toEqual([]);
  });
});
