import { ARCHETYPES } from '../../constants/archetypes';

export function ArchetypesPreview() {
  return (
    <section className="archetypes-section">
      <div className="section-header">
        <div className="section-label">OS 12 ARQUÉTIPOS</div>
        <h2 className="section-title">
          Qual é a personalidade
          <br />
          <span className="text-gradient">da sua marca?</span>
        </h2>
        <p className="section-subtitle">
          Os arquétipos de Carl Jung revelam a identidade profunda de marcas que criam conexões genuínas.
        </p>
      </div>

      <div className="archetypes-grid">
        {ARCHETYPES.map((arch) => (
          <div
            key={arch.name}
            className="archetype-card"
            style={{ '--arch-color': arch.color } as React.CSSProperties}
          >
            <div className="archetype-icon">{arch.icon}</div>
            <div className="archetype-name">{arch.name}</div>
            <div className="archetype-desc">{arch.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
