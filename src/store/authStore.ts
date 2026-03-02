import { create } from 'zustand';
import type { User, Session } from '@supabase/supabase-js';
import type { Profile } from '../types';
import { supabase } from '../lib/supabase';

interface AuthStore {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (isLoading: boolean) => void;
  signOut: () => Promise<void>;
  fetchProfile: (userId: string) => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  profile: null,
  session: null,
  isLoading: true,

  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setSession: (session) => set({ session }),
  setLoading: (isLoading) => set({ isLoading }),

  fetchProfile: async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (data) {
      set({ profile: data as Profile });
      return;
    }

    // Perfil não encontrado — trigger pode ter falhado, cria manualmente
    const { data: { user } } = await supabase.auth.getUser();
    const { data: newProfile } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        email: user?.email ?? '',
        name: user?.user_metadata?.name ?? '',
      })
      .select()
      .maybeSingle();

    if (newProfile) {
      set({ profile: newProfile as Profile });
    }
  },

  signOut: async () => {
    try {
      await supabase.auth.signOut();
      set({ user: null, profile: null, session: null });
    } catch (error) {
      console.error('Erro ao sair:', error);
      throw error;
    }
  },
}));
