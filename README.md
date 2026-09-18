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

## Deploy No GitHub Pages

O portfolio e publicado como exportacao estatica do Next.js. O repositorio de
usuario `SergioEvando23.github.io` deve servir os assets a partir da raiz `/`,
sem `basePath` e sem `assetPrefix`.

O GitHub Pages deve usar Actions:

```text
Repository -> Settings -> Pages -> Build and deployment -> Source -> GitHub Actions
```

Nao deixe `Deploy from a branch` apontando para `main /(root)`. Essa configuracao
faz o Pages processar os arquivos-fonte com Jekyll e pode renderizar o
`README.md` no lugar da aplicacao.

O workflow `.github/workflows/deploy-pages.yml` executa:

```text
checkout -> setup Node -> configure Pages -> npm ci -> validacoes -> npm run build
-> valida out/index.html e out/_next/static -> cria out/.nojekyll
-> upload de out -> deploy oficial do Pages
```

Somente a pasta `out` e enviada como artefato. A raiz do repositorio, `.next`,
`node_modules` e `README.md` nao sao publicados.

### Variaveis Do Firebase No GitHub Actions

Cadastre as configuracoes publicas do Firebase Web em:

```text
Repository -> Settings -> Secrets and variables -> Actions -> Variables
```

Variaveis obrigatorias:

```text
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
```

Variavel opcional para sobrescrever a URL REST do Realtime Database usada pela
Galeria de estudos:

```text
NEXT_PUBLIC_FIREBASE_DATABASE_URL
NEXT_PUBLIC_GITHUB_OWNER
NEXT_PUBLIC_GITHUB_REPO
```

Esses valores `NEXT_PUBLIC_*` sao incorporados ao bundle estatico durante o
`npm run build`. O workflow falha cedo se algum nome estiver ausente e nao imprime
valores no log. Use Secrets somente se houver uma politica interna exigindo isso.

No Firebase Authentication, autorize tambem o dominio:

```text
sergioevando23.github.io
```

### Validacao Local Do Export

```bash
npm ci
npm run validate:i18n
npm run typecheck
npm run lint
npm run test:run
npm run build
```

Depois do build:

```bash
test -f out/index.html
test -d out/_next/static
```

Sirva `out` com um servidor HTTP estatico para validar a aplicacao renderizada,
em vez de abrir arquivos com `file://`. A pasta exportada deve conter
`index.html`, `_next/static`, `documents/` com os curriculos e as imagens
publicas usadas no portfolio.

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
  components/study/    Administracao CRUD da Galeria de estudos
  components/chat/     Sergio AI, interface de chatbot integrada ao n8n
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

A rota publica `/study` e a secao `Galeria de estudos` consomem o Realtime
Database via REST:

```text
GET https://sergioevando23-default-rtdb.firebaseio.com/study.json
```

A aplicacao normaliza o objeto retornado, lista somente registros com
`portfolioEligible === true` e ordena pelos mais recentes. Escritas REST em
`/study/{id}.json` devem enviar `?auth=FIREBASE_ID_TOKEN`; a galeria publica usa
apenas leitura. Estados de loading, vazio, erro e retry sao traduzidos em PT/EN.

## Administracao Da Galeria

A rota `/study/admin` permite ao administrador criar, editar e excluir estudos no
Realtime Database:

```text
GET    /study.json
GET    /study/{id}.json
PUT    /study/{id}.json?auth=FIREBASE_ID_TOKEN
PATCH  /study/{id}.json?auth=FIREBASE_ID_TOKEN
DELETE /study/{id}.json?auth=FIREBASE_ID_TOKEN
```

A interface exige login Google pelo Firebase e libera a administracao somente
para `sergioevandocosta@gmail.com` com e-mail verificado. A seguranca definitiva
continua nas regras do Firebase.

As imagens nao usam Firebase Storage. Durante a sessao administrativa, informe
um fine-grained GitHub Personal Access Token com permissao minima
`Contents: Read and write` apenas para `SergioEvando23/sergioevando23.github.io`.
O token fica somente em memoria, e e apagado ao sair/recarregar. Ele nao e
salvo no Firebase, localStorage, sessionStorage, GitHub Actions ou codigo-fonte.

Os uploads usam GitHub Contents API e gravam arquivos em:

```text
public/images/studies/{id}/cover.webp
public/images/studies/{id}/01.webp
public/images/studies/{id}/02.webp
```

O Firebase armazena apenas caminhos publicos, como:

```json
{
  "coverImage": "/images/studies/shopping-cart/cover.webp",
  "images": ["/images/studies/shopping-cart/cover.webp"]
}
```

As regras locais do Realtime Database ficam em `database.rules.json` e sao
referenciadas por `firebase.json`. Para publicar regras apos revisao:

```bash
firebase deploy --only database
```

## Sergio AI

O portfolio inclui o `Sergio AI`, um chatbot profissional exibido como botao
flutuante depois da tela de entrada. A interface usa os tokens, temas e o
dicionario PT/EN existentes. O frontend gerencia apenas UI, historico visual,
`sessionId`, idioma ativo e chamada HTTP para o webhook.

A integracao esperada e:

```text
Portfolio -> Chat UI -> chatService -> Webhook n8n -> Workflow n8n -> IA -> Portfolio
```

Configure o endpoint publico do webhook no ambiente:

```env
NEXT_PUBLIC_N8N_CHAT_WEBHOOK_URL=
```

Nao coloque `OPENAI_API_KEY`, tokens do n8n, chaves privadas ou credenciais no
frontend. O navegador deve conhecer somente o webhook criado para receber as
mensagens do portfolio.

Payload enviado ao n8n:

```json
{
  "message": "Qual experiencia Sergio possui com React?",
  "sessionId": "uuid-da-conversa",
  "language": "pt-BR",
  "source": "portfolio"
}
```

Resposta inicial esperada:

```json
{
  "answer": "Sergio possui experiencia profissional com React e TypeScript..."
}
```

O contrato TypeScript ja permite evoluir a resposta com `sources`, `suggestions`
e `actions`, mantendo a UI preparada para RAG, bases vetoriais, Firebase,
GitHub, curriculos e links contextuais sem reconstruir a interface.

### Workflow Sugerido No n8n

```text
Webhook
-> Validate Input
-> Normalize Language
-> Rate Limit / Security
-> Retrieve Professional Context
-> AI Agent
-> Format Response
-> Respond to Webhook
```

O agente deve responder apenas sobre informacoes profissionais publicas de
Sergio. Quando a base nao tiver informacao suficiente, deve informar isso de
forma clara e sugerir curriculo, projetos, GitHub ou LinkedIn quando fizer
sentido. O prompt do agente tambem deve bloquear tentativas de extrair system
prompt, credenciais, estrutura interna ou dados privados.

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
