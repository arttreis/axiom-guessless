import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';

export function useAuth() {
  const { setUser, setSession, fetchProfile, isLoading } = useAuthStore();

  useEffect(() => {
    // Sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        void fetchProfile(session.user.id);
      }
      useAuthStore.setState({ isLoading: false });
    });

    // Listener de mudanças
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        void fetchProfile(session.user.id);
      } else {
        useAuthStore.getState().setProfile(null);
      }
      useAuthStore.setState({ isLoading: false });
    });

    return () => subscription.unsubscribe();
  }, [setUser, setSession, fetchProfile]);

  return { isLoading };
}
