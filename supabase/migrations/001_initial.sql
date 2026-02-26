-- ============================================
-- Axiom — Migration Inicial
-- ============================================

-- Tabela de perfis de usuário (extende auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  plan TEXT DEFAULT 'trial' CHECK (plan IN ('trial', 'starter', 'pro', 'agency')),
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT,
  subscription_status TEXT DEFAULT 'trialing',
  trial_ends_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de respostas do onboarding
CREATE TABLE onboarding_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  -- Bloco 1: Identificação e Propósito
  brand_name TEXT,
  brand_meaning TEXT,
  brand_motivation TEXT,
  brand_description TEXT,
  -- Bloco 2: Operação e Mercado
  how_operates TEXT,
  where_sells TEXT,
  products_services TEXT,
  current_moment TEXT,
  differentials TEXT,
  -- Bloco 3: Concorrência
  competitors TEXT,
  competitors_offer TEXT,
  -- Bloco 4: Público-Alvo
  audience_class TEXT,
  audience_gender TEXT,
  audience_age TEXT,
  who_are_clients TEXT,
  client_perception TEXT,
  -- Bloco 5: Branding e Identidade Visual
  keywords TEXT,
  brand_personality_yes TEXT,
  brand_personality_no TEXT,
  colors_yes TEXT,
  colors_no TEXT,
  brands_admire TEXT,
  -- Metadados
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de posts gerados
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('Instagram', 'LinkedIn', 'Twitter/X', 'YouTube')),
  type TEXT NOT NULL,
  archetype TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled')),
  likes INTEGER DEFAULT 0,
  engagement TEXT DEFAULT '-',
  scheduled_for TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de resultados de arquétipo
CREATE TABLE archetype_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  scores JSONB NOT NULL,
  primary_archetype TEXT NOT NULL,
  secondary_archetype TEXT,
  analysis TEXT,
  generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE archetype_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access their own data"
  ON profiles FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can only access their own onboarding"
  ON onboarding_responses FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own posts"
  ON posts FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own archetypes"
  ON archetype_results FOR ALL USING (auth.uid() = user_id);

-- Trigger: criar profile ao registrar
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Trigger: atualizar updated_at em profiles
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
