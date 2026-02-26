// DEMO MODE — Lê dados do Zustand store ao invés do Supabase
import { useOnboardingStore } from '../store/onboardingStore';

export function useOnboarding() {
  const { answers, archetypeResult } = useOnboardingStore();
  const hasOnboarding = Object.keys(answers).length > 0;

  return {
    onboarding: hasOnboarding ? answers : null,
    archetypeResult,
    loading: false,
    hasOnboarding,
  };
}
