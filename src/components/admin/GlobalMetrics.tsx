import { Users, Clock, Zap, Star, Building2 } from 'lucide-react';

interface GlobalMetricsProps {
  stats: {
    total: number;
    trial: number;
    starter: number;
    pro: number;
    agency: number;
  };
}

const ITEMS = [
  { key: 'total',   label: 'Total',   icon: Users,     color: '#3D6FF8' },
  { key: 'trial',   label: 'Trial',   icon: Clock,     color: '#FF922B' },
  { key: 'starter', label: 'Starter', icon: Zap,       color: '#7C5CBF' },
  { key: 'pro',     label: 'Pro',     icon: Star,      color: '#1A936F' },
  { key: 'agency',  label: 'Agency',  icon: Building2, color: '#3D6FF8' },
] as const;

export function GlobalMetrics({ stats }: GlobalMetricsProps) {
  return (
    <div className="admin-metrics-grid">
      {ITEMS.map(({ key, label, icon: Icon, color }) => (
        <div key={key} className="metrics-card">
          <div className="metrics-card-icon" style={{ color }}>
            <Icon size={20} />
          </div>
          <div className="metrics-card-body">
            <div className="metrics-card-value" style={{ color }}>{stats[key]}</div>
            <div className="metrics-card-label">{label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
