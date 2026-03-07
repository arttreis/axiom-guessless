import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { ARCHETYPES } from '../../constants/archetypes';
import type { Archetype } from '../../constants/archetypes';
import { ArchetypeIcon } from '../../constants/archetypeIcons';
import type { ArchetypeResult } from '../../types';

interface ArchetypeGridProps {
  result: ArchetypeResult;
}

export function ArchetypeGrid({ result }: ArchetypeGridProps) {
  const [selected, setSelected] = useState<Archetype | null>(null);

  const sorted = [...ARCHETYPES].sort(
    (a, b) => (result.scores[b.name] ?? 0) - (result.scores[a.name] ?? 0)
  );

  return (
    <>
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
                onClick={() => setSelected(arch)}
              >
                {isPrimary && <div className="arch-primary-dot" style={{ background: arch.color }} />}

                <div className="arch-icon" style={{ color: arch.color }}>
                  <ArchetypeIcon name={arch.name} size={22} color={arch.color} />
                </div>
                <div className="arch-name">{arch.name}</div>
                {isSecondary && <div className="arch-secondary-badge">2º</div>}

                <div className="arch-spacer" />

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

      {selected && createPortal(
        <div className="arch-modal-overlay" onClick={() => setSelected(null)}>
          <div className="arch-modal" onClick={(e) => e.stopPropagation()}>
            <button className="arch-modal-close" onClick={() => setSelected(null)}>
              <X size={18} />
            </button>
            <div className="arch-modal-icon">
              <ArchetypeIcon name={selected.name} size={36} color={selected.color} />
            </div>
            <h3 className="arch-modal-name">{selected.name}</h3>
            <p className="arch-modal-desc">{selected.desc}</p>
            <div className="arch-modal-score">
              Sua afinidade: <strong>{result.scores[selected.name] ?? 0}%</strong>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
