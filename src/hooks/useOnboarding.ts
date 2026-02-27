import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { useOnboardingStore } from '../store/onboardingStore';
import type { OnboardingData } from '../types';

export function useOnboarding() {
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((s) => s.user);
  const { answers, archetypeResult, setAnswer, setArchetypeResult } = useOnboardingStore();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    async function fetchData() {
      setLoading(true);
      try {
        const [responsesResult, archetypeRes] = await Promise.all([
          supabase
            .from('onboarding_responses')
            .select('*')
            .eq('user_id', user!.id)
            .maybeSingle(),
          supabase
            .from('archetype_results')
            .select('*')
            .eq('user_id', user!.id)
            .maybeSingle(),
        ]);

        if (responsesResult.data) {
          const { user_id: _uid, id: _id, completed_at: _ca, ...rawAnswers } = responsesResult.data as Record<string, string>;
          Object.entries(rawAnswers).forEach(([k, v]) => setAnswer(k, v ?? ''));
        }

        if (archetypeRes.data) {
          setArchetypeResult(archetypeRes.data);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user, setAnswer, setArchetypeResult]);

  const hasOnboarding = archetypeResult !== null;

  return {
    onboarding: hasOnboarding ? (answers as Partial<OnboardingData>) : null,
    archetypeResult,
    loading,
    hasOnboarding,
  };
}
