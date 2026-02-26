import { ARCHETYPES } from '../../constants/archetypes';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

export function ArchetypesPreview() {
  const headerRef = useScrollAnimation<HTMLDivElement>();
  const gridRef = useScrollAnimation<HTMLDivElement>();

  return (
    <section className="archetypes-section">
      <div ref={headerRef} className="section-header scroll-reveal">
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

      <div ref={gridRef} className="archetypes-grid scroll-reveal-grid">
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
