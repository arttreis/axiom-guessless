import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProgressBar } from '../components/onboarding/ProgressBar';
import { QuestionBlock } from '../components/onboarding/QuestionBlock';
import { ONBOARDING_STEPS } from '../constants/onboarding';
import { analyzeArchetypes } from '../lib/anthropic';
import { useOnboardingStore } from '../store/onboardingStore';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import { showToast } from '../components/Toast';
import type { OnboardingData } from '../types';

function exportToCSV(data: Record<string, string>, brandName: string) {
  const headers = Object.keys(data).join(',');
  const values = Object.values(data).map((v) => `"${v.replace(/"/g, '""')}"`).join(',');
  const csv = `${headers}\n${values}`;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `axiom_${brandName.replace(/\s/g, '_')}_${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function Onboarding() {
  const navigate = useNavigate();
  const { currentStep, answers, nextStep, prevStep, setAnswer, setArchetypeResult } = useOnboardingStore();
  const user = useAuthStore((s) => s.user);
  const [loading, setLoading] = useState(false);

  const step = ONBOARDING_STEPS[currentStep];
  const isLast = currentStep === ONBOARDING_STEPS.length - 1;

  const canProceed = () => {
    return step.questions
      .filter((q) => q.required)
      .every((q) => (answers as Record<string, string>)[q.id]?.trim());
  };

  const handleNext = async () => {
    if (!canProceed()) {
      showToast('error', 'Por favor, preencha os campos obrigatórios.');
      return;
    }
    if (!isLast) {
      nextStep();
      return;
    }

    setLoading(true);
    try {
      const result = await analyzeArchetypes(answers as OnboardingData);

      setArchetypeResult(result);

      if (user) {
        const completedAt = new Date().toISOString();

        await Promise.all([
          supabase.from('onboarding_responses').upsert({
            user_id: user.id,
            ...answers,
            completed_at: completedAt,
          }),
          supabase.from('archetype_results').upsert({
            user_id: user.id,
            scores: result.scores,
            primary_archetype: result.primary_archetype,
            secondary_archetype: result.secondary_archetype,
            analysis: result.analysis,
            generated_at: completedAt,
          }),
        ]);
      }

      exportToCSV(answers as Record<string, string>, (answers.brand_name as string) ?? 'marca');

      showToast('success', 'Análise concluída! Redirecionando...');
      navigate('/dashboard');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao processar onboarding.';
      showToast('error', msg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-icon animate-float">✦</div>
        <p className="loading-text">Analisando sua marca...</p>
        <p className="loading-sub">Identificando seus arquétipos com IA</p>
      </div>
    );
  }

  return (
    <div className="onboarding-page animate-fade-up">
      <div className="onboarding-container">
        {/* Logo */}
        <div className="onboarding-logo">AXIOM</div>

        {/* Barra de progresso */}
        <ProgressBar currentStep={currentStep} totalSteps={ONBOARDING_STEPS.length} />

        {/* Bloco de perguntas */}
        <QuestionBlock
          step={step}
          answers={answers as Record<string, string>}
          onChange={setAnswer}
        />

        {/* Navegação */}
        <div className="onboarding-nav">
          {currentStep > 0 && (
            <button className="btn-outline" onClick={prevStep} disabled={loading}>
              ← Voltar
            </button>
          )}
          <button
            className="btn-primary"
            onClick={handleNext}
            disabled={loading || !canProceed()}
            style={{ marginLeft: 'auto' }}
          >
            {isLast ? 'Concluir e ver relatório →' : 'Próxima etapa →'}
          </button>
        </div>
      </div>
    </div>
  );
}
