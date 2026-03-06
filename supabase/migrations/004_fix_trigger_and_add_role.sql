-- ============================================
-- Migration 004: corrige trigger e adiciona coluna role
-- ============================================

-- Adiciona coluna role se não existir
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'client'
  CHECK (role IN ('client', 'admin'));

-- Recria a função do trigger com ON CONFLICT para evitar
-- "Database error saving new user" em caso de duplicata ou retry
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'name',
    'client'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Nunca bloqueia o cadastro por falha no perfil
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
