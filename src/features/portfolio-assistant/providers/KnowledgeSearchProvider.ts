import type { ChatInput, ChatProvider, ProviderResponse } from '../types';
import { rankKnowledge } from '../services/knowledgeSearch';

export class KnowledgeSearchProvider implements ChatProvider {
  readonly name = 'knowledge-search' as const;
  async isAvailable() { return true; }
  async sendMessage(input: ChatInput): Promise<ProviderResponse> {
    const records = rankKnowledge(input.message, input.language);
    const portuguese = input.language.toLowerCase().startsWith('pt');
    const message = records.length
      ? records.map((record) => `${record.title}: ${record.content}`).join('\n\n')
      : portuguese ? 'Não encontrei essa informação na base pública do portfólio.' : 'I could not find that information in the portfolio public knowledge base.';
    return { success: true, message, sessionId: input.sessionId, provider: this.name };
  }
}
