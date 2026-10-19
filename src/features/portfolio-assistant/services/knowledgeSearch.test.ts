import { describe, expect, it } from 'vitest';
import { englishKnowledge, portugueseKnowledge } from '../knowledge/records';
import { normalizeSearchText, rankKnowledge } from './knowledgeSearch';

describe('public knowledge', () => {
  it('keeps PT and EN records in parity and only includes public records', () => {
    expect(portugueseKnowledge.map(({ id }) => id)).toEqual(englishKnowledge.map(({ id }) => id));
    expect([...portugueseKnowledge, ...englishKnowledge].every(({ visibility }) => visibility === 'public')).toBe(true);
  });
  it('normalizes accents and ranks keyword matches first', () => {
    expect(normalizeSearchText('Experiência')).toBe('experiencia');
    expect(rankKnowledge('experiencia React', 'pt-BR')[0]?.id).toBe('experience');
  });
});
