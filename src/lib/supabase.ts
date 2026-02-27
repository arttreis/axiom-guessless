import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined) ?? '';
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ?? '';

// Indica se o Supabase está configurado com credenciais reais.
// Quando false, o app carrega normalmente mas operações de auth retornam erro.
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// Usa placeholders para evitar crash na inicialização do módulo.
// createClient lança exceção com string vazia — placeholders previnem isso.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-not-configured.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
);
