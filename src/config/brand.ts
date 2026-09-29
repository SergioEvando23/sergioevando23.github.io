import { dictionary } from '@/i18n';
import type { BrandConfig } from '@/types/brand';

export const brandConfig: BrandConfig = {
  name: dictionary.portuguese.brand.name,
  initials: dictionary.portuguese.brand.initials,
  role: dictionary.portuguese.brand.role,
  description: dictionary.portuguese.brand.description,
  location: dictionary.portuguese.brand.location,
  email: '',
  socialLinks: {
    github: 'https://github.com/SérgioEvando23',
    linkedin: 'https://www.linkedin.com/in/Sérgiocosta23/',
  },
};
