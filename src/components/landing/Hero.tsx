import { Link } from 'react-router-dom';

export function Hero() {
  return (
    <section className="hero-section">
      {/* Blobs de fundo animados */}
      <div className="hero-blob blob-orange" />
      <div className="hero-blob blob-purple" />
      <div className="hero-blob blob-blue" />

      <div className="hero-content">
        {/* Badge */}
        <div className="hero-badge animate-fade-up" style={{ animationDelay: '0s' }}>
          ✦ Geração de Conteúdo com IA
        </div>

        {/* Título */}
        <h1 className="hero-title animate-fade-up" style={{ animationDelay: '0.1s' }}>
          Sua marca tem uma
          <br />
          <span className="hero-gradient-text">identidade única.</span>
          <br />
          Use-a.
        </h1>

        {/* Subtítulo */}
        <p className="hero-subtitle animate-fade-up" style={{ animationDelay: '0.2s' }}>
          Descubra o arquétipo da sua marca baseado nos 12 arquétipos de Carl Jung e gere
          conteúdo autêntico para Instagram, LinkedIn, Twitter/X e YouTube — tudo com IA.
        </p>

        {/* CTAs */}
        <div className="hero-ctas animate-fade-up" style={{ animationDelay: '0.3s' }}>
          <Link to="/checkout" className="btn-primary btn-lg">
            Começar gratuitamente →
          </Link>
          <Link to="/dashboard" className="btn-outline btn-lg">
            Ver demo
          </Link>
        </div>

        {/* Stats bar */}
        <div className="hero-stats animate-fade-up" style={{ animationDelay: '0.38s' }}>
          <div className="hero-stat">
            <span className="hero-stat-value">12</span>
            <span className="hero-stat-label">Arquétipos</span>
          </div>
          <div className="hero-stat-sep" />
          <div className="hero-stat">
            <span className="hero-stat-value">4</span>
            <span className="hero-stat-label">Plataformas</span>
          </div>
          <div className="hero-stat-sep" />
          <div className="hero-stat">
            <span className="hero-stat-value">5 min</span>
            <span className="hero-stat-label">Setup</span>
          </div>
        </div>

        {/* Rodapé */}
        <p className="hero-footer animate-fade-up" style={{ animationDelay: '0.5s' }}>
          7 dias grátis · Sem cartão de crédito · Cancele quando quiser
        </p>
      </div>
    </section>
  );
}
