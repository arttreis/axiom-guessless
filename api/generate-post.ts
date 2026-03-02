export const config = { runtime: 'edge' };

const ANTHROPIC_MODEL = 'claude-sonnet-4-20250514';

interface OnboardingData {
  brand_name: string;
  brand_description: string;
  keywords: string;
  brand_personality_yes: string;
  brand_personality_no: string;
  audience_age: string;
  audience_gender: string;
  audience_class: string;
  differentials: string;
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

  let body: { userPrompt: string; brandContext: OnboardingData; primaryArchetype: string };
  try {
    body = await req.json() as typeof body;
  } catch {
    return new Response(JSON.stringify({ error: 'Body inválido' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { userPrompt, brandContext, primaryArchetype } = body;

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
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
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
