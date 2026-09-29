export const formationDictionary = {
  portugues: {
    title: 'Formação',
    academicTitle: 'Formação acadêmica',
    certificatesTitle: 'Certificados',
    certificateFilterLabel: 'Filtrar certificados',
    profileSource: 'LinkedIn',
    listedOnProfile: 'Certificação listada no perfil',
    certificateDescription: 'Formação complementar registrada no export do perfil profissional.',
    registeredCertificate: 'Certificado registrado',
    filters: { all: 'Todos', frontend: 'Frontend', mobile: 'Mobile', architecture: 'Arquitetura' },
    academic: [
      { title: 'Engenharia de Software', institution: 'Estácio', period: 'Out. 2025 — Set. 2029', description: 'Bacharelado em Engenharia de Software, conectando fundamentos de computação e sistemas à prática profissional.', tags: ['Engenharia de Software', 'Arquitetura', 'Banco de Dados', 'Desenvolvimento de Sistemas'], status: 'Em andamento', active: true },
      { title: 'Desenvolvimento Web Full Stack', institution: 'Trybe', period: 'Out. 2021 — Out. 2022', description: 'Formação intensiva em desenvolvimento web full stack, com projetos práticos e foco em empregabilidade no mercado de tecnologia.', tags: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Banco de Dados'], status: 'Concluído', active: false },
    ],
    certificates: [
      { title: 'Javascript com Testing Driven Development', category: 'frontend', tags: ['JavaScript', 'Testes', 'Frontend'] },
      { title: 'Inteligência artificial do zero ao avançado', category: 'architecture', tags: ['IA', 'Arquitetura', 'Automação'] },
      { title: 'Módulo - Desenvolvimento web back-end', category: 'backend', tags: ['Node.js', 'Backend', 'APIs'] },
      { title: 'Módulo - Fundamentos do Desenvolvimento Web', category: 'frontend', tags: ['HTML', 'CSS', 'JavaScript'] },
    ],
  },
  ingles: {
    title: 'Education',
    academicTitle: 'Academic education',
    certificatesTitle: 'Certificates',
    certificateFilterLabel: 'Filter certificates',
    profileSource: 'LinkedIn',
    listedOnProfile: 'Certification listed on profile',
    certificateDescription: 'Complementary education recorded in the professional profile export.',
    registeredCertificate: 'Certificate registered',
    filters: { all: 'All', frontend: 'Frontend', mobile: 'Mobile', architecture: 'Architecture' },
    academic: [
      { title: 'Software Engineering', institution: 'Estácio', period: 'Oct. 2025 — Sep. 2029', description: 'Bachelor’s degree in Software Engineering, connecting computer systems foundations to professional practice.', tags: ['Software Engineering', 'Architecture', 'Databases', 'Systems Development'], status: 'In progress', active: true },
      { title: 'Full Stack Web Development', institution: 'Trybe', period: 'Oct. 2021 — Oct. 2022', description: 'Intensive full stack web development program with hands-on projects and a focus on employability in the technology market.', tags: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Databases'], status: 'Completed', active: false },
    ],
    certificates: [
      { title: 'Javascript with Testing Driven Development', category: 'frontend', tags: ['JavaScript', 'Testing', 'Frontend'] },
      { title: 'Artificial intelligence from zero to advanced', category: 'architecture', tags: ['AI', 'Architecture', 'Automation'] },
      { title: 'Module - Back-end web development', category: 'backend', tags: ['Node.js', 'Backend', 'APIs'] },
      { title: 'Module - Web Development Fundamentals', category: 'frontend', tags: ['HTML', 'CSS', 'JavaScript'] },
    ],
  },
} as const;
