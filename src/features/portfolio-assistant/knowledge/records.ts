import type { KnowledgeRecord } from '../types';

// This is intentionally small, public, and versioned with the portfolio.
export const portugueseKnowledge: KnowledgeRecord[] = [
  { id: 'profile', category: 'profile', visibility: 'public', title: 'Perfil profissional', content: 'Sérgio Costa é Engenheiro de Software Fullstack Web & Mobile, especializado em Front-end. Atua com React, TypeScript e Flutter, arquitetura de software, micro-frontends, modernização de sistemas legados, qualidade de código, CI/CD e investigação de incidentes em produção.', keywords: ['sergio', 'perfil', 'fullstack', 'frontend', 'react', 'typescript', 'flutter', 'arquitetura'] },
  { id: 'experience', category: 'experience', visibility: 'public', title: 'Experiência', content: 'A experiência profissional inclui engenharia de produto com micro-frontends, design systems e componentização, além de serviços monolíticos e integrações.', keywords: ['experiência', 'micro frontend', 'design system', 'componentização', 'serviços'] },
  { id: 'skills', category: 'skills', visibility: 'public', title: 'Competências', content: 'As competências públicas incluem React, Next.js, TypeScript, Flutter, Dart, Node.js, APIs REST, Cloud, testes, observabilidade, acessibilidade e CI/CD.', keywords: ['stack', 'tecnologias', 'testes', 'observabilidade', 'node', 'api', 'acessibilidade'] },
  { id: 'education', category: 'education', visibility: 'public', title: 'Formação', content: 'Sérgio cursa Engenharia de Software na Estácio, conectando fundamentos acadêmicos à experiência prática.', keywords: ['formação', 'faculdade', 'estácio', 'engenharia de software'] },
  { id: 'projects', category: 'projects', visibility: 'public', title: 'Projetos', content: 'O portfólio apresenta plataformas de frontend com React, Next.js e TypeScript, soluções mobile com Flutter e Dart, e plataformas backend com Node.js, REST e Cloud.', keywords: ['projetos', 'portfolio', 'next.js', 'mobile', 'backend'] },
];

export const englishKnowledge: KnowledgeRecord[] = [
  { id: 'profile', category: 'profile', visibility: 'public', title: 'Professional profile', content: 'Sérgio Costa is a Fullstack Web & Mobile Software Engineer specialized in Front-end work. He works with React, TypeScript and Flutter, software architecture, micro-frontends, legacy modernization, code quality, CI/CD and production incident investigation.', keywords: ['sergio', 'profile', 'fullstack', 'frontend', 'react', 'typescript', 'flutter', 'architecture'] },
  { id: 'experience', category: 'experience', visibility: 'public', title: 'Experience', content: 'His public professional experience includes product engineering with micro-frontends, design systems and componentization, as well as monolithic services and integrations.', keywords: ['experience', 'micro frontend', 'design system', 'componentization', 'services'] },
  { id: 'skills', category: 'skills', visibility: 'public', title: 'Skills', content: 'Public skills include React, Next.js, TypeScript, Flutter, Dart, Node.js, REST APIs, Cloud, testing, observability, accessibility and CI/CD.', keywords: ['stack', 'technologies', 'testing', 'observability', 'node', 'api', 'accessibility'] },
  { id: 'education', category: 'education', visibility: 'public', title: 'Education', content: 'Sérgio studies Software Engineering at Estácio, connecting academic foundations with practical experience.', keywords: ['education', 'university', 'estacio', 'software engineering'] },
  { id: 'projects', category: 'projects', visibility: 'public', title: 'Projects', content: 'The portfolio presents frontend platforms with React, Next.js and TypeScript, mobile solutions with Flutter and Dart, and backend platforms with Node.js, REST and Cloud.', keywords: ['projects', 'portfolio', 'next.js', 'mobile', 'backend'] },
];

export function getPublicKnowledge(language: string) {
  const records = language.toLowerCase().startsWith('pt') ? portugueseKnowledge : englishKnowledge;
  return records.filter((record) => record.visibility === 'public');
}
