-- BoiHub — Fase 3: Schema de pagamento e comissão
--
-- Cria as tabelas necessárias para processar pagamentos via PIX (Mercado
-- Pago) e calcular comissão sobre fretes e consultas veterinárias.
--
-- Comissão atual: 10% sobre o valor bruto, descontada do prestador.
-- Modelo: produtor paga o valor total -> BoiHub retém a comissão ->
-- repassa o valor líquido ao prestador (PIX ou conta bancária).
--
-- Como rodar: SQL Editor do Supabase, igual às migrations anteriores.

-- ============================================================
-- 1. TABELA payout_accounts
--    Conta de recebimento do prestador (motorista, vet, loja).
--    Um user pode ter uma conta de recebimento.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.payout_accounts (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  -- PIX (preferido)
  pix_key         text,
  pix_key_type    text CHECK (pix_key_type IN ('cpf', 'cnpj', 'email', 'telefone', 'aleatoria')),
  -- Conta bancária (alternativa ao PIX)
  banco_codigo    text,
  banco_agencia   text,
  banco_conta     text,
  banco_conta_tipo text CHECK (banco_conta_tipo IN ('corrente', 'poupanca')),
  -- Titular
  titular_nome    text NOT NULL,
  titular_documento text NOT NULL,  -- CPF ou CNPJ apenas dígitos
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS payout_accounts_user_id_idx ON public.payout_accounts(user_id);

ALTER TABLE public.payout_accounts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "payout_accounts_select_own"  ON public.payout_accounts;
DROP POLICY IF EXISTS "payout_accounts_insert_own"  ON public.payout_accounts;
DROP POLICY IF EXISTS "payout_accounts_update_own"  ON public.payout_accounts;
DROP POLICY IF EXISTS "payout_accounts_delete_own"  ON public.payout_accounts;

CREATE POLICY "payout_accounts_select_own"
  ON public.payout_accounts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "payout_accounts_insert_own"
  ON public.payout_accounts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "payout_accounts_update_own"
  ON public.payout_accounts FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "payout_accounts_delete_own"
  ON public.payout_accounts FOR DELETE
  USING (auth.uid() = user_id);


-- ============================================================
-- 2. TABELA transactions
--    Uma transação por contratação (frete OU consulta).
-- ============================================================

DO $$ BEGIN
  CREATE TYPE transaction_status AS ENUM ('created', 'pending', 'paid', 'failed', 'refunded', 'expired');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE transaction_kind AS ENUM ('frete', 'consulta');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.transactions (
  id                       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind                     transaction_kind NOT NULL,
  frete_id                 uuid REFERENCES public.fretes(id) ON DELETE SET NULL,
  consulta_id              uuid REFERENCES public.consultas_vet(id) ON DELETE SET NULL,
  produtor_id              uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  prestador_id             uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  valor_bruto              numeric(10, 2) NOT NULL CHECK (valor_bruto > 0),
  comissao_percentual      numeric(5, 2) NOT NULL DEFAULT 10.00 CHECK (comissao_percentual >= 0),
  comissao_valor           numeric(10, 2) NOT NULL,
  valor_liquido            numeric(10, 2) NOT NULL,
  gateway                  text NOT NULL DEFAULT 'mercadopago',
  gateway_transaction_id   text,
  gateway_qr_code          text,
  gateway_qr_code_base64   text,
  gateway_ticket_url       text,
  status                   transaction_status NOT NULL DEFAULT 'created',
  metadata                 jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at               timestamptz NOT NULL DEFAULT now(),
  updated_at               timestamptz NOT NULL DEFAULT now(),
  paid_at                  timestamptz,
  expires_at               timestamptz,

  -- Garante que exatamente um dos dois fica preenchido conforme kind
  CHECK (
    (kind = 'frete'    AND frete_id    IS NOT NULL AND consulta_id IS NULL)
    OR
    (kind = 'consulta' AND consulta_id IS NOT NULL AND frete_id    IS NULL)
  )
);

CREATE INDEX IF NOT EXISTS transactions_produtor_idx          ON public.transactions(produtor_id);
CREATE INDEX IF NOT EXISTS transactions_prestador_idx         ON public.transactions(prestador_id);
CREATE INDEX IF NOT EXISTS transactions_frete_idx             ON public.transactions(frete_id);
CREATE INDEX IF NOT EXISTS transactions_consulta_idx          ON public.transactions(consulta_id);
CREATE INDEX IF NOT EXISTS transactions_status_idx            ON public.transactions(status);
CREATE INDEX IF NOT EXISTS transactions_gateway_tx_idx        ON public.transactions(gateway_transaction_id);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Produtor e prestador veem suas próprias transações.
-- Insert e update são feitos via service role (server-side, em /api/*).
-- O cliente browser não escreve direto aqui.

DROP POLICY IF EXISTS "transactions_select_party"   ON public.transactions;
DROP POLICY IF EXISTS "transactions_no_client_write" ON public.transactions;

CREATE POLICY "transactions_select_party"
  ON public.transactions FOR SELECT
  USING (auth.uid() = produtor_id OR auth.uid() = prestador_id);

-- Bloqueia escrita pelo client (anon e authenticated).
-- Apenas service role escreve aqui via /api/* routes.
CREATE POLICY "transactions_no_client_write"
  ON public.transactions FOR INSERT
  WITH CHECK (false);
