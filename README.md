# Sérgio Costa Portfolio

Portfólio profissional de Sérgio Costa, criado com arquitetura whitelabel para evoluir páginas, componentes e identidade visual sem acoplar dados pessoais ao JSX.

## Stack

- Next.js com App Router
- React e TypeScript em modo estrito
- Tailwind CSS v4 com CSS Variables
- `next-themes` para Light, Dark e System
- Material UI Icons com imports individuais
- Vitest, React Testing Library e Playwright
- ESLint e Prettier
- npm

## Requisitos

- Node.js 22 ou superior
- npm 10 ou superior

## Instalação e execução

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
npm run test
npm run test:run
npm run test:coverage
npm run test:e2e
npm run format
npm run format:check
npm run validate
```

## Estrutura

```text
src/
  app/                 Layout, página inicial e tokens globais
  components/ui/       Button, IconButton, Container, SectionHeading e Tag
  components/theme/    ThemeProvider, ThemeSwitcher e hidratação
  components/layout/   Header e Footer
  components/carousel/ Carousel, slides, controles e indicadores
  config/              Marca, navegação e tokens estruturais
  data/                Dados mockados de slides, skills e experiência
  hooks/               useCarousel, useMounted e useMediaQuery
  lib/                 Utilitários compartilhados
  types/               Tipos públicos dos domínios
e2e/                   Testes Playwright
public/images/         Assets locais
```

## Whitelabel

- Dados da marca: `src/config/brand.ts`
- Navegação: `src/config/navigation.ts`
- Tamanhos do carousel e storage key: `src/config/theme.ts`
- Tokens visuais: `src/app/globals.css`

Para trocar a identidade, altere `brandConfig` e os tokens CSS sem editar os componentes.

## Temas

Os temas Light, Dark e System usam `next-themes` com `attribute="class"`, `defaultTheme="system"`, `enableSystem` e storage key explícita. A preferência é persistida no navegador e aplicada no `<html>`.

Os tokens principais estão em `:root` e `.dark` dentro de `src/app/globals.css`.

## Carousel

O carousel é interno, reutilizável, responsivo, acessível, usa `next/image`, suporta controles, indicadores, teclado, swipe, autoplay opcional, pausa em hover/foco e `prefers-reduced-motion`.

Exemplos:

```tsx
<Carousel items={items} size="small" />
<Carousel items={items} size="medium" />
<Carousel items={items} size="large" autoPlay loop />
```

Cadastre slides em `src/data/carousel.ts`.

## Material UI Icons

Os ícones são importados individualmente de `@mui/icons-material`, por exemplo:

```tsx
import GitHubIcon from '@mui/icons-material/GitHub';
```

A estilização continua em Tailwind CSS e CSS Variables; os ícones herdam `currentColor`.

## Testes

- Unitários: Vitest + React Testing Library
- E2E: Playwright em desktop e mobile
- Cobertura inclui Button, IconButton, ThemeSwitcher e Carousel

Antes do primeiro E2E em uma máquina nova:

```bash
npx playwright install chromium
```

## Próximos passos

- Cadastrar currículo real em `public/`
- Criar páginas internas de projetos e experiência
- Integrar conteúdo real do portfólio
- Adicionar CI para executar `npm run validate` e `npm run test:e2e`
