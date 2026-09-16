export interface SkillGroup {
  id: string;
  title: string;
  items: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    id: 'frontend',
    title: 'Frontend',
    items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Acessibilidade'],
  },
  {
    id: 'mobile',
    title: 'Mobile',
    items: ['Flutter', 'Dart', 'UI responsiva', 'Integrações nativas'],
  },
  {
    id: 'backend',
    title: 'Backend',
    items: ['Node.js', 'APIs REST', 'Autenticação', 'Bancos relacionais'],
  },
];
