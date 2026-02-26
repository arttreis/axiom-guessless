import type { OnboardingData, ArchetypeResult, GeneratedPost } from '../types';

const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY as string;
const ANTHROPIC_MODEL = 'claude-sonnet-4-20250514';

// Mock responses para modo demo (quando a chave da API não está configurada)
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

async function callClaude(body: Record<string, unknown>): Promise<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({ model: ANTHROPIC_MODEL, ...body }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Erro na API Anthropic: ${err}`);
  }

  const data = await response.json() as { content: { type: string; text?: string }[] };
  return data.content.map(c => c.text ?? '').join('');
}

function parseJSON<T>(raw: string): T {
  const cleaned = raw.replace(/```json\n?|```\n?/g, '').trim();
  return JSON.parse(cleaned) as T;
}

export async function analyzeArchetypes(responses: OnboardingData): Promise<ArchetypeResult> {
  if (!ANTHROPIC_API_KEY) {
    // DEMO MODE: retorna resultado mock com delay para simular análise com IA
    await new Promise((resolve) => setTimeout(resolve, 2500));
    return MOCK_ARCHETYPE_RESULT;
  }

  const prompt = `Você é um especialista em branding e psicologia de marca baseada nos 12 arquétipos de Carl Jung.

Com base nas respostas do onboarding abaixo, analise a personalidade desta marca e atribua uma pontuação de 0 a 100 para cada um dos 12 arquétipos. A soma não precisa ser 100 — avalie cada arquétipo de forma independente.

RESPOSTAS DO ONBOARDING:
- Nome da marca: ${responses.brand_name}
- Significado: ${responses.brand_meaning}
- Motivação: ${responses.brand_motivation}
- Descrição: ${responses.brand_description}
- Como atua: ${responses.how_operates}
- Produtos/Serviços: ${responses.products_services}
- Diferencial: ${responses.differentials}
- Público-alvo: ${responses.audience_class} | ${responses.audience_age} | ${responses.audience_gender}
- Clientes: ${responses.who_are_clients}
- Percepção desejada: ${responses.client_perception}
- Palavras-chave: ${responses.keywords}
- Personalidade SIM: ${responses.brand_personality_yes}
- Personalidade NÃO: ${responses.brand_personality_no}
- Marcas admiradas: ${responses.brands_admire}

OS 12 ARQUÉTIPOS:
O Inocente, O Explorador, O Sábio, O Herói, O Fora-da-Lei, O Mago, O Cara Comum, O Amante, O Bobo, O Cuidador, O Criador, O Governante

Responda APENAS em JSON válido, sem markdown, sem texto extra:
{
  "scores": {
    "O Inocente": 0,
    "O Explorador": 0,
    "O Sábio": 0,
    "O Herói": 0,
    "O Fora-da-Lei": 0,
    "O Mago": 0,
    "O Cara Comum": 0,
    "O Amante": 0,
    "O Bobo": 0,
    "O Cuidador": 0,
    "O Criador": 0,
    "O Governante": 0
  },
  "primary_archetype": "nome do arquétipo principal",
  "secondary_archetype": "nome do segundo arquétipo",
  "analysis": "Parágrafo de 3-4 frases explicando a identidade da marca"
}`;

  const raw = await callClaude({ max_tokens: 1000, messages: [{ role: 'user', content: prompt }] });
  return parseJSON<ArchetypeResult>(raw);
}

export async function generatePost(
  userPrompt: string,
  brandContext: OnboardingData,
  primaryArchetype: string
): Promise<GeneratedPost> {
  if (!ANTHROPIC_API_KEY) {
    // DEMO MODE: retorna post mock com delay para simular geração com IA
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return { ...MOCK_GENERATED_POST, title: userPrompt.slice(0, 60) || MOCK_GENERATED_POST.title };
  }

  const systemPrompt = `Você é um especialista em marketing digital e criação de conteúdo para redes sociais.

CONTEXTO DA MARCA:
- Nome: ${brandContext.brand_name}
- Descrição: ${brandContext.brand_description}
- Arquétipo principal: ${primaryArchetype}
- Palavras-chave: ${brandContext.keywords}
- Tom de voz: ${brandContext.brand_personality_yes}
- NÃO ser: ${brandContext.brand_personality_no}
- Público: ${brandContext.audience_age}, ${brandContext.audience_gender}, ${brandContext.audience_class}
- Diferencial: ${brandContext.differentials}

Crie sempre conteúdo alinhado com o arquétipo e tom de voz da marca.
Responda APENAS em JSON válido sem markdown nem texto extra.`;

  const userMessage = `Crie um post com base nessa solicitação: "${userPrompt}".

Responda em JSON:
{
  "title": "título chamativo do post",
  "content": "texto completo do post (pronto para publicar, com emojis se adequado)",
  "platform": "Instagram",
  "type": "Carrossel",
  "archetype": "arquétipo predominante neste post",
  "hashtags": ["#tag1", "#tag2", "#tag3"],
  "tip": "dica de como usar este post (1 frase)"
}`;

  const raw = await callClaude({
    max_tokens: 1000,
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }],
  });
  return parseJSON<GeneratedPost>(raw);
}
