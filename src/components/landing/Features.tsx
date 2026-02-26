const FEATURES = [
  {
    icon: '⬡',
    title: '12 Arquétipos de Marca',
    desc: 'Análise profunda da personalidade da sua marca baseada nos arquétipos de Carl Jung.',
  },
  {
    icon: '✦',
    title: 'Conteúdo com IA',
    desc: 'Gere posts, carrosséis, threads e artigos alinhados com a sua identidade de marca.',
  },
  {
    icon: '◈',
    title: 'Relatório Estratégico',
    desc: 'Entenda seu posicionamento e como comunicar sua marca com autenticidade.',
  },
  {
    icon: '❋',
    title: 'Multi-plataforma',
    desc: 'Instagram, LinkedIn, Twitter/X, YouTube — conteúdo otimizado para cada canal.',
  },
];

export function Features() {
  return (
    <section className="features-section">
      <div className="section-header">
        <div className="section-label">FUNCIONALIDADES</div>
        <h2 className="section-title">
          Tudo que sua marca precisa para
          <br />
          <span className="text-gradient">comunicar com intenção</span>
        </h2>
      </div>

      <div className="features-grid">
        {FEATURES.map((f) => (
          <div key={f.title} className="feature-card">
            <div className="feature-icon">{f.icon}</div>
            <h3 className="feature-title">{f.title}</h3>
            <p className="feature-desc">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
