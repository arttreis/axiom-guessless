import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';

export function useProfile() {
  const { profile, fetchProfile, user } = useAuthStore();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = async (updates: { name?: string }) => {
    if (!user) return;
    setSaving(true);
    setError(null);
    try {
      const { error: err } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);
      if (err) throw err;
      await fetchProfile(user.id);
    } catch (err) {
      setError('Erro ao salvar perfil.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return { profile, saving, error, updateProfile };
}
