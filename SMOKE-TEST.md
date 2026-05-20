# BoiHub - Checklist de Smoke Test pré-lançamento

> Lista pra rodar manualmente em https://boihub.com.br antes de divulgar
> para usuários reais. Cada item deve passar antes do anúncio.

Última atualização: 2026-05-20

---

## 0. Pré-requisitos (Supabase + Vercel)

- [ ] Migration `20260520000001_phase1_security.sql` aplicada (RLS).
- [ ] Migration `20260520000002_clear_mocks.sql` aplicada (mocks removidos).
- [ ] Migration `20260520000003_storage_buckets.sql` aplicada (bucket profile-photos).
- [ ] Migration `20260520000004_payment_schema.sql` aplicada (payout_accounts + transactions).
- [ ] Supabase → Authentication → URL Configuration → Redirect URLs:
      `https://boihub.com.br/redefinir-senha` e `http://localhost:3000/redefinir-senha`.
- [ ] Vercel → Settings → Environment Variables (Production):
  - [ ] `MP_ACCESS_TOKEN` (production token do Mercado Pago)
  - [ ] `SUPABASE_SERVICE_ROLE_KEY` (Supabase settings → API → service_role)
  - [ ] `NEXT_PUBLIC_SITE_URL=https://boihub.com.br`
- [ ] Mercado Pago → Webhooks: URL `https://boihub.com.br/api/webhooks/mercadopago`, eventos `payment.created` e `payment.updated`.
- [ ] Vercel → Analytics → Enable Web Analytics.
- [ ] Vercel → Speed Insights → Enable.

---

## 1. Páginas públicas

- [ ] `https://boihub.com.br/` carrega landing page sem flash branco.
- [ ] `/termos` renderiza Termos de Uso completos.
- [ ] `/privacidade` renderiza Política de Privacidade.
- [ ] Tag `og:image` aparece quando link é colado no WhatsApp.
- [ ] Favicon aparece na aba do navegador.
- [ ] Title da aba muda conforme rota.

## 2. Cadastro (fluxo completo)

- [ ] `/cadastro` → preenche nome, email, senha → continuar.
- [ ] Step 2: seleciona perfil "Produtor" (ou outro).
- [ ] Checkbox "aceito Termos e Privacidade" está obrigatório.
- [ ] Clica "Criar conta" → email de verificação chega.
- [ ] Link do email leva ao app já logado.
- [ ] Vai automaticamente para `/onboarding` se profile não completo.
- [ ] Onboarding salva → vai pra `/dashboard`.

## 3. Login + recuperação de senha

- [ ] `/login` com email+senha → entra no `/dashboard`.
- [ ] Email/senha errados → mensagem "Email ou senha incorretos."
- [ ] Click em "Esqueci minha senha" → vai pra `/esqueci-senha`.
- [ ] Submete email cadastrado → tela "Verifique seu email".
- [ ] Email do Supabase com link de reset chega.
- [ ] Link leva a `/redefinir-senha` com sessão recovery ativa.
- [ ] Submete nova senha → confirmação + redirect pra `/login` em 2.5s.
- [ ] Login com a nova senha funciona.

## 4. Perfil + upload de foto

- [ ] `/perfil` mostra dados do user logado.
- [ ] Clica "Editar" → `/perfil/editar`.
- [ ] Edita campos, clica "Adicionar foto" → seleciona JPG → preview aparece.
- [ ] Salvar → volta pra `/perfil` e foto aparece no avatar circular.
- [ ] Clicar "Remover foto" → preview some.
- [ ] Salvar de novo → avatar fica vazio com ícone genérico.
- [ ] Cards "Termos de Uso" e "Política de Privacidade" no perfil funcionam.

## 5. Empty states (com Supabase limpo)

- [ ] `/saude` → empty state com CTA "Sou loja, quero cadastrar" (WhatsApp).
- [ ] `/saude/veterinarios` → "Seja um dos primeiros veterinários" com CTA WhatsApp.
- [ ] `/loja` → "Sua loja merece estar aqui" + CTA WhatsApp.
- [ ] `/suplementos` → "Catálogo em montagem" + CTA WhatsApp.
- [ ] WhatsApp deep-link abre com mensagem pré-preenchida para o número configurado em `src/lib/constants.ts`.

## 6. Fretes (ciclo completo)

- [ ] `/fretes/novo` → cria frete com valor combinado de R$ 1,00 (centavos pra teste).
- [ ] `/fretes` mostra o frete novo com status "Pendente".
- [ ] `/fretes/[id]` mostra detalhes + bloco "Ações disponíveis".
- [ ] Botão "Pagar via PIX" aparece (porque tem preco_total > 0 e status=pendente).
- [ ] Clica "Pagar via PIX" → `/fretes/[id]/pagar` → QR Code é gerado.
- [ ] Botão "Copiar" funciona (PIX copia-cola).
- [ ] Pagar via app do banco com PIX de R$ 1,00 → polling detecta paid em até 10s → redireciona pra `/fretes/[id]`.
- [ ] Frete agora com status "Confirmado".
- [ ] Botão "Confirmar embarque" aparece → clica → status "Em andamento".
- [ ] Botão "Marcar como concluído" → status "Concluído".
- [ ] Botão "Avaliar motorista" → modal com 5 estrelas + comentário → salva.
- [ ] Card "Sua avaliação" aparece com nota.

## 7. Cancelamento de frete

- [ ] Cria um novo frete (status pendente).
- [ ] Clica "Cancelar frete" → confirma → some da lista (delete via RLS).

## 8. Veterinários + consulta (com vet real cadastrado)

> Necessário: 1 veterinário cadastrado no banco com user_id, antes de testar.

- [ ] `/saude/veterinarios` lista o vet.
- [ ] Clica "Agendar" → `/saude/veterinarios/[id]/agendar`.
- [ ] Seleciona tipo, motivo, data futura, confirma → vai pra `/saude/consultas?novo=1`.
- [ ] Banner verde de sucesso aparece.
- [ ] Consulta aparece na listagem com status "Agendada".
- [ ] Botão "Cancelar consulta" → confirma → status "Cancelada".

## 9. PWA / mobile

- [ ] No Chrome mobile: ícone "Adicionar à tela inicial" disponível.
- [ ] App instalado abre em modo standalone (sem barra de URL).
- [ ] Theme color verde-escuro no topo do device.
- [ ] Ícone do app na home screen é o BoiHub.

## 10. RLS (segurança)

- [ ] Usuário A não consegue ver fretes do usuário B (testar com 2 contas).
- [ ] Usuário A não consegue editar profile do B.
- [ ] Tentar `DELETE FROM fretes WHERE produtor_id != auth.uid()` via SQL no client → erro de permissão.

## 11. Console limpo

- [ ] DevTools → Console: sem errors em vermelho em nenhuma página principal.
- [ ] Network: sem 500/502/403 não esperados.

---

## Vai falhar enquanto faltar:

- **PIX/checkout**: até MP_ACCESS_TOKEN e webhook do MP estarem ok.
- **Upload de foto**: até a migration de Storage rodar e bucket existir.
- **Empty states**: até a migration de limpeza rodar (vai mostrar mocks até lá).
- **Agendar consulta**: até existir veterinário real cadastrado (soft launch).

Quando todos os itens passarem, está pronto pra divulgação inicial (WhatsApp,
LinkedIn, contatos diretos).
