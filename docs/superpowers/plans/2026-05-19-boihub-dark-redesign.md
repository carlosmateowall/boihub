# Boi Hub Dark Visual Redesign — Plano de Implementação

> **Para agentes:** SUB-SKILL OBRIGATÓRIO: Use `superpowers:subagent-driven-development` (recomendado) ou `superpowers:executing-plans` para implementar este plano tarefa por tarefa. As etapas usam sintaxe de checkbox (`- [ ]`) para rastreamento.

**Objetivo:** Substituir o tema claro do Boi Hub por uma identidade visual escura (preto absoluto + verde `#4ade80` + efeitos glass), aplicada em todo o sistema.

**Arquitetura:** Token overhaul no `globals.css` como base (resolve ~80% automaticamente), seguido de criação do `AnimatedHero` do 21st.dev, redesign dos componentes-chave (Sidebar, Navbar, MobileNav, Button, Card) e reescrita da landing page. Auth e onboarding ganham glass card centralizado.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS v4, framer-motion (novo), Radix UI, shadcn/ui customizado.

---

## Estrutura de Arquivos

| Arquivo | Ação |
|---|---|
| `src/app/globals.css` | Modificar — token overhaul |
| `src/components/ui/button.tsx` | Modificar — add variante `glass`, atualizar `primary`/`secondary`/`tertiary` |
| `src/components/ui/card.tsx` | Modificar — add `border border-border` no variant `default` |
| `src/components/ui/animated-hero-section-1.tsx` | Criar — componente AnimatedHero do 21st.dev |
| `src/components/layout/Sidebar.tsx` | Modificar — redesign dark |
| `src/components/layout/Navbar.tsx` | Modificar — borda dark |
| `src/components/layout/MobileNav.tsx` | Modificar — cores dark |
| `src/app/page.tsx` | Modificar — redesign completo da landing |
| `src/app/(auth)/layout.tsx` | Modificar — glass card centralizado |
| `src/app/onboarding/page.tsx` | Modificar — glass card |
| `src/components/fretes/FreteCard.tsx` | Modificar — divider `border-border` |
| `src/components/loja/LojaCard.tsx` | Modificar — divider `border-border` |
| `src/components/loja/SuplementoCard.tsx` | Modificar — divider `border-border` |
| `src/components/saude/VeterinarioCard.tsx` | Modificar — divider `border-border` |
| `src/components/saude/ProdutoCard.tsx` | Modificar — divider `border-border`, input dark |

---

## Task 1: Instalar framer-motion

**Arquivos:**
- Modificar: `package.json` (via npm)

- [ ] **Passo 1: Instalar dependência**

```bash
cd "C:\Projects\Boi Hub" && npm install framer-motion
```

Saída esperada: `added 1 package` (ou similar) sem erros.

- [ ] **Passo 2: Verificar que aparece no package.json**

```bash
grep "framer-motion" "C:\Projects\Boi Hub\package.json"
```

Saída esperada: `"framer-motion": "^X.X.X"` na seção `dependencies`.

- [ ] **Passo 3: Commit**

```bash
cd "C:\Projects\Boi Hub" && git add package.json package-lock.json && git commit -m "feat: install framer-motion for AnimatedHero"
```

---

## Task 2: Token Overhaul — globals.css

**Arquivos:**
- Modificar: `src/app/globals.css`

O arquivo tem dois blocos de tokens: `@theme {}` (gera classes Tailwind como `bg-canvas`, `text-ink`) e `:root {}` (variáveis CSS brutas para `var(--canvas)`). Ambos devem ser atualizados.

**Mapeamento de valores:**
- `--canvas`: `#ffffff` → `#0d0d0d` (cards/superfícies elevadas)
- `--canvas-soft`: `#e8ebe6` → `#050505` (fundo base da página)
- `--ink`: `#0e0f0c` → `#ffffff` (texto principal)
- `--primary`: `#9fe870` → `#4ade80` (verde mais vibrante)
- `--body`: `#454745` → `rgba(255,255,255,0.65)` (texto secundário)
- `--mute`: `#868685` → `rgba(255,255,255,0.35)` (texto mudo/placeholders)
- `--positive`: `#2ead4b` → `#4ade80` (usa o mesmo verde)
- `--positive-deep`: `#054d28` → `#22c55e`
- `--negative`: `#d03238` → `#f87171`
- Novos tokens: `--border: rgba(255,255,255,0.08)`, `--border-strong: rgba(255,255,255,0.18)`

- [ ] **Passo 1: Substituir globals.css**

Reescrever `src/app/globals.css` com o conteúdo abaixo (manter todas as classes de tipografia `.display-*`, `.body-*`, `.caption` intactas — só os blocos `@theme` e `:root` mudam):

```css
@import "tailwindcss";

@theme {
  /* Brand */
  --color-primary: #4ade80;
  --color-primary-hover: #22c55e;
  --color-primary-neutral: #166534;
  --color-primary-pale: rgba(74,222,128,0.12);

  /* Surfaces */
  --color-canvas: #0d0d0d;
  --color-canvas-soft: #050505;

  /* Text */
  --color-ink: #ffffff;
  --color-ink-deep: #f0f0f0;
  --color-body: rgba(255,255,255,0.65);
  --color-mute: rgba(255,255,255,0.35);

  /* Borders (novos) */
  --color-border: rgba(255,255,255,0.08);
  --color-border-strong: rgba(255,255,255,0.18);

  /* Semantic */
  --color-positive: #4ade80;
  --color-positive-deep: #22c55e;
  --color-warning: #facc15;
  --color-warning-deep: #d97706;
  --color-warning-content: #fef3c7;
  --color-negative: #f87171;
  --color-negative-deep: #ef4444;

  /* Illustrative accents */
  --color-accent-orange: #ffc091;
  --color-accent-cyan: #38c8ff;

  /* Border radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-pill: 9999px;

  /* Fonts */
  --font-display: 'Manrope', sans-serif;
  --font-body: 'Inter', sans-serif;
}

:root {
  --primary: #4ade80;
  --primary-hover: #22c55e;
  --primary-neutral: #166534;
  --primary-pale: rgba(74,222,128,0.12);
  --canvas: #0d0d0d;
  --canvas-soft: #050505;
  --ink: #ffffff;
  --ink-deep: #f0f0f0;
  --body: rgba(255,255,255,0.65);
  --mute: rgba(255,255,255,0.35);
  --border: rgba(255,255,255,0.08);
  --border-strong: rgba(255,255,255,0.18);
  --positive: #4ade80;
  --positive-deep: #22c55e;
  --warning: #facc15;
  --warning-deep: #d97706;
  --warning-content: #fef3c7;
  --negative: #f87171;
  --negative-deep: #ef4444;
  --accent-orange: #ffc091;
  --accent-cyan: #38c8ff;
}

* {
  box-sizing: border-box;
}

html {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  background-color: var(--canvas-soft);
  color: var(--ink);
  font-family: var(--font-body);
}

/* Typography utility classes — não alterar */
.display-mega {
  font-family: var(--font-display);
  font-size: 96px;
  font-weight: 800;
  line-height: 0.85;
}

.display-xl {
  font-family: var(--font-display);
  font-size: 64px;
  font-weight: 800;
  line-height: 0.9;
}

.display-md {
  font-family: var(--font-display);
  font-size: 40px;
  font-weight: 800;
  line-height: 0.9;
}

.display-sm {
  font-family: var(--font-body);
  font-size: 32px;
  font-weight: 600;
  line-height: 1.2;
}

.display-xs {
  font-family: var(--font-body);
  font-size: 24px;
  font-weight: 600;
  line-height: 1.3;
}

.body-lg {
  font-family: var(--font-body);
  font-size: 20px;
  font-weight: 400;
  line-height: 1.5;
}

.body-md {
  font-family: var(--font-body);
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
}

.body-sm {
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 400;
  line-height: 1.43;
}

.caption {
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 400;
  line-height: 1.33;
}
```

- [ ] **Passo 2: Verificar compilação TypeScript**

```bash
cd "C:\Projects\Boi Hub" && npx tsc --noEmit
```

Saída esperada: nenhum erro. Se houver, são erros pré-existentes — registrar, não resolver agora.

- [ ] **Passo 3: Verificar no browser**

Com `npm run dev` rodando, abrir `http://localhost:3000`. A landing page deve estar com fundo preto, texto branco, links verdes. Não precisa estar perfeita — as páginas internas são confirmação suficiente de que os tokens funcionam.

- [ ] **Passo 4: Commit**

```bash
cd "C:\Projects\Boi Hub" && git add src/app/globals.css && git commit -m "feat: dark token overhaul — jet black + green #4ade80"
```

---

## Task 3: Atualizar Button e Card

**Arquivos:**
- Modificar: `src/components/ui/button.tsx`
- Modificar: `src/components/ui/card.tsx`

### Button

Adicionar variante `glass`. Atualizar `primary` para usar `text-black` (contraste no fundo escuro). Atualizar `secondary` e `tertiary` para ficarem coerentes no dark.

- [ ] **Passo 1: Substituir buttonVariants em `src/components/ui/button.tsx`**

```tsx
'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:   'bg-primary text-black rounded-xl hover:bg-primary-hover',
        secondary: 'bg-canvas text-ink rounded-xl border border-border hover:bg-white/10',
        tertiary:  'bg-transparent text-ink rounded-xl border border-border-strong hover:bg-white/10',
        ghost:     'text-ink rounded-xl hover:bg-white/5',
        glass:     'bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl hover:bg-white/20',
        danger:    'bg-negative text-white rounded-xl hover:bg-negative-deep',
      },
      size: {
        sm:   'px-4 py-2 text-sm',
        md:   'px-6 py-3 text-base',
        lg:   'px-8 py-4 text-lg',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
```

### Card

Adicionar `border border-border` ao variant `default`. Atualizar `dark` para glass card.

- [ ] **Passo 2: Atualizar cardVariants em `src/components/ui/card.tsx`**

Substituir apenas o objeto `variants` dentro de `cva`:

```tsx
const cardVariants = cva('rounded-xl', {
  variants: {
    variant: {
      default: 'bg-canvas border border-border',
      sage:    'bg-canvas-soft border border-border',
      dark:    'bg-white/5 border border-white/10',
    },
    padding: {
      none: '',
      sm:   'p-4',
      md:   'p-6',
      lg:   'p-8',
    },
  },
  defaultVariants: {
    variant: 'default',
    padding: 'md',
  },
})
```

- [ ] **Passo 3: Checar TypeScript**

```bash
cd "C:\Projects\Boi Hub" && npx tsc --noEmit
```

Saída esperada: sem novos erros.

- [ ] **Passo 4: Commit**

```bash
cd "C:\Projects\Boi Hub" && git add src/components/ui/button.tsx src/components/ui/card.tsx && git commit -m "feat: add glass button variant, update card dark borders"
```

---

## Task 4: Criar AnimatedHero

**Arquivos:**
- Criar: `src/components/ui/animated-hero-section-1.tsx`

Baseado no prompt do 21st.dev, com duas adaptações: (1) adicionar `'use client'` pois usa framer-motion; (2) substituir `text-primary-foreground` (token shadcn inexistente aqui) por `text-white`.

- [ ] **Passo 1: Criar `src/components/ui/animated-hero-section-1.tsx`**

```tsx
'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface NavLink {
  label: string
  href: string
}

interface AnimatedHeroProps {
  backgroundImageUrl: string
  logo: React.ReactNode
  navLinks: NavLink[]
  topRightAction?: React.ReactNode
  title: string
  description: string
  ctaButton: {
    text: string
    onClick: () => void
  }
  secondaryCta?: {
    text: string
    onClick: () => void
  }
  className?: string
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
}

export const AnimatedHero = ({
  backgroundImageUrl,
  logo,
  navLinks,
  topRightAction,
  title,
  description,
  ctaButton,
  secondaryCta,
  className,
}: AnimatedHeroProps) => {
  return (
    <div
      className={cn(
        'relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden',
        className
      )}
    >
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImageUrl})` }}
      >
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="absolute top-0 z-20 flex h-20 w-full items-center justify-between px-6 md:px-12"
      >
        <div className="flex items-center gap-2">{logo}</div>
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-white/70 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="hidden md:block">{topRightAction}</div>
      </motion.header>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-start justify-center text-left px-6 md:px-12 max-w-4xl w-full"
      >
        <motion.h1
          variants={itemVariants}
          className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
        >
          {title}
        </motion.h1>
        <motion.p
          variants={itemVariants}
          className="mt-6 max-w-2xl text-lg leading-8 text-white/75"
        >
          {description}
        </motion.p>
        <motion.div
          variants={itemVariants}
          className="mt-10 flex items-center gap-x-4"
        >
          <Button onClick={ctaButton.onClick} size="lg" variant="glass">
            {ctaButton.text}
          </Button>
          {secondaryCta && (
            <Button onClick={secondaryCta.onClick} size="lg" variant="glass">
              {secondaryCta.text}
            </Button>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}
```

- [ ] **Passo 2: Checar TypeScript**

```bash
cd "C:\Projects\Boi Hub" && npx tsc --noEmit
```

Saída esperada: sem erros relacionados a `animated-hero-section-1`.

- [ ] **Passo 3: Commit**

```bash
cd "C:\Projects\Boi Hub" && git add src/components/ui/animated-hero-section-1.tsx && git commit -m "feat: add AnimatedHero component from 21st.dev"
```

---

## Task 5: Redesign Sidebar + Navbar + MobileNav

**Arquivos:**
- Modificar: `src/components/layout/Sidebar.tsx`
- Modificar: `src/components/layout/Navbar.tsx`
- Modificar: `src/components/layout/MobileNav.tsx`

### Sidebar

- [ ] **Passo 1: Substituir `src/components/layout/Sidebar.tsx`**

```tsx
'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Truck, HeartPulse, ShoppingBag, Package, User, LogOut
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { useMemo } from 'react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/fretes', label: 'Fretes', icon: Truck },
  { href: '/saude', label: 'Saúde Animal', icon: HeartPulse },
  { href: '/loja', label: 'Loja', icon: ShoppingBag },
  { href: '/suplementos', label: 'Suplementos', icon: Package },
  { href: '/perfil', label: 'Perfil', icon: User },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.refresh()
    router.push('/login')
  }

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-canvas border-r border-border min-h-screen p-6 gap-8">
      <Link href="/dashboard" className="flex items-center gap-1">
        <span className="font-display font-extrabold text-2xl text-ink">Boi</span>
        <span className="font-display font-extrabold text-2xl text-primary">Hub</span>
      </Link>

      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(item => {
          const active = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-colors',
                active
                  ? 'bg-primary-pale text-primary border-l-2 border-primary pl-3'
                  : 'text-mute hover:bg-white/5 hover:text-ink'
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" strokeWidth={1.5} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-mute hover:bg-white/5 hover:text-ink transition-colors"
      >
        <LogOut className="h-5 w-5" strokeWidth={1.5} />
        Sair
      </button>
    </aside>
  )
}
```

### Navbar

- [ ] **Passo 2: Substituir `src/components/layout/Navbar.tsx`**

```tsx
import Link from 'next/link'
import { Bell } from 'lucide-react'

interface NavbarProps {
  title?: string
}

export function Navbar({ title }: NavbarProps) {
  return (
    <header className="lg:hidden bg-canvas sticky top-0 z-40 flex items-center justify-between px-4 py-4 border-b border-border">
      <Link href="/dashboard" className="flex items-center gap-1">
        <span className="font-display font-extrabold text-xl text-ink">Boi</span>
        <span className="font-display font-extrabold text-xl text-primary">Hub</span>
      </Link>
      {title && <p className="text-sm font-semibold text-mute">{title}</p>}
      <button className="relative p-2 rounded-xl hover:bg-white/5 transition-colors">
        <Bell className="h-5 w-5 text-ink" strokeWidth={1.5} />
      </button>
    </header>
  )
}
```

### MobileNav

- [ ] **Passo 3: Substituir `src/components/layout/MobileNav.tsx`**

```tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Truck, HeartPulse, ShoppingBag, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Início', icon: LayoutDashboard },
  { href: '/fretes', label: 'Fretes', icon: Truck },
  { href: '/saude', label: 'Saúde', icon: HeartPulse },
  { href: '/loja', label: 'Loja', icon: ShoppingBag },
  { href: '/perfil', label: 'Perfil', icon: User },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-canvas border-t border-border">
      <div className="flex items-center justify-around py-2 px-4">
        {navItems.map(item => {
          const active = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors min-w-0',
                active ? 'text-primary' : 'text-mute hover:text-ink'
              )}
            >
              <div className={cn('p-1.5 rounded-xl', active && 'bg-primary-pale')}>
                <item.icon className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <span className="text-xs font-semibold truncate">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
```

- [ ] **Passo 4: Checar TypeScript**

```bash
cd "C:\Projects\Boi Hub" && npx tsc --noEmit
```

- [ ] **Passo 5: Commit**

```bash
cd "C:\Projects\Boi Hub" && git add src/components/layout/Sidebar.tsx src/components/layout/Navbar.tsx src/components/layout/MobileNav.tsx && git commit -m "feat: dark redesign for Sidebar, Navbar and MobileNav"
```

---

## Task 6: Redesign completo da Landing Page

**Arquivos:**
- Modificar: `src/app/page.tsx`

A landing page usa `AnimatedHero` para o hero. Como o AnimatedHero usa `onClick` para os CTAs, a página precisa de `'use client'` para usar `useRouter`.

- [ ] **Passo 1: Substituir `src/app/page.tsx` completamente**

```tsx
'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AnimatedHero } from '@/components/ui/animated-hero-section-1'
import { Button } from '@/components/ui/button'
import {
  Truck, Stethoscope, ShoppingBag, Package, Tractor, Factory, Star, Users
} from 'lucide-react'

const stats = [
  { label: 'Produtores', value: '2.400+' },
  { label: 'Fretes realizados', value: '18.000+' },
  { label: 'Veterinários', value: '340+' },
  { label: 'Lojas parceiras', value: '120+' },
]

const features = [
  {
    icon: Truck,
    title: 'Fretes bovinos',
    desc: 'Encontre motoristas especializados em transporte de gado na sua região com preços competitivos.',
  },
  {
    icon: Stethoscope,
    title: 'Veterinários online',
    desc: 'Consultas com especialistas em bovinos de corte e leite sem sair da fazenda.',
  },
  {
    icon: ShoppingBag,
    title: 'Marketplace agro',
    desc: 'Revendas e fabricantes de insumos direto no seu celular, com entrega na fazenda.',
  },
  {
    icon: Package,
    title: 'Suplementação',
    desc: 'Catálogo completo de suplementos minerais, proteinados e energéticos com comparação de preços.',
  },
  {
    icon: Tractor,
    title: 'Saúde animal',
    desc: 'Vacinas, antiparasitários e antibióticos com calculadora de dosagem integrada.',
  },
  {
    icon: Star,
    title: 'Avaliações',
    desc: 'Sistema de reputação para produtores, motoristas e veterinários — confiança em cada transação.',
  },
]

const perfis = [
  { icon: Tractor, label: 'Produtor Rural', desc: 'Gerencie sua fazenda, contrate fretes e compre insumos.' },
  { icon: Stethoscope, label: 'Veterinário', desc: 'Ofereça consultas online e presenciais para produtores.' },
  { icon: Truck, label: 'Motorista', desc: 'Encontre fretes de gado e aumente sua rota.' },
  { icon: ShoppingBag, label: 'Revenda', desc: 'Venda seus produtos para produtores rurais.' },
  { icon: Factory, label: 'Fabricante', desc: 'Distribua seus insumos diretamente ao produtor.' },
]

const navLinks = [
  { label: 'Fretes', href: '#features' },
  { label: 'Veterinários', href: '#features' },
  { label: 'Loja', href: '#features' },
  { label: 'Saúde Animal', href: '#features' },
]

export default function LandingPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-canvas-soft">
      <AnimatedHero
        backgroundImageUrl="https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=1600&auto=format&fit=crop&q=80"
        logo={
          <Link href="/" className="flex items-center gap-1">
            <span className="font-display font-extrabold text-2xl text-white">Boi</span>
            <span className="font-display font-extrabold text-2xl text-primary">Hub</span>
          </Link>
        }
        navLinks={navLinks}
        topRightAction={
          <Button variant="glass" size="sm" asChild>
            <Link href="/login">Entrar</Link>
          </Button>
        }
        title="Sua fazenda na palma da mão."
        description="O super app do pecuarista brasileiro. Fretes, veterinários, insumos e muito mais — tudo em um só lugar."
        ctaButton={{
          text: 'Começar grátis',
          onClick: () => router.push('/cadastro'),
        }}
        secondaryCta={{
          text: 'Já tenho conta',
          onClick: () => router.push('/login'),
        }}
      />

      {/* Stats */}
      <section className="bg-canvas border-b border-border px-6 lg:px-16 py-10">
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map(s => (
            <div key={s.label} className="flex flex-col gap-1">
              <p className="display-md text-primary">{s.value}</p>
              <p className="body-sm text-mute">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 lg:px-16 py-20 bg-canvas-soft">
        <div className="max-w-5xl mx-auto flex flex-col gap-12">
          <div className="text-center">
            <h2 className="display-md text-ink">Tudo que sua fazenda precisa</h2>
            <p className="body-lg text-mute mt-4 max-w-xl mx-auto">
              Do frete ao veterinário, do insumo ao suplemento — o BoiHub centraliza o agronegócio bovino.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(f => (
              <div
                key={f.title}
                className="bg-canvas border border-border rounded-xl p-6 flex flex-col gap-4"
              >
                <f.icon className="h-8 w-8 text-primary" strokeWidth={1.5} />
                <div>
                  <p className="font-semibold text-lg text-ink">{f.title}</p>
                  <p className="text-sm text-mute mt-1 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Perfis */}
      <section className="px-6 lg:px-16 py-20 bg-canvas">
        <div className="max-w-5xl mx-auto flex flex-col gap-12">
          <div className="text-center">
            <h2 className="display-md text-ink">Para quem é o BoiHub?</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {perfis.map(p => (
              <div
                key={p.label}
                className="bg-canvas-soft border border-border rounded-xl p-6 flex flex-col gap-3"
              >
                <p.icon className="h-8 w-8 text-primary" strokeWidth={1.5} />
                <div>
                  <p className="font-semibold text-ink">{p.label}</p>
                  <p className="text-sm text-mute mt-1">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-canvas-soft border-t border-border px-6 lg:px-16 py-20">
        <div className="max-w-3xl mx-auto text-center flex flex-col gap-8">
          <h2 className="display-md text-primary">Pronto para modernizar sua operação?</h2>
          <p className="body-lg text-mute">
            Junte-se a mais de 2.400 produtores rurais que já usam o BoiHub para gerir sua pecuária com mais eficiência.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="lg" asChild>
              <Link href="/cadastro">Criar conta grátis</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-canvas border-t border-border px-6 lg:px-16 py-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1">
            <span className="font-display font-extrabold text-xl text-ink">Boi</span>
            <span className="font-display font-extrabold text-xl text-primary">Hub</span>
          </div>
          <p className="text-sm text-mute">© 2026 BoiHub. Todos os direitos reservados.</p>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-primary" />
            <span className="text-sm text-mute">boihub.com.br</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
```

- [ ] **Passo 2: Checar TypeScript**

```bash
cd "C:\Projects\Boi Hub" && npx tsc --noEmit
```

- [ ] **Passo 3: Verificar no browser — `http://localhost:3000`**

Confirmar:
- Hero com foto de gado ao fundo, overlay preto, animação de entrada
- Nav com links brancos
- Título "Sua fazenda na palma da mão." em branco, grande
- Dois botões glass
- Seção de stats com números em verde
- Grid de features com cards pretos bordejados
- Seção perfis
- CTA e footer escuros

- [ ] **Passo 4: Commit**

```bash
cd "C:\Projects\Boi Hub" && git add src/app/page.tsx && git commit -m "feat: landing page redesign with AnimatedHero dark theme"
```

---

## Task 7: Redesign Auth Layout e Onboarding

**Arquivos:**
- Modificar: `src/app/(auth)/layout.tsx`
- Modificar: `src/app/onboarding/page.tsx`

### Auth Layout

Envolver o conteúdo filho em um glass card centralizado. Remover o header separado — logo vai para dentro do card.

- [ ] **Passo 1: Substituir `src/app/(auth)/layout.tsx`**

```tsx
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-canvas-soft flex items-center justify-center p-6">
      <div className="w-full max-w-md flex flex-col gap-6">
        <div className="flex justify-center">
          <Link href="/" className="flex items-center gap-1">
            <span className="font-display font-extrabold text-2xl text-ink">Boi</span>
            <span className="font-display font-extrabold text-2xl text-primary">Hub</span>
          </Link>
        </div>
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
          {children}
        </div>
      </div>
    </div>
  )
}
```

### Onboarding

- [ ] **Passo 2: Substituir `src/app/onboarding/page.tsx`**

```tsx
import { OnboardingForm } from '@/components/auth/OnboardingForm'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Bem-vindo ao BoiHub' }

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-canvas-soft flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
        <OnboardingForm />
      </div>
    </div>
  )
}
```

- [ ] **Passo 3: Checar TypeScript**

```bash
cd "C:\Projects\Boi Hub" && npx tsc --noEmit
```

- [ ] **Passo 4: Verificar no browser — `http://localhost:3000/login`**

Confirmar: fundo preto, logo acima do card, card glass (borda branca sutil, fundo levemente translúcido), formulário dentro.

- [ ] **Passo 5: Commit**

```bash
cd "C:\Projects\Boi Hub" && git add src/app/(auth)/layout.tsx src/app/onboarding/page.tsx && git commit -m "feat: dark glass card for auth layout and onboarding"
```

---

## Task 8: Atualizar Dividers nos Cards Internos

**Arquivos:**
- Modificar: `src/components/fretes/FreteCard.tsx`
- Modificar: `src/components/loja/LojaCard.tsx`
- Modificar: `src/components/loja/SuplementoCard.tsx`
- Modificar: `src/components/saude/VeterinarioCard.tsx`
- Modificar: `src/components/saude/ProdutoCard.tsx`

Após o token remap, `border-canvas-soft` = borda de `#050505` sobre `bg-canvas` (`#0d0d0d`) — contraste quase nulo. Trocar por `border-border` (`rgba(255,255,255,0.08)`) que é visível no escuro. Fazer substituição global em cada arquivo.

- [ ] **Passo 1: FreteCard — trocar `border-canvas-soft` por `border-border`**

Em `src/components/fretes/FreteCard.tsx`, linha 43:
```tsx
// antes
<div className="flex items-center justify-between pt-1 border-t border-canvas-soft">
// depois
<div className="flex items-center justify-between pt-1 border-t border-border">
```

- [ ] **Passo 2: LojaCard — trocar `border-canvas-soft` e `bg-canvas-soft`**

Em `src/components/loja/LojaCard.tsx`:

Linha 44 (category tags):
```tsx
// antes
<span key={c} className="text-xs bg-canvas-soft text-mute px-2 py-1 rounded-md">
// depois
<span key={c} className="text-xs bg-white/5 text-mute px-2 py-1 rounded-md">
```

Linha 55 (divider):
```tsx
// antes
<div className="pt-2 border-t border-canvas-soft flex gap-2">
// depois
<div className="pt-2 border-t border-border flex gap-2">
```

- [ ] **Passo 3: SuplementoCard — trocar divider e peso tag**

Em `src/components/loja/SuplementoCard.tsx`:

Linha 24 (divider):
```tsx
// antes
<div className="flex items-center justify-between pt-2 border-t border-canvas-soft">
// depois
<div className="flex items-center justify-between pt-2 border-t border-border">
```

Linha 36 (peso tag):
```tsx
// antes
<span className="text-xs bg-canvas-soft text-mute px-2 py-1 rounded-md">
// depois
<span className="text-xs bg-white/5 text-mute px-2 py-1 rounded-md">
```

- [ ] **Passo 4: VeterinarioCard — trocar divider**

Em `src/components/saude/VeterinarioCard.tsx`, linha 42:
```tsx
// antes
<div className="flex items-center justify-between pt-3 border-t border-canvas-soft">
// depois
<div className="flex items-center justify-between pt-3 border-t border-border">
```

- [ ] **Passo 5: ProdutoCard — trocar divider, input e bg tag**

Em `src/components/saude/ProdutoCard.tsx`:

Linha 63 (divider):
```tsx
// antes
<div className="flex items-center justify-between pt-2 border-t border-canvas-soft">
// depois
<div className="flex items-center justify-between pt-2 border-t border-border">
```

Linha 88 (input):
```tsx
// antes
className="flex-1 bg-canvas-soft text-ink rounded-md px-3 py-2 text-sm border border-canvas-soft focus:outline-none focus:ring-2 focus:ring-primary"
// depois
className="flex-1 bg-white/5 text-ink rounded-md px-3 py-2 text-sm border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-mute"
```

- [ ] **Passo 6: Checar TypeScript**

```bash
cd "C:\Projects\Boi Hub" && npx tsc --noEmit
```

- [ ] **Passo 7: Verificar no browser — `http://localhost:3000/login` → entrar no app**

Navegar até `/fretes`, `/loja`, `/saude` e confirmar que os cards têm divisores visíveis.

- [ ] **Passo 8: Commit**

```bash
cd "C:\Projects\Boi Hub" && git add src/components/fretes/FreteCard.tsx src/components/loja/LojaCard.tsx src/components/loja/SuplementoCard.tsx src/components/saude/VeterinarioCard.tsx src/components/saude/ProdutoCard.tsx && git commit -m "feat: update card dividers to border-border for dark theme"
```

---

## Task 9: Verificação Visual Final

**Arquivos:** nenhum (só verificação)

- [ ] **Passo 1: Checar TypeScript final**

```bash
cd "C:\Projects\Boi Hub" && npx tsc --noEmit
```

Saída esperada: zero erros novos introduzidos por este plano.

- [ ] **Passo 2: Verificar todas as rotas no browser**

Com `npm run dev` rodando em `http://localhost:3000`:

| Rota | O que verificar |
|---|---|
| `/` | Hero com foto de gado, animação, botões glass, stats verdes, features dark |
| `/login` | Fundo preto, card glass, formulário branco |
| `/cadastro` | Mesmo padrão do login |
| `/dashboard` | Sidebar escura, item ativo com borda verde, conteúdo em preto |
| `/fretes` | Cards com borda sutil, divisores visíveis |
| `/loja` | Cards escuros, tags corretas |
| `/saude` | Cards vet com divisores, ProdutoCard com input dark |
| `/suplementos` | Cards com divisor visível |
| `/perfil` | Formulário dark |

- [ ] **Passo 3: Commit de encerramento (se houver ajustes pontuais)**

```bash
cd "C:\Projects\Boi Hub" && git add -p && git commit -m "fix: visual adjustments after dark theme review"
```
