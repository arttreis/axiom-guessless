import { useAdminUsers } from '../../hooks/useAdminUsers';
import { GlobalMetrics } from '../../components/admin/GlobalMetrics';

export function AdminOverview() {
  const { stats, loading } = useAdminUsers();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-icon animate-float">✦</div>
        <p className="loading-text">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-content animate-fade-up">
      <div className="dashboard-header">
        <div className="dashboard-label">ADMIN</div>
        <h1 className="dashboard-brand-name">Visão Geral</h1>
      </div>

      <GlobalMetrics stats={stats} />
    </div>
  );
}
