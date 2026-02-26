import type { OnboardingData, ArchetypeResult } from '../../types';

interface BrandProfileProps {
  onboarding: Partial<OnboardingData>;
  result: ArchetypeResult;
}

export function BrandProfile({ onboarding, result }: BrandProfileProps) {
  const cards = [
    {
      icon: '◎',
      title: 'Propósito',
      value: onboarding.brand_motivation ?? '—',
    },
    {
      icon: '◉',
      title: 'Público-Alvo',
      value: [onboarding.audience_class, onboarding.audience_age, onboarding.audience_gender]
        .filter(Boolean)
        .join(' · ') || '—',
    },
    {
      icon: '✦',
      title: 'Diferencial',
      value: onboarding.differentials ?? '—',
    },
    {
      icon: '❋',
      title: 'Tom de Voz',
      value: onboarding.brand_personality_yes ?? '—',
    },
  ];

  return (
    <div className="brand-profile-section">
      <h3 className="section-subtitle-sm">Perfil da Marca</h3>
      <div className="brand-profile-grid">
        {cards.map((card) => (
          <div key={card.title} className="brand-card">
            <div className="brand-card-icon">{card.icon}</div>
            <div className="brand-card-title">{card.title}</div>
            <div className="brand-card-value">{card.value}</div>
          </div>
        ))}
      </div>

      {/* Análise da IA */}
      {result.analysis && (
        <div className="ai-analysis-card">
          <div className="ai-analysis-header">
            <span className="ai-analysis-icon">✦</span>
            <span className="ai-analysis-title">Análise da sua marca</span>
          </div>
          <p className="ai-analysis-text">{result.analysis}</p>
        </div>
      )}
    </div>
  );
}
