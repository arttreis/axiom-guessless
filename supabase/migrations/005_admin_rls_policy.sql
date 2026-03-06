-- ============================================
-- Migration 005: RLS para admins verem todos os usuários
-- ============================================

-- Função auxiliar para checar se o usuário logado é admin
-- SECURITY DEFINER evita recursão infinita na RLS
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Política: admins podem SELECT em todos os perfis
-- (a política existente "Users can only access their own data" já cobre o próprio perfil)
CREATE POLICY "Admins can read all profiles"
  ON profiles FOR SELECT
  USING (is_admin());

-- ============================================
-- SETAR ADMINS
-- ============================================
-- Dar role admin para as contas abaixo.
-- Rode este UPDATE manualmente no SQL Editor do Supabase:

UPDATE profiles
SET role = 'admin'
WHERE email IN (
  'lucca@guessless.com.br'
);
