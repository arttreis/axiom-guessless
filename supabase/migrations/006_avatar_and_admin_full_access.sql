-- ============================================
-- Migration 006: Avatar upload + Admin full access
-- ============================================

-- 1. Adicionar coluna avatar_url na tabela profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- ============================================
-- 2. Storage: bucket "avatars" público
-- ============================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  2097152, -- 2MB em bytes
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 2097152,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- Policy: usuário autenticado pode fazer upload apenas na sua própria pasta
CREATE POLICY "Usuário pode fazer upload do próprio avatar"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy: usuário pode atualizar/substituir o próprio avatar
CREATE POLICY "Usuário pode atualizar o próprio avatar"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy: qualquer um pode ler avatares (bucket público)
CREATE POLICY "Avatares são públicos"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'avatars');

-- Policy: usuário pode deletar o próprio avatar
CREATE POLICY "Usuário pode deletar o próprio avatar"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- ============================================
-- 3. Admin: acesso total a todos os dados
-- ============================================

-- Garantir que a função is_admin() existe (idempotente)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Admin pode ler TODOS os onboarding_responses
DROP POLICY IF EXISTS "Admins can read all onboarding" ON onboarding_responses;
CREATE POLICY "Admins can read all onboarding"
  ON onboarding_responses FOR SELECT
  USING (is_admin());

-- Admin pode ler TODOS os posts
DROP POLICY IF EXISTS "Admins can read all posts" ON posts;
CREATE POLICY "Admins can read all posts"
  ON posts FOR SELECT
  USING (is_admin());

-- Admin pode ler TODOS os archetype_results
DROP POLICY IF EXISTS "Admins can read all archetype_results" ON archetype_results;
CREATE POLICY "Admins can read all archetype_results"
  ON archetype_results FOR SELECT
  USING (is_admin());

-- Admin pode ler TODOS os profiles (já existe na 005, mas garantindo idempotência)
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;
CREATE POLICY "Admins can read all profiles"
  ON profiles FOR SELECT
  USING (is_admin());

-- Admin pode atualizar qualquer profile (ex: alterar plano, role)
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
CREATE POLICY "Admins can update all profiles"
  ON profiles FOR UPDATE
  USING (is_admin());
