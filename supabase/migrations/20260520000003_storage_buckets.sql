-- BoiHub — Fase 2: Bucket de fotos de perfil
--
-- Cria bucket "profile-photos" no Supabase Storage e policies de acesso.
-- Cada usuário só sobe/edita/deleta arquivos dentro da própria pasta
-- (nome da pasta = auth.uid()). Leitura é pública porque o app exibe
-- as fotos em listagens (motoristas, vets, lojas, etc.).
--
-- Como rodar: SQL Editor do Supabase, igual à migration anterior.

-- 1. CRIAR BUCKET (idempotente)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profile-photos',
  'profile-photos',
  true,
  2 * 1024 * 1024,  -- 2 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;


-- 2. POLICIES NO storage.objects PARA O BUCKET profile-photos
-- Convenção de path: {user_id}/{filename}

DROP POLICY IF EXISTS "profile_photos_read_all"    ON storage.objects;
DROP POLICY IF EXISTS "profile_photos_insert_self" ON storage.objects;
DROP POLICY IF EXISTS "profile_photos_update_self" ON storage.objects;
DROP POLICY IF EXISTS "profile_photos_delete_self" ON storage.objects;

-- Leitura pública (qualquer um vê fotos de perfil)
CREATE POLICY "profile_photos_read_all"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'profile-photos');

-- Upload só na própria pasta (primeiro segmento do path = auth.uid())
CREATE POLICY "profile_photos_insert_self"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'profile-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "profile_photos_update_self"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'profile-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "profile_photos_delete_self"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'profile-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
