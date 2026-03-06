import { useAnalytics } from '../hooks/useAnalytics';
import { MetricsCard } from '../components/analytics/MetricsCard';
import { PlatformBreakdown } from '../components/analytics/PlatformBreakdown';
import { PostPerformance } from '../components/analytics/PostPerformance';

export function Analytics() {
  const { data, loading } = useAnalytics();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-icon animate-float">✦</div>
        <p className="loading-text">Carregando analytics...</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="dashboard-content animate-fade-up">
      <div className="dashboard-header">
        <div className="dashboard-label">ANALYTICS</div>
        <h1 className="dashboard-brand-name">Seus Dados</h1>
      </div>

      <div className="metrics-grid">
        <MetricsCard label="Total de Posts" value={data.totalPosts} icon="◈" />
        <MetricsCard label="Publicados" value={data.publishedPosts} icon="★" />
        <MetricsCard label="Rascunhos" value={data.draftPosts} icon="✦" />
        <MetricsCard label="Agendados" value={data.scheduledPosts} icon="⏱" />
      </div>

      <div className="charts-grid">
        <PlatformBreakdown byPlatform={data.byPlatform} total={data.totalPosts} />
        <PostPerformance posts={data.recentPosts} />
      </div>
    </div>
  );
}
