import { getPublicKnowledge } from '../knowledge/records';
import type { KnowledgeRecord } from '../types';

export function normalizeSearchText(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

export function rankKnowledge(query: string, language: string, limit = 3): KnowledgeRecord[] {
  const terms = normalizeSearchText(query).split(/[^\p{L}\p{N}]+/u).filter((term) => term.length > 1);
  return getPublicKnowledge(language)
    .map((record) => {
      const title = normalizeSearchText(record.title);
      const content = normalizeSearchText(record.content);
      const keywords = record.keywords.map(normalizeSearchText);
      const score = terms.reduce((total, term) => total + (keywords.some((keyword) => keyword.includes(term)) ? 5 : 0) + (title.includes(term) ? 3 : 0) + (content.includes(term) ? 1 : 0), 0);
      return { record, score };
    })
    .filter(({ score }) => score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, limit)
    .map(({ record }) => record);
}
