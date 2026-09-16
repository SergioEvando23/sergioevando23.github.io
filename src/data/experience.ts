export interface ExperienceItem {
  id: string;
  title: string;
  description: string;
}

export const experienceItems: ExperienceItem[] = [
  {
    id: 'product-engineering',
    title: 'Engenharia orientada a produto',
    description:
      'Construção de soluções digitais com foco em valor de negócio, qualidade e evolução contínua.',
  },
  {
    id: 'design-systems',
    title: 'Design systems whitelabel',
    description:
      'Componentes desacoplados, tokens semânticos e temas adaptáveis para diferentes marcas.',
  },
];
