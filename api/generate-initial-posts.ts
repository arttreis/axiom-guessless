export const config = { runtime: 'edge' };

const ANTHROPIC_MODEL = 'claude-sonnet-4-20250514';

const POST_TYPES = ['Carrossel', 'Carrossel', 'Carrossel', 'Carrossel', 'Reels', 'Reels', 'Reels', 'Post', 'Post', 'Post', 'Story', 'Story'];

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

  let body: { onboarding: Record<string, string>; archetypeResult: { primary_archetype: string; secondary_archetype: string; analysis: string } };
  try {
    body = await req.json() as typeof body;
  } catch {
    return new Response(JSON.stringify({ error: 'Body inválido' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { onboarding, archetypeResult } = body;

  const prompt = `Você é um especialista em marketing digital e criação de conteúdo para Instagram.

CONTEXTO DA MARCA:
- Nome: ${onboarding.brand_name ?? ''}
- Descrição: ${onboarding.brand_description ?? ''}
- Arquétipo principal: ${archetypeResult.primary_archetype}
- Arquétipo secundário: ${archetypeResult.secondary_archetype}
- Análise: ${archetypeResult.analysis}
- Palavras-chave: ${onboarding.keywords ?? ''}
- Tom de voz (SIM): ${onboarding.brand_personality_yes ?? ''}
- Tom de voz (NÃO): ${onboarding.brand_personality_no ?? ''}
- Público: ${onboarding.audience_age ?? ''}, ${onboarding.audience_gender ?? ''}, ${onboarding.audience_class ?? ''}
- Diferencial: ${onboarding.differentials ?? ''}
- Produtos/Serviços: ${onboarding.products_services ?? ''}

Crie exatamente 12 posts para Instagram totalmente personalizados para esta marca.

Distribuição obrigatória: 4 Carrosséis, 3 Reels, 3 Posts, 2 Stories.
Tipos nessa ordem exata: ${POST_TYPES.join(', ')}.

FORMATO DE CONTEÚDO POR TIPO:

Para CARROSSEL, o campo "content" deve seguir exatamente esta estrutura de slides:
CAPA
Título: [título impactante que gera curiosidade]
Subtítulo: [frase de apoio que complementa o título]

SLIDE 2
Título: [desenvolvimento do tema]
Texto: [explicação ou dado relevante]
Subtítulo: [frase de reforço ou dado]

SLIDE 3
Título: [aprofundamento ou virada]
Texto: [conteúdo principal]

SLIDE FINAL (CTA)
Título: [mensagem de fechamento]
Em destaque: [frase memorável da marca]
CTA: [chamada para ação clara]

LEGENDA
[Texto completo da legenda para publicar na descrição do post, 3-5 parágrafos, tom da marca, sem hashtags aqui]

Para REELS, o campo "content" deve ser o roteiro narrado:
GANCHO (0-3s): [frase de abertura impactante]
DESENVOLVIMENTO: [conteúdo principal em bullets curtos]
CTA FINAL: [chamada para ação]
LEGENDA: [texto da legenda para a descrição]

Para POST e STORY, o campo "content" deve ser o texto completo pronto para publicar, com emojis e quebras de linha naturais, seguido de:
LEGENDA: [se aplicável, o texto da legenda]

Regras gerais:
- Cada post deve refletir o arquétipo ${archetypeResult.primary_archetype} e o negócio real da marca
- Use o nome da marca (${onboarding.brand_name ?? 'a marca'}) naturalmente quando fizer sentido
- Conteúdo variado: educativo, inspiracional, bastidores, depoimentos, produto, storytelling
- Hashtags específicas para o nicho da marca (não genéricas)
- Dicas de publicação práticas e específicas

Responda APENAS com JSON válido, sem markdown:
{
  "posts": [
    {
      "title": "título chamativo do post",
      "content": "estrutura completa conforme o tipo (Carrossel/Reels/Post/Story)",
      "type": "Carrossel|Reels|Post|Story",
      "archetype": "arquétipo predominante neste post",
      "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"],
      "tip": "dica prática de quando e como publicar este post"
    }
  ]
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
      max_tokens: 4000,
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
