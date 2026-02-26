import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import type { OnboardingData, ArchetypeResult } from '../types';

export function useOnboarding() {
  const { user } = useAuthStore();
  const [onboarding, setOnboarding] = useState<Partial<OnboardingData> | null>(null);
  const [archetypeResult, setArchetypeResult] = useState<ArchetypeResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const [onbRes, archRes] = await Promise.all([
          supabase.from('onboarding_responses').select('*').eq('user_id', user.id).maybeSingle(),
          supabase.from('archetype_results').select('*').eq('user_id', user.id).maybeSingle(),
        ]);

        if (onbRes.data) setOnboarding(onbRes.data as Partial<OnboardingData>);
        if (archRes.data) {
          const { scores, primary_archetype, secondary_archetype, analysis } = archRes.data as {
            scores: Record<string, number>;
            primary_archetype: string;
            secondary_archetype: string;
            analysis: string;
          };
          setArchetypeResult({ scores, primary_archetype, secondary_archetype, analysis });
        }
      } catch (err) {
        console.error('Erro ao buscar onboarding:', err);
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, [user]);

  return { onboarding, archetypeResult, loading, hasOnboarding: !!onboarding };
}
