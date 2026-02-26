import type { OnboardingStep } from '../../constants/onboarding';

interface QuestionBlockProps {
  step: OnboardingStep;
  answers: Record<string, string>;
  onChange: (id: string, value: string) => void;
}

export function QuestionBlock({ step, answers, onChange }: QuestionBlockProps) {
  return (
    <div className="question-block">
      {/* Header do bloco */}
      <div className="block-header">
        <div className="block-icon-box">{step.icon}</div>
        <div className="block-category">{step.category}</div>
      </div>

      {/* Perguntas */}
      <div className="questions-list">
        {step.questions.map((q, idx) => (
          <div key={q.id} className="question-item">
            <label className="question-label">
              <span className="question-number">{idx + 1}.</span>
              {q.label}
              {q.required && <span className="question-required"> *</span>}
            </label>
            <textarea
              className="question-textarea"
              value={answers[q.id] ?? ''}
              onChange={(e) => onChange(q.id, e.target.value)}
              placeholder="Digite sua resposta..."
              rows={3}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
