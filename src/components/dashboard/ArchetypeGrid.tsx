import { ARCHETYPES } from '../../constants/archetypes';
import type { ArchetypeResult } from '../../types';

interface ArchetypeGridProps {
  result: ArchetypeResult;
}

export function ArchetypeGrid({ result }: ArchetypeGridProps) {
  const sorted = [...ARCHETYPES].sort(
    (a, b) => (result.scores[b.name] ?? 0) - (result.scores[a.name] ?? 0)
  );

  return (
    <div className="archetype-section">
      <h3 className="section-subtitle-sm">Todos os Arquétipos</h3>
      <div className="archetype-grid-12">
        {sorted.map((arch) => {
          const score = result.scores[arch.name] ?? 0;
          const isPrimary = arch.name === result.primary_archetype;
          const isSecondary = arch.name === result.secondary_archetype;

          return (
            <div
              key={arch.name}
              className={`arch-card ${isPrimary ? 'arch-card--primary' : ''}`}
              style={isPrimary ? { borderColor: `${arch.color}66` } : {}}
            >
              {isPrimary && <div className="arch-primary-dot" style={{ background: arch.color }} />}

              <div className="arch-icon" style={{ color: arch.color }}>
                {arch.icon}
              </div>
              <div className="arch-name">{arch.name}</div>
              {isSecondary && <div className="arch-secondary-badge">2º</div>}

              {/* Barra de progresso */}
              <div className="arch-progress-track">
                <div
                  className="arch-progress-fill"
                  style={{ width: `${score}%`, background: arch.color }}
                />
              </div>
              <div className="arch-score">{score}%</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
