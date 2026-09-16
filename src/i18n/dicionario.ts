export type DictionaryShape<T> = T extends (...args: infer Args) => string
  ? (...args: Args) => string
  : T extends string
    ? string
    : T extends readonly unknown[]
      ? { readonly [K in keyof T]: DictionaryShape<T[K]> }
      : T extends object
        ? { [K in keyof T]: DictionaryShape<T[K]> }
        : T;

const portugues = {
  common: {
    loading: 'Carregando...',
    open: 'Abrir',
    close: 'Fechar',
    previous: 'Anterior',
    next: 'Proximo',
    current: 'Atual',
  },
  accessibility: {
    mainNavigation: 'Navegacao principal',
    openMenu: 'Abrir menu',
    closeMenu: 'Fechar menu',
    openGithub: 'Abrir GitHub',
    openLinkedin: 'Abrir LinkedIn',
    unavailableEmail: 'E-mail nao cadastrado',
    currentSlide: 'Slide atual',
    selectSlide: 'Selecionar slide',
  },
  metadata: {
    title: 'Sergio Costa | Engenheiro de Software Fullstack Web & Mobile',
    description:
      'Transformo desafios complexos em produtos digitais escalaveis, acessiveis e confiaveis.',
  },
  navigation: {
    projects: 'Projetos',
    technologies: 'Tecnologias',
    experience: 'Experiencia',
    contact: 'Contato',
  },
  brand: {
    name: 'Sergio Costa',
    initials: 'SC',
    role: 'Engenheiro de Software Fullstack Web & Mobile',
    description:
      'Transformo desafios complexos em produtos digitais escalaveis, acessiveis e confiaveis.',
    location: 'Paulista - PE | Remoto ou hibrido em Recife',
    homeLabel: 'Sergio Costa, inicio',
  },
  hero: {
    eyebrow: 'Ola, eu sou',
    viewProjects: 'Ver projetos',
    githubLabel: 'GitHub',
    linkedinLabel: 'LinkedIn',
  },
  resume: {
    title: 'Curriculos',
    description: 'Escolha o idioma do curriculo que deseja baixar.',
    downloadPortuguese: 'Baixar curriculo PT',
    downloadEnglish: 'Baixar curriculo EN',
    portugueseFileLabel: 'Curriculo de Sergio Costa em portugues',
    englishFileLabel: 'Curriculo de Sergio Costa em ingles',
  },
  language: {
    label: 'Idioma',
    portuguese: 'Portugues',
    english: 'Ingles',
    switchToPortuguese: 'Alterar idioma para portugues',
    switchToEnglish: 'Alterar idioma para ingles',
  },
  theme: {
    label: 'Selecionar tema',
    light: 'Claro',
    dark: 'Escuro',
    system: 'Sistema',
    optionLabel: (theme: string) => `Tema ${theme}`,
  },
  carousel: {
    defaultLabel: 'Carrossel de destaques',
    mainLabel: 'Carrossel principal de competencias',
    smallLabel: 'Carrossel pequeno',
    mediumLabel: 'Carrossel medio',
    largeLabel: 'Carrossel grande',
    empty: 'Nenhum slide cadastrado.',
    previousSlide: 'Slide anterior',
    nextSlide: 'Proximo slide',
    pause: 'Pausar carrossel',
    resume: 'Retomar carrossel',
    selectSlide: 'Selecionar slide',
    currentSlide: 'Slide atual',
    openProject: 'Abrir projeto',
    dimensions: (width: number, height: number) => `${width} por ${height}`,
    goToSlide: (slide: number) => `Ir para o slide ${slide}`,
    slidePosition: (current: number, total: number) => `Slide ${current} de ${total}`,
    items: {
      frontendReactTypescript: {
        alt: 'Interface abstrata representando frontend com React e TypeScript',
        title: 'Frontend - React + TypeScript',
        description: 'Arquiteturas de interface acessiveis, rapidas e sustentaveis.',
      },
      mobileFlutterDart: {
        alt: 'Telas mobile abstratas representando Flutter e Dart',
        title: 'Mobile - Flutter + Dart',
        description:
          'Aplicacoes mobile fluidas com experiencia consistente entre plataformas.',
      },
      backendNodeApis: {
        alt: 'Nos conectados representando backend com Node.js e APIs',
        title: 'Backend - Node.js + APIs',
        description: 'Servicos confiaveis, integracoes e contratos bem definidos.',
      },
    },
  },
  sections: {
    carouselPlayground: {
      eyebrow: 'Playground',
      title: 'Variantes do carrossel',
      description:
        'O carrossel e whitelabel, responsivo e pode ser reutilizado em paginas internas do portfolio.',
    },
    technologies: {
      eyebrow: 'Stack',
      title: 'Tecnologias e foco tecnico',
      description:
        'Areas centrais para evoluir produtos web e mobile com arquitetura consistente.',
    },
    architecture: {
      eyebrow: 'Arquitetura',
      title: 'Pronto para evoluir',
      description:
        'Base preparada para receber paginas completas de projetos, experiencia e conteudo.',
      continueEvolution: 'Continuar evolucao',
    },
  },
  skills: {
    groups: {
      frontend: {
        title: 'Frontend',
        items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Acessibilidade'],
      },
      mobile: {
        title: 'Mobile',
        items: ['Flutter', 'Dart', 'UI responsiva', 'Integracoes nativas'],
      },
      backend: {
        title: 'Backend',
        items: ['Node.js', 'APIs REST', 'Autenticacao', 'Bancos relacionais'],
      },
    },
  },
  experience: {
    items: {
      productEngineering: {
        title: 'Engenharia orientada a produto',
        description:
          'Construcao de solucoes digitais com foco em valor de negocio, qualidade e evolucao continua.',
      },
      designSystems: {
        title: 'Design systems whitelabel',
        description:
          'Componentes desacoplados, tokens semanticos e temas adaptaveis para diferentes marcas.',
      },
    },
  },
  projects: {
    items: {
      frontendPlatform: {
        title: 'Frontend - React + TypeScript',
        description: 'Interfaces performaticas, acessiveis e preparadas para escala.',
        imageAlt: 'Interface de uma plataforma frontend com React e TypeScript.',
      },
      mobilePlatform: {
        title: 'Mobile - Flutter + Dart',
        description: 'Experiencias mobile consistentes para Android e iOS.',
        imageAlt: 'Interface mobile construida com Flutter e Dart.',
      },
      backendPlatform: {
        title: 'Backend - Node.js + APIs',
        description: 'APIs confiaveis, integracoes e arquitetura orientada a produto.',
        imageAlt: 'Arquitetura backend conectando APIs e servicos.',
      },
    },
  },
  footer: {
    rights: 'Todos os direitos reservados.',
    backToTop: 'Voltar ao topo',
  },
} as const;

const ingles = {
  common: {
    loading: 'Loading...',
    open: 'Open',
    close: 'Close',
    previous: 'Previous',
    next: 'Next',
    current: 'Current',
  },
  accessibility: {
    mainNavigation: 'Main navigation',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    openGithub: 'Open GitHub',
    openLinkedin: 'Open LinkedIn',
    unavailableEmail: 'Email not registered',
    currentSlide: 'Current slide',
    selectSlide: 'Select slide',
  },
  metadata: {
    title: 'Sergio Costa | Fullstack Web & Mobile Software Engineer',
    description:
      'I turn complex challenges into scalable, accessible and reliable digital products.',
  },
  navigation: {
    projects: 'Projects',
    technologies: 'Technologies',
    experience: 'Experience',
    contact: 'Contact',
  },
  brand: {
    name: 'Sergio Costa',
    initials: 'SC',
    role: 'Fullstack Web & Mobile Software Engineer',
    description:
      'I turn complex challenges into scalable, accessible and reliable digital products.',
    location: 'Paulista - PE | Remote or hybrid in Recife',
    homeLabel: 'Sergio Costa, home',
  },
  hero: {
    eyebrow: 'Hello, I am',
    viewProjects: 'View projects',
    githubLabel: 'GitHub',
    linkedinLabel: 'LinkedIn',
  },
  resume: {
    title: 'Resumes',
    description: 'Choose the language of the resume you want to download.',
    downloadPortuguese: 'Download resume PT',
    downloadEnglish: 'Download resume EN',
    portugueseFileLabel: 'Sergio Costa resume in Portuguese',
    englishFileLabel: 'Sergio Costa resume in English',
  },
  language: {
    label: 'Language',
    portuguese: 'Portuguese',
    english: 'English',
    switchToPortuguese: 'Change language to Portuguese',
    switchToEnglish: 'Change language to English',
  },
  theme: {
    label: 'Select theme',
    light: 'Light',
    dark: 'Dark',
    system: 'System',
    optionLabel: (theme: string) => `Theme ${theme}`,
  },
  carousel: {
    defaultLabel: 'Featured carousel',
    mainLabel: 'Main skills carousel',
    smallLabel: 'Small carousel',
    mediumLabel: 'Medium carousel',
    largeLabel: 'Large carousel',
    empty: 'No slides registered.',
    previousSlide: 'Previous slide',
    nextSlide: 'Next slide',
    pause: 'Pause carousel',
    resume: 'Resume carousel',
    selectSlide: 'Select slide',
    currentSlide: 'Current slide',
    openProject: 'Open project',
    dimensions: (width: number, height: number) => `${width} by ${height}`,
    goToSlide: (slide: number) => `Go to slide ${slide}`,
    slidePosition: (current: number, total: number) => `Slide ${current} of ${total}`,
    items: {
      frontendReactTypescript: {
        alt: 'Abstract interface representing frontend with React and TypeScript',
        title: 'Frontend - React + TypeScript',
        description: 'Accessible, fast and sustainable interface architectures.',
      },
      mobileFlutterDart: {
        alt: 'Abstract mobile screens representing Flutter and Dart',
        title: 'Mobile - Flutter + Dart',
        description:
          'Fluid mobile applications with a consistent cross-platform experience.',
      },
      backendNodeApis: {
        alt: 'Connected nodes representing backend with Node.js and APIs',
        title: 'Backend - Node.js + APIs',
        description: 'Reliable services, integrations and well-defined contracts.',
      },
    },
  },
  sections: {
    carouselPlayground: {
      eyebrow: 'Playground',
      title: 'Carousel variants',
      description:
        'The carousel is whitelabel, responsive and reusable across internal portfolio pages.',
    },
    technologies: {
      eyebrow: 'Stack',
      title: 'Technologies and technical focus',
      description:
        'Core areas for evolving web and mobile products with consistent architecture.',
    },
    architecture: {
      eyebrow: 'Architecture',
      title: 'Ready to evolve',
      description:
        'A foundation ready to receive complete project, experience and content pages.',
      continueEvolution: 'Continue evolution',
    },
  },
  skills: {
    groups: {
      frontend: {
        title: 'Frontend',
        items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Accessibility'],
      },
      mobile: {
        title: 'Mobile',
        items: ['Flutter', 'Dart', 'Responsive UI', 'Native integrations'],
      },
      backend: {
        title: 'Backend',
        items: ['Node.js', 'REST APIs', 'Authentication', 'Relational databases'],
      },
    },
  },
  experience: {
    items: {
      productEngineering: {
        title: 'Product-driven engineering',
        description:
          'Building digital solutions focused on business value, quality and continuous evolution.',
      },
      designSystems: {
        title: 'Whitelabel design systems',
        description:
          'Decoupled components, semantic tokens and adaptable themes for different brands.',
      },
    },
  },
  projects: {
    items: {
      frontendPlatform: {
        title: 'Frontend - React + TypeScript',
        description: 'Performant, accessible interfaces prepared for scale.',
        imageAlt: 'Frontend platform interface with React and TypeScript.',
      },
      mobilePlatform: {
        title: 'Mobile - Flutter + Dart',
        description: 'Consistent mobile experiences for Android and iOS.',
        imageAlt: 'Mobile interface built with Flutter and Dart.',
      },
      backendPlatform: {
        title: 'Backend - Node.js + APIs',
        description: 'Reliable APIs, integrations and product-oriented architecture.',
        imageAlt: 'Backend architecture connecting APIs and services.',
      },
    },
  },
  footer: {
    rights: 'All rights reserved.',
    backToTop: 'Back to top',
  },
} as const satisfies DictionaryShape<typeof portugues>;

export const dicionario = {
  portugues,
  ingles,
} as const;

export type Dicionario = typeof dicionario;
export type Idioma = keyof Dicionario;
export type ConteudoTraduzido = Dicionario[Idioma];
