interface GlobalMetricsProps {
  stats: {
    total: number;
    trial: number;
    starter: number;
    pro: number;
    agency: number;
  };
}

export function GlobalMetrics({ stats }: GlobalMetricsProps) {
  const items = [
    { label: 'Total de usuários', value: stats.total, icon: '◈' },
    { label: 'Trial', value: stats.trial, icon: '⏱' },
    { label: 'Starter', value: stats.starter, icon: '✦' },
    { label: 'Pro', value: stats.pro, icon: '★' },
    { label: 'Agency', value: stats.agency, icon: '⬡' },
  ];

  return (
    <div className="admin-metrics-grid">
      {items.map((item) => (
        <div key={item.label} className="metrics-card">
          <div className="metrics-card-icon">{item.icon}</div>
          <div className="metrics-card-body">
            <div className="metrics-card-value">{item.value}</div>
            <div className="metrics-card-label">{item.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
