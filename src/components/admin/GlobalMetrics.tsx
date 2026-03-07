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
  { key: 'total',   label: 'Total',   icon: Users    },
  { key: 'trial',   label: 'Trial',   icon: Clock    },
  { key: 'starter', label: 'Starter', icon: Zap      },
  { key: 'pro',     label: 'Pro',     icon: Star     },
  { key: 'agency',  label: 'Agency',  icon: Building2 },
] as const;

export function GlobalMetrics({ stats }: GlobalMetricsProps) {
  return (
    <div className="admin-metrics-grid">
      {ITEMS.map(({ key, label, icon: Icon }) => (
        <div key={key} className="metrics-card">
          <div className="metrics-card-icon">
            <Icon size={20} />
          </div>
          <div className="metrics-card-body">
            <div className="metrics-card-value">{stats[key]}</div>
            <div className="metrics-card-label">{label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
