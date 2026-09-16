import { globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier';

const eslintConfig = [
  ...nextVitals,
  ...nextTypescript,
  prettier,
  {
    rules: {
      '@next/next/no-html-link-for-pages': 'off',
    },
  },
  globalIgnores([
    '.next/**',
    'node_modules/**',
    'coverage/**',
    'playwright-report/**',
    'test-results/**',
    'AppData/**',
    'Documents/**',
    'Downloads/**',
    'OneDrive/**',
    'trash_tmp/**',
    'portifolio_DS/**',
    'portifolio-ds-tmp/**',
    'next_and_tailwind_poc/**',
  ]),
];

export default eslintConfig;
