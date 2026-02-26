import { create } from 'zustand';
import type { OnboardingData, ArchetypeResult } from '../types';

// DEMO MODE — Respostas pré-preenchidas para facilitar apresentação visual
const DEMO_ANSWERS: Partial<OnboardingData> = {
  brand_name: 'Axiom',
  brand_meaning: 'Ferramenta essencial para marcas com propósito autêntico',
  brand_motivation: 'Ajudar empreendedores a descobrir e expressar a identidade única de suas marcas',
  brand_description: 'Plataforma de geração de conteúdo baseada nos 12 arquétipos de marca de Carl Jung',
  how_operates: '100% digital, atendendo empreendedores e agências em todo o Brasil',
  where_sells: 'Online via plataforma SaaS com assinatura mensal',
  products_services: 'Análise de arquétipo de marca e geração de conteúdo com IA',
  current_moment: 'Crescimento acelerado, tornando-se referência em branding com IA no Brasil',
  differentials: 'Única plataforma que usa arquétipos junguianos para guiar toda a criação de conteúdo',
  competitors: 'Buffer, Hootsuite, Copy.ai',
  competitors_offer: 'Geração genérica de conteúdo sem identidade ou personalidade de marca',
  audience_class: 'A e B',
  audience_gender: 'Todos os gêneros',
  audience_age: '25 a 45 anos',
  who_are_clients: 'Empreendedores digitais, gestores de marketing e agências criativas',
  client_perception: 'Autoridade, inovação e estratégia em identidade de marca',
  keywords: 'autenticidade, arquétipos, branding, identidade, conteúdo, IA',
  brand_personality_yes: 'Inovador, inspirador, estratégico, confiante, direto',
  brand_personality_no: 'Genérico, superficial, apelativo, sem personalidade',
  colors_yes: 'Laranja, âmbar, preto',
  colors_no: 'Pastéis, cores sem energia ou impacto',
  brands_admire: 'Apple, Nike, Nubank, Red Bull',
};

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
  answers: DEMO_ANSWERS,
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

  reset: () => set({ currentStep: 0, answers: DEMO_ANSWERS, archetypeResult: null }),
}));
