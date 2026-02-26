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
  signOut: () => Promise<void>;
  fetchProfile: (userId: string) => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  profile: null,
  session: null,
  isLoading: false, // DEMO MODE: sem loading inicial

  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setSession: (session) => set({ session }),

  fetchProfile: async (_userId: string) => {
    // DEMO MODE: perfil gerenciado pelo Checkout
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
