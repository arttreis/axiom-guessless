import { getArchetype } from '../../constants/archetypes';
import type { ArchetypeResult } from '../../types';

interface ArchetypeHeroProps {
  result: ArchetypeResult;
}

export function ArchetypeHero({ result }: ArchetypeHeroProps) {
  const arch = getArchetype(result.primary_archetype);
  if (!arch) return null;

  const score = result.scores[result.primary_archetype] ?? 0;

  return (
    <div
      className="archetype-hero-card"
      style={{
        background: `linear-gradient(135deg, ${arch.color}14 0%, ${arch.color}06 100%)`,
        borderColor: `${arch.color}55`,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
      {/* Glow blob */}
      <div
        className="archetype-hero-blob"
        style={{ background: `radial-gradient(circle, ${arch.color}40 0%, transparent 65%)` }}
      />

      <div className="archetype-hero-content">
        {/* Ícone */}
        <div
          className="archetype-hero-icon"
          style={{
            background: `${arch.color}22`,
            borderColor: `${arch.color}44`,
            color: arch.color,
            boxShadow: `0 0 24px ${arch.color}30`,
          }}
        >
          {arch.icon}
        </div>

        {/* Info */}
        <div className="archetype-hero-info">
          <div className="archetype-hero-badge">Arquétipo Principal</div>
          <h2 className="archetype-hero-name" style={{ color: arch.color }}>
            {result.primary_archetype}
          </h2>
          <p className="archetype-hero-desc">{arch.desc}</p>
          <div className="archetype-hero-tags">
            {['Conteúdo autêntico', 'Comunicação estratégica', 'Posicionamento único'].map(tag => (
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
          <div className="score-ring" style={{ '--score-color': arch.color } as React.CSSProperties}>
            <svg viewBox="0 0 64 64" className="score-svg">
              <circle cx="32" cy="32" r="26" fill="none" stroke={`${arch.color}28`} strokeWidth="6" />
              <circle
                cx="32" cy="32" r="26"
                fill="none"
                stroke={arch.color}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 26 * score / 100} ${2 * Math.PI * 26}`}
                strokeDashoffset={2 * Math.PI * 26 * 0.25}
                style={{ filter: `drop-shadow(0 0 8px ${arch.color}99)` }}
              />
            </svg>
            <div className="score-inner">
              <div className="score-value" style={{ color: arch.color }}>{score}%</div>
              <div className="score-label">Afinidade</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
