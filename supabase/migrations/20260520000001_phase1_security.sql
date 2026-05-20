-- BoiHub — Fase 1: Row Level Security (RLS) policies
-- Aplica controle de acesso fino a todas as tabelas do schema public.
--
-- Como rodar:
-- 1. Abrir Supabase Dashboard > SQL Editor
-- 2. Colar este arquivo inteiro
-- 3. Executar (Run)
--
-- Idempotente: pode rodar várias vezes sem efeito colateral.
-- Todas as policies usam DROP IF EXISTS antes de CREATE.

-- ============================================================
-- 1. HABILITAR RLS EM TODAS AS TABELAS
-- ============================================================

ALTER TABLE public.profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.veterinarios    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.motoristas      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lojas           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produtos_saude  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suplementos     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fretes          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultas_vet   ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- 2. PROFILES — usuário só vê e edita o próprio perfil
-- ============================================================

DROP POLICY IF EXISTS "profiles_select_own"  ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own"  ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own"  ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_own"  ON public.profiles;

CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_delete_own"
  ON public.profiles FOR DELETE
  USING (auth.uid() = id);


-- ============================================================
-- 3. CATÁLOGO PÚBLICO — leitura para autenticados,
--    escrita só para owner ou admin
--    (veterinarios, motoristas, lojas, produtos_saude, suplementos)
-- ============================================================

-- VETERINÁRIOS
DROP POLICY IF EXISTS "veterinarios_read_all"        ON public.veterinarios;
DROP POLICY IF EXISTS "veterinarios_insert_self"     ON public.veterinarios;
DROP POLICY IF EXISTS "veterinarios_update_self"     ON public.veterinarios;
DROP POLICY IF EXISTS "veterinarios_delete_self"     ON public.veterinarios;

CREATE POLICY "veterinarios_read_all"
  ON public.veterinarios FOR SELECT
  USING (true);

CREATE POLICY "veterinarios_insert_self"
  ON public.veterinarios FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "veterinarios_update_self"
  ON public.veterinarios FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "veterinarios_delete_self"
  ON public.veterinarios FOR DELETE
  USING (auth.uid() = user_id);


-- MOTORISTAS
DROP POLICY IF EXISTS "motoristas_read_all"      ON public.motoristas;
DROP POLICY IF EXISTS "motoristas_insert_self"   ON public.motoristas;
DROP POLICY IF EXISTS "motoristas_update_self"   ON public.motoristas;
DROP POLICY IF EXISTS "motoristas_delete_self"   ON public.motoristas;

CREATE POLICY "motoristas_read_all"
  ON public.motoristas FOR SELECT
  USING (true);

CREATE POLICY "motoristas_insert_self"
  ON public.motoristas FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "motoristas_update_self"
  ON public.motoristas FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "motoristas_delete_self"
  ON public.motoristas FOR DELETE
  USING (auth.uid() = user_id);


-- LOJAS
DROP POLICY IF EXISTS "lojas_read_all"      ON public.lojas;
DROP POLICY IF EXISTS "lojas_insert_self"   ON public.lojas;
DROP POLICY IF EXISTS "lojas_update_self"   ON public.lojas;
DROP POLICY IF EXISTS "lojas_delete_self"   ON public.lojas;

CREATE POLICY "lojas_read_all"
  ON public.lojas FOR SELECT
  USING (true);

CREATE POLICY "lojas_insert_self"
  ON public.lojas FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "lojas_update_self"
  ON public.lojas FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "lojas_delete_self"
  ON public.lojas FOR DELETE
  USING (auth.uid() = user_id);


-- PRODUTOS DE SAÚDE — escrita só pelo dono da loja
DROP POLICY IF EXISTS "produtos_read_all"        ON public.produtos_saude;
DROP POLICY IF EXISTS "produtos_insert_loja"     ON public.produtos_saude;
DROP POLICY IF EXISTS "produtos_update_loja"     ON public.produtos_saude;
DROP POLICY IF EXISTS "produtos_delete_loja"     ON public.produtos_saude;

CREATE POLICY "produtos_read_all"
  ON public.produtos_saude FOR SELECT
  USING (true);

CREATE POLICY "produtos_insert_loja"
  ON public.produtos_saude FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.lojas l
      WHERE l.id = loja_id AND l.user_id = auth.uid()
    )
  );

CREATE POLICY "produtos_update_loja"
  ON public.produtos_saude FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.lojas l
      WHERE l.id = loja_id AND l.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.lojas l
      WHERE l.id = loja_id AND l.user_id = auth.uid()
    )
  );

CREATE POLICY "produtos_delete_loja"
  ON public.produtos_saude FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.lojas l
      WHERE l.id = loja_id AND l.user_id = auth.uid()
    )
  );


-- SUPLEMENTOS — escrita só pelo dono da loja
DROP POLICY IF EXISTS "suplementos_read_all"        ON public.suplementos;
DROP POLICY IF EXISTS "suplementos_insert_loja"     ON public.suplementos;
DROP POLICY IF EXISTS "suplementos_update_loja"     ON public.suplementos;
DROP POLICY IF EXISTS "suplementos_delete_loja"     ON public.suplementos;

CREATE POLICY "suplementos_read_all"
  ON public.suplementos FOR SELECT
  USING (true);

CREATE POLICY "suplementos_insert_loja"
  ON public.suplementos FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.lojas l
      WHERE l.id = loja_id AND l.user_id = auth.uid()
    )
  );

CREATE POLICY "suplementos_update_loja"
  ON public.suplementos FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.lojas l
      WHERE l.id = loja_id AND l.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.lojas l
      WHERE l.id = loja_id AND l.user_id = auth.uid()
    )
  );

CREATE POLICY "suplementos_delete_loja"
  ON public.suplementos FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.lojas l
      WHERE l.id = loja_id AND l.user_id = auth.uid()
    )
  );


-- ============================================================
-- 4. FRETES — produtor e motorista atribuído têm visibilidade
-- ============================================================

DROP POLICY IF EXISTS "fretes_select_party"    ON public.fretes;
DROP POLICY IF EXISTS "fretes_insert_produtor" ON public.fretes;
DROP POLICY IF EXISTS "fretes_update_party"    ON public.fretes;
DROP POLICY IF EXISTS "fretes_delete_produtor" ON public.fretes;

-- Produtor sempre vê os próprios fretes.
-- Motorista vê os fretes onde foi atribuído (motoristas.user_id).
CREATE POLICY "fretes_select_party"
  ON public.fretes FOR SELECT
  USING (
    auth.uid() = produtor_id
    OR EXISTS (
      SELECT 1 FROM public.motoristas m
      WHERE m.id = motorista_id AND m.user_id = auth.uid()
    )
  );

CREATE POLICY "fretes_insert_produtor"
  ON public.fretes FOR INSERT
  WITH CHECK (auth.uid() = produtor_id);

-- Produtor atualiza seus fretes. Motorista atribuído atualiza status.
CREATE POLICY "fretes_update_party"
  ON public.fretes FOR UPDATE
  USING (
    auth.uid() = produtor_id
    OR EXISTS (
      SELECT 1 FROM public.motoristas m
      WHERE m.id = motorista_id AND m.user_id = auth.uid()
    )
  );

-- Apenas o produtor pode deletar e somente fretes pendentes.
CREATE POLICY "fretes_delete_produtor"
  ON public.fretes FOR DELETE
  USING (auth.uid() = produtor_id AND status = 'pendente');


-- ============================================================
-- 5. CONSULTAS VETERINÁRIAS — produtor e vet têm visibilidade
-- ============================================================

DROP POLICY IF EXISTS "consultas_select_party"     ON public.consultas_vet;
DROP POLICY IF EXISTS "consultas_insert_produtor"  ON public.consultas_vet;
DROP POLICY IF EXISTS "consultas_update_party"     ON public.consultas_vet;
DROP POLICY IF EXISTS "consultas_delete_produtor"  ON public.consultas_vet;

CREATE POLICY "consultas_select_party"
  ON public.consultas_vet FOR SELECT
  USING (
    auth.uid() = produtor_id
    OR EXISTS (
      SELECT 1 FROM public.veterinarios v
      WHERE v.id = veterinario_id AND v.user_id = auth.uid()
    )
  );

CREATE POLICY "consultas_insert_produtor"
  ON public.consultas_vet FOR INSERT
  WITH CHECK (auth.uid() = produtor_id);

CREATE POLICY "consultas_update_party"
  ON public.consultas_vet FOR UPDATE
  USING (
    auth.uid() = produtor_id
    OR EXISTS (
      SELECT 1 FROM public.veterinarios v
      WHERE v.id = veterinario_id AND v.user_id = auth.uid()
    )
  );

-- Produtor pode cancelar consulta agendada.
CREATE POLICY "consultas_delete_produtor"
  ON public.consultas_vet FOR DELETE
  USING (auth.uid() = produtor_id AND status = 'agendada');


-- ============================================================
-- 6. STORAGE — bucket profile-photos (criado em outra migration)
-- ============================================================
-- Policies de Storage são gerenciadas na migration de Storage
-- (ver: 20260520000003_storage_buckets.sql na Fase 2)
