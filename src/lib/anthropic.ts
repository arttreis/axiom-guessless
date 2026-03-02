import type { OnboardingData, ArchetypeResult, GeneratedPost } from '../types';

// Mock responses para modo demo (quando a chave da API não está configurada no servidor)
const MOCK_ARCHETYPE_RESULT: ArchetypeResult = {
  scores: {
    'O Inocente': 25,
    'O Explorador': 55,
    'O Sábio': 72,
    'O Herói': 88,
    'O Fora-da-Lei': 45,
    'O Mago': 76,
    'O Cara Comum': 15,
    'O Amante': 30,
    'O Bobo': 10,
    'O Cuidador': 40,
    'O Criador': 82,
    'O Governante': 60,
  },
  primary_archetype: 'O Herói',
  secondary_archetype: 'O Criador',
  analysis:
    'A marca carrega a essência do Herói: coragem para desafiar o status quo e determinação para transformar resultados. Com forte presença do Criador como arquétipo secundário, combina liderança com inovação e visão artística. A comunicação deve inspirar superação e ação, mostrando que é possível ir além com as ferramentas certas. Sua missão é empoderar clientes para que se tornem protagonistas da própria jornada de marca.',
};

const MOCK_GENERATED_POST: GeneratedPost = {
  title: 'Como sua marca pode se destacar com arquétipos de Jung',
  content:
    'Toda marca tem uma personalidade profunda — e quando você a descobre, tudo muda. 🔥\n\nOs arquétipos de Carl Jung revelam quem sua marca realmente é:\n\n⚡ O Herói que inspira superação\n✨ O Criador que transforma o mundo\n🧙 O Mago que torna o impossível possível\n\nQual é o arquétipo da sua marca? Descubra agora e veja seu conteúdo ganhar vida.',
  platform: 'Instagram',
  type: 'Carrossel',
  archetype: 'O Herói',
  hashtags: ['#branding', '#arquétipos', '#marketing', '#identidade'],
  tip: 'Publique às 19h de terça a quinta para maior engajamento',
};

export async function analyzeArchetypes(responses: OnboardingData): Promise<ArchetypeResult> {
  const res = await fetch('/api/analyze-archetypes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ responses }),
  });

  if (!res.ok) {
    // Fallback para mock se o servidor retornar erro (ex: API key não configurada)
    console.warn('API de análise indisponível, usando modo demo.');
    await new Promise((resolve) => setTimeout(resolve, 2500));
    return MOCK_ARCHETYPE_RESULT;
  }

  return res.json() as Promise<ArchetypeResult>;
}

export async function generatePost(
  userPrompt: string,
  brandContext: OnboardingData,
  primaryArchetype: string
): Promise<GeneratedPost> {
  const res = await fetch('/api/generate-post', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userPrompt, brandContext, primaryArchetype }),
  });

  if (!res.ok) {
    // Fallback para mock se o servidor retornar erro
    console.warn('API de geração indisponível, usando modo demo.');
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return { ...MOCK_GENERATED_POST, title: userPrompt.slice(0, 60) || MOCK_GENERATED_POST.title };
  }

  return res.json() as Promise<GeneratedPost>;
}
