interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const percent = Math.round(((currentStep + 1) / totalSteps) * 100);

  return (
    <div className="progress-container">
      {/* Linha de texto */}
      <div className="progress-text-row">
        <span className="progress-label">Etapa {currentStep + 1} de {totalSteps}</span>
        <span className="progress-percent">{percent}%</span>
      </div>

      {/* Barra principal */}
      <div className="progress-bar-track">
        <div
          className="progress-bar-fill"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Segmentos */}
      <div className="progress-segments">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`progress-segment ${i <= currentStep ? 'progress-segment--active' : ''}`}
          />
        ))}
      </div>
    </div>
  );
}
