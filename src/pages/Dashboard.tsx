import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArchetypeHero } from '../components/dashboard/ArchetypeHero';
import { ArchetypeGrid } from '../components/dashboard/ArchetypeGrid';
import { BrandProfile } from '../components/dashboard/BrandProfile';
import { useOnboarding } from '../hooks/useOnboarding';
import { usePosts } from '../hooks/usePosts';

export function Dashboard() {
  const navigate = useNavigate();
  const { onboarding, archetypeResult, loading } = useOnboarding();
  const { insertSamplePosts } = usePosts();

  useEffect(() => {
    if (!loading && !onboarding) {
      navigate('/onboarding', { replace: true });
    }
  }, [loading, onboarding, navigate]);

  useEffect(() => {
    if (onboarding) {
      void insertSamplePosts();
    }
  }, [onboarding, insertSamplePosts]);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-icon animate-float">✦</div>
        <p className="loading-text">Carregando relatório...</p>
      </div>
    );
  }

  if (!onboarding || !archetypeResult) {
    return null;
  }

  const brandName = (onboarding as Record<string, string>).brand_name ?? 'Sua Marca';
  const keywords = (onboarding as Record<string, string>).keywords ?? '';

  return (
    <div className="dashboard-content animate-fade-up">
      {/* Header */}
      <div className="dashboard-header">
        <div className="dashboard-label">RELATÓRIO DE MARCA</div>
        <h1 className="dashboard-brand-name">{brandName}</h1>
        {keywords && (
          <div className="dashboard-keywords">
            {keywords.split(/[,;]+/).map((kw) => kw.trim()).filter(Boolean).map((kw) => (
              <span key={kw} className="keyword-tag">{kw}</span>
            ))}
          </div>
        )}
      </div>

      {/* Hero do arquétipo principal */}
      <ArchetypeHero result={archetypeResult} />

      {/* Grid dos 12 arquétipos */}
      <ArchetypeGrid result={archetypeResult} />

      {/* Perfil da marca + análise da IA */}
      <BrandProfile onboarding={onboarding} result={archetypeResult} />
    </div>
  );
}
