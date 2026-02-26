import { getArchetype } from '../../constants/archetypes';
import type { ArchetypeResult } from '../../types';

interface ArchetypeHeroProps {
  result: ArchetypeResult;
}

export function ArchetypeHero({ result }: ArchetypeHeroProps) {
  const arch = getArchetype(result.primary_archetype);
  if (!arch) return null;

  return (
    <div
      className="archetype-hero-card"
      style={{
        background: `linear-gradient(135deg, ${arch.color}18 0%, ${arch.color}08 100%)`,
        borderColor: `${arch.color}66`,
      }}
    >
      {/* Blob decorativo */}
      <div
        className="archetype-hero-blob"
        style={{ background: `radial-gradient(circle, ${arch.color}33 0%, transparent 70%)` }}
      />

      <div className="archetype-hero-content">
        {/* Ícone */}
        <div
          className="archetype-hero-icon"
          style={{
            background: `${arch.color}22`,
            borderColor: `${arch.color}44`,
            color: arch.color,
          }}
        >
          {arch.icon}
        </div>

        {/* Info */}
        <div className="archetype-hero-info">
          <div className="archetype-hero-badge">Seu Arquétipo Principal</div>
          <h2 className="archetype-hero-name" style={{ color: arch.color }}>
            {result.primary_archetype}
          </h2>
          <p className="archetype-hero-desc">{arch.desc}</p>

          <div className="archetype-hero-tags">
            {['Conteúdo autêntico', 'Comunicação estratégica', 'Posicionamento único'].map((tag) => (
              <span
                key={tag}
                className="archetype-tag"
                style={{ background: `${arch.color}18`, color: arch.color, borderColor: `${arch.color}33` }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Score */}
        <div className="archetype-hero-score">
          <div className="score-value" style={{ color: arch.color }}>
            {result.scores[result.primary_archetype] ?? 0}%
          </div>
          <div className="score-label">Afinidade</div>
        </div>
      </div>
    </div>
  );
}
