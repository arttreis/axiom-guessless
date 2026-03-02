export const config = { runtime: 'edge' };

const ANTHROPIC_MODEL = 'claude-sonnet-4-20250514';

interface OnboardingData {
  brand_name: string;
  brand_meaning: string;
  brand_motivation: string;
  brand_description: string;
  how_operates: string;
  products_services: string;
  differentials: string;
  audience_class: string;
  audience_age: string;
  audience_gender: string;
  who_are_clients: string;
  client_perception: string;
  keywords: string;
  brand_personality_yes: string;
  brand_personality_no: string;
  brands_admire: string;
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'Anthropic API key não configurada' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let responses: OnboardingData;
  try {
    const body = await req.json() as { responses: OnboardingData };
    responses = body.responses;
  } catch {
    return new Response(JSON.stringify({ error: 'Body inválido' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
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

  const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!anthropicRes.ok) {
    const err = await anthropicRes.text();
    return new Response(JSON.stringify({ error: err }), {
      status: anthropicRes.status,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const data = await anthropicRes.json() as { content: { type: string; text?: string }[] };
  const raw = data.content.map((c) => c.text ?? '').join('');
  const cleaned = raw.replace(/```json\n?|```\n?/g, '').trim();

  return new Response(cleaned, {
    headers: { 'Content-Type': 'application/json' },
  });
}
