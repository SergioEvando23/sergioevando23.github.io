# Sergio Costa Portfolio

Portfolio profissional de Sergio Costa em Next.js, com arquitetura whitelabel,
temas Light/Dark/System e textos centralizados em um dicionario macro bilingue.

## Stack

- Next.js com App Router
- React e TypeScript em modo estrito
- Tailwind CSS v4 com CSS Variables
- `next-themes` para temas
- Material UI Icons com imports individuais
- Vitest, React Testing Library e Playwright
- ESLint, Prettier e npm

## Execucao

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
npm run test:run
npm run test:e2e
npm run validate:i18n
npm run validate
```

## Estrutura

```text
src/
  app/                 Layout, pagina inicial e tokens globais
  components/ui/       Componentes reutilizaveis
  components/theme/    ThemeProvider e ThemeSwitcher
  components/language/ LanguageProvider e LanguageSwitcher
  components/layout/   Header e Footer
  components/carousel/ Carousel acessivel e responsivo
  config/              Marca, navegacao, curriculos e tema
  data/                Dados tecnicos com translationKey
  i18n/                Dicionario macro, config e validacao
  hooks/               Hooks compartilhados
  types/               Tipos de dominio
e2e/                   Testes Playwright
public/documents/      Curriculos em PDF
```

## Internacionalizacao

A fonte unica de textos e `src/i18n/dicionario.ts`:

```ts
dicionario.portugues;
dicionario.ingles;
```

Nenhum texto pode ser adicionado somente a um idioma. Toda alteracao deve ser
realizada simultaneamente em `dicionario.portugues` e `dicionario.ingles`.

As estruturas devem manter as mesmas chaves, profundidade, arrays e funcoes. A
paridade e verificada por TypeScript e em runtime:

```bash
npm run validate:i18n
```

Use textos nos componentes assim:

```tsx
const { textos } = useLanguage();

return <h1>{textos.brand.role}</h1>;
```

Conteudos dinamicos usam `translationKey` nos dados tecnicos e a traducao no
dicionario, evitando duplicar objetos completos.

## Idioma

O `LanguageProvider` usa a prioridade:

1. Preferencia salva em `sergio-portfolio-language`.
2. Idioma do navegador.
3. Portugues como fallback.

Idiomas iniciados por `pt` usam `portugues`; os demais usam `ingles`. A troca PT
ou EN acontece no Header sem reload, persiste no navegador e atualiza
`document.documentElement.lang` para `pt-BR` ou `en`.

## Curriculos

Os dois arquivos ficam sempre disponiveis, em qualquer idioma:

- `public/documents/CurriculoSergioCosta.pdf`
- `public/documents/SergioCostaResume.pdf`

Os caminhos sao centralizados em `src/config/curriculos.ts`. Os labels dos links
vem de `textos.resume.downloadPortuguese` e
`textos.resume.downloadEnglish`.

## Whitelabel E Temas

- Marca e URLs: `src/config/brand.ts`
- Navegacao: `src/config/navigation.ts`
- Tokens visuais: `src/app/globals.css`
- Temas Light/Dark/System: `src/components/theme`

Altere identidade visual pelos tokens CSS e pelos arquivos de configuracao, sem
colocar cores de marca diretamente no JSX.

## Carousel

O carousel e interno, responsivo, acessivel, suporta teclado, swipe, controles,
indicadores, autoplay opcional, pausa em hover/foco e `prefers-reduced-motion`.

```tsx
<Carousel items={items} size="small" />
<Carousel items={items} size="medium" />
<Carousel items={items} size="large" autoPlay loop />
```

Cadastre slides tecnicos em `src/data/carousel.ts` e traducoes em
`dicionario.*.carousel.items`.

## Material UI Icons

Use apenas imports individuais:

```tsx
import GitHubIcon from '@mui/icons-material/GitHub';
```

Os icones herdam `currentColor`; a estilizacao permanece em Tailwind CSS e CSS
Variables.

## Testes

- Dicionario: paridade, funcoes, arrays e strings vazias.
- Idioma: fallback, navegador, persistencia, `lang` e troca sem reload.
- UI: LanguageSwitcher, ThemeSwitcher, Button, IconButton e Carousel.
- Integracao: Header, Hero, secoes, Footer, curriculos e preservacao de slide.
- E2E: idioma, tema, carrossel, curriculos e overflow mobile.

Antes do primeiro E2E em uma maquina nova:

```bash
npx playwright install chromium
```

## Proximos Passos

- Expandir paginas internas de projetos e experiencia.
- Adicionar conteudo real de portfolio com `translationKey`.
- Integrar CI executando `npm run validate` e `npm run test:e2e`.
