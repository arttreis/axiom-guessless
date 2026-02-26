import { Link } from 'react-router-dom';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const PLANS = [
  {
    id: 'starter' as const,
    name: 'Starter',
    desc: 'Para criadores e marcas pessoais que estão começando.',
    price: 'R$97',
    period: '/mês',
    posts: '30 posts/mês',
    platforms: '2 plataformas',
    support: 'Suporte por email',
    extras: [] as string[],
    highlight: false,
  },
  {
    id: 'pro' as const,
    name: 'Pro',
    desc: 'Para marcas que querem crescer com consistência e estratégia.',
    price: 'R$197',
    period: '/mês',
    posts: '100 posts/mês',
    platforms: 'Todas as plataformas',
    support: 'Suporte prioritário',
    extras: ['Análise de concorrentes'],
    highlight: true,
  },
  {
    id: 'agency' as const,
    name: 'Agency',
    desc: 'Para agências que gerenciam múltiplas marcas em escala.',
    price: 'R$497',
    period: '/mês',
    posts: 'Posts ilimitados',
    platforms: 'Todas as plataformas',
    support: 'Gerente dedicado',
    extras: ['Multi-marca', 'Acesso à API'],
    highlight: false,
  },
];

export function Pricing() {
  const headerRef = useScrollAnimation<HTMLDivElement>();
  const gridRef = useScrollAnimation<HTMLDivElement>();

  return (
    <section className="pricing-section">
      <div ref={headerRef} className="section-header scroll-reveal">
        <div className="section-label">PLANOS</div>
        <h2 className="section-title">
          Escolha seu plano e comece
          <br />
          <span className="text-gradient">com 7 dias grátis</span>
        </h2>
      </div>

      <div ref={gridRef} className="pricing-grid scroll-reveal-grid">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`pricing-card ${plan.highlight ? 'pricing-card--highlight' : ''}`}
          >
            {plan.highlight && <div className="pricing-popular">Mais popular ⭐</div>}

            <div className="pricing-header">
              <div className="pricing-name">{plan.name}</div>
              <div className="pricing-plan-desc">{plan.desc}</div>
              <div className="pricing-price">
                <span className="price-value">{plan.price}</span>
                <span className="price-period">{plan.period}</span>
              </div>
            </div>

            <ul className="pricing-features">
              <li className="pricing-feature">✓ {plan.posts}</li>
              <li className="pricing-feature">✓ {plan.platforms}</li>
              <li className="pricing-feature">✓ {plan.support}</li>
              {plan.extras.map((extra) => (
                <li key={extra} className="pricing-feature pricing-feature--extra">
                  ✓ {extra}
                </li>
              ))}
            </ul>

            <Link
              to={`/checkout?plan=${plan.id}`}
              className={plan.highlight ? 'btn-primary btn-full' : 'btn-outline btn-full'}
            >
              Começar com {plan.name} →
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
