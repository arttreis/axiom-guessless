import { FileText, CheckCircle, FileEdit, Clock } from 'lucide-react';
import { useAnalytics } from '../hooks/useAnalytics';
import { MetricsCard } from '../components/analytics/MetricsCard';
import { PlatformBreakdown } from '../components/analytics/PlatformBreakdown';
import { PostPerformance } from '../components/analytics/PostPerformance';

export function Analytics() {
  const { data, loading } = useAnalytics();

  if (loading) {
    return (
      <div className="dashboard-content animate-fade-up">
        <div className="skeleton-header" />
        <div className="metrics-grid">
          {[1,2,3,4].map(i => <div key={i} className="skeleton-card" />)}
        </div>
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
        <MetricsCard label="Total de Posts"  value={data.totalPosts}      icon={FileText}    color="#3D6FF8" />
        <MetricsCard label="Publicados"      value={data.publishedPosts}  icon={CheckCircle} color="#3D6FF8" />
        <MetricsCard label="Rascunhos"       value={data.draftPosts}      icon={FileEdit}    color="#6B7FFF" />
        <MetricsCard label="Agendados"       value={data.scheduledPosts}  icon={Clock}       color="#9BA8FF" />
      </div>

      <div className="charts-grid">
        <PlatformBreakdown byPlatform={data.byPlatform} total={data.totalPosts} />
        <PostPerformance posts={data.recentPosts} />
      </div>
    </div>
  );
}
