import { Check } from 'lucide-react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const STEP_LABELS = ['Marca', 'Mercado', 'Concorrência', 'Público', 'Identidade'];

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const percent = Math.round(((currentStep + 1) / totalSteps) * 100);

  return (
    <div className="progress-container">
      {/* Stepper */}
      <div className="progress-steps">
        {Array.from({ length: totalSteps }).map((_, i) => {
          const done    = i < currentStep;
          const active  = i === currentStep;
          return (
            <div key={i} className="progress-step-wrap">
              <div className={`progress-step-dot${done ? ' done' : active ? ' active' : ''}`}>
                {done ? <Check size={10} strokeWidth={3} /> : <span>{i + 1}</span>}
              </div>
              {i < totalSteps - 1 && (
                <div className="progress-step-line">
                  <div
                    className="progress-step-line-fill"
                    style={{ width: done ? '100%' : active ? '50%' : '0%' }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Label e percentagem */}
      <div className="progress-text-row">
        <span className="progress-label">
          {STEP_LABELS[currentStep] ?? `Etapa ${currentStep + 1}`}
        </span>
        <span className="progress-percent">{percent}%</span>
      </div>
    </div>
  );
}
