export interface OnboardingQuestion {
  id: string;
  label: string;
  required: boolean;
}

export interface OnboardingStep {
  id: string;
  category: string;
  icon: string;
  questions: OnboardingQuestion[];
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'identification',
    category: 'Identificação e Propósito',
    icon: '✦',
    questions: [
      { id: 'brand_name',        label: 'Qual o nome da sua marca/empresa?',                                   required: true },
      { id: 'brand_meaning',     label: 'O que ela significa para você?',                                      required: true },
      { id: 'brand_motivation',  label: 'Quais motivos te levaram a abrir sua empresa? (Cite os motivos)',    required: true },
      { id: 'brand_description', label: 'Do que se trata sua marca/empresa?',                                  required: true },
    ],
  },
  {
    id: 'operations',
    category: 'Operação e Mercado',
    icon: '◈',
    questions: [
      { id: 'how_operates',      label: 'Como ela atua?',                                             required: true },
      { id: 'where_sells',       label: 'Onde sua empresa vende? Online ou offline?',                 required: true },
      { id: 'products_services', label: 'Quais produtos ou serviços sua marca/empresa oferece?',      required: true },
      { id: 'current_moment',    label: 'Qual o momento atual da marca/empresa?',                     required: false },
      { id: 'differentials',     label: 'Qual o diferencial dos seus produtos?',                      required: true },
    ],
  },
  {
    id: 'competition',
    category: 'Análise de Concorrência',
    icon: '⬡',
    questions: [
      { id: 'competitors',       label: 'Sua empresa tem concorrentes? Caso sim, cite-os.',                          required: false },
      { id: 'competitors_offer', label: 'Suas concorrentes vendem algo que sua empresa não oferece?',                 required: false },
    ],
  },
  {
    id: 'audience',
    category: 'Público-Alvo',
    icon: '◎',
    questions: [
      { id: 'audience_class',    label: 'Qual o público-alvo da sua marca/empresa? (Classes A, B, C, D)',            required: true },
      { id: 'audience_gender',   label: 'Qual o gênero do seu público-alvo?',                                         required: true },
      { id: 'audience_age',      label: 'Qual a faixa etária do seu público-alvo?',                                   required: true },
      { id: 'who_are_clients',   label: 'Quem são seus clientes?',                                                    required: true },
      { id: 'client_perception', label: 'Como você gostaria que seus clientes falassem da sua empresa?',             required: true },
    ],
  },
  {
    id: 'branding',
    category: 'Branding e Identidade Visual',
    icon: '❋',
    questions: [
      { id: 'keywords',              label: '3 palavras-chave que traduzem a sua marca.',                                    required: true },
      { id: 'brand_personality_yes', label: 'Se sua empresa fosse uma pessoa, como ela seria? (Ex: Séria, Alegre, Moderna...)', required: true },
      { id: 'brand_personality_no',  label: 'Se sua empresa fosse uma pessoa, como ela NÃO seria?',                           required: true },
      { id: 'colors_yes',            label: 'Há cores que você quer? Se sim, quais?',                                         required: false },
      { id: 'colors_no',             label: 'Há cores que você NÃO quer? Se sim, quais?',                                     required: false },
      { id: 'brands_admire',         label: 'Cite empresas que você goste.',                                                  required: false },
    ],
  },
];
