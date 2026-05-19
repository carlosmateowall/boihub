# BoiHub — O Super App do Pecuarista Brasileiro

> Conecta produtores rurais com veterinários, motoristas de frete e revendas agropecuárias.

**Acesse em produção:** [boihub.com.br](https://boihub.com.br)

---

## Visão Geral

O BoiHub é um super app mobile-first para o agronegócio bovino brasileiro. Desenvolvido em Next.js 15 com App Router, integração nativa com Supabase e deploy automático na Vercel.

**Módulos:**
- **Dashboard** — Visão geral do rebanho, alertas e stats do perfil
- **Fretes** — Solicitar transporte de gado, histórico e acompanhamento
- **Saúde Animal** — Produtos veterinários, dosagens e teleconsultas
- **Loja** — Revendas e fabricantes de insumos agropecuários
- **Suplementos** — Minerais, proteinados e premix por categoria
- **Perfil** — Dados da propriedade, rebanho e conta

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 15 (App Router, Server Components) |
| Linguagem | TypeScript |
| Estilo | Tailwind CSS v4 |
| UI | shadcn/ui + Radix UI |
| Backend | Supabase (Auth + PostgreSQL + RLS) |
| Ícones | Lucide React |
| Deploy | Vercel (auto-deploy via GitHub) |

---

## Setup Local

### 1. Clone e instale

```bash
git clone https://github.com/carlosmateowall/boihub.git
cd boihub
npm install
```

### 2. Variáveis de ambiente

Crie `.env.local` na raiz:

```env
NEXT_PUBLIC_SUPABASE_URL=https://SEU_PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_aqui
```

### 3. Banco de dados

Execute no **SQL Editor do Supabase** (em ordem):
1. O schema das tabelas (criado direto no dashboard ou via CLI)
2. `supabase/seed.sql` — seed data com vets, motoristas, lojas e suplementos

### 4. Rodar em desenvolvimento

```bash
npm run dev
```

Acesse `http://localhost:3000`

---

## Arquitetura

```
src/
├── app/
│   ├── (app)/           # Rotas protegidas (dashboard, fretes, saude, loja...)
│   ├── (auth)/          # Login e cadastro
│   └── onboarding/      # Primeiro acesso
├── components/
│   ├── auth/            # Formulários de login, cadastro, editar perfil
│   ├── dashboard/       # Cards de KPI e resumo por tipo de perfil
│   ├── fretes/          # FreteCard, FreteForm
│   ├── layout/          # Navbar, Sidebar, MobileNav
│   ├── loja/            # LojaCard, SuplementoCard
│   ├── saude/           # ProdutoCard, VeterinarioCard, SaudeClient
│   ├── shared/          # Badge, EmptyState, Rating, SearchBar
│   └── ui/              # Button, Card, Input (shadcn/ui)
├── hooks/               # useProfile, useUser
├── lib/
│   ├── supabase/        # client.ts (client-side) + server.ts (SSR)
│   ├── constants.ts     # Labels, ícones e configurações globais
│   └── utils.ts         # formatCurrency, formatDate, cn()
├── middleware.ts         # Proteção de rotas via Supabase SSR
└── types/
    └── database.ts      # Tipos TypeScript para todas as tabelas
```

---

## Deploy

Deploy automático na Vercel a cada push na branch `main`.

Variáveis necessárias na Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## Licença

Todos os direitos reservados. © 2026 BoiHub.
