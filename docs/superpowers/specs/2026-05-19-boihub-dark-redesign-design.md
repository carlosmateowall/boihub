# Boi Hub — Redesign Visual Dark

**Data:** 2026-05-19  
**Status:** Aprovado  
**Abordagem:** C — Híbrida (token overhaul + AnimatedHero + redesign dos componentes-chave)

---

## Contexto

O Boi Hub atualmente usa um tema claro (fundo off-white, texto escuro, verde como cor primária). O objetivo é substituir tudo por uma identidade visual escura e de alto contraste, baseada em uma hero section encontrada no 21st.dev — fundo preto absoluto, acento verde `#4ade80`, efeitos glass/blur e tipografia pesada.

---

## Identidade Visual

| Propriedade | Valor |
|---|---|
| Fundo base | `#050505` (preto absoluto) |
| Fundo elevado | `#0d0d0d` (cards, sidebar) |
| Acento | `#4ade80` (verde) |
| Acento hover | `#22c55e` |
| Acento dim (fundo) | `rgba(74,222,128,0.12)` |
| Texto primário | `#ffffff` |
| Texto secundário | `rgba(255,255,255,0.65)` |
| Texto mudo | `rgba(255,255,255,0.35)` |
| Borda sutil | `rgba(255,255,255,0.08)` |
| Borda forte | `rgba(255,255,255,0.18)` |
| Superfície glass | `rgba(255,255,255,0.10)` + `backdrop-blur-sm` |
| Peso tipográfico (títulos) | 800–900 |
| Espaçamento de letras (títulos) | `-0.03em` a `-0.05em` |

Sem `box-shadow`. Temas escuros usam bordas — não sombras — para criar profundidade.

---

## Seção 1 — Tokens CSS (`globals.css`)

O projeto tem tokens em dois lugares, e os dois precisam ser atualizados:
- **`@theme {}`** — prefixados com `--color-`, geram classes Tailwind (`bg-canvas`, `text-ink`, `border-primary`, etc.)
- **`:root {}`** — variáveis CSS brutas usadas via `var(--canvas)` em estilos inline e CSS customizado

Os dois blocos devem ser atualizados em sincronia. Os nomes dos tokens não mudam — só os valores.

```css
/* === bloco @theme (classes Tailwind) === */
--color-canvas:        #050505;
--color-canvas-soft:   #0d0d0d;
--color-ink:           #ffffff;
--color-body:          rgba(255,255,255,0.65);
--color-mute:          rgba(255,255,255,0.35);
--color-primary:       #4ade80;
--color-primary-hover: #22c55e;
--color-primary-pale:  rgba(74,222,128,0.12);
--color-positive:      #4ade80;
--color-positive-deep: #22c55e;
--color-negative:      #f87171;
--color-warning:       #facc15;
--color-border:        rgba(255,255,255,0.08);   /* novo */
--color-border-strong: rgba(255,255,255,0.18);   /* novo */

/* === bloco :root (uso via var()) === */
/* Espelha tudo acima sem o prefixo --color- */
--canvas:        #050505;
--canvas-soft:   #0d0d0d;
--ink:           #ffffff;
/* ... mesmo padrão ... */
--border:        rgba(255,255,255,0.08);
--border-strong: rgba(255,255,255,0.18);
```

Body padrão: `background-color: var(--canvas-soft); color: var(--ink);` — já está configurado, só os valores mudam.

---

## Seção 2 — Componentes

### `animated-hero-section-1.tsx` (novo)
- Caminho: `src/components/ui/animated-hero-section-1.tsx`
- Fonte: prompt do 21st.dev fornecido pelo usuário, estrutura mantida intacta
- Dependência: `framer-motion` (instalar via npm)
- Props usadas na landing: `backgroundImageUrl`, `logo`, `navLinks`, `topRightAction`, `title`, `description`, `ctaButton`, `secondaryCta`
- Imagem de fundo: foto de gado do Unsplash (`photo-1500595046743-cd271d694d30`)
- Overlay: `bg-black/60`

### `button.tsx` — adicionar variante `glass`
```ts
glass: 'bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20',
```
As variantes existentes (`primary`, `ghost`, `tertiary`, etc.) mantêm os nomes. A variante `primary` é atualizada para `bg-primary text-black` para melhor contraste no fundo escuro.

### `Sidebar.tsx` — redesign dark
- Container: `bg-canvas-soft border-r border-border`
- Item ativo: `bg-primary-pale text-primary border-l-2 border-primary`
- Item inativo: `text-mute hover:bg-white/5 hover:text-white`
- Logo: "Boi" branco + "Hub" verde

### `Navbar.tsx` — redesign glass
- Estado padrão: `bg-transparent backdrop-blur-sm`
- Estado ao rolar (scroll listener): `bg-canvas/80 backdrop-blur border-b border-border`
- Links: `text-white/70 hover:text-white`
- Botão CTA: variante `glass`

### Inputs / Formulários
- Fundo: `bg-canvas-soft`
- Borda: `border border-border`
- Focus: `focus:border-primary focus:ring-2 focus:ring-primary/20`
- Texto: `text-white placeholder:text-mute`
- Label: `text-mute text-sm`

### Cards (genéricos + FreteCard, LojaCard, SaudeCard, etc.)
- Fundo: `bg-canvas-soft`
- Borda: `border border-border`
- Radius: mantido (já usa `rounded-xl`)
- Sem box-shadow

---

## Seção 3 — Páginas

### Landing (`src/app/page.tsx`) — redesign completo
1. **Hero**: Substituir a hero atual pelo `<AnimatedHero>`. Nav links: Fretes, Veterinários, Loja, Saúde Animal. Título: "Sua fazenda na palma da mão." Botões: variante glass.
2. **Barra de stats**: Faixa horizontal `bg-canvas-soft border-t border-border`, quatro números com valores em verde.
3. **Grid de features**: Cards dark uniformes `bg-canvas-soft border-border`; remover o padrão atual de alternância claro/escuro.
4. **Seção de perfis**: Mesmos cards dark, estilo uniforme.
5. **CTA final**: `bg-canvas-soft`, título em verde, corpo em branco, botão verde sólido.
6. **Footer**: `bg-canvas border-t border-border`.

### Páginas de auth (`src/app/(auth)/layout.tsx` + login + cadastro)
- Layout: tela cheia `bg-canvas`, coluna centralizada
- Card do formulário: `bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8`
- Logo no topo do card
- Sem foto de fundo (hero fica exclusiva da landing)

### Onboarding (`src/app/onboarding/page.tsx`)
- Mesmo tratamento do auth: card glass centralizado no fundo preto
- Indicadores de etapa: ponto verde para ativo, `border-border` para inativo

### Layout do app (`src/app/(app)/layout.tsx`)
- Body: `bg-canvas` (já pega automaticamente com o token remap)
- Sidebar: redesenhada (ver acima)
- Navbar: redesenhada (ver acima)

### Páginas internas (fretes, loja, saúde, suplementos, perfil)
- Sem mudanças estruturais
- O token remap resolve ~80% automaticamente
- `FreteCard`, `LojaCard`, `VeterinarioCard`, `SuplementoCard`, `ProdutoCard`: adicionar explicitamente `bg-canvas-soft border border-border` para não depender do background herdado

---

## Dependências

```bash
npm install framer-motion
```

`@radix-ui/react-slot` e `class-variance-authority` já instalados.

---

## Fora do escopo

- Nenhuma mudança em rotas, lógica de auth ou integração com Supabase
- Nenhuma página ou feature nova
- Redesign da nav mobile (pode ser feito em uma passagem separada)
- Nenhuma animação além do que o `AnimatedHero` já provê

---

## Resumo de arquivos alterados

| Arquivo | Tipo de mudança |
|---|---|
| `src/app/globals.css` | Token overhaul |
| `src/components/ui/animated-hero-section-1.tsx` | Arquivo novo |
| `src/components/ui/button.tsx` | Adicionar variante `glass`, atualizar contraste do `primary` |
| `src/components/layout/Sidebar.tsx` | Redesign dark |
| `src/components/layout/Navbar.tsx` | Glass + comportamento de scroll |
| `src/app/page.tsx` | Redesign completo da landing |
| `src/app/(auth)/layout.tsx` | Layout auth dark |
| `src/app/(app)/layout.tsx` | Pega tokens automaticamente; ajustes pontuais se necessário |
| `src/app/onboarding/page.tsx` | Estilo card glass |
| `src/components/fretes/FreteCard.tsx` | Tokens dark explícitos |
| `src/components/loja/LojaCard.tsx` | Tokens dark explícitos |
| `src/components/loja/SuplementoCard.tsx` | Tokens dark explícitos |
| `src/components/saude/VeterinarioCard.tsx` | Tokens dark explícitos |
| `src/components/saude/ProdutoCard.tsx` | Tokens dark explícitos |
