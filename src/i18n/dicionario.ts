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
  auth: {
    welcomeTitle: 'Bem-vindo ao meu portfolio',
    welcomeSubtitle: 'Engenharia de Software Fullstack Web & Mobile',
    signInWithGoogle: 'Entrar com Google',
    continueAsVisitor: 'Continuar como visitante',
    optionalLogin: 'O login e opcional. Visitantes podem acessar a galeria publica.',
    signOut: 'Sair',
    signIn: 'Entrar',
    missingConfig:
      'Firebase ainda nao foi configurado. Continue como visitante ou configure as variaveis de ambiente.',
    errors: {
      popupClosed: 'Login cancelado antes da conclusao.',
      popupBlocked: 'Popup bloqueado. Vamos tentar redirecionar com seguranca.',
      network: 'Falha de rede ao autenticar. Tente novamente.',
      unauthorizedDomain: 'Dominio nao autorizado no Firebase Authentication.',
      unknown: 'Nao foi possivel autenticar com Google.',
    },
  },
  admin: {
    insertProjects: 'Inserir projetos',
    accessDeniedTitle: 'Acesso negado',
    accessDeniedDescription: 'Esta area e restrita ao administrador autorizado.',
    checkingAccess: 'Verificando permissao administrativa...',
    form: {
      title: 'Cadastrar projeto de estudo',
      description: 'Publique estudos com dados estruturados e ate tres imagens.',
      preview: 'Preview',
      fields: {
        id: 'ID do projeto',
        repository: 'Repositorio',
        projectTitle: 'Titulo',
        projectDescription: 'Descricao',
        focus: 'Foco do estudo',
        technologies: 'Tecnologias',
        category: 'Categoria',
        kind: 'Tipo',
        startedAt: 'Inicio',
        completedAt: 'Conclusao',
        date: 'Data de referencia',
        githubUrl: 'URL do GitHub',
        portfolioEligible: 'Exibir na galeria publica',
        images: 'Imagens do projeto',
        imageAlt: 'Texto alternativo',
      },
      helpers: {
        id: 'Use apenas letras minusculas, numeros e hifens.',
        technologies: 'Digite uma tecnologia e pressione Enter.',
        images: 'Adicione de uma a tres imagens PNG, JPG ou WebP ate 5 MB.',
      },
      actions: {
        publish: 'Publicar projeto',
        publishing: 'Publicando...',
        removeImage: 'Remover imagem',
        moveImageLeft: 'Mover imagem para esquerda',
        moveImageRight: 'Mover imagem para direita',
        confirmLeave: 'Existem alteracoes nao salvas. Deseja sair?',
      },
      errors: {
        required: 'Campo obrigatorio.',
        invalidSlug: 'Use um slug seguro, como meu-projeto.',
        invalidGithub: 'Informe uma URL valida do GitHub.',
        duplicateId: 'Ja existe um projeto com esse ID.',
        imageRequired: 'Adicione pelo menos uma imagem.',
        imageLimit: 'Cada projeto aceita no maximo tres imagens.',
        imageType: 'Use apenas PNG, JPG ou WebP.',
        imageSize: 'Cada imagem deve ter no maximo 5 MB.',
        saveFailed: 'Nao foi possivel salvar o projeto.',
      },
      success: 'Projeto publicado com sucesso.',
      cover: 'Capa',
      uploadProgress: (current: number, total: number) =>
        `Enviando imagem ${current} de ${total}`,
    },
  },
  studyGallery: {
    eyebrow: 'Estudos',
    title: 'Galeria de estudos',
    description:
      'Projetos publicados diretamente do Firebase para acompanhar estudos e experimentos.',
    loading: 'Carregando estudos...',
    empty: 'Nenhum estudo publicado ainda.',
    error: 'Nao foi possivel carregar a galeria.',
    retry: 'Tentar novamente',
    github: 'Abrir no GitHub',
    focus: 'Foco',
    category: 'Categoria',
    kind: 'Tipo',
    period: 'Periodo',
    imageAltFallback: (title: string) => `Imagem do estudo ${title}`,
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
  auth: {
    welcomeTitle: 'Welcome to my portfolio',
    welcomeSubtitle: 'Fullstack Web & Mobile Software Engineering',
    signInWithGoogle: 'Sign in with Google',
    continueAsVisitor: 'Continue as visitor',
    optionalLogin: 'Login is optional. Visitors can access the public gallery.',
    signOut: 'Sign out',
    signIn: 'Sign in',
    missingConfig:
      'Firebase has not been configured yet. Continue as visitor or configure the environment variables.',
    errors: {
      popupClosed: 'Login was cancelled before completion.',
      popupBlocked: 'Popup was blocked. We will try a safe redirect.',
      network: 'Network error while authenticating. Try again.',
      unauthorizedDomain: 'Domain is not authorized in Firebase Authentication.',
      unknown: 'Google authentication could not be completed.',
    },
  },
  admin: {
    insertProjects: 'Insert projects',
    accessDeniedTitle: 'Access denied',
    accessDeniedDescription: 'This area is restricted to the authorized administrator.',
    checkingAccess: 'Checking administrative permission...',
    form: {
      title: 'Create study project',
      description: 'Publish studies with structured data and up to three images.',
      preview: 'Preview',
      fields: {
        id: 'Project ID',
        repository: 'Repository',
        projectTitle: 'Title',
        projectDescription: 'Description',
        focus: 'Study focus',
        technologies: 'Technologies',
        category: 'Category',
        kind: 'Type',
        startedAt: 'Started at',
        completedAt: 'Completed at',
        date: 'Reference date',
        githubUrl: 'GitHub URL',
        portfolioEligible: 'Show in public gallery',
        images: 'Project images',
        imageAlt: 'Alternative text',
      },
      helpers: {
        id: 'Use lowercase letters, numbers and hyphens only.',
        technologies: 'Type a technology and press Enter.',
        images: 'Add one to three PNG, JPG or WebP images up to 5 MB.',
      },
      actions: {
        publish: 'Publish project',
        publishing: 'Publishing...',
        removeImage: 'Remove image',
        moveImageLeft: 'Move image left',
        moveImageRight: 'Move image right',
        confirmLeave: 'There are unsaved changes. Do you want to leave?',
      },
      errors: {
        required: 'Required field.',
        invalidSlug: 'Use a safe slug, like my-project.',
        invalidGithub: 'Enter a valid GitHub URL.',
        duplicateId: 'A project with this ID already exists.',
        imageRequired: 'Add at least one image.',
        imageLimit: 'Each project accepts at most three images.',
        imageType: 'Use only PNG, JPG or WebP.',
        imageSize: 'Each image must be 5 MB or less.',
        saveFailed: 'The project could not be saved.',
      },
      success: 'Project published successfully.',
      cover: 'Cover',
      uploadProgress: (current: number, total: number) =>
        `Uploading image ${current} of ${total}`,
    },
  },
  studyGallery: {
    eyebrow: 'Studies',
    title: 'Study gallery',
    description:
      'Projects published directly from Firebase to follow studies and experiments.',
    loading: 'Loading studies...',
    empty: 'No studies have been published yet.',
    error: 'The gallery could not be loaded.',
    retry: 'Try again',
    github: 'Open on GitHub',
    focus: 'Focus',
    category: 'Category',
    kind: 'Type',
    period: 'Period',
    imageAltFallback: (title: string) => `Study image for ${title}`,
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
