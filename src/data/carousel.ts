import type { CarouselImage } from '@/types/carousel';

export const carouselItems: CarouselImage[] = [
  {
    id: 'frontend-react-typescript',
    src: '/images/carousel/frontend.svg',
    alt: 'Interface abstrata representando frontend com React e TypeScript',
    title: 'Frontend — React + TypeScript',
    description: 'Arquiteturas de interface acessíveis, rápidas e sustentáveis.',
  },
  {
    id: 'mobile-flutter-dart',
    src: '/images/carousel/mobile.svg',
    alt: 'Telas mobile abstratas representando Flutter e Dart',
    title: 'Mobile — Flutter + Dart',
    description:
      'Aplicações mobile fluidas com experiência consistente entre plataformas.',
  },
  {
    id: 'backend-node-apis',
    src: '/images/carousel/backend.svg',
    alt: 'Nós conectados representando backend com Node.js e APIs',
    title: 'Backend — Node.js + APIs',
    description: 'Serviços confiáveis, integrações e contratos bem definidos.',
  },
];
