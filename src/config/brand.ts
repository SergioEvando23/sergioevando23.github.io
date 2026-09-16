import { dicionario } from '@/i18n/dicionario';
import type { BrandConfig } from '@/types/brand';

export const brandConfig: BrandConfig = {
  name: dicionario.portugues.brand.name,
  initials: dicionario.portugues.brand.initials,
  role: dicionario.portugues.brand.role,
  description: dicionario.portugues.brand.description,
  location: dicionario.portugues.brand.location,
  email: '',
  socialLinks: {
    github: 'https://github.com/SergioEvando23',
    linkedin: 'https://www.linkedin.com/in/sergiocosta23/',
  },
};
