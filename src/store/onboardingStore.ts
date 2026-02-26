import { create } from 'zustand';
import type { OnboardingData, ArchetypeResult } from '../types';

interface OnboardingStore {
  currentStep: number;
  answers: Partial<OnboardingData>;
  archetypeResult: ArchetypeResult | null;
  setAnswer: (id: string, value: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  setArchetypeResult: (result: ArchetypeResult) => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  currentStep: 0,
  answers: {},
  archetypeResult: null,

  setAnswer: (id, value) =>
    set((state) => ({
      answers: { ...state.answers, [id]: value },
    })),

  nextStep: () =>
    set((state) => ({ currentStep: Math.min(state.currentStep + 1, 4) })),

  prevStep: () =>
    set((state) => ({ currentStep: Math.max(state.currentStep - 1, 0) })),

  setArchetypeResult: (result) => set({ archetypeResult: result }),

  reset: () => set({ currentStep: 0, answers: {}, archetypeResult: null }),
}));
