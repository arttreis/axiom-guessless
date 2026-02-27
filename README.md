# Axiom — Geração de Conteúdo para Redes Sociais com IA

> Descubra o arquétipo da sua marca e gere conteúdo autêntico para Instagram, LinkedIn, Twitter/X e YouTube — baseado nos 12 arquétipos de marca de Carl Jung.

Axiom é um SaaS de geração de conteúdo para redes sociais que combina psicologia de marca com inteligência artificial. Parte da família de produtos Synkra (Atlas · **Axiom** · Apex).

---

## Funcionalidades

- **12 Arquétipos de Marca** — Análise profunda da personalidade da sua marca baseada nos arquétipos de Carl Jung (O Herói, O Mago, O Criador, O Governante, e mais 8)
- **Onboarding inteligente** — 5 blocos de perguntas estratégicas para mapear identidade, mercado, público e branding
- **Análise com IA** — Claude API analisa as respostas e identifica os arquétipos dominantes com scores de 0–100
- **Geração de conteúdo** — Gere posts, carrosséis, threads, artigos e vídeos alinhados ao arquétipo da marca
- **Multi-plataforma** — Conteúdo otimizado para Instagram, LinkedIn, Twitter/X e YouTube
- **Relatório de Marca** — Dashboard com perfil de arquétipo, análise estratégica e identidade visual
- **Exportação CSV** — Download automático das respostas do onboarding ao concluir
- **Planos por assinatura** — Starter, Pro e Agency com integração Stripe completa

---

## Stack Tecnológica

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 18 + Vite + TypeScript |
| Estilização | Tailwind CSS v3 (design system custom) |
| Auth + DB | Supabase (PostgreSQL + RLS + Auth) |
| Pagamentos | Stripe (Checkout + Portal + Webhooks) |
| IA | Anthropic Claude API (claude-sonnet-4-20250514) |
| Estado global | Zustand |
| Roteamento | React Router v6 |
| Fontes | Syne (display) + DM Sans (body) |
| Deploy | Vercel |

---

## Estrutura do Projeto

```
src/
├── lib/                    # Clientes de API
│   ├── supabase.ts         # Cliente Supabase
│   ├── stripe.ts           # Helpers Stripe (checkout, portal, planos)
│   └── anthropic.ts        # analyzeArchetypes(), generatePost()
├── store/                  # Estado global (Zustand)
│   ├── authStore.ts        # user, profile, session
│   └── onboardingStore.ts  # steps, answers, archetypeResult
├── types/
│   └── index.ts            # Interfaces TypeScript globais
├── constants/
│   ├── archetypes.ts       # 12 arquétipos com cor, ícone, descrição
│   ├── onboarding.ts       # 5 blocos de perguntas
│   └── samplePosts.ts      # 12 posts de exemplo para novos usuários
├── hooks/
│   ├── useAuth.ts          # Listener de sessão Supabase
│   ├── useOnboarding.ts    # Fetch onboarding + resultado de arquétipos
│   └── usePosts.ts         # CRUD de posts + insert de exemplos
├── pages/
│   ├── Landing.tsx         # Landing page com hero, features, pricing
│   ├── Checkout.tsx        # Criação de conta + seletor de plano
│   ├── Onboarding.tsx      # 5 blocos de perguntas + análise IA
│   ├── Dashboard.tsx       # Relatório de marca + arquétipos
│   └── Content.tsx         # Geração e listagem de posts
├── components/
│   ├── layout/             # Sidebar, Navbar, DashboardLayout
│   ├── landing/            # Hero, Features, ArchetypesPreview, Pricing, CtaFinal
│   ├── onboarding/         # ProgressBar, QuestionBlock
│   ├── dashboard/          # ArchetypeHero, ArchetypeGrid, BrandProfile
│   ├── content/            # PostCard, PostFilter, PostStats, ContentGenerator
│   ├── ProtectedRoute.tsx  # Proteção de rotas autenticadas
│   └── Toast.tsx           # Sistema de notificações (sem dependências externas)
└── index.css               # Design system completo (850+ linhas CSS)

supabase/
└── migrations/
    └── 001_initial.sql     # Schema: profiles, onboarding_responses, posts, archetype_results
```

---

## Fluxo de Navegação

```
/ (Landing Page)
  └─→ /checkout            # Seleção de plano + criação de conta Supabase + Stripe Checkout
        └─→ /onboarding    # 5 blocos de perguntas → análise IA → exportação CSV
              └─→ /dashboard          # Relatório de marca (arquétipos, perfil, análise IA)
              └─→ /dashboard/content  # Geração e listagem de posts
```

**Proteção de rotas:**
- `/onboarding`, `/dashboard`, `/dashboard/content` requerem autenticação
- Usuário sem onboarding concluído → redirecionado para `/onboarding`
- Usuário não autenticado → redirecionado para `/checkout`

---

## Banco de Dados

### Tabelas

| Tabela | Descrição |
|--------|-----------|
| `profiles` | Extensão de `auth.users` com plano, Stripe IDs e status |
| `onboarding_responses` | Respostas dos 5 blocos do onboarding por usuário |
| `posts` | Posts gerados (plataforma, tipo, arquétipo, status, likes) |
| `archetype_results` | Scores dos 12 arquétipos + análise textual da IA |

### Row Level Security (RLS)

Todas as tabelas possuem RLS ativo. Cada usuário acessa apenas seus próprios dados via `auth.uid() = user_id`.

### Trigger automático

Ao criar conta no Supabase Auth, um trigger insere automaticamente um registro em `profiles` com nome e email do usuário.

---

## Integração com IA (Claude API)

### `analyzeArchetypes(responses)`

Chamada ao final do onboarding. Envia as respostas dos 5 blocos para o Claude e recebe:
- Scores individuais (0–100) para cada um dos 12 arquétipos
- Arquétipo principal e secundário
- Análise textual da identidade da marca (3–4 frases)

### `generatePost(prompt, brandContext, primaryArchetype)`

Chamada na página de Conteúdo. Usa o contexto da marca (arquétipo, tom de voz, público, diferencial) para gerar:
- Título e texto completo do post (pronto para publicar)
- Plataforma e tipo sugeridos
- Hashtags relevantes
- Dica de uso

---

## Integração Stripe

### Planos

| Plano | Preço | Posts | Plataformas |
|-------|-------|-------|-------------|
| Starter | R$97/mês | 30/mês | 2 |
| Pro | R$197/mês | 100/mês | Todas |
| Agency | R$497/mês | Ilimitados | Todas + Multi-marca |

### Fluxo

1. Usuário cria conta no Supabase Auth
2. Redireciona para Stripe Checkout com 7 dias de trial
3. Webhook `checkout.session.completed` → atualiza `profiles` com IDs e plano
4. Botão "Gerenciar assinatura" → Stripe Customer Portal

### Webhook (Supabase Edge Function)

Criar a edge function `stripe-webhook` para processar:
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`

---

## Design System

Identidade visual **dark mode vibrante** com gradientes e energia:

```css
/* Gradiente principal */
background: linear-gradient(135deg, #FF6B35, #FF922B, #FFD43B);

/* Gradiente espectro (hero, destaques) */
background: linear-gradient(135deg, #FF6B35 0%, #CC5DE8 50%, #4D96FF 100%);
```

**Paleta:**
- Primária: `#FF6B35` (laranja) / `#FF922B` (âmbar) / `#FFD43B` (amarelo)
- Acentos: `#CC5DE8` (roxo) / `#4D96FF` (azul) / `#1A936F` (verde)
- Backgrounds: `#0A0A0F` → `#111118` → `#1A1A24` → `#242433`

**Tipografia:**
- Display/Títulos: `Syne 700/800`
- Corpo/Interface: `DM Sans 300/400/500`

> Nenhuma biblioteca de UI externa (sem shadcn, MUI, Radix). Todos os componentes construídos do zero com Tailwind + CSS custom.

---

## Estado Atual do Projeto

> **Modo demo ativo.** O projeto roda com dados fictícios para apresentação. Todas as integrações reais (Supabase, Stripe, Claude API) estão mockadas.
>
> Para ativar o modo real, siga o guia de setup abaixo e defina `VITE_STATIC_MODE=false`.

### O que está pronto
- [x] UI/UX completa (Landing, Checkout, Onboarding, Dashboard, Content)
- [x] Design system (Tailwind CSS, fontes, cores)
- [x] Schema do banco de dados com RLS
- [x] Lógica de IA (arquétipos + geração de posts)
- [x] Build sem erros (`npm run typecheck` ✅, `npm run build` ✅)

### O que ainda precisa ser implementado (modo real)
- [ ] Ativar cliente real do Supabase em `src/lib/supabase.ts`
- [ ] Implementar Stripe Checkout real em `src/lib/stripe.ts`
- [ ] Implementar listener de auth em `src/hooks/useAuth.ts`
- [ ] Persistir dados no banco (`src/hooks/useOnboarding.ts`, `src/hooks/usePosts.ts`)
- [ ] Criar Edge Functions (`supabase/functions/stripe-webhook`, `stripe-portal`)
- [ ] Conectar `src/pages/Checkout.tsx` ao Supabase Auth real

---

## Como Rodar Localmente

### Pré-requisitos

- Node.js 18+
- [Supabase CLI](https://supabase.com/docs/guides/cli/getting-started) instalado
- Conta no [Supabase](https://app.supabase.com) (plano free funciona)
- Conta no [Stripe](https://dashboard.stripe.com) (modo teste)
- Chave API na [Anthropic](https://console.anthropic.com)

### Instalação

```bash
# 1. Instalar dependências
npm install

# 2. Copiar e preencher variáveis de ambiente
cp .env.example .env
# Edite o .env com suas chaves (ver seção abaixo)
```

### Variáveis de Ambiente

```env
# Modo de operação
# true  = demo/apresentação (sem Supabase/Stripe)
# false = produção (integrações reais ativas)
VITE_STATIC_MODE=false

# Supabase → app.supabase.com → seu projeto → Settings → API
VITE_SUPABASE_URL=https://xxxx.supabase.co   # "Project URL"
VITE_SUPABASE_ANON_KEY=eyJ...                # "anon public"

# Stripe → dashboard.stripe.com → Developers → API Keys
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...      # "Publishable key"
VITE_STRIPE_PRICE_STARTER=price_...          # Price ID do plano Starter
VITE_STRIPE_PRICE_PRO=price_...              # Price ID do plano Pro
VITE_STRIPE_PRICE_AGENCY=price_...           # Price ID do plano Agency

# Anthropic → console.anthropic.com → API Keys
VITE_ANTHROPIC_API_KEY=sk-ant-...

# URL da aplicação
VITE_APP_URL=http://localhost:5173
```

### Passo a passo: criar produtos no Stripe

1. Acesse **dashboard.stripe.com → Products → Add product**
2. Crie os 3 produtos abaixo (cobrança recorrente mensal):

| Nome | Preço | Copiar campo |
|------|-------|-------------|
| Starter | R$ 97/mês | `VITE_STRIPE_PRICE_STARTER` |
| Pro | R$ 197/mês | `VITE_STRIPE_PRICE_PRO` |
| Agency | R$ 497/mês | `VITE_STRIPE_PRICE_AGENCY` |

3. Em cada produto, clique no **Price** criado e copie o **Price ID** (`price_xxxx`) para o `.env`

> Use sempre chaves de **teste** (`pk_test_`, `price_test_`) durante o desenvolvimento. Substitua pelas de produção somente no deploy final.

### Banco de Dados

```bash
# Aplicar migrations no Supabase
npx supabase db push
```

### Edge Functions (Stripe Webhook)

Para processar pagamentos, crie as edge functions no Supabase:

```bash
# Criar as funções
npx supabase functions new stripe-webhook
npx supabase functions new stripe-portal

# Configurar secrets (obter no Stripe → Developers → API Keys)
npx supabase secrets set STRIPE_SECRET_KEY=sk_test_...
npx supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...

# Deploy das funções
npx supabase functions deploy stripe-webhook
npx supabase functions deploy stripe-portal
```

**Criar o webhook no Stripe:**

1. Acesse **Stripe → Developers → Webhooks → Add endpoint**
2. URL: `https://xxxx.supabase.co/functions/v1/stripe-webhook`
3. Eventos: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
4. Copie o **Signing secret** (`whsec_...`) e configure em `STRIPE_WEBHOOK_SECRET`

### Desenvolvimento

```bash
npm run dev          # Servidor de desenvolvimento (localhost:5173)
npm run build        # Build de produção
npm run preview      # Preview do build localmente
npm run typecheck    # Verificar tipos TypeScript
npm run lint         # Verificar linting
```

---

## Deploy (Vercel)

```bash
vercel deploy
```

Configure as variáveis de ambiente no dashboard da Vercel. O projeto está configurado para deploy automático com Vite.

---

## Decisões de Arquitetura

| Decisão | Escolha | Motivo |
|---------|---------|--------|
| Sem bibliotecas de UI | CSS custom + Tailwind | Controle total sobre identidade visual única |
| Toast próprio | `Toast.tsx` sem libs | Zero dependências externas, simples e eficiente |
| Zustand vs Context | Zustand | Menos boilerplate, melhor DX, reativo |
| RLS no Supabase | Sempre ativo | Segurança por padrão, isolamento total por usuário |
| Code splitting | `manualChunks` no Vite | Chunks vendor/supabase/stripe/zustand separados |
| Análise IA única | Feita 1x no onboarding | Resultado salvo em `archetype_results`, nunca repetido |
| 12 posts de exemplo | Inseridos na 1ª visita | Verifica `count > 0` antes de inserir, idempotente |

---

## Próximos Passos

- [ ] Criar Supabase Edge Function `stripe-webhook`
- [ ] Criar Supabase Edge Function `stripe-portal`
- [ ] Configurar webhook no Stripe Dashboard
- [ ] Adicionar testes unitários (hooks e lib functions)
- [ ] Implementar visualização completa de posts (modal de detalhes)
- [ ] Adicionar agendamento real de posts
- [ ] Dashboard de analytics (engajamento real via APIs sociais)

---

## Família de Produtos Synkra

| Produto | Descrição |
|---------|-----------|
| **Atlas** | — |
| **Axiom** | Geração de conteúdo com IA por arquétipos de marca |
| **Apex** | — |

---

*Construído com Synkra AIOS — AI-Orchestrated System for Full Stack Development*
