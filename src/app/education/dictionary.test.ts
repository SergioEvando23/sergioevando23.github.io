import { describe, expect, it } from 'vitest';
import { validateDictionaryParity } from '@/i18n/validate';
import { educationDictionary } from './dictionary';

describe('educationDictionary', () => {
  it('keeps Portuguese and English content structurally equivalent', () => {
    expect(
      validateDictionaryParity(
        educationDictionary.portuguese,
        educationDictionary.english,
      ),
    ).toEqual([]);
  });
});
