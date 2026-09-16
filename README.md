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
npm run test:rules
npm run validate:i18n
npm run validate
```

## Estrutura

```text
src/
  app/                 Layout, pagina inicial e tokens globais
  components/ui/       Componentes reutilizaveis
  components/theme/    ThemeProvider e ThemeSwitcher
  components/auth/     AuthProvider e tela de entrada
  components/language/ LanguageProvider e LanguageSwitcher
  components/layout/   Header e Footer
  components/admin/    Formulario administrativo de estudos
  components/gallery/  Galeria publica alimentada pelo Firebase
  components/carousel/ Carousel acessivel e responsivo
  config/              Marca, navegacao, curriculos e tema
  data/                Dados tecnicos com translationKey
  i18n/                Dicionario macro, config e validacao
  hooks/               Hooks compartilhados
  types/               Tipos de dominio
e2e/                   Testes Playwright
public/documents/      Curriculos em PDF
```

## Firebase

O codigo local esta pronto para Firebase, mas o projeto precisa ser criado no
Firebase Console.

1. Crie um projeto no Firebase Console.
2. Registre um aplicativo Web.
3. Copie as credenciais para `.env.local`, seguindo `.env.example`.
4. Ative Authentication com Google como unico provedor.
5. Adicione os dominios autorizados em Authentication > Settings.
6. Crie Firestore Database em modo production.
7. Crie Firebase Storage.
8. Instale/autentique a CLI: `firebase login`.
9. Copie `.firebaserc.example` para `.firebaserc` e ajuste o project id.
10. Publique regras e indices:

```bash
firebase deploy --only firestore:rules,firestore:indexes,storage
```

Variaveis esperadas:

```text
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
```

Nunca versione `.env.local`, service accounts, chaves privadas ou tokens.

### Emuladores

O projeto inclui `firebase.json`, `firestore.rules`, `storage.rules` e
`firestore.indexes.json`.

```bash
firebase emulators:start --only auth,firestore,storage
npm run test:rules
```

O Emulator Suite exige Java instalado e disponivel no `PATH`.

### Bootstrap Do Administrador

Somente `sergioevandocosta@gmail.com` pode ser administrador. A autorizacao
segura exige:

- usuario autenticado pelo Firebase;
- `emailVerified === true`;
- email autenticado igual a `sergioevandocosta@gmail.com`;
- documento `admins/{uid}` existente;
- `active === true`;
- email do documento igual ao email autenticado.

Crie o primeiro documento `admins/{uid}` manualmente pelo Console ou por script
administrativo local fora do bundle client. Nunca permita que o cliente crie ou
edite `admins`.

```json
{
  "email": "sergioevandocosta@gmail.com",
  "active": true,
  "createdAt": "<server timestamp>"
}
```

## Entrada, Auth E Admin

Na primeira visita, `WelcomeGate` renderiza uma tela exclusiva antes do
portfolio. O usuario pode entrar com Google ou continuar como visitante. A
escolha local fica em `sergio-portfolio-entry-choice` e nao substitui a sessao
Firebase.

Visitantes acessam o portfolio e a Galeria de estudos. O Header permite login
posterior. A opcao `Inserir projetos` aparece somente depois que a autorizacao
administrativa via Firestore termina com sucesso.

## Cadastro De Estudos

A rota protegida `/admin/projects/new` renderiza um formulario Material UI para:

- dados estruturados do estudo;
- tecnologias como chips;
- validacao de slug e URL do GitHub;
- preview de card;
- uma a tres imagens;
- capa como primeira imagem;
- remocao e reordenacao antes do envio;
- upload em `study-projects/{projectId}/{imageId}.{extension}`;
- rollback de imagens se a gravacao Firestore falhar.

## Galeria De Estudos

A secao publica `Galeria de estudos` consome `studyProjects` do Firestore e lista
somente documentos com `portfolioEligible === true`, ordenados pelos mais
recentes. Estados de loading, vazio, erro e retry sao traduzidos em PT/EN.

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
- Auth: tela de entrada, visitante e erro de Firebase ausente.
- Admin: formulario, validacao, imagens, capa e limite de tres arquivos.
- Galeria: loading/vazio sem Firebase configurado.
- Regras: leitura publica, escrita admin e bloqueio de `admins`.
- E2E: entrada, visitante, idioma, tema, carrossel, curriculos e overflow mobile.

Antes do primeiro E2E em uma maquina nova:

```bash
npx playwright install chromium
```

## Proximos Passos

- Expandir paginas internas de projetos e experiencia.
- Adicionar conteudo real de portfolio com `translationKey`.
- Integrar CI executando `npm run validate` e `npm run test:e2e`.
